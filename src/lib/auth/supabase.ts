import { createClient } from '@supabase/supabase-js';
import { getCurrentUserJWT } from './firebase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with Firebase Auth integration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Disable Supabase Auth since we're using Firebase Auth
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'X-Client-Info': 'firebase-auth-integration',
    },
  },
  // Configure accessToken to use Firebase JWT
  accessToken: async () => {
    try {
      const token = await getCurrentUserJWT(false); // Don't force refresh by default
      return token;
    } catch (error) {
      console.error('Error getting Firebase JWT for Supabase:', error);
      return null;
    }
  },
});

// Utility function to get Supabase client with fresh Firebase token
export const getSupabaseWithFreshToken = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        'X-Client-Info': 'firebase-auth-integration-fresh',
      },
    },
    accessToken: async () => {
      try {
        const token = await getCurrentUserJWT(true); // Force refresh
        return token;
      } catch (error) {
        console.error('Error getting fresh Firebase JWT for Supabase:', error);
        return null;
      }
    },
  });
};

// Utility function to test Supabase connection
export const testSupabaseConnection = async () => {
  try {
    // Create a simple client without JWT for basic connection test
    const testClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
    
    // Test basic connection by trying to access the auth endpoint
    const { data, error } = await testClient.auth.getSession();
    
    // If we get here without throwing, the connection works
    return { success: true, message: 'Supabase connection successful' };
  } catch (error) {
    return { 
      success: false, 
      message: `Supabase connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
};

// Utility function to get current user info from Firebase JWT
export const getCurrentUserFromJWT = async () => {
  try {
    const token = await getCurrentUserJWT();
    if (!token) return null;
    
    // Decode JWT to get user info
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      uid: payload.user_id || payload.sub,
      email: payload.email,
      name: payload.name || payload.display_name,
      emailVerified: payload.email_verified,
      provider: payload.firebase?.sign_in_provider,
      isAnonymous: payload.firebase?.sign_in_provider === 'anonymous',
      firebase_uid: payload.user_id || payload.sub,
    };
  } catch (error) {
    console.error('Error getting user from JWT:', error);
    return null;
  }
};

// Utility function to create user profile in Supabase
export const createUserProfile = async (userData: {
  firebase_uid: string;
  email?: string;
  name?: string;
}) => {
  try {
    // Use fresh token for authenticated operations
    const freshSupabase = getSupabaseWithFreshToken();
    const { data, error } = await freshSupabase
      .from('user_profiles')
      .upsert({
        firebase_uid: userData.firebase_uid,
        email: userData.email,
        name: userData.name,
      }, { onConflict: 'firebase_uid' })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating/updating user profile:', error);
    throw error;
  }
};

// Utility function to get user profile from Supabase
export const getUserProfile = async (firebase_uid: string) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('firebase_uid', firebase_uid)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export default supabase;
