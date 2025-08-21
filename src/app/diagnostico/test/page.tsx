'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  onAuthStateChanged,
  type User 
} from '@/lib/auth/firebase';
import { 
  supabase, 
  getSupabaseWithFreshToken,
  getCurrentUserFromJWT, 
  createUserProfile, 
  getUserProfile, 
  testSupabaseConnection 
} from '@/lib/auth/supabase';

interface TestData {
  id?: string;
  firebase_uid: string;
  title: string;
  content: string;
  created_at?: string;
}

interface UserProfile {
  id?: string;
  firebase_uid: string;
  email?: string;
  name?: string;
  created_at?: string;
  updated_at?: string;
}

export default function SupabaseTestPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [testData, setTestData] = useState<TestData[]>([]);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [testTitle, setTestTitle] = useState('');
  const [testContent, setTestContent] = useState('');
  
  // Status states
  const [authStatus, setAuthStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const [supabaseStatus, setSupabaseStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthStatus(user ? 'authenticated' : 'unauthenticated');
      setLoading(false);
      
      if (user) {
        loadUserData();
      } else {
        setUserProfile(null);
        setTestData([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearTestResults = () => {
    setTestResults([]);
  };

  // Authentication functions
  const handleEmailSignIn = async () => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      addTestResult('✅ Email sign-in successful');
    } catch (error: any) {
      addTestResult(`❌ Email sign-in failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async () => {
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      addTestResult('✅ Email sign-up successful');
    } catch (error: any) {
      addTestResult(`❌ Email sign-up failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      addTestResult('✅ Google sign-in successful');
    } catch (error: any) {
      addTestResult(`❌ Google sign-in failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      addTestResult('✅ Sign-out successful');
    } catch (error: any) {
      addTestResult(`❌ Sign-out failed: ${error.message}`);
    }
  };

  // Supabase test functions
  const testSupabaseConn = async () => {
    try {
      const result = await testSupabaseConnection();
      if (result.success) {
        setSupabaseStatus('connected');
        addTestResult(`✅ ${result.message}`);
      } else {
        setSupabaseStatus('error');
        addTestResult(`❌ ${result.message}`);
      }
    } catch (error: any) {
      setSupabaseStatus('error');
      addTestResult(`❌ Supabase connection error: ${error.message}`);
    }
  };

  const loadUserData = async () => {
    try {
      const userInfo = await getCurrentUserFromJWT();
      if (!userInfo) {
        addTestResult('❌ No user info from JWT');
        return;
      }

      addTestResult(`✅ User info from JWT: ${userInfo.email} (${userInfo.firebase_uid})`);

      // Try to get user profile
      const profile = await getUserProfile(userInfo.firebase_uid);
      if (profile) {
        setUserProfile(profile);
        addTestResult('✅ User profile loaded from Supabase');
      } else {
        addTestResult('ℹ️ No user profile found, creating one...');
        await createUserProfile({
          firebase_uid: userInfo.firebase_uid,
          email: userInfo.email,
          name: userInfo.name,
        });
        const newProfile = await getUserProfile(userInfo.firebase_uid);
        setUserProfile(newProfile);
        addTestResult('✅ User profile created in Supabase');
      }

      // Load test data
      await loadTestData();
    } catch (error: any) {
      addTestResult(`❌ Error loading user data: ${error.message}`);
    }
  };

  const loadTestData = async () => {
    try {
      const userInfo = await getCurrentUserFromJWT();
      if (!userInfo) return;

      const { data, error } = await supabase
        .from('test_data')
        .select('*')
        .eq('firebase_uid', userInfo.firebase_uid)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTestData(data || []);
      addTestResult(`✅ Loaded ${data?.length || 0} test records`);
    } catch (error: any) {
      addTestResult(`❌ Error loading test data: ${error.message}`);
    }
  };

  const createTestData = async () => {
    try {
      const userInfo = await getCurrentUserFromJWT();
      if (!userInfo) {
        addTestResult('❌ User not authenticated');
        return;
      }

      if (!testTitle.trim() || !testContent.trim()) {
        addTestResult('❌ Please fill in both title and content');
        return;
      }

      // Use fresh token for authenticated operations
      const freshSupabase = getSupabaseWithFreshToken();
      const { data, error } = await freshSupabase
        .from('test_data')
        .insert([{
          firebase_uid: userInfo.firebase_uid,
          title: testTitle.trim(),
          content: testContent.trim(),
        }])
        .select()
        .single();

      if (error) throw error;

      addTestResult('✅ Test data created successfully');
      setTestTitle('');
      setTestContent('');
      await loadTestData();
    } catch (error: any) {
      addTestResult(`❌ Error creating test data: ${error.message}`);
    }
  };

  const deleteTestData = async (id: string) => {
    try {
      const { error } = await supabase
        .from('test_data')
        .delete()
        .eq('id', id);

      if (error) throw error;

      addTestResult('✅ Test data deleted successfully');
      await loadTestData();
    } catch (error: any) {
      addTestResult(`❌ Error deleting test data: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Firebase Auth + Supabase Integration Test</h1>
        <p className="text-muted-foreground mt-2">
          Test Firebase authentication and Supabase data operations
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Firebase Auth Status
              <Badge variant={authStatus === 'authenticated' ? 'default' : 'secondary'}>
                {authStatus}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="space-y-2">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>UID:</strong> {user.uid}</p>
                <p><strong>Display Name:</strong> {user.displayName || 'Not set'}</p>
              </div>
            ) : (
              <p>Not authenticated</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Supabase Status
              <Badge variant={supabaseStatus === 'connected' ? 'default' : 'secondary'}>
                {supabaseStatus}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={testSupabaseConn} disabled={loading}>
              Test Supabase Connection
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Authentication Section */}
      {!user && (
        <Card>
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>Sign in or create an account to test Supabase integration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={handleEmailSignIn} disabled={loading}>
                Sign In
              </Button>
              <Button onClick={handleEmailSignUp} variant="outline" disabled={loading}>
                Sign Up
              </Button>
              <Button onClick={handleGoogleSignIn} variant="outline" disabled={loading}>
                Google Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Profile Section */}
      {user && userProfile && (
        <Card>
          <CardHeader>
            <CardTitle>User Profile (Supabase)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Firebase UID:</strong> {userProfile.firebase_uid}</p>
              <p><strong>Email:</strong> {userProfile.email}</p>
              <p><strong>Name:</strong> {userProfile.name || 'Not set'}</p>
              <p><strong>Created:</strong> {userProfile.created_at ? new Date(userProfile.created_at).toLocaleString() : 'Unknown'}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Data Section */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle>Test Data Operations</CardTitle>
            <CardDescription>Create and manage test data in Supabase</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="testTitle">Title</Label>
                <Input
                  id="testTitle"
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  placeholder="Enter test title"
                />
              </div>
              <div>
                <Label htmlFor="testContent">Content</Label>
                <Textarea
                  id="testContent"
                  value={testContent}
                  onChange={(e) => setTestContent(e.target.value)}
                  placeholder="Enter test content"
                  rows={3}
                />
              </div>
            </div>
            <Button onClick={createTestData} disabled={loading}>
              Create Test Data
            </Button>

            {testData.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">Your Test Data:</h4>
                {testData.map((item) => (
                  <div key={item.id} className="border rounded p-3 space-y-2">
                    <div className="flex justify-between items-start">
                      <h5 className="font-medium">{item.title}</h5>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteTestData(item.id!)}
                      >
                        Delete
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.content}</p>
                    <p className="text-xs text-muted-foreground">
                      Created: {item.created_at ? new Date(item.created_at).toLocaleString() : 'Unknown'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Actions Section */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-2 flex-wrap">
              <Button onClick={loadUserData} disabled={loading}>
                Reload User Data
              </Button>
              <Button onClick={testSupabaseConn} variant="outline" disabled={loading}>
                Test Supabase Connection
              </Button>
              <Button onClick={handleSignOut} variant="destructive" disabled={loading}>
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Test Results
            <Button onClick={clearTestResults} variant="outline" size="sm">
              Clear
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {testResults.length === 0 ? (
            <p className="text-muted-foreground">No test results yet</p>
          ) : (
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono bg-muted p-2 rounded">
                  {result}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Alert>
        <AlertDescription>
          <strong>Instructions:</strong>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>First, test the Supabase connection</li>
            <li>Sign in with Firebase (email/password or Google)</li>
            <li>Check that your user profile is created in Supabase</li>
            <li>Create some test data to verify posting works</li>
            <li>Verify that data is isolated to your user</li>
          </ol>
        </AlertDescription>
      </Alert>
    </div>
  );
}
