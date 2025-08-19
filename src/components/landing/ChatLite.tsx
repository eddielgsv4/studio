
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
        );
      }
      switch (message.type) {
        case 'kpi':
          return <KpiBubble {...(message.data as KpiBubbleProps)} />;
        case 'insights':
          return <InsightsBubble {...(message.data as InsightsBubbleProps)} />;
        case 'summary':
          return <SummaryBubble {...(message.data as SummaryBubbleProps)} />;
        default:
          return null;
      }
    };
  
    return (
      <div
        ref={scrollAreaRef}
        className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto p-3"
      >
        {messages.map((message, i) => {
          // Try common fields; fall back gracefully
          const isUser =
            (message as any).role === 'user' ||
            (message as any).author === 'user' ||
            (message as any).from === 'user';
  
          return (
            <div
              key={(message as any).id ?? i}
              className={cn('flex', isUser ? 'justify-end' : 'justify-start')}
            >
              <div
                className={cn(
                  'max-w-[80%] rounded-xl px-3 py-2',
                  isUser
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                )}
              >
                {renderBubbleContent(message)}
              </div>
            </div>
          );
        })}
  
        {isTyping && (
          <div className="flex items-center gap-2">
            <TypingIndicator />
          </div>
        )}
      </div>
    );
  }
  
