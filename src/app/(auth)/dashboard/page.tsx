'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { withAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Icons } from '@/components/icons';

function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateTestDocument = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to create a document.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'test'), {
        userId: user.uid,
        email: user.email,
        createdAt: serverTimestamp(),
        message: `Hello from ${user.email}`,
      });
      toast({
        title: 'Document Created',
        description: `Test document created with ID: ${docRef.id}`,
      });
    } catch (error) {
      console.error('Error adding document: ', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not create test document.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur-sm">
        <div className="container flex h-16 max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>
          <div>{/* Placeholder for future actions */}</div>
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        <div className="container max-w-7xl py-8">
          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="text-2xl font-semibold">
                Welcome, {user?.displayName || 'User'}
              </h2>
              <p className="mt-2 text-muted-foreground">
                This is your protected dashboard page.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold">
                Test Firestore Connection
              </h3>
              <p className="mt-2 text-muted-foreground">
                Click the button below to create a test document in your
                Firestore database.
              </p>
              <div className="mt-4">
                <Button
                  onClick={handleCreateTestDocument}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Icons.refresh className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Icons.plus className="mr-2 h-4 w-4" />
                  )}
                  {isLoading
                    ? 'Creating Document...'
                    : 'Create Test Document'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default withAuth(Dashboard);