'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Plus,
  Target,
  Calendar,
  TrendingUp,
  ArrowRight,
  Building
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  company: string;
  segment: string;
  createdAt: Date;
  status: 'active' | 'completed' | 'draft';
  progress: number;
  lastActivity: Date;
}

export default function ProjetosPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/cadastro');
      return;
    }

    // Simular carregamento de projetos
    setTimeout(() => {
      // Por enquanto, lista vazia para mostrar o estado inicial
      setProjects([]);
      setIsLoading(false);
    }, 1000);
  }, [user, loading, router]);

  const handleStartNewProject = () => {
    router.push('/iniciojornada');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      case 'draft':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'completed':
        return 'Concluído';
      case 'draft':
        return 'Rascunho';
      default:
        return 'Desconhecido';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0B0C0E]">
        <Icons.refresh className="h-8 w-8 animate-spin text-[#E11D2E]" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col bg-[#0B0C0E]">
      {/* Header */}
      <header className="flex-shrink-0 w-full border-b border-gray-700/50 bg-[#0B0C0E]/95 backdrop-blur-sm">
        <div className="container flex h-16 max-w-7xl items-center justify-between px-4 mx-auto">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center gap-2">
              <Icons.logo className="h-6 w-6 text-[#E11D2E]" />
              <span className="font-bold text-lg text-white">V4SalesAI</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/projetos" className="text-[#E11D2E] font-medium">
                Meus Projetos
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Modelos de Soluções
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Falar com Especialista
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleStartNewProject}
              className="bg-[#E11D2E] hover:bg-[#c41729] text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Iniciar Novo Diagnóstico
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#E11D2E] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Meus Projetos</h1>
            <p className="text-gray-400">
              Bem-vindo(a) de volta, {user?.displayName || 'Usuário'}.
            </p>
          </div>

          {projects.length === 0 ? (
            // Estado vazio - nenhum projeto
            <div className="flex items-center justify-center min-h-[500px]">
              <Card className="w-full max-w-md bg-[#1a1b1e] border-gray-700/50 text-center">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-[#E11D2E]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="h-8 w-8 text-[#E11D2E]" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Nenhum projeto encontrado
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Comece um novo diagnóstico para criar seu primeiro projeto de evolução comercial.
                    </p>
                  </div>
                  
                  <Button
                    onClick={handleStartNewProject}
                    size="lg"
                    className="w-full bg-[#E11D2E] hover:bg-[#c41729] text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Começar agora
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            // Lista de projetos
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="bg-[#1a1b1e] border-gray-700/50 hover:border-[#E11D2E]/50 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-[#E11D2E]/20 rounded-lg flex items-center justify-center">
                          <Building className="h-5 w-5 text-[#E11D2E]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{project.name}</h3>
                          <p className="text-sm text-gray-400">{project.company}</p>
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`} />
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Segmento:</span>
                        <span className="text-white">{project.segment}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Status:</span>
                        <span className="text-white">{getStatusText(project.status)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Progresso:</span>
                        <span className="text-white">{project.progress}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Criado em:</span>
                        <span className="text-white">{formatDate(project.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(project.lastActivity)}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-[#E11D2E] hover:text-white hover:bg-[#E11D2E]/20"
                        onClick={() => router.push(`/projeto/${project.id}/dashboard`)}
                      >
                        Abrir
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="flex-shrink-0 border-t border-gray-700/50 bg-[#0B0C0E] p-4">
        <div className="flex items-center justify-center max-w-7xl mx-auto">
          <div className="text-xs text-gray-500">
            Powered by V4SalesAI • Evolução Comercial Inteligente
          </div>
        </div>
      </footer>
    </div>
  );
}
