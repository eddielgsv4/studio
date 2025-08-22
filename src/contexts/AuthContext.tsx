
"use client";

// Re-export everything from SupabaseAuthContext for backward compatibility
export { 
  SupabaseAuthProvider as AuthProvider,
  useSupabaseAuth as useAuth,
  withSupabaseAuth as withAuth
} from './SupabaseAuthContext';

// Re-export types for backward compatibility
export type { SupabaseAuthContextType as AuthContextType } from './SupabaseAuthContext';
