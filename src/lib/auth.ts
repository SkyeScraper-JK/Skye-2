import { supabase } from './supabase';

// Set mock session for Supabase client to handle RLS policies
const setMockSession = async (userId: string, email: string, role: string) => {
  // Create a mock session that Supabase RLS can use
  const mockSession = {
    access_token: 'mock-jwt-token',
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    token_type: 'bearer',
    user: {
      id: userId,
      email: email,
      user_metadata: { role },
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  };

  // Set the session in Supabase client
  await supabase.auth.setSession(mockSession);
};

// Mock authentication for development
// In production, this would use real Supabase auth
export const getCurrentUser = async () => {
  try {
    // For now, return mock user based on current route or role switcher
    const currentPath = window.location.pathname;
    
    let userId: string;
    let email: string;
    let role: string;
    let name: string;

    if (currentPath.startsWith('/admin')) {
      userId = '1';
      email = 'admin@propertyagent.com';
      role = 'admin';
      name = 'System Administrator';
    } else if (currentPath.startsWith('/developer')) {
      userId = '1';
      email = 'developer@propertyagent.com';
      role = 'developer';
      name = 'Rajesh Sharma';
    } else {
      userId = '1';
      email = 'agent@propertyagent.com';
      role = 'agent';
      name = 'Arjun Mehta';
    }

    // Set mock session for Supabase RLS
    await setMockSession(userId, email, role);

    return {
      id: userId,
      email: email,
      user_metadata: {
        name: name,
        role: role
      }
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    // Return a default user to prevent undefined errors
    const defaultUser = {
      id: '1',
      email: 'default@propertyagent.com',
      user_metadata: {
        name: 'Default User',
        role: 'developer'
      }
    };

    // Set mock session for default user
    await setMockSession(defaultUser.id, defaultUser.email, defaultUser.user_metadata.role);
    return defaultUser;
  }
};

// Mock sign in function
export const signIn = async (email: string, password: string) => {
  // In production, this would use supabase.auth.signInWithPassword
  console.log('Mock sign in:', email);
  return { user: await getCurrentUser(), error: null };
};

// Get current session
export const getSession = async () => {
  const user = await getCurrentUser();
  return {
    data: {
      session: user ? {
        user,
        access_token: 'mock-token'
      } : null
    },
    error: null
  };
};

// For development, we'll simulate authentication
export const ensureAuthenticated = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  return user;
};