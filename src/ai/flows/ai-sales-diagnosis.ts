'use server';

/**
 * @fileOverview This file defines a Genkit flow for diagnosing sales bottlenecks and opportunities based on user responses.
 *
 * - `aiSalesDiagnosis` - A function that takes user responses as input and returns a sales diagnosis.
 * - `AiSalesDiagnosisInput` - The input type for the `aiSalesDiagnosis` function.
 * - `AiSalesDiagnosisOutput` - The return type for the `aiSalesDiagnosis` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiSalesDiagnosisInputSchema = z.object({
  responses: z.record(z.string(), z.string()).describe('A record of user responses to diagnostic questions.'),
});
export type AiSalesDiagnosisInput = z.infer<typeof AiSalesDiagnosisInputSchema>;

const AiSalesDiagnosisOutputSchema = z.object({
  diagnosis: z.string().describe('A comprehensive diagnosis of sales bottlenecks and opportunities.'),
  recommendations: z.string().describe('Actionable recommendations to improve sales performance.'),
});
export type AiSalesDiagnosisOutput = z.infer<typeof AiSalesDiagnosisOutputSchema>;

export async function aiSalesDiagnosis(input: AiSalesDiagnosisInput): Promise<AiSalesDiagnosisOutput> {
  return aiSalesDiagnosisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSalesDiagnosisPrompt',
  input: {schema: AiSalesDiagnosisInputSchema},
  output: {schema: AiSalesDiagnosisOutputSchema},
  prompt: `You are an AI sales expert. Analyze the following user responses to identify sales bottlenecks and opportunities, and provide actionable recommendations.

Responses:
{{#each responses}}
  {{@key}}: {{{this}}}
{{/each}}

Diagnosis (summarize bottlenecks and opportunities):

Recommendations:
`,
});

const aiSalesDiagnosisFlow = ai.defineFlow(
  {
    name: 'aiSalesDiagnosisFlow',
    inputSchema: AiSalesDiagnosisInputSchema,
    outputSchema: AiSalesDiagnosisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
