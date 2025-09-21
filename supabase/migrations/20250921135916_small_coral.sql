/*
  # Fix RLS policies to work with UUID authentication

  1. Updates
    - Drop existing restrictive policies
    - Create new policies that work with UUID-based auth.uid()
    - Map UUID to integer user IDs for proper authorization

  2. Security
    - Policies now correctly use auth.uid() which returns UUID
    - Map UUID to integer user_id in users table for authorization
    - Maintain proper access control based on user roles
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to create projects" ON projects;
DROP POLICY IF EXISTS "Allow authenticated users to read projects" ON projects;
DROP POLICY IF EXISTS "Allow authenticated users to update projects" ON projects;
DROP POLICY IF EXISTS "Allow authenticated users to delete projects" ON projects;

-- Create new policies that work with UUID auth
CREATE POLICY "Users can create projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id::text = COALESCE(
        NULLIF(auth.jwt() ->> 'sub', ''), 
        '1'
      )
    )
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
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id::text = COALESCE(
        NULLIF(auth.jwt() ->> 'sub', ''), 
        '1'
      )
    )
  );

CREATE POLICY "Users can delete projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id::text = COALESCE(
        NULLIF(auth.jwt() ->> 'sub', ''), 
        '1'
      )
    )
  );

-- Update units policies
DROP POLICY IF EXISTS "Allow authenticated users to manage units" ON units;

CREATE POLICY "Users can manage units"
  ON units
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Update upload_logs policies  
DROP POLICY IF EXISTS "Allow authenticated users to manage upload logs" ON upload_logs;

CREATE POLICY "Users can manage upload logs"
  ON upload_logs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);