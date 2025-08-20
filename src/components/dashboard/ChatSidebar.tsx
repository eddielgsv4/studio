"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2,
  Zap,
  Target,
  ShoppingBag,
  Lightbulb,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboard } from '@/contexts/DashboardContext';

export function ChatSidebar() {
  const { chatMessages, sendChatMessage, project, expandedStage } = useDashboard();
  const [message, setMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string>('general');
  const [isLoading, setIsLoading] = useState(false);
  const [width, setWidth] = useState(384); // 96 * 4 = 384px (w-96)
  const [isResizing, setIsResizing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Handle resize functionality
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const newWidth = window.innerWidth - e.clientX;
    const minWidth = 320; // Minimum width
    const maxWidth = 600; // Maximum width
    
    setWidth(Math.min(Math.max(newWidth, minWidth), maxWidth));
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      await sendChatMessage(message, selectedStage || undefined);
      setMessage('');
    } finally {
      setIsLoading(false);
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

  const getStageIcon = (stageId: string) => {
    const stage = project?.stages.find(s => s.id === stageId);
    return stage?.icon || '🎯';
  };

  const getStageName = (stageId: string) => {
    if (stageId === 'general') return 'Geral';
    const stage = project?.stages.find(s => s.id === stageId);
    return stage?.name || 'Geral';
  };

  const getStageDisplayName = (stageId: string) => {
    if (stageId === 'general') return 'Copiloto Comercial';
    const stage = project?.stages.find(s => s.id === stageId);
    return `Especialista ${stage?.name || 'Geral'}`;
  };

  // Auto-select stage when one is expanded
  useEffect(() => {
    if (expandedStage && expandedStage !== selectedStage) {
      setSelectedStage(expandedStage);
    }
  }, [expandedStage, selectedStage]);

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full w-14 h-14 bg-[#E11D2E] hover:bg-[#c41729] shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div 
      ref={sidebarRef}
      className="border-l border-gray-700/50 bg-[#0B0C0E] flex flex-col h-full shadow-2xl relative"
      style={{ width: `${width}px` }}
    >
      {/* Resize Handle */}
      <div
        className="absolute left-0 top-0 w-1 h-full cursor-col-resize hover:bg-[#E11D2E]/50 transition-colors duration-200 z-10"
        onMouseDown={handleMouseDown}
        title="Arraste para redimensionar"
      />
      
      {/* Header */}
      <div className="p-4 border-b border-gray-700/50 bg-gradient-to-r from-[#0B0C0E] to-[#1a1b1e]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#E11D2E] rounded-lg shadow-lg">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{getStageDisplayName(selectedStage)}</h3>
              <p className="text-xs text-gray-500">{getStageName(selectedStage)}</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(true)}
            className="h-8 w-8 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Stage Selector */}
        <div className="space-y-2">
          <label className="text-xs text-gray-400 font-medium">Especialista:</label>
          <Select value={selectedStage} onValueChange={setSelectedStage}>
            <SelectTrigger className="w-full bg-[#1a1b1e] border-gray-600 text-white text-sm h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1b1e] border-gray-600">
              <SelectItem value="general" className="text-white hover:bg-[#2a2b2e]">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="h-4 w-4 text-[#E11D2E]" />
                  <span>Copiloto Geral</span>
                </div>
              </SelectItem>
              {project?.stages.map((stage) => (
                <SelectItem key={stage.id} value={stage.id} className="text-white hover:bg-[#2a2b2e]">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{stage.icon}</span>
                    <span>Especialista {stage.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {/* Welcome Message */}
          <div className="flex justify-start">
            <div className="flex items-start space-x-3 max-w-[90%]">
              <div className="p-1.5 bg-[#E11D2E] rounded-lg mt-1 flex-shrink-0">
                <ShoppingBag className="h-4 w-4 text-white" />
              </div>
              <div className="bg-[#1a1b1e] rounded-lg p-3 text-sm text-gray-100">
                <div className="whitespace-pre-wrap">
                  Olá! Bem-vindo ao seu Painel Vivo. Vou guiar você para mapear seu funil e já atualizar os indicadores aqui ao lado — em tempo real.
                </div>
                <div className="text-xs mt-2 text-gray-500">14:41</div>
              </div>
            </div>
          </div>

          <div className="flex justify-start">
            <div className="flex items-start space-x-3 max-w-[90%]">
              <div className="p-1.5 bg-[#E11D2E] rounded-lg mt-1 flex-shrink-0">
                <ShoppingBag className="h-4 w-4 text-white" />
              </div>
              <div className="bg-[#1a1b1e] rounded-lg p-3 text-sm text-gray-100">
                <div className="whitespace-pre-wrap">
                  Antes de começarmos, me conte: qual é o maior desafio do seu funil de vendas hoje?
                </div>
                <div className="text-xs mt-2 text-gray-500">14:42</div>
              </div>
            </div>
          </div>

          {/* User Messages */}
          {chatMessages.filter(msg => msg.type === 'user').map((msg) => (
            <div key={msg.id} className="flex justify-end">
              <div className="flex items-end space-x-2 max-w-[80%]">
                <div className="bg-[#E11D2E] rounded-lg p-3 text-sm text-white">
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  <div className="text-xs mt-2 text-red-100 opacity-70">
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
                <div className="p-1.5 bg-[#E11D2E] rounded-full mb-1 flex-shrink-0">
                  <User className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          ))}

          {/* Assistant Messages */}
          {chatMessages.filter(msg => msg.type === 'assistant' && msg.id !== 'msg_001').map((msg) => (
            <div key={msg.id} className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-[90%]">
                <div className="p-1.5 bg-[#E11D2E] rounded-lg mt-1 flex-shrink-0">
                  <ShoppingBag className="h-4 w-4 text-white" />
                </div>
                <div className="bg-[#1a1b1e] rounded-lg p-3 text-sm text-gray-100">
                  {/* Validation Badge */}
                  {msg.content.includes('problema') && (
                    <div className="mb-2">
                      <Badge className="bg-[#E11D2E] text-white text-xs border-0">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Validação
                      </Badge>
                    </div>
                  )}
                  
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  <div className="text-xs mt-2 text-gray-500">
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="p-1.5 bg-[#E11D2E] rounded-lg mt-1">
                  <ShoppingBag className="h-4 w-4 text-white" />
                </div>
                <div className="bg-[#1a1b1e] rounded-lg p-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#E11D2E]"></div>
                    <span className="text-gray-400">Pensando...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-700/50 bg-gradient-to-t from-[#0B0C0E] to-[#1a1b1e]">
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMessage(selectedStage === 'general' ? "Explique o funil de vendas" : `Explique a etapa ${getStageName(selectedStage)}`)}
            className="text-xs h-9 text-white bg-gradient-to-r from-[#E11D2E]/10 to-[#E11D2E]/20 hover:from-[#E11D2E]/20 hover:to-[#E11D2E]/30 flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-[#E11D2E]/20 hover:scale-105 active:scale-95 border border-[#E11D2E]/30 hover:border-[#E11D2E]/50"
          >
            <Lightbulb className="h-3 w-3 mr-1" />
            Explicar etapa
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMessage(selectedStage === 'general' ? "Como melhorar meu funil?" : `Como simular melhorias na etapa ${getStageName(selectedStage)}?`)}
            className="text-xs h-9 text-white bg-gradient-to-r from-[#E11D2E]/10 to-[#E11D2E]/20 hover:from-[#E11D2E]/20 hover:to-[#E11D2E]/30 flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-[#E11D2E]/20 hover:scale-105 active:scale-95 border border-[#E11D2E]/30 hover:border-[#E11D2E]/50"
          >
            <BarChart3 className="h-3 w-3 mr-1" />
            Simular melhoria
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMessage(selectedStage === 'general' ? "Quais são minhas prioridades?" : `Quais são as prioridades da etapa ${getStageName(selectedStage)}?`)}
            className="text-xs h-9 text-white bg-gradient-to-r from-[#E11D2E]/10 to-[#E11D2E]/20 hover:from-[#E11D2E]/20 hover:to-[#E11D2E]/30 flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-[#E11D2E]/20 hover:scale-105 active:scale-95 border border-[#E11D2E]/30 hover:border-[#E11D2E]/50"
          >
            <Target className="h-3 w-3 mr-1" />
            Prioridades
          </Button>
        </div>

        {/* Input */}
        <div className="flex space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={selectedStage === 'general' ? "Digite sua pergunta sobre o funil..." : `Pergunte sobre ${getStageName(selectedStage)}...`}
            className="flex-1 bg-[#1a1b1e] border-gray-600 text-white placeholder-gray-500 rounded-lg focus:border-[#E11D2E] focus:ring-1 focus:ring-[#E11D2E] transition-all duration-200"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading}
            size="icon"
            className="bg-[#E11D2E] hover:bg-[#c41729] rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#E11D2E]/30 hover:scale-105 active:scale-95"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
