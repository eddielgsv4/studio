# Firebase Auth to Supabase Auth Migration Plan

## Overview

This document outlines the complete migration plan from Firebase Authentication to Supabase Authentication for the V4 SalesAI project. The current setup uses Firebase Auth with Supabase for data storage, but we want to migrate to a pure Supabase solution.

## Current State Analysis

### Files Using Firebase Auth:
1. **Core Auth Files:**
   - `src/contexts/AuthContext.tsx` - Main auth context using Firebase
   - `src/lib/auth/firebase.ts` - Firebase configuration and utilities
   - `src/lib/auth/supabase.ts` - Supabase client configured to use Firebase JWT

2. **Authentication Pages:**
   - `src/app/login/page.tsx` - Uses `signInWithEmailAndPassword` from Firebase
   - `src/app/cadastro/page.tsx` - Uses `createUserWithEmailAndPassword` from Firebase
   - `src/app/diagnostico/conta/page.tsx` - Uses Firebase auth for account creation

3. **Components Using Auth:**
   - `src/components/landing/Header.tsx` - Uses `useAuth` hook and `signOut`
   - Multiple pages using `useAuth` hook and `withAuth` HOC

4. **Dependencies:**
   - `firebase` package (v11.9.1) in package.json
   - `@supabase/supabase-js` (v2.55.0) already installed

## Migration Phases

### Phase 1: Create New Supabase Auth Infrastructure

#### 1.1 Create New Supabase Auth Context
**File:** `src/contexts/SupabaseAuthContext.tsx`
- Replace Firebase User type with Supabase User type
- Implement Supabase auth methods (signIn, signUp, signOut)
- Handle auth state changes with Supabase's `onAuthStateChange`
- Provide loading states and error handling
- Include user profile management

#### 1.2 Update Supabase Configuration
**File:** `src/lib/auth/supabase.ts`
- Remove Firebase JWT integration
- Configure Supabase client for native auth
- Remove Firebase-specific utilities
- Simplify client configuration

#### 1.3 Create Supabase Auth Utilities
**File:** `src/lib/auth/supabase-auth.ts`
- Supabase-specific auth functions
- User profile management utilities
- Session handling functions
- Password reset functionality
- Email confirmation handling

### Phase 2: Update Authentication Pages

#### 2.1 Login Page Migration
**File:** `src/app/login/page.tsx`
- Replace `signInWithEmailAndPassword` with `supabase.auth.signInWithPassword`
- Update error handling for Supabase error codes
- Replace Firebase auth imports with Supabase
- Update form validation and user feedback

#### 2.2 Registration Page Migration
**File:** `src/app/cadastro/page.tsx`
- Replace `createUserWithEmailAndPassword` with `supabase.auth.signUp`
- Handle email confirmation flow
- Update user profile creation process
- Implement proper error handling

#### 2.3 Account Page Migration
**File:** `src/app/diagnostico/conta/page.tsx`
- Update to use Supabase auth methods
- Modify user profile handling
- Update account creation flow

### Phase 3: Update Components and Pages

#### 3.1 Auth Context Migration
- Replace all `useAuth` imports to use new Supabase context
- Update `withAuth` HOC for Supabase authentication
- Modify auth state checks throughout the application
- Update protected route logic

#### 3.2 Component Updates
**Files to update:**
- `src/components/landing/Header.tsx` - Update sign-out functionality
- All pages using `useAuth` hook
- All components using `withAuth` HOC
- Update authentication checks and user data access

#### 3.3 Page-by-Page Updates
**Files requiring auth updates:**
- `src/app/(auth)/dashboard/page.tsx`
- `src/app/(auth)/diagnostico/produto/page.tsx`
- `src/app/(auth)/diagnostico/empresa/page.tsx`
- `src/app/projetos/page.tsx`
- `src/app/diagnostico/inicio/page.tsx`
- All other pages using authentication

### Phase 4: Database Schema Updates

#### 4.1 User Profiles Table Migration
- Change `firebase_uid` column to `user_id` (UUID)
- Update RLS policies to use `auth.uid()` instead of JWT claims
- Create migration script for existing user data
- Update table constraints and indexes

#### 4.2 Update All Related Tables
- Update foreign key references from `firebase_uid` to `user_id`
- Modify RLS policies across all tables
- Update any Firebase UID references in existing data
- Ensure data integrity during migration

