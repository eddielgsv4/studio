"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { 
  DashboardContextType, 
  DashboardProject, 
  ChatMessage, 
  NotificationAlert,
  TeamOffer 
} from '@/lib/types-dashboard';
import { 
  mockDashboardProject, 
  mockChatMessages, 
  mockNotifications,
  updateMissionStatus,
  updateChecklistItem,
  getMissionById
} from '@/lib/mock-data-dashboard';

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}

interface DashboardProviderProps {
  children: React.ReactNode;
  projectId: string;
}

export function DashboardProvider({ children, projectId }: DashboardProviderProps) {
  const [project, setProject] = useState<DashboardProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedStage, setExpandedStage] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [notifications, setNotifications] = useState<NotificationAlert[]>(mockNotifications);

  // Load project data
  const loadProject = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call
      if (id === mockDashboardProject.id) {
        setProject({ ...mockDashboardProject });
      } else {
        throw new Error('Projeto não encontrado');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar projeto');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Stage expansion logic
  const expandStage = useCallback((stageId: string) => {
    setExpandedStage(current => current === stageId ? null : stageId);
    
    // Update project state to reflect expansion
    setProject(current => {
      if (!current) return current;
      
      return {
        ...current,
        stages: current.stages.map(stage => ({
          ...stage,
          isExpanded: stage.id === stageId ? !stage.isExpanded : false
        }))
      };
    });
  }, []);

  const collapseAllStages = useCallback(() => {
    setExpandedStage(null);
    setProject(current => {
      if (!current) return current;
      
      return {
        ...current,
        stages: current.stages.map(stage => ({
          ...stage,
          isExpanded: false
        }))
      };
    });
  }, []);

  // Mission management
  const startMission = useCallback(async (missionId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      updateMissionStatus(missionId, 'in_progress');
      
      // Update local state
      setProject(current => {
        if (!current) return current;
        
        return {
          ...current,
          stages: current.stages.map(stage => ({
            ...stage,
            missions: stage.missions.map(mission => 
              mission.id === missionId 
                ? { ...mission, status: 'in_progress' as const }
                : mission
            )
          }))
        };
      });

      // Add event notification
      const mission = getMissionById(missionId);
      if (mission) {
        const newNotification: NotificationAlert = {
          id: `notif_${Date.now()}`,
          type: 'mission_available',
          title: 'Missão Iniciada',
          message: `Você iniciou a missão "${mission.title}"`,
          severity: 'info',
          timestamp: new Date(),
          read: false
        };
        setNotifications(current => [newNotification, ...current]);
      }
    } catch (err) {
      setError('Erro ao iniciar missão');
    }
  }, []);

  const completeMission = useCallback(async (missionId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mission = getMissionById(missionId);
      if (!mission) return;

      // Check if all required checklist items are completed
      const requiredItems = mission.checklist.filter(item => item.required);
      const completedRequired = requiredItems.filter(item => item.completed);
      
      if (completedRequired.length < requiredItems.length) {
        setError('Complete todos os itens obrigatórios antes de finalizar a missão');
        return;
      }

      updateMissionStatus(missionId, 'completed');
      
      // Update local state and apply rewards
      setProject(current => {
        if (!current) return current;
        
        const updatedProject = {
          ...current,
          stages: current.stages.map(stage => {
            const updatedStage = {
              ...stage,
              missions: stage.missions.map(m => 
                m.id === missionId 
                  ? { ...m, status: 'completed' as const }
                  : m
              )
            };
            
            // Update completed missions count
            if (stage.missions.some(m => m.id === missionId)) {
              updatedStage.completedMissions = stage.missions.filter(m => 
                m.status === 'completed' || m.id === missionId
              ).length;
              
              // Apply score boost reward
              const scoreBoost = mission.rewards.find(r => r.type === 'score_boost');
              if (scoreBoost) {
                updatedStage.score = Math.min(100, stage.score + (scoreBoost.value as number));
              }
            }
            
            return updatedStage;
          })
        };

        // Recalculate overall score
        const totalScore = updatedProject.stages.reduce((sum, stage) => sum + stage.score, 0);
        updatedProject.overallScore = Math.round(totalScore / updatedProject.stages.length);

        return updatedProject;
      });

      // Add completion notification
      const newNotification: NotificationAlert = {
        id: `notif_${Date.now()}`,
        type: 'milestone_reached',
        title: 'Missão Concluída!',
        message: `Parabéns! Você concluiu "${mission.title}" e ganhou ${mission.rewards.find(r => r.type === 'score_boost')?.value || 0} pontos.`,
        severity: 'success',
        timestamp: new Date(),
        read: false
      };
      setNotifications(current => [newNotification, ...current]);

    } catch (err) {
      setError('Erro ao completar missão');
    }
  }, []);

  const updateChecklist = useCallback(async (missionId: string, checklistId: string, completed: boolean) => {
    try {
      updateChecklistItem(missionId, checklistId, completed);
      
      // Update local state
      setProject(current => {
        if (!current) return current;
        
        return {
          ...current,
          stages: current.stages.map(stage => ({
            ...stage,
            missions: stage.missions.map(mission => 
              mission.id === missionId 
                ? {
                    ...mission,
                    checklist: mission.checklist.map(item =>
                      item.id === checklistId
                        ? { ...item, completed }
                        : item
                    )
                  }
                : mission
            )
          }))
        };
      });
    } catch (err) {
      setError('Erro ao atualizar checklist');
    }
  }, []);

  const executeWithAgent = useCallback(async (missionId: string) => {
    try {
      const mission = getMissionById(missionId);
      if (!mission || !mission.agentCost) return;

      if (!project || project.wallet.credits < mission.agentCost) {
        setError('Créditos insuficientes para executar com agente');
        return;
      }

      // Simulate agent execution
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Deduct credits
      setProject(current => {
        if (!current) return current;
        return {
          ...current,
          wallet: {
            ...current.wallet,
            credits: current.wallet.credits - mission.agentCost!,
            usedThisMonth: current.wallet.usedThisMonth + mission.agentCost!
          }
        };
      });

      // Complete all checklist items
      mission.checklist.forEach(item => {
        updateChecklistItem(missionId, item.id, true);
      });

      // Complete mission
      await completeMission(missionId);

      // Add agent execution notification
      const newNotification: NotificationAlert = {
        id: `notif_${Date.now()}`,
        type: 'mission_available',
        title: 'Agente Executou Missão',
        message: `O agente executou "${mission.title}" com sucesso! Custou ${mission.agentCost} créditos.`,
        severity: 'success',
        timestamp: new Date(),
        read: false
      };
      setNotifications(current => [newNotification, ...current]);

    } catch (err) {
      setError('Erro ao executar com agente');
    }
  }, [project, completeMission]);

  // Chat functionality
  const sendChatMessage = useCallback(async (message: string, stageContext?: string) => {
    try {
      const userMessage: ChatMessage = {
        id: `msg_${Date.now()}_user`,
        type: 'user',
        content: message,
        timestamp: new Date(),
        stageContext
      };

      setChatMessages(current => [...current, userMessage]);

      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1000));

      const aiResponse: ChatMessage = {
        id: `msg_${Date.now()}_ai`,
        type: 'assistant',
        content: `Entendi sua pergunta sobre "${message}". ${stageContext ? `No contexto de ${stageContext}, ` : ''}posso ajudar você a identificar as melhores ações para melhorar seus resultados. Que tal começar pelas missões disponíveis?`,
        timestamp: new Date(),
        stageContext
      };

      setChatMessages(current => [...current, aiResponse]);
    } catch (err) {
      setError('Erro ao enviar mensagem');
    }
  }, []);

  // Ask for details functionality (costs 5 credits)
  const askForDetails = useCallback(async (type: 'benchmark' | 'mission', itemId: string, context: string) => {
    try {
      const creditCost = 5;
      
      if (!project || project.wallet.credits < creditCost) {
        setError('Créditos insuficientes. Você precisa de 5 créditos para pedir detalhes.');
        return;
      }

      // Deduct credits
      setProject(current => {
        if (!current) return current;
        return {
          ...current,
          wallet: {
            ...current.wallet,
            credits: current.wallet.credits - creditCost,
            usedThisMonth: current.wallet.usedThisMonth + creditCost
          }
        };
      });

      // Add user message to chat
      const userMessage: ChatMessage = {
        id: `msg_${Date.now()}_user`,
        type: 'user',
        content: `Preciso de mais detalhes sobre: ${context}`,
        timestamp: new Date(),
        stageContext: expandedStage || undefined
      };

      setChatMessages(current => [...current, userMessage]);

      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));

      let aiResponse = '';
      if (type === 'benchmark') {
        aiResponse = `📊 **Análise Detalhada do Benchmark: ${context}**

Com base nos dados do seu funil e comparação com o mercado, aqui está uma análise aprofundada:

**Situação Atual:**
• Sua performance está ${Math.random() > 0.5 ? 'acima' : 'abaixo'} da média do setor
• Principais fatores que influenciam esta métrica no seu negócio
• Oportunidades de melhoria identificadas

**Recomendações Específicas:**
1. **Ação Imediata:** Foque em otimizar [processo específico]
2. **Médio Prazo:** Implemente [estratégia específica]
3. **Longo Prazo:** Desenvolva [capacidade específica]

**Próximos Passos:**
• Verifique as missões relacionadas disponíveis
• Monitore esta métrica semanalmente
• Compare com benchmarks do seu segmento

💡 *Esta análise custou 5 créditos e foi personalizada para seu negócio.*`;
      } else {
        aiResponse = `🎯 **Análise Detalhada da Missão: ${context}**

Baseado no contexto do seu funil, aqui está um plano detalhado para esta missão:

**Por que é importante:**
• Impacto direto nos seus resultados
• Conexão com outras etapas do funil
• Potencial de melhoria identificado

**Estratégia Recomendada:**
1. **Preparação:** [passos específicos]
2. **Execução:** [metodologia detalhada]
3. **Validação:** [métricas para acompanhar]

**Recursos Necessários:**
• Tempo estimado: [tempo específico]
• Ferramentas recomendadas
• Possíveis obstáculos e como superá-los

**Resultados Esperados:**
• Melhoria estimada na métrica principal
• Impacto em outras etapas do funil
• ROI esperado da implementação

💡 *Esta análise custou 5 créditos e inclui um plano de ação personalizado.*`;
      }

      const aiMessage: ChatMessage = {
        id: `msg_${Date.now()}_ai`,
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        stageContext: expandedStage || undefined
      };

      setChatMessages(current => [...current, aiMessage]);

      // Add notification about credit usage
      const newNotification: NotificationAlert = {
        id: `notif_${Date.now()}`,
        type: 'low_credits',
        title: 'Análise Detalhada Gerada',
        message: `Análise detalhada sobre "${context}" foi gerada. Custou 5 créditos.`,
        severity: 'info',
        timestamp: new Date(),
        read: false
      };
      setNotifications(current => [newNotification, ...current]);

    } catch (err) {
      setError('Erro ao gerar análise detalhada');
    }
  }, [project, expandedStage]);

  // Notification management
  const markNotificationRead = useCallback((notificationId: string) => {
    setNotifications(current => 
      current.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
  }, []);

  // Team contact
  const contactTeam = useCallback((offer: TeamOffer) => {
    const whatsappUrl = `https://wa.me/${offer.whatsappNumber}?text=${encodeURIComponent(
      `Olá! Tenho interesse na oferta: ${offer.title} - ${offer.description}`
    )}`;
    window.open(whatsappUrl, '_blank');

    // Add contact notification
    const newNotification: NotificationAlert = {
      id: `notif_${Date.now()}`,
      type: 'mission_available',
      title: 'Contato Realizado',
      message: `Você entrou em contato sobre "${offer.title}". Nossa equipe responderá em breve!`,
      severity: 'info',
      timestamp: new Date(),
      read: false
    };
    setNotifications(current => [newNotification, ...current]);
  }, []);

  // Load project on mount
  useEffect(() => {
    loadProject(projectId);
  }, [projectId, loadProject]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const value: DashboardContextType = {
    project,
    isLoading,
    error,
    expandedStage,
    chatMessages,
    notifications,
    loadProject,
    expandStage,
    collapseAllStages,
    startMission,
    completeMission,
    updateChecklist,
    executeWithAgent,
    sendChatMessage,
    askForDetails,
    markNotificationRead,
    contactTeam
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}
