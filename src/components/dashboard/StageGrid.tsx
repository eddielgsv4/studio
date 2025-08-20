"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronDown, 
  ChevronUp, 
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FunnelStage } from '@/lib/types-dashboard';
import { useDashboard } from '@/contexts/DashboardContext';
import { MissionCard } from './MissionCard';
import { MetricsPanel } from './MetricsPanel';

interface StageGridProps {
  stages: FunnelStage[];
}

export function StageGrid({ stages }: StageGridProps) {
  const { expandedStage, expandStage } = useDashboard();

  const getStageStatus = (stage: FunnelStage) => {
    switch (stage.status) {
      case 'excellent':
        return { 
          color: 'text-emerald-400', 
          bg: 'bg-emerald-950/40', 
          border: 'border-emerald-800/60',
          accent: 'bg-emerald-900/30'
        };
      case 'good':
        return { 
          color: 'text-green-400', 
          bg: 'bg-green-950/40', 
          border: 'border-green-800/60',
          accent: 'bg-green-900/30'
        };
      case 'attention':
        return { 
          color: 'text-amber-400', 
          bg: 'bg-amber-950/40', 
          border: 'border-amber-800/60',
          accent: 'bg-amber-900/30'
        };
      case 'critical':
        return { 
          color: 'text-red-400', 
          bg: 'bg-red-950/40', 
          border: 'border-red-800/60',
          accent: 'bg-red-900/30'
        };
      default:
        return { 
          color: 'text-gray-400', 
          bg: 'bg-gray-950/40', 
          border: 'border-gray-800/60',
          accent: 'bg-gray-900/30'
        };
    }
  };

  const formatMetricValue = (value: string | number, format: string) => {
    if (typeof value === 'string') return value;
    
    switch (format) {
      case 'percentage':
        return `${value}%`;
      case 'currency':
        return `R$ ${value.toLocaleString()}`;
      case 'days':
        return `${value} dias`;
      case 'minutes':
        return `${value}min`;
      default:
        return value.toLocaleString();
    }
  };

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-400" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-red-400" />;
      case 'stable': return <Minus className="h-3 w-3 text-gray-400" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Dynamic Layout - Grid or Expanded */}
      {expandedStage ? (
        // Expanded Layout: Sidebar with others + Main card
        <div className="flex gap-4 h-[calc(100vh-200px)]">
          {/* Sidebar with other stages - Left side */}
          <div className="w-80 space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-400">Outras Etapas</h4>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => expandStage('')}
                className="text-xs"
              >
                Fechar Expansão
              </Button>
            </div>
            
            {stages
              .filter(stage => stage.id !== expandedStage)
              .map((stage) => {
                const statusColors = getStageStatus(stage);
                const progressPercentage = stage.totalMissions > 0 ? (stage.completedMissions / stage.totalMissions) * 100 : 0;

                return (
                  <Card 
                    key={stage.id}
                    className={cn(
                      "transition-all duration-500 cursor-pointer hover:scale-[1.02]",
                      "bg-gray-900/40 border-gray-700/60"
                    )}
                    onClick={() => expandStage(stage.id)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={cn("p-1.5 rounded-lg", statusColors.accent)}>
                            <span className="text-sm">{stage.icon}</span>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-white">{stage.name}</h3>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="text-center">
                            <div className={cn("text-2xl font-bold", statusColors.color)}>
                              {stage.score}
                            </div>
                          </div>
                          
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="pt-0 pb-3">
                      <div className="space-y-2">
                        {/* Progress */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-400">Progresso</span>
                            <span className="text-xs font-medium text-white">
                              {stage.completedMissions}/{stage.totalMissions}
                            </span>
                          </div>
                          <Progress value={progressPercentage} className="h-1.5" />
                        </div>

                        {/* Status Badge */}
                        <Badge variant="outline" className={cn("text-xs w-fit", statusColors.color, statusColors.border)}>
                          {stage.status === 'excellent' && 'Excelente'}
                          {stage.status === 'good' && 'Bom'}
                          {stage.status === 'attention' && 'Atenção'}
                          {stage.status === 'critical' && 'Crítico'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>

          {/* Expanded Stage - Takes most of the screen - Right side */}
          <div className="flex-1">
            {stages
              .filter(stage => stage.id === expandedStage)
              .map((stage) => {
                const statusColors = getStageStatus(stage);
                const progressPercentage = stage.totalMissions > 0 ? (stage.completedMissions / stage.totalMissions) * 100 : 0;

                return (
                  <Card 
                    key={stage.id}
                    className={cn(
                      "h-full transition-all duration-500 cursor-pointer",
                      "bg-gray-900/40 border-gray-700/60"
                    )}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={cn("p-2 rounded-lg", statusColors.accent)}>
                            <span className="text-xl">{stage.icon}</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{stage.name}</h3>
                            <p className="text-sm text-gray-400">{stage.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="text-center">
                            <div className={cn("text-3xl font-bold", statusColors.color)}>
                              {stage.score}
                            </div>
                            <div className="text-xs text-gray-500">Score</div>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="ml-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              expandStage('');
                            }}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="pt-0 h-[calc(100vh-300px)] overflow-auto">
                      {/* Expanded View - Full Details */}
                      <div className="space-y-6">
                        {/* Detailed Metrics */}
                        <MetricsPanel stage={stage} />
                        
                        {/* Missions */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
                              <Target className="h-5 w-5" />
                              <span>Missões ({stage.completedMissions}/{stage.totalMissions})</span>
                            </h4>
                            
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {stage.missions.filter(m => m.status === 'available').length} disponíveis
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {stage.missions.filter(m => m.status === 'in_progress').length} em andamento
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid gap-4">
                            {stage.missions.map((mission) => (
                              <MissionCard key={mission.id} mission={mission} stageId={stage.id} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      ) : (
        // Grid Layout - All cards side by side
        <div className="grid grid-cols-4 gap-4">
          {stages.map((stage) => {
            const statusColors = getStageStatus(stage);
            const progressPercentage = stage.totalMissions > 0 ? (stage.completedMissions / stage.totalMissions) * 100 : 0;

            return (
              <Card 
                key={stage.id}
                className={cn(
                  "transition-all duration-500 cursor-pointer hover:scale-[1.02]",
                  "bg-gray-900/40 border-gray-700/60"
                )}
                onClick={() => expandStage(stage.id)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={cn("p-2 rounded-lg", statusColors.accent)}>
                        <span className="text-xl">{stage.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{stage.name}</h3>
                        <p className="text-sm text-gray-400">{stage.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-center">
                        <div className={cn("text-3xl font-bold", statusColors.color)}>
                          {stage.score}
                        </div>
                        <div className="text-xs text-gray-500">Score</div>
                      </div>
                      
                      <Button variant="ghost" size="icon" className="ml-2">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Collapsed View - Basic Info */}
                  <div className="space-y-4">
                    {/* Progress */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Progresso das Missões</span>
                        <span className="text-sm font-medium text-white">
                          {stage.completedMissions}/{stage.totalMissions}
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                      <div className="text-xs text-gray-500 mt-1">
                        {Math.round(progressPercentage)}% completo
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-3 gap-2">
                      {stage.metrics.primary.slice(0, 3).map((metric, index) => (
                        <div key={index} className="text-center p-2 bg-gray-800/60 border border-gray-700/50 rounded">
                          <div className="text-sm font-semibold text-white">
                            {formatMetricValue(metric.value, metric.format)}
                          </div>
                          <div className="text-xs text-gray-400 mb-1">{metric.label}</div>
                          {metric.trend && (
                            <div className="flex items-center justify-center space-x-1">
                              {getTrendIcon(metric.trend)}
                              {metric.trendValue && (
                                <span className="text-xs text-gray-500">{metric.trendValue}</span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center justify-between pt-2">
                      <Badge variant="outline" className={cn("text-xs", statusColors.color, statusColors.border)}>
                        {stage.status === 'excellent' && 'Excelente'}
                        {stage.status === 'good' && 'Bom'}
                        {stage.status === 'attention' && 'Atenção'}
                        {stage.status === 'critical' && 'Crítico'}
                      </Badge>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="text-xs">
                          <Target className="h-3 w-3 mr-1" />
                          {stage.missions.filter(m => m.status === 'available').length} missões
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs">
                          <BarChart3 className="h-3 w-3 mr-1" />
                          Métricas
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Expanded Stage Details */}
      {expandedStage && (
        <div className="mt-6">
          <Button 
            variant="outline" 
            onClick={() => expandStage('')}
            className="mb-4"
          >
            <ChevronUp className="h-4 w-4 mr-2" />
            Recolher Todas as Etapas
          </Button>
        </div>
      )}
    </div>
  );
}
