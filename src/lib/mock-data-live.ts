import type { 
  LiveProjectState, 
  ChatMessage, 
  ValidationFlag, 
  Priority, 
  Insight, 
  Simulation,
  TimelineEvent 
} from './types-live';

// ============================================================================
// MOCK DATA PARA DESENVOLVIMENTO
// ============================================================================

export const mockLiveProjectState: LiveProjectState = {
  projectId: 'proj_123',
  sessionId: 'sess_456',
  userId: 'user_789',
  
  company: {
    name: 'TechFlow SaaS',
    segment: 'Tecnologia/SaaS',
    businessModel: 'B2B - SaaS',
    size: 'pequena',
    mainChallenge: 'Leads não convertem em reuniões',
    ticketMedio: 2500,
    cicloVendas: 45
  },
  
  conversation: {
    currentStage: 'meio',
    adaptiveFlow: true,
    completionPercentage: 65,
    lastInteraction: new Date(),
    isActive: true
  },
  
  metrics: {
    topo: {
      visitanteLead: 2.8,
      ctrAnuncios: 3.2,
      formPreenchido: 42,
      investimentoMensal: 15000,
      leadsMes: 180
    },
    meio: {
      leadMQL: 35,
      tempoPrimeiraResposta: 120,
      showRate: 45,
      tentativasContato: 4.2,
      canalPreferido: 'whatsapp'
    },
    fundo: {
      mqlSQL: 60,
      sqlVenda: 28,
      propostaFechamento: 35,
      followUpsMedios: 3.8,
      cicloVendas: 45
    },
    pos: {
      recompra60d: 22,
      churn30d: 12,
      churn60d: 18,
      churn90d: 25,
      nps: 7.2,
      ltv: 12500
    },
    confidence: {
      topo: 85,
      meio: 70,
      fundo: 90,
      pos: 65,
      overall: 78
    }
  },
  
  analysis: {
    scores: {
      topo: 75,
      meio: 45, // Problema identificado
      fundo: 80,
      pos: 65,
      overall: 66
    },
    benchmarks: {
      segment: 'Tecnologia/SaaS',
      size: 'pequena',
      benchmarks: {
        topo: {
          visitanteLead: { value: 3.5, status: 'amber' },
          ctrAnuncios: { value: 2.8, status: 'green' },
          formPreenchido: { value: 38, status: 'green' }
        },
        meio: {
          leadMQL: { value: 45, status: 'red' },
          tempoPrimeiraResposta: { value: 30, status: 'red' },
          showRate: { value: 70, status: 'red' }
        },
        fundo: {
          mqlSQL: { value: 55, status: 'green' },
          sqlVenda: { value: 25, status: 'green' },
          propostaFechamento: { value: 32, status: 'green' }
        },
        pos: {
          recompra60d: { value: 28, status: 'amber' },
          churn30d: { value: 8, status: 'amber' },
          churn60d: { value: 15, status: 'amber' }
        }
      }
    },
    priorities: [
      {
        id: 'p1',
        stage: 'meio',
        title: 'Reduzir tempo de primeira resposta',
        description: 'Implementar chatbot ou SLA de resposta em 15 minutos',
        impact: 'alto',
        effort: 'medio',
        priority: 9,
        estimatedGain: '+25% show rate',
        timeline: '14d',
        status: 'pending'
      },
      {
        id: 'p2',
        stage: 'meio',
        title: 'Otimizar processo de qualificação',
        description: 'Criar script de qualificação e treinamento do time',
        impact: 'alto',
        effort: 'baixo',
        priority: 8,
        estimatedGain: '+15% lead→MQL',
        timeline: '30d',
        status: 'pending'
      },
      {
        id: 'p3',
        stage: 'pos',
        title: 'Programa de onboarding',
        description: 'Criar jornada estruturada para novos clientes',
        impact: 'medio',
        effort: 'alto',
        priority: 6,
        estimatedGain: '-30% churn 30d',
        timeline: '90d',
        status: 'pending'
      }
    ],
    insights: [
      {
        id: 'i1',
        type: 'warning',
        stage: 'meio',
        title: 'Gargalo crítico no meio de funil',
        description: 'Tempo de resposta de 2h está impactando show rate. Mercado responde em 30min.',
        impact: 'Alto impacto na conversão',
        confidence: 92
      },
      {
        id: 'i2',
        type: 'opportunity',
        stage: 'topo',
        title: 'CTR acima da média',
        description: 'Seus anúncios estão performando bem. Considere aumentar investimento.',
        impact: 'Potencial de escalar leads',
        confidence: 85
      },
      {
        id: 'i3',
        type: 'success',
        stage: 'fundo',
        title: 'Conversão SQL→Venda forte',
        description: 'Seu processo de fechamento está otimizado vs. mercado.',
        impact: 'Mantenha o padrão atual',
        confidence: 88
      }
    ],
    simulations: []
  },
  
  validations: {
    flags: [
      {
        id: 'v1',
        type: 'outlier',
        stage: 'meio',
        metric: 'tempoPrimeiraResposta',
        value: 120,
        expectedRange: [15, 60],
        suggestion: 'Tempo muito alto. Mercado SaaS responde em 30min médio.',
        severity: 'high',
        autoFixAvailable: false
      }
    ],
    suggestions: [
      {
        id: 's1',
        type: 'benchmark',
        message: 'Show rate de 45% está abaixo da média do setor (70%). Considere melhorar qualificação.',
        confidence: 85
      }
    ],
    autoCorrections: []
  },
  
  timeline: [
    {
      id: 't1',
      type: 'metric_update',
      title: 'Métrica atualizada',
      description: 'Show Rate atualizado para 45%',
      stage: 'meio',
      metadata: { metric: 'showRate', value: 45 },
      timestamp: new Date(Date.now() - 5 * 60 * 1000) // 5 min atrás
    },
    {
      id: 't2',
      type: 'validation_flag',
      title: 'Alerta de validação',
      description: 'Tempo de resposta muito alto detectado',
      stage: 'meio',
      timestamp: new Date(Date.now() - 10 * 60 * 1000) // 10 min atrás
    },
    {
      id: 't3',
      type: 'stage_complete',
      title: 'Etapa concluída',
      description: 'Topo de funil mapeado com sucesso',
      stage: 'topo',
      timestamp: new Date(Date.now() - 15 * 60 * 1000) // 15 min atrás
    }
  ],
  
  createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 min atrás
  updatedAt: new Date()
};

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'm1',
    sessionId: 'sess_456',
    role: 'assistant',
    content: 'Olá! Bem-vindo ao seu Painel Vivo. Vou guiar você para mapear seu funil e já atualizar os indicadores aqui ao lado — em tempo real.',
    type: 'text',
    timestamp: new Date(Date.now() - 25 * 60 * 1000)
  },
  {
    id: 'm2',
    sessionId: 'sess_456',
    role: 'assistant',
    content: 'Antes de começarmos, me conte: qual é o maior desafio do seu funil de vendas hoje?',
    type: 'text',
    timestamp: new Date(Date.now() - 24 * 60 * 1000)
  },
  {
    id: 'm3',
    sessionId: 'sess_456',
    role: 'user',
    content: 'Nossos leads não estão convertendo em reuniões. Temos muitos leads mas poucos agendamentos.',
    type: 'text',
    timestamp: new Date(Date.now() - 23 * 60 * 1000)
  },
  {
    id: 'm4',
    sessionId: 'sess_456',
    role: 'assistant',
    content: 'Entendi! Esse é um problema clássico do meio de funil. Vamos focar na qualificação e resposta aos leads. Primeiro, me conte: qual o tempo médio da primeira resposta aos leads?',
    type: 'text',
    metadata: { stage: 'meio', intent: 'adaptive_flow' },
    timestamp: new Date(Date.now() - 22 * 60 * 1000)
  },
  {
    id: 'm5',
    sessionId: 'sess_456',
    role: 'user',
    content: 'Cerca de 2 horas, às vezes mais.',
    type: 'text',
    timestamp: new Date(Date.now() - 21 * 60 * 1000)
  },
  {
    id: 'm6',
    sessionId: 'sess_456',
    role: 'assistant',
    content: '⚠️ Encontrei o problema! 2 horas é muito tempo. O mercado SaaS responde em 30 minutos em média. Isso explica o baixo show rate. Vou atualizar o painel.',
    type: 'validation',
    metadata: { stage: 'meio', metric: 'tempoPrimeiraResposta', value: 120 },
    timestamp: new Date(Date.now() - 20 * 60 * 1000)
  },
  {
    id: 'm7',
    sessionId: 'sess_456',
    role: 'assistant',
    content: 'Agora me conte: qual a taxa de comparecimento (show rate) nas reuniões agendadas?',
    type: 'text',
    timestamp: new Date(Date.now() - 5 * 60 * 1000)
  }
];

