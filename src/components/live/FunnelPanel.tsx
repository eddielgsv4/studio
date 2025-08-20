"use client";

import { useLiveProject } from '@/contexts/LiveProjectContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  AlertTriangle,
  CheckCircle,
  Target,
  BarChart3,
  Zap,
  ArrowDown,
  MessageSquare,
  AlertCircle,
  Eye,
  Droplets,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  DollarSign,
  Activity,
  Gauge,
  ArrowRight,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Priority, LiveProjectState, TopoMetrics, MeioMetrics, FundoMetrics, PosMetrics } from '@/lib/types-live';

// --- Main Component ---
export function FunnelPanel() {
  const { projectState, isLoading } = useLiveProject();

  if (isLoading || !projectState) {
    return <LoadingState />;
  }

  return (
    <div className="h-full space-y-3 overflow-hidden">
      {/* Header com Score Geral */}
      <FunnelHeader projectState={projectState} />
      
      {/* Métricas Principais */}
      <OverallMetrics projectState={projectState} />
      
      {/* Layout Principal: Etapas + Problemas/Ações */}
      <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
        {/* Etapas do Funil - 2/3 da largura */}
        <div className="col-span-2">
          <FunnelStages projectState={projectState} />
        </div>
        
        {/* Problemas e Ações - 1/3 da largura */}
        <div className="space-y-3">
          <ProblemsAndOpportunities projectState={projectState} />
        </div>
      </div>
    </div>
  );
}

