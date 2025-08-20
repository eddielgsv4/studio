"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { KPITooltip } from '@/components/ui/tooltip-kpi';
import { getKPIExplanation } from '@/lib/kpi-explanations';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  BarChart3,
  Target,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FunnelStage } from '@/lib/types-dashboard';
import { useDashboard } from '@/contexts/DashboardContext';
import { Button } from '@/components/ui/button';
import { MessageSquare, Zap } from 'lucide-react';

interface MetricsPanelProps {
  stage: FunnelStage;
}

export function MetricsPanel({ stage }: MetricsPanelProps) {
  const { askForDetails, project } = useDashboard();

  const handleAskForDetails = async (benchmarkMetric: string) => {
    await askForDetails('benchmark', `${stage.id}_${benchmarkMetric}`, benchmarkMetric);
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
      case 'up': return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-400" />;
      case 'stable': return <Minus className="h-4 w-4 text-gray-400" />;
      default: return null;
    }
  };

  const getBenchmarkStatus = (status: 'above' | 'below' | 'equal') => {
    switch (status) {
      case 'above':
        return { color: 'text-green-400', bg: 'bg-green-900/30', border: 'border-green-700/50', label: 'Acima' };
      case 'below':
        return { color: 'text-red-400', bg: 'bg-red-900/30', border: 'border-red-700/50', label: 'Abaixo' };
      case 'equal':
        return { color: 'text-gray-400', bg: 'bg-gray-900/30', border: 'border-gray-700/50', label: 'Igual' };
      default:
        return { color: 'text-gray-400', bg: 'bg-gray-900/30', border: 'border-gray-700/50', label: 'N/A' };
    }
  };

  return (
    <div className="space-y-4">
      {/* Primary Metrics */}
      <div>
        <h5 className="text-sm font-semibold text-white mb-3 flex items-center">
          <BarChart3 className="h-4 w-4 mr-2" />
          Métricas Principais
        </h5>
        <div className="grid grid-cols-3 gap-4">
          {stage.metrics.primary.map((metric, index) => (
            <Card key={index} className="bg-gray-800/60 border-gray-700/50">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-white mb-1">
                    {formatMetricValue(metric.value, metric.format)}
                  </div>
                  <KPITooltip explanation={getKPIExplanation(metric.label)} className="justify-center">
                    <div className="text-xs text-gray-400 mb-2">{metric.label}</div>
                  </KPITooltip>
                  {metric.trend && (
                    <div className="flex items-center justify-center space-x-1">
                      {getTrendIcon(metric.trend)}
                      {metric.trendValue && (
                        <span className={cn(
                          "text-xs",
                          metric.trend === 'up' ? 'text-green-400' :
                          metric.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                        )}>
                          {metric.trendValue}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Secondary Metrics */}
      {stage.metrics.secondary.length > 0 && (
        <div>
          <h5 className="text-sm font-semibold text-white mb-3 flex items-center">
            <Target className="h-4 w-4 mr-2" />
            Métricas Secundárias
          </h5>
          <div className="grid grid-cols-3 gap-3">
            {stage.metrics.secondary.map((metric, index) => (
              <div key={index} className="p-3 bg-gray-800/40 border border-gray-700/30 rounded-lg">
                <div className="text-center">
                  <div className="text-base font-semibold text-white">
                    {formatMetricValue(metric.value, metric.format)}
                  </div>
                  <KPITooltip explanation={getKPIExplanation(metric.label)} className="justify-center">
                    <div className="text-xs text-gray-400 mb-1">{metric.label}</div>
                  </KPITooltip>
                  {metric.trend && (
                    <div className="flex items-center justify-center space-x-1">
                      {getTrendIcon(metric.trend)}
                      {metric.trendValue && (
                        <span className="text-xs text-gray-500">{metric.trendValue}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Benchmarks */}
      {stage.metrics.benchmarks.length > 0 && (
        <div>
          <h5 className="text-sm font-semibold text-white mb-3 flex items-center">
            <Award className="h-4 w-4 mr-2" />
            Benchmarks do Mercado
          </h5>
          <div className="space-y-3">
            {stage.metrics.benchmarks.map((benchmark, index) => {
              const statusStyle = getBenchmarkStatus(benchmark.status);
              const percentage = benchmark.benchmark > 0 ? (benchmark.current / benchmark.benchmark) * 100 : 0;
              
              return (
                <Card key={index} className="bg-gray-800/40 border-gray-700/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <KPITooltip explanation={getKPIExplanation(benchmark.metric)}>
                        <span className="text-sm font-medium text-white">{benchmark.metric}</span>
                      </KPITooltip>
                      <Badge variant="outline" className={cn("text-xs", statusStyle.color, statusStyle.border)}>
                        {statusStyle.label} do mercado
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs text-gray-400">
                        Seu resultado: <span className="text-white font-medium">{benchmark.current}%</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        Mercado {benchmark.industry}: <span className="text-white font-medium">{benchmark.benchmark}%</span>
                      </div>
                    </div>
                    
                    <Progress 
                      value={Math.min(percentage, 100)} 
                      className="h-2"
                    />
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="text-xs text-gray-500">
                        {percentage > 100 ? (
                          <span className="text-green-400">
                            {Math.round(percentage - 100)}% acima do mercado
                          </span>
                        ) : percentage < 100 ? (
                          <span className="text-red-400">
                            {Math.round(100 - percentage)}% abaixo do mercado
                          </span>
                        ) : (
                          <span className="text-gray-400">No nível do mercado</span>
                        )}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAskForDetails(benchmark.metric)}
                        disabled={!project || project.wallet.credits < 5}
                        className="text-xs h-6 px-2 text-amber-400 hover:text-amber-300 hover:bg-amber-900/20"
                      >
                        <Zap className="h-3 w-3 mr-1" />
                        Detalhes (5 ⚡)
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
