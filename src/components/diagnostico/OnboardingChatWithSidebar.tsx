"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Bot, 
  User, 
  Send, 
  CheckCircle,
  Target,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Building,
  Zap,
  Eye,
  MousePointer,
  Filter,
  ShoppingCart,
  RefreshCw,
  Play
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  stage?: string;
  confirmation?: string;
}

interface CollectedData {
  nome?: string;
  segmento?: string;
  ticketMedio?: string;
  cicloVendas?: string;
  visitantes?: string;
  conversaoTopo?: string;
  qualificacao?: string;
  gargaloMeio?: string;
  taxaFechamento?: string;
  motivoPerdas?: string;
  retencao?: string;
  // Topo de Funil
  topoVisitanteLead?: string;
  topoCTRAnuncios?: string;
  leadsMes?: string;
  custoPorLead?: string;
  // Novos KPIs por etapa do funil
  // Topo de Funil
  qualidadeLead?: string;
  tempoPagina?: string;
  // Meio de Funil
  leadMQL?: string;
  tempoResposta?: string;
  showRate?: string;
  emailOpenRate?: string;
  clickRate?: string;
  leadScoreMedio?: string;
  // Fundo de Funil
  mqlSQL?: string;
  sqlVenda?: string;
  propostaFechamento?: string;
  reunioesVendedor?: string;
  // Pós Conversão
  churn30d?: string;
  recompra60d?: string;
  ltv?: string;
  nps?: string;
  tempoOnboarding?: string;
  upsellRate?: string;
}

interface OnboardingChatWithSidebarProps {
  onComplete: (data: CollectedData) => void;
}

