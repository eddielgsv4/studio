"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const FinalCta = () => {
  return (
    <section className="bg-card/50 py-24 sm:py-32">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-headline text-4xl tracking-wider md:text-6xl">
          Ready to Revolutionize Your Sales?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/70">
          Join thousands of high-performing sales teams who are closing more deals with SalesAI.
          Start your free trial today and see the difference.
        </p>
        <div className="mt-8">
          <Button size="lg" className="h-14 px-10 text-lg">
            Get Started For Free <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FinalCta;
