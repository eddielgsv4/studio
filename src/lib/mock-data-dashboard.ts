import type { DashboardProject, Mission, TeamOffer, NotificationAlert, ChatMessage } from './types-dashboard';

export const mockDashboardProject: DashboardProject = {
  id: 'proj_123',
  name: 'Projeto TechCorp',
  company: {
    name: 'TechCorp Solutions',
    segment: 'SaaS B2B',
    ticketMedio: 2500
  },
  createdAt: new Date('2024-01-15'),
  lastUpdated: new Date(),
  status: 'active',
  overallScore: 68,
  wallet: {
    credits: 85,
    plan: 'free',
    monthlyLimit: 200,
    usedThisMonth: 115,
    resetDate: new Date('2024-02-01')
  },
  stages: [
    {
      id: 'topo',
      name: 'Topo de Funil',
      icon: '📈',
      description: 'Atração e geração de leads',
      score: 72,
      confidence: 85,
      status: 'good',
      completedMissions: 3,
      totalMissions: 7,
      metrics: {
        primary: [
          { label: 'Visitante → Lead', value: 3.2, format: 'percentage', trend: 'up', trendValue: '+0.5%' },
          { label: 'CTR Anúncios', value: 2.8, format: 'percentage', trend: 'down', trendValue: '-0.3%' },
          { label: 'Leads/mês', value: 450, format: 'number', trend: 'up', trendValue: '+12%' }
        ],
        secondary: [
          { label: 'Custo por Lead', value: 85, format: 'currency', trend: 'down', trendValue: '-15%' },
          { label: 'Qualidade do Lead', value: 7.2, format: 'number', trend: 'stable' },
          { label: 'Tempo na Página', value: 180, format: 'number', trend: 'up', trendValue: '+25s' }
        ],
        benchmarks: [
          { metric: 'Conversão Visitante-Lead', current: 3.2, benchmark: 2.5, status: 'above', industry: 'SaaS B2B' },
          { metric: 'CTR Anúncios', current: 2.8, benchmark: 3.5, status: 'below', industry: 'SaaS B2B' }
        ]
      },
      missions: [
        {
          id: 'topo_001',
          title: 'Otimizar Landing Pages',
          description: 'Revisar e otimizar as principais landing pages para melhorar a conversão de visitantes em leads.',
          type: 'self',
          difficulty: 'medium',
          estimatedTime: '2-3 horas',
          impact: 'high',
          status: 'completed',
          checklist: [
            { id: 'c1', text: 'Analisar heatmaps das páginas principais', completed: true, required: true },
            { id: 'c2', text: 'Revisar headlines e CTAs', completed: true, required: true },
            { id: 'c3', text: 'Implementar melhorias identificadas', completed: true, required: true },
            { id: 'c4', text: 'Configurar testes A/B', completed: true, required: false }
          ],
          rewards: [
            { type: 'score_boost', value: 5, description: '+5 pontos no score de Topo' },
            { type: 'unlock_mission', value: 'topo_004', description: 'Desbloqueou: Automação de Lead Scoring' }
          ]
        },
        {
          id: 'topo_002',
          title: 'Implementar Chat Widget',
          description: 'Adicionar chat widget inteligente para capturar mais leads e responder dúvidas em tempo real.',
          type: 'agent',
          difficulty: 'easy',
          estimatedTime: '30 minutos',
          impact: 'medium',
          status: 'available',
          agentCost: 15,
          checklist: [
            { id: 'c1', text: 'Escolher ferramenta de chat', completed: false, required: true },
            { id: 'c2', text: 'Configurar mensagens automáticas', completed: false, required: true },
            { id: 'c3', text: 'Integrar com CRM', completed: false, required: true }
          ],
          rewards: [
            { type: 'score_boost', value: 3, description: '+3 pontos no score de Topo' },
            { type: 'credits', value: 10, description: '+10 créditos de bônus' }
          ]
        },
        {
          id: 'topo_003',
          title: 'Campanha de Retargeting',
          description: 'Criar campanhas de retargeting para visitantes que não converteram na primeira visita.',
          type: 'team',
          difficulty: 'hard',
          estimatedTime: '1-2 semanas',
          impact: 'high',
          status: 'available',
          teamOffer: {
            title: 'Campanha de Retargeting Completa',
            description: 'Nossa equipe criará e gerenciará campanhas de retargeting no Google Ads e Facebook para recuperar visitantes perdidos.',
            price: 1997,
            installments: { count: 12, value: 199.70 },
            benefits: [
              'Setup completo das campanhas',
              'Criação de audiências personalizadas',
              'Gestão por 3 meses',
              'Relatórios semanais',
              'Otimização contínua'
            ],
            whatsappNumber: '5511999999999',
            ctaText: 'Quero Implementar Agora',
            urgency: 'Oferta válida até o final do mês!'
          },
          checklist: [
            { id: 'c1', text: 'Definir audiências de retargeting', completed: false, required: true },
            { id: 'c2', text: 'Criar criativos para anúncios', completed: false, required: true },
            { id: 'c3', text: 'Configurar campanhas', completed: false, required: true },
            { id: 'c4', text: 'Monitorar e otimizar', completed: false, required: true }
          ],
          rewards: [
            { type: 'score_boost', value: 8, description: '+8 pontos no score de Topo' },
            { type: 'unlock_mission', value: 'meio_005', description: 'Desbloqueou: Nutrição Avançada' }
          ]
        }
      ]
    },
    {
      id: 'meio',
      name: 'Meio de Funil',
      icon: '🎯',
      description: 'Qualificação e nutrição de leads',
      score: 58,
      confidence: 78,
      status: 'attention',
      completedMissions: 1,
      totalMissions: 6,
      metrics: {
        primary: [
          { label: 'Lead → MQL', value: 25, format: 'percentage', trend: 'down', trendValue: '-5%' },
          { label: 'Tempo Resposta', value: 45, format: 'minutes', trend: 'up', trendValue: '+10min' },
          { label: 'Show Rate', value: 65, format: 'percentage', trend: 'stable' }
        ],
        secondary: [
          { label: 'Email Open Rate', value: 22, format: 'percentage', trend: 'down', trendValue: '-3%' },
          { label: 'Click Rate', value: 4.5, format: 'percentage', trend: 'stable' },
          { label: 'Lead Score Médio', value: 68, format: 'number', trend: 'up', trendValue: '+5' }
        ],
        benchmarks: [
          { metric: 'Lead para MQL', current: 25, benchmark: 35, status: 'below', industry: 'SaaS B2B' },
          { metric: 'Tempo de Resposta', current: 45, benchmark: 15, status: 'below', industry: 'SaaS B2B' }
        ]
      },
      missions: [
        {
          id: 'meio_001',
          title: 'Implementar Lead Scoring',
          description: 'Configurar sistema de pontuação automática para identificar leads mais qualificados.',
          type: 'self',
          difficulty: 'medium',
          estimatedTime: '4-6 horas',
          impact: 'high',
          status: 'completed',
          checklist: [
            { id: 'c1', text: 'Definir critérios de pontuação', completed: true, required: true },
            { id: 'c2', text: 'Configurar automação no CRM', completed: true, required: true },
            { id: 'c3', text: 'Testar e ajustar pontuações', completed: true, required: true }
          ],
          rewards: [
            { type: 'score_boost', value: 6, description: '+6 pontos no score de Meio' },
            { type: 'unlock_mission', value: 'meio_003', description: 'Desbloqueou: Automação de Nutrição' }
          ]
        },
        {
          id: 'meio_002',
          title: 'Reduzir Tempo de Resposta',
          description: 'Implementar sistema de resposta automática e alertas para reduzir tempo de primeira resposta.',
          type: 'agent',
          difficulty: 'easy',
          estimatedTime: '1 hora',
          impact: 'high',
          status: 'available',
          agentCost: 10,
          checklist: [
            { id: 'c1', text: 'Configurar resposta automática', completed: false, required: true },
            { id: 'c2', text: 'Criar alertas para equipe', completed: false, required: true },
            { id: 'c3', text: 'Definir SLA de resposta', completed: false, required: true }
          ],
          rewards: [
            { type: 'score_boost', value: 7, description: '+7 pontos no score de Meio' },
            { type: 'insight', value: 'response_time_analysis', description: 'Análise detalhada do tempo de resposta' }
          ]
        }
      ]
    },
    {
      id: 'fundo',
      name: 'Fundo de Funil',
      icon: '💰',
      description: 'Conversão e fechamento',
      score: 75,
      confidence: 92,
      status: 'good',
      completedMissions: 4,
      totalMissions: 5,
      metrics: {
        primary: [
          { label: 'MQL → SQL', value: 45, format: 'percentage', trend: 'up', trendValue: '+8%' },
          { label: 'SQL → Venda', value: 28, format: 'percentage', trend: 'up', trendValue: '+3%' },
          { label: 'Ciclo de Vendas', value: 35, format: 'days', trend: 'down', trendValue: '-5 dias' }
        ],
        secondary: [
          { label: 'Ticket Médio', value: 2500, format: 'currency', trend: 'up', trendValue: '+R$200' },
          { label: 'Proposta → Fechamento', value: 32, format: 'percentage', trend: 'stable' },
          { label: 'Reuniões/Vendedor', value: 12, format: 'number', trend: 'up', trendValue: '+2' }
        ],
        benchmarks: [
          { metric: 'SQL para Venda', current: 28, benchmark: 25, status: 'above', industry: 'SaaS B2B' },
          { metric: 'Ciclo de Vendas', current: 35, benchmark: 45, status: 'above', industry: 'SaaS B2B' }
        ]
      },
      missions: [
        {
          id: 'fundo_001',
          title: 'Otimizar Processo de Vendas',
          description: 'Revisar e otimizar o processo de vendas para reduzir o ciclo e aumentar conversão.',
          type: 'self',
          difficulty: 'hard',
          estimatedTime: '1-2 dias',
          impact: 'high',
          status: 'completed',
          checklist: [
            { id: 'c1', text: 'Mapear processo atual', completed: true, required: true },
            { id: 'c2', text: 'Identificar gargalos', completed: true, required: true },
            { id: 'c3', text: 'Implementar melhorias', completed: true, required: true },
            { id: 'c4', text: 'Treinar equipe', completed: true, required: true }
          ],
          rewards: [
            { type: 'score_boost', value: 10, description: '+10 pontos no score de Fundo' },
            { type: 'unlock_mission', value: 'pos_001', description: 'Desbloqueou: Programa de Onboarding' }
          ]
        }
      ]
    },
    {
      id: 'pos',
      name: 'Pós-Conversão',
      icon: '🟢',
      description: 'Retenção e expansão',
      score: 45,
      confidence: 65,
      status: 'critical',
      completedMissions: 0,
      totalMissions: 8,
      metrics: {
        primary: [
          { label: 'Churn 30d', value: 12, format: 'percentage', trend: 'up', trendValue: '+2%' },
          { label: 'Recompra 60d', value: 15, format: 'percentage', trend: 'down', trendValue: '-3%' },
          { label: 'NPS', value: 6.2, format: 'number', trend: 'down', trendValue: '-0.8' }
        ],
        secondary: [
          { label: 'LTV', value: 7500, format: 'currency', trend: 'down', trendValue: '-R$500' },
          { label: 'Tempo Onboarding', value: 14, format: 'days', trend: 'up', trendValue: '+3 dias' },
          { label: 'Upsell Rate', value: 8, format: 'percentage', trend: 'stable' }
        ],
        benchmarks: [
          { metric: 'Churn 30 dias', current: 12, benchmark: 5, status: 'below', industry: 'SaaS B2B' },
          { metric: 'NPS', current: 6.2, benchmark: 8.0, status: 'below', industry: 'SaaS B2B' }
        ]
      },
      missions: [
        {
          id: 'pos_001',
          title: 'Programa de Onboarding',
          description: 'Criar programa estruturado de onboarding para reduzir churn inicial e acelerar time-to-value.',
          type: 'team',
          difficulty: 'hard',
          estimatedTime: '2-3 semanas',
          impact: 'high',
          status: 'locked',
          unlockConditions: ['Complete 4 missões no Fundo de Funil'],
          teamOffer: {
            title: 'Programa de Onboarding Completo',
            description: 'Desenvolvemos um programa de onboarding personalizado que reduz churn em até 60% nos primeiros 30 dias.',
            price: 4997,
            installments: { count: 12, value: 499.70 },
            benefits: [
              'Mapeamento da jornada do cliente',
              'Criação de materiais de onboarding',
              'Automações de acompanhamento',
              'Treinamento da equipe de CS',
              'Métricas e dashboards'
            ],
            whatsappNumber: '5511999999999',
            ctaText: 'Implementar Onboarding',
            urgency: 'Últimas vagas para este mês!'
          },
          checklist: [
            { id: 'c1', text: 'Mapear jornada do cliente', completed: false, required: true },
            { id: 'c2', text: 'Criar materiais de onboarding', completed: false, required: true },
            { id: 'c3', text: 'Configurar automações', completed: false, required: true },
            { id: 'c4', text: 'Treinar equipe de CS', completed: false, required: true }
          ],
          rewards: [
            { type: 'score_boost', value: 15, description: '+15 pontos no score de Pós' },
            { type: 'unlock_mission', value: 'pos_005', description: 'Desbloqueou: Programa de Upsell' }
          ]
        },
        {
          id: 'pos_002',
          title: 'Implementar NPS Automático',
          description: 'Configurar pesquisas NPS automáticas para monitorar satisfação e identificar riscos de churn.',
          type: 'agent',
          difficulty: 'easy',
          estimatedTime: '45 minutos',
          impact: 'medium',
          status: 'available',
          agentCost: 8,
          checklist: [
            { id: 'c1', text: 'Escolher ferramenta de NPS', completed: false, required: true },
            { id: 'c2', text: 'Configurar automação', completed: false, required: true },
            { id: 'c3', text: 'Criar fluxo de follow-up', completed: false, required: true }
          ],
          rewards: [
            { type: 'score_boost', value: 4, description: '+4 pontos no score de Pós' },
            { type: 'insight', value: 'nps_analysis', description: 'Análise detalhada do NPS' }
          ]
        }
      ]
    }
  ]
};

