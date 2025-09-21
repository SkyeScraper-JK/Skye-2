/*
  # Completely Disable RLS for Development

  1. Security Changes
    - Disable RLS on all tables that are causing issues
    - This is a temporary development solution
    - In production, proper RLS policies should be implemented

  2. Tables Updated
    - projects: RLS disabled
    - units: RLS disabled  
    - upload_logs: RLS disabled
    - notifications: RLS disabled
    - promotions: RLS disabled
    - leads: RLS disabled
    - bookings: RLS disabled
    - agent_property_interest: RLS disabled
    - audit_logs: RLS disabled
*/

-- Disable RLS on projects table
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;

-- Disable RLS on units table  
ALTER TABLE units DISABLE ROW LEVEL SECURITY;

-- Disable RLS on upload_logs table
ALTER TABLE upload_logs DISABLE ROW LEVEL SECURITY;

-- Disable RLS on notifications table
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;

-- Disable RLS on promotions table
ALTER TABLE promotions DISABLE ROW LEVEL SECURITY;

-- Disable RLS on leads table
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;

-- Disable RLS on bookings table
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;

-- Disable RLS on agent_property_interest table
ALTER TABLE agent_property_interest DISABLE ROW LEVEL SECURITY;

-- Disable RLS on audit_logs table
ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;