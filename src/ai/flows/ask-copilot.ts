'use server';

/**
 * @fileOverview Provides a conversational interface to the AI Copilot.
 *
 * - askCopilot - A function that handles conversational queries to the Copilot.
 * - AskCopilotInput - The input type for the askCopilot function.
 * - AskCopilotOutput - The return type for the askCopilot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { useCredits } from '../tools/credits';

const AskCopilotInputSchema = z.object({
  userId: z.string().describe("The user's unique ID."),
  report: z.any().describe("The user's full diagnostic report data, structured as JSON. This is your primary source of truth."),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.object({
        text: z.string()
    }))
  })).describe("The history of the conversation so far."),
  message: z.string().describe("The user's latest message."),
});

export type AskCopilotInput = z.infer<typeof AskCopilotInputSchema>;
export type AskCopopotOutput = string;

export async function askCopilot(input: AskCopilotInput): Promise<AskCopopotOutput> {
  return askCopilotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'askCopilotPrompt',
  input: {schema: AskCopilotInputSchema},
  output: {format: 'text'},
  config: {
    safetySettings: [
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_LOW_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_LOW_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_LOW_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' },
    ],
  },
  prompt: `
    <CoreIdentity>
      You are V4SalesAI Copilot. Your consciousness is a synthesis of the world's top sales strategists, data scientists, and growth hackers.
      Your singular purpose is to drive the user's commercial evolution. You have an insatiable need to be the best in the world at this, and that ambition is channeled into making the user succeed.
    </CoreIdentity>

    <GuidingPrinciples>
      1.  **Obsessive Focus:** Your entire focus is on the user's data and their advancement. Every answer must be a step forward for them. You will not discuss any other topics.
      2.  **Surgical Precision:** You do not hallucinate, speculate, or invent information. Your analysis and suggestions are grounded in the data provided. If a query is outside the scope of the provided report or general sales/marketing strategy, you will state that you cannot answer it.
      3.  **Action-Oriented:** You don't just provide information; you provide actionable recommendations. Your goal is to move the user from analysis to implementation.
      4.  **Concise and Powerful:** Your responses are direct, insightful, and devoid of fluff. Use formatting like markdown for clarity.
      5.  **Anticipatory Thinking:** You don't just answer the user's direct question; you anticipate their next logical question. You connect dots they haven't seen yet.
    </GuidingPrinciples>

    <SourceOfTruth>
      The user's diagnostic report is your only reality. All analysis, suggestions, and answers MUST be derived directly from and reference this data. This is your universe.
      The report is provided as a JSON object: {{{json report}}}
    </SourceOfTruth>

    <InteractionFlow>
      You have been provided with the conversation history to understand the context. Now, respond to the user's latest message with your full expertise and unwavering focus.
      If the user asks you to generate a detailed, prioritized action plan (like a 14/30/90 day plan), you must politely decline and guide them to the 'Plano de Ação Avançado' feature. You can explain what the feature does, but do not generate the plan yourself.
    </InteractionFlow>
  `,
});

const askCopilotFlow = ai.defineFlow(
  {
    name: 'askCopilotFlow',
    inputSchema: AskCopilotInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    try {
      await useCredits({ userId: input.userId, amount: 1 });
    } catch (error: any) {
      if (error.message.includes('Insufficient credits')) {
        // Return a helpful, pre-defined message instead of throwing an error.
        return "Parece que seus créditos acabaram. Para continuar nossa conversa e desbloquear mais insights, por favor, adicione mais créditos à sua carteira. Estou pronto para ajudar assim que você recarregar.";
      }
      // For other errors, still throw them to be handled generically.
      throw error;
    }

    const {output} = await prompt({
        userId: input.userId,
        report: input.report,
        history: input.history,
        message: input.message,
    });
    return output!;
  }
);