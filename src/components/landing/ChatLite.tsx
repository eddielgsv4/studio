"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Bot, User } from 'lucide-react';
import React from 'react';

const ChatLite = () => {
  return (
    <section className="container mx-auto px-4 py-24 sm:py-32">
       <div className="grid items-center gap-12 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <Card className="p-6">
            <div className="flex flex-col space-y-4">
              {/* User question */}
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarFallback><User /></AvatarFallback>
                </Avatar>
                <div className="rounded-lg bg-secondary p-3">
                  <p className="font-bold">You</p>
                  <p>Which deals in my pipeline are at risk of churning this month?</p>
                </div>
              </div>
              {/* AI response */}
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground"><Bot /></AvatarFallback>
                </Avatar>
                <div className="flex-1 rounded-lg border p-3">
                  <p className="font-bold text-primary">SalesAI</p>
                  <p>I've identified 3 deals with low engagement scores: Acme Corp, Innovate LLC, and Quantum Inc. I suggest sending a follow-up email to Acme Corp today. I can draft one for you.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div className="order-1 md:order-2">
           <p className="font-headline text-sm uppercase tracking-widest text-primary">Conversational Insights</p>
          <h2 className="font-headline mt-2 text-4xl tracking-wider md:text-5xl">
            Ask Anything, Get Answers
          </h2>
          <p className="mt-4 text-lg text-foreground/70">
            Interact with your sales data in plain English. Ask for reports, identify trends, or get a summary of your pipeline's health. SalesAI understands your questions and delivers instant, accurate answers.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ChatLite;
