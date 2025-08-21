# 🚨 CRITICAL: Supabase JWT Configuration Required

## Current Issue

The Firebase + Supabase integration is **NOT WORKING** due to missing JWT configuration in Supabase.

**Error**: `Unregistered Firebase Auth JWT issuer`

## Required Action (URGENT)

You must configure Supabase to accept Firebase JWT tokens. This **CANNOT** be done via code - it requires manual configuration in the Supabase Dashboard.

## Step-by-Step Instructions

### 1. Access Supabase Dashboard
1. Go to: https://supabase.com/dashboard
2. Select project: `raakccipdxmpzvejyzcn`

### 2. Configure JWT Settings
1. Navigate to: **Settings** → **API** → **JWT Settings**
2. Look for **JWT Secret** or **Custom JWT** configuration
3. Configure for Firebase integration:

**Option A: Third-party Auth Integration**
1. Go to: **Authentication** → **Settings** → **Auth Providers**
2. Look for **Firebase** or **Custom JWT** provider
3. Enable and configure with:
   - **Issuer**: `https://securetoken.google.com/v4salesai`
   - **Audience**: `v4salesai`
   - **Algorithm**: `RS256`

**Option B: Manual JWT Configuration**
If there's a custom JWT section:
1. Set **JWT Issuer**: `https://securetoken.google.com/v4salesai`
2. Set **JWT Audience**: `v4salesai`
3. Set **Algorithm**: `RS256`
4. Enable **Firebase Auth** integration

### 3. Alternative: Use Supabase's Firebase Integration
1. Go to: **Authentication** → **Settings**
2. Look for **Third-party Auth** or **External Auth Providers**
3. Enable **Firebase** integration
4. Provide your Firebase project credentials

### 4. Verify Configuration
After configuration:
1. Test using: `http://localhost:3000/diagnostico/test`
2. Sign in with Firebase
3. Check if Supabase operations work

## Current Project Details

- **Firebase Project ID**: `v4salesai`
- **Firebase Issuer**: `https://securetoken.google.com/v4salesai`
- **Supabase Project**: `raakccipdxmpzvejyzcn`
- **Test Page**: `http://localhost:3000/diagnostico/test`

## What's Working vs Not Working

✅ **Working**:
- Firebase authentication
- JWT token generation
- User info extraction from JWT

❌ **Not Working**:
- Supabase data operations (401 Unauthorized)
- User profile creation
- Test data creation
- Any authenticated Supabase requests

## Impact

**Without this configuration**:
- Users can authenticate with Firebase
- But cannot store/retrieve any data from Supabase
- The entire integration is non-functional

**After configuration**:
- Full Firebase Auth + Supabase data integration
- User isolation via RLS policies
- Secure authenticated data operations

## Testing After Configuration

1. Visit: `http://localhost:3000/diagnostico/test`
2. Sign in with Firebase (email or Google)
3. Try creating test data
4. Verify user profile creation works
5. Check that data is isolated per user

## Support Resources

- [Supabase Third-party Auth](https://supabase.com/docs/guides/auth/auth-helpers/auth-ui)
- [Firebase JWT Integration](https://firebase.google.com/docs/auth/admin/verify-id-tokens)
- [Supabase Custom JWT](https://supabase.com/docs/guides/auth/auth-helpers/auth-ui)

## Status

🔴 **BLOCKED**: Integration non-functional until JWT configuration is completed
⏰ **Priority**: URGENT - Required for any data operations
🎯 **Next Step**: Configure Supabase Dashboard JWT settings

---

**Note**: This is a one-time configuration that must be done in the Supabase Dashboard. Once configured, the integration will work seamlessly.
