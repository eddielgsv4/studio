'use server';

import { supabase } from './auth/supabase';

/**
 * Represents a user's credit wallet.
 */
interface Wallet {
  user_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
}


/**
 * Retrieves a user's wallet.
 * @param userId - The ID of the user.
 * @returns The user's wallet, or null if it doesn't exist.
 */
export async function getWallet(userId: string): Promise<Wallet | null> {
  const { data, error } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error getting wallet:', error);
    throw error;
  }

  return data;
}

/**
 * Debits a specified amount of credits from a user's wallet.
 * Throws a specific error if the user has insufficient credits.
 * @param userId - The ID of the user.
 * @param amount - The amount of credits to debit.
 */
export async function debitCredits(userId: string, amount: number): Promise<void> {
  if (amount <= 0) return;

  const { error } = await supabase.rpc('debit_credits', {
    user_id_param: userId,
    amount_param: amount,
  });

  if (error) {
    console.error(`Credit debit transaction for user ${userId} failed: `, error.message);
    throw error;
  }
}

/**
 * Adds a specified amount of credits to a user's wallet.
 * @param userId - The ID of the user.
 * @param amount - The amount of credits to add.
 */
export async function addCredits(userId: string, amount: number): Promise<void> {
    if (amount <= 0) return;

    const { error } = await supabase.rpc('add_credits', {
        user_id_param: userId,
        amount_param: amount,
    });

    if (error) {
        console.error(`Credit addition transaction for user ${userId} failed: `, error);
        throw error;
    }
}
