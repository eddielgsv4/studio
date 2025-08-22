"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/auth/supabase';
import { useRouter, usePathname } from 'next/navigation';

export interface SupabaseAuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, options?: { data?: { name?: string } }) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: { name?: string; email?: string }) => Promise<{ error: any | null }>;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

export const SupabaseAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting initial session:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle different auth events
        switch (event) {
          case 'SIGNED_IN':
            console.log('User signed in:', session?.user?.email);
            // Create or update user profile
            if (session?.user) {
              await createOrUpdateUserProfile(session.user);
            }
            break;
          case 'SIGNED_OUT':
            console.log('User signed out');
            break;
          case 'TOKEN_REFRESHED':
            console.log('Token refreshed for user:', session?.user?.email);
            break;
          case 'USER_UPDATED':
            console.log('User updated:', session?.user?.email);
            break;
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const createOrUpdateUserProfile = async (user: User) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.user_metadata?.full_name || null,
          updated_at: new Date().toISOString(),
        }, { 
          onConflict: 'user_id' 
        });

      if (error) {
        console.error('Error creating/updating user profile:', error);
      } else {
        console.log('User profile created/updated successfully');
      }
    } catch (error) {
      console.error('Error in createOrUpdateUserProfile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { error };
    } catch (error) {
      console.error('Error in signIn:', error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, options?: { data?: { name?: string } }) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: options?.data || {},
        },
      });

      return { error };
    } catch (error) {
      console.error('Error in signUp:', error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error in signOut:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      return { error };
    } catch (error) {
      console.error('Error in resetPassword:', error);
      return { error: error as AuthError };
    }
  };

  const updateProfile = async (updates: { name?: string; email?: string }) => {
    try {
      if (!user) {
        return { error: { message: 'No user logged in' } as AuthError };
      }

      // Update auth user metadata
      const { error: authError } = await supabase.auth.updateUser({
        email: updates.email,
        data: {
          name: updates.name,
          full_name: updates.name,
        },
      });

      if (authError) {
        return { error: authError };
      }

      // Update user profile in database
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          name: updates.name,
          email: updates.email,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      return { error: profileError };
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return { error: error as AuthError };
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export const useSupabaseAuth = (): SupabaseAuthContextType => {
  const context = useContext(SupabaseAuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};

export const withSupabaseAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const WithSupabaseAuthComponent = (props: P) => {
    const { user, loading } = useSupabaseAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      if (!loading && !user && pathname !== '/login' && pathname !== '/cadastro') {
        localStorage.setItem('redirectUrl', pathname);
        router.replace('/login');
      }
    }, [user, loading, router, pathname]);

    if (loading) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="flex h-screen items-center justify-center">
          <p>Redirecting to login...</p>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
  
  WithSupabaseAuthComponent.displayName = `WithSupabaseAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return WithSupabaseAuthComponent;
};
