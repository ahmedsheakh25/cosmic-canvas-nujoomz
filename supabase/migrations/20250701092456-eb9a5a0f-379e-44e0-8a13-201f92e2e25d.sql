
-- Step 1: Add admin role to the current authenticated user
INSERT INTO public.user_roles (user_id, role) 
VALUES ('f9519fcf-8837-4cbf-b2d4-9772767cb566', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 2: Create a function to automatically assign admin role to new users
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Assign admin role to new users by default
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'admin');
  RETURN NEW;
END;
$$;

-- Step 3: Create trigger to automatically assign admin role when users sign up
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Step 4: Add admin roles to any existing users who don't have roles yet
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_roles)
ON CONFLICT (user_id, role) DO NOTHING;
