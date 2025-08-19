
"use client";

import { withAuth, useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/dashboard/Header';
import { StatCards } from '@/components/dashboard/StatCards';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Rocket } from 'lucide-react';

function Dashboard() {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleCreateTestDocument = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be signed in to create a document.",
      });
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "test"), {
        message: "This is a test document from the dashboard!",
        createdAt: serverTimestamp(),
        userId: user.uid,
      });
      console.log("Document written with ID: ", docRef.id);
      toast({
        title: "Success!",
        description: `Test document for user ${user.uid} created with ID: ${docRef.id}`,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create test document.",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <Button onClick={handleCreateTestDocument}>
            <Rocket className="mr-2 h-4 w-4" /> Create Test Document
          </Button>
        </div>
        <StatCards />
      </main>
    </div>
  );
}

export default withAuth(Dashboard);
