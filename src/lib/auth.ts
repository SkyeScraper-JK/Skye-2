import { supabase } from './supabase';

// Mock authentication for development
// In production, this would use real Supabase auth
export const getCurrentUser = async () => {
  try {
    // For now, return mock user based on current route or role switcher
    const currentPath = window.location.pathname;
    
    if (currentPath.startsWith('/admin')) {
      return {
        id: '1',
        email: 'admin@propertyagent.com',
        user_metadata: {
          name: 'System Administrator',
          role: 'admin'
        }
      };
    } else if (currentPath.startsWith('/developer')) {
      return {
        id: '1',
        email: 'developer@propertyagent.com',
        user_metadata: {
          name: 'Rajesh Sharma',
          role: 'developer'
        }
      };
    } else {
      return {
        id: '1',
        email: 'agent@propertyagent.com',
        user_metadata: {
          name: 'Arjun Mehta',
          role: 'agent'
        }
      };
    }
  } catch (error) {
    console.error('Error getting current user:', error);
    // Return a default user to prevent undefined errors
    return {
      id: '1',
      email: 'default@propertyagent.com',
      user_metadata: {
        name: 'Default User',
        role: 'developer'
      }
    };
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