export const mockNotifications: NotificationAlert[] = [
  {
    id: 'notif_001',
    type: 'low_credits',
    title: 'Créditos Baixos',
    message: 'Você tem apenas 85 créditos restantes. Considere fazer upgrade do seu plano.',
    severity: 'warning',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false
  },
  {
    id: 'notif_002',
    type: 'mission_available',
    title: 'Nova Missão Desbloqueada',
    message: 'A missão "Automação de Nutrição" foi desbloqueada no Meio de Funil!',
    severity: 'success',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    read: false
  },
  {
    id: 'notif_003',
    type: 'score_drop',
    title: 'Score em Queda',
    message: 'O score do Pós-Conversão caiu 5 pontos. Verifique as métricas de churn.',
    severity: 'error',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true
  }
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg_001',
    type: 'assistant',
    content: 'Olá! Estou aqui para ajudar você a melhorar seu funil de vendas. Posso responder perguntas sobre qualquer etapa ou missão específica.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
  },
  {
    id: 'msg_002',
    type: 'user',
    content: 'Como posso melhorar minha conversão no meio de funil?',
    timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
  },
  {
    id: 'msg_003',
    type: 'assistant',
    content: 'Baseado nos seus dados, vejo que o tempo de resposta está em 45 minutos, bem acima do benchmark de 15 minutos. Recomendo começar pela missão "Reduzir Tempo de Resposta" que pode ser executada pelo agente em apenas 1 hora e custaria 10 créditos.',
    timestamp: new Date(Date.now() - 24 * 60 * 1000), // 24 minutes ago
    stageContext: 'meio'
  }
];

// Helper functions for testing
export function getStageById(stageId: string) {
  return mockDashboardProject.stages.find(stage => stage.id === stageId);
}

export function getMissionById(missionId: string) {
  for (const stage of mockDashboardProject.stages) {
    const mission = stage.missions.find(m => m.id === missionId);
    if (mission) return mission;
  }
  return null;
}

export function updateMissionStatus(missionId: string, status: Mission['status']) {
  const mission = getMissionById(missionId);
  if (mission) {
    mission.status = status;
  }
}

export function updateChecklistItem(missionId: string, checklistId: string, completed: boolean) {
  const mission = getMissionById(missionId);
  if (mission) {
    const item = mission.checklist.find(c => c.id === checklistId);
    if (item) {
      item.completed = completed;
    }
  }
}
