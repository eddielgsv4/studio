"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Gauge, 
  Coins, 
  Bell, 
  Settings,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DashboardProject } from '@/lib/types-dashboard';
import { useDashboard } from '@/contexts/DashboardContext';

interface DashboardHeaderProps {
  project: DashboardProject;
}

export function DashboardHeader({ project }: DashboardHeaderProps) {
  const { notifications } = useDashboard();
  
  const unreadNotifications = notifications.filter(n => !n.read).length;
  
  const getScoreStatus = (score: number) => {
    if (score >= 80) return { 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-950/40', 
      border: 'border-emerald-800/60', 
      label: 'Excelente',
      trend: 'up' as const
    };
    if (score >= 70) return { 
      color: 'text-green-400', 
      bg: 'bg-green-950/40', 
      border: 'border-green-800/60', 
      label: 'Bom',
      trend: 'up' as const
    };
    if (score >= 50) return { 
      color: 'text-amber-400', 
      bg: 'bg-amber-950/40', 
      border: 'border-amber-800/60', 
      label: 'Atenção',
      trend: 'stable' as const
    };
    return { 
      color: 'text-red-400', 
      bg: 'bg-red-950/40', 
      border: 'border-red-800/60', 
      label: 'Crítico',
      trend: 'down' as const
    };
  };

  const scoreStatus = getScoreStatus(project.overallScore);
  
  // Calculate overall progress
  const totalMissions = project.stages.reduce((sum, stage) => sum + stage.totalMissions, 0);
  const completedMissions = project.stages.reduce((sum, stage) => sum + stage.completedMissions, 0);
  const progressPercentage = totalMissions > 0 ? (completedMissions / totalMissions) * 100 : 0;

  // Calculate credits usage
  const creditsUsagePercentage = (project.wallet.usedThisMonth / project.wallet.monthlyLimit) * 100;

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4" />;
      case 'down': return <TrendingDown className="h-4 w-4" />;
      default: return <Minus className="h-4 w-4" />;
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {/* Project Info */}
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gray-800 rounded-lg">
              <Gauge className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{project.name}</h1>
              <p className="text-sm text-gray-500">
                {project.company.name} • {project.company.segment}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Última atualização: {project.lastUpdated.toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          {/* Score and Status */}
          <div className="flex items-center space-x-6">
            {/* Overall Score */}
            <div className="text-center">
              <div className="flex items-center space-x-2 mb-1">
                <div className={cn("text-3xl font-bold", scoreStatus.color)}>
                  {project.overallScore}
                </div>
                <div className={cn("flex items-center", scoreStatus.color)}>
                  {getTrendIcon(scoreStatus.trend)}
                </div>
              </div>
              <div className="text-xs text-gray-500">Score Geral</div>
              <Badge 
                variant="outline" 
                className={cn("mt-1 text-xs", scoreStatus.bg, scoreStatus.color, scoreStatus.border)}
              >
                {scoreStatus.label}
              </Badge>
            </div>

            {/* Progress */}
            <div className="text-center min-w-[120px]">
              <div className="text-lg font-bold text-white mb-1">
                {completedMissions}/{totalMissions}
              </div>
              <div className="text-xs text-gray-500 mb-2">Missões</div>
              <Progress 
                value={progressPercentage} 
                className="w-full h-2"
              />
              <div className="text-xs text-gray-600 mt-1">
                {Math.round(progressPercentage)}% completo
              </div>
            </div>

            {/* Wallet */}
            <div className="text-center">
              <div className="flex items-center space-x-2 mb-1">
                <Coins className="h-4 w-4 text-amber-400" />
                <div className="text-lg font-bold text-white">
                  {project.wallet.credits}
                </div>
              </div>
              <div className="text-xs text-gray-500">Créditos</div>
              <div className="text-xs text-gray-600 mt-1">
                {project.wallet.usedThisMonth}/{project.wallet.monthlyLimit} usados
              </div>
              <Progress 
                value={creditsUsagePercentage} 
                className="w-full h-1 mt-1"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {unreadNotifications > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
                  >
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stage Summary */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          {project.stages.map((stage) => {
            const stageStatus = getScoreStatus(stage.score);
            const stageProgress = stage.totalMissions > 0 ? (stage.completedMissions / stage.totalMissions) * 100 : 0;
            
            return (
              <div 
                key={stage.id}
                className="p-3 bg-gray-800/60 border border-gray-700/50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{stage.icon}</span>
                    <span className="text-sm font-medium text-white">{stage.name}</span>
                  </div>
                  <div className={cn("text-sm font-bold", stageStatus.color)}>
                    {stage.score}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{stage.completedMissions}/{stage.totalMissions} missões</span>
                  <span>{Math.round(stageProgress)}%</span>
                </div>
                <Progress value={stageProgress} className="h-1 mt-1" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
