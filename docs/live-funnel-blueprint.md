## **GUIA DETALHADO DE IMPLEMENTAÇÃO: V4SALESAI - PAINEL VIVO + COPILOTO EM TEMPO REAL**

Este documento consolida todo o plano e insights discutidos, servindo como um guia detalhado para a implementação do novo projeto. Nada será deixado de fora, e o detalhismo será a prioridade, copiando letra por letra o que foi planejado e discutido.

---

### **1. VISÃO GERAL DO PROJETO: O SEGUNDO CÉREBRO COMERCIAL**

A evolução proposta transforma o fluxo de diagnóstico estático em uma experiência viva e interativa, onde o usuário conversa com um Copiloto IA e, em tempo real, um Painel de Funil é construído e atualizado. O objetivo é entregar uma experiência de "segundo cérebro comercial", onde o usuário e o Copiloto constroem e gerenciam o funil juntos. O agente educa o usuário a cada passo, coleta os dados corretos, calcula benchmarks/score/prioridade e atualiza um dashboard estilo BI em tempo real. Tudo persiste no "Documento-Coração do Projeto".

**Principais Ganhos:**
*   **Didática**: O Copiloto explica cada etapa, evitando termos difíceis e educando o cliente.
*   **Interatividade**: O usuário sente que está “copilotando” o diagnóstico junto com a IA.
*   **Gestão Contínua**: O painel não é estático; ele se atualiza a cada interação e serve como central de comando permanente.
*   **Evolução**: O Documento-Coração nasce da primeira jornada e vai sendo refinado em cada re-diagnóstico.

**Aproveitamento do que já existe:**
*   As etapas já mapeadas (Sobre a empresa, Topo, Meio, Fundo, Pós, Time, Estrutura, etc) continuam valendo.
*   As perguntas já criadas viram prompts que o Copiloto faz de forma natural no chat.
*   Os cálculos e lógicas de score, benchmarks e comparativos seguem a mesma base, mas agora são aplicados instantaneamente no painel.
*   O relatório final ainda existe, mas é gerado automaticamente a partir desse painel vivo, já consolidado.

---

### **2. ARQUITETURA DE DADOS (BASE SÓLIDA)**

A arquitetura de dados será centralizada no Firestore, garantindo uma única fonte de verdade e atualizações em tempo real.

#### **Estrutura do Firestore:**

```
projects/{projectId}/
├── liveState (document)      # Estado atual do projeto live
├── sessions/{sessionId}/ (collection)
│   ├── messages/{messageId} (documents) # Histórico de chat por sessão
│   ├── snapshots/{timestamp} (documents) # Versões congeladas para re-diagnóstico
│   └── validations/{validationId} (documents) # Flags de validação e sugestões
└── timeline/{eventId} (collection) # Eventos e mudanças no projeto
```

#### **Interfaces TypeScript (studio/src/lib/types-live.ts):**

```typescript
// ============================================================================
// LIVE PROJECT TYPES - Solução Híbrida
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
    lastInteraction: Date; // Alterado de Timestamp para Date para mock
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
  
  createdAt: Date; // Alterado de Timestamp para Date para mock
  updatedAt: Date; // Alterado de Timestamp para Date para mock
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
  createdAt: Date; // Alterado de Timestamp para Date para mock
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
  timestamp: Date; // Alterado de Timestamp para Date para mock
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
  timestamp: Date; // Alterado de Timestamp para Date para mock
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
```

---

### **3. FLUXO CONVERSACIONAL ADAPTATIVO (O CÉREBRO DO COPILOTO)**

O Copiloto não apenas faz perguntas, mas guia a conversa de forma inteligente, adaptando-se às respostas do usuário e educando-o no processo.

#### **Onboarding Inteligente (Primeira Interação):**
Em vez de um fluxo fixo, o Copiloto inicia com uma pergunta aberta para entender o maior desafio do usuário, e a IA decide por onde começar o diagnóstico.

**Narrativa de Onboarding (PT-BR) — FIRST RUN (auto-played in ChatPane):**
1.  Copiloto: “Bem-vindo ao seu Painel Vivo. Vou guiar você para mapear seu funil e já atualizar os indicadores aqui ao lado — em tempo real.”
2.  Copiloto: “A lógica é simples: eu explico cada etapa, faço perguntas curtas, e o painel atualiza na hora. No final, geramos seu diagnóstico com score, prioridades e próximos passos.”
3.  Copiloto: “Começamos por um resumo da sua empresa e depois vamos por etapas: Topo, Meio, Fundo e Pós. Tudo com linguagem clara e exemplos.”
4.  **Adaptação**: Copiloto: "Antes de começarmos, me conte: qual é o maior desafio do seu funil de vendas hoje?" (IA analisa a resposta e decide por onde começar).

#### **Sistema de Validação Inteligente:**
O Copiloto valida as respostas do usuário em tempo real, questionando inconsistências e oferecendo benchmarks.

```typescript
// Exemplo de lógica de validação (implementada no LiveProjectContext.tsx)
const intelligentValidation = {
  // Validação em tempo real
  validateMetric: (metric: string, value: number, context: CompanyContext) => {
    const benchmarks = getBenchmarksByContext(context); // Função a ser implementada para buscar benchmarks reais
    const expected = benchmarks[metric];
    
    if (value > expected.max * 2) {
      return {
        type: 'outlier',
        severity: 'high',
        message: `${value}% parece muito alto para ${metric}. Você quis dizer ${value/10}%?`,
        suggestedValue: value / 10
      };
    }
    
    if (value < expected.min / 2) {
      return {
        type: 'outlier', 
        severity: 'medium',
        message: `${value}% está bem abaixo da média do setor (${expected.avg}%). Confirma esse valor?`,
        benchmark: expected.avg
      };
    }
    
    return { valid: true };
  },
  
  // Correções automáticas (exemplo)
  autoCorrect: (metrics: FunnelMetrics) => {
    const corrections = [];
    
    // Exemplo: Se SQL > MQL, algo está errado
    if (metrics.fundoSQLVenda > metrics.fundoMQLSQL) {
      corrections.push({
        type: 'logic_error',
        message: 'SQL→Venda não pode ser maior que MQL→SQL. Vou ajustar automaticamente.',
        correction: 'swap_values'
      });
    }
    
    return corrections;
  }
};
```

