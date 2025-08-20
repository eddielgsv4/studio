'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import Image from "next/image";
import { UploadCloud, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { StepFooter } from "@/components/diagnostico/StepFooter";
import { StepShell, TipCard } from "@/components/diagnostico/StepShell";
import { useToast } from "@/hooks/use-toast";
import { useDiagnostic } from "@/contexts/DiagnosticContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { runGenerateAdCreative } from "@/app/actions";
import { Input } from "@/components/ui/input";

const productFormSchema = z.object({
  propostaDeValor: z.string().min(10, { message: "A proposta de valor precisa ter pelo menos 10 caracteres." }),
  modeloPricing: z.string({ required_error: "Selecione um modelo de pricing." }),
  diferenciais: z.string().min(10, { message: "Os diferenciais precisam ter pelo menos 10 caracteres." }),
  materialMarketingUri: z.string().optional(),
  adPrompt: z.string().optional(),
  adContext: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export default function ProdutoPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data, updateData, user: diagnosticUser, refreshWallet } from useDiagnostic();
  const { user, loading } from useAuth();
  const [preview, setPreview] = useState<string | null>(data.produto?.materialMarketingUri || null);
  const [isGenerating, setIsGenerating] = useState(false);

  // useEffect(() => {
  //   if (!loading && !user) {
  //       router.push('/auth/signin');
  //   }
  // }, [user, loading, router]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: data.produto || {},
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        form.setValue('materialMarketingUri', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateCreative = async () => {
    const prompt = form.getValues('adPrompt');
    const context = form.getValues('adContext');
    if (!prompt) {
        toast({
            variant: 'destructive',
            title: 'Descrição necessária',
            description: 'Por favor, descreva o anúncio que você deseja criar.',
        });
        return;
    }
    if (!diagnosticUser) {
        toast({
            variant: 'destructive',
            title: 'Erro',
            description: 'Você precisa estar logado para gerar um criativo.',
        });
        return;
    }

    setIsGenerating(true);
    try {
        const fullPrompt = `Descrição: ${prompt}. Contexto adicional: ${context || 'Nenhum'}`;
        const imageUrl = await runGenerateAdCreative({ userId: diagnosticUser.uid, prompt: fullPrompt });
        setPreview(imageUrl);
        form.setValue('materialMarketingUri', imageUrl);
        refreshWallet();
        toast({
            title: 'Criativo gerado com sucesso!',
            description: 'A imagem foi gerada e está pronta para ser analisada. 50 créditos foram debitados.',
        });
    } catch (error: any) {
        console.error("Ad Creative Generation Error:", error);
        let description = 'Não foi possível gerar la imagem. Tente novamente.';
        if (error.message.includes('Insufficient credits')) {
            description = 'Créditos insuficientes para gerar uma imagem.';
        }
        toast({
            variant: 'destructive',
            title: 'Erro ao gerar criativo',
            description: description,
        });
    } finally {
        setIsGenerating(false);
    }
  };

  const removePreview = () => {
    setPreview(null);
    form.setValue('materialMarketingUri', undefined);
  }

  function onSubmit(formData: ProductFormValues) {
    updateData('produto', formData);
    toast({
      title: "Progresso salvo!",
      description: "As informações do seu produto foram salvas.",
    });
    router.push('/diagnostico/go-to-market');
  }

  const AsideContent = (
    <div className="sticky top-8">
        <h2 className="text-2xl font-bold">Sobre seu Produto</h2>
        <p className="mt-2 text-muted-foreground">
          Entender sua proposta de valor e monetização ajuda a calibrar metas e o impacto financeiro do diagnóstico.
        </p>
        <TipCard 
            title="Por que isso importa?"
            tips={[
                "Sua proposta de valor direciona a comunicação e os criativos de marketing.",
                "O modelo de pricing é essencial para calcular o ROI das ações sugeridas.",
                "Seus diferenciais nos ajudam a identificar oportunidades únicas de posicionamento.",
                "**NOVO:** Adicione uma imagem do seu principal material de marketing (anúncio, site, etc) para uma análise de IA ainda mais profunda."
            ]}
        />
    </div>
  );
  
  if (loading || !user) {
    return <div>Carregando...</div>;
  }

  return (
    <StepShell
      title="Fale sobre seu principal produto ou serviço"
      description="Com estas informações, a IA consegue conectar os pontos entre sua oferta e a performance do funil."
      aside={AsideContent}
      footer={<StepFooter backHref="/diagnostico/empresa" onNextClick={form.handleSubmit(onSubmit)} isNextDisabled={!form.formState.isValid || isGenerating} />}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" suppressHydrationWarning>
          <FormField
            control={form.control}
            name="propostaDeValor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proposta Única de Valor (PUV)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ex: Ajudamos empresas B2B a reduzirem o custo de aquisição em 20% com automação de marketing."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="diferenciais"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Principais Diferenciais Competitivos</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ex: Única plataforma com IA generativa para criação de copys, suporte 24/7 em português, e integração nativa com o RD Station."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
            <FormField
              control={form.control}
              name="modeloPricing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo de Precificação (Pricing)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o modelo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="assinatura">Assinatura (Recorrente)</SelectItem>
                      <SelectItem value="pay-per-use">Pay-Per-Use (Baseado em consumo)</SelectItem>
                      <SelectItem value="one-time">One-Time (Licença/Venda única)</SelectItem>
                      <SelectItem value="freemium">Freemium</SelectItem>
                      <SelectItem value="hibrido">Híbrido (Ex: Assinatura + Taxa de Setup)</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Card>
                <CardHeader>
                    <CardTitle>Material de Marketing para Análise</CardTitle>
                    <CardDescription>Adicione um criativo para que nossa IA o analise. Você pode enviar um arquivo ou gerar um novo com IA (custo: 50 créditos).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormItem>
                    <FormLabel>Opção 1: Enviar um arquivo</FormLabel>
                    {preview ? (
                        <div className="relative group w-fit">
                            <Image src={preview} alt="Prévia do material de marketing" width={400} height={250} className="rounded-lg object-contain border border-border" />
                            <Button variant="destructive" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={removePreview}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <FormControl>
                            <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-lg cursor-pointer bg-card hover:bg-secondary transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                                    <p className="mb-1 text-sm text-muted-foreground"><span className="font-semibold">Clique para enviar</span> ou arraste e solte</p>
                                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF ou WebP</p>
                                </div>
                                <input type="file" className="hidden" accept="image/png, image/jpeg, image/gif, image/webp" onChange={handleFileChange} />
                            </label>
                        </FormControl>
                    )}
                    <FormMessage />
                    </FormItem>

                     <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                            Ou
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="adPrompt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Opção 2: Gerar um criativo com IA</FormLabel>
                                    <FormControl>
                                    <Textarea
                                        placeholder="Descreva a imagem que você quer criar. Ex: Um close-up de um tênis de corrida futurista em um fundo de neon, com foco na tecnologia da sola."
                                        {...field}
                                        rows={3}
                                    />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="adContext"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contexto Adicional (Opcional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Público-alvo são corredores de maratona; a campanha é para o Instagram." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Forneça contexto para ajudar a IA a gerar uma imagem e, futuramente, uma copy mais eficaz.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                     <Button type="button" variant="secondary" onClick={handleGenerateCreative} disabled={isGenerating}>
                        <Icons.sparkles className={isGenerating ? "mr-2 animate-spin" : "mr-2"} />
                        {isGenerating ? 'Gerando...' : 'Gerar Criativo com IA'}
                    </Button>
                </CardContent>
            </Card>
        </form>
      </Form>
    </StepShell>
  );
}
