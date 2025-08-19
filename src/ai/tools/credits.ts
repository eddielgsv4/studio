
'use server';

/**
 * @fileOverview A Genkit tool for managing user credits.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { debitCredits, getWallet } from '@/lib/credits';

const UseCreditsInputSchema = z.object({
    userId: z.string().describe("The user's unique ID."),
    amount: z.number().describe('The amount of credits to use for the operation.'),
});

/**
 * A Genkit tool that debits credits from a user's wallet.
 * It checks for sufficient balance before debiting.
 * Throws an error if the balance is insufficient, which should be caught by the calling flow.
 */
export const useCredits = ai.defineTool(
    {
        name: 'useCredits',
        description: 'Checks for and debits credits from a user wallet for an operation. Fails if the user has an insufficient balance.',
        inputSchema: UseCreditsInputSchema,
        outputSchema: z.void(),
    },
    async ({ userId, amount }) => {
        try {
            await debitCredits(userId, amount);
        } catch (error: any) {
            // Re-throw the original error to be caught by the calling flow.
            // The flow is responsible for interpreting the "Insufficient credits" message.
            throw error;
        }
    }
);
