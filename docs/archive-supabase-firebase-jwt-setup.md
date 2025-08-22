# Supabase + Firebase JWT Configuration Guide

## Issue Identified

The error "Unregistered Firebase Auth JWT issuer" indicates that Supabase is not configured to accept JWT tokens from your Firebase project. This is a critical configuration step that must be completed in the Supabase dashboard.

## Required Configuration Steps

### 1. Configure Supabase JWT Settings

You need to configure Supabase to accept Firebase JWT tokens. This must be done in the Supabase Dashboard:

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: `raakccipdxmpzvejyzcn`
3. **Navigate to**: Settings → API → JWT Settings
4. **Configure the following**:

#### JWT Secret Configuration

Instead of using a JWT secret, you need to configure Supabase to validate Firebase JWT tokens using Firebase's public keys.

**Option A: Using Firebase Project ID (Recommended)**

Add this configuration to your Supabase project settings:

```sql
-- Set Firebase project ID for JWT validation
ALTER DATABASE postgres SET app.settings.jwt_aud = 'v4salesai';
ALTER DATABASE postgres SET app.settings.jwt_iss = 'https://securetoken.google.com/v4salesai';
```

**Option B: Manual JWT Configuration**

If the above doesn't work, you'll need to configure custom JWT validation:

1. Go to **Settings → API → JWT Settings**
2. Set **JWT Secret** to: `your-firebase-project-secret` (this might need to be obtained from Firebase)
3. Set **JWT Algorithm** to: `RS256`

### 2. Alternative: Use Supabase Auth with Firebase Integration

If direct JWT integration proves complex, consider using Supabase's built-in Firebase integration:

1. **Go to**: Authentication → Settings → Auth Providers
2. **Enable Firebase Provider**
3. **Configure with your Firebase credentials**

### 3. Environment Variables Update

Ensure your Firebase project ID matches exactly:

```env
NEXT_PUBLIC_FIREBASE_PROJECT_ID=v4salesai
```

### 4. Test the Configuration

After making these changes:

1. Restart your Supabase project (if needed)
2. Test the integration using the test page
3. Check for JWT validation errors

## Current Project Details

- **Firebase Project ID**: `v4salesai`
- **Firebase Auth Domain**: `v4salesai.firebaseapp.com`
- **Supabase Project**: `raakccipdxmpzvejyzcn`
- **Expected JWT Issuer**: `https://securetoken.google.com/v4salesai`

## Manual Configuration Steps

If you have access to the Supabase SQL editor, you can try running these commands:

```sql
-- Configure JWT settings for Firebase integration
ALTER DATABASE postgres SET app.settings.jwt_aud = 'v4salesai';
ALTER DATABASE postgres SET app.settings.jwt_iss = 'https://securetoken.google.com/v4salesai';

-- Verify the settings
SELECT 
  current_setting('app.settings.jwt_aud', true) as jwt_audience,
  current_setting('app.settings.jwt_iss', true) as jwt_issuer;
```

## Alternative Solution: Custom JWT Validation

If the above doesn't work, you might need to implement custom JWT validation in your RLS policies:

```sql
-- Update RLS policies to use custom JWT validation
DROP POLICY IF EXISTS "Users can only access their own profile" ON user_profiles;
CREATE POLICY "Users can only access their own profile" 
ON user_profiles 
FOR ALL 
USING (
  firebase_uid = COALESCE(
    auth.jwt()->>'user_id',
    auth.jwt()->>'sub'
  )
);

-- Similar update for test_data table
DROP POLICY IF EXISTS "Users can only access their own test data" ON test_data;
CREATE POLICY "Users can only access their own test data" 
ON test_data 
FOR ALL 
USING (
  firebase_uid = COALESCE(
    auth.jwt()->>'user_id',
    auth.jwt()->>'sub'
  )
);
```

## Verification Steps

1. **Check JWT Token Structure**: Use the test page to examine the JWT token claims
2. **Verify Issuer**: Ensure the `iss` claim matches `https://securetoken.google.com/v4salesai`
3. **Check Audience**: Ensure the `aud` claim matches your Firebase project ID
4. **Test RLS Policies**: Verify that data isolation works correctly

## Next Steps

1. **Configure Supabase JWT settings** in the dashboard
2. **Test the integration** using the test page
3. **Verify user isolation** works correctly
4. **Update documentation** once working

## Support Resources

- [Supabase JWT Configuration](https://supabase.com/docs/guides/auth/auth-helpers/auth-ui)
- [Firebase JWT Token Structure](https://firebase.google.com/docs/auth/admin/verify-id-tokens)
- [Supabase RLS Policies](https://supabase.com/docs/guides/auth/row-level-security)

## Status

❌ **Current Status**: JWT issuer not configured in Supabase
🔧 **Required Action**: Configure Supabase to accept Firebase JWT tokens
✅ **Expected Result**: Successful authentication and data operations
