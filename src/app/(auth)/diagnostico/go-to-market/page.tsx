'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from 'next/navigation';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { StepFooter } from "@/components/diagnostico/StepFooter";
import { StepShell, TipCard } from "@/components/diagnostico/StepShell";
import { useToast } from "@/hooks/use-toast";
import { useDiagnostic } from "@/contexts/DiagnosticContext";

const canaisDeAquisicao = [
  { id: "inbound-blog", label: "Marketing de Conteúdo (Blog, SEO)" },
  { id: "inbound-social", label: "Mídia Social Orgânica" },
  { id: "paid-search", label: "Mídia Paga (Google Ads, etc)" },
  { id: "paid-social", label: "Mídia Paga (Social Ads)" },
  { id: "outbound-cold", label: "Outbound (Cold Call, Cold E-mail)" },
  { id: "eventos", label: "Eventos e Webinars" },
  { id: "parcerias", label: "Parcerias e Afiliados" },
  { id: "outro", label: "Outro" },
] as const;


const gtmFormSchema = z.object({
  modeloGTM: z.enum(["sales-led", "product-led", "hibrido"], {
    required_error: "Selecione o principal modelo de vendas.",
  }),
  canais: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "Selecione pelo menos um canal de aquisição.",
  }),
});

type GtmFormValues = z.infer<typeof gtmFormSchema>;

export default function GoToMarketPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data, updateData } = useDiagnostic();

  const form = useForm<GtmFormValues>({
    resolver: zodResolver(gtmFormSchema),
    defaultValues: data.gtm || {
        canais: [],
    },
  });

  function onSubmit(formData: GtmFormValues) {
    updateData('gtm', formData);
    toast({
      title: "Progresso salvo!",
      description: "Sua estratégia de Go-to-Market foi salva.",
    });
    router.push('/diagnostico/funil/metricas');
  }

  const AsideContent = (
    <div className="sticky top-8">
        <h2 className="text-2xl font-bold">Estratégia de Mercado</h2>
        <p className="mt-2 text-muted-foreground">
          Como você vende é tão importante quanto o que você vende. Isso define as métricas que mais importam para seu negócio.
        </p>
        <TipCard 
            title="Por que isso importa?"
            tips={[
                "**Sales-Led Growth (SLG):** Foco em um time de vendas que guia o cliente pela jornada. Comum em vendas complexas e B2B.",
                "**Product-Led Growth (PLG):** O próprio produto é o motor de aquisição, conversão e expansão. Ex: Freemium, Trials.",
                "**Híbrido:** Combina as duas abordagens, usando o produto para qualificar leads para o time de vendas.",
                "A escolha do modelo muda completamente os benchmarks e as ações recomendadas."
            ]}
        />
    </div>
  );

  return (
    <StepShell
      title="Como sua empresa vai ao mercado?"
      description="Sua estratégia de Go-to-Market (GTM) é a peça-chave que conecta seu produto aos seus clientes."
      aside={AsideContent}
      footer={<StepFooter backHref="/diagnostico/produto" onNextClick={form.handleSubmit(onSubmit)} isNextDisabled={!form.formState.isValid} />}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" suppressHydrationWarning>
           <FormField
              control={form.control}
              name="modeloGTM"
              render={({ field }) => (
              <FormItem className="space-y-3">
                  <FormLabel className="text-base font-semibold">Qual seu principal modelo de vendas?</FormLabel>
                  <FormControl>
                  <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-2"
                  >
                      <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent/10 transition-colors">
                          <FormControl><RadioGroupItem value="sales-led" /></FormControl>
                          <div>
                            <FormLabel className="font-semibold">Sales-Led (Guiado por Vendas)</FormLabel>
                            <FormDescription>Nosso time de vendas é o principal motor de receita.</FormDescription>
                          </div>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent/10 transition-colors">
                          <FormControl><RadioGroupItem value="product-led" /></FormControl>
                           <div>
                            <FormLabel className="font-semibold">Product-Led (Guiado pelo Produto)</FormLabel>
                            <FormDescription>Os usuários se cadastram e pagam sozinhos, sem contato comercial.</FormDescription>
                          </div>
                      </FormItem>
                       <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent/10 transition-colors">
                          <FormControl><RadioGroupItem value="hibrido" /></FormControl>
                           <div>
                            <FormLabel className="font-semibold">Híbrido</FormLabel>
                            <FormDescription>Usamos o produto para gerar leads qualificados para vendas.</FormDescription>
                          </div>
                      </FormItem>
                  </RadioGroup>
                  </FormControl>
                  <FormMessage />
              </FormItem>
              )}
          />

          <FormField
            control={form.control}
            name="canais"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base font-semibold">Quais são seus principais canais de aquisição?</FormLabel>
                  <FormDescription>
                    Selecione todos que se aplicam. Isso nos ajuda a entender a origem do seu tráfego.
                  </FormDescription>
                </div>
                <div className="space-y-4">
                    {canaisDeAquisicao.map((item) => (
                    <FormField
                        key={item.id}
                        control={form.control}
                        name="canais"
                        render={({ field }) => {
                        return (
                            <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                            >
                            <FormControl>
                                <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                    const a = field.value || [];
                                    return checked
                                    ? field.onChange([...a, item.id])
                                    : field.onChange(
                                        a?.filter(
                                        (value) => value !== item.id
                                        )
                                    )
                                }}
                                />
                            </FormControl>
                            <FormLabel className="font-normal">
                                {item.label}
                            </FormLabel>
                            </FormItem>
                        )
                        }}
                    />
                    ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </StepShell>
  );
}
