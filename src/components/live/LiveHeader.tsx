"use client";

import { useLiveProject } from '@/contexts/LiveProjectContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Settings, 
  Download, 
  Share2, 
  MoreVertical,
  Activity,
  Clock,
  BarChart3
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { STAGES } from '@/lib/types-live';

export function LiveHeader() {
  const { projectState, isLoading, getConfidence } = useLiveProject();

  if (isLoading || !projectState) {
    return (
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-6 w-32 bg-muted animate-pulse rounded" />
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-8 w-24 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </header>
    );
  }

  const currentStage = STAGES[projectState.conversation.currentStage];
  const overallConfidence = getConfidence();

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Lado esquerdo - Info do projeto */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-semibold text-foreground">
                  {projectState.company.name}
                </h1>
                <Badge variant="outline" className="text-xs">
                  {projectState.company.segment}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <span className="text-lg">{currentStage.icon}</span>
                  <span>{currentStage.title}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Activity className="h-3 w-3" />
                  <span>{overallConfidence}% confiança</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>
                    {Math.round((Date.now() - projectState.createdAt.getTime()) / (1000 * 60))} min
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Centro - Progresso */}
          <div className="hidden md:flex flex-col items-center space-y-2 min-w-[200px]">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Progresso do diagnóstico</span>
              <Badge variant="secondary" className="text-xs">
                {projectState.conversation.completionPercentage}%
              </Badge>
            </div>
            <Progress 
              value={projectState.conversation.completionPercentage} 
              className="w-full h-2"
            />
          </div>

          {/* Lado direito - Ações */}
          <div className="flex items-center space-x-2">
            <Button 
              variant="default" 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => window.location.href = `/projeto/proj_123/dashboard`}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard Executivo
            </Button>
            
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
            
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar PDF
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar link
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  Reiniciar diagnóstico
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Progresso mobile */}
        <div className="md:hidden mt-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Progresso do diagnóstico</span>
            <span>{projectState.conversation.completionPercentage}%</span>
          </div>
          <Progress 
            value={projectState.conversation.completionPercentage} 
            className="w-full h-2"
          />
        </div>
      </div>
    </header>
  );
}
