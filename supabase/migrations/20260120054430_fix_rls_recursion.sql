-- Fix RLS policy recursion on user_roles table
DROP POLICY IF EXISTS "Admins can view roles" ON public.user_roles;

-- Create a non-recursive SELECT policy for user_roles.
-- Since user_roles are checked by users for their own admin role,
-- checking that the user matches their own ID is sufficient and avoids recursion.
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