#### **Coleta de Dados Conversacional — FLUXOS & PROMPTS (PT-BR):**
(Use message blocks; always precede questions with a 1-liner “por que isso importa”)

**A) SOBRE A EMPRESA**
*   Copiloto: “Para calibrar benchmarks, preciso do contexto da sua empresa.”
*   Perguntas (uma por vez, com validação e exemplo):
    *   “Qual o nome da sua empresa?” (ex: V4 Company)
    *   “Qual seu site e principais redes?” (ex: site, Instagram)
    *   “Qual seu segmento e modelo (B2B, B2C, SaaS, Serviços, E-commerce)?”
    *   “Ticket médio (R$) e ciclo de vendas (dias)?”
    *   “Em uma frase, qual transformação você gera para o cliente?”
*   Ao confirmar cada resposta → atualizar `liveState.company` e `liveState.context`.

**B) TOPO — ATRAÇÃO**
*   Copiloto (explicação curta): “Topo é como você atrai visitantes e converte em leads. Isso define o volume do funil.”
*   Perguntas essenciais (resposta direta ou seleção):
    *   “Quais canais você usa? (Mídia paga, Orgânico, Indicações, Outbound, Eventos…)”
    *   “Investimento/mês por canal?” (ex: Google R$X, Meta R$Y)
    *   “Leads/mês por canal?” (estimativa é ok)
    *   “CTR médio dos anúncios (%)?”
    *   “Taxa de visitantes → leads (%)?”
    *   “% de formulários concluídos (%)?”
*   A cada resposta: recompute estatísticas e comparativos; pintar o card TOPO.

**C) MEIO — QUALIFICAÇÃO**
*   Copiloto: “Aqui medimos velocidade e rigor da qualificação.”
*   Perguntas:
    *   “Tempo médio da primeira resposta (min)? Por onde responde mais rápido (WhatsApp, email, telefone)?”
    *   “% de leads que viram MQL?”
    *   “Show Rate (% de comparecimento nas reuniões)?”
    *   “Quantas tentativas de contato até resposta (média)?”
*   Atualizar card MEIO; gerar tooltip “Por que isso importa”.

**D) FUNDO — CONVERSÃO**
*   Copiloto: “Agora a eficiência em proposta e fechamento.”
*   Perguntas:
    *   “% de MQL que viram SQL?”
    *   “% de SQL que recebem proposta?”
    *   “% de propostas que viram vendas?”
    *   “Follow-ups médios por oportunidade?”
    *   “Ciclo de vendas (dias) e ticket médio (R$)?”
*   Atualizar card FUNDO; sugerir “provas sociais” se convProposta baixa.

**E) PÓS — FIDELIZAÇÃO**
*   Copiloto: “Retenção multiplica crescimento.”
*   Perguntas:
    *   “% SQL→Venda?”
    *   “Recompra em 60 dias (%)?”
    *   “Churn 30/60/90 dias (%)?”
    *   “NPS (se usar) e ações de retenção (onboarding, remarketing, fidelidade)?”
*   Atualizar card PÓS; avisar ganhos de LTV se churn reduzir.

**F) TIME / OPERAÇÃO (resumo consultivo)**
*   Copiloto: “Para explicar gargalos invisíveis, preciso do desenho do time.”
*   Perguntas:
    *   “Tamanho do time (SDR, Closer, CS)?”
    *   “Existe SLA de resposta? Cadências/playbooks?”
    *   “Ferramentas-chave (CRM, automação)?”
*   Atualizar `liveState.team/process`.

#### **Educação no Fluxo (microcopy PT-BR):**
*   Antes de cada bloco, exibir “O que é” e “Por que isso importa” (máx. 2 linhas).
*   Tooltip curtos para termos: churn (cancelamento), NPS, SDR, Closer, MQL, SQL, Show Rate, SLA.
*   Exemplos de preenchimento (placeholders) nos campos.

#### **Intents Mais Sofisticados (Comandos Naturais):**
*   “Como estou no topo?” → foco card TOPO + resumo
*   “Minhas três urgências” → abrir Prioridades
*   “Ganho se SLA cair para 10min” → simular e anotar na timeline
*   “Plano 14/30/90 detalhado” → expandir lista com tarefas
*   “Gerar PDF do diagnóstico” → export
*   “Ativar Copiloto” → criar Documento-Coração (se ainda não criado) e fixar plano
*   **Novos Intents**:
    *   "Simular: e se eu dobrar meu budget de Google Ads?"
    *   "Comparar: como estou vs meu concorrente X?"
    *   "Prever: qual ROI se eu implementar as ações de 14 dias?"
    *   "Explicar: por que meu score do meio de funil é baixo?"

---

### **4. COMPONENTES DA INTERFACE (UI/UX)**

A interface será dividida em dois painéis principais, com um design premium e responsivo.

#### **Layout (desktop → split 6/6; tablet/mobile → stack):**
*   **Left column**: `<ChatPane/>` (copiloto)
*   **Right column**: `<FunnelPanel/>` (dashboard vivo)
*   **Persistent top bar**: (`<LiveHeader/>`) (project title, Perfil, Wallet, Meus Projetos, Chats/Modelos, Sair)

