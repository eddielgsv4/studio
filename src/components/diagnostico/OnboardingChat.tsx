"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
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
  Zap
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
}

interface OnboardingChatProps {
  onComplete: (data: CollectedData) => void;
}

export function OnboardingChat({ onComplete }: OnboardingChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentStage, setCurrentStage] = useState('discovery');
  const [progress, setProgress] = useState(0);
  const [collectedData, setCollectedData] = useState<CollectedData>({});
  const [isLoading, setIsLoading] = useState(false);
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
    // Iniciar conversa
    setTimeout(() => {
      addBotMessage(
        "Olá! Sou o Copiloto da V4SalesAI 🚀\n\nVou te guiar em uma conversa rápida para mapear seu funil de vendas e já começar a gerar insights personalizados para sua empresa.\n\nPrimeiro, me conte: qual é o seu nome?"
      );
    }, 1000);
  }, []);

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
            `${response} visitantes mensais é um bom volume para trabalharmos!\n\nDesses visitantes, quantos se tornam leads (deixam contato, baixam material, etc.)? Pode ser em número absoluto ou percentual.`,
            `✅ Visitantes mensais: ${response}`,
            1600
          );
        } else if (messageCount === 5) {
          // Taxa de conversão topo coletada
          setCollectedData((prev: CollectedData) => ({ ...prev, conversaoTopo: response }));
          setCurrentStage('meio');
          setProgress(stages.meio.progress);
          addBotMessage(
            `Perfeito! Sua taxa de conversão no topo está mapeada.\n\n🎯 **MEIO DO FUNIL - Qualificação**\n\nAgora vamos entender como você qualifica esses leads. Dos leads que entram, quantos se tornam oportunidades reais de venda? (Em % ou número)`,
            `✅ Conversão Topo: ${response}`,
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
    <div className="flex flex-col h-full bg-[#0B0C0E] text-white">
      {/* Progress Header */}
      <div className="p-4 border-b border-gray-700/50 bg-gradient-to-r from-[#0B0C0E] to-[#1a1b1e]">
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
      <ScrollArea className="flex-1 p-4">
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

      {/* Input */}
      <div className="p-4 border-t border-gray-700/50 bg-gradient-to-t from-[#0B0C0E] to-[#1a1b1e]">
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
  );
}
