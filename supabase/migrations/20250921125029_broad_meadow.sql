/*
  # Property Agent Database Schema

  1. New Tables
    - `users` - User accounts for agents, developers, buyers, and admins
    - `projects` - Development projects created by developers
    - `properties` - Individual properties within projects
    - `leads` - Lead management for agents
    - `bookings` - Property bookings and reservations
    - `audit_logs` - Admin action tracking for compliance
    - `agent_property_interest` - Agent interest in promoting properties
    - `promotions` - Developer promotional offers
    - `notifications` - System notifications for users

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Secure admin functions with proper permissions

  3. Features
    - Foreign key relationships for data integrity
    - Default values for timestamps and status fields
    - Proper indexing for performance
*/

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'buyer',
  phone VARCHAR(20),
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  developer_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Properties table
CREATE TABLE IF NOT EXISTS properties (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL DEFAULT 'Apartment',
  price DECIMAL(15,2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Available',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Leads table
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  agent_id INTEGER NOT NULL,
  buyer_id INTEGER,
  property_id INTEGER NOT NULL,
  stage VARCHAR(50) NOT NULL DEFAULT 'New',
  notes TEXT,
  reminder_date TIMESTAMPTZ,
  lead_score INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  agent_id INTEGER NOT NULL,
  buyer_id INTEGER,
  property_id INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Reserved',
  token_amount DECIMAL(15,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create AuditLogs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER NOT NULL,
  action VARCHAR(100) NOT NULL,
  target_user_id INTEGER,
  target_property_id INTEGER,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create AgentPropertyInterest table
CREATE TABLE IF NOT EXISTS agent_property_interest (
  id SERIAL PRIMARY KEY,
  agent_id INTEGER NOT NULL,
  property_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(agent_id, property_id)
);

-- Create Promotions table
CREATE TABLE IF NOT EXISTS promotions (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL,
  developer_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  offer_details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  promotion_id INTEGER,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'system',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add Foreign Key Constraints
ALTER TABLE projects 
ADD CONSTRAINT fk_projects_developer 
FOREIGN KEY (developer_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE properties 
ADD CONSTRAINT fk_properties_project 
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

ALTER TABLE leads 
ADD CONSTRAINT fk_leads_agent 
FOREIGN KEY (agent_id) REFERENCES users(id) ON DELETE CASCADE;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_leads_buyer'
  ) THEN
    ALTER TABLE leads 
    ADD CONSTRAINT fk_leads_buyer 
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $$;

ALTER TABLE leads 
ADD CONSTRAINT fk_leads_property 
FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE;

ALTER TABLE bookings 
ADD CONSTRAINT fk_bookings_agent 
FOREIGN KEY (agent_id) REFERENCES users(id) ON DELETE CASCADE;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_bookings_buyer'
  ) THEN
    ALTER TABLE bookings 
    ADD CONSTRAINT fk_bookings_buyer 
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $$;

ALTER TABLE bookings 
ADD CONSTRAINT fk_bookings_property 
FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE;

ALTER TABLE audit_logs 
ADD CONSTRAINT fk_audit_logs_admin 
FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_audit_logs_target_user'
  ) THEN
    ALTER TABLE audit_logs 
    ADD CONSTRAINT fk_audit_logs_target_user 
    FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_audit_logs_target_property'
  ) THEN
    ALTER TABLE audit_logs 
    ADD CONSTRAINT fk_audit_logs_target_property 
    FOREIGN KEY (target_property_id) REFERENCES properties(id) ON DELETE SET NULL;
  END IF;
END $$;

ALTER TABLE agent_property_interest 
ADD CONSTRAINT fk_agent_property_interest_agent 
FOREIGN KEY (agent_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE agent_property_interest 
ADD CONSTRAINT fk_agent_property_interest_property 
FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE;

ALTER TABLE promotions 
ADD CONSTRAINT fk_promotions_property 
FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE;

ALTER TABLE promotions 
ADD CONSTRAINT fk_promotions_developer 
FOREIGN KEY (developer_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE notifications 
ADD CONSTRAINT fk_notifications_user 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_notifications_promotion'
  ) THEN
    ALTER TABLE notifications 
    ADD CONSTRAINT fk_notifications_promotion 
    FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_property_interest ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Users policies
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text OR EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text OR EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

CREATE POLICY "Admins can manage all users"
  ON users
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

-- Projects policies
CREATE POLICY "Everyone can read projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Developers can manage own projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (developer_id::text = auth.uid()::text OR EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

-- Properties policies
CREATE POLICY "Everyone can read properties"
  ON properties
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Developers can manage properties in own projects"
  ON properties
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = properties.project_id 
    AND (projects.developer_id::text = auth.uid()::text OR EXISTS (
      SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
    ))
  ));

-- Leads policies
CREATE POLICY "Agents can read own leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (agent_id::text = auth.uid()::text OR EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

CREATE POLICY "Agents can manage own leads"
  ON leads
  FOR ALL
  TO authenticated
  USING (agent_id::text = auth.uid()::text OR EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

-- Bookings policies
CREATE POLICY "Agents can read own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (agent_id::text = auth.uid()::text OR EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

CREATE POLICY "Agents can manage own bookings"
  ON bookings
  FOR ALL
  TO authenticated
  USING (agent_id::text = auth.uid()::text OR EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

-- Audit logs policies (admin only)
CREATE POLICY "Only admins can access audit logs"
  ON audit_logs
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

-- Agent property interest policies
CREATE POLICY "Agents can manage own property interests"
  ON agent_property_interest
  FOR ALL
  TO authenticated
  USING (agent_id::text = auth.uid()::text OR EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

-- Promotions policies
CREATE POLICY "Everyone can read promotions"
  ON promotions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Developers can manage own promotions"
  ON promotions
  FOR ALL
  TO authenticated
  USING (developer_id::text = auth.uid()::text OR EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

-- Notifications policies
CREATE POLICY "Users can read own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (user_id::text = auth.uid()::text OR EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (user_id::text = auth.uid()::text OR EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_projects_developer_id ON projects(developer_id);
CREATE INDEX IF NOT EXISTS idx_properties_project_id ON properties(project_id);
CREATE INDEX IF NOT EXISTS idx_leads_agent_id ON leads(agent_id);
CREATE INDEX IF NOT EXISTS idx_leads_property_id ON leads(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_agent_id ON bookings(agent_id);
CREATE INDEX IF NOT EXISTS idx_bookings_property_id ON bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id ON audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_agent_property_interest_agent_id ON agent_property_interest(agent_id);
CREATE INDEX IF NOT EXISTS idx_promotions_developer_id ON promotions(developer_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at columns
CREATE TRIGGER update_projects_updated_at 
  BEFORE UPDATE ON projects 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at 
  BEFORE UPDATE ON properties 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at 
  BEFORE UPDATE ON bookings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();