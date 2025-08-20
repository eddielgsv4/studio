"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { 
  LiveProjectContextType, 
  LiveProjectState, 
  ChatMessage, 
  ChatIntent,
  ValidationFlag,
  Simulation 
} from '@/lib/types-live';
import { 
  mockLiveProjectState, 
  mockChatMessages, 
  generateMockMessage,
  generateMockTimelineEvent,
  updateMockMetric,
  simulateTypingDelay,
  simulateAIProcessing
} from '@/lib/mock-data-live';

// ============================================================================
// CONTEXTO DO PROJETO LIVE
// ============================================================================

const LiveProjectContext = createContext<LiveProjectContextType | undefined>(undefined);

interface LiveProjectProviderProps {
  children: React.ReactNode;
  projectId: string;
}

export const LiveProjectProvider = ({ children, projectId }: LiveProjectProviderProps) => {
  // Estados principais
  const [projectState, setProjectState] = useState<LiveProjectState | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // ============================================================================
  // INICIALIZAÇÃO COM MOCK DATA
  // ============================================================================

  useEffect(() => {
    const initializeProject = async () => {
      try {
        setIsLoading(true);
        
        // Simular carregamento
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Carregar dados mock
        setProjectState(mockLiveProjectState);
        setMessages(mockChatMessages);
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar projeto');
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      initializeProject();
    }
  }, [projectId]);

  // ============================================================================
  // FUNÇÕES DE CHAT
  // ============================================================================

  const sendMessage = useCallback(async (content: string, intent?: ChatIntent) => {
    if (!projectState) return;

    try {
      // Adicionar mensagem do usuário
      const userMessage = generateMockMessage('user', content);
      setMessages(prev => [...prev, userMessage]);

      // Mostrar typing indicator
      setIsTyping(true);

      // Simular processamento de IA
      await simulateAIProcessing();

      // Gerar resposta baseada no intent ou conteúdo
      let aiResponse = '';
      let responseType: ChatMessage['type'] = 'text';
      let metadata: ChatMessage['metadata'] = {};

      if (intent?.type === 'simulate') {
        aiResponse = 'Executando simulação... Os resultados aparecerão no painel ao lado.';
        responseType = 'simulation';
        metadata = { intent: 'simulate' };
      } else if (intent?.type === 'explain') {
        aiResponse = generateExplanationResponse(content);
        responseType = 'text';
        metadata = { intent: 'explain' };
      } else if (content.toLowerCase().includes('show rate') || content.toLowerCase().includes('comparecimento')) {
        // Detectar resposta sobre show rate
        const showRateMatch = content.match(/(\d+)%?/);
        if (showRateMatch) {
          const value = parseInt(showRateMatch[1]);
          await updateMetric('meio', 'showRate', value);
          aiResponse = `Show rate de ${value}% registrado! ${value < 60 ? '⚠️ Está abaixo da média do mercado (70%). Isso pode estar relacionado ao tempo de resposta.' : '✅ Está dentro da média do mercado.'}`;
          responseType = 'metric_update';
          metadata = { stage: 'meio', metric: 'showRate', value };
        }
      } else if (content.toLowerCase().includes('tempo') && content.toLowerCase().includes('resposta')) {
        // Detectar resposta sobre tempo de resposta
        const timeMatch = content.match(/(\d+)\s*(hora|horas|minuto|minutos|h|min)/i);
        if (timeMatch) {
          const value = parseInt(timeMatch[1]);
          const unit = timeMatch[2].toLowerCase();
          const minutes = unit.includes('hora') || unit.includes('h') ? value * 60 : value;
          
          await updateMetric('meio', 'tempoPrimeiraResposta', minutes);
          aiResponse = `Tempo de ${minutes} minutos registrado! ${minutes > 60 ? '⚠️ Muito alto! O mercado SaaS responde em 30 minutos em média.' : '✅ Tempo adequado.'}`;
          responseType = 'metric_update';
          metadata = { stage: 'meio', metric: 'tempoPrimeiraResposta', value: minutes };
        }
      } else {
        // Resposta padrão baseada no estágio atual
        aiResponse = generateContextualResponse(content, projectState.conversation.currentStage);
      }

      // Simular tempo de digitação
      await simulateTypingDelay(aiResponse);

      // Adicionar resposta da IA
      const aiMessage = generateMockMessage('assistant', aiResponse);
      aiMessage.type = responseType;
      aiMessage.metadata = metadata;

      setMessages(prev => [...prev, aiMessage]);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar mensagem');
    } finally {
      setIsTyping(false);
    }
  }, [projectState]);

  // ============================================================================
  // FUNÇÕES DE MÉTRICAS
  // ============================================================================

  const updateMetric = useCallback(async (stage: string, metric: string, value: number) => {
    if (!projectState) return;

    try {
      // Atualizar estado com nova métrica
      const newState = updateMockMetric(projectState, stage, metric, value);
      setProjectState(newState);

      // Simular validação
      await validateData();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar métrica');
    }
  }, [projectState]);

  // ============================================================================
  // FUNÇÕES DE SIMULAÇÃO
  // ============================================================================

  const runSimulation = useCallback(async (changes: Record<string, number>): Promise<Simulation> => {
    if (!projectState) throw new Error('Projeto não carregado');

    try {
      // Simular processamento
      await simulateAIProcessing();

      // Criar simulação mock
      const simulation: Simulation = {
        id: `sim_${Date.now()}`,
        name: 'Simulação personalizada',
        description: `Alterações: ${Object.keys(changes).join(', ')}`,
        changes,
        projectedImpact: {
          revenue: Math.random() * 50 + 10, // 10-60%
          conversion: Math.random() * 30 + 5, // 5-35%
          timeline: '2-4 semanas',
          confidence: Math.random() * 30 + 70 // 70-100%
        },
        stage: 'meio', // Determinar baseado nas mudanças
        createdAt: new Date()
      };

      // Adicionar à lista de simulações
      setProjectState(prev => prev ? {
        ...prev,
        analysis: {
          ...prev.analysis,
          simulations: [...prev.analysis.simulations, simulation]
        }
      } : null);

      return simulation;

    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao executar simulação');
    }
  }, [projectState]);

  // ============================================================================
  // FUNÇÕES DE VALIDAÇÃO
  // ============================================================================

  const validateData = useCallback(async (): Promise<ValidationFlag[]> => {
    if (!projectState) return [];

    try {
      // Simular validação
      await new Promise(resolve => setTimeout(resolve, 500));

      // Retornar flags existentes (mock)
      return projectState.validations.flags;

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao validar dados');
      return [];
    }
  }, [projectState]);

  // ============================================================================
  // FUNÇÕES DE NAVEGAÇÃO
  // ============================================================================

  const goToStage = useCallback((stage: string) => {
    if (!projectState) return;

    setProjectState(prev => prev ? {
      ...prev,
      conversation: {
        ...prev.conversation,
        currentStage: stage as any
      }
    } : null);
  }, [projectState]);

  const completeStage = useCallback((stage: string) => {
    if (!projectState) return;

    // Adicionar evento de conclusão
    const event = generateMockTimelineEvent(
      'stage_complete',
      'Etapa concluída',
      `${stage} mapeado com sucesso`,
      stage
    );

    setProjectState(prev => prev ? {
      ...prev,
      timeline: [event, ...prev.timeline],
      conversation: {
        ...prev.conversation,
        completionPercentage: Math.min(prev.conversation.completionPercentage + 20, 100)
      }
    } : null);
  }, [projectState]);

  // ============================================================================
  // FUNÇÕES UTILITÁRIAS
  // ============================================================================

  const getConfidence = useCallback((stage?: string): number => {
    if (!projectState) return 0;
    
    if (stage && stage in projectState.metrics.confidence) {
      return (projectState.metrics.confidence as any)[stage];
    }
    
    return projectState.metrics.confidence.overall;
  }, [projectState]);

  const getBenchmark = useCallback((stage: string, metric: string): number => {
    if (!projectState) return 0;
    
    const stageBenchmarks = (projectState.analysis.benchmarks.benchmarks as any)[stage];
    return stageBenchmarks?.[metric]?.value || 0;
  }, [projectState]);

  const getInsights = useCallback((stage?: string) => {
    if (!projectState) return [];
    
    if (stage) {
      return projectState.analysis.insights.filter(insight => 
        insight.stage === stage || insight.stage === 'geral'
      );
    }
    
    return projectState.analysis.insights;
  }, [projectState]);

  // ============================================================================
  // FUNÇÕES AUXILIARES PARA RESPOSTAS
  // ============================================================================

  const generateContextualResponse = (content: string, stage: string): string => {
    const responses = {
      discovery: [
        'Entendi! Vamos focar nessa área então. Me conte mais detalhes...',
        'Perfeito! Isso me ajuda a personalizar o diagnóstico. Próxima pergunta...'
      ],
      topo: [
        'Ótimo! Vou atualizar os dados do topo de funil. Agora me conte sobre...',
        'Registrado! Esses dados do topo estão interessantes. Vamos para o meio de funil...'
      ],
      meio: [
        'Entendi! Isso explica alguns padrões que estou vendo. Me conte sobre...',
        'Perfeito! Vou analisar isso junto com os outros dados. Próxima pergunta...'
      ],
      fundo: [
        'Excelente! Esses dados de conversão são importantes. Agora sobre...',
        'Registrado! O fundo de funil está tomando forma. Me conte sobre...'
      ],
      pos: [
        'Ótimo! Dados de retenção são cruciais. Vou processar tudo isso...',
        'Perfeito! Com esses dados posso gerar insights valiosos...'
      ]
    };

    const stageResponses = responses[stage as keyof typeof responses] || responses.discovery;
    return stageResponses[Math.floor(Math.random() * stageResponses.length)];
  };

  const generateExplanationResponse = (content: string): string => {
    if (content.toLowerCase().includes('show rate')) {
      return 'Show Rate é a taxa de comparecimento em reuniões agendadas. É calculado como: (Reuniões realizadas ÷ Reuniões agendadas) × 100. Uma taxa baixa pode indicar problemas na qualificação ou no processo de agendamento.';
    }
    
    if (content.toLowerCase().includes('mql')) {
      return 'MQL (Marketing Qualified Lead) é um lead que foi qualificado pelo marketing como tendo potencial para se tornar cliente. Geralmente passa por critérios como fit de perfil, interesse demonstrado e comportamento no site.';
    }
    
    return 'Posso explicar qualquer métrica ou conceito do funil de vendas. Basta me perguntar!';
  };

  // ============================================================================
  // PROVIDER VALUE
  // ============================================================================

  const value: LiveProjectContextType = {
    // Estado
    projectState,
    isLoading,
    error,
    
    // Chat
    messages,
    isTyping,
    
    // Ações
    sendMessage,
    updateMetric,
    runSimulation,
    validateData,
    
    // Navegação
    goToStage,
    completeStage,
    
    // Utilidades
    getConfidence,
    getBenchmark,
    getInsights
  };

  return (
    <LiveProjectContext.Provider value={value}>
      {children}
    </LiveProjectContext.Provider>
  );
};

// ============================================================================
// HOOK PERSONALIZADO
// ============================================================================

export const useLiveProject = (): LiveProjectContextType => {
  const context = useContext(LiveProjectContext);
  if (context === undefined) {
    throw new Error('useLiveProject deve ser usado dentro de um LiveProjectProvider');
  }
  return context;
};
