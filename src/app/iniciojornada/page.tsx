'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function InicioJornadaPage() {
  const router = useRouter();
  const [projectName, setProjectName] = useState('');

  const handleAdvance = () => {
    if (projectName.trim()) {
      // Aqui você pode salvar o nome do projeto no contexto ou localStorage
      localStorage.setItem('currentProjectName', projectName);
      router.push('/diagnostico/onboarding');
    }
  };

  const handleBack = () => {
    router.push('/projetos');
  };

  return (
    <div className="flex h-screen w-full flex-col bg-[#0B0C0E]">
      {/* Header */}
      <header className="flex-shrink-0 w-full border-b border-gray-700/50 bg-[#0B0C0E]/95 backdrop-blur-sm">
        <div className="flex h-16 items-center">
          <div className="container flex flex-1 h-16 max-w-7xl items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2">
              <Icons.logo className="h-6 w-6 text-[#E11D2E]" />
              <span className="font-bold text-lg text-white">V4SalesAI</span>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">Início da Jornada</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 min-h-0">
        {/* Left sidebar */}
        <aside className="hidden w-[380px] flex-col bg-[#0B0C0E] p-8 lg:flex overflow-y-auto border-r border-gray-700/50">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">A Jornada Começa</h2>
            <p className="text-gray-300 mb-8">
              Cada passo que você dá aqui é um investimento no futuro do seu negócio. 
              Estamos juntos para transformar dados em resultados.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#E11D2E] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    **Organização:** Se você gerencia múltiplos negócios ou clientes, nomes claros ajudam a diferenciar os diagnósticos.
                  </h3>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#E11D2E] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    **Histórico:** Facilita a visualização do histórico de evolução de um mesmo projeto ao longo do tempo.
                  </h3>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[#E11D2E] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    **Contexto:** Dá um nome à sua jornada de melhoria contínua.
                  </h3>
                </div>
              </div>
            </div>

            <div className="mt-12 p-4 bg-[#1a1b1e] rounded-lg border border-gray-700/50">
              <h4 className="text-[#E11D2E] font-semibold mb-2 flex items-center">
                <Icons.logo className="h-4 w-4 mr-2" />
                Por que nomear seu projeto?
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                Dar um nome ao seu projeto não é apenas organização - é o primeiro passo para criar uma identidade e propósito claro para sua jornada de crescimento.
              </p>
            </div>
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex flex-1 flex-col min-h-0 p-8">
          <div className="w-full max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">
                Seu Diagnóstico Inteligente Começa Agora
              </h1>
              <p className="text-gray-300 text-base leading-relaxed">
                Vamos começar dando um nome a este projeto de diagnóstico. Isso ajudará a organizar suas análises futuras.
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-[#1a1b1e] rounded-lg p-8 border border-gray-700/50 shadow-2xl">
                <h2 className="text-2xl font-semibold text-white mb-6">
                  Qual o nome deste projeto?
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="projectName" className="block text-sm font-medium text-gray-300 mb-2">
                      Nome do Projeto
                    </label>
                    <Input
                      id="projectName"
                      type="text"
                      placeholder="Ex: Diagnóstico Vendas Q3, Projeto Expansão E-commerce"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="w-full bg-[#2a2b2e] border-gray-600 text-white placeholder-gray-500 focus:border-[#E11D2E] focus:ring-[#E11D2E] h-12 text-base shadow-lg"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && projectName.trim()) {
                          handleAdvance();
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="flex-shrink-0 border-t border-gray-700/50 bg-[#0B0C0E] p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          
          <div className="text-xs text-gray-500">
            Powered by V4SalesAI • Diagnóstico Inteligente
          </div>
          
          <Button
            onClick={handleAdvance}
            disabled={!projectName.trim()}
            className="bg-[#E11D2E] hover:bg-[#E11D2E]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Avançar
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
