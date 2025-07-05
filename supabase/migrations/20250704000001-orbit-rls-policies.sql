-- Helper function to check user role
CREATE OR REPLACE FUNCTION public.check_user_role(required_role user_role)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user has minimum role level
CREATE OR REPLACE FUNCTION public.has_minimum_role(minimum_role user_role)
RETURNS BOOLEAN AS $$
DECLARE
  role_levels jsonb := '{"admin": 4, "manager": 3, "editor": 2, "viewer": 1}';
  user_highest_role user_role;
BEGIN
  SELECT role INTO user_highest_role
  FROM public.user_roles
  WHERE user_id = auth.uid()
  ORDER BY (role_levels->role::text)::int DESC
  LIMIT 1;
  
  RETURN (role_levels->user_highest_role::text)::int >= (role_levels->minimum_role::text)::int;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- User Profiles policies
CREATE POLICY "Users can view all profiles"
  ON public.user_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- User Roles policies
CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (check_user_role('admin'));

CREATE POLICY "Users can view roles"
  ON public.user_roles FOR SELECT
  USING (true);

-- Team Invites policies
CREATE POLICY "Managers and admins can create invites"
  ON public.team_invites FOR INSERT
  WITH CHECK (has_minimum_role('manager'));

CREATE POLICY "Managers and admins can view invites"
  ON public.team_invites FOR SELECT
  USING (has_minimum_role('manager'));

CREATE POLICY "Only admins can delete invites"
  ON public.team_invites FOR DELETE
  USING (check_user_role('admin'));

-- System Logs policies
CREATE POLICY "Admins have full access to logs"
  ON public.system_logs FOR ALL
  USING (check_user_role('admin'));

CREATE POLICY "Managers can view logs"
  ON public.system_logs FOR SELECT
  USING (has_minimum_role('manager'));

-- Projects policies
CREATE POLICY "Team members can view their projects"
  ON public.projects FOR SELECT
  USING (
    auth.uid() = ANY(team_members) OR
    auth.uid() = owner_id OR
    has_minimum_role('manager')
  );

CREATE POLICY "Managers and owners can update projects"
  ON public.projects FOR UPDATE
  USING (
    auth.uid() = owner_id OR
    has_minimum_role('manager')
  )
  WITH CHECK (
    auth.uid() = owner_id OR
    has_minimum_role('manager')
  );

CREATE POLICY "Managers can create projects"
  ON public.projects FOR INSERT
  WITH CHECK (has_minimum_role('manager'));

CREATE POLICY "Only admins can delete projects"
  ON public.projects FOR DELETE
  USING (check_user_role('admin'));

-- Settings policies
CREATE POLICY "Anyone can view public settings"
  ON public.settings FOR SELECT
  USING (is_public = true);

CREATE POLICY "Authenticated users can view private settings"
  ON public.settings FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can manage private settings"
  ON public.settings FOR ALL
  USING (
    check_user_role('admin') AND
    NOT is_public
  );

CREATE POLICY "Managers can update public settings"
  ON public.settings FOR UPDATE
  USING (
    has_minimum_role('manager') AND
    is_public
  )
  WITH CHECK (
    has_minimum_role('manager') AND
    is_public
  );

-- Report Schedules policies
CREATE POLICY "Managers can manage report schedules"
  ON public.report_schedules FOR ALL
  USING (has_minimum_role('manager'));

CREATE POLICY "Users can view report schedules"
  ON public.report_schedules FOR SELECT
  USING (auth.role() = 'authenticated');

-- Function to log changes
CREATE OR REPLACE FUNCTION public.log_table_change()
RETURNS TRIGGER AS $$
DECLARE
  old_value jsonb := NULL;
  new_value jsonb := NULL;
  action_type TEXT;
BEGIN
  IF TG_OP = 'DELETE' THEN
    old_value := row_to_json(OLD)::jsonb;
    new_value := NULL;
    action_type := 'delete';
  ELSIF TG_OP = 'UPDATE' THEN
    old_value := row_to_json(OLD)::jsonb;
    new_value := row_to_json(NEW)::jsonb;
    action_type := 'update';
  ELSE
    old_value := NULL;
    new_value := row_to_json(NEW)::jsonb;
    action_type := 'create';
  END IF;

  INSERT INTO public.system_logs (
    user_id,
    action,
    entity,
    entity_id,
    old_value,
    new_value
  ) VALUES (
    auth.uid(),
    action_type,
    TG_TABLE_NAME,
    CASE 
      WHEN TG_OP = 'DELETE' THEN (OLD.id)::uuid 
      ELSE (NEW.id)::uuid 
    END,
    old_value,
    new_value
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit log triggers
CREATE TRIGGER projects_audit_log
  AFTER INSERT OR UPDATE OR DELETE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.log_table_change();

CREATE TRIGGER team_invites_audit_log
  AFTER INSERT OR UPDATE OR DELETE ON public.team_invites
  FOR EACH ROW EXECUTE FUNCTION public.log_table_change();

CREATE TRIGGER settings_audit_log
  AFTER UPDATE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION public.log_table_change(); 