'use server';

/**
 * @fileOverview A flow for generating a detailed, prioritized action plan from a diagnosis.
 *
 * - advancedActionPlan - A function that generates the plan.
 * - AdvancedActionPlanInput - The input type for the function.
 * - AdvancedActionPlanOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { useCredits } from '../tools/credits';
import type { FunnelDiagnosisOutput } from './funnel-diagnosis';

const AdvancedActionPlanInputSchema = z.object({
  userId: z.string().describe("The user's unique ID."),
  diagnosis: z.custom<FunnelDiagnosisOutput>().describe("The full diagnostic report to analyze."),
});
export type AdvancedActionPlanInput = z.infer<typeof AdvancedActionPlanInputSchema>;

const AdvancedActionPlanOutputSchema = z.object({
    topoDeFunil: z.array(z.string()).describe("Detailed, prioritized actions for the Top of the Funnel, following a 14/30/90 day structure."),
    meioDeFunil: z.array(z.string()).describe("Detailed, prioritized actions for the Middle of the Funnel, following a 14/30/90 day structure."),
    fundoDeFunil: z.array(z.string()).describe("Detailed, prioritized actions for the Bottom of the Funnel, following a 14/30/90 day structure."),
    posConversao: z.array(z.string()).describe("Detailed, prioritized actions for Post-Conversion, following a 14/30/90 day structure."),
});
export type AdvancedActionPlanOutput = z.infer<typeof AdvancedActionPlanOutputSchema>;

export async function advancedActionPlan(input: AdvancedActionPlanInput): Promise<AdvancedActionPlanOutput> {
  return advancedActionPlanFlow(input);
}

const prompt = ai.definePrompt({
    name: 'advancedActionPlanPrompt',
    input: {schema: z.custom<FunnelDiagnosisOutput>()},
    output: {schema: AdvancedActionPlanOutputSchema},
    config: {
        safetySettings: [
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_LOW_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_LOW_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_LOW_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' },
        ],
    },
    prompt: `
        You are a world-class business strategist and project manager. Your task is to convert a high-level sales funnel diagnosis into a concrete, prioritized, and actionable 14/30/90 day plan.

        You have been given a full diagnostic report. Your output MUST be a structured action plan.
        For each stage of the funnel (Topo, Meio, Fundo, Pós-Conversão), analyze the suggested actions and transform them into specific, detailed tasks.

        **Core Instructions:**
        1.  **Prioritize by Impact:** For each funnel stage, identify the actions that will have the most significant impact on the key metrics. The status ('red', 'amber') is a primary indicator of where the highest impact lies. Red items are top priority.
        2.  **Estimate Effort:** For each action, implicitly consider the effort (e.g., is it a simple copy change or a complex integration?).
        3.  **Create a 14/30/90 Day Structure:** Group the prioritized actions into three timeframes:
            *   **14 Dias (Quick Wins):** Low-effort, high-impact tasks. Things that can be done immediately to stop "bleeding" or capture immediate opportunities.
            *   **30 Dias (Strategic Improvements):** Tasks that require more planning or resources but will create significant improvements.
            *   **90 Dias (Foundational Projects):** Larger, more complex initiatives that will build long-term, sustainable growth.
        4.  **Be Specific and Actionable:** Do not just repeat the suggestions. Expand on them. For example, if a suggestion is "Otimizar copy do anúncio", your action could be "14 Dias: A/B Testar 3 novas headlines focadas em [benefício principal] para a campanha [nome da campanha]".

        **Input Diagnosis:**
        {{{json it}}}

        Now, generate the detailed, structured, and prioritized action plan based on these instructions. For each funnel stage, provide a list of strings, where each string is a specific task prefixed with its timeframe (e.g., "14 Dias: [Ação]").
    `,
});


const advancedActionPlanFlow = ai.defineFlow(
  {
    name: 'advancedActionPlanFlow',
    inputSchema: AdvancedActionPlanInputSchema,
    outputSchema: AdvancedActionPlanOutputSchema,
  },
  async ({ userId, diagnosis }) => {
    await useCredits({ userId, amount: 100 });

    const {output} = await prompt(diagnosis);
    return output!;
  }
);