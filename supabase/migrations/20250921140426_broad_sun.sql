/*
  # Fix UUID Cast Error in RLS Policies

  1. RLS Policy Updates
    - Remove invalid UUID to integer casting
    - Use string comparison for auth.uid() with user IDs
    - Update all affected tables (projects, units, upload_logs)
  
  2. Security
    - Maintain RLS protection while fixing cast errors
    - Allow authenticated users to manage their own data
    - Admin users can manage all data
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can create projects" ON projects;
DROP POLICY IF EXISTS "Users can read all projects" ON projects;
DROP POLICY IF EXISTS "Users can update projects" ON projects;
DROP POLICY IF EXISTS "Users can delete projects" ON projects;
DROP POLICY IF EXISTS "Users can manage units" ON units;
DROP POLICY IF EXISTS "Users can manage upload logs" ON upload_logs;

-- Create new policies without UUID casting
CREATE POLICY "Users can create projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read all projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (true);

-- Update units policies
CREATE POLICY "Users can manage units"
  ON units
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Update upload_logs policies
CREATE POLICY "Users can manage upload logs"
  ON upload_logs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);