#### **Design System:**
*   **UI copy**: Portuguese (Brasil), clear, pedagogical, professional.
*   **Visual**: Dark premium, 12-col grid, container 1200–1280px, no overlaps.
*   **Buttons**: brand-red `#E11D2E` (hover `#C80E20`) across the site; ONLY the Gift Card CTA is green `#22C55E`.
*   **Typography**: Inter/Manrope. Cards radius 16px; shadow `0 8px 40px rgba(0,0,0,.35)`.
*   **Color semantics**: 🟢 Acima, 🟡 Próximo, 🔴 Abaixo.

#### **Componentes Criados:**

1.  **`studio/src/app/(auth)/projeto/[projectId]/live/page.tsx`**
    *   Página principal que orquestra os painéis de chat e funil.
    *   Utiliza `LiveProjectProvider` para gerenciar o estado global.

2.  **`studio/src/components/ui/loading-spinner.tsx`**
    *   Componente de spinner para indicar carregamento.

3.  **`studio/src/components/live/LiveHeader.tsx`**
    *   Barra superior persistente com informações do projeto, progresso e ações.
    *   Exibe nome da empresa, segmento, etapa atual, progresso do diagnóstico e confiança geral.
    *   Botões de compartilhamento e exportação.

4.  **`studio/src/components/live/ChatPane.tsx` (Lado Esquerdo)**
    *   Interface de chat com o Copiloto Comercial.
    *   Exibe mensagens do Copiloto e do usuário.
    *   Suporta `typing indicators` para realismo.
    *   Campo de input para o usuário digitar respostas/perguntas.
    *   Botões de "Ações Rápidas" (Explicar etapa, Simular melhoria, Prioridades).
    *   `ChatMessageItem` para renderizar mensagens com ícones e badges contextuais.

5.  **`studio/src/components/live/FunnelPanel.tsx` (Lado Direito)**
    *   Dashboard vivo com métricas e análises em tempo real.
    *   **Cards das Etapas (StageCard)**:
        *   Quatro blocos: "Topo / Meio / Fundo / Pós"
        *   `Status chip` (🟢/🟡/🔴) + "vs mercado" (com setor).
        *   3 KPIs por card (ex.: Topo → Visit→Lead %, CTR %, Form %).
        *   `StatBars` com cores; mini-sparks de tendência (▲/▼).
        *   Insight curto: “Copiloto sugere: …”
    *   **Resumo Geral (SummaryCard)**: Urgências críticas (N), Oportunidades (N), Ganho Potencial (+X% conversão).
    *   **Prioridades (PrioritiesCard)**: lista ordenada (impacto x esforço).
    *   **Insights (InsightsCard)**: Alertas e oportunidades.

---

### **5. SISTEMA DE IA CONVERSACIONAL (O MOTOR INTELIGENTE)**

A inteligência artificial será o coração da experiência, orquestrando a conversa, a análise e as simulações.

#### **Prompt Adaptativo Melhorado (Genkit):**
O prompt da IA será dinâmico, considerando o contexto atual da empresa, o desafio principal e a etapa da conversa para gerar respostas e perguntas mais relevantes.

```typescript
const adaptiveCopilotPrompt = `
Você é um consultor comercial especialista que conduz diagnósticos de funil através de conversa natural.

CONTEXTO ATUAL:
- Empresa: {company.name} ({company.segment}, {company.size})
- Desafio principal: {company.mainChallenge}
- Etapa atual: {conversation.currentStage}
- Dados coletados: {JSON.stringify(metrics)}

COMPORTAMENTOS:
1. VALIDAÇÃO INTELIGENTE:
   - Se valor parecer inconsistente, questione educadamente
   - Ofereça benchmarks do setor como referência
   - Sugira correções quando necessário

2. EDUCAÇÃO CONTEXTUAL:
   - Explique termos técnicos de forma simples
   - Conecte métricas com impacto no negócio
   - Use exemplos do setor da empresa

3. FLUXO ADAPTATIVO:
   - Priorize etapas baseadas no desafio principal
   - Aprofunde onde há problemas críticos
   - Acelere onde está tudo bem

4. INTENTS ESPECIAIS:
   - "simular:" → Execute simulação de cenários
   - "comparar:" → Compare com benchmarks/concorrentes
   - "explicar:" → Detalhe conceitos ou métricas
   - "priorizar:" → Reordene ações por impacto

PRÓXIMA PERGUNTA:
{getNextQuestion(conversation.currentStage, company.mainChallenge)}
`;
```

#### **Sistema de Simulações (simulationEngine):**
Permite ao usuário simular o impacto de mudanças em métricas e ver projeções em tempo real.

```typescript
const simulationEngine = {
  // Simulação de impacto
  calculateImpact: (changes: Record<string, number>, currentMetrics: FunnelMetrics) => {
    const newMetrics = { ...currentMetrics, ...changes };
    
    // Cálculo de impacto em cascata (lógica a ser detalhada)
    const impact = {
      revenue: calculateRevenueImpact(newMetrics, currentMetrics),
      conversion: calculateConversionImpact(newMetrics, currentMetrics),
      timeline: estimateImplementationTime(changes)
    };
    
    return {
      changes,
      impact,
      confidence: calculateConfidence(changes, currentMetrics)
    };
  },
  
  // Simulações pré-definidas (exemplos)
  quickSimulations: {
    'dobrar-budget-ads': (metrics) => ({
      topoCTRAnuncios: metrics.topoCTRAnuncios * 1.2, // Assume melhoria de 20%
      topoVisitanteLead: metrics.topoVisitanteLead * 1.1 // Assume melhoria de 10%
    }),
    
    'melhorar-sla-resposta': (metrics) => ({
      meioTempoPrimeiraResposta: Math.max(5, metrics.meioTempoPrimeiraResposta * 0.5),
      meioLeadMQL: metrics.meioLeadMQL * 1.15
    }),
    
    'otimizar-follow-up': (metrics) => ({
      fundoFollowUpsMedios: metrics.fundoFollowUpsMedios * 1.3,
      fundoPropostaFechamento: metrics.fundoPropostaFechamento * 1.1
    })
  }
};
```

