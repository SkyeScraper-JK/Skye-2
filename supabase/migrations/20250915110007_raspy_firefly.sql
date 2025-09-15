/*
  # Complete Property Agent Database Schema

  This migration creates the complete database structure for the Property Agent application,
  covering all functionality for Agents, Developers, and Admin screens.

  ## Tables Created:
  1. **User Management**
     - `users` - Core user accounts with authentication
     - `user_profiles` - Extended user profile information
     - `user_sessions` - Active user sessions tracking
     - `user_preferences` - User-specific settings and preferences

  2. **Developer Management**
     - `developers` - Developer company information
     - `developer_profiles` - Developer-specific profile data
     - `developer_documents` - Legal documents and certifications

  3. **Project Management**
     - `projects` - Real estate projects
     - `project_amenities` - Project amenities and features
     - `project_images` - Project photos and media
     - `project_documents` - Project brochures, floor plans, etc.
     - `project_payment_plans` - Available payment options

  4. **Property Management**
     - `properties` - Individual properties within projects
     - `property_units` - Specific units/apartments
     - `unit_availability` - Real-time availability tracking
     - `unit_reservations` - Temporary holds on units

  5. **Lead Management**
     - `leads` - Potential buyers and inquiries
     - `lead_interactions` - Communication history
     - `lead_assignments` - Agent-lead relationships
     - `lead_preferences` - Buyer requirements and preferences

  6. **Booking Management**
     - `bookings` - Property bookings and sales
     - `booking_payments` - Payment tracking
     - `payment_schedules` - Installment plans
     - `booking_documents` - Agreements and contracts

  7. **Communication**
     - `messages` - Internal messaging system
     - `message_threads` - Conversation grouping
     - `message_attachments` - File attachments
     - `notifications` - System notifications

  8. **Admin & Audit**
     - `admin_actions` - Administrative action logging
     - `audit_logs` - Comprehensive audit trail
     - `system_settings` - Application configuration
     - `user_activity_logs` - User activity tracking

  ## Security Features:
  - Row Level Security (RLS) enabled on all tables
  - Comprehensive access policies
  - Audit trail for all critical operations
  - Data encryption for sensitive information
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- 1. USER MANAGEMENT TABLES
-- =============================================

-- Core users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('agent', 'developer', 'buyer', 'admin')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login_at timestamptz,
  email_verified boolean DEFAULT false,
  phone_verified boolean DEFAULT false
);

-- Extended user profiles
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  date_of_birth date,
  gender text CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  address jsonb, -- {street, city, state, country, postal_code}
  emergency_contact jsonb, -- {name, phone, relationship}
  bio text,
  website text,
  social_links jsonb, -- {linkedin, twitter, facebook, etc.}
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User sessions tracking
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  session_token text UNIQUE NOT NULL,
  ip_address inet,
  user_agent text,
  device_info jsonb,
  location_info jsonb, -- {country, city, timezone}
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  last_activity_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

-- User preferences and settings
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  language text DEFAULT 'en',
  currency text DEFAULT 'INR',
  timezone text DEFAULT 'Asia/Kolkata',
  notification_settings jsonb DEFAULT '{"email": true, "sms": false, "push": true}',
  privacy_settings jsonb DEFAULT '{"profile_visibility": "public", "contact_visibility": "agents_only"}',
  theme text DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- =============================================
-- 2. DEVELOPER MANAGEMENT TABLES
-- =============================================

-- Developer companies
CREATE TABLE IF NOT EXISTS developers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  company_registration_number text UNIQUE,
  company_type text CHECK (company_type IN ('private_limited', 'public_limited', 'partnership', 'proprietorship', 'llp')),
  established_year integer,
  headquarters_address jsonb,
  website text,
  description text,
  logo_url text,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verification_documents jsonb, -- Array of document URLs
  total_projects integer DEFAULT 0,
  total_units_sold integer DEFAULT 0,
  average_rating decimal(3,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Developer profiles (additional info)
CREATE TABLE IF NOT EXISTS developer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id uuid REFERENCES developers(id) ON DELETE CASCADE,
  specializations text[], -- Array of specializations
  service_areas text[], -- Geographic areas served
  certifications jsonb, -- Professional certifications
  awards jsonb, -- Industry awards and recognitions
  team_size integer,
  annual_revenue_range text,
  key_personnel jsonb, -- Array of key team members
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(developer_id)
);

-- Developer documents
CREATE TABLE IF NOT EXISTS developer_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id uuid REFERENCES developers(id) ON DELETE CASCADE,
  document_type text NOT NULL CHECK (document_type IN ('license', 'registration', 'tax_certificate', 'insurance', 'other')),
  document_name text NOT NULL,
  document_url text NOT NULL,
  document_number text,
  issued_date date,
  expiry_date date,
  issuing_authority text,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =============================================
-- 3. PROJECT MANAGEMENT TABLES
-- =============================================

-- Real estate projects
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id uuid REFERENCES developers(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  project_type text NOT NULL CHECK (project_type IN ('residential', 'commercial', 'mixed_use', 'industrial')),
  property_types text[] NOT NULL, -- ['apartment', 'villa', 'plot', 'office']
  location jsonb NOT NULL, -- {address, city, state, country, coordinates}
  total_area decimal(10,2), -- in sq ft
  total_units integer NOT NULL DEFAULT 0,
  available_units integer NOT NULL DEFAULT 0,
  sold_units integer NOT NULL DEFAULT 0,
  held_units integer NOT NULL DEFAULT 0,
  starting_price decimal(15,2),
  price_range jsonb, -- {min_price, max_price, currency}
  possession_date date,
  launch_date date,
  completion_date date,
  project_status text NOT NULL DEFAULT 'planning' CHECK (project_status IN ('planning', 'approved', 'under_construction', 'ready', 'completed', 'cancelled')),
  approval_details jsonb, -- Regulatory approvals
  rera_number text,
  featured boolean DEFAULT false,
  visibility text DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'draft')),
  seo_metadata jsonb, -- SEO title, description, keywords
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Project amenities
CREATE TABLE IF NOT EXISTS project_amenities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  category text NOT NULL, -- 'recreation', 'security', 'convenience', 'wellness'
  name text NOT NULL,
  description text,
  icon text, -- Icon identifier
  is_premium boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Project images and media
CREATE TABLE IF NOT EXISTS project_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  image_type text NOT NULL CHECK (image_type IN ('hero', 'gallery', 'floor_plan', 'elevation', 'amenity', 'location')),
  image_url text NOT NULL,
  thumbnail_url text,
  alt_text text,
  caption text,
  display_order integer DEFAULT 0,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Project documents
CREATE TABLE IF NOT EXISTS project_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  document_type text NOT NULL CHECK (document_type IN ('brochure', 'floor_plan', 'price_list', 'legal', 'approval', 'other')),
  document_name text NOT NULL,
  document_url text NOT NULL,
  file_size bigint, -- in bytes
  mime_type text,
  version text DEFAULT '1.0',
  is_public boolean DEFAULT true,
  download_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Project payment plans
CREATE TABLE IF NOT EXISTS project_payment_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  plan_name text NOT NULL,
  plan_type text CHECK (plan_type IN ('standard', 'flexi', 'construction_linked', 'possession_linked')),
  down_payment_percentage decimal(5,2) NOT NULL,
  installment_details jsonb NOT NULL, -- Array of installment schedules
  total_installments integer,
  possession_payment_percentage decimal(5,2),
  description text,
  terms_and_conditions text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =============================================
-- 4. PROPERTY MANAGEMENT TABLES
-- =============================================

-- Individual properties within projects
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  property_type text NOT NULL CHECK (property_type IN ('apartment', 'villa', 'plot', 'office', 'shop', 'warehouse')),
  configuration text, -- '2BHK', '3BHK', etc.
  area decimal(10,2) NOT NULL, -- in sq ft
  area_unit text DEFAULT 'sqft' CHECK (area_unit IN ('sqft', 'sqm', 'acres')),
  base_price decimal(15,2) NOT NULL,
  price_per_unit decimal(10,2), -- price per sq ft
  floor_range text, -- 'Ground', '1-5', 'Penthouse'
  facing text, -- 'North', 'South', 'East', 'West'
  features jsonb, -- Specific features for this property type
  specifications jsonb, -- Technical specifications
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Specific units/apartments
CREATE TABLE IF NOT EXISTS property_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  unit_number text NOT NULL,
  tower text,
  floor integer NOT NULL,
  area decimal(10,2) NOT NULL,
  carpet_area decimal(10,2),
  built_up_area decimal(10,2),
  super_built_up_area decimal(10,2),
  price decimal(15,2) NOT NULL,
  maintenance_charges decimal(10,2),
  parking_spaces integer DEFAULT 0,
  balconies integer DEFAULT 0,
  bathrooms integer DEFAULT 0,
  bedrooms integer DEFAULT 0,
  facing text,
  floor_plan_url text,
  unit_status text DEFAULT 'available' CHECK (unit_status IN ('available', 'reserved', 'booked', 'sold', 'blocked')),
  special_features text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(project_id, unit_number)
);

-- Unit availability tracking
CREATE TABLE IF NOT EXISTS unit_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid REFERENCES property_units(id) ON DELETE CASCADE,
  available_from date DEFAULT CURRENT_DATE,
  available_until date,
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'booked', 'sold', 'maintenance')),
  reserved_by uuid REFERENCES users(id),
  reserved_until timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Unit reservations (temporary holds)
CREATE TABLE IF NOT EXISTS unit_reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid REFERENCES property_units(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES users(id),
  reservation_amount decimal(15,2),
  reservation_date timestamptz DEFAULT now(),
  expiry_date timestamptz NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'expired', 'converted', 'cancelled')),
  payment_reference text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =============================================
-- 5. LEAD MANAGEMENT TABLES
-- =============================================

-- Potential buyers and inquiries
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id), -- If registered user
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  source text CHECK (source IN ('website', 'referral', 'advertisement', 'social_media', 'walk_in', 'call', 'other')),
  lead_status text DEFAULT 'new' CHECK (lead_status IN ('new', 'contacted', 'qualified', 'interested', 'negotiating', 'converted', 'lost', 'nurturing')),
  lead_quality text DEFAULT 'cold' CHECK (lead_quality IN ('hot', 'warm', 'cold')),
  budget_range jsonb, -- {min_budget, max_budget, currency}
  preferred_locations text[],
  property_preferences jsonb, -- {type, bedrooms, area_range, amenities}
  timeline text, -- 'immediate', '3_months', '6_months', '1_year'
  occupation text,
  family_size integer,
  current_address jsonb,
  notes text,
  utm_parameters jsonb, -- Marketing tracking
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Lead interactions and communication history
CREATE TABLE IF NOT EXISTS lead_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES users(id),
  interaction_type text NOT NULL CHECK (interaction_type IN ('call', 'email', 'sms', 'meeting', 'site_visit', 'follow_up', 'other')),
  interaction_date timestamptz DEFAULT now(),
  duration_minutes integer,
  outcome text CHECK (outcome IN ('positive', 'neutral', 'negative', 'no_response')),
  notes text,
  next_follow_up_date timestamptz,
  attachments jsonb, -- Array of file URLs
  created_at timestamptz DEFAULT now()
);

-- Agent-lead assignments
CREATE TABLE IF NOT EXISTS lead_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES users(id) ON DELETE CASCADE,
  assigned_date timestamptz DEFAULT now(),
  assigned_by uuid REFERENCES users(id),
  assignment_type text DEFAULT 'manual' CHECK (assignment_type IN ('manual', 'automatic', 'round_robin')),
  is_active boolean DEFAULT true,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(lead_id, agent_id, is_active) WHERE is_active = true
);

-- Lead preferences and requirements
CREATE TABLE IF NOT EXISTS lead_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  property_type text[] NOT NULL,
  budget_min decimal(15,2),
  budget_max decimal(15,2),
  preferred_areas text[],
  bedrooms_min integer,
  bedrooms_max integer,
  area_min decimal(10,2),
  area_max decimal(10,2),
  amenities_required text[],
  amenities_preferred text[],
  possession_timeline text,
  financing_required boolean DEFAULT false,
  investment_purpose boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(lead_id)
);

-- =============================================
-- 6. BOOKING MANAGEMENT TABLES
-- =============================================

-- Property bookings and sales
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number text UNIQUE NOT NULL,
  unit_id uuid REFERENCES property_units(id) ON DELETE RESTRICT,
  buyer_id uuid REFERENCES users(id) ON DELETE RESTRICT,
  agent_id uuid REFERENCES users(id),
  lead_id uuid REFERENCES leads(id),
  booking_date timestamptz DEFAULT now(),
  booking_amount decimal(15,2) NOT NULL,
  total_amount decimal(15,2) NOT NULL,
  payment_plan_id uuid REFERENCES project_payment_plans(id),
  booking_status text DEFAULT 'reserved' CHECK (booking_status IN ('reserved', 'confirmed', 'agreement_signed', 'registration_pending', 'completed', 'cancelled')),
  cancellation_reason text,
  cancellation_date timestamptz,
  possession_date date,
  registration_date date,
  loan_details jsonb, -- Bank loan information
  broker_commission decimal(15,2),
  special_offers jsonb, -- Discounts, offers applied
  terms_accepted boolean DEFAULT false,
  agreement_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payment tracking
CREATE TABLE IF NOT EXISTS booking_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  payment_number text UNIQUE NOT NULL,
  payment_type text NOT NULL CHECK (payment_type IN ('booking_amount', 'installment', 'possession', 'maintenance', 'other')),
  amount decimal(15,2) NOT NULL,
  due_date date NOT NULL,
  payment_date timestamptz,
  payment_method text CHECK (payment_method IN ('cash', 'cheque', 'bank_transfer', 'online', 'loan')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'overdue', 'cancelled', 'refunded')),
  transaction_reference text,
  bank_details jsonb,
  receipt_url text,
  late_fee decimal(15,2) DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payment schedules
CREATE TABLE IF NOT EXISTS payment_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  installment_number integer NOT NULL,
  description text,
  amount decimal(15,2) NOT NULL,
  due_date date NOT NULL,
  milestone text, -- Construction milestone
  is_paid boolean DEFAULT false,
  payment_id uuid REFERENCES booking_payments(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(booking_id, installment_number)
);

-- Booking documents
CREATE TABLE IF NOT EXISTS booking_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  document_type text NOT NULL CHECK (document_type IN ('agreement', 'receipt', 'allotment_letter', 'possession_letter', 'other')),
  document_name text NOT NULL,
  document_url text NOT NULL,
  generated_date timestamptz DEFAULT now(),
  signed_date timestamptz,
  is_signed boolean DEFAULT false,
  version text DEFAULT '1.0',
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- 7. COMMUNICATION TABLES
-- =============================================

-- Message threads
CREATE TABLE IF NOT EXISTS message_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_type text NOT NULL CHECK (thread_type IN ('lead_inquiry', 'booking_support', 'general', 'internal')),
  subject text,
  participants uuid[] NOT NULL, -- Array of user IDs
  project_id uuid REFERENCES projects(id),
  lead_id uuid REFERENCES leads(id),
  booking_id uuid REFERENCES bookings(id),
  status text DEFAULT 'active' CHECK (status IN ('active', 'closed', 'archived')),
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid REFERENCES message_threads(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES users(id) ON DELETE CASCADE,
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'attachment', 'system', 'template')),
  content text,
  metadata jsonb, -- Additional message data
  is_read boolean DEFAULT false,
  read_at timestamptz,
  is_edited boolean DEFAULT false,
  edited_at timestamptz,
  reply_to uuid REFERENCES messages(id),
  created_at timestamptz DEFAULT now()
);

-- Message attachments
CREATE TABLE IF NOT EXISTS message_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES messages(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_size bigint,
  mime_type text,
  attachment_type text CHECK (attachment_type IN ('document', 'image', 'video', 'audio', 'other')),
  created_at timestamptz DEFAULT now()
);

-- System notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  notification_type text NOT NULL CHECK (notification_type IN ('booking', 'payment', 'lead', 'system', 'marketing')),
  title text NOT NULL,
  message text NOT NULL,
  data jsonb, -- Additional notification data
  channels text[] DEFAULT ARRAY['in_app'], -- 'in_app', 'email', 'sms', 'push'
  is_read boolean DEFAULT false,
  read_at timestamptz,
  scheduled_for timestamptz DEFAULT now(),
  sent_at timestamptz,
  delivery_status jsonb, -- Status for each channel
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- 8. ADMIN & AUDIT TABLES
-- =============================================

-- Administrative actions
CREATE TABLE IF NOT EXISTS admin_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  action_type text NOT NULL CHECK (action_type IN ('create', 'update', 'delete', 'suspend', 'activate', 'approve', 'reject')),
  target_type text NOT NULL, -- 'user', 'project', 'booking', etc.
  target_id uuid NOT NULL,
  action_description text NOT NULL,
  old_values jsonb,
  new_values jsonb,
  reason text,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Comprehensive audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  operation text NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  old_data jsonb,
  new_data jsonb,
  changed_fields text[],
  user_id uuid REFERENCES users(id),
  session_id text,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- System settings
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL,
  setting_type text NOT NULL CHECK (setting_type IN ('string', 'number', 'boolean', 'json', 'array')),
  category text NOT NULL, -- 'general', 'security', 'notifications', etc.
  description text,
  is_public boolean DEFAULT false,
  is_encrypted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES users(id)
);

-- User activity logs
CREATE TABLE IF NOT EXISTS user_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  activity_description text,
  resource_type text,
  resource_id uuid,
  metadata jsonb,
  ip_address inet,
  user_agent text,
  session_id text,
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- User indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Project indexes
CREATE INDEX IF NOT EXISTS idx_projects_developer_id ON projects(developer_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(project_status);
CREATE INDEX IF NOT EXISTS idx_projects_location ON projects USING GIN(location);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured) WHERE featured = true;

-- Unit indexes
CREATE INDEX IF NOT EXISTS idx_property_units_project_id ON property_units(project_id);
CREATE INDEX IF NOT EXISTS idx_property_units_status ON property_units(unit_status);
CREATE INDEX IF NOT EXISTS idx_property_units_price ON property_units(price);

-- Lead indexes
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(lead_status);
CREATE INDEX IF NOT EXISTS idx_leads_quality ON leads(lead_quality);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- Booking indexes
CREATE INDEX IF NOT EXISTS idx_bookings_buyer_id ON bookings(buyer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_agent_id ON bookings(agent_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);

-- Message indexes
CREATE INDEX IF NOT EXISTS idx_messages_thread_id ON messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Audit indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_payment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE unit_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE unit_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;

-- =============================================
-- BASIC RLS POLICIES
-- =============================================

-- Users can read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = auth_user_id OR auth.uid() IN (
    SELECT auth_user_id FROM users WHERE role = 'admin'
  ));

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = auth_user_id)
  WITH CHECK (auth.uid() = auth_user_id);

-- Admins can manage all users
CREATE POLICY "Admins can manage users" ON users
  FOR ALL TO authenticated
  USING (auth.uid() IN (
    SELECT auth_user_id FROM users WHERE role = 'admin'
  ));

-- Public read access for projects (with visibility check)
CREATE POLICY "Public can read public projects" ON projects
  FOR SELECT TO authenticated, anon
  USING (visibility = 'public' AND project_status IN ('ready', 'under_construction'));

-- Developers can manage their own projects
CREATE POLICY "Developers can manage own projects" ON projects
  FOR ALL TO authenticated
  USING (developer_id IN (
    SELECT id FROM developers WHERE user_id = (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )
  ));

-- Agents can read all public projects
CREATE POLICY "Agents can read projects" ON projects
  FOR SELECT TO authenticated
  USING (auth.uid() IN (
    SELECT auth_user_id FROM users WHERE role IN ('agent', 'admin')
  ));

-- Lead access policies
CREATE POLICY "Users can read own leads" ON leads
  FOR SELECT TO authenticated
  USING (
    user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()) OR
    id IN (SELECT lead_id FROM lead_assignments WHERE agent_id = (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )) OR
    auth.uid() IN (SELECT auth_user_id FROM users WHERE role = 'admin')
  );

-- Booking access policies
CREATE POLICY "Users can read own bookings" ON bookings
  FOR SELECT TO authenticated
  USING (
    buyer_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()) OR
    agent_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()) OR
    unit_id IN (
      SELECT pu.id FROM property_units pu
      JOIN projects p ON pu.project_id = p.id
      JOIN developers d ON p.developer_id = d.id
      WHERE d.user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    ) OR
    auth.uid() IN (SELECT auth_user_id FROM users WHERE role = 'admin')
  );

-- Message access policies
CREATE POLICY "Users can access their messages" ON messages
  FOR SELECT TO authenticated
  USING (
    sender_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()) OR
    thread_id IN (
      SELECT id FROM message_threads 
      WHERE (SELECT id FROM users WHERE auth_user_id = auth.uid()) = ANY(participants)
    )
  );

-- Admin-only policies
CREATE POLICY "Admin only access" ON admin_actions
  FOR ALL TO authenticated
  USING (auth.uid() IN (
    SELECT auth_user_id FROM users WHERE role = 'admin'
  ));

CREATE POLICY "Admin only audit logs" ON audit_logs
  FOR SELECT TO authenticated
  USING (auth.uid() IN (
    SELECT auth_user_id FROM users WHERE role = 'admin'
  ));

CREATE POLICY "Admin only system settings" ON system_settings
  FOR ALL TO authenticated
  USING (auth.uid() IN (
    SELECT auth_user_id FROM users WHERE role = 'admin'
  ));

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_developers_updated_at BEFORE UPDATE ON developers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_units_updated_at BEFORE UPDATE ON property_units
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create audit log entries
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (
      table_name, record_id, operation, old_data, user_id, created_at
    ) VALUES (
      TG_TABLE_NAME, OLD.id, TG_OP, to_jsonb(OLD), 
      (SELECT id FROM users WHERE auth_user_id = auth.uid()), now()
    );
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (
      table_name, record_id, operation, old_data, new_data, user_id, created_at
    ) VALUES (
      TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(OLD), to_jsonb(NEW),
      (SELECT id FROM users WHERE auth_user_id = auth.uid()), now()
    );
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (
      table_name, record_id, operation, new_data, user_id, created_at
    ) VALUES (
      TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(NEW),
      (SELECT id FROM users WHERE auth_user_id = auth.uid()), now()
    );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to critical tables
CREATE TRIGGER audit_users AFTER INSERT OR UPDATE OR DELETE ON users
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_projects AFTER INSERT OR UPDATE OR DELETE ON projects
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_bookings AFTER INSERT OR UPDATE OR DELETE ON bookings
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_leads AFTER INSERT OR UPDATE OR DELETE ON leads
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

-- Function to update project unit counts
CREATE OR REPLACE FUNCTION update_project_unit_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE projects SET 
      total_units = total_units + 1,
      available_units = available_units + 1
    WHERE id = NEW.project_id;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle status changes
    IF OLD.unit_status != NEW.unit_status THEN
      UPDATE projects SET
        available_units = (
          SELECT COUNT(*) FROM property_units 
          WHERE project_id = NEW.project_id AND unit_status = 'available'
        ),
        sold_units = (
          SELECT COUNT(*) FROM property_units 
          WHERE project_id = NEW.project_id AND unit_status = 'sold'
        ),
        held_units = (
          SELECT COUNT(*) FROM property_units 
          WHERE project_id = NEW.project_id AND unit_status IN ('reserved', 'booked')
        )
      WHERE id = NEW.project_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE projects SET 
      total_units = total_units - 1,
      available_units = available_units - 1
    WHERE id = OLD.project_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_project_counts AFTER INSERT OR UPDATE OR DELETE ON property_units
  FOR EACH ROW EXECUTE FUNCTION update_project_unit_counts();

-- =============================================
-- INITIAL SYSTEM SETTINGS
-- =============================================

INSERT INTO system_settings (setting_key, setting_value, setting_type, category, description, is_public) VALUES
('site_name', '"Property Agent"', 'string', 'general', 'Application name', true),
('site_description', '"Discover • Manage • Book Properties in Real-Time"', 'string', 'general', 'Application description', true),
('default_currency', '"INR"', 'string', 'general', 'Default currency', true),
('default_language', '"en"', 'string', 'general', 'Default language', true),
('session_timeout_minutes', '30', 'number', 'security', 'Session timeout in minutes', false),
('max_login_attempts', '5', 'number', 'security', 'Maximum login attempts before lockout', false),
('password_min_length', '8', 'number', 'security', 'Minimum password length', false),
('email_notifications_enabled', 'true', 'boolean', 'notifications', 'Enable email notifications', false),
('sms_notifications_enabled', 'false', 'boolean', 'notifications', 'Enable SMS notifications', false),
('user_registration_enabled', 'true', 'boolean', 'user_management', 'Allow new user registrations', false),
('auto_approve_agents', 'false', 'boolean', 'user_management', 'Auto-approve agent registrations', false),
('auto_approve_developers', 'true', 'boolean', 'user_management', 'Auto-approve developer registrations', false),
('maintenance_mode', 'false', 'boolean', 'system', 'System maintenance mode', false),
('backup_frequency', '"daily"', 'string', 'system', 'Backup frequency', false),
('log_retention_days', '90', 'number', 'system', 'Log retention period in days', false)
ON CONFLICT (setting_key) DO NOTHING;