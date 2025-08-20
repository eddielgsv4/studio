"use client";

import { useLiveProject } from '@/contexts/LiveProjectContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Target,
  Activity,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Priority, Insight } from '@/lib/types-live';

export function SummaryPanel() {
  const { projectState, isLoading } = useLiveProject();

  if (isLoading || !projectState) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Resumo & Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <LoadingSpinner size="lg" />
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumo Geral */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span>Resumo Geral</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SummaryCard projectState={projectState} />
        </CardContent>
      </Card>

      {/* Prioridades */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-primary" />
            <span>Prioridades</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PrioritiesCard priorities={projectState.analysis.priorities} />
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <span>Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InsightsCard insights={projectState.analysis.insights} />
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({ projectState }: { projectState: any }) {
  const criticalIssues = projectState.analysis.insights.filter(
    (insight: Insight) => insight.type === 'warning'
  ).length;
  
  const opportunities = projectState.analysis.insights.filter(
    (insight: Insight) => insight.type === 'opportunity'
  ).length;

  return (
    <div className="grid grid-cols-3 gap-4 text-center">
      <div className="space-y-1">
        <div className="flex items-center justify-center">
          <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
          <span className="text-lg font-semibold text-red-600">{criticalIssues}</span>
        </div>
        <p className="text-xs text-muted-foreground">Urgências</p>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center justify-center">
          <Target className="h-4 w-4 text-amber-500 mr-1" />
          <span className="text-lg font-semibold text-amber-600">{opportunities}</span>
        </div>
        <p className="text-xs text-muted-foreground">Oportunidades</p>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center justify-center">
          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          <span className="text-lg font-semibold text-green-600">+25%</span>
        </div>
        <p className="text-xs text-muted-foreground">Potencial</p>
      </div>
    </div>
  );
}

function PrioritiesCard({ priorities }: { priorities: Priority[] }) {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'alto': return 'text-red-600 bg-red-50';
      case 'medio': return 'text-amber-600 bg-amber-50';
      case 'baixo': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTimelineColor = (timeline: string) => {
    switch (timeline) {
      case '14d': return 'text-green-600 bg-green-50';
      case '30d': return 'text-amber-600 bg-amber-50';
      case '90d': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-3">
      {priorities.slice(0, 3).map((priority) => (
        <div key={priority.id} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
          <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium text-primary">
            {priority.priority}
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <h5 className="text-sm font-medium">{priority.title}</h5>
              <div className="flex space-x-1">
                <Badge 
                  variant="outline" 
                  className={cn("text-xs", getImpactColor(priority.impact))}
                >
                  {priority.impact}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={cn("text-xs", getTimelineColor(priority.timeline))}
                >
                  {priority.timeline}
                </Badge>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground">{priority.description}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-green-600">
                {priority.estimatedGain}
              </span>
              <Button variant="ghost" size="sm" className="text-xs h-6">
                Implementar
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function InsightsCard({ insights }: { insights: Insight[] }) {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case 'opportunity': return <TrendingUp className="h-4 w-4 text-emerald-400" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-blue-400" />;
      default: return <Activity className="h-4 w-4 text-slate-400" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'warning': return 'border-l-amber-500 bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-500/20';
      case 'opportunity': return 'border-l-emerald-500 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20';
      case 'success': return 'border-l-blue-500 bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20';
      default: return 'border-l-slate-500 bg-gradient-to-r from-slate-500/10 to-slate-500/5 border border-slate-500/20';
    }
  };

  const getConfidenceBadgeColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'opportunity': return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'success': return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
      default: return 'bg-slate-500/10 text-slate-300 border-slate-500/30';
    }
  };

  const getImpactTextColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-amber-300 font-semibold';
      case 'opportunity': return 'text-emerald-300 font-semibold';
      case 'success': return 'text-blue-300 font-semibold';
      default: return 'text-slate-300 font-semibold';
    }
  };

  return (
    <div className="space-y-4">
      {insights.slice(0, 3).map((insight) => (
        <div 
          key={insight.id} 
          className={cn(
            "p-4 border-l-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
            getInsightColor(insight.type)
          )}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5 p-1.5 rounded-full bg-background/50">
              {getInsightIcon(insight.type)}
            </div>
            
            <div className="flex-1 space-y-2">
              <h5 className="text-sm font-semibold text-foreground">{insight.title}</h5>
              <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
              
              <div className="flex items-center justify-between pt-1">
                <span className={cn("text-xs", getImpactTextColor(insight.type))}>
                  {insight.impact}
                </span>
                <Badge 
                  variant="outline" 
                  className={cn("text-xs", getConfidenceBadgeColor(insight.type))}
                >
                  {insight.confidence}% confiança
                </Badge>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
