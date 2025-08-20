
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from 'next/navigation';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { StepFooter } from "@/components/diagnostico/StepFooter";
import { StepShell, TipCard } from "@/components/diagnostico/StepShell";
import { useToast } from "@/hooks/use-toast";
import { useDiagnostic } from "@/contexts/DiagnosticContext";
import { Textarea } from "@/components/ui/textarea";

const funcoesList = [
  { id: "sdr", label: "SDR / Prospecção" },
  { id: "closer", label: "Closer / Vendedor" },
  { id: "cs", label: "Customer Success / Pós-venda" },
  { id: "gerente", label: "Gerente de Vendas" },
  { id: "outro", label: "Outro" },
] as const;

const canaisAtivosList = [
    { id: "email", label: "E-mail" },
    { id: "telefone", label: "Telefone" },
    { id: "whatsapp", label: "WhatsApp" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "presencial", label: "Presencial" },
] as const;

const timeProcessoSchema = z.object({
  tamanhoTime: z.string().min(1, { message: "Informe o tamanho da equipe." }),
  funcoes: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "Selecione pelo menos uma função.",
  }),
  ferramentaCRM: z.string().optional(),
  definicaoMQL: z.string().min(1, { message: "Defina o que é um MQL para sua empresa." }),
  definicaoSQL: z.string().min(1, { message: "Defina o que é um SQL para sua empresa." }),
  processoFollowUp: z.string().min(1, { message: "Descreva seu processo de follow-up." }),
  canaisAtivos: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "Selecione pelo menos um canal ativo.",
  }),
  playbooksExistem: z.enum(["sim", "nao"], {
    required_error: "Selecione uma opção.",
  }),
});

type TimeProcessoValues = z.infer<typeof timeProcessoSchema>;

export default function TimeProcessoPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data, updateData } = useDiagnostic();

  const form = useForm<TimeProcessoValues>({
    resolver: zodResolver(timeProcessoSchema),
    defaultValues: data.timeProcesso || {
        funcoes: [],
        canaisAtivos: [],
    },
  });

  function onSubmit(formData: TimeProcessoValues) {
    updateData('timeProcesso', formData);
    toast({
      title: "Progresso salvo!",
      description: "As informações sobre seu time e processos foram salvas.",
    });
    router.push('/diagnostico/economia');
  }

  const AsideContent = (
    <div className="sticky top-8">
        <h2 className="text-2xl font-bold">Time e Processos</h2>
        <p className="mt-2 text-muted-foreground">
          Processos bem definidos e um time alinhado são a base para um funil escalável. Vamos entender como sua operação está estruturada.
        </p>
        <TipCard 
            title="Por que isso importa?"
            tips={[
                "A estrutura do time impacta a especialização e eficiência em cada etapa do funil.",
                "O uso de um CRM é fundamental para a gestão e otimização dos dados de vendas.",
                "Saber qual CRM você usa nos permite dar sugestões táticas e personalizadas.",
                "Playbooks bem definidos são sinais de uma operação madura e replicável.",
            ]}
        />
    </div>
  );

  return (
    <StepShell
      title="Agora, sobre seu time e processos de vendas"
      description="Estas informações nos ajudam a identificar gargalos operacionais que afetam a performance."
      aside={AsideContent}
      footer={<StepFooter backHref="/diagnostico/funil/metricas" onNextClick={form.handleSubmit(onSubmit)} isNextDisabled={!form.formState.isValid} />}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" suppressHydrationWarning>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="tamanhoTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tamanho do Time Comercial</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ex: 5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="ferramentaCRM"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qual CRM utilizam?</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Pipedrive, HubSpot, etc." {...field} />
                  </FormControl>
                   <FormDescription>Deixe em branco se não usar.</FormDescription>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="funcoes"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base font-semibold">Quais funções existem no time?</FormLabel>
                  <FormDescription>
                    Selecione todas as que se aplicam.
                  </FormDescription>
                </div>
                <div className="space-y-4">
                    {funcoesList.map((item) => (
                    <FormField
                        key={item.id}
                        control={form.control}
                        name="funcoes"
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

            <FormField
                control={form.control}
                name="definicaoMQL"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Definição de MQL (Marketing Qualified Lead)</FormLabel>
                    <FormControl>
                    <Textarea
                        placeholder="Descreva o que qualifica um lead como MQL (ex: preencheu formulário X, visitou a página de preços, etc.)."
                        {...field}
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="definicaoSQL"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Definição de SQL (Sales Qualified Lead)</FormLabel>
                    <FormControl>
                    <Textarea
                        placeholder="Descreva o que qualifica um MQL como SQL (ex: orçamento validado, demonstrou interesse na demo, etc.)."
                        {...field}
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="processoFollowUp"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Processo de Follow-up</FormLabel>
                    <FormControl>
                    <Textarea
                        placeholder="Descreva brevemente seu processo padrão de follow-up para uma oportunidade aberta (ex: 1º dia: e-mail, 3º dia: call, 7º dia: WhatsApp...)."
                        {...field}
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />


           <FormField
            control={form.control}
            name="canaisAtivos"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base font-semibold">Quais canais de contato são mais ativos?</FormLabel>
                   <FormDescription>Selecione os principais usados pela equipe.</FormDescription>
                </div>
                <div className="space-y-4">
                    {canaisAtivosList.map((item) => (
                    <FormField
                        key={item.id}
                        control={form.control}
                        name="canaisAtivos"
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

            <FormField
                control={form.control}
                name="playbooksExistem"
                render={({ field }) => (
                <FormItem className="space-y-3">
                    <FormLabel id="playbooks-label" className="text-base font-semibold">Vocês possuem playbooks de vendas documentados?</FormLabel>
                    <FormControl>
                    <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                        aria-labelledby="playbooks-label"
                    >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                            <RadioGroupItem value="sim" />
                        </FormControl>
                        <FormLabel className="font-normal">Sim, temos e usamos</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                            <RadioGroupItem value="nao" />
                        </FormControl>
                        <FormLabel className="font-normal">Não, ainda não temos</FormLabel>
                        </FormItem>
                    </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </form>
      </Form>
    </StepShell>
  );
}
