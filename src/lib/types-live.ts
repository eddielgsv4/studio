// ============================================================================
// LIVE PROJECT TYPES - Solução Híbrida com Mock Data
// ============================================================================

export interface LiveProjectState {
  projectId: string;
  sessionId: string;
  userId: string;
  
  // Contexto da empresa
  company: {
    name: string;
    segment: string;
    businessModel: string;
    size: 'startup' | 'pequena' | 'media' | 'grande';
    mainChallenge?: string; // Pergunta inicial adaptativa
    ticketMedio?: number;
    cicloVendas?: number;
  };
  
  // Estado da conversa
  conversation: {
    currentStage: 'discovery' | 'topo' | 'meio' | 'fundo' | 'pos' | 'synthesis';
    adaptiveFlow: boolean; // Fluxo personalizado
    completionPercentage: number;
    lastInteraction: Date;
    isActive: boolean;
  };
  
  // Métricas coletadas
  metrics: {
    topo: TopoMetrics;
    meio: MeioMetrics;
    fundo: FundoMetrics;
    pos: PosMetrics;
    confidence: ConfidenceScores; // Confiança nos dados
  };
  
  // Análise em tempo real
  analysis: {
    scores: StageScores;
    benchmarks: BenchmarkComparison;
    priorities: Priority[];
    insights: Insight[];
    simulations: Simulation[]; // Simulações
  };
  
  // Validações inteligentes
  validations: {
    flags: ValidationFlag[];
    suggestions: ValidationSuggestion[];
    autoCorrections: AutoCorrection[];
  };
  
  // Timeline de eventos
  timeline: TimelineEvent[];
  
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// MÉTRICAS POR ETAPA
// ============================================================================

export interface TopoMetrics {
  visitanteLead: number; // %
  ctrAnuncios: number; // %
  formPreenchido: number; // %
  investimentoMensal: number; // R$
  leadsMes: number; // quantidade
}

export interface MeioMetrics {
  leadMQL: number; // %
  tempoPrimeiraResposta: number; // minutos
  showRate: number; // %
  tentativasContato: number; // quantidade média
  canalPreferido: 'whatsapp' | 'email' | 'telefone' | 'outro';
}

export interface FundoMetrics {
  mqlSQL: number; // %
  sqlVenda: number; // %
  propostaFechamento: number; // %
  followUpsMedios: number; // quantidade
  cicloVendas: number; // dias
}

export interface PosMetrics {
  recompra60d: number; // %
  churn30d: number; // %
  churn60d: number; // %
  churn90d: number; // %
  nps?: number; // 0-10
  ltv?: number; // R$
}

// ============================================================================
// CONFIANÇA E VALIDAÇÃO
// ============================================================================

export interface ConfidenceScores {
  topo: number; // 0-100%
  meio: number;
  fundo: number;
  pos: number;
  overall: number;
}

export interface ValidationFlag {
  id: string;
  type: 'inconsistency' | 'outlier' | 'missing' | 'suspicious';
  stage: 'topo' | 'meio' | 'fundo' | 'pos';
  metric: string;
  value: number;
  expectedRange: [number, number];
  suggestion: string;
  severity: 'low' | 'medium' | 'high';
  autoFixAvailable: boolean;
}

export interface ValidationSuggestion {
  id: string;
  type: 'benchmark' | 'correction' | 'clarification';
  message: string;
  suggestedValue?: number;
  confidence: number;
}

export interface AutoCorrection {
  id: string;
  type: 'logic_error' | 'unit_conversion' | 'typo_fix';
  originalValue: number;
  correctedValue: number;
  explanation: string;
  applied: boolean;
}

// ============================================================================
// ANÁLISE E SCORES
// ============================================================================

export interface StageScores {
  topo: number; // 0-100
  meio: number;
  fundo: number;
  pos: number;
  overall: number;
}

export interface BenchmarkComparison {
  segment: string;
  size: string;
  benchmarks: {
    topo: Record<string, { value: number; status: 'green' | 'amber' | 'red' }>;
    meio: Record<string, { value: number; status: 'green' | 'amber' | 'red' }>;
    fundo: Record<string, { value: number; status: 'green' | 'amber' | 'red' }>;
    pos: Record<string, { value: number; status: 'green' | 'amber' | 'red' }>;
  };
}

export interface Priority {
  id: string;
  stage: 'topo' | 'meio' | 'fundo' | 'pos';
  title: string;
  description: string;
  impact: 'baixo' | 'medio' | 'alto';
  effort: 'baixo' | 'medio' | 'alto';
  priority: number; // 1-10
  estimatedGain: string; // ex: "+15% conversão"
  timeline: '14d' | '30d' | '90d';
  status: 'pending' | 'in_progress' | 'completed';
}

export interface Insight {
  id: string;
  type: 'opportunity' | 'warning' | 'success' | 'benchmark';
  stage: 'topo' | 'meio' | 'fundo' | 'pos' | 'geral';
  title: string;
  description: string;
  impact: string;
  confidence: number;
}

// ============================================================================
// SIMULAÇÕES
// ============================================================================

export interface Simulation {
  id: string;
  name: string;
  description: string;
  changes: Record<string, number>;
  projectedImpact: {
    revenue: number; // % de aumento
    conversion: number; // % de aumento
    timeline: string; // ex: "2-3 meses"
    confidence: number; // 0-100%
  };
  stage: 'topo' | 'meio' | 'fundo' | 'pos';
  createdAt: Date;
}

// ============================================================================
// CHAT E MENSAGENS
// ============================================================================

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  type: 'text' | 'metric_update' | 'validation' | 'simulation' | 'insight';
  metadata?: {
    stage?: string;
    metric?: string;
    value?: number;
    confidence?: number;
    intent?: string;
  };
  timestamp: Date;
}