export function OnboardingChatWithSidebar({ onComplete }: OnboardingChatWithSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentStage, setCurrentStage] = useState('discovery');
  const [progress, setProgress] = useState(0);
  const [collectedData, setCollectedData] = useState<CollectedData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const stages = {
    discovery: { name: 'Descoberta', progress: 10 },
    company: { name: 'Sobre a Empresa', progress: 25 },
    topo: { name: 'Topo do Funil', progress: 45 },
    meio: { name: 'Meio do Funil', progress: 65 },
    fundo: { name: 'Fundo do Funil', progress: 85 },
    pos: { name: 'Pós-Venda', progress: 100 }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Iniciar conversa automaticamente quando o componente carrega
    setTimeout(() => {
      addBotMessage(
        "Olá! Sou o Copiloto da V4SalesAI 🚀\n\nVou te guiar em uma conversa rápida para mapear seu funil de vendas e já começar a gerar insights personalizados para sua empresa.\n\nPrimeiro, me conte: qual é o seu nome?"
      );
    }, 1000);
  }, []);

  // Dados da TechCorp do mock-data-dashboard
  const techCorpData = {
    nome: "Carlos Eduardo",
    segmento: "SaaS B2B",
    ticketMedio: "R$ 2.500",
    cicloVendas: "35",
    visitantes: "14.000",
    conversaoTopo: "3.2%",
    qualificacao: "25%",
    gargaloMeio: "tempo de resposta muito alto (45 min)",
    taxaFechamento: "28%",
    motivoPerdas: "concorrência e preço",
    retencao: "88%",
    topoVisitanteLead: "3.2",
    topoCTRAnuncios: "2.1",
    leadsMes: "448",
    custoPorLead: "55.80",
    // Novos KPIs por etapa do funil
    // Topo de Funil
    qualidadeLead: "7.2/10",
    tempoPagina: "2m 45s",
    // Meio de Funil
    leadMQL: "25%",
    tempoResposta: "45 min",
    showRate: "72%",
    emailOpenRate: "24%",
    clickRate: "3.8%",
    leadScoreMedio: "68/100",
    // Fundo de Funil
    mqlSQL: "65%",
    sqlVenda: "28%",
    propostaFechamento: "18 dias",
    reunioesVendedor: "12/mês",
    // Pós Conversão
    churn30d: "8%",
    recompra60d: "15%",
    ltv: "R$ 8.750",
    nps: "42",
    tempoOnboarding: "14 dias",
    upsellRate: "22%"
  };

  const simulateConversation = async () => {
    if (isSimulating) return;
    
    setIsSimulating(true);
    setMessages([]);
    setCollectedData({});
    setCurrentStage('discovery');
    setProgress(0);

    // Simular conversa completa com dados da TechCorp
    const conversationFlow = [
      {
        delay: 1000,
        action: () => addBotMessage("Olá! Sou o Copiloto da V4SalesAI 🚀\n\nVou te guiar em uma conversa rápida para mapear seu funil de vendas e já começar a gerar insights personalizados para sua empresa.\n\nPrimeiro, me conte: qual é o seu nome?")
      },
      {
        delay: 2000,
        action: () => addUserMessage(techCorpData.nome)
      },
      {
        delay: 1500,
        action: () => {
          setCollectedData(prev => ({ ...prev, nome: techCorpData.nome }));
          addBotMessage(
            `Prazer em conhecer você, ${techCorpData.nome}! 👋\n\nAgora me conte: qual é o segmento da sua empresa? (Ex: SaaS, E-commerce, Consultoria, Serviços, etc.)`,
            `✅ Nome registrado: ${techCorpData.nome}`
          );
        }
      },
      {
        delay: 2000,
        action: () => addUserMessage(techCorpData.segmento)
      },
      {
        delay: 1800,
        action: () => {
          setCollectedData(prev => ({ ...prev, segmento: techCorpData.segmento }));
          setCurrentStage('company');
          setProgress(25);
          addBotMessage(
            `Perfeito! ${techCorpData.segmento} é um segmento muito interessante.\n\nVamos falar sobre os números da sua empresa. Qual é o ticket médio dos seus produtos/serviços? (Valor aproximado em R$)`,
            `✅ Segmento registrado: ${techCorpData.segmento}`,
            2000
          );
        }
      },
      {
        delay: 4000,
        action: () => addUserMessage(techCorpData.ticketMedio)
      },
      {
        delay: 1600,
        action: () => {
          setCollectedData(prev => ({ ...prev, ticketMedio: techCorpData.ticketMedio }));
          addBotMessage(
            `Excelente! Com ticket médio de ${techCorpData.ticketMedio}, já posso começar a calcular algumas métricas importantes.\n\nQual é o ciclo de vendas médio da sua empresa? (Em dias - ex: 30, 60, 90...)`,
            `✅ Ticket médio registrado: ${techCorpData.ticketMedio}`,
            1800
          );
        }
      },
      {
        delay: 3600,
        action: () => addUserMessage(`${techCorpData.cicloVendas} dias`)
      },
      {
        delay: 2000,
        action: () => {
          setCollectedData(prev => ({ ...prev, cicloVendas: techCorpData.cicloVendas }));
          setCurrentStage('topo');
          setProgress(45);
          addBotMessage(
            `Ótimo! Ciclo de ${techCorpData.cicloVendas} dias é uma informação valiosa para otimizarmos seu funil.\n\n🎯 **TOPO DO FUNIL - Atração**\n\nVamos mapear como você atrai leads. Quantos visitantes únicos seu site/landing pages recebem por mês? (Número aproximado)`,
            `✅ Ciclo de vendas: ${techCorpData.cicloVendas} dias`,
            2200
          );
        }
      },
      {
        delay: 4400,
        action: () => addUserMessage(techCorpData.visitantes)
      },
      {
        delay: 1500,
        action: () => {
          setCollectedData(prev => ({ ...prev, visitantes: techCorpData.visitantes }));
          addBotMessage(
            `${techCorpData.visitantes} visitantes mensais é um bom volume para trabalharmos!\n\nQual a taxa de conversão de Visitante para Lead? (%)`,
            `✅ Visitantes mensais: ${techCorpData.visitantes}`,
            1600
          );
        }
      },
      {
        delay: 3200,
        action: () => addUserMessage(techCorpData.topoVisitanteLead)
      },
      {
        delay: 1800,
        action: () => {
          setCollectedData(prev => ({ ...prev, topoVisitanteLead: techCorpData.topoVisitanteLead }));
          addBotMessage(
            `Entendido. E qual o CTR médio dos seus anúncios? (%)`,
            `✅ Visitante → Lead: ${techCorpData.topoVisitanteLead}%`,
            1600
          );
        }
      },
      {
        delay: 3200,
        action: () => addUserMessage(techCorpData.topoCTRAnuncios)
      },
      {
        delay: 1800,
        action: () => {
          setCollectedData(prev => ({ ...prev, topoCTRAnuncios: techCorpData.topoCTRAnuncios }));
          addBotMessage(
            `Ok. Quantos leads em média vocês geram por mês?`,
            `✅ CTR Anúncios: ${techCorpData.topoCTRAnuncios}%`,
            1600
          );
        }
      },
      {
        delay: 3200,
        action: () => addUserMessage(techCorpData.leadsMes)
      },
      {
        delay: 1800,
        action: () => {
          setCollectedData(prev => ({ ...prev, leadsMes: techCorpData.leadsMes }));
          addBotMessage(
            `E para finalizar o topo do funil, qual o Custo por Lead (CPL) médio? (R$)`,
            `✅ Leads/Mês: ${techCorpData.leadsMes}`,
            1600
          );
        }
      },
      {
        delay: 3200,
        action: () => addUserMessage(techCorpData.custoPorLead)
      },
      {
        delay: 1800,
        action: () => {
          setCollectedData(prev => ({ ...prev, custoPorLead: techCorpData.custoPorLead }));
          setCurrentStage('meio');
          setProgress(65);
          addBotMessage(
            `Perfeito! Suas métricas de topo de funil estão mapeadas.\n\n🎯 **MEIO DO FUNIL - Qualificação**\n\nAgora vamos entender como você qualifica esses leads. Dos leads que entram, quantos se tornam oportunidades reais de venda? (Em % ou número)`,
            `✅ Custo por Lead: R$ ${techCorpData.custoPorLead}`,
            2000
          );
        }
      },
      {
        delay: 3800,
        action: () => addUserMessage(techCorpData.qualificacao)
      },
      {
        delay: 1700,
        action: () => {
          setCollectedData(prev => ({ ...prev, qualificacao: techCorpData.qualificacao }));
          addBotMessage(
            `Excelente! Essa métrica de qualificação é crucial para otimizar seu funil.\n\nQual é o principal gargalo que você identifica nessa etapa de qualificação? (Ex: falta de follow-up, leads frios, processo manual, etc.)`,
            `✅ Taxa de qualificação: ${techCorpData.qualificacao}`,
            1800
          );
        }
      },
      {
        delay: 3600,
        action: () => addUserMessage(techCorpData.gargaloMeio)
      },
      {
        delay: 2000,
        action: () => {
          setCollectedData(prev => ({ ...prev, gargaloMeio: techCorpData.gargaloMeio }));
          setCurrentStage('fundo');
          setProgress(85);
          addBotMessage(
            `Entendi! "${techCorpData.gargaloMeio}" é um desafio comum que podemos trabalhar juntos.\n\n🎯 **FUNDO DO FUNIL - Fechamento**\n\nVamos para a etapa final. Das oportunidades qualificadas, qual é sua taxa de fechamento? (Em % - ex: 20%, 35%, etc.)`,
            `✅ Gargalo identificado: ${techCorpData.gargaloMeio}`,
            2200
          );
        }
      },
      {
        delay: 4200,
        action: () => addUserMessage(techCorpData.taxaFechamento)
      },
      {
        delay: 1500,
        action: () => {
          setCollectedData(prev => ({ ...prev, taxaFechamento: techCorpData.taxaFechamento }));
          addBotMessage(
            `${techCorpData.taxaFechamento} de taxa de fechamento! Vamos trabalhar para otimizar isso.\n\nQual é o principal motivo das perdas nas negociações? (Ex: preço, concorrência, timing, falta de urgência, etc.)`,
            `✅ Taxa de fechamento: ${techCorpData.taxaFechamento}`,
            1600
          );
        }
      },
      {
        delay: 3200,
        action: () => addUserMessage(techCorpData.motivoPerdas)
      },
      {
        delay: 1800,
        action: () => {
          setCollectedData(prev => ({ ...prev, motivoPerdas: techCorpData.motivoPerdas }));
          setCurrentStage('pos');
          setProgress(100);
          addBotMessage(
            `Perfeito! "${techCorpData.motivoPerdas}" é uma informação valiosa para nossa estratégia.\n\n🎯 **PÓS-VENDA - Retenção**\n\nPor último: qual é a taxa de retenção/renovação dos seus clientes? (Em % anual ou mensal)`,
            `✅ Principal motivo de perdas: ${techCorpData.motivoPerdas}`,
            2000
          );
        }
      },
      {
        delay: 3800,
        action: () => addUserMessage(techCorpData.retencao)
      },
      {
        delay: 2200,
        action: () => {
          const finalData = { ...techCorpData };
          setCollectedData(finalData);
          addBotMessage(
            `🎉 **Parabéns! Mapeamento completo!**\n\nColetei todas as informações do seu funil da TechCorp:\n\n✅ Perfil da empresa definido\n✅ Topo do funil mapeado\n✅ Meio do funil analisado\n✅ Fundo do funil diagnosticado\n✅ Pós-venda avaliado\n\nAgora vou processar esses dados e gerar seu Dashboard Vivo personalizado com insights e recomendações específicas para sua empresa!\n\n**Preparando seu painel...**`,
            `✅ Taxa de retenção: ${techCorpData.retencao}`,
            2500
          );
          
          setTimeout(() => {
            setIsSimulating(false);
            onComplete(finalData);
          }, 4000);
        }
      }
    ];

    // Executar fluxo de conversa
    let totalDelay = 0;
    conversationFlow.forEach((step, index) => {
      totalDelay += step.delay;
      setTimeout(step.action, totalDelay);
    });
  };

  const addBotMessage = (content: string, confirmation?: string, delay = 1500) => {
    setIsTyping(true);
    setTimeout(() => {
      const newMessage: Message = {
        id: `bot_${Date.now()}`,
        type: 'bot',
        content,
        timestamp: new Date(),
        stage: currentStage,
        confirmation
      };
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }, delay);
  };

  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: `user_${Date.now()}`,
      type: 'user',
      content,
      timestamp: new Date(),
      stage: currentStage
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage = currentMessage.trim();
    setCurrentMessage('');
    setIsLoading(true);
    
    addUserMessage(userMessage);

    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 800));

    // Lógica de conversa baseada no estágio atual
    await processUserResponse(userMessage);
    setIsLoading(false);
  };

  const processUserResponse = async (response: string) => {
    const messageCount = messages.filter(m => m.type === 'user').length;

    switch (currentStage) {
      case 'discovery':
        if (messageCount === 0) {
          // Nome coletado
          setCollectedData((prev: CollectedData) => ({ ...prev, nome: response }));
          addBotMessage(
            `Prazer em conhecer você, ${response}! 👋\n\nAgora me conte: qual é o segmento da sua empresa? (Ex: SaaS, E-commerce, Consultoria, Serviços, etc.)`,
            `✅ Nome registrado: ${response}`
          );
        } else if (messageCount === 1) {
          // Segmento coletado
          setCollectedData((prev: CollectedData) => ({ ...prev, segmento: response }));
          setCurrentStage('company');
          setProgress(stages.company.progress);
          addBotMessage(
            `Perfeito! ${response} é um segmento muito interessante.\n\nVamos falar sobre os números da sua empresa. Qual é o ticket médio dos seus produtos/serviços? (Valor aproximado em R$)`,
            `✅ Segmento registrado: ${response}`,
            2000
          );
        }
        break;

      case 'company':
        if (messageCount === 2) {
          // Ticket médio coletado
          setCollectedData((prev: CollectedData) => ({ ...prev, ticketMedio: response }));
          addBotMessage(
            `Excelente! Com ticket médio de ${response}, já posso começar a calcular algumas métricas importantes.\n\nQual é o ciclo de vendas médio da sua empresa? (Em dias - ex: 30, 60, 90...)`,
            `✅ Ticket médio registrado: ${response}`,
            1800
          );
        } else if (messageCount === 3) {
          // Ciclo de vendas coletado
          setCollectedData((prev: CollectedData) => ({ ...prev, cicloVendas: response }));
          setCurrentStage('topo');
          setProgress(stages.topo.progress);
          addBotMessage(
            `Ótimo! Ciclo de ${response} dias é uma informação valiosa para otimizarmos seu funil.\n\n🎯 **TOPO DO FUNIL - Atração**\n\nVamos mapear como você atrai leads. Quantos visitantes únicos seu site/landing pages recebem por mês? (Número aproximado)`,
            `✅ Ciclo de vendas: ${response} dias`,
            2200
          );
        }
        break;

      case 'topo':
        if (messageCount === 4) {
          // Visitantes coletados
          setCollectedData((prev: CollectedData) => ({ ...prev, visitantes: response }));
          addBotMessage(
            `${response} visitantes mensais é um bom volume para trabalharmos!\n\nQual a taxa de conversão de Visitante para Lead? (%)`,
            `✅ Visitantes mensais: ${response}`,
            1600
          );
        } else if (messageCount === 5) {
          // Taxa de conversão topo coletada
          setCollectedData((prev: CollectedData) => ({ ...prev, topoVisitanteLead: response }));
          addBotMessage(
            `Entendido. E qual o CTR médio dos seus anúncios? (%)`,
            `✅ Visitante → Lead: ${response}%`,
            1600
          );
        } else if (messageCount === 6) {
          // CTR Anuncios coletado
          setCollectedData((prev: CollectedData) => ({ ...prev, topoCTRAnuncios: response }));
          addBotMessage(
            `Ok. Quantos leads em média vocês geram por mês?`,
            `✅ CTR Anúncios: ${response}%`,
            1600
          );
        } else if (messageCount === 7) {
          // Leads/Mês coletado
          setCollectedData((prev: CollectedData) => ({ ...prev, leadsMes: response }));
          addBotMessage(
            `E para finalizar o topo do funil, qual o Custo por Lead (CPL) médio? (R$)`,
            `✅ Leads/Mês: ${response}`,
            1600
          );
        } else if (messageCount === 8) {
          // Custo por Lead coletado
          setCollectedData((prev: CollectedData) => ({ ...prev, custoPorLead: response }));
          setCurrentStage('meio');
          setProgress(stages.meio.progress);
          addBotMessage(
            `Perfeito! Suas métricas de topo de funil estão mapeadas.\n\n🎯 **MEIO DO FUNIL - Qualificação**\n\nAgora vamos entender como você qualifica esses leads. Dos leads que entram, quantos se tornam oportunidades reais de venda? (Em % ou número)`,
            `✅ Custo por Lead: R$ ${response}`,
            2000
          );
        }
        break;

      case 'meio':
        if (messageCount === 6) {
          // Qualificação coletada
          setCollectedData((prev: CollectedData) => ({ ...prev, qualificacao: response }));
          addBotMessage(
            `Excelente! Essa métrica de qualificação é crucial para otimizar seu funil.\n\nQual é o principal gargalo que você identifica nessa etapa de qualificação? (Ex: falta de follow-up, leads frios, processo manual, etc.)`,
            `✅ Taxa de qualificação: ${response}`,
            1800
          );
        } else if (messageCount === 7) {
          // Gargalo meio coletado
          setCollectedData((prev: CollectedData) => ({ ...prev, gargaloMeio: response }));
          setCurrentStage('fundo');
          setProgress(stages.fundo.progress);
          addBotMessage(
            `Entendi! "${response}" é um desafio comum que podemos trabalhar juntos.\n\n🎯 **FUNDO DO FUNIL - Fechamento**\n\nVamos para a etapa final. Das oportunidades qualificadas, qual é sua taxa de fechamento? (Em % - ex: 20%, 35%, etc.)`,
            `✅ Gargalo identificado: ${response}`,
            2200
          );
        }
        break;

      case 'fundo':
        if (messageCount === 8) {
          // Taxa de fechamento coletada
          setCollectedData((prev: CollectedData) => ({ ...prev, taxaFechamento: response }));
          addBotMessage(
            `${response} de taxa de fechamento! Vamos trabalhar para otimizar isso.\n\nQual é o principal motivo das perdas nas negociações? (Ex: preço, concorrência, timing, falta de urgência, etc.)`,
            `✅ Taxa de fechamento: ${response}`,
            1600
          );
        } else if (messageCount === 9) {
          // Motivo perdas coletado
          setCollectedData((prev: CollectedData) => ({ ...prev, motivoPerdas: response }));
          setCurrentStage('pos');
          setProgress(stages.pos.progress);
          addBotMessage(
            `Perfeito! "${response}" é uma informação valiosa para nossa estratégia.\n\n🎯 **PÓS-VENDA - Retenção**\n\nPor último: qual é a taxa de retenção/renovação dos seus clientes? (Em % anual ou mensal)`,
            `✅ Principal motivo de perdas: ${response}`,
            2000
          );
        } else if (messageCount === 10) {
          // Taxa de retenção coletada
          const finalData = { ...collectedData, retencao: response };
          setCollectedData(finalData);
          
          addBotMessage(
            `🎉 **Parabéns! Mapeamento completo!**\n\nColetei todas as informações do seu funil da TechCorp:\n\n✅ Perfil da empresa definido\n✅ Topo do funil mapeado\n✅ Meio do funil analisado\n✅ Fundo do funil diagnosticado\n✅ Pós-venda avaliado\n\nAgora vou processar esses dados e gerar seu Dashboard Vivo personalizado com insights e recomendações específicas para sua empresa!\n\n**Preparando seu painel...**`,
            `✅ Taxa de retenção: ${response}`,
            2500
          );

          // Finalizar após um delay
          setTimeout(() => {
            onComplete(finalData);
          }, 4000);
        }
        break;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex h-full">
      {/* Chat Area */}
      <div className="flex flex-col flex-1 bg-[#0B0C0E] text-white min-h-0">
        {/* Progress Header */}
        <div className="flex-shrink-0 p-4 border-b border-gray-700/50 bg-gradient-to-r from-[#0B0C0E] to-[#1a1b1e]">
          {/* Simulate Button */}
          <div className="mb-4 flex justify-center">
            <Button
              onClick={simulateConversation}
              disabled={isSimulating || isLoading}
              className="bg-gradient-to-r from-[#E11D2E] to-[#ff4757] hover:from-[#c41729] hover:to-[#e63946] text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#E11D2E]/30 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSimulating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Simulando...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Simular TechCorp
                </>
              )}
            </Button>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#E11D2E] rounded-lg shadow-lg">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Copiloto V4SalesAI</h3>
                <p className="text-xs text-gray-400">{stages[currentStage as keyof typeof stages]?.name || 'Mapeamento do Funil'}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400 mb-1">Progresso</div>
              <div className="text-sm font-semibold text-[#E11D2E]">{progress}%</div>
            </div>
          </div>
          <Progress value={progress} className="h-2 bg-gray-700">
            <div 
              className="h-full bg-gradient-to-r from-[#E11D2E] to-[#ff4757] transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </Progress>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full p-4">
            <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((message) => (
              <div key={message.id} className={cn(
                "flex",
                message.type === 'user' ? "justify-end" : "justify-start"
              )}>
                <div className={cn(
                  "flex items-start space-x-3 max-w-[85%]",
                  message.type === 'user' ? "flex-row-reverse space-x-reverse" : ""
                )}>
                  <div className={cn(
                    "p-2 rounded-lg mt-1 flex-shrink-0",
                    message.type === 'user' 
                      ? "bg-[#E11D2E]" 
                      : "bg-[#E11D2E]"
                  )}>
                    {message.type === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className={cn(
                    "rounded-lg p-4 text-sm",
                    message.type === 'user' 
                      ? "bg-[#E11D2E] text-white" 
                      : "bg-[#1a1b1e] text-gray-100"
                  )}>
                    {/* Confirmation Badge */}
                    {message.confirmation && (
                      <div className="mb-3">
                        <Badge className="bg-green-600 text-white text-xs border-0">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {message.confirmation}
                        </Badge>
                      </div>
                    )}
                    
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </div>
                    <div className={cn(
                      "text-xs mt-3",
                      message.type === 'user' ? "text-red-100 opacity-70" : "text-gray-500"
                    )}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-[#E11D2E] rounded-lg mt-1">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-[#1a1b1e] rounded-lg p-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-[#E11D2E] rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-[#E11D2E] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-[#E11D2E] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-gray-400">Copiloto está digitando...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        {/* Input */}
        <div className="flex-shrink-0 p-4 border-t border-gray-700/50 bg-gradient-to-t from-[#0B0C0E] to-[#1a1b1e]">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-3">
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua resposta..."
                className="flex-1 bg-[#1a1b1e] border-gray-600 text-white placeholder-gray-500 rounded-lg focus:border-[#E11D2E] focus:ring-1 focus:ring-[#E11D2E] transition-all duration-200"
                disabled={isLoading || isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || isLoading || isTyping}
                size="icon"
                className="bg-[#E11D2E] hover:bg-[#c41729] rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#E11D2E]/30 hover:scale-105 active:scale-95"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Data Collection Sidebar */}
      <div className="w-80 bg-[#1a1b1e] border-l border-gray-700/50 flex-shrink-0">
        <ScrollArea className="h-full p-4">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Dados Coletados</h3>
            <p className="text-xs text-gray-400">Informações capturadas em tempo real</p>
          </div>

          {/* Empresa Info */}
          <Card className="bg-[#0B0C0E] border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white flex items-center">
                <Building className="h-4 w-4 mr-2 text-[#E11D2E]" />
                Empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Nome:</span>
                <span className="text-white">{collectedData.nome || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Segmento:</span>
                <span className="text-white">{collectedData.segmento || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Ticket Médio:</span>
                <span className="text-white">{collectedData.ticketMedio || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Ciclo de Vendas:</span>
                <span className="text-white">{collectedData.cicloVendas ? `${collectedData.cicloVendas} dias` : '—'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Topo do Funil */}
          <Card className="bg-[#0B0C0E] border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white flex items-center">
                <Eye className="h-4 w-4 mr-2 text-[#E11D2E]" />
                Topo do Funil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Visitante → Lead:</span>
                <span className="text-white">{collectedData.topoVisitanteLead ? `${collectedData.topoVisitanteLead}%` : '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">CTR Anúncios:</span>
                <span className="text-white">{collectedData.topoCTRAnuncios ? `${collectedData.topoCTRAnuncios}%` : '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Leads/Mês:</span>
                <span className="text-white">{collectedData.leadsMes || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Custo por Lead:</span>
                <span className="text-white">{collectedData.custoPorLead ? `R$ ${collectedData.custoPorLead}` : '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Qualidade do Lead:</span>
                <span className="text-white">{collectedData.qualidadeLead || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tempo na Página:</span>
                <span className="text-white">{collectedData.tempoPagina || '—'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Meio do Funil */}
          <Card className="bg-[#0B0C0E] border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white flex items-center">
                <Filter className="h-4 w-4 mr-2 text-[#E11D2E]" />
                Meio do Funil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Lead → MQL:</span>
                <span className="text-white">{collectedData.leadMQL || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tempo de Resposta:</span>
                <span className="text-white">{collectedData.tempoResposta || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Show Rate:</span>
                <span className="text-white">{collectedData.showRate || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email Open Rate:</span>
                <span className="text-white">{collectedData.emailOpenRate || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Click Rate:</span>
                <span className="text-white">{collectedData.clickRate || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Lead Score Médio:</span>
                <span className="text-white">{collectedData.leadScoreMedio || '—'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Fundo do Funil */}
          <Card className="bg-[#0B0C0E] border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white flex items-center">
                <ShoppingCart className="h-4 w-4 mr-2 text-[#E11D2E]" />
                Fundo do Funil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">MQL → SQL:</span>
                <span className="text-white">{collectedData.mqlSQL || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">SQL → Venda:</span>
                <span className="text-white">{collectedData.sqlVenda || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Ticket Médio:</span>
                <span className="text-white">{collectedData.ticketMedio || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Ciclo de Vendas:</span>
                <span className="text-white">{collectedData.cicloVendas ? `${collectedData.cicloVendas} dias` : '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Proposta → Fechamento:</span>
                <span className="text-white">{collectedData.propostaFechamento || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Reuniões/Vendedor:</span>
                <span className="text-white">{collectedData.reunioesVendedor || '—'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Pós Conversão */}
          <Card className="bg-[#0B0C0E] border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white flex items-center">
                <RefreshCw className="h-4 w-4 mr-2 text-[#E11D2E]" />
                Pós Conversão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Churn 30d:</span>
                <span className="text-white">{collectedData.churn30d || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Recompra 60d:</span>
                <span className="text-white">{collectedData.recompra60d || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">LTV:</span>
                <span className="text-white">{collectedData.ltv || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">NPS:</span>
                <span className="text-white">{collectedData.nps || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tempo Onboarding:</span>
                <span className="text-white">{collectedData.tempoOnboarding || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Upsell Rate:</span>
                <span className="text-white">{collectedData.upsellRate || '—'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Progress Summary */}
          <Card className="bg-[#E11D2E]/10 border-[#E11D2E]/30">
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#E11D2E] mb-1">{progress}%</div>
                <div className="text-xs text-gray-300">Mapeamento Completo</div>
                <div className="text-xs text-gray-500 mt-1">
                  {stages[currentStage as keyof typeof stages]?.name}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        </ScrollArea>
      </div>
    </div>
  );
}
