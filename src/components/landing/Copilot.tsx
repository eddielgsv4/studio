"use client";

import React from 'react';
import Image from 'next/image';

const Copilot = () => {
  return (
    <section className="bg-card/50 py-24 sm:py-32">
      <div className="container mx-auto grid items-center gap-12 px-4 md:grid-cols-2">
        <div>
          <p className="font-headline text-sm uppercase tracking-widest text-primary">AI Sales Copilot</p>
          <h2 className="font-headline mt-2 text-4xl tracking-wider md:text-5xl">
            Never Sell Alone Again
          </h2>
          <p className="mt-4 text-lg text-foreground/70">
            Your AI Copilot is always on, providing real-time guidance during calls, surfacing critical information on demand, and automating post-meeting summaries and CRM updates. It's the competitive edge your team has been waiting for.
          </p>
          <ul className="mt-6 list-inside list-disc space-y-2 text-foreground/80">
            <li>Real-time objection handling suggestions.</li>
            <li>Instant access to competitor battle cards.</li>
            <li>Automatic call transcription and analysis.</li>
            <li>Action item detection and task creation.</li>
          </ul>
        </div>
        <div>
          <Image
            src="https://placehold.co/600x450.png"
            alt="AI Copilot interface"
            width={600}
            height={450}
            className="rounded-lg shadow-xl"
            data-ai-hint="futuristic interface"
          />
        </div>
      </div>
    </section>
  );
};

export default Copilot;
