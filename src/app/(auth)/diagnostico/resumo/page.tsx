
'use client';

import { Button } from "@/components/ui/button";
import { StepFooter } from "@/components/diagnostico/StepFooter";
import { StepShell, TipCard } from "@/components/diagnostico/StepShell";
import { Icons } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useDiagnostic } from "@/contexts/DiagnosticContext";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const SummaryItem = ({ label, value }: { label: string; value: string | undefined | number | string[] }) => {
    const displayValue = Array.isArray(value) && value.length === 0 ? "Não informado" :
                         Array.isArray(value) ? value.join(', ') : 
                         (value === undefined || value === null || value === '' || (typeof value === 'number' && isNaN(value))) ? "Não informado" : value;

    return (
        <div className="flex justify-between py-2 border-b border-border/50 last:border-b-0">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="font-semibold text-foreground text-right">{String(displayValue)}</dd>
        </div>
    )
}

const SummaryCardSkeleton = () => (
    <Card>
        <CardHeader className="flex-row items-center justify-between">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-8 w-16" />
        </CardHeader>
        <CardContent>
            <div className="space-y-4 pt-6">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
            </div>
        </CardContent>
    </Card>
)

export default function ResumoPage() {
    const router = useRouter();
    const { data, updateData, loading } = useDiagnostic();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
  
    const AsideContent = (
    <div className="sticky top-8">
        <h2 className="text-2xl font-bold">Resumo do Diagnóstico</h2>
        <p className="mt-2 text-muted-foreground">
          Revise as informações que você forneceu. Se tudo estiver correto, vamos gerar seu diagnóstico completo e plano de ação.
        </p>
        <TipCard 
            title="Tudo certo?"
            tips={[
                "Verifique se as métricas refletem a realidade da sua operação.",
                "Qualquer informação pode ser ajustada voltando para a etapa correspondente.",
                "A precisão do seu diagnóstico depende da qualidade dos dados que você nos deu.",
            ]}
        />
    </div>
  );

  const handleGenerateClick = async () => {
    setIsSaving(true);
    try {
        await updateData('updatedAt', new Date());
        toast({
            title: "Tudo pronto!",
            description: "Seu diagnóstico foi salvo, agora vamos gerar la análise.",
        });
        router.push('/diagnostico/gerar');
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Erro ao Salvar",
            description: "Não foi possível salvar a versão final do seu diagnóstico. Tente novamente.",
        });
    } finally {
        setIsSaving(false);
    }
  }

  const Footer = (
     <StepFooter 
        backHref="/diagnostico/economia"
     >
        <Button onClick={handleGenerateClick} size="lg" disabled={isSaving || loading} data-analytics-id="diag_finish_click">
            {isSaving ? <Icons.refresh className="mr-2 animate-spin" /> : <Icons.zap className="mr-2" />}
            {isSaving ? 'Salvando...' : 'Gerar meu diagnóstico'}
        </Button>
     </StepFooter>
   );
   
   if (loading) {
       return (
           <StepShell
              title="Confira se está tudo certo"
              description="Este é o resumo dos dados que você informou. Revise com atenção antes de prosseguir."
              aside={AsideContent}
              footer={Footer}
           >
               <div className="space-y-6">
                   <SummaryCardSkeleton />
                   <SummaryCardSkeleton />
                   <SummaryCardSkeleton />
               </div>
           </StepShell>
       )
   }

  return (
    <StepShell
      title="Confira se está tudo certo"
      description="Este é o resumo dos dados que você informou. Revise com atenção antes de prosseguir."
      aside={AsideContent}
      footer={Footer}
    >
        <div className="space-y-6">
            {data.empresa && (
                <Card>
                    <CardHeader className="flex-row items-center justify-between">
                        <CardTitle>Empresa</CardTitle>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/diagnostico/empresa">Editar</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <dl className="space-y-2">
                            <SummaryItem label="Empresa" value={data.empresa?.nomeFantasia} />
                            <SummaryItem label="Segmento" value={data.empresa?.segmento} />
                            <SummaryItem label="Modelo" value={data.empresa?.modelo} />
                        </dl>
                    </CardContent>
                </Card>
            )}
             {data.produto && (
                <Card>
                    <CardHeader className="flex-row items-center justify-between">
                        <CardTitle>Produto e Marketing</CardTitle>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/diagnostico/produto">Editar</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <dl className="space-y-2">
                            <SummaryItem label="Proposta de Valor" value={data.produto?.propostaDeValor} />
                             {data.produto?.materialMarketingUri && (
                                <div className="py-2">
                                    <dt className="text-muted-foreground mb-2">Material de Marketing</dt>
                                    <dd>
                                        <Image src={data.produto.materialMarketingUri} alt="Prévia do material" width={200} height={125} className="rounded-md border" />
                                    </dd>
                                </div>
                             )}
                        </dl>
                    </CardContent>
                </Card>
            )}

             {data.funilData && (
                <Card>
                    <CardHeader className="flex-row items-center justify-between">
                        <CardTitle>Métricas do Funil</CardTitle>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/diagnostico/funil/metricas">Editar</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <dl className="space-y-2">
                            <SummaryItem label="Topo: Visitante → Lead (%)" value={data.funilData.topoVisitanteLead} />
                            <SummaryItem label="Meio: Lead → MQL (%)" value={data.funilData?.meioLeadMQL} />
                            <SummaryItem label="Fundo: Proposta → Fechamento (%)" value={data.funilData?.fundoPropostaFechamento} />
                            <SummaryItem label="Pós: Churn 30d (%)" value={data.funilData?.posChurn30d} />
                        </dl>
                    </CardContent>
                </Card>
             )}

             {data.timeProcesso && (
                <Card>
                    <CardHeader className="flex-row items-center justify-between">
                        <CardTitle>Time e Processos</CardTitle>
                         <Button variant="outline" size="sm" asChild>
                            <Link href="/diagnostico/time-processo">Editar</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <dl className="space-y-2">
                            <SummaryItem label="Tamanho do Time" value={data.timeProcesso?.tamanhoTime} />
                            <SummaryItem label="CRM Utilizado" value={data.timeProcesso?.ferramentaCRM} />
                            <SummaryItem label="Definição de MQL" value={data.timeProcesso?.definicaoMQL} />
                        </dl>
                    </CardContent>
                </Card>
            )}

            {data.economia && (
                <Card>
                    <CardHeader className="flex-row items-center justify-between">
                        <CardTitle>Unidade Econômica</CardTitle>
                         <Button variant="outline" size="sm" asChild>
                            <Link href="/diagnostico/economia">Editar</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <dl className="space-y-2">
                            <SummaryItem label="CAC (R$)" value={data.economia?.cac} />
                            <SummaryItem label="LTV (R$)" value={data.economia?.ltv} />
                        </dl>
                    </CardContent>
                </Card>
            )}
        </div>
    </StepShell>
  );
}