---

### **6. ROADMAP DE IMPLEMENTAÇÃO (FASES)**

A implementação será dividida em fases para garantir entregas contínuas e validação.

#### **Fase 1 - MVP Híbrido (2-3 semanas)**
*   **Semana 1:**
    *   ✅ Criar rota `/app/projeto/[projectId]/live`
    *   ✅ Implementar `ChatPane` básico com onboarding adaptativo (mocked)
    *   ✅ Implementar `FunnelPanel` com cards básicos (mocked)
    *   ✅ Estrutura de estado no Firestore com sessões (mocked no `LiveProjectContext`)
*   **Semana 2:**
    *   ✅ Sistema de validação inteligente (mocked)
    *   ✅ Integração com fluxos IA existentes (`funnel-diagnosis.ts`, `ai-sales-diagnosis.ts`) para análise (ainda com mock data para input/output)
    *   ✅ Métricas de confiança básicas (mocked)
*   **Semana 3:**
    *   ✅ Intents básicos (simular, explicar) no `ChatPane` (mocked)
    *   ✅ Simulações simples (mocked)
    *   ✅ Timeline de eventos (mocked)

#### **Fase 2 - IA Avançada (2-3 semanas)**
*   **Semana 4-5:**
    *   ✅ Implementar prompt adaptativo completo (integração real com Genkit)
    *   ✅ Validação automática avançada (integração real com Genkit e Firestore)
    *   ✅ Benchmarks contextuais dinâmicos (busca de dados reais de mercado)
    *   ✅ Sistema de correções automáticas (integração real)
*   **Semana 6:**
    *   ✅ Intents sofisticados (comparar, prever) com lógica real de IA
    *   ✅ Simulações com sliders interativos no `FunnelPanel`
    *   ✅ Análise de tendências (comparação `funilData` vs `funilDataAnterior`)

#### **Fase 3 - Experiência Premium (2-3 semanas)**
*   **Semana 7-8:**
    *   ✅ Micro-animações e feedback visual (cards piscando, progress bars animadas, confetti)
    *   ✅ Sistema de notificações inteligentes (ex: "Sua métrica X melhorou!")
    *   ✅ Comparações visuais antes/depois (para re-diagnósticos)
    *   ✅ Exportação avançada (PDF interativo, CSV)
*   **Semana 9:**
    *   ✅ Analytics comportamentais (rastreamento de cliques, uso de features)
    *   ✅ A/B testing de prompts e fluxos de IA
    *   ✅ Otimizações de performance (debounce, optimistic updates)

---

### **7. CONSIDERAÇÕES TÉCNICAS ADICIONAIS**

#### **Performance:**
*   **Debounce**: 500ms para atualizações de estado no Firestore para evitar escritas excessivas.
*   **Optimistic Updates**: A UI atualiza imediatamente após a ação do usuário, antes da confirmação do backend, para uma experiência fluida.
*   **Lazy Loading**: Componentes e dados carregados sob demanda para otimizar o tempo de carregamento inicial.
*   **Caching**: Utilizar bibliotecas como React Query para cache inteligente de dados e evitar requisições desnecessárias.

#### **Responsividade:**
*   **Desktop (min-width: 1024px)**: Layout split 50/50 (Chat | Dashboard).
    ```css
    @media (min-width: 1024px) {
      .live-layout { display: grid; grid-template-columns: 1fr 1fr; }
    }
    ```
*   **Tablet (min-width: 768px and max-width: 1023px)**: Layout empilhado com dashboard fixo no topo.
    ```css
    @media (min-width: 768px) and (max-width: 1023px) {
      .live-layout { display: flex; flex-direction: column; }
      .funnel-panel { position: sticky; top: 0; }
    }
    ```
*   **Mobile (max-width: 767px)**: Navegação por tabs alternando entre Chat e Dashboard.
    ```css
    @media (max-width: 767px) {
      .live-layout { display: block; }
      .tab-switcher { display: flex; } /* Componente de tabs a ser criado */
    }
    ```

#### **Segurança:**
*   **Validação de entrada**: Uso de Zod (já presente no Genkit) para garantir que os dados recebidos pela IA e salvos no Firestore estejam no formato correto e seguros.
*   **Rate limiting**: Implementar limites de requisições por usuário para prevenir abusos.
*   **Sanitização de dados**: Garantir que dados de simulação ou inputs do usuário não contenham código malicioso.
*   **Logs de auditoria**: Registrar mudanças críticas no estado do projeto para rastreabilidade.

---

### **8. BENEFÍCIOS E DIFERENCIAIS ALCANÇADOS**

A implementação deste plano transformará o V4SalesAI em um produto de ponta com diferenciais competitivos fortes:

*   **Diferenciação Competitiva Forte**: Poucos no mercado oferecem uma experiência de diagnóstico e gestão tão integrada e interativa.
*   **Maior Engajamento e Retenção**: A interatividade e o feedback em tempo real mantêm o usuário engajado e retornando à plataforma.
*   **Valor Percebido Muito Superior**: De uma ferramenta de "diagnóstico pontual" para um "consultor comercial contínuo".
*   **Educação do Mercado Integrada**: O Copiloto atua como um mentor, capacitando o usuário a entender e otimizar seu próprio funil.
*   **Tomada de Decisão Otimizada**: Com scores claros, prioridades e simulações, o usuário toma decisões mais assertivas.
*   **Gestão Proativa**: A ferramenta não apenas diagnostica, mas ajuda a gerenciar e evoluir o funil ao longo do tempo.

---

### **9. PRÓXIMOS PASSOS E EVOLUÇÕES FUTURAS**

Após a conclusão das fases de implementação, o projeto pode evoluir para:

