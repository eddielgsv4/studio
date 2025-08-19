"use client";

import React from 'react';

const partners = [
  { name: 'InnovateCorp', logo: 'INNOVATE' },
  { name: 'QuantumLeap', logo: 'QUANTUM' },
  { name: 'Stellar Solutions', logo: 'STELLAR' },
  { name: 'Apex Industries', logo: 'APEX' },
  { name: 'Synergy Group', logo: 'SYNERGY' },
  { name: 'Visionary Ventures', logo: 'VISIONARY' },
];

const Partners = () => {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <p className="mb-8 text-center font-semibold uppercase tracking-wider text-foreground/60">
          Trusted by the world's most innovative sales teams
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {partners.map((partner) => (
            <div key={partner.name} className="flex items-center justify-center">
              <span className="font-headline text-2xl tracking-widest text-foreground/50 transition-colors hover:text-foreground/80">
                {partner.logo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
