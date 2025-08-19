"use server";

import {
  aiSalesDiagnosis,
  type AiSalesDiagnosisInput,
  type AiSalesDiagnosisOutput,
} from "@/ai/flows/ai-sales-diagnosis";

export async function runDiagnosis(
  input: AiSalesDiagnosisInput
): Promise<AiSalesDiagnosisOutput | null> {
  try {
    const result = await aiSalesDiagnosis(input);
    return result;
  } catch (error) {
    console.error("Error running AI sales diagnosis:", error);
    throw new Error("Failed to get diagnosis from AI.");
  }
}
