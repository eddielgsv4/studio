
'use server';

import { db } from './auth/firebase';
import { doc, getDoc, setDoc, runTransaction, writeBatch, type WriteBatch } from 'firebase/firestore';

/**
 * Represents a user's credit wallet.
 */
interface Wallet {
  balance: number;
}


/**
 * Retrieves a user's wallet.
 * @param userId - The ID of the user.
 * @returns The user's wallet, or null if it doesn't exist.
 */
export async function getWallet(userId: string): Promise<Wallet | null> {
  const walletRef = doc(db, 'wallets', userId);
  const walletSnap = await getDoc(walletRef);

  if (walletSnap.exists()) {
    return walletSnap.data() as Wallet;
  }
  return null;
}

/**
 * Debits a specified amount of credits from a user's wallet.
 * Throws a specific error if the user has insufficient credits.
 * @param userId - The ID of the user.
 * @param amount - The amount of credits to debit.
 */
export async function debitCredits(userId: string, amount: number): Promise<void> {
  if (amount <= 0) return;

  const walletRef = doc(db, 'wallets', userId);

  try {
    await runTransaction(db, async (transaction) => {
      const walletDoc = await transaction.get(walletRef);
      if (!walletDoc.exists()) {
        // This is a system-level error, not a user balance issue.
        throw new Error('User wallet does not exist. Cannot debit credits.');
      }

      const currentBalance = walletDoc.data().balance;
      if (currentBalance < amount) {
        // Throw a specific, predictable error for insufficient balance.
        throw new Error('Insufficient credits.');
      }

      const newBalance = currentBalance - amount;
      transaction.update(walletRef, { balance: newBalance, updatedAt: new Date() });
    });
  } catch (error: any) {
    // Log the original error for debugging, but re-throw it to be handled by the caller.
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

    const walletRef = doc(db, 'wallets', userId);

    try {
        await runTransaction(db, async (transaction) => {
            const walletDoc = await transaction.get(walletRef);
            if (!walletDoc.exists()) {
                // If wallet doesn't exist, create it with the added amount.
                // This is a fallback, standard flow should create wallet on user creation.
                transaction.set(walletRef, { balance: amount, createdAt: new Date(), updatedAt: new Date() });
            } else {
                const newBalance = walletDoc.data().balance + amount;
                transaction.update(walletRef, { balance: newBalance, updatedAt: new Date() });
            }
        });
    } catch (error) {
        console.error(`Credit addition transaction for user ${userId} failed: `, error);
        throw error;
    }
}
