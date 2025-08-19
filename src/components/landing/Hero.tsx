"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, PlayCircle } from 'lucide-react';

const Hero = () => {
  return (
    <section className="container mx-auto flex flex-col items-center px-4 py-20 text-center sm:py-32">
      <h1 className="font-headline text-5xl tracking-wider md:text-7xl lg:text-8xl">
        CLOSE DEALS 10X FASTER
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-foreground/80 md:text-xl">
        Unlock superhuman sales performance with our AI-powered copilot. Automate tasks, get real-time insights, and focus on what truly matters: selling.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button size="lg" className="h-12 px-8 text-base">
          Start Your Free Trial <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <Button size="lg" variant="outline" className="h-12 px-8 text-base">
          <PlayCircle className="mr-2 h-5 w-5" /> Watch a Demo
        </Button>
      </div>
      <div className="relative mt-16 w-full max-w-5xl">
        <div className="absolute -bottom-8 -left-8 -right-8 top-8 rounded-lg bg-primary/10"></div>
        <div className="relative rounded-lg border-2 border-primary/50 bg-card p-2 shadow-2xl shadow-primary/20">
          <img
            src="https://placehold.co/1200x600.png"
            alt="SalesAI Dashboard"
            className="rounded-md"
            data-ai-hint="dashboard analytics"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