export interface ChatIntent {
  type: 'question' | 'simulate' | 'compare' | 'explain' | 'prioritize';
  content: string;
  parameters?: Record<string, any>;
}

// ============================================================================
// TIMELINE E EVENTOS
// ============================================================================

export interface TimelineEvent {
  id: string;
  type: 'metric_update' | 'stage_complete' | 'validation_flag' | 'simulation_run' | 'insight_generated';
  title: string;
  description: string;
  stage?: 'topo' | 'meio' | 'fundo' | 'pos';
  metadata?: Record<string, any>;
  timestamp: Date;
}

// ============================================================================
// CONTEXTO E HOOKS
// ============================================================================

export interface LiveProjectContextType {
  // Estado
  projectState: LiveProjectState | null;
  isLoading: boolean;
  error: string | null;
  
  // Chat
  messages: ChatMessage[];
  isTyping: boolean;
  
  // Ações
  sendMessage: (content: string, intent?: ChatIntent) => Promise<void>;
  updateMetric: (stage: string, metric: string, value: number) => Promise<void>;
  runSimulation: (changes: Record<string, number>) => Promise<Simulation>;
  validateData: () => Promise<ValidationFlag[]>;
  
  // Navegação
  goToStage: (stage: string) => void;
  completeStage: (stage: string) => void;
  
  // Utilidades
  getConfidence: (stage?: string) => number;
  getBenchmark: (stage: string, metric: string) => number;
  getInsights: (stage?: string) => Insight[];
}

// ============================================================================
// CONFIGURAÇÕES E CONSTANTES
// ============================================================================

export const STAGES = {
  discovery: {
    title: 'Descoberta',
    description: 'Entendendo seu contexto e desafios',
    icon: '🔍'
  },
  topo: {
    title: 'Topo de Funil',
    description: 'Atração e geração de leads',
    icon: '📈'
  },
  meio: {
    title: 'Meio de Funil',
    description: 'Qualificação e nutrição',
    icon: '🎯'
  },
  fundo: {
    title: 'Fundo de Funil',
    description: 'Conversão e fechamento',
    icon: '💰'
  },
  pos: {
    title: 'Pós-Conversão',
    description: 'Retenção e expansão',
    icon: '🔄'
  },
  synthesis: {
    title: 'Síntese',
    description: 'Análise completa e próximos passos',
    icon: '📊'
  }
} as const;

export const VALIDATION_THRESHOLDS = {
  topo: {
    visitanteLead: { min: 0.5, max: 15, avg: 3 },
    ctrAnuncios: { min: 0.5, max: 10, avg: 2.5 },
    formPreenchido: { min: 10, max: 80, avg: 35 }
  },
  meio: {
    leadMQL: { min: 10, max: 80, avg: 40 },
    tempoPrimeiraResposta: { min: 1, max: 1440, avg: 60 },
    showRate: { min: 30, max: 95, avg: 65 }
  },
  fundo: {
    mqlSQL: { min: 15, max: 90, avg: 50 },
    sqlVenda: { min: 10, max: 70, avg: 25 },
    propostaFechamento: { min: 15, max: 80, avg: 35 }
  },
  pos: {
    recompra60d: { min: 5, max: 80, avg: 25 },
    churn30d: { min: 1, max: 30, avg: 8 },
    churn60d: { min: 2, max: 40, avg: 12 }
  }
} as const;
