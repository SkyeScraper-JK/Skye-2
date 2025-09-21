/*
  # Enhanced Property Agent Schema with Excel Upload System

  1. New Tables
    - `units` (renamed from properties with enhanced pricing fields)
      - `id` (integer, primary key)
      - `project_id` (integer, foreign key to projects)
      - `name` (varchar)
      - `type` (varchar, default 'Apartment')
      - `price` (decimal)
      - `discount_price` (decimal, nullable)
      - `registration_fee` (decimal, nullable)
      - `roi_percentage` (decimal, nullable)
      - `payment_plan` (varchar, nullable)
      - `status` (varchar, default 'Available')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `upload_logs`
      - `id` (integer, primary key)
      - `project_id` (integer, foreign key to projects)
      - `uploaded_by` (integer, foreign key to users)
      - `file_url` (varchar)
      - `file_type` (varchar)
      - `status` (varchar, default 'processing')
      - `errors` (text, nullable)
      - `created_at` (timestamptz)

  2. Updated Tables
    - `projects`: Added brochure_url, unit_excel_url, created_by fields
    - `notifications`: Added project_id field

  3. Security
    - Enable RLS on all new tables
    - Add policies for role-based access control
    - Admins have full access, users have restricted access based on role

  4. Performance
    - Added indexes for frequently queried columns
    - Foreign key constraints for data integrity
*/

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Update projects table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'brochure_url'
  ) THEN
    ALTER TABLE projects ADD COLUMN brochure_url VARCHAR;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'unit_excel_url'
  ) THEN
    ALTER TABLE projects ADD COLUMN unit_excel_url VARCHAR;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE projects ADD COLUMN created_by INTEGER REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Rename properties table to units and add new columns
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'properties') THEN
    -- Add new columns to properties table first
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'properties' AND column_name = 'discount_price'
    ) THEN
      ALTER TABLE properties ADD COLUMN discount_price DECIMAL(15,2);
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'properties' AND column_name = 'registration_fee'
    ) THEN
      ALTER TABLE properties ADD COLUMN registration_fee DECIMAL(15,2);
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'properties' AND column_name = 'roi_percentage'
    ) THEN
      ALTER TABLE properties ADD COLUMN roi_percentage DECIMAL(5,2);
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'properties' AND column_name = 'payment_plan'
    ) THEN
      ALTER TABLE properties ADD COLUMN payment_plan VARCHAR;
    END IF;

    -- Rename table to units
    ALTER TABLE properties RENAME TO units;
    
    -- Update any existing indexes
    DROP INDEX IF EXISTS idx_properties_project_id;
    CREATE INDEX IF NOT EXISTS idx_units_project_id ON units(project_id);
  END IF;
END $$;