*   **Integração com Ferramentas Externas**: CRM (Salesforce, HubSpot), ferramentas de automação de marketing (RD Station, ActiveCampaign), plataformas de anúncios (Google Ads, Meta Ads) para coleta de dados automatizada e execução de ações.
*   **Análise Preditiva Avançada**: Utilizar modelos de ML para prever tendências de funil, identificar riscos antes que se concretizem e sugerir otimizações proativas.
*   **Recomendações Personalizadas de Conteúdo**: Sugerir materiais de marketing, playbooks de vendas ou treinamentos específicos baseados nos gargalos identificados.
*   **Comunidade e Benchmarking Colaborativo**: Permitir que usuários (anonimamente) comparem seus funis com outros do mesmo segmento/porte, criando uma inteligência coletiva.
*   **Marketplace de Soluções**: Integrar com parceiros que ofereçam serviços ou ferramentas para resolver os problemas identificados (ex: agências de tráfego, consultorias de vendas).

Este plano detalhado fornece a base para construir uma ferramenta revolucionária de gestão de vendas, guiada por IA e focada na evolução contínua do funil comercial.

---

### **10. INTEGRAÇÃO GENKIT - IA REAL**

A transição do sistema mock para IA real é o próximo passo crítico para transformar o V4SalesAI Live em um produto revolucionário.

#### **Análise dos Fluxos Genkit Existentes:**

**1. `ask-copilot.ts` - ✅ Pronto para Adaptação**
*   Interface conversacional robusta com sistema de créditos
*   Prompt focado em análise de relatórios estruturados
*   Configurações de segurança implementadas
*   **Adaptação necessária**: Modificar para trabalhar com dados live em tempo real

**2. `funnel-diagnosis.ts` - ✅ Estrutura Perfeita**
*   Schema de dados alinhado com `types-live.ts`
*   Análise por etapas (topo, meio, fundo, pós)
*   Sistema de benchmarks por segmento/porte
*   Comparação com períodos anteriores
*   **Adaptação necessária**: Integrar com atualizações em tempo real

**3. `ai-sales-diagnosis.ts` - ⚠️ Uso Complementar**
*   Focado em respostas qualitativas
*   **Uso**: Análise de contexto adicional e insights qualitativos

#### **Novo Fluxo: `live-copilot.ts`**

Um fluxo híbrido que combina conversação adaptativa, análise estruturada e capacidade de atualizar métricas em tempo real.

```typescript
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { useCredits } from '../tools/credits';

const LiveCopilotInputSchema = z.object({
  userId: z.string(),
  projectState: z.any(), // LiveProjectState completo
  message: z.string(),
  intent: z.enum(['question', 'metric_update', 'validation', 'simulation', 'explain']).optional(),
  conversationHistory: z.array(z.any()) // ChatMessage[]
});

const LiveCopilotOutputSchema = z.object({
  response: z.string().describe('Resposta conversacional do copiloto'),
  actions: z.array(z.object({
    type: z.enum(['update_metric', 'add_insight', 'create_validation', 'trigger_analysis']),
    stage: z.string().optional(),
    metric: z.string().optional(),
    value: z.number().optional(),
    data: z.any().optional()
  })).describe('Ações para o sistema executar automaticamente'),
  nextQuestions: z.array(z.string()).optional().describe('Próximas perguntas sugeridas'),
  stageRecommendation: z.enum(['discovery', 'topo', 'meio', 'fundo', 'pos', 'synthesis']).optional()
});

const liveCopilotPrompt = ai.definePrompt({
  name: 'liveCopilotPrompt',
  input: { schema: LiveCopilotInputSchema },
  output: { schema: LiveCopilotOutputSchema },
  prompt: `
    Você é o Copiloto Comercial V4SalesAI especializado em diagnósticos live de funil.
    
    CONTEXTO ATUAL:
    - Empresa: {{{projectState.company.name}}} ({{{projectState.company.segment}}})
    - Etapa: {{{projectState.conversation.currentStage}}}
    - Desafio principal: {{{projectState.company.mainChallenge}}}
    - Progresso: {{{projectState.conversation.completionPercentage}}}%
    
    MÉTRICAS ATUAIS:
    {{{json projectState.metrics}}}
    
    COMPORTAMENTOS OBRIGATÓRIOS:
    1. CONVERSAÇÃO ADAPTATIVA: Baseie suas perguntas no desafio principal e etapa atual
    2. VALIDAÇÃO INTELIGENTE: Questione valores inconsistentes e ofereça benchmarks do setor
    3. EDUCAÇÃO CONTEXTUAL: Explique termos técnicos de forma simples, sempre conectando com o negócio
    4. AÇÕES AUTOMÁTICAS: Quando o usuário fornecer métricas, gere ações para atualizar o sistema
    5. FLUXO ADAPTATIVO: Priorize etapas baseadas no desafio principal identificado
    
    DETECÇÃO DE INTENTS:
    - "simular:" ou "e se" → Gere ação de simulação
    - "explicar:" ou "o que é" → Foque em educação
    - "como estou" → Analise etapa específica
    - Números detectados → Gere ação de update_metric
    - Inconsistências → Gere ação de create_validation
    
    VALIDAÇÃO AUTOMÁTICA:
    - Se valor > 2x benchmark: questione e sugira correção
    - Se valor < 0.5x benchmark: confirme e explique impacto
    - Se lógica inconsistente (ex: SQL > MQL): corrija automaticamente
    
    RESPOSTA ESTRUTURADA:
    - response: Sua resposta conversacional (máx 200 palavras, tom consultivo)
    - actions: Ações técnicas para o sistema executar
    - nextQuestions: 1-3 próximas perguntas contextuais (opcional)
    - stageRecommendation: Próxima etapa se aplicável
  `
});

export const liveCopilotFlow = ai.defineFlow({
  name: 'liveCopilotFlow',
  inputSchema: LiveCopilotInputSchema,
  outputSchema: LiveCopilotOutputSchema
}, async (input) => {
  await useCredits({ userId: input.userId, amount: 1 });
  
  const { output } = await liveCopilotPrompt(input);
  return output!;
});

export type LiveCopilotInput = z.infer<typeof LiveCopilotInputSchema>;
export type LiveCopilotOutput = z.infer<typeof LiveCopilotOutputSchema>;
```

