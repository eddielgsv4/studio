"use client";

import React from 'react';
import { Zap, Users, Mail, Calendar, TrendingUp, Presentation } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const integrations = [
  { icon: Zap, title: 'Salesforce', description: 'Sync all your leads, contacts, and opportunities.' },
  { icon: Users, title: 'HubSpot', description: 'Automate your marketing and sales funnels.' },
  { icon: Mail, title: 'Gmail & Outlook', description: 'Analyze emails and schedule follow-ups.' },
  { icon: Calendar, title: 'Google Calendar', description: 'Manage your schedule and book meetings.' },
  { icon: TrendingUp, title: 'LinkedIn Sales Nav', description: 'Find and engage with the right prospects.' },
  { icon: Presentation, title: 'Slack', description: 'Get deal alerts and updates in your channels.' },
];

const Ecosystem = () => {
  return (
    <section className="container mx-auto px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-headline text-sm uppercase tracking-widest text-primary">Seamless Integrations</p>
        <h2 className="font-headline mt-2 text-4xl tracking-wider md:text-5xl">
          Works With Your Existing Stack
        </h2>
        <p className="mt-4 text-lg text-foreground/70">
          SalesAI fits right into your current workflow. No need to rip and replace. We connect with the tools you already love.
        </p>
      </div>
      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((item) => (
          <Card key={item.title} className="bg-card/50 transition-all hover:bg-card hover:shadow-lg hover:shadow-primary/10">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <item.icon className="h-6 w-6" />
              </div>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Ecosystem;
