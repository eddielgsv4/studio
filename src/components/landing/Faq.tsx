"use client";

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: 'Is my sales data secure?',
    answer: 'Absolutely. We use enterprise-grade encryption and security protocols to ensure your data is always safe and confidential. We are SOC 2 Type II compliant.'
  },
  {
    question: 'Which CRMs do you integrate with?',
    answer: 'We support native integrations with Salesforce, HubSpot, Zoho, and Pipedrive. We also offer a robust API for custom integrations with other systems.'
  },
  {
    question: 'Can I try SalesAI before I buy?',
    answer: 'Yes! We offer a 14-day free trial on our Starter and Pro plans, no credit card required. You can experience the full power of SalesAI for yourself.'
  },
  {
    question: 'How long does it take to set up?',
    answer: 'Getting started is quick and easy. Most teams are fully set up and see their first insights within 30 minutes of signing up. Our support team is here to help if you need it.'
  },
];


const Faq = () => {
  return (
    <section id="faq" className="container mx-auto max-w-4xl px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-headline text-sm uppercase tracking-widest text-primary">Questions?</p>
        <h2 className="font-headline mt-2 text-4xl tracking-wider md:text-5xl">
          Frequently Asked Questions
        </h2>
        <p className="mt-4 text-lg text-foreground/70">
          Have a different question? Feel free to reach out to our team.
        </p>
      </div>
      <Accordion type="single" collapsible className="mt-12 w-full">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="text-left text-lg hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-base text-foreground/80">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default Faq;
