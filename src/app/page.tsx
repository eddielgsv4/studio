
'use client';

import { Header } from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import About from '@/components/landing/About';
import Journey from '@/components/landing/Journey';
import Gift from '@/components/landing/Gift';
import DiagnosisSection from '@/components/landing/DiagnosisSection';
import Copilot from '@/components/landing/Copilot';
import Ecosystem from '@/components/landing/Ecosystem';
import Pricing from '@/components/landing/Pricing';
import Partners from '@/components/landing/Partners';
import Faq from '@/components/landing/Faq';
import FinalCta from '@/components/landing/FinalCta';
import Footer from '@/components/landing/Footer';
import { DiagnosticProvider } from '@/contexts/DiagnosticContext';

export default function V4SalesAIPage() {
  return (
    <DiagnosticProvider>
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex-1">
          <Hero />
          <About />
          <Journey />
          <DiagnosisSection />
          <Copilot />
          <Gift />
          <Ecosystem />
          <Pricing />
          <Partners />
          <Faq />
          <FinalCta />
        </main>
        <Footer />
      </div>
    </DiagnosticProvider>
  );
}
