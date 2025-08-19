
import type { FunnelDiagnosisOutput } from "@/ai/flows/funnel-diagnosis";

export interface DiagnosisMetric {
    label: string;
    value: number;
    marketValue: number;
    status: 'green' | 'amber' | 'red';
}

export interface DiagnosisStage {
    icon: string;
    title: string;
    description: string;
    metrics: DiagnosisMetric[];
    tips: string[];
}

export interface ChatMessage {
    agent: 'user' | 'bot';
    text?: string;
    type?: 'kpi' | 'insights' | 'summary';
    data?: unknown;
}

// This type was corrected to accurately reflect the data structure from the AI flow.
export type FunnelStageResult = {
    name: string;
    status: string;
    analysis: string;
    suggestedActions: string[];
};
