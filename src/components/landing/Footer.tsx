"use client";

import React from 'react';
import { Bot, Twitter, Linkedin, Github } from 'lucide-react';

const footerLinks = {
  product: ['Features', 'Pricing', 'Integrations', 'Updates'],
  company: ['About Us', 'Careers', 'Contact', 'Blog'],
  resources: ['Help Center', 'API Docs', 'Security', 'Playbooks'],
};

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center">
              <Bot className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">SalesAI</span>
            </div>
            <p className="mt-4 max-w-xs text-foreground/70">
              The AI-powered copilot for modern sales teams.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-foreground/60 hover:text-primary"><Twitter /></a>
              <a href="#" className="text-foreground/60 hover:text-primary"><Linkedin /></a>
              <a href="#" className="text-foreground/60 hover:text-primary"><Github /></a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-3">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="font-semibold uppercase tracking-wider text-foreground/80">{title}</h3>
                <ul className="mt-4 space-y-2">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-foreground/60 hover:text-foreground">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 border-t border-border/40 pt-8 text-center text-sm text-foreground/60">
          <p>&copy; {new Date().getFullYear()} SalesAI, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
