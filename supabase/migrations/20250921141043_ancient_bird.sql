/*
  # Create Required Users for Development

  1. New Users
    - Creates developer, agent, and admin users with IDs 1, 2, 3
    - Ensures foreign key constraints are satisfied
    - Uses mock data that matches the frontend expectations

  2. Data Integrity
    - Provides the missing user records that foreign keys reference
    - Matches the mock user IDs used throughout the application
    - Includes proper roles and basic profile information
*/

-- Insert required users to satisfy foreign key constraints
INSERT INTO users (id, name, email, password, role, phone, status, created_at) VALUES
(1, 'Rajesh Sharma', 'developer@propertyagent.com', 'hashed_password_1', 'developer', '+91-9876543210', 'active', now()),
(2, 'Arjun Mehta', 'agent@propertyagent.com', 'hashed_password_2', 'agent', '+91-9876543211', 'active', now()),
(3, 'System Administrator', 'admin@propertyagent.com', 'hashed_password_3', 'admin', '+91-9876543212', 'active', now())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  phone = EXCLUDED.phone,
  status = EXCLUDED.status;

-- Reset the sequence to ensure future inserts don't conflict
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));