export const mockSimulations: Simulation[] = [
  {
    id: 'sim1',
    name: 'Reduzir SLA para 15min',
    description: 'Implementar chatbot + notificações para resposta em 15 minutos',
    changes: {
      tempoPrimeiraResposta: 15,
      showRate: 65
    },
    projectedImpact: {
      revenue: 35,
      conversion: 25,
      timeline: '2-3 semanas',
      confidence: 85
    },
    stage: 'meio',
    createdAt: new Date()
  },
  {
    id: 'sim2',
    name: 'Dobrar investimento em ads',
    description: 'Aumentar budget de R$ 15k para R$ 30k mantendo CTR',
    changes: {
      investimentoMensal: 30000,
      leadsMes: 360
    },
    projectedImpact: {
      revenue: 45,
      conversion: 0,
      timeline: '1 mês',
      confidence: 75
    },
    stage: 'topo',
    createdAt: new Date()
  }
];

// ============================================================================
// FUNÇÕES UTILITÁRIAS PARA MOCK
// ============================================================================

export const generateMockMessage = (role: 'user' | 'assistant', content: string): ChatMessage => ({
  id: `m_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  sessionId: 'sess_456',
  role,
  content,
  type: 'text',
  timestamp: new Date()
});

export const generateMockTimelineEvent = (
  type: TimelineEvent['type'],
  title: string,
  description: string,
  stage?: string
): TimelineEvent => ({
  id: `t_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  type,
  title,
  description,
  stage: stage as any,
  timestamp: new Date()
});

