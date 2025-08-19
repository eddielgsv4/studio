"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <Bot className="h-6 w-6 text-primary" />
          <span className="ml-2 font-bold">SalesAI</span>
        </div>
        <nav className="hidden flex-1 items-center space-x-6 text-sm font-medium md:flex">
          <a href="#about" className="text-foreground/60 transition-colors hover:text-foreground/80">About</a>
          <a href="#pricing" className="text-foreground/60 transition-colors hover:text-foreground/80">Pricing</a>
          <a href="#faq" className="text-foreground/60 transition-colors hover:text-foreground/80">FAQ</a>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button variant="ghost">Log In</Button>
          <Button>Get Started Free</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
