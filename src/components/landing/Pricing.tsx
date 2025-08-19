"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Check } from 'lucide-react';

const pricingTiers = [
  {
    name: 'Starter',
    price: '$49',
    period: '/user/month',
    description: 'For individual reps or small teams getting started.',
    features: ['AI Diagnosis Tool', 'Basic CRM Integration', 'Email Support'],
    isPopular: false,
  },
  {
    name: 'Pro',
    price: '$99',
    period: '/user/month',
    description: 'For growing teams that need more power and automation.',
    features: [
      'All Starter features',
      'AI Sales Copilot',
      'Full CRM & Email Sync',
      'Priority Support',
    ],
    isPopular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations with custom needs.',
    features: [
      'All Pro features',
      'Advanced Security & SSO',
      'Dedicated Account Manager',
      'Custom Integrations',
    ],
    isPopular: false,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="bg-card/50 py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-headline text-sm uppercase tracking-widest text-primary">Pricing</p>
          <h2 className="font-headline mt-2 text-4xl tracking-wider md:text-5xl">
            Plans for Teams of All Sizes
          </h2>
          <p className="mt-4 text-lg text-foreground/70">
            Choose the plan that's right for you. All plans come with a 14-day free trial. No credit card required.
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {pricingTiers.map((tier) => (
            <Card key={tier.name} className={`flex flex-col ${tier.isPopular ? 'border-2 border-primary shadow-2xl shadow-primary/20' : ''}`}>
              <CardHeader className="relative">
                {tier.isPopular && (
                  <div className="absolute -top-4 right-6 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">POPULAR</div>
                )}
                <CardTitle className="font-headline text-3xl tracking-wider">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-baseline">
                  <span className="font-headline text-5xl tracking-wide">{tier.price}</span>
                  {tier.period && <span className="ml-1 text-muted-foreground">{tier.period}</span>}
                </div>
                <ul className="mt-6 space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="mr-3 h-5 w-5 flex-shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" size="lg" variant={tier.isPopular ? 'default' : 'outline'}>
                  {tier.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
