"use client";

import { useState, useRef, useEffect } from 'react';
import { useLiveProject } from '@/contexts/LiveProjectContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  Send, 
  Bot, 
  User, 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/lib/types-live';

export function ChatPane() {
  const { 
    messages, 
    isTyping, 
    sendMessage, 
    projectState, 
    isLoading 
  } = useLiveProject();
  
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focar input quando carregado
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isSubmitting) return;

    const message = inputValue.trim();
    setInputValue('');
    setIsSubmitting(true);

    try {
      await sendMessage(message);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    setIsSubmitting(true);
    try {
      switch (action) {
        case 'explain_stage':
          await sendMessage('Explique o que significa esta etapa', { 
            type: 'explain', 
            content: 'stage_explanation',
            parameters: { stage: projectState?.conversation.currentStage }
          });
          break;
        case 'simulate_improvement':
          await sendMessage('Simule uma melhoria nesta etapa', { 
            type: 'simulate', 
            content: 'improvement_simulation' 
          });
          break;
        case 'show_priorities':
          await sendMessage('Quais são minhas prioridades?', { 
            type: 'prioritize', 
            content: 'show_priorities' 
          });
          break;
        case 'compare_market':
          await sendMessage('Como estou vs mercado?', { 
            type: 'compare', 
            content: 'market_comparison' 
          });
          break;
      }
    } catch (error) {
      console.error('Erro na ação rápida:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Copiloto Comercial</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <LoadingSpinner size="lg" />
            <p className="text-muted-foreground">Carregando conversa...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-primary" />
          <span>Copiloto Comercial</span>
          <Badge variant="secondary" className="ml-auto">
            {projectState?.conversation.currentStage}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4 overflow-hidden">
        {/* Área de mensagens - Scrollable */}
        <div className="flex-1 overflow-hidden mb-4">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessageItem key={message.id} message={message} />
              ))}
              
              {/* Indicador de digitação */}
              {isTyping && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted p-3 rounded-lg rounded-tl-none max-w-[80%]">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        {/* Área de input - Sempre visível com altura fixa */}
        <div className="flex-shrink-0 space-y-3 border-t pt-3">
          {/* Ações rápidas */}
          {!isTyping && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction('explain_stage')}
                disabled={isSubmitting}
                className="text-xs"
              >
                <Lightbulb className="h-3 w-3 mr-1" />
                Explicar etapa
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction('simulate_improvement')}
                disabled={isSubmitting}
                className="text-xs"
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                Simular melhoria
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction('show_priorities')}
                disabled={isSubmitting}
                className="text-xs"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Prioridades
              </Button>
            </div>
          )}

          {/* Input de mensagem */}
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua resposta ou pergunta..."
              disabled={isSubmitting || isTyping}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={!inputValue.trim() || isSubmitting || isTyping}
              size="sm"
            >
              {isSubmitting ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}

function ChatMessageItem({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  const getMessageIcon = () => {
    if (isUser) return <User className="h-4 w-4" />;
    if (isSystem) return <AlertTriangle className="h-4 w-4" />;
    
    switch (message.type) {
      case 'metric_update':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'validation':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'simulation':
        return <Lightbulb className="h-4 w-4 text-purple-500" />;
      case 'insight':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Bot className="h-4 w-4 text-primary" />;
    }
  };

  const getMessageBadge = () => {
    switch (message.type) {
      case 'metric_update':
        return <Badge variant="secondary" className="text-xs">Métrica atualizada</Badge>;
      case 'validation':
        return <Badge variant="destructive" className="text-xs">Validação</Badge>;
      case 'simulation':
        return <Badge variant="outline" className="text-xs">Simulação</Badge>;
      case 'insight':
        return <Badge variant="default" className="text-xs">Insight</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className={cn(
      "flex items-start space-x-3",
      isUser && "flex-row-reverse space-x-reverse"
    )}>
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
        isUser ? "bg-primary text-primary-foreground" : "bg-muted"
      )}>
        {getMessageIcon()}
      </div>
      
      <div className={cn(
        "max-w-[80%] space-y-1",
        isUser && "flex flex-col items-end"
      )}>
        <div className={cn(
          "p-3 rounded-lg",
          isUser 
            ? "bg-primary text-primary-foreground rounded-tr-none" 
            : "bg-muted rounded-tl-none"
        )}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        
        <div className={cn(
          "flex items-center space-x-2 text-xs text-muted-foreground",
          isUser && "flex-row-reverse space-x-reverse"
        )}>
          <span>
            {message.timestamp.toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          {getMessageBadge()}
        </div>
      </div>
    </div>
  );
}
