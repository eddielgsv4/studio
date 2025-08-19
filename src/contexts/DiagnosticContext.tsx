"use client";

import type { AiSalesDiagnosisOutput } from "@/ai/flows/ai-sales-diagnosis";
import { runDiagnosis } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface DiagnosticContextType {
  responses: Record<string, string>;
  diagnosis: AiSalesDiagnosisOutput | null;
  isLoading: boolean;
  error: string | null;
  submitDiagnosis: () => Promise<void>;
  currentQuestion: number;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<number>>;
  updateResponse: (questionKey: string, answer: string) => void;
  resetDiagnosis: () => void;
}

const DiagnosticContext = createContext<DiagnosticContextType | undefined>(undefined);

export const DiagnosticProvider = ({ children }: { children: ReactNode }) => {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [diagnosis, setDiagnosis] = useState<AiSalesDiagnosisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { toast } = useToast();

  const updateResponse = useCallback((questionKey: string, answer: string) => {
    setResponses(prev => ({ ...prev, [questionKey]: answer }));
  }, []);

  const submitDiagnosis = async () => {
    setIsLoading(true);
    setError(null);
    setDiagnosis(null);
    try {
      const result = await runDiagnosis({ responses });
      if (result) {
        setDiagnosis(result);
      } else {
        throw new Error("The diagnosis failed to return a result.");
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Diagnosis Failed",
        description: errorMessage,
      });
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetDiagnosis = useCallback(() => {
    setResponses({});
    setDiagnosis(null);
    setError(null);
    setCurrentQuestion(0);
  }, []);

  return (
    <DiagnosticContext.Provider
      value={{
        responses,
        diagnosis,
        isLoading,
        error,
        submitDiagnosis,
        currentQuestion,
        setCurrentQuestion,
        updateResponse,
        resetDiagnosis,
      }}
    >
      {children}
    </DiagnosticContext.Provider>
  );
};

export const useDiagnostic = (): DiagnosticContextType => {
  const context = useContext(DiagnosticContext);
  if (context === undefined) {
    throw new Error("useDiagnostic must be used within a DiagnosticProvider");
  }
  return context;
};