-- Create units table if it doesn't exist (in case properties table didn't exist)
CREATE TABLE IF NOT EXISTS units (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  type VARCHAR DEFAULT 'Apartment',
  price DECIMAL(15,2) NOT NULL,
  discount_price DECIMAL(15,2),
  registration_fee DECIMAL(15,2),
  roi_percentage DECIMAL(5,2),
  payment_plan VARCHAR,
  status VARCHAR DEFAULT 'Available',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create upload_logs table
CREATE TABLE IF NOT EXISTS upload_logs (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  uploaded_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_url VARCHAR NOT NULL,
  file_type VARCHAR NOT NULL CHECK (file_type IN ('brochure', 'excel')),
  status VARCHAR DEFAULT 'processing' CHECK (status IN ('processing', 'success', 'failed')),
  errors TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Update notifications table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notifications' AND column_name = 'project_id'
  ) THEN
    ALTER TABLE notifications ADD COLUMN project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Update foreign key constraints for units table (formerly properties)
DO $$
BEGIN
  -- Update leads table foreign key
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_leads_property'
  ) THEN
    ALTER TABLE leads DROP CONSTRAINT fk_leads_property;
    ALTER TABLE leads ADD CONSTRAINT fk_leads_unit FOREIGN KEY (property_id) REFERENCES units(id) ON DELETE CASCADE;
  END IF;

  -- Update bookings table foreign key
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_bookings_property'
  ) THEN
    ALTER TABLE bookings DROP CONSTRAINT fk_bookings_property;
    ALTER TABLE bookings ADD CONSTRAINT fk_bookings_unit FOREIGN KEY (property_id) REFERENCES units(id) ON DELETE CASCADE;
  END IF;

  -- Update agent_property_interest table foreign key
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_agent_property_interest_property'
  ) THEN
    ALTER TABLE agent_property_interest DROP CONSTRAINT fk_agent_property_interest_property;
    ALTER TABLE agent_property_interest ADD CONSTRAINT fk_agent_property_interest_unit FOREIGN KEY (property_id) REFERENCES units(id) ON DELETE CASCADE;
  END IF;

  -- Update promotions table foreign key
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_promotions_property'
  ) THEN
    ALTER TABLE promotions DROP CONSTRAINT fk_promotions_property;
    ALTER TABLE promotions ADD CONSTRAINT fk_promotions_unit FOREIGN KEY (property_id) REFERENCES units(id) ON DELETE CASCADE;
  END IF;

  -- Update audit_logs table foreign key
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_audit_logs_target_property'
  ) THEN
    ALTER TABLE audit_logs DROP CONSTRAINT fk_audit_logs_target_property;
    ALTER TABLE audit_logs ADD CONSTRAINT fk_audit_logs_target_unit FOREIGN KEY (target_property_id) REFERENCES units(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_units_project_id ON units(project_id);
CREATE INDEX IF NOT EXISTS idx_units_status ON units(status);
CREATE INDEX IF NOT EXISTS idx_upload_logs_project_id ON upload_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_upload_logs_uploaded_by ON upload_logs(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_notifications_project_id ON notifications(project_id);

-- Add updated_at trigger for units table
DROP TRIGGER IF EXISTS update_units_updated_at ON units;
CREATE TRIGGER update_units_updated_at
  BEFORE UPDATE ON units
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on new tables
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE upload_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for units table
CREATE POLICY "Everyone can read units"
  ON units
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Developers can manage units in own projects"
  ON units
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = units.project_id 
      AND (
        (projects.developer_id)::text = (auth.uid())::text 
        OR (projects.created_by)::text = (auth.uid())::text
        OR EXISTS (
          SELECT 1 FROM users 
          WHERE (users.id)::text = (auth.uid())::text 
          AND users.role = 'admin'
        )
      )
    )
  );

-- RLS Policies for upload_logs table
CREATE POLICY "Users can read own upload logs"
  ON upload_logs
  FOR SELECT
  TO authenticated
  USING (
    (uploaded_by)::text = (auth.uid())::text 
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE (users.id)::text = (auth.uid())::text 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can create upload logs"
  ON upload_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (uploaded_by)::text = (auth.uid())::text
  );

CREATE POLICY "Admins can manage all upload logs"
  ON upload_logs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE (users.id)::text = (auth.uid())::text 
      AND users.role = 'admin'
    )
  );

-- Update existing RLS policies for projects table
DROP POLICY IF EXISTS "Developers can manage own projects" ON projects;
CREATE POLICY "Developers can manage own projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (
    (developer_id)::text = (auth.uid())::text 
    OR (created_by)::text = (auth.uid())::text
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE (users.id)::text = (auth.uid())::text 
      AND users.role = 'admin'
    )
  );

-- Update notifications RLS policy to include project access
DROP POLICY IF EXISTS "Users can read own notifications" ON notifications;
CREATE POLICY "Users can read own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (
    (user_id)::text = (auth.uid())::text 
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE (users.id)::text = (auth.uid())::text 
      AND users.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (
    (user_id)::text = (auth.uid())::text 
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE (users.id)::text = (auth.uid())::text 
      AND users.role = 'admin'
    )
  );