"use server";

import {
  aiSalesDiagnosis,
  type AiSalesDiagnosisInput,
  type AiSalesDiagnosisOutput,
} from "@/ai/flows/ai-sales-diagnosis";
import { generateAdCreative, type GenerateAdCreativeInput } from "@/ai/flows/generate-ad-creative";

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

export async function runGenerateAdCreative(input: GenerateAdCreativeInput): Promise<string> {
    try {
        const result = await generateAdCreative(input);
        return result;
    } catch (error) {
        console.error("Error running generate ad creative:", error);
        throw new Error("Failed to generate ad creative.");
    }
}
