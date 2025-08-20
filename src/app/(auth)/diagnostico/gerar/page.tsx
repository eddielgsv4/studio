
'use client';

import { Icons } from "@/components/icons";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { useDiagnostic } from "@/contexts/DiagnosticContext";
import { funnelDiagnosis, type FunnelDiagnosisInput } from "@/ai/flows/funnel-diagnosis";
import { useToast } from "@/hooks/use-toast";

const generatingSteps = [
    "Analisando seus dados...",
    "Comparando com benchmarks do seu setor...",
    "Identificando seus maiores gargalos...",
    "Calculando o score de cada etapa...",
    "Construindo seu plano de ação priorizado...",
    "Finalizando seu relatório..."
];

export default function GerarPage() {
    const router = useRouter();
    const { data, setReport, currentDiagnosticId, user, loading: contextLoading } = useDiagnostic();
    const [currentStep, setCurrentStep] = useState(0);
    const { toast } = useToast();

     useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep(prev => (prev + 1) % generatingSteps.length);
        }, 2000); // Change text every 2 seconds

        return () => clearInterval(interval);
    }, []);

    const generateReport = useCallback(async () => {
        // Validation Gate: Ensure all critical data is present before proceeding.
        if (!data.empresa || !data.produto || !currentDiagnosticId || !user) {
            toast({
                variant: 'destructive',
                title: 'Dados incompletos',
                description: 'Informações críticas do diagnóstico estão faltando. Redirecionando...',
            });
            router.push('/diagnostico/empresa');
            return;
        }

        // Idempotency check: if a report already exists, don't re-generate.
        if (data.report) {
            toast({
                title: 'Relatório já existe!',
                description: 'Redirecionando para o seu projeto.'
            });
            router.push(`/projeto/${currentDiagnosticId}/home`);
            return;
        }

        const input: FunnelDiagnosisInput = {
            userId: user.uid,
            empresa: {
                propostaDeValor: data.produto.propostaDeValor,
                modeloPricing: data.produto.modeloPricing,
                diferenciais: data.produto.diferenciais,
                segmento: data.empresa.segmento,
                porte: data.empresa.porte,
                modelo: data.empresa.modelo,
            },
            funilData: {
                topoVisitanteLead: Number(data.funilData?.topoVisitanteLead) || undefined,
                topoCTRAnuncios: Number(data.funilData?.topoCTRAnuncios) || undefined,
                topoFormPreenchido: Number(data.funilData?.topoFormPreenchido) || undefined,
                meioLeadMQL: Number(data.funilData?.meioLeadMQL) || undefined,
                meioTempoPrimeiraResposta: Number(data.funilData?.meioTempoPrimeiraResposta) || undefined,
                meioShowRate: Number(data.funilData?.meioShowRate) || undefined,
                fundoMQLSQL: Number(data.funilData?.fundoMQLSQL) || undefined,
                fundoSQLVenda: Number(data.funilData?.fundoSQLVenda) || undefined,
                fundoPropostaFechamento: Number(data.funilData?.fundoPropostaFechamento) || undefined,
                fundoFollowUpsMedios: Number(data.funilData?.fundoFollowUpsMedios) || undefined,
                posRecompra60d: Number(data.funilData?.posRecompra60d) || undefined,
                posChurn30d: Number(data.funilData?.posChurn30d) || undefined,
            },
            funilDataAnterior: data.funilDataAnterior,
            materialMarketingUri: data.produto.materialMarketingUri,
            marketing: data.marketing,
            isFirstDiagnosis: true, // This should be determined by checking previous reports for the user
        };
        
        // Sanitize NaN values that might result from Number() conversion
        Object.keys(input.funilData).forEach(key => {
            const k = key as keyof typeof input.funilData;
            if (isNaN(input.funilData[k]!)) {
                input.funilData[k] = undefined;
            }
        });
        if (input.funilDataAnterior) {
             Object.keys(input.funilDataAnterior).forEach(key => {
                const k = key as keyof typeof input.funilDataAnterior;
                if (isNaN(input.funilDataAnterior[k]!)) {
                    input.funilDataAnterior[k] = undefined;
                }
            });
        }


        try {
            const reportResult = await funnelDiagnosis(input);
            await setReport(reportResult); // setReport now also saves to Firestore
            router.push(`/projeto/${currentDiagnosticId}/home`);
        } catch (error) {
            console.error("Failed to generate report:", error);
            toast({
                variant: "destructive",
                title: "Erro na Análise",
                description: "Não foi possível gerar seu diagnóstico. Verifique sua conexão e tente novamente.",
            });
            // Redirect back to summary, as the "generating" step failed
            router.push('/diagnostico/resumo');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, user, currentDiagnosticId, router, toast]);


    useEffect(() => {
      // Trigger generation only when context is not loading and user is available.
      if (!contextLoading && user) {
        generateReport();
      } else if (!contextLoading && !user) {
          toast({
            variant: "destructive",
            title: "Autenticação necessária",
            description: "Você precisa estar logado para gerar um diagnóstico.",
          });
          router.push('/login');
      }
    }, [contextLoading, user, generateReport, router, toast]);

    return (
        <div className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center p-8 text-center">
            <Icons.logo className="mx-auto h-20 w-20 animate-pulse text-primary" />
            <h1 className="mt-8 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Gerando seu diagnóstico inteligente...
            </h1>
            <p className="mt-4 text-lg text-muted-foreground transition-all duration-300">
                {generatingSteps[currentStep]}
            </p>
            <div className="mt-8">
                <Icons.refresh className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        </div>
    );
}
