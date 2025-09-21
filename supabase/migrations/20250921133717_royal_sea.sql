/*
  # Fix RLS Policies for Project Creation

  1. Security Updates
    - Fix projects table RLS policies to allow proper creation
    - Update units table policies for bulk unit insertion
    - Ensure upload_logs can be created by authenticated users
    - Fix authentication checks for project creation

  2. Policy Updates
    - Allow developers to create projects for themselves
    - Allow admins to create projects for any developer
    - Enable proper unit creation during bulk upload
    - Fix upload logging permissions
*/

-- Fix projects table RLS policies
DROP POLICY IF EXISTS "Developers can manage own projects" ON projects;
DROP POLICY IF EXISTS "Everyone can read projects" ON projects;

-- Create more permissive policies for project creation
CREATE POLICY "Developers can manage own projects"
  ON projects
  FOR ALL
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

CREATE POLICY "Everyone can read projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (true);

-- Fix units table RLS policies
DROP POLICY IF EXISTS "Developers can manage units in own projects" ON units;
DROP POLICY IF EXISTS "Everyone can read units" ON units;

CREATE POLICY "Developers can manage units in own projects"
  ON units
  FOR ALL
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

CREATE POLICY "Everyone can read units"
  ON units
  FOR SELECT
  TO authenticated
  USING (true);

-- Fix upload_logs table RLS policies
DROP POLICY IF EXISTS "Users can create upload logs" ON upload_logs;
DROP POLICY IF EXISTS "Users can read own upload logs" ON upload_logs;
DROP POLICY IF EXISTS "Admins can manage all upload logs" ON upload_logs;

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

CREATE POLICY "Admins can manage all upload logs"
  ON upload_logs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id::text = auth.uid()::text 
      AND users.role = 'admin'
    )
  );

-- Ensure notifications table has proper policies
DROP POLICY IF EXISTS "Users can read own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;

CREATE POLICY "Users can read own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (
    (user_id::text = auth.uid()::text) OR 
    (EXISTS (
      SELECT 1 FROM users 
      WHERE users.id::text = auth.uid()::text 
      AND users.role = 'admin'
    ))
  );

CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (
    (user_id::text = auth.uid()::text) OR 
    (EXISTS (
      SELECT 1 FROM users 
      WHERE users.id::text = auth.uid()::text 
      AND users.role = 'admin'
    ))
  );

CREATE POLICY "System can create notifications"
  ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);