export const updateMockMetric = (
  state: LiveProjectState,
  stage: string,
  metric: string,
  value: number
): LiveProjectState => {
  const newState = { ...state };
  
  // Atualizar métrica
  if (stage in newState.metrics) {
    (newState.metrics as any)[stage] = {
      ...(newState.metrics as any)[stage],
      [metric]: value
    };
  }
  
  // Adicionar evento na timeline
  newState.timeline.unshift(generateMockTimelineEvent(
    'metric_update',
    'Métrica atualizada',
    `${metric} atualizado para ${value}`,
    stage
  ));
  
  // Atualizar timestamp
  newState.updatedAt = new Date();
  
  return newState;
};

// ============================================================================
// SIMULAÇÃO DE DELAYS PARA REALISMO
// ============================================================================

export const simulateTypingDelay = (message: string): Promise<void> => {
  // Simula tempo de digitação baseado no tamanho da mensagem
  const baseDelay = 1000; // 1 segundo base
  const charDelay = message.length * 30; // 30ms por caractere
  const totalDelay = Math.min(baseDelay + charDelay, 3000); // máximo 3 segundos
  
  return new Promise(resolve => setTimeout(resolve, totalDelay));
};

export const simulateAIProcessing = (): Promise<void> => {
  // Simula processamento de IA (500ms a 2s)
  const delay = 500 + Math.random() * 1500;
  return new Promise(resolve => setTimeout(resolve, delay));
};
