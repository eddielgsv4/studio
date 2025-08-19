"use client";

import React from 'react';

const stats = [
  { value: '45%', label: 'Increase in Closing Rate' },
  { value: '8h/week', label: 'Saved on Admin Tasks' },
  { value: '300%', label: 'ROI in the First Quarter' },
  { value: '24/7', label: 'AI Sales Assistance' },
];

const StatBar = () => {
  return (
    <section className="bg-card/50 py-12 sm:py-16">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-headline text-4xl tracking-wider text-primary md:text-5xl">{stat.value}</p>
              <p className="mt-1 text-sm text-foreground/70 md:text-base">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatBar;
