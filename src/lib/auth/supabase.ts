import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with native Supabase Auth
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Enable Supabase Auth
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-native-auth',
    },
  },
});

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

// Utility function to get user profile from Supabase using Supabase auth
export const getUserProfile = async (user_id: string) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user_id)
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

// Utility function to create user profile in Supabase
export const createUserProfile = async (userData: {
  user_id: string;
  email?: string;
  name?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userData.user_id,
        email: userData.email,
        name: userData.name,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating/updating user profile:', error);
    throw error;
  }
};

export default supabase;
