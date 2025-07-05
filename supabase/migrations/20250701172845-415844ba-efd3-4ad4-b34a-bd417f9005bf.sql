
-- Step 1: Drop ALL existing policies on user_roles table to start fresh
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Step 2: Create simple, non-recursive policies
-- Policy for users to view their own roles (no recursion)
CREATE POLICY "Users can view own roles" 
ON public.user_roles 
FOR SELECT 
USING (user_id = auth.uid());

-- Policy for authenticated users to insert roles (temporarily permissive for testing)
CREATE POLICY "Authenticated users can insert roles" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Policy for authenticated users to update roles (temporarily permissive for testing)
CREATE POLICY "Authenticated users can update roles" 
ON public.user_roles 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Policy for authenticated users to delete roles (temporarily permissive for testing)
CREATE POLICY "Authenticated users can delete roles" 
ON public.user_roles 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Step 3: Ensure the has_role function exists but won't be used in RLS policies on user_roles table
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Step 4: Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
