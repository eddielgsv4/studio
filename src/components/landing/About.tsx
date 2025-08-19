"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

const features = [
  'AI-Powered Deal Scoring',
  'Automated CRM Entry',
  'Personalized Email Outreach',
  'Real-time Battle Cards',
];

const About = () => {
  return (
    <section id="about" className="container mx-auto px-4 py-24 sm:py-32">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <p className="font-headline text-sm uppercase tracking-widest text-primary">The New Standard</p>
          <h2 className="font-headline mt-2 text-4xl tracking-wider md:text-5xl">
            A Copilot For Every Sales Rep
          </h2>
          <p className="mt-4 text-lg text-foreground/70">
            SalesAI is more than just a tool—it's your team's new strategic partner. We handle the repetitive work so your reps can focus on building relationships and closing deals.
          </p>
          <ul className="mt-6 space-y-4">
            {features.map((feature) => (
              <li key={feature} className="flex items-center">
                <CheckCircle2 className="mr-3 h-6 w-6 text-primary" />
                <span className="text-lg">{feature}</span>
              </li>
            ))}
          </ul>
          <Button size="lg" className="mt-8 h-12 px-8 text-base">
            Learn More <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        <div className="order-1 md:order-2">
            <Image
                src="https://placehold.co/600x600.png"
                alt="Sales team collaborating"
                width={600}
                height={600}
                className="rounded-lg shadow-xl"
                data-ai-hint="team collaboration"
            />
        </div>
      </div>
    </section>
  );
};

export default About;
