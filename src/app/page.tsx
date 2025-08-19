import { DiagnosticProvider } from '@/contexts/DiagnosticContext';
import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import StatBar from '@/components/landing/StatBar';
import Partners from '@/components/landing/Partners';
import About from '@/components/landing/About';
import Journey from '@/components/landing/Journey';
import Ecosystem from '@/components/landing/Ecosystem';
import Copilot from '@/components/landing/Copilot';
import ChatLite from '@/components/landing/ChatLite';
import DiagnosisSection from '@/components/landing/DiagnosisSection';
import Gift from '@/components/landing/Gift';
import Pricing from '@/components/landing/Pricing';
import Faq from '@/components/landing/Faq';
import FinalCta from '@/components/landing/FinalCta';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <DiagnosticProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1">
          <Hero />
          <StatBar />
          <Partners />
          <About />
          <Journey />
          <Ecosystem />
          <Copilot />
          <ChatLite />
          <DiagnosisSection />
          <Gift />
          <Pricing />
          <Faq />
          <FinalCta />
        </main>
        <Footer />
      </div>
    </DiagnosticProvider>
  );
}
