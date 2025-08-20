'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { TipCard } from "@/components/diagnostico/StepShell";
import { 
  Target,
  TrendingUp,
  Users,
  DollarSign,
  Building,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';

interface CollectedData {
  nome?: string;
  segmento?: string;
  ticketMedio?: string;
  cicloVendas?: string;
  visitantes?: string;
  conversaoTopo?: string;
  qualificacao?: string;
  gargaloMeio?: string;
  taxaFechamento?: string;
  motivoPerdas?: string;
  retencao?: string;
}

// Componente de chat com visualização das informações coletadas
import { OnboardingChatWithSidebar } from "@/components/diagnostico/OnboardingChatWithSidebar";

export default function OnboardingPage() {
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(false);
  const [collectedData, setCollectedData] = useState<CollectedData>({});

  const handleOnboardingComplete = (data: CollectedData) => {
    setCollectedData(data);
    setIsCompleted(true);
    
    // Simular processamento e redirecionamento
    setTimeout(() => {
      router.push('/projeto/proj_123/dashboard');
    }, 3000);
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-[#0B0C0E] text-white flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center p-8">
          <div className="mb-8">
            <div className="w-20 h-20 bg-[#E11D2E] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-4">🎉 Dashboard Pronto!</h1>
            <p className="text-gray-300 text-lg">
              Processamos todas as informações da <strong>TechCorp</strong> e seu Dashboard Vivo está sendo preparado com insights personalizados.
            </p>
          </div>

          <div className="bg-[#1a1b1e] rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Dados Coletados:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-left">
                <span className="text-gray-400">Nome:</span> {collectedData.nome}
              </div>
              <div className="text-left">
                <span className="text-gray-400">Segmento:</span> {collectedData.segmento}
              </div>
              <div className="text-left">
                <span className="text-gray-400">Ticket Médio:</span> {collectedData.ticketMedio}
              </div>
              <div className="text-left">
                <span className="text-gray-400">Ciclo de Vendas:</span> {collectedData.cicloVendas} dias
              </div>
              <div className="text-left">
                <span className="text-gray-400">Visitantes/mês:</span> {collectedData.visitantes}
              </div>
              <div className="text-left">
                <span className="text-gray-400">Taxa Fechamento:</span> {collectedData.taxaFechamento}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2 text-[#E11D2E]">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#E11D2E]"></div>
            <span>Redirecionando para seu Dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col bg-[#0B0C0E]">
      {/* Header */}
      <header className="flex-shrink-0 w-full border-b border-gray-700/50 bg-[#0B0C0E]/95 backdrop-blur-sm">
        <div className="flex h-16 items-center">
          {/* Spacer for sidebar on desktop */}
          <div className="hidden lg:block lg:w-[380px] flex-shrink-0"></div>
          
          {/* Header content */}
          <div className="container flex flex-1 h-16 max-w-7xl items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2">
              <Icons.logo className="h-6 w-6 text-[#E11D2E]" />
              <span className="font-bold text-lg text-white">V4SalesAI</span>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">Mapeamento do Funil</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content with sidebar */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="hidden w-[380px] flex-col border-r border-gray-700/50 bg-[#0B0C0E] p-8 lg:flex overflow-y-auto">
          <div>
            <h2 className="text-2xl font-bold text-white">Mapeamento Inteligente</h2>
            <p className="mt-2 text-gray-300">
              Nosso Copiloto vai guiar você através de uma conversa fluida para mapear seu funil de vendas e gerar insights personalizados.
            </p>
            
            <TipCard 
              title="Como funciona?"
              tips={[
                "Conversa guiada de 5-10 minutos para mapear seu funil completo",
                "Coleta inteligente de métricas do Topo, Meio, Fundo e Pós-venda",
                "Geração automática do seu Dashboard Vivo com insights personalizados",
                "Identificação de gargalos e oportunidades de melhoria específicas"
              ]}
            />

            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Target className="mr-2 h-5 w-5 text-[#E11D2E]" />
                Etapas do Mapeamento
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="w-8 h-8 bg-[#E11D2E]/20 rounded-full flex items-center justify-center">
                    <Building className="h-4 w-4 text-[#E11D2E]" />
                  </div>
                  <div>
                    <div className="font-medium">Descoberta & Empresa</div>
                    <div className="text-xs text-gray-500">Perfil e contexto do negócio</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="w-8 h-8 bg-[#E11D2E]/20 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-[#E11D2E]" />
                  </div>
                  <div>
                    <div className="font-medium">Topo do Funil</div>
                    <div className="text-xs text-gray-500">Atração e geração de leads</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="w-8 h-8 bg-[#E11D2E]/20 rounded-full flex items-center justify-center">
                    <Target className="h-4 w-4 text-[#E11D2E]" />
                  </div>
                  <div>
                    <div className="font-medium">Meio do Funil</div>
                    <div className="text-xs text-gray-500">Qualificação e nutrição</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="w-8 h-8 bg-[#E11D2E]/20 rounded-full flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-[#E11D2E]" />
                  </div>
                  <div>
                    <div className="font-medium">Fundo do Funil</div>
                    <div className="text-xs text-gray-500">Fechamento e conversão</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="w-8 h-8 bg-[#E11D2E]/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-[#E11D2E]" />
                  </div>
                  <div>
                    <div className="font-medium">Pós-Venda</div>
                    <div className="text-xs text-gray-500">Retenção e expansão</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Chat Area */}
        <main className="flex flex-1 flex-col min-h-0">
          <div className="flex-1 min-h-0">
            <OnboardingChatWithSidebar onComplete={handleOnboardingComplete} />
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="flex-shrink-0 border-t border-gray-700/50 bg-[#0B0C0E] p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-gray-400 hover:text-white"
          >
            <Link href="/diagnostico/inicio">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
          
          <div className="text-xs text-gray-500">
            Powered by V4SalesAI • Diagnóstico Inteligente
          </div>
          
          <div className="w-20"></div> {/* Spacer for balance */}
        </div>
      </footer>
    </div>
  );
}
