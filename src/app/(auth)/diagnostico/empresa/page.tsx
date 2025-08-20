'use client';

import { zodResolver } from "@hookform/resolvers/zod"; 
import { useForm } from "react-hook-form"; 
import { z } from "zod"; 
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button"; 
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"; 
import { Input } from "@/components/ui/input"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { StepFooter } from "@/components/diagnostico/StepFooter"; 
import { StepShell, TipCard } from "@/components/diagnostico/StepShell"; 
import { useToast } from "@/hooks/use-toast"; 
import { useDiagnostic } from "@/contexts/DiagnosticContext"; 
import { useState, useEffect } from "react"; 
import { Icons } from "@/components/icons";
import { useAuth } from "@/contexts/AuthContext";

const companyFormSchema = z.object({ 
    nomeFantasia: z.string().min(2, { message: "O nome da empresa é obrigatório." }), 
    segmento: z.string({ required_error: "Selecione um segmento." }), 
    porte: z.string({ required_error: "Selecione o porte da empresa." }), 
    modelo: z.string({ required_error: "Selecione o modelo de negócio." }), 
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

export default function EmpresaPage() { 
    const router = useRouter(); 
    const { toast } = useToast(); 
    const { data, updateData } = useDiagnostic(); 
    const [isLoading, setIsLoading] = useState(false);
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/signin');
        }
    }, [user, loading, router]);


const form = useForm<CompanyFormValues>({ 
    resolver: zodResolver(companyFormSchema), 
    defaultValues: data.empresa || {}, 
});

async function onSubmit(formData: CompanyFormValues) { 
    setIsLoading(true); 
    try { 
        await updateData('empresa', formData);
        toast({
            title: "Progresso salvo!",
            description: "As informações da sua empresa foram salvas.",
        });
        router.push('/diagnostico/produto');
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Erro ao salvar",
            description: "Não foi possível salvar seu progresso. Tente novamente.",
        });
        console.error("Save Error:", error);
    } finally {
        setIsLoading(false);
    }
}

const AsideContent = ( 
<div className="sticky top-8"> 
    <h2 className="text-2xl font-bold">Sobre sua Empresa</h2> 
    <p className="mt-2 text-muted-foreground"> Assim conseguimos comparar você com empresas do seu porte e segmento. </p> 
    <TipCard title="Por que isso importa?" tips={[ "Seu diagnóstico é comparado com benchmarks de empresas similares.", "Entender seu modelo de negócio nos ajuda a dar recomendações mais precisas.", "As métricas financeiras que pediremos a seguir são cruciais para calcular o impacto das melhorias.", ]} /> 
</div> );

if (loading || !user) {
    return <div>Carregando...</div>;
}

return ( 
<StepShell 
    title="Agora, conte-nos sobre sua empresa" 
    description="Essas informações são fundamentais para gerar um diagnóstico preciso e relevante para o seu contexto." 
    aside={AsideContent} 
    footer={<StepFooter 
                backHref="/diagnostico/conta" 
                onNextClick={form.handleSubmit(onSubmit)} 
                isNextDisabled={!form.formState.isValid || isLoading} 
            > 
            <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading || !form.formState.isValid} size="lg"> 
                {isLoading ? <Icons.refresh className="mr-2 h-4 w-4 animate-spin" /> : <Icons.arrowRight className="mr-2 h-4 w-4" />} 
                {isLoading ? 'Salvando...' : 'Avançar'} 
            </Button> 
        </StepFooter> 
    } 
> 
<Form {...form}> 
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" suppressHydrationWarning> 
        <FormField 
            control={form.control} 
            name="nomeFantasia" 
            render={({ field }) => ( 
            <FormItem> 
                <FormLabel>Nome Fantasia</FormLabel> 
                <FormControl> 
                    <Input placeholder="Nome da sua empresa" {...field} /> 
                </FormControl> 
                <FormMessage /> 
            </FormItem> 
        )} /> 
        <FormField 
            control={form.control} 
            name="segmento" 
            render={({ field }) => ( 
                <FormItem> 
                    <FormLabel>Segmento de Atuação</FormLabel> 
                    <Select onValueChange={field.onChange} defaultValue={field.value}> 
                        <FormControl> 
                            <SelectTrigger> 
                                <SelectValue placeholder="Selecione o segmento" /> 
                            </SelectTrigger> 
                        </FormControl> 
                        <SelectContent> 
                            <SelectItem value="tecnologia">Tecnologia / SaaS</SelectItem> 
                            <SelectItem value="ecommerce">E-commerce / Varejo</SelectItem> 
                            <SelectItem value="servicos">Serviços Profissionais</SelectItem> 
                            <SelectItem value="industria">Indústria / Manufatura</SelectItem> 
                            <SelectItem value="saude">Saúde</SelectItem> 
                            <SelectItem value="educacao">Educação</SelectItem> 
                            <SelectItem value="outro">Outro</SelectItem> 
                        </SelectContent> 
                    </Select> 
                    <FormMessage /> 
                </FormItem> 
            )} 
        /> 
        <FormField 
            control={form.control} 
            name="porte" 
            render={({ field }) => ( 
                <FormItem> 
                    <FormLabel>Porte da Empresa</FormLabel> 
                    <Select onValueChange={field.onChange} defaultValue={field.value}> 
                        <FormControl> 
                            <SelectTrigger> 
                                <SelectValue placeholder="Selecione o porte" /> 
                            </SelectTrigger> 
                        </FormControl> 
                        <SelectContent> 
                            <SelectItem value="startup">Startup (até 20 funcionários / até R$5M/ano)</SelectItem> 
                            <SelectItem value="pequena">Pequena (21-100 funcionários / R$5M - R$20M/ano)</SelectItem> 
                            <SelectItem value="media">Média (101-500 funcionários / R$20M - R$100M/ano)</SelectItem> 
                            <SelectItem value="grande">Grande (acima de 500 funcionários / acima de R$100M/ano)</SelectItem> 
                        </SelectContent> 
                    </Select> 
                    <FormMessage /> 
                </FormItem> 
            )} 
        /> 
        <FormField 
            control={form.control} 
            name="modelo" 
            render={({ field }) => ( 
                <FormItem> 
                    <FormLabel>Modelo de Negócio Principal</FormLabel> 
                    <Select onValueChange={field.onChange} defaultValue={field.value}> 
                        <FormControl> 
                            <SelectTrigger> 
                                <SelectValue placeholder="Selecione o modelo" /> 
                            </SelectTrigger> 
                        </FormControl> 
                        <SelectContent> 
                            <SelectItem value="b2b-saas">B2B - SaaS (Assinatura)</SelectItem> 
                            <SelectItem value="b2b-servicos">B2B - Serviços (Projetos/Consultoria)</SelectItem> 
                            <SelectItem value="b2b-transacional">B2B - Transacional (Venda de produto)</SelectItem> 
                            <SelectItem value="b2c-ecommerce">B2C - E-commerce</SelectItem> 
                            <SelectItem value="b2c-servicos">B2C - Serviços</SelectItem> 
                            <SelectItem value="marketplace">Marketplace</SelectItem> 
                            <SelectItem value="outro">Outro</SelectItem> 
                        </SelectContent> 
                    </Select> 
                    <FormMessage /> 
                </FormItem> 
            )} 
        /> 
    </form> 
</Form> 
</StepShell> 
); 
}