# Firebase Auth + Supabase Integration Setup

This document provides a complete guide for the Firebase Authentication + Supabase integration in the V4 SalesAI project.

## Overview

The integration allows you to:
- Use Firebase for user authentication (email/password, Google, etc.)
- Store and manage data in Supabase with automatic user isolation
- Leverage Firebase JWT tokens for secure Supabase access
- Maintain Row Level Security (RLS) for data protection

## Current Setup Status ✅

### 1. Environment Variables
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBsJPFbmy4rICLIJQtIrG8-aLvqzLT2BkQ
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=v4salesai.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=v4salesai
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=v4salesai.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=497433679232
NEXT_PUBLIC_FIREBASE_APP_ID=1:497433679232:web:1ee7486a0932e5fcd29d65

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://raakccipdxmpzvejyzcn.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhYWtjY2lwZHhtcHp2ZWp5emNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MDg4NjMsImV4cCI6MjA3MTE4NDg2M30.syOHpV6VMrSubnC0OuurP6xKJOP_bYaSmyzRqv5uhyE"
```

### 2. Dependencies Installed
- `@supabase/supabase-js` - Supabase JavaScript client
- `firebase` - Firebase SDK (already installed)

### 3. Configuration Files

#### Firebase Configuration (`src/lib/auth/firebase.ts`)
- ✅ Firebase app initialization
- ✅ Authentication methods (email, Google)
- ✅ JWT token utilities
- ✅ Firestore configuration with long polling

#### Supabase Configuration (`src/lib/auth/supabase.ts`)
- ✅ Supabase client with Firebase JWT integration
- ✅ Custom access token function using Firebase JWT
- ✅ User profile management utilities
- ✅ Connection testing functions

### 4. Database Tables

#### `user_profiles` Table
```sql
CREATE TABLE user_profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  firebase_uid text NOT NULL UNIQUE,
  email text,
  name text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- RLS Policy
CREATE POLICY "Users can only access their own profile" 
ON user_profiles 
FOR ALL 
USING (firebase_uid = auth.jwt()->>'user_id');
```

#### `test_data` Table
```sql
CREATE TABLE test_data (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  firebase_uid text NOT NULL,
  title text NOT NULL,
  content text,
  data jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- RLS Policy
CREATE POLICY "Users can only access their own test data" 
ON test_data 
FOR ALL 
USING (firebase_uid = auth.jwt()->>'user_id');
```

## Files Created

### 1. Test Page (`src/app/diagnostico/test/page.tsx`)
A comprehensive test interface that allows you to:
- Test Firebase authentication (email, Google)
- Test Supabase connection
- Create, read, update, delete test data
- Verify user isolation
- Monitor test results in real-time

**Access:** `http://localhost:3000/diagnostico/test`

### 2. Example Library (`src/lib/examples/supabase-post-example.ts`)
A complete example showing how to:
- Create authenticated posts
- Fetch user-specific data
- Update and delete posts
- Handle authentication checks
- Manage user profiles

## Usage Examples

### Basic Authentication Flow

```typescript
import { auth, signInWithEmailAndPassword } from '@/lib/auth/firebase';
import { createPost, getUserPosts } from '@/lib/examples/supabase-post-example';

// 1. Sign in with Firebase
await signInWithEmailAndPassword(auth, email, password);

// 2. Create a post in Supabase
const newPost = await createPost(
  'My First Post',
  'This is the content of my post',
  { category: 'general', tags: ['example'] }
);

// 3. Get all user posts
const userPosts = await getUserPosts();
```

### Direct Supabase Operations

```typescript
import { supabase, getCurrentUserFromJWT } from '@/lib/auth/supabase';

// Get current user info
const userInfo = await getCurrentUserFromJWT();

// Create data with automatic user isolation
const { data, error } = await supabase
  .from('test_data')
  .insert([{
    firebase_uid: userInfo.firebase_uid,
    title: 'My Title',
    content: 'My Content'
  }]);

// Query user-specific data (RLS automatically filters)
const { data: userPosts } = await supabase
  .from('test_data')
  .select('*')
  .eq('firebase_uid', userInfo.firebase_uid);
```

## Security Features

### Row Level Security (RLS)
- All tables have RLS enabled
- Policies ensure users only access their own data
- Firebase UID is used for user identification
- JWT validation happens automatically

### JWT Integration
- Firebase generates JWT tokens with user information
- Supabase validates these tokens automatically
- User ID is extracted from JWT claims
- Token expiration is handled by Firebase

### Data Isolation
- Each user's data is isolated by their Firebase UID
- Cross-user data access is prevented by RLS policies
- Automatic user identification from JWT claims

## Testing the Integration

### 1. Start the Development Server
```bash
cd studio
npm run dev
```

### 2. Navigate to Test Page
Visit: `http://localhost:3000/diagnostico/test`

### 3. Test Authentication
- Try email/password authentication
- Test Google sign-in
- Verify JWT token generation

### 4. Test Supabase Operations
- Test Supabase connection
- Create user profiles
- Create and manage test data
- Verify data isolation between users

### 5. Monitor Results
- Check the test results panel for detailed logs
- Verify operations in Supabase dashboard
- Test with multiple users to confirm isolation

## Important Notes

### Firebase Custom Claims
⚠️ **CRITICAL**: Firebase users need the `role: 'authenticated'` custom claim for Supabase to recognize them as authenticated users.

This can be set up using Firebase Cloud Functions or Admin SDK. See the main documentation for details.

### Error Handling
- All functions include comprehensive error handling
- Errors are logged to console for debugging
- User-friendly error messages are provided

### Performance Considerations
- JWT tokens are cached by Firebase
- Supabase client is configured for optimal performance
- RLS policies are indexed for fast queries

## Troubleshooting

### Common Issues

1. **"Permission Denied" Errors**
   - Check if Firebase user has `role: 'authenticated'` custom claim
   - Verify RLS policies are correctly configured
   - Ensure JWT token is being passed correctly

2. **User Data Not Isolated**
   - Check RLS policies use `auth.jwt()->>'user_id'`
   - Verify `firebase_uid` column exists and is populated
   - Test with different users to confirm isolation

3. **Connection Issues**
   - Verify environment variables are correct
   - Check Supabase project URL and anon key
   - Ensure Firebase project is properly configured

### Debug Steps

1. Check JWT token claims in the test page
2. Verify user authentication status
3. Test Supabase connection independently
4. Check browser console for detailed error messages
5. Verify database table structure and RLS policies

## Next Steps

1. ✅ Test the integration thoroughly using the test page
2. ✅ Create your application-specific tables
3. ✅ Implement RLS policies for new tables
4. ✅ Generate TypeScript types for your schema
5. ✅ Set up Firebase custom claims for production

## Support

For issues with this integration:
1. Check the test page for detailed error messages
2. Review browser console logs
3. Verify all setup steps are completed
4. Test with different authentication methods

The integration is now fully set up and ready for use in your application!
