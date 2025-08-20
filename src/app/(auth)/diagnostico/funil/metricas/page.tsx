'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from 'next/navigation';
import { Info } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { StepFooter } from "@/components/diagnostico/StepFooter";
import { StepShell, TipCard } from "@/components/diagnostico/StepShell";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useDiagnostic } from "@/contexts/DiagnosticContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const funnelSchema = z.object({
  // Topo
  topoVisitanteLead: z.string().optional(),
  topoCTRAnuncios: z.string().optional(),
  topoFormPreenchido: z.string().optional(),
  // Meio
  meioLeadMQL: z.string().optional(),
  meioTempoPrimeiraResposta: z.string().optional(),
  meioShowRate: z.string().optional(),
  // Fundo
  fundoMQLSQL: z.string().optional(),
  fundoSQLVenda: z.string().optional(),
  fundoPropostaFechamento: z.string().optional(),
  fundoFollowUpsMedios: z.string().optional(),
  // Pós
  posRecompra60d: z.string().optional(),
  posChurn30d: z.string().optional(),
});

type FunnelValues = z.infer<typeof funnelSchema>;

const InputWithTooltip = ({ field, placeholder, tooltipText }: { field: any; placeholder: string; tooltipText: string; }) => (
    <div className="relative">
      <FormControl>
        <Input type="number" placeholder={placeholder} {...field} className="pr-10"/>
      </FormControl>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                    <p>{tooltipText}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );

export default function MetricasFunilPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data, updateData } = useDiagnostic();

  const form = useForm<FunnelValues>({
    resolver: zodResolver(funnelSchema),
    defaultValues: data.funilData || {},
  });

  function onSubmit(formData: FunnelValues) {
    // We save all funnel data under a single key now
    updateData('funilData', formData);

    toast({
      title: "Progresso salvo!",
      description: "Suas métricas de funil foram salvas.",
    });
    router.push('/diagnostico/time-processo');
  }

  const AsideContent = (
    <div className="sticky top-8">
        <h2 className="text-2xl font-bold">Métricas do Funil</h2>
        <p className="mt-2 text-muted-foreground">
          Informe os principais indicadores de cada etapa do seu funil de vendas. Isso nos permite identificar seus maiores gargalos e oportunidades.
        </p>
        <TipCard 
            title="Por que isso importa?"
            tips={[
                "Cada métrica conta uma parte da história da sua eficiência em vendas.",
                "Compararemos seus números com benchmarks do seu setor para dar um diagnóstico preciso.",
                "Se não souber um valor, pode deixar em branco. A IA usará médias de mercado para o seu segmento.",
                "A precisão do diagnóstico depende da qualidade dos dados que você nos fornece."
            ]}
        />
    </div>
  );

  return (
    <StepShell
      title="Métricas do seu Funil de Vendas"
      description="Informe os dados de performance de cada etapa. Se não souber um valor, pode pular."
      aside={AsideContent}
      footer={<StepFooter backHref="/diagnostico/go-to-market" onNextClick={form.handleSubmit(onSubmit)} />}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" suppressHydrationWarning>
            <Card>
                <CardHeader><CardTitle>Topo de Funil: Atração</CardTitle></CardHeader>
                <CardContent className="space-y-8">
                    <FormField
                        control={form.control}
                        name="topoVisitanteLead"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Conversão Visitante → Lead (%)</FormLabel>
                                <InputWithTooltip field={field} placeholder="Ex: 5" tooltipText="Qual o percentual de visitantes do seu site que se tornam leads? (Leads / Visitantes) * 100" />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="topoCTRAnuncios"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>CTR Médio dos Anúncios (%)</FormLabel>
                                <InputWithTooltip field={field} placeholder="Ex: 2.5" tooltipText="Taxa de cliques (Cliques ÷ Impressões) média de suas campanhas pagas." />
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="topoFormPreenchido"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Preenchimento de Formulário (%)</FormLabel>
                                <InputWithTooltip field={field} placeholder="Ex: 40" tooltipText="Das pessoas que iniciam, qual o percentual que completa o preenchimento do seu principal formulário de captura?" />
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Meio de Funil: Qualificação</CardTitle></CardHeader>
                <CardContent className="space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                        control={form.control}
                        name="meioLeadMQL"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Conversão Lead → MQL (%)</FormLabel>
                            <InputWithTooltip field={field} placeholder="Ex: 25" tooltipText="Do total de leads gerados, qual o percentual se torna um Lead Qualificado pelo Marketing (MQL)?" />
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="meioTempoPrimeiraResposta"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Tempo 1ª Resposta (minutos)</FormLabel>
                            <InputWithTooltip field={field} placeholder="Ex: 15" tooltipText="Em média, quanto tempo (em minutos) seu time leva para fazer o primeiro contato com um novo lead?" />
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="meioShowRate"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Show Rate / Comparecimento (%)</FormLabel>
                                <InputWithTooltip field={field} placeholder="Ex: 60" tooltipText="Das reuniões agendadas, qual o percentual de comparecimento real?" />
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Fundo de Funil: Conversão</CardTitle></CardHeader>
                <CardContent className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                        control={form.control}
                        name="fundoMQLSQL"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>MQL → SQL (%)</FormLabel>
                            <InputWithTooltip field={field} placeholder="Ex: 75" tooltipText="Dos MQLs, qual o percentual se torna uma Oportunidade Qualificada por Vendas?" />
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                         <FormField
                        control={form.control}
                        name="fundoSQLVenda"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>SQL → Venda (%)</FormLabel>
                            <InputWithTooltip field={field} placeholder="Ex: 30" tooltipText="Das oportunidades (SQLs), qual o percentual se torna cliente?" />
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                        control={form.control}
                        name="fundoPropostaFechamento"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Proposta → Fechamento (%)</FormLabel>
                            <InputWithTooltip field={field} placeholder="Ex: 25" tooltipText="Das propostas comerciais enviadas, qual o percentual é ganho?" />
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                            control={form.control}
                            name="fundoFollowUpsMedios"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Follow-ups Médios</FormLabel>
                                <InputWithTooltip field={field} placeholder="Ex: 4" tooltipText="Em média, quantos contatos (follow-ups) são feitos por oportunidade até a decisão final?" />
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Pós-Conversão: Retenção</CardTitle></CardHeader>
                <CardContent className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                        control={form.control}
                        name="posRecompra60d"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Recompra em 60 dias (%)</FormLabel>
                            <InputWithTooltip field={field} placeholder="Ex: 15" tooltipText="Qual o percentual de clientes que realiza uma segunda compra em até 60 dias?" />
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="posChurn30d"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Churn em 30 dias (%)</FormLabel>
                            <InputWithTooltip field={field} placeholder="Ex: 5" tooltipText="Qual o percentual da sua base de clientes que cancela o serviço mensalmente?" />
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                </CardContent>
            </Card>
        </form>
      </Form>
    </StepShell>
  );
}
