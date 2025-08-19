
'use client';

import { useEffect, useState } from 'react';
import ChatLite from './ChatLite';
import { type ChatMessage } from '@/lib/types';
import { Button } from '../ui/button';
import { Icons } from '../icons';
import Link from 'next/link';
import type { KpiBubbleProps, InsightsBubbleProps, SummaryBubbleProps } from './ChatLite';

const copilotMessages: ChatMessage[] = [
    { 
        agent: 'user', 
        text: 'Como estou no topo do funil?' 
    },
    { 
        agent: 'bot',
        type: 'kpi',
        data: {
            title: "Topo (Atração) — visão geral",
            kpis: [
                { label: "CTR Anúncios", value: "1,2%", benchmark: "2,1%", status: 'red' },
                { label: "Visitantes → Leads", value: "1,8%", benchmark: "3,2%", status: 'red' },
                { label: "% Formulário", value: "2,8%", benchmark: "3,5%", status: 'red' },
            ]
        } as KpiBubbleProps
    },
     { 
        agent: 'bot',
        type: 'insights',
        data: {
            title: "O que fazer agora",
            insights: [
                "Ajuste criativos e ofertas; teste variações por público.",
                "Reduza campos do formulário e simplifique a etapa de cadastro."
            ]
        } as InsightsBubbleProps
    },
    { 
        agent: 'user', 
        text: 'E no meio e fundo do funil?' 
    },
    { 
        agent: 'bot', 
        type: 'kpi',
        data: {
            title: "Meio (Qualificação)",
            kpis: [
                { label: "Lead → MQL", value: "33%", benchmark: "31%", status: 'green' },
                { label: "1ª Resposta", value: "19min", benchmark: "< 15min", status: 'amber' },
                { label: "Show Rate", value: "62%", benchmark: "68%", status: 'amber' },
            ]
        } as KpiBubbleProps
    },
     { 
        agent: 'bot',
        type: 'kpi',
        data: {
            title: "Fundo (Conversão)",
            kpis: [
                { label: "MQL → SQL", value: "14%", benchmark: "16%", status: 'amber' },
                { label: "Conversão LP", value: "3,1%", benchmark: "3,5%", status: 'red' },
                { label: "Follow-ups médios", value: "3,2", benchmark: "4,0", status: 'amber' },
            ]
        } as InsightsBubbleProps
    },
    { 
        agent: 'user', 
        text: 'Quais são minhas urgências e oportunidades?' 
    },
    { 
        agent: 'bot', 
        type: 'summary',
        data: {
            title: "Resumo Rápido",
            stats: [
                { label: "Urgências críticas", value: "3", color: "text-primary" },
                { label: "Oportunidades", value: "2", color: "text-green-500" },
                { label: "Ganho potencial", value: "+12%", subtitle: "em até 8 semanas" },
            ],
            actionPlan: {
                title: "Prioridades 14/30/90",
                items: [
                    "**14 dias:** Criativos, formulário, SLA; corrigir fricções de topo.",
                    "**30 dias:** Playbooks de qualificação e follow-ups multicanal.",
                    "**90 dias:** Onboarding, retenção, cross/upsell preditivo."
                ]
            }
        } as SummaryBubbleProps
    },
    { 
        agent: 'user', 
        text: 'Beleza. E como eu gero meu diagnóstico real?' 
    },
    { 
        agent: 'bot', 
        text: `Perfeito! Gere seu relatório real com **benchmarks do seu segmento**, score por etapa e um plano 14/30/90 acionável. É **100% gratuito** e você ainda ganha **créditos para testar o Copiloto**.\n👉 **Clique no botão abaixo para começar.**`
    }
];

export default function Copilot() {
    const [messages, setMessages] = useState<ChatMessage[]>([copilotMessages[0]]);
    const [isTyping, setIsTyping] = useState(false);
    const [key, setKey] = useState(0);

    const runSimulation = () => {
        setMessages([copilotMessages[0]]);
        setIsTyping(true);
        setKey(prev => prev + 1); // Reset child component
        
        // Start simulation from the second message
        let messageIndex = 1;
        
        const addMessage = () => {
            if (messageIndex >= copilotMessages.length) {
                setIsTyping(false);
                return;
            }

            const message = copilotMessages[messageIndex];
            
            if (message.agent === 'bot') {
                setIsTyping(true);
                setTimeout(() => {
                    setMessages(prev => [...prev, message]);
                    setIsTyping(false);
                    messageIndex++;
                    setTimeout(addMessage, 200); 
                }, 900);
            } else {
                // Add user message and then immediately schedule the next bot message
                setMessages(prev => [...prev, message]);
                messageIndex++;
                setTimeout(addMessage, 600);
            }
        };

        // Initial delay to ensure the first message is rendered
        setTimeout(addMessage, 1200);
    }

    useEffect(() => {
        runSimulation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <section id="copiloto" className="w-full bg-secondary py-16 md:py-24">
            <div className="container mx-auto max-w-7xl px-4">
                <div className="mx-auto max-w-4xl text-center mb-12">
                     <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                        A <span className="text-primary italic">Inteligência</span> que Trabalha para <span className="text-primary italic">Você</span>
                    </h2>
                     <p className="mt-6 text-lg leading-8 text-muted-foreground text-balance">
                        Veja na prática como nosso Copiloto analisa seu funil e transforma dados em um plano de ação claro e priorizado.
                    </p>
                </div>
                
                <div className="mx-auto max-w-5xl rounded-2xl border-primary/20 shadow-[0_0_25px_rgba(225,29,46,0.3)]">
                    <ChatLite key={key} messages={messages} isTyping={isTyping} />
                </div>
                
                <div className="mt-12 text-center space-y-4">
                    <Button size="lg" asChild data-analytics-id="sim_cta_click">
                        <Link href="/diagnostico/conta">Gerar meu diagnóstico agora</Link>
                    </Button>
                    <div>
                         <Button variant="link" size="sm" onClick={runSimulation} data-analytics-id="chat_restart_click">
                            <Icons.refresh className="mr-2 h-4 w-4" />
                            Rever a conversa
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
