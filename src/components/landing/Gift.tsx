"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Gift as GiftIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Gift = () => {
  return (
    <section className="container mx-auto px-4 py-24 sm:py-32">
      <Card className="bg-gradient-to-r from-primary/80 to-primary p-8 md:p-12">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="text-center md:text-left">
            <GiftIcon className="mx-auto h-16 w-16 text-primary-foreground md:mx-0" />
            <h2 className="font-headline mt-4 text-4xl tracking-wider text-primary-foreground md:text-5xl">
              Get The AI Sales Playbook
            </h2>
            <p className="mt-2 text-lg text-primary-foreground/80">
              Download our free guide to implementing AI in your sales process and get actionable tips you can use today.
            </p>
          </div>
          <div className="flex w-full max-w-md flex-col gap-4 self-center md:ml-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              className="h-12 bg-background/80 text-foreground placeholder:text-muted-foreground focus:bg-background"
            />
            <Button size="lg" variant="secondary" className="h-12 bg-card text-card-foreground hover:bg-card/90">
              Download Now
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default Gift;
