/*
  # Fix RLS policies to work with integer auth UIDs

  1. Policy Updates
    - Update projects table policies to work with integer auth.uid()
    - Ensure auth.uid() is cast to integer for comparison with developer_id and created_by
    - Simplify policies for development while maintaining security structure

  2. Changes
    - Modified INSERT policy to allow authenticated users to create projects
    - Updated SELECT, UPDATE, DELETE policies to work with integer user IDs
    - Added proper casting between text auth.uid() and integer columns
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create projects" ON projects;
DROP POLICY IF EXISTS "Users can read all projects" ON projects;
DROP POLICY IF EXISTS "Users can update projects" ON projects;
DROP POLICY IF EXISTS "Users can delete projects" ON projects;

-- Create new policies that work with integer auth.uid()
CREATE POLICY "Users can create projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    (developer_id = (auth.uid())::integer OR created_by = (auth.uid())::integer)
  );

CREATE POLICY "Users can read all projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IS NOT NULL AND
    (developer_id = (auth.uid())::integer OR created_by = (auth.uid())::integer)
  );

CREATE POLICY "Users can delete projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() IS NOT NULL AND
    (developer_id = (auth.uid())::integer OR created_by = (auth.uid())::integer)
  );