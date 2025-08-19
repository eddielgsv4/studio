
'use client';
import { useEffect, useRef, useState } from 'react';
import type { ChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Icons } from '../icons';
import { Avatar } from '../ui/avatar';
import { marked } from 'marked';
import { Card } from '../ui/card';
import { Separator } from '../ui/separator';

interface TypingIndicatorProps {
  className?: string;
}
const TypingIndicator = ({ className }: TypingIndicatorProps) => (
  <div className={cn("flex items-center space-x-1", className)}>
    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/80 [animation-delay:-0.3s]"></div>
    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/80 [animation-delay:-0.15s]"></div>
    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/80"></div>
  </div>
);

const parseMessage = (text: string) => {
    return marked.parse(text, {
      gfm: true,
      breaks: true,
      mangle: false,
      headerIds: false,
    });
};

type KpiStatus = 'green' | 'amber' | 'red';
export interface KpiBubbleProps {
    title: string;
    kpis: {
        label: string;
        value: string;
        benchmark: string;
        status: KpiStatus;
    }[];
}
const KpiBubble = ({ title, kpis }: KpiBubbleProps) => {
    const statusConfig = {
        green: { icon: Icons.check, color: 'text-green-500' },
        amber: { icon: Icons.minus, color: 'text-amber-500' },
        red: { icon: Icons.close, color: 'text-primary' },
    }
    return (
        <div className="space-y-3">
            <h4 className="font-semibold text-foreground">{title}</h4>
            <ul className="space-y-2 text-sm">
                {kpis.map((kpi, i) => {
                    const StatusIcon = statusConfig[kpi.status].icon;
                    return (
                        <li key={i} className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">{kpi.label}</span>
                            <div className="flex items-center gap-2 font-medium text-foreground">
                                <span>{kpi.value}</span>
                                <span className="text-xs text-muted-foreground/50">vs {kpi.benchmark}</span>
                                <StatusIcon className={cn("h-4 w-4 flex-shrink-0", statusConfig[kpi.status].color)} />
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export interface InsightsBubbleProps {
    title: string;
    insights: string[];
}
const InsightsBubble = ({ title, insights }: InsightsBubbleProps) => (
    <div className="space-y-3">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Icons.zap className="h-4 w-4 text-primary" />
            {title}
        </h4>
        <ul className="space-y-2 text-sm">
            {insights.map((insight, i) => (
                <li key={i} className="flex items-start gap-2.5">
                    <Icons.chevronRight className="h-3.5 w-3.5 mt-1 flex-shrink-0 text-primary/70" />
                    <span className="text-muted-foreground">{insight}</span>
                </li>
            ))}
        </ul>
    </div>
)

export interface SummaryBubbleProps {
    title: string;
    stats: { label: string; value: string; color?: string; subtitle?: string }[];
    actionPlan: { title: string; items: string[] };
}
const SummaryBubble = ({ title, stats, actionPlan }: SummaryBubbleProps) => (
    <div className="space-y-4">
        <h4 className="font-semibold text-foreground">{title}</h4>
        <div className="grid grid-cols-3 gap-2 text-center">
            {stats.map(stat => (
                <div key={stat.label} className="rounded-lg bg-secondary/50 p-2">
                    <p className={cn("text-xl font-bold", stat.color)}>{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    {stat.subtitle && <p className="text-xs text-muted-foreground/70">{stat.subtitle}</p>}
                </div>
            ))}
        </div>
        <div className="space-y-2">
             <h5 className="font-semibold text-foreground text-sm flex items-center gap-2">
                 <Icons.target className="h-4 w-4 text-primary" />
                 {actionPlan.title}
            </h5>
            <ul className="space-y-1.5 text-sm">
                 {actionPlan.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                        <Icons.chevronRight className="h-3.5 w-3.5 mt-1 flex-shrink-0 text-primary/70" />
                        <span className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: parseMessage(item) }} />
                    </li>
                ))}
            </ul>
        </div>
    </div>
)


interface ChatLiteProps {
  messages: ChatMessage[];
  isTyping: boolean;
}

export default function ChatLite({ messages, isTyping }: ChatLiteProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);


  const renderBubbleContent = (message: ChatMessage) => {
    if (message.text) {
        return (
             <div 
                className="prose prose-sm prose-invert prose-p:my-2 prose-ul:my-2 prose-li:my-1 prose-strong:text-foreground"
                dangerouslySetInnerHTML={{ __html: parseMessage(message.text) }} 
            />
        )
    }
    switch (message.type) {
        case 'kpi': return <KpiBubble {...message.data as KpiBubbleProps} />;
        case 'insights': return <InsightsBubble {...message.data as InsightsBubbleProps} />;
        case 'summary': return <SummaryBubble {...message.data as SummaryBubbleProps} />;
        default: return null;
    }
  }

  return (
    <div 
        className="relative w-full h-[600px] bg-card/50 backdrop-blur-sm rounded-2xl border border-border shadow-2xl shadow-black/30 flex flex-col" 
        data-analytics-id="chat_autoplay_start"
    >
        <div ref={scrollAreaRef} className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-3 text-sm animate-in fade-in duration-500',
                message.agent === 'user' ? 'justify-end' : 'justify-start'
              )}
              data-analytics-id={`message_copilot_view_${index + 1}`}
            >
              {message.agent === 'bot' && (
                <Avatar className="w-9 h-9 border-2 border-primary/30 shadow-lg shadow-primary/20 flex-shrink-0">
                  <div className="w-full h-full bg-secondary flex items-center justify-center rounded-full">
                    <Icons.bot className="w-5 h-5 text-primary" />
                  </div>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-[90%] md:max-w-[80%] rounded-xl p-3 md:p-4 shadow-md transition-all duration-150',
                  message.agent === 'user'
                    ? 'bg-secondary text-foreground'
                    : 'bg-card border border-border/50'
                )}
              >
                {renderBubbleContent(message)}
              </div>
               {message.agent === 'user' && (
                 <Avatar className="w-9 h-9 flex items-center justify-center rounded-full font-bold flex-shrink-0 bg-secondary text-foreground">
                  VO
                </Avatar>
              )}
            </div>
          ))}
          {isTyping && (
             <div className='flex items-start gap-3 text-sm justify-start'>
                <Avatar className="w-9 h-9 border-2 border-primary/30 shadow-lg shadow-primary/20 flex-shrink-0">
                  <div className="w-full h-full bg-secondary flex items-center justify-center rounded-full">
                    <Icons.bot className="w-5 h-5 text-primary" />
                  </div>
                </Avatar>
                <div className="bg-card border border-border/50 text-muted-foreground rounded-xl p-4 shadow-md">
                    <TypingIndicator />
                </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-border/50 bg-card/70 rounded-b-2xl">
            <div className="relative" suppressHydrationWarning>
                <input
                    suppressHydrationWarning
                    type="text"
                    placeholder="Digite sua mensagem..."
                    className="w-full h-12 bg-secondary border border-border/80 rounded-xl px-4 pr-12 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    disabled
                />
                <button 
                    suppressHydrationWarning
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground/70 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors">
                    <Icons.send className="w-5 h-5" />
                </button>
            </div>
        </div>
    </div>
  );
}
