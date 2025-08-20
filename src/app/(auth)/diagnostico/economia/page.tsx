
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from 'next/navigation';
import { Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { StepFooter } from "@/components/diagnostico/StepFooter";
import { StepShell, TipCard } from "@/components/diagnostico/StepShell";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useDiagnostic } from "@/contexts/DiagnosticContext";

const economiaSchema = z.object({
  ticketMedioAnual: z.string().optional(),
  cicloVendasMedio: z.string().optional(),
  cac: z.string().optional(),
  ltv: z.string().optional(),
  margemBruta: z.string().optional(),
  margemContribuicao: z.string().optional(),
});

type EconomiaValues = z.infer<typeof economiaSchema>;

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

export default function EconomiaPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data, updateData } = useDiagnostic();

  const form = useForm<EconomiaValues>({
    resolver: zodResolver(economiaSchema),
    defaultValues: data.economia || {},
  });

  function onSubmit(formData: EconomiaValues) {
    updateData('economia', formData);
    toast({
      title: "Progresso salvo!",
      description: "Suas métricas de unidade econômica foram salvas.",
    });
    router.push('/diagnostico/resumo'); 
  }

  const AsideContent = (
    <div className="sticky top-8">
        <h2 className="text-2xl font-bold">Unidade Econômica</h2>
        <p className="mt-2 text-muted-foreground">
          A relação entre o custo de aquisição e o valor do cliente ao longo do tempo (LTV/CAC) é o que garante um crescimento saudável e sustentável.
        </p>
        <TipCard 
            title="Por que isso importa?"
            tips={[
                "O CAC (Custo de Aquisição por Cliente) mede quanto você investe para trazer um novo cliente.",
                "O LTV (Lifetime Value) projeta a receita total que um cliente gera durante seu ciclo de vida.",
                "A Margem de Contribuição revela o lucro real gerado por cada venda, pagando os custos variáveis.",
                 "Se não souber um valor, pode deixar em branco. A IA usará médias de mercado para o seu segmento."
            ]}
        />
    </div>
  );

  return (
    <StepShell
      title="Métricas de Unidade Econômica"
      description="Informe os dados financeiros que sustentam sua operação. Se não souber um valor, pode pular."
      aside={AsideContent}
      footer={
        <StepFooter 
            backHref="/diagnostico/time-processo"
            onNextClick={form.handleSubmit(onSubmit)}
        />
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" suppressHydrationWarning>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <FormField
              control={form.control}
              name="ticketMedioAnual"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket Médio Anual (R$)</FormLabel>
                   <InputWithTooltip field={field} placeholder="Ex: 12000" tooltipText="Qual a receita média anual gerada por cada cliente?" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cicloVendasMedio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ciclo de Vendas Médio (dias)</FormLabel>
                   <InputWithTooltip field={field} placeholder="Ex: 45" tooltipText="Quantos dias, em média, do primeiro contato até o fechamento da venda?" />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <FormField
              control={form.control}
              name="cac"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custo de Aquisição (CAC) (R$)</FormLabel>
                   <InputWithTooltip field={field} placeholder="Ex: 500" tooltipText="Custo total de marketing e vendas dividido pelo número de novos clientes em um período." />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ltv"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lifetime Value (LTV) (R$)</FormLabel>
                   <InputWithTooltip field={field} placeholder="Ex: 2500" tooltipText="Valor total que um cliente gasta, em média, durante todo o relacionamento com sua empresa." />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <FormField
                control={form.control}
                name="margemBruta"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Margem Bruta (%)</FormLabel>
                     <InputWithTooltip field={field} placeholder="Ex: 70" tooltipText="Percentual de lucro sobre a receita após a dedução dos custos diretos de produção/serviço." />
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
                control={form.control}
                name="margemContribuicao"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Margem de Contribuição (%)</FormLabel>
                     <InputWithTooltip field={field} placeholder="Ex: 40" tooltipText="Percentual da receita que sobra para cobrir os custos fixos após pagar os custos variáveis." />
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
        </form>
      </Form>
    </StepShell>
  );
}
