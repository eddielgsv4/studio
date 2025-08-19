
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const Header = () => {
    const { signOut, user } = useAuth();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <Bot className="h-6 w-6 text-primary" />
          <span className="ml-2 font-bold">SalesAI</span>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
            {user && <span className="text-sm text-muted-foreground hidden sm:inline-block">Welcome, {user.email}</span>}
            <Button variant="outline" onClick={signOut}>Sign Out</Button>
        </div>
      </div>
    </header>
  );
};
