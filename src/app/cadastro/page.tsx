'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Icons } from "@/components/icons";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { DiagnosticProvider } from "@/contexts/DiagnosticContext";

const signupFormSchema = z.object({
  name: z.string().min(2, { message: "Seu nome precisa ter pelo menos 2 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(6, { message: "A senha precisa ter pelo menos 6 caracteres." }),
  confirmPassword: z.string().min(6, { message: "Confirme sua senha." }),
  terms: z.boolean().default(false).refine(val => val === true, {
    message: "Você precisa aceitar os Termos de Serviço e a Política de Privacidade.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupFormSchema>;

export default function CadastroPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading, signUp } = useSupabaseAuth();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const handleSuccessfulSignup = () => {
    toast({
        title: "Conta criada com sucesso!",
        description: "Redirecionando para seus projetos...",
    });
    router.push('/projetos');
  }

  async function onSubmit(formData: SignupFormValues) {
    setIsLoading(true);
    try {
      const { error } = await signUp(formData.email, formData.password, {
        data: { name: formData.name },
      });

      if (error) {
        if (error.message?.includes('already registered') || error.message?.includes('already exists')) {
          toast({
            variant: "destructive",
            title: "E-mail já cadastrado",
            description: "Este e-mail já está em uso. Tente fazer login ou use um e-mail diferente.",
          });
        } else if (error.message?.includes('email confirmation')) {
          toast({
            title: "Confirme seu e-mail",
            description: "Enviamos um link de confirmação para seu e-mail. Verifique sua caixa de entrada.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Erro ao criar conta",
            description: error.message || "Não foi possível criar sua conta. Tente novamente.",
          });
        }
        return;
      }

      // If no error, signup was successful
      // Check if email confirmation is required (this depends on Supabase settings)
      toast({
        title: "Conta criada com sucesso!",
        description: "Verifique seu e-mail para confirmar sua conta e fazer login.",
      });
      router.push('/login?message=check-email');
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao criar conta",
        description: "Não foi possível criar sua conta. Tente novamente.",
      });
      console.error("Supabase Auth Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen bg-background">
            <Icons.refresh className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  if (user) {
    router.push('/projetos');
    return null;
  }

  return (
    <DiagnosticProvider>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">Crie sua Conta Gratuita</h1>
            <p className="mt-2 text-muted-foreground">
              Já tem uma conta? <Link href="/login" className="text-primary hover:underline">Faça seu login</Link>
            </p>
          </div>

          <div className="space-y-6">
            {/* Google Sign In Button */}
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full" 
              disabled
            >
              <Icons.google className="mr-2 h-4 w-4" />
              Continuar com Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted-foreground/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">OU CONTINUE COM E-MAIL</span>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Seu nome" 
                          {...field} 
                          autoComplete="name"
                          className="bg-muted/20"
                        />
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
                        <Input 
                          type="email" 
                          placeholder="seu.email@empresa.com" 
                          {...field} 
                          autoComplete="email"
                          className="bg-muted/20"
                        />
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
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                          autoComplete="new-password"
                          className="bg-muted/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirme sua Senha</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Repita a senha criada" 
                          {...field} 
                          autoComplete="new-password"
                          className="bg-muted/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm">
                          Concordo com os <Link href="#" className="text-primary underline hover:no-underline">Termos</Link> e a <Link href="#" className="text-primary underline hover:no-underline">Política de Privacidade</Link>.
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary/90" 
                  disabled={!form.formState.isValid || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Icons.refresh className="mr-2 h-4 w-4 animate-spin" />
                      Aguarde...
                    </>
                  ) : (
                    'Criar Conta'
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </DiagnosticProvider>
  );
}
