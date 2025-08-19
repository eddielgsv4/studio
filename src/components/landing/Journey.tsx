"use client";

import { Target, Bot, BarChart, Trophy } from 'lucide-react';
import React from 'react';

const journeySteps = [
  {
    icon: Target,
    title: '1. Connect Your Data',
    description: 'Securely link your CRM, email, and calendar in minutes. Our system supports all major platforms.',
  },
  {
    icon: Bot,
    title: '2. AI Analysis',
    description: 'Our AI gets to work, analyzing patterns, identifying opportunities, and flagging at-risk deals.',
  },
  {
    icon: BarChart,
    title: '3. Receive Insights',
    description: 'Get actionable, real-time insights delivered to you. Know exactly what to do next to move deals forward.',
  },
  {
    icon: Trophy,
    title: '4. Close & Repeat',
    description: 'Utilize AI-powered tools to close deals faster and consistently exceed your sales targets.',
  },
];

const Journey = () => {
  return (
    <section className="bg-card/50 py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-headline text-sm uppercase tracking-widest text-primary">How it works</p>
          <h2 className="font-headline mt-2 text-4xl tracking-wider md:text-5xl">
            Your Journey to Smarter Selling
          </h2>
          <p className="mt-4 text-lg text-foreground/70">
            Getting started with SalesAI is simple. Follow these four steps to revolutionize your sales process.
          </p>
        </div>
        <div className="relative mt-16">
          <div className="absolute left-1/2 top-4 hidden h-full w-0.5 -translate-x-1/2 bg-border md:block" aria-hidden="true"></div>
          <div className="grid gap-12 md:grid-cols-2 md:gap-x-16">
            {journeySteps.map((step, index) => (
              <div key={step.title} className={`relative flex items-start gap-6 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                <div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-border md:block" aria-hidden="true"></div>
                <div className="relative z-10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <step.icon className="h-7 w-7" />
                </div>
                <div className={`text-left ${index % 2 === 1 ? 'md:text-right' : ''}`}>
                  <h3 className="text-2xl font-bold">{step.title}</h3>
                  <p className="mt-2 text-foreground/70">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Journey;
