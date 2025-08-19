'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { StepFooter } from "@/components/diagnostico/StepFooter";
import { StepShell, TipCard } from "@/components/diagnostico/StepShell";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { Icons } from "@/components/icons";

const accountFormSchema = z.object({
  name: z.string().min(2, { message: "Seu nome precisa ter pelo menos 2 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(6, { message: "A senha precisa ter pelo menos 6 caracteres." }),
  lgpd: z.boolean().default(false).refine(val => val === true, {
    message: "Você precisa aceitar os Termos de Serviço e a Política de Privacidade.",
  }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export default function ContaPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      lgpd: false,
    },
  });

  const handleSuccessfulLogin = () => {
    toast({
        title: "Conta criada com sucesso!",
        description: "Vamos para o próximo passo.",
    });
    router.push('/diagnostico/empresa');
  }

  async function onSubmit(formData: AccountFormValues) {
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      handleSuccessfulLogin();
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        toast({
          variant: "destructive",
          title: "E-mail já cadastrado",
          description: "Este e-mail já está em uso. Tente fazer login ou use um e-mail diferente.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao criar conta",
          description: "Não foi possível criar sua conta. Tente novamente.",
        });
      }
      console.error("Firebase Auth Error:", error);
    } finally {
        setIsLoading(false);
    }
  }

  const AsideContent = (
    <>
        <div className="sticky top-8">
            <h2 className="text-2xl font-bold">Crie sua Conta</h2>
            <p className="mt-2 text-muted-foreground">
                Comece criando sua conta para que possamos salvar seu progresso e personalizar seu diagnóstico.
            </p>
            <TipCard 
                title="Por que isso importa?"
                tips={[
                    "Garantimos que seu rascunho fique seguro e acessível apenas para você.",
                    "Você poderá retornar e continuar de onde parou a qualquer momento.",
                    "Seus dados são protegidos e usados apenas para gerar seu diagnóstico personalizado.",
                ]}
            />
        </div>
    </>
  );
  
  const Footer = (
     <StepFooter 
        backHref="/diagnostico/inicio"
        isNextDisabled={!form.formState.isValid || isLoading}
     >
        <Button onClick={form.handleSubmit(onSubmit)} disabled={!form.formState.isValid || isLoading} size="lg">
             {isLoading ? <Icons.refresh className="mr-2 h-4 w-4 animate-spin" /> : <Icons.arrowRight className="mr-2 h-4 w-4" />}
            {isLoading ? 'Aguarde...' : 'Avançar'}
        </Button>
     </StepFooter>
  );

  return (
    <StepShell
      title="Primeiro, vamos criar sua conta"
      description="Isso leva menos de 1 minuto e nos ajuda a salvar seu progresso com segurança."
      aside={AsideContent}
      footer={Footer}
    >
        <div className="space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" suppressHydrationWarning>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                        <Input placeholder="Seu nome" {...field} autoComplete="name" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>E-mail Profissional</FormLabel>
                        <FormControl>
                        <Input type="email" placeholder="seu.email@empresa.com" {...field} autoComplete="email" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                        <Input type="password" placeholder="Crie uma senha segura (mínimo 6 caracteres)" {...field} autoComplete="new-password" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lgpd"
                    render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                        <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                        <FormLabel>
                            Aceite dos Termos e Condições
                        </FormLabel>
                        <FormDescription>
                            Ao continuar, você concorda com nossos {" "}
                            <a href="#" className="underline hover:text-primary">Termos de Serviço</a> e {" "}
                            <a href="#" className="underline hover:text-primary">Política de Privacidade</a>.
                        </FormDescription>
                        <FormMessage />
                        </div>
                    </FormItem>
                    )}
                />
                </form>
            </Form>
        </div>
    </StepShell>
  );
}
