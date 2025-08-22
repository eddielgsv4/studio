import { supabase } from './supabase';
import { User, AuthError } from '@supabase/supabase-js';

// Utility function to get current user
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting current user:', error);
      return null;
    }
    return user;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
};

// Utility function to get current session
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting current session:', error);
      return null;
    }
    return session;
  } catch (error) {
    console.error('Error in getCurrentSession:', error);
    return null;
  }
};

// Utility function to check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return !!user;
};

// Utility function to get user profile with auth check
export const getUserProfileWithAuth = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error getting user profile with auth:', error);
    throw error;
  }
};

// Utility function to update user profile with auth check
export const updateUserProfileWithAuth = async (updates: {
  name?: string;
  email?: string;
  [key: string]: any;
}) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user profile with auth:', error);
    throw error;
  }
};

// Utility function to handle password reset
export const requestPasswordReset = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    return { error };
  } catch (error) {
    console.error('Error requesting password reset:', error);
    return { error: error as AuthError };
  }
};

// Utility function to update password
export const updatePassword = async (newPassword: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    return { error };
  } catch (error) {
    console.error('Error updating password:', error);
    return { error: error as AuthError };
  }
};

// Utility function to resend email confirmation
export const resendEmailConfirmation = async (email: string) => {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });

    return { error };
  } catch (error) {
    console.error('Error resending email confirmation:', error);
    return { error: error as AuthError };
  }
};

// Utility function to handle email confirmation
export const confirmEmail = async (token: string, type: 'signup' | 'recovery' = 'signup') => {
  try {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: type,
    });

    return { error };
  } catch (error) {
    console.error('Error confirming email:', error);
    return { error: error as AuthError };
  }
};

// Utility function to sign in with OAuth providers
export const signInWithOAuth = async (provider: 'google' | 'github' | 'facebook') => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    return { error };
  } catch (error) {
    console.error(`Error signing in with ${provider}:`, error);
    return { error: error as AuthError };
  }
};

// Utility function to handle auth errors
export const getAuthErrorMessage = (error: AuthError | null): string => {
  if (!error) return '';

  switch (error.message) {
    case 'Invalid login credentials':
      return 'Email ou senha incorretos. Verifique suas credenciais e tente novamente.';
    case 'Email not confirmed':
      return 'Email não confirmado. Verifique sua caixa de entrada e confirme seu email.';
    case 'User already registered':
      return 'Este email já está cadastrado. Tente fazer login ou recuperar sua senha.';
    case 'Password should be at least 6 characters':
      return 'A senha deve ter pelo menos 6 caracteres.';
    case 'Unable to validate email address: invalid format':
      return 'Formato de email inválido. Verifique o email digitado.';
    case 'Signup is disabled':
      return 'Cadastro temporariamente desabilitado. Tente novamente mais tarde.';
    case 'Email rate limit exceeded':
      return 'Muitas tentativas de email. Aguarde alguns minutos antes de tentar novamente.';
    default:
      return error.message || 'Ocorreu um erro inesperado. Tente novamente.';
  }
};

// Utility function to validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Utility function to validate password strength
export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 6) {
    return { isValid: false, message: 'A senha deve ter pelo menos 6 caracteres.' };
  }
  
  if (password.length > 72) {
    return { isValid: false, message: 'A senha deve ter no máximo 72 caracteres.' };
  }

  // Check for at least one letter and one number
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  if (!hasLetter || !hasNumber) {
    return { isValid: false, message: 'A senha deve conter pelo menos uma letra e um número.' };
  }

  return { isValid: true, message: 'Senha válida.' };
};

// Utility function for session management
export const refreshSession = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error('Error refreshing session:', error);
      return { session: null, error };
    }
    return { session: data.session, error: null };
  } catch (error) {
    console.error('Error in refreshSession:', error);
    return { session: null, error: error as AuthError };
  }
};

// Utility function to check if session is expired
export const isSessionExpired = async (): Promise<boolean> => {
  try {
    const session = await getCurrentSession();
    if (!session) return true;

    const now = Math.floor(Date.now() / 1000);
    return session.expires_at ? session.expires_at < now : false;
  } catch (error) {
    console.error('Error checking session expiry:', error);
    return true;
  }
};