// --- Loading State Component ---
function LoadingState() {
  return (
    <div className="h-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <BarChart3 className="h-5 w-5" />
            <span>Painel Vivo</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <LoadingSpinner size="lg" />
            <p className="text-gray-500">Carregando dashboard...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- Header Component ---
function FunnelHeader({ projectState }: { projectState: LiveProjectState }) {
  const overallScore = projectState.analysis.scores.overall;
  const confidence = projectState.metrics.confidence.overall;
  
  const getScoreStatus = (score: number) => {
    if (score >= 70) return { color: 'text-green-400', bg: 'bg-green-900/30', border: 'border-green-700/50', label: 'Excelente' };
    if (score >= 50) return { color: 'text-yellow-400', bg: 'bg-yellow-900/30', border: 'border-yellow-700/50', label: 'Atenção' };
    return { color: 'text-red-400', bg: 'bg-red-900/30', border: 'border-red-700/50', label: 'Crítico' };
  };

  const scoreStatus = getScoreStatus(overallScore);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-800 rounded-lg">
              <Gauge className="h-5 w-5 text-gray-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Diagnóstico do Funil</h2>
              <p className="text-sm text-gray-500">{projectState.company.name} • {projectState.company.segment}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className={cn("text-2xl font-bold", scoreStatus.color)}>{overallScore}</div>
              <div className="text-xs text-gray-500">Score Geral</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-bold text-gray-300">{confidence}%</div>
              <div className="text-xs text-gray-500">Confiança</div>
            </div>
            
            <Badge 
              variant="outline" 
              className={cn("px-3 py-1 text-sm font-medium", scoreStatus.bg, scoreStatus.color, scoreStatus.border)}
            >
              {scoreStatus.label}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Overall Metrics Component ---
function OverallMetrics({ projectState }: { projectState: LiveProjectState }) {
  const { metrics } = projectState;
  
  // Cálculos baseados nos dados reais
  const visitantes = Math.round(metrics.topo.leadsMes / (metrics.topo.visitanteLead / 100));
  const leads = metrics.topo.leadsMes;
  const mqls = Math.round(leads * (metrics.meio.leadMQL / 100));
  const sqls = Math.round(mqls * (metrics.fundo.mqlSQL / 100));
  const vendas = Math.round(sqls * (metrics.fundo.sqlVenda / 100));
  const receita = vendas * (projectState.company.ticketMedio || 0);
  
  const conversaoTotal = visitantes > 0 ? (vendas / visitantes * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard 
        icon={<Users className="h-5 w-5" />}
        label="Visitantes/mês" 
        value={visitantes.toLocaleString()} 
        trend={null}
      />
      <MetricCard 
        icon={<Target className="h-5 w-5" />}
        label="Leads/mês" 
        value={leads.toLocaleString()} 
        trend={null}
      />
      <MetricCard 
        icon={<DollarSign className="h-5 w-5" />}
        label="Vendas/mês" 
        value={vendas.toLocaleString()} 
        trend={null}
      />
      <MetricCard 
        icon={<Activity className="h-5 w-5" />}
        label="Conversão Total" 
        value={`${conversaoTotal.toFixed(1)}%`} 
        trend={null}
      />
    </div>
  );
}

function MetricCard({ 
  icon, 
  label, 
  value, 
  trend 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  trend: 'up' | 'down' | null;
}) {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-800 rounded text-gray-400">
            {icon}
          </div>
          <div className="flex-1">
            <div className="text-xl font-bold text-white">{value}</div>
            <div className="text-xs text-gray-500">{label}</div>
          </div>
          {trend && (
            <div className={cn("flex items-center", trend === 'up' ? 'text-green-400' : 'text-red-400')}>
              {trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// --- Funnel Stages Component ---
function FunnelStages({ projectState }: { projectState: LiveProjectState }) {
  const stages = [
    {
      id: 'topo',
      name: 'Topo de Funil',
      icon: '📈',
      description: 'Atração e geração de leads',
      metrics: projectState.metrics.topo,
      score: projectState.analysis.scores.topo,
      confidence: projectState.metrics.confidence.topo,
      benchmarks: projectState.analysis.benchmarks.benchmarks.topo
    },
    {
      id: 'meio',
      name: 'Meio de Funil', 
      icon: '🎯',
      description: 'Qualificação e nutrição',
      metrics: projectState.metrics.meio,
      score: projectState.analysis.scores.meio,
      confidence: projectState.metrics.confidence.meio,
      benchmarks: projectState.analysis.benchmarks.benchmarks.meio
    },
    {
      id: 'fundo',
      name: 'Fundo de Funil',
      icon: '💰', 
      description: 'Conversão e fechamento',
      metrics: projectState.metrics.fundo,
      score: projectState.analysis.scores.fundo,
      confidence: projectState.metrics.confidence.fundo,
      benchmarks: projectState.analysis.benchmarks.benchmarks.fundo
    },
    {
      id: 'pos',
      name: 'Pós-Conversão',
      icon: '🔄',
      description: 'Retenção e expansão', 
      metrics: projectState.metrics.pos,
      score: projectState.analysis.scores.pos,
      confidence: projectState.metrics.confidence.pos,
      benchmarks: projectState.analysis.benchmarks.benchmarks.pos
    }
  ];

  return (
    <div className="space-y-2">
      <h3 className="text-base font-semibold text-white flex items-center space-x-2">
        <BarChart3 className="h-4 w-4" />
        <span>Análise por Etapa</span>
      </h3>
      
      <div className="grid gap-2">
        {stages.map((stage, index) => (
          <div key={stage.id}>
            <StageCard stage={stage} />
            {index < stages.length - 1 && <StageTransition />}
          </div>
        ))}
      </div>
    </div>
  );
}

function StageCard({ stage }: { stage: any }) {
  const getStatusColor = (score: number) => {
    if (score >= 70) return { 
      bg: 'bg-emerald-950/40', 
      border: 'border-emerald-800/60', 
      text: 'text-emerald-400',
      accent: 'bg-emerald-900/30'
    };
    if (score >= 50) return { 
      bg: 'bg-amber-950/40', 
      border: 'border-amber-800/60', 
      text: 'text-amber-400',
      accent: 'bg-amber-900/30'
    };
    return { 
      bg: 'bg-red-950/40', 
      border: 'border-red-800/60', 
      text: 'text-red-400',
      accent: 'bg-red-900/30'
    };
  };

  const statusColor = getStatusColor(stage.score);
  
  // Larguras do funil - cada etapa fica menor
  const getFunnelWidth = (stageId: string) => {
    switch (stageId) {
      case 'topo': return 'w-full'; // 100%
      case 'meio': return 'w-5/6 mx-auto'; // ~83%
      case 'fundo': return 'w-4/6 mx-auto'; // ~67%
      case 'pos': return 'w-3/6 mx-auto'; // 50%
      default: return 'w-full';
    }
  };
  
  // Métricas específicas por etapa
  const getStageMetrics = (stageId: string, metrics: any) => {
    switch (stageId) {
      case 'topo':
        return [
          { label: 'Visitante → Lead', value: `${metrics.visitanteLead}%`, benchmark: stage.benchmarks?.visitanteLead },
          { label: 'CTR Anúncios', value: `${metrics.ctrAnuncios}%`, benchmark: stage.benchmarks?.ctrAnuncios },
          { label: 'Leads/mês', value: metrics.leadsMes.toLocaleString(), benchmark: null }
        ];
      case 'meio':
        return [
          { label: 'Lead → MQL', value: `${metrics.leadMQL}%`, benchmark: stage.benchmarks?.leadMQL },
          { label: 'Tempo Resposta', value: `${metrics.tempoPrimeiraResposta}min`, benchmark: stage.benchmarks?.tempoPrimeiraResposta },
          { label: 'Show Rate', value: `${metrics.showRate}%`, benchmark: stage.benchmarks?.showRate }
        ];
      case 'fundo':
        return [
          { label: 'MQL → SQL', value: `${metrics.mqlSQL}%`, benchmark: stage.benchmarks?.mqlSQL },
          { label: 'SQL → Venda', value: `${metrics.sqlVenda}%`, benchmark: stage.benchmarks?.sqlVenda },
          { label: 'Ciclo de Vendas', value: `${metrics.cicloVendas}d`, benchmark: null }
        ];
      case 'pos':
        return [
          { label: 'Recompra 60d', value: `${metrics.recompra60d}%`, benchmark: stage.benchmarks?.recompra60d },
          { label: 'Churn 30d', value: `${metrics.churn30d}%`, benchmark: stage.benchmarks?.churn30d },
          { label: 'NPS', value: metrics.nps?.toFixed(1) || 'N/A', benchmark: null }
        ];
      default:
        return [];
    }
  };

  const stageMetrics = getStageMetrics(stage.id, stage.metrics);
  const funnelWidth = getFunnelWidth(stage.id);

  return (
    <div className={funnelWidth}>
      <Card className={cn("transition-all border", statusColor.bg, statusColor.border)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className={cn("p-2 rounded-lg", statusColor.accent)}>
                <span className="text-lg">{stage.icon}</span>
              </div>
              <div>
                <h4 className="text-base font-semibold text-white">{stage.name}</h4>
                <p className="text-sm text-gray-500">{stage.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-center">
                <div className={cn("text-xl font-bold", statusColor.text)}>{stage.score}</div>
                <div className="text-xs text-gray-500">Score</div>
              </div>
              
              <div className="text-center">
                <div className="text-base font-medium text-gray-300">{stage.confidence}%</div>
                <div className="text-xs text-gray-500">Confiança</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {stageMetrics.map((metric, index) => (
              <div key={index} className="text-center p-3 bg-gray-800/60 border border-gray-700/50 rounded-lg">
                <div className="text-base font-semibold text-white">{metric.value}</div>
                <div className="text-xs text-gray-400 mb-1">{metric.label}</div>
                {metric.benchmark && (
                  <div className={cn(
                    "text-xs font-medium",
                    metric.benchmark.status === 'green' ? 'text-emerald-400' :
                    metric.benchmark.status === 'amber' ? 'text-amber-400' : 'text-red-400'
                  )}>
                    vs {metric.benchmark.value}% mercado
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StageTransition() {
  return (
    <div className="flex justify-center py-1">
      <div className="flex items-center space-x-2 text-gray-600">
        <ArrowDown className="h-3 w-3" />
      </div>
    </div>
  );
}

// --- Problems and Opportunities Component ---
function ProblemsAndOpportunities({ projectState }: { projectState: LiveProjectState }) {
  const criticalIssues = getCriticalIssues(projectState);
  const topPriorities = getTopPriorities(projectState);

  return (
    <div className="space-y-3">
      {/* Problemas Críticos */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="text-white">Problemas Críticos</span>
            </div>
            <Badge variant="outline" className="bg-red-900/30 text-red-400 border-red-700/50 text-xs">
              {criticalIssues.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 space-y-2">
          {criticalIssues.length === 0 ? (
            <div className="text-center py-4">
              <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-xs text-gray-500">Nenhum problema crítico!</p>
            </div>
          ) : (
            criticalIssues.slice(0, 2).map((issue, index) => (
              <CriticalIssueCard key={index} issue={issue} />
            ))
          )}
        </CardContent>
      </Card>

      {/* Ações Prioritárias */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1">
              <Target className="h-4 w-4 text-gray-400" />
              <span className="text-white">Ações Prioritárias</span>
            </div>
            <Badge variant="outline" className="bg-gray-800 text-gray-400 border-gray-700 text-xs">
              {topPriorities.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 space-y-2">
          {topPriorities.slice(0, 2).map(priority => (
            <PriorityActionCard key={priority.id} priority={priority} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// --- Data Calculation & Types ---
interface CriticalIssue {
  stage: string;
  description: string;
  impact: number;
  estimatedGain: string;
  severity: 'high' | 'medium' | 'low';
}

function getCriticalIssues(projectState: LiveProjectState): CriticalIssue[] {
  const issues: CriticalIssue[] = [];
  const { analysis, metrics } = projectState;
  
  // Verificar problemas por etapa baseado nos scores
  if (analysis.scores.topo < 60) {
    issues.push({
      stage: 'Topo de Funil',
      description: `CTR de ${metrics.topo.ctrAnuncios}% e conversão visitante→lead de ${metrics.topo.visitanteLead}% estão impactando a geração de leads.`,
      impact: Math.round((70 - analysis.scores.topo) * 1.5),
      estimatedGain: '+20% leads',
      severity: 'high'
    });
  }
  
  if (analysis.scores.meio < 60) {
    issues.push({
      stage: 'Meio de Funil',
      description: `Tempo de resposta de ${metrics.meio.tempoPrimeiraResposta}min e show rate de ${metrics.meio.showRate}% estão prejudicando conversões.`,
      impact: Math.round((70 - analysis.scores.meio) * 1.8),
      estimatedGain: '+25% conversão',
      severity: 'high'
    });
  }
  
  if (analysis.scores.fundo < 60) {
    issues.push({
      stage: 'Fundo de Funil',
      description: `Conversão SQL→Venda de ${metrics.fundo.sqlVenda}% e ciclo de ${metrics.fundo.cicloVendas} dias precisam de otimização.`,
      impact: Math.round((70 - analysis.scores.fundo) * 2),
      estimatedGain: '+15% fechamento',
      severity: 'high'
    });
  }
  
  if (analysis.scores.pos < 60) {
    issues.push({
      stage: 'Pós-Conversão',
      description: `Churn de ${metrics.pos.churn30d}% em 30 dias está impactando o LTV dos clientes.`,
      impact: Math.round((70 - analysis.scores.pos) * 1.2),
      estimatedGain: '+30% LTV',
      severity: 'medium'
    });
  }
  
  return issues.sort((a, b) => b.impact - a.impact).slice(0, 3);
}

function getTopPriorities(projectState: LiveProjectState): Priority[] {
  return projectState.analysis.priorities
    .sort((a: Priority, b: Priority) => b.priority - a.priority)
    .slice(0, 3);
}

function CriticalIssueCard({ issue }: { issue: CriticalIssue }) {
  return (
    <div className="p-2 bg-red-950/30 border border-red-800/40 rounded">
      <div className="flex items-start justify-between mb-1">
        <span className="font-medium text-red-300 text-xs">{issue.stage}</span>
        <Badge className="bg-red-900/40 text-red-300 border-red-700/40 text-xs">
          -{issue.impact}%
        </Badge>
      </div>
      <p className="text-xs text-gray-400 mb-1 line-clamp-2">{issue.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">Ganho: <span className="text-emerald-400">{issue.estimatedGain}</span></span>
        <Button variant="ghost" size="sm" className="h-5 px-1 text-xs text-gray-300 hover:bg-gray-800">
          <Eye className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

function PriorityActionCard({ priority }: { priority: Priority }) {
  const impactStyles = {
    alto: 'border-orange-800/50 bg-orange-950/30',
    medio: 'border-gray-700/50 bg-gray-900/30',
    baixo: 'border-gray-700/50 bg-gray-900/30',
  };

  return (
    <div className={cn("p-2 border rounded", impactStyles[priority.impact] || impactStyles.medio)}>
      <div className="flex items-start justify-between mb-1">
        <span className="font-medium text-xs text-white">#{priority.priority} {priority.title}</span>
      </div>
      <p className="text-xs text-gray-400 mb-1 line-clamp-2">{priority.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">Ganho: <span className="text-emerald-400">{priority.estimatedGain}</span></span>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="h-5 px-1 text-xs text-gray-300 hover:bg-gray-800">
            <Zap className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-300 hover:bg-gray-800">
            <MessageSquare className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
