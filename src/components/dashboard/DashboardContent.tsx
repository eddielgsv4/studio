"use client";

import Link from 'next/link';
import { useDashboard } from '@/contexts/DashboardContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Icons } from "@/components/icons";
import { DashboardHeader } from './DashboardHeader';
import { StageGrid } from './StageGrid';
import { ChatSidebar } from './ChatSidebar';
import { NotificationBanner } from './NotificationBanner';
import { WalletBanner } from './WalletBanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Lightbulb,
  Zap,
  AlertCircle,
  CheckCircle2,
  Clock,
  BarChart3,
  Users,
  DollarSign
} from 'lucide-react';

export function DashboardContent() {
  const { project, isLoading, error, notifications } = useDashboard();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0C0E] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-400">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B0C0E] flex items-center justify-center p-4">
        <Alert className="max-w-md bg-[#1a1b1e] border-gray-700">
          <AlertTriangle className="h-4 w-4 text-[#E11D2E]" />
          <AlertDescription className="text-gray-300">{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0B0C0E] flex items-center justify-center">
        <p className="text-gray-400">Projeto não encontrado</p>
      </div>
    );
  }

  // Check for low credits notification
  const lowCreditsNotification = notifications.find(n => n.type === 'low_credits' && !n.read);

  return (
    <div className="flex h-screen w-full flex-col bg-[#0B0C0E]">
      {/* Header */}
      <header className="flex-shrink-0 w-full border-b border-gray-700/50 bg-[#0B0C0E]/95 backdrop-blur-sm">
        <div className="flex h-16 items-center">
          {/* Header content */}
          <div className="container flex flex-1 h-16 max-w-7xl items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2">
              <Icons.logo className="h-6 w-6 text-[#E11D2E]" />
              <span className="font-bold text-lg text-white">V4SalesAI</span>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">Dashboard Executivo</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 min-h-0">
        {/* Left Sidebar - Insights */}
        <aside className="hidden w-[320px] flex-col border-r border-gray-700/50 bg-[#0B0C0E] p-6 lg:flex overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">📊 Insights</h3>
              <p className="text-xs text-gray-400 mb-4">
                Análise inteligente do seu funil
              </p>
            </div>

            {/* Performance Score */}
            <Card className="bg-[#1a1b1e] border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2 text-[#E11D2E]" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Score Geral</span>
                  <span className="text-sm font-bold text-emerald-400">{project.overallScore}</span>
                </div>
                <Progress value={project.overallScore} className="h-1" />
                <p className="text-xs text-gray-500">
                  {project.overallScore >= 80 ? "🎉 Excelente performance!" : 
                   project.overallScore >= 70 ? "👍 Bom desempenho" :
                   project.overallScore >= 50 ? "⚠️ Precisa atenção" : "🚨 Crítico"}
                </p>
              </CardContent>
            </Card>

            {/* Quick Insights */}
            <Card className="bg-[#1a1b1e] border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2 text-amber-400" />
                  Insights Rápidos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Dynamic insights based on project data */}
                {project.stages.map((stage, index) => {
                  if (stage.score < 60) {
                    return (
                      <div key={stage.id} className="flex items-start space-x-2">
                        <AlertCircle className="h-3 w-3 text-amber-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-300 font-medium">{stage.name}</p>
                          <p className="text-xs text-gray-500">
                            Score baixo ({stage.score}). Foque nas missões pendentes.
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }).filter(Boolean).slice(0, 2)}
                
                {project.stages.every(stage => stage.score >= 60) && (
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="h-3 w-3 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-300 font-medium">Ótimo trabalho!</p>
                      <p className="text-xs text-gray-500">
                        Todos os estágios estão com boa performance.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Priority Actions */}
            <Card className="bg-[#1a1b1e] border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white flex items-center">
                  <Target className="h-4 w-4 mr-2 text-[#E11D2E]" />
                  Prioridades
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* Calculate total pending missions */}
                {(() => {
                  const totalMissions = project.stages.reduce((sum, stage) => sum + stage.totalMissions, 0);
                  const completedMissions = project.stages.reduce((sum, stage) => sum + stage.completedMissions, 0);
                  const pendingMissions = totalMissions - completedMissions;
                  
                  return (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Missões Pendentes</span>
                        <Badge variant="outline" className="text-xs bg-[#E11D2E]/20 text-[#E11D2E] border-[#E11D2E]/30">
                          {pendingMissions}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">
                        {pendingMissions === 0 ? "🎯 Todas as missões concluídas!" :
                         pendingMissions <= 5 ? "🔥 Quase lá! Finalize as últimas missões." :
                         "📋 Foque nas missões de maior impacto primeiro."}
                      </p>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>


            {/* Quick Tips */}
            <Card className="bg-gradient-to-br from-[#E11D2E]/10 to-[#E11D2E]/5 border-[#E11D2E]/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-[#E11D2E]" />
                  Dica do Dia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-300">
                  💡 Use o chat lateral para obter insights personalizados sobre qualquer métrica do seu funil.
                </p>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex flex-1 flex-col min-h-0">
          {/* Dashboard Header with project info */}
          <div className="flex-shrink-0 bg-[#0B0C0E] px-6 pt-6">
            <DashboardHeader project={project} />
          </div>
          
          {/* Stage Grid */}
          <div className="flex-1 p-6 pt-0 overflow-auto bg-[#0B0C0E]">
            <StageGrid stages={project.stages} />
          </div>

          {/* Footer */}
          <footer className="flex-shrink-0 border-t border-gray-700/50 bg-[#0B0C0E] px-6 py-4">
            <div className="flex items-center justify-center">
              <p className="text-xs text-gray-500">
                © 2024 V4SalesAI - Dashboard Executivo
              </p>
            </div>
          </footer>
        </main>

        {/* Chat Sidebar */}
        <ChatSidebar />
      </div>
    </div>
  );
}
