'use server';

/**
 * @fileOverview AI-powered sales insights generator.
 *
 * - generateSalesInsights - A function that generates tailored sales insights based on user input.
 * - GenerateSalesInsightsInput - The input type for the generateSalesInsights function.
 * - GenerateSalesInsightsOutput - The return type for the generateSalesInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSalesInsightsInputSchema = z.object({
  salesData: z.string().describe('Sales data in JSON format.'),
  marketTrends: z.string().describe('Market trends data in JSON format.'),
  customerFeedback: z.string().describe('Customer feedback data in JSON format.'),
});
export type GenerateSalesInsightsInput = z.infer<typeof GenerateSalesInsightsInputSchema>;

const GenerateSalesInsightsOutputSchema = z.object({
  summary: z.string().describe('A summary of the sales insights.'),
  keyAreas: z.array(z.string()).describe('Key areas for improvement.'),
  recommendations: z.array(z.string()).describe('Specific recommendations to optimize sales strategies.'),
});
export type GenerateSalesInsightsOutput = z.infer<typeof GenerateSalesInsightsOutputSchema>;

export async function generateSalesInsights(input: GenerateSalesInsightsInput): Promise<GenerateSalesInsightsOutput> {
  return generateSalesInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSalesInsightsPrompt',
  input: {schema: GenerateSalesInsightsInputSchema},
  output: {schema: GenerateSalesInsightsOutputSchema},
  prompt: `You are an AI-powered sales insights generator. Analyze the following data to provide actionable insights and recommendations.

Sales Data: {{{salesData}}}
Market Trends: {{{marketTrends}}}
Customer Feedback: {{{customerFeedback}}}

Based on this information, provide a concise summary of the sales insights, identify key areas for improvement, and offer specific recommendations to optimize sales strategies.`, 
});

const generateSalesInsightsFlow = ai.defineFlow(
  {
    name: 'generateSalesInsightsFlow',
    inputSchema: GenerateSalesInsightsInputSchema,
    outputSchema: GenerateSalesInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
