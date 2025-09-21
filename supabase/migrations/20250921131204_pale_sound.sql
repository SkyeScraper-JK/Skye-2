/*
  # Enhanced Excel Upload System for Property Agent

  1. Table Updates
    - `projects` table: Add brochure_url, unit_excel_url, created_by fields
    - `properties` table: Rename to `units` and add pricing fields
    - `units` table: Add discount_price, registration_fee, roi_percentage, payment_plan
    - `notifications` table: Add project_id field

  2. New Tables
    - `upload_logs` table: Track upload status and validation errors

  3. Security
    - Enable RLS on all new/updated tables
    - Add policies for role-based access control
    - Maintain existing security model

  4. Performance
    - Add indexes for frequently queried columns
    - Optimize for bulk operations
*/

-- Add new columns to projects table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'brochure_url'
  ) THEN
    ALTER TABLE projects ADD COLUMN brochure_url TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'unit_excel_url'
  ) THEN
    ALTER TABLE projects ADD COLUMN unit_excel_url TEXT;
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

-- Rename properties table to units if it exists, or create units table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'properties'
  ) THEN
    -- Rename existing properties table to units
    ALTER TABLE properties RENAME TO units;
    
    -- Add new columns to units table
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'units' AND column_name = 'discount_price'
    ) THEN
      ALTER TABLE units ADD COLUMN discount_price DECIMAL(15,2);
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'units' AND column_name = 'registration_fee'
    ) THEN
      ALTER TABLE units ADD COLUMN registration_fee DECIMAL(15,2);
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'units' AND column_name = 'roi_percentage'
    ) THEN
      ALTER TABLE units ADD COLUMN roi_percentage DECIMAL(5,2);
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'units' AND column_name = 'payment_plan'
    ) THEN
      ALTER TABLE units ADD COLUMN payment_plan TEXT;
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'units' AND column_name = 'unit_number'
    ) THEN
      ALTER TABLE units ADD COLUMN unit_number VARCHAR(50);
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'units' AND column_name = 'floor'
    ) THEN
      ALTER TABLE units ADD COLUMN floor INTEGER;
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'units' AND column_name = 'area_sqft'
    ) THEN
      ALTER TABLE units ADD COLUMN area_sqft DECIMAL(10,2);
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'units' AND column_name = 'price_per_sqft'
    ) THEN
      ALTER TABLE units ADD COLUMN price_per_sqft DECIMAL(10,2);
    END IF;
  ELSE
    -- Create units table if properties doesn't exist
    CREATE TABLE IF NOT EXISTS units (
      id SERIAL PRIMARY KEY,
      project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      unit_number VARCHAR(50),
      floor INTEGER,
      type VARCHAR(100) DEFAULT 'Apartment',
      area_sqft DECIMAL(10,2),
      price DECIMAL(15,2) NOT NULL,
      price_per_sqft DECIMAL(10,2),
      discount_price DECIMAL(15,2),
      registration_fee DECIMAL(15,2),
      roi_percentage DECIMAL(5,2),
      payment_plan TEXT,
      status VARCHAR(50) DEFAULT 'Available',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  END IF;
END $$;

-- Create upload_logs table
CREATE TABLE IF NOT EXISTS upload_logs (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  uploaded_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type VARCHAR(50) NOT NULL CHECK (file_type IN ('brochure', 'excel')),
  status VARCHAR(50) DEFAULT 'processing' CHECK (status IN ('processing', 'success', 'failed')),
  errors TEXT, -- JSON array of validation errors
  units_processed INTEGER DEFAULT 0,
  units_skipped INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add project_id to notifications table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notifications' AND column_name = 'project_id'
  ) THEN
    ALTER TABLE notifications ADD COLUMN project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE upload_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects table
CREATE POLICY "Developers can manage own projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (
    (developer_id::text = uid()::text) OR 
    (created_by::text = uid()::text) OR
    (EXISTS (
      SELECT 1 FROM users 
      WHERE users.id::text = uid()::text 
      AND users.role = 'admin'
    ))
  );

CREATE POLICY "Everyone can read projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for units table
CREATE POLICY "Developers can manage units in own projects"
  ON units
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = units.project_id 
      AND (
        projects.developer_id::text = uid()::text OR 
        projects.created_by::text = uid()::text OR
        EXISTS (
          SELECT 1 FROM users 
          WHERE users.id::text = uid()::text 
          AND users.role = 'admin'
        )
      )
    )
  );

CREATE POLICY "Everyone can read units"
  ON units
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for upload_logs table
CREATE POLICY "Users can view own upload logs"
  ON upload_logs
  FOR SELECT
  TO authenticated
  USING (
    uploaded_by::text = uid()::text OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id::text = uid()::text 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can create upload logs"
  ON upload_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (uploaded_by::text = uid()::text);

CREATE POLICY "Admins can manage all upload logs"
  ON upload_logs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id::text = uid()::text 
      AND users.role = 'admin'
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_units_project_id ON units(project_id);
CREATE INDEX IF NOT EXISTS idx_units_status ON units(status);
CREATE INDEX IF NOT EXISTS idx_units_floor ON units(floor);
CREATE INDEX IF NOT EXISTS idx_upload_logs_project_id ON upload_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_upload_logs_uploaded_by ON upload_logs(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_upload_logs_status ON upload_logs(status);
CREATE INDEX IF NOT EXISTS idx_notifications_project_id ON notifications(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);

-- Update foreign key constraints for units table (if renamed from properties)
DO $$
BEGIN
  -- Update leads table foreign key
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_leads_property'
  ) THEN
    ALTER TABLE leads DROP CONSTRAINT fk_leads_property;
    ALTER TABLE leads ADD CONSTRAINT fk_leads_unit 
      FOREIGN KEY (property_id) REFERENCES units(id) ON DELETE CASCADE;
  END IF;
  
  -- Update bookings table foreign key
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_bookings_property'
  ) THEN
    ALTER TABLE bookings DROP CONSTRAINT fk_bookings_property;
    ALTER TABLE bookings ADD CONSTRAINT fk_bookings_unit 
      FOREIGN KEY (property_id) REFERENCES units(id) ON DELETE CASCADE;
  END IF;
  
  -- Update agent_property_interest table foreign key
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_agent_property_interest_property'
  ) THEN
    ALTER TABLE agent_property_interest DROP CONSTRAINT fk_agent_property_interest_property;
    ALTER TABLE agent_property_interest ADD CONSTRAINT fk_agent_property_interest_unit 
      FOREIGN KEY (property_id) REFERENCES units(id) ON DELETE CASCADE;
  END IF;
  
  -- Update promotions table foreign key
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_promotions_property'
  ) THEN
    ALTER TABLE promotions DROP CONSTRAINT fk_promotions_property;
    ALTER TABLE promotions ADD CONSTRAINT fk_promotions_unit 
      FOREIGN KEY (property_id) REFERENCES units(id) ON DELETE CASCADE;
  END IF;
  
  -- Update audit_logs table foreign key
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_audit_logs_target_property'
  ) THEN
    ALTER TABLE audit_logs DROP CONSTRAINT fk_audit_logs_target_property;
    ALTER TABLE audit_logs ADD CONSTRAINT fk_audit_logs_target_unit 
      FOREIGN KEY (target_property_id) REFERENCES units(id) ON DELETE SET NULL;
  END IF;
END $$;