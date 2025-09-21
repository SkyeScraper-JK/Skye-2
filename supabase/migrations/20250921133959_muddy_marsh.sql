/*
  # Fix RLS Policies and Authentication

  1. Security Updates
    - Update RLS policies to allow proper project creation
    - Add policies for authenticated users to create projects
    - Fix authentication context issues

  2. Policy Changes
    - Allow developers to create projects in their own account
    - Allow admins to create projects for any developer
    - Ensure proper authentication checks
*/

-- Update projects table RLS policies
DROP POLICY IF EXISTS "Developers can manage own projects" ON projects;
DROP POLICY IF EXISTS "Everyone can read projects" ON projects;

-- Create more permissive policies for project creation
CREATE POLICY "Authenticated users can create projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Allow if user is creating for themselves (developer_id matches their user id)
    (developer_id::text = auth.uid()::text) OR
    -- Allow if user is admin creating for any developer
    (EXISTS (
      SELECT 1 FROM users 
      WHERE users.id::text = auth.uid()::text 
      AND users.role = 'admin'
    )) OR
    -- Allow if user is developer and created_by matches their id
    (created_by::text = auth.uid()::text)
  );

CREATE POLICY "Users can read all projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (
    (developer_id::text = auth.uid()::text) OR
    (created_by::text = auth.uid()::text) OR
    (EXISTS (
      SELECT 1 FROM users 
      WHERE users.id::text = auth.uid()::text 
      AND users.role = 'admin'
    ))
  )
  WITH CHECK (
    (developer_id::text = auth.uid()::text) OR
    (created_by::text = auth.uid()::text) OR
    (EXISTS (
      SELECT 1 FROM users 
      WHERE users.id::text = auth.uid()::text 
      AND users.role = 'admin'
    ))
  );

-- Update units table RLS policies
DROP POLICY IF EXISTS "Developers can manage properties in own projects" ON units;
DROP POLICY IF EXISTS "Developers can manage units in own projects" ON units;
DROP POLICY IF EXISTS "Everyone can read properties" ON units;
DROP POLICY IF EXISTS "Everyone can read units" ON units;

CREATE POLICY "Authenticated users can create units"
  ON units
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = units.project_id 
      AND (
        (projects.developer_id::text = auth.uid()::text) OR
        (projects.created_by::text = auth.uid()::text) OR
        (EXISTS (
          SELECT 1 FROM users 
          WHERE users.id::text = auth.uid()::text 
          AND users.role = 'admin'
        ))
      )
    )
  );

CREATE POLICY "Users can read all units"
  ON units
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update units in own projects"
  ON units
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = units.project_id 
      AND (
        (projects.developer_id::text = auth.uid()::text) OR
        (projects.created_by::text = auth.uid()::text) OR
        (EXISTS (
          SELECT 1 FROM users 
          WHERE users.id::text = auth.uid()::text 
          AND users.role = 'admin'
        ))
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = units.project_id 
      AND (
        (projects.developer_id::text = auth.uid()::text) OR
        (projects.created_by::text = auth.uid()::text) OR
        (EXISTS (
          SELECT 1 FROM users 
          WHERE users.id::text = auth.uid()::text 
          AND users.role = 'admin'
        ))
      )
    )
  );

-- Update upload_logs table RLS policies
CREATE POLICY "Users can create upload logs"
  ON upload_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (uploaded_by::text = auth.uid()::text);

CREATE POLICY "Users can read own upload logs"
  ON upload_logs
  FOR SELECT
  TO authenticated
  USING (
    (uploaded_by::text = auth.uid()::text) OR
    (EXISTS (
      SELECT 1 FROM users 
      WHERE users.id::text = auth.uid()::text 
      AND users.role = 'admin'
    ))
  );

-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('project-files', 'project-files', true),
  ('brochures', 'brochures', true),
  ('excel-files', 'excel-files', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Authenticated users can upload project files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id IN ('project-files', 'brochures', 'excel-files'));

CREATE POLICY "Anyone can view project files"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id IN ('project-files', 'brochures', 'excel-files'));