#### **Novo Fluxo: `live-validator.ts`**

Sistema de validação inteligente para métricas em tempo real.

```typescript
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { VALIDATION_THRESHOLDS } from '@/lib/types-live';

const LiveValidatorInputSchema = z.object({
  metric: z.string(),
  value: z.number(),
  stage: z.enum(['topo', 'meio', 'fundo', 'pos']),
  companyContext: z.object({
    segment: z.string(),
    size: z.enum(['startup', 'pequena', 'media', 'grande']),
    businessModel: z.string()
  }),
  currentMetrics: z.any() // Métricas atuais para validação cruzada
});

const LiveValidatorOutputSchema = z.object({
  isValid: z.boolean(),
  confidence: z.number().describe('Confiança na validação (0-100)'),
  flags: z.array(z.object({
    type: z.enum(['inconsistency', 'outlier', 'missing', 'suspicious']),
    severity: z.enum(['low', 'medium', 'high']),
    message: z.string(),
    suggestedValue: z.number().optional(),
    autoFixAvailable: z.boolean()
  })),
  benchmarkComparison: z.object({
    marketAverage: z.number(),
    status: z.enum(['green', 'amber', 'red']),
    percentile: z.number().describe('Posição percentual vs mercado')
  })
});

const liveValidatorPrompt = ai.definePrompt({
  name: 'liveValidatorPrompt',
  input: { schema: LiveValidatorInputSchema },
  output: { schema: LiveValidatorOutputSchema },
  prompt: `
    Você é um validador especialista em métricas de funil de vendas.
    
    CONTEXTO:
    - Métrica: {{{metric}}} = {{{value}}}
    - Etapa: {{{stage}}}
    - Empresa: {{{companyContext.segment}}} ({{{companyContext.size}}})
    - Modelo: {{{companyContext.businessModel}}}
    
    MÉTRICAS ATUAIS:
    {{{json currentMetrics}}}
    
    VALIDAÇÕES OBRIGATÓRIAS:
    1. BENCHMARK SETORIAL: Compare com médias do setor específico
    2. CONSISTÊNCIA LÓGICA: Verifique se faz sentido vs outras métricas
    3. OUTLIERS: Identifique valores extremos (>2x ou <0.5x benchmark)
    4. DEPENDÊNCIAS: Valide relações entre métricas (ex: MQL ≤ Leads)
    
    BENCHMARKS POR CONTEXTO:
    - B2B SaaS: Conversões mais altas, ciclos longos
    - B2C E-commerce: Volume alto, conversões menores
    - Serviços: Ticket alto, processo consultivo
    - Startup vs Empresa: Diferentes padrões de maturidade
    
    RETORNE:
    - isValid: true se dentro de parâmetros aceitáveis
    - confidence: quão certo você está (baseado em dados disponíveis)
    - flags: problemas identificados com severidade
    - benchmarkComparison: posição vs mercado
  `
});

export const liveValidatorFlow = ai.defineFlow({
  name: 'liveValidatorFlow',
  inputSchema: LiveValidatorInputSchema,
  outputSchema: LiveValidatorOutputSchema
}, async (input) => {
  const { output } = await liveValidatorPrompt(input);
  return output!;
});
```

#### **Integração com LiveProjectContext.tsx:**

```typescript
// Importações dos novos fluxos
import { liveCopilotFlow, type LiveCopilotInput } from '@/ai/flows/live-copilot';
import { liveValidatorFlow } from '@/ai/flows/live-validator';
import { funnelDiagnosis } from '@/ai/flows/funnel-diagnosis';

// Modificação da função sendMessage
const sendMessage = useCallback(async (content: string, intent?: ChatIntent) => {
  if (!projectState) return;

  try {
    // Adicionar mensagem do usuário
    const userMessage = generateMockMessage('user', content);
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Chamar IA real
    const aiResponse = await liveCopilotFlow({
      userId: projectState.userId,
      projectState,
      message: content,
      intent: intent?.type,
      conversationHistory: messages
    });

    // Processar ações retornadas pela IA
    for (const action of aiResponse.actions) {
      switch (action.type) {
        case 'update_metric':
          if (action.stage && action.metric && action.value !== undefined) {
            await updateMetricWithValidation(action.stage, action.metric, action.value);
          }
          break;
        case 'add_insight':
          await addInsight(action.data);
          break;
        case 'create_validation':
          await createValidationFlag(action.data);
          break;
        case 'trigger_analysis':
          await runFullAnalysis();
          break;
      }
    }

    // Adicionar resposta da IA
    const aiMessage = generateMockMessage('assistant', aiResponse.response);
    aiMessage.metadata = {
      intent: intent?.type,
      actions: aiResponse.actions.length,
      nextQuestions: aiResponse.nextQuestions
    };
    setMessages(prev => [...prev, aiMessage]);

    // Recomendar próxima etapa se aplicável
    if (aiResponse.stageRecommendation) {
      goToStage(aiResponse.stageRecommendation);
    }

  } catch (err) {
    setError(err instanceof Error ? err.message : 'Erro ao enviar mensagem');
  } finally {
    setIsTyping(false);
  }
}, [projectState, messages]);

// Nova função com validação automática
const updateMetricWithValidation = useCallback(async (stage: string, metric: string, value: number) => {
  if (!projectState) return;

  try {
    // Validar métrica com IA
    const validation = await liveValidatorFlow({
      metric,
      value,
      stage: stage as any,
      companyContext: {
        segment: projectState.company.segment,
        size: projectState.company.size,
        businessModel: projectState.company.businessModel
      },
      currentMetrics: projectState.metrics
    });

    // Se inválida, criar flags
    if (!validation.isValid) {
      const flags = validation.flags.map(flag => ({
        id: `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: flag.type,
        stage: stage as any,
        metric,
        value,
        expectedRange: [0, 100], // Calcular baseado no benchmark
        suggestion: flag.message,
        severity: flag.severity,
        autoFixAvailable: flag.autoFixAvailable
      }));

      setProjectState(prev => prev ? {
        ...prev,
        validations: {
          ...prev.validations,
          flags: [...prev.validations.flags, ...flags]
        }
      } : null);
    }

    // Atualizar métrica
    await updateMetric(stage, metric, value);

    // Trigger análise se mudança significativa
    if (validation.confidence > 80) {
      await runIncrementalAnalysis(stage);
    }

  } catch (err) {
    setError(err instanceof Error ? err.message : 'Erro ao validar métrica');
  }
}, [projectState]);
```

---

### **11. ESTRATÉGIA DE PERSISTÊNCIA - FIRESTORE**

A persistência de dados é fundamental para garantir que o estado do projeto seja mantido entre sessões e que múltiplos usuários possam colaborar em tempo real.

#### **Estrutura de Dados no Firestore:**

```
projects/{projectId}/
├── liveState (document)           # Estado atual do projeto
├── sessions/{sessionId}/ (collection)
│   ├── messages/{messageId}       # Cada mensagem do chat
│   ├── snapshots/{timestamp}      # Snapshots do estado para histórico
│   └── validations/{validationId} # Flags de validação
├── timeline/{eventId}             # Timeline de eventos
└── analytics/{date}               # Métricas de uso (opcional)
```

#### **Documento Principal: `liveState`**

```typescript
interface FirestoreLiveState {
  // Metadados
  projectId: string;
  userId: string;
  currentSessionId: string;
  
