
'use server';

/**
 * @fileOverview A proactive AI flow that analyzes funnel data to generate a weekly executive summary.
 *
 * - weeklyAnalysis - A function that handles the analysis process.
 * - WeeklyAnalysisInput - The input type for the weeklyAnalysis function.
 * - WeeklyAnalysisOutput - The return type for the weeklyAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { FunnelDiagnosisOutput } from './funnel-diagnosis';
import { useCredits } from '../tools/credits';

// For this simulation, the input is the full report. In a real scenario, 
// this could be raw weekly data, or a current and previous report.
const WeeklyAnalysisInputSchema = z.object({
    userId: z.string(),
    report: z.custom<FunnelDiagnosisOutput>()
});

export type WeeklyAnalysisInput = z.infer<typeof WeeklyAnalysisInputSchema>;

const WeeklyAnalysisOutputSchema = z.object({
  mostCriticalInsight: z.string().describe("The single most important, actionable insight for the user this week. This should be a direct, concise recommendation."),
  kpiAlert: z.object({
    metricName: z.string().describe("The name of the KPI that requires the most urgent attention."),
    change: z.string().describe("A very brief summary of the change (e.g., 'Fell 10%', 'Stagnant', 'Improved slightly')."),
    reason: z.string().describe("A concise explanation for why this KPI is critical right now.")
  }).describe("An alert for the most critical KPI that needs attention."),
});
export type WeeklyAnalysisOutput = z.infer<typeof WeeklyAnalysisOutputSchema>;

export async function weeklyAnalysis(input: WeeklyAnalysisInput): Promise<WeeklyAnalysisOutput> {
  return weeklyAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'weeklyAnalysisPrompt',
  input: {schema: z.custom<FunnelDiagnosisOutput>()},
  output: {schema: WeeklyAnalysisOutputSchema},
  config: {
    safetySettings: [
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_LOW_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_LOW_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_LOW_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' },
    ],
  },
  prompt: `You are a Proactive AI Sales Analyst. Your job is to analyze a user's sales funnel diagnosis and provide a sharp, concise executive summary for their week.

  The user is busy. Do not be conversational. Be direct, insightful, and actionable. Your entire focus is to identify the ONE most critical insight and the ONE most urgent KPI alert.

  This is their full diagnostic report:
  {{{json it}}}

  Based on this data, generate the weekly analysis.
  - For 'mostCriticalInsight', find the single biggest lever or problem. What is the one thing they should think about this week?
  - For 'kpiAlert', identify the metric that, if ignored, will cause the most damage or, if improved, will bring the most benefit. Highlight its status and why it's so important right now.
`,
});

const weeklyAnalysisFlow = ai.defineFlow(
  {
    name: 'weeklyAnalysisFlow',
    inputSchema: WeeklyAnalysisInputSchema,
    outputSchema: WeeklyAnalysisOutputSchema,
  },
  async ({ userId, report }) => {
    try {
      await useCredits({ userId, amount: 100 });
      const {output} = await prompt(report);
      return output!;
    } catch (error) {
      console.error("Error in weeklyAnalysisFlow:", error);
      throw error; // Re-throw the error to be caught by the caller
    }
  }
);
