
'use server';

/**
 * @fileOverview A flow for generating ad creatives using AI.
 *
 * - generateAdCreative - A function that handles the ad generation process.
 * - GenerateAdCreativeInput - The input type for the generateAdCreative function.
 * - GenerateAdCreativeOutput - The return type for the generateAdCreative function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { useCredits } from '../tools/credits';

const GenerateAdCreativeInputSchema = z.object({
  userId: z.string().describe("The user's unique ID."),
  prompt: z.string().describe('A detailed description of the ad creative to generate, including context.'),
});
export type GenerateAdCreativeInput = z.infer<typeof GenerateAdCreativeInputSchema>;
export type GenerateAdCreativeOutput = string;

export async function generateAdCreative(input: GenerateAdCreativeInput): Promise<GenerateAdCreativeOutput> {
  return generateAdCreativeFlow(input);
}

const generateAdCreativeFlow = ai.defineFlow(
  {
    name: 'generateAdCreativeFlow',
    inputSchema: GenerateAdCreativeInputSchema,
    outputSchema: z.string(),
  },
  async ({ userId, prompt }) => {
    await useCredits({ userId, amount: 50 });

    const {media} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `Generate a high-impact, photorealistic digital marketing ad creative based on the following prompt. The image should be clean, professional, and suitable for platforms like Instagram, Facebook, or LinkedIn. Focus on a central, clear subject with a compelling background. Avoid text in the image. Prompt: ${prompt}`,
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
            safetySettings: [
                { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_LOW_AND_ABOVE' },
                { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_LOW_AND_ABOVE' },
                { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_LOW_AND_ABOVE' },
                { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' },
            ],
        },
    });

    if (!media.url) {
        throw new Error('Image generation failed to produce an output.');
    }

    return media.url;
  }
);