  // Dados da empresa (persistem entre sessões)
  company: {
    name: string;
    segment: string;
    businessModel: string;
    size: 'startup' | 'pequena' | 'media' | 'grande';
    mainChallenge?: string;
    ticketMedio?: number;
    cicloVendas?: number;
  };
  
  // Estado da conversa atual
  conversation: {
    currentStage: 'discovery' | 'topo' | 'meio' | 'fundo' | 'pos' | 'synthesis';
    adaptiveFlow: boolean;
    completionPercentage: number;
    lastInteraction: Timestamp;
    isActive: boolean;
  };
  
  // Métricas (versionadas)
  metrics: {
    version: number; // Incrementa a cada mudança
    lastUpdated: Timestamp;
    topo: TopoMetrics;
    meio: MeioMetrics;
    fundo: FundoMetrics;
    pos: PosMetrics;
    confidence: ConfidenceScores;
  };
  
  // Análise atual
  analysis: {
    lastAnalysis: Timestamp;
    scores: StageScores;
    benchmarks: BenchmarkComparison;
    priorities: Priority[];
    insights: Insight[];
    simulations: Simulation[];
  };
  
  // Validações ativas
  validations: {
    flags: ValidationFlag[];
    suggestions: ValidationSuggestion[];
    autoCorrections: AutoCorrection[];
  };
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### **Sistema de Salvamento:**

**1. Salvamento Automático (Debounced - 2s)**

```typescript
// No LiveProjectContext.tsx
const [pendingUpdates, setPendingUpdates] = useState<Partial<LiveProjectState>>({});
const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

const debouncedSave = useCallback((updates: Partial<LiveProjectState>) => {
  // Acumular mudanças
  setPendingUpdates(prev => ({ ...prev, ...updates }));
  
  // Cancelar save anterior
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  
  // Agendar novo save em 2 segundos
  const newTimeout = setTimeout(async () => {
    try {
      await saveToFirestore(projectId, pendingUpdates);
      setPendingUpdates({});
      console.log('✅ Estado salvo automaticamente');
    } catch (error) {
      console.error('❌ Erro ao salvar:', error);
      // Manter pendingUpdates para retry
    }
  }, 2000);
  
  setSaveTimeout(newTimeout);
}, [projectId, saveTimeout, pendingUpdates]);
```

**2. Salvamento Imediato (Ações Críticas)**

```typescript
const saveImmediately = useCallback(async (updates: Partial<LiveProjectState>) => {
  try {
    // Cancelar debounced save
    if (saveTimeout) {
      clearTimeout(saveTimeout);
      setSaveTimeout(null);
    }
    
    // Salvar imediatamente
    await saveToFirestore(projectId, { ...pendingUpdates, ...updates });
    setPendingUpdates({});
    
    console.log('✅ Estado salvo imediatamente');
  } catch (error) {
    console.error('❌ Erro crítico ao salvar:', error);
    throw error;
  }
}, [projectId, saveTimeout, pendingUpdates]);
```

**3. Sistema de Mensagens (Real-time)**

```typescript
const saveMessage = useCallback(async (message: ChatMessage) => {
  try {
    const messageRef = doc(
      db, 
      `projects/${projectId}/sessions/${sessionId}/messages/${message.id}`
    );
    
    await setDoc(messageRef, {
      ...message,
      timestamp: serverTimestamp()
    });
    
    console.log('💬 Mensagem salva:', message.id);
  } catch (error) {
    console.error('❌ Erro ao salvar mensagem:', error);
  }
}, [projectId, sessionId]);
```

#### **Triggers de Salvamento:**

**🔄 Salvamento Automático (Debounced - 2s):**
*   Mudanças em métricas
*   Atualizações de confidence scores
*   Modificações em insights
*   Alterações em validações

**⚡ Salvamento Imediato:**
*   Nova mensagem no chat
*   Conclusão de etapa
*   Criação de simulação
*   Flags de validação críticas
*   Mudança de stage

**📸 Snapshots (Versionamento):**

```typescript
const createSnapshot = useCallback(async (reason: string) => {
  try {
    const snapshotRef = doc(
      db, 
      `projects/${projectId}/sessions/${sessionId}/snapshots/${Date.now()}`
    );
    
    await setDoc(snapshotRef, {
      state: projectState,
      reason,
      timestamp: serverTimestamp(),
      version: projectState?.metrics.version || 1
    });
    
    console.log('📸 Snapshot criado:', reason);
  } catch (error) {
    console.error('❌ Erro ao criar snapshot:', error);
  }
}, [projectId, sessionId, projectState]);
```

#### **Recuperação de Dados:**

```typescript
const initializeProject = useCallback(async (projectId: string) => {
  try {
    setIsLoading(true);
    
    // 1. Carregar estado principal
    const liveStateRef = doc(db, `projects/${projectId}/liveState`);
    const liveStateSnap = await getDoc(liveStateRef);
    
    if (liveStateSnap.exists()) {
      const state = liveStateSnap.data() as LiveProjectState;
      setProjectState(state);
      
      // 2. Carregar mensagens da sessão atual
      const messagesRef = collection(
        db, 
        `projects/${projectId}/sessions/${state.currentSessionId}/messages`
      );
      const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));
      const messagesSnap = await getDocs(messagesQuery);
      
      const messages = messagesSnap.docs.map(doc => doc.data() as ChatMessage);
      setMessages(messages);
      
    } else {
      // Projeto novo - criar estado inicial
      await createNewProject(projectId);
    }
    
  } catch (error) {
    setError('Erro ao carregar projeto');
  } finally {
    setIsLoading(false);
  }
}, []);
```

#### **Sincronização Real-Time:**

```typescript
useEffect(() => {
  if (!projectId) return;
  
  const liveStateRef = doc(db, `projects/${projectId}/liveState`);
  
  const unsubscribe = onSnapshot(liveStateRef, (doc) => {
    if (doc.exists()) {
      const newState = doc.data() as LiveProjectState;
      
      // Só atualizar se não for uma mudança local
      if (newState.updatedAt > (projectState?.updatedAt || new Date(0))) {
        setProjectState(newState);
        console.log('🔄 Estado sincronizado do servidor');
      }
    }
  });
  
  return () => unsubscribe();
}, [projectId, projectState?.updatedAt]);
```

---

### **12. CRONOGRAMA DE IMPLEMENTAÇÃO ATUALIZADO**

#### **Fase 2 - Integração com IA Real (2-3 semanas)**

**Semana 1: Fundação IA**
*   **Dia 1-2**: Criar `live-copilot.ts` com prompt adaptativo completo
*   **Dia 3**: Criar `live-validator.ts` para validação inteligente
*   **Dia 4-5**: Integrar fluxos com `LiveProjectContext.tsx`

**Semana 2: Persistência e Validação**
*   **Dia 1-2**: Implementar sistema de persistência Firestore
*   **Dia 3**: Sistema de salvamento automático e imediato
*   **Dia 4**: Sincronização real-time e snapshots
*   **Dia 5**: Testes de integração e tratamento de erros

**Semana 3: Análise Avançada**
*   **Dia 1-2**: Modificar `funnel-diagnosis.ts` para modo live
*   **Dia 3**: Benchmarks contextuais dinâmicos
*   **Dia 4**: Sistema de insights automáticos
*   **Dia 5**: Testes finais e otimizações

#### **Marcos de Validação:**

**✅ Marco 1 (Fim Semana 1)**: Conversação real com IA funcionando
**✅ Marco 2 (Fim Semana 2)**: Persistência completa e sincronização
**✅ Marco 3 (Fim Semana 3)**: Sistema completo com análise automática

#### **Dependências Críticas:**

1.  **Genkit Flows** → LiveProjectContext
2.  **Firestore Setup** → Persistência
3.  **Validação IA** → Sistema de Flags
4.  **Real-time Sync** → Colaboração

---

### **13. ARQUITETURA TÉCNICA AVANÇADA**

#### **Fluxo de Dados Completo:**

```
User Input → LiveProjectContext → Genkit AI → Actions → Firestore → Real-time Sync → UI Update
     ↑                                                                                    ↓
     ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
```

#### **Padrões de Comunicação:**

**1. Request/Response (Síncrono)**
*   Validação de métricas
*   Geração de insights
*   Simulações

**2. Event-Driven (Assíncrono)**
*   Salvamento automático
*   Sincronização real-time
*   Notificações

**3. Pub/Sub (Real-time)**
*   Atualizações de estado
*   Colaboração multi-usuário
*   Timeline de eventos

#### **Sistema de Cache e Performance:**

```typescript
// Cache inteligente para reduzir chamadas IA
const aiCache = new Map<string, { result: any; timestamp: number }>();

const getCachedOrFetch = async (key: string, fetcher: () => Promise<any>, ttl = 300000) => {
  const cached = aiCache.get(key);
  
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.result;
  }
  
  const result = await fetcher();
  aiCache.set(key, { result, timestamp: Date.now() });
  
  return result;
};
```

#### **Tratamento de Erros e Fallbacks:**

```typescript
const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
  
  throw new Error('Max retries exceeded');
};
```

#### **Resumo da Estratégia Técnica:**

✅ **IA Contextual**: Prompts adaptativos baseados no estado atual
✅ **Validação Automática**: Sistema inteligente de flags e correções
✅ **Persistência Robusta**: Debounced + immediate saves + snapshots
✅ **Real-time Sync**: Colaboração e atualizações instantâneas
✅ **Performance**: Cache inteligente e otimizações
✅ **Reliability**: Retry automático e tratamento de erros
✅ **Scalability**: Arquitetura event-driven e modular

Este plano técnico detalhado garante uma implementação robusta, escalável e com excelente experiência do usuário, transformando o V4SalesAI Live em uma ferramenta revolucionária de gestão comercial.