#### 4.3 RLS Policy Updates
**Tables to update:**
- `user_profiles` - Update policy to use `auth.uid()`
- `test_data` - Update user isolation policy
- Any other tables with user-specific data

### Phase 5: Environment and Dependencies

#### 5.1 Environment Variables Cleanup
- Remove Firebase environment variables:
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`
- Keep only Supabase variables
- Update any Firebase-specific configurations

#### 5.2 Dependencies Cleanup
- Remove `firebase` package from package.json
- Remove Firebase-related imports throughout codebase
- Clean up unused Firebase utilities
- Update import statements

### Phase 6: Testing and Cleanup

#### 6.1 Update Test Infrastructure
**File:** `src/app/diagnostico/test/page.tsx`
- Replace Firebase auth tests with Supabase auth tests
- Update integration tests
- Test user isolation and data access
- Verify authentication flows

#### 6.2 Remove Firebase Files
- Delete `src/lib/auth/firebase.ts`
- Remove or update Firebase documentation files:
  - `docs/supabase-firebase-integration.md`
  - `docs/supabase-firebase-jwt-setup.md`
  - `docs/CRITICAL-JWT-SETUP-REQUIRED.md`
- Clean up any remaining Firebase references

#### 6.3 Documentation Updates
- Update README.md with new auth setup
- Create Supabase-only setup documentation
- Update development and deployment guides

## Key Considerations

### Authentication Features to Migrate:
- ✅ Email/Password authentication
- ✅ User registration with email confirmation
- ✅ Password reset functionality
- ✅ User profile management
- ⚠️ Google OAuth (needs Supabase OAuth setup)
- ⚠️ Session management and persistence

### Database Changes Required:
- Update RLS policies from `auth.jwt()->>'user_id'` to `auth.uid()`
- Change user identification from Firebase UID to Supabase UUID
- Migrate existing user data if any exists
- Ensure referential integrity

### Potential Challenges:
1. **User Data Migration** - Need to handle existing users gracefully
2. **OAuth Setup** - Google sign-in needs to be reconfigured in Supabase dashboard
3. **Session Persistence** - Different session handling between Firebase and Supabase
4. **Error Handling** - Different error codes and messages require updates
5. **Email Templates** - Need to configure Supabase email templates
6. **Rate Limiting** - Different rate limiting policies

## Migration Strategy

### Recommended Approach:
1. **Parallel Implementation** - Build Supabase auth alongside Firebase
2. **Feature Flag** - Use environment variable to switch between auth systems
3. **Gradual Migration** - Migrate users gradually or provide migration path
4. **Rollback Plan** - Keep Firebase auth as backup during initial deployment

### Testing Strategy:
1. **Unit Tests** - Test all auth functions individually
2. **Integration Tests** - Test complete auth flows
3. **User Acceptance Testing** - Test with real user scenarios
4. **Performance Testing** - Ensure auth performance meets requirements

## Post-Migration Tasks

1. **Monitor Authentication Metrics** - Track sign-in success rates
2. **User Feedback Collection** - Gather feedback on new auth experience
3. **Performance Optimization** - Optimize auth flows based on usage patterns
4. **Security Audit** - Ensure all security best practices are followed
5. **Documentation Maintenance** - Keep auth documentation up to date

## Success Criteria

- [ ] All Firebase auth dependencies removed
- [ ] All authentication flows working with Supabase
- [ ] User data properly migrated and accessible
- [ ] RLS policies correctly protecting user data
- [ ] No authentication-related errors in production
- [ ] Performance meets or exceeds current auth system
- [ ] All tests passing
- [ ] Documentation updated and accurate

## Timeline Estimate

- **Phase 1-2**: 2-3 days (Infrastructure and auth pages)
- **Phase 3**: 2-3 days (Component updates)
- **Phase 4**: 1-2 days (Database migration)
- **Phase 5**: 1 day (Cleanup)
- **Phase 6**: 1-2 days (Testing and documentation)

**Total Estimated Time**: 7-11 days

## Risk Mitigation

1. **Backup Strategy** - Full database backup before migration
2. **Rollback Plan** - Ability to quickly revert to Firebase auth
3. **Staged Deployment** - Deploy to staging environment first
4. **User Communication** - Inform users of any temporary disruptions
5. **Monitoring** - Enhanced monitoring during migration period
