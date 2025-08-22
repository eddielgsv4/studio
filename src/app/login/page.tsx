'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Icons } from "@/components/icons";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { DiagnosticProvider } from "@/contexts/DiagnosticContext";
import { getAuthErrorMessage } from "@/lib/auth/supabase-auth";

const loginFormSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(1, { message: "Por favor, insira sua senha." }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading, signIn } = useSupabaseAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSuccessfulLogin = () => {
    toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para seus projetos...",
    });
    router.push('/projetos');
  }

  async function onSubmit(formData: LoginFormValues) {
    setIsLoading(true);
    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        const errorMessage = getAuthErrorMessage(error);
        toast({
          variant: "destructive",
          title: "Erro ao fazer login",
          description: errorMessage,
        });
        console.error("Supabase Auth Error:", error);
      } else {
        handleSuccessfulLogin();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Ocorreu um erro inesperado. Tente novamente.",
      });
      console.error("Unexpected error:", error);
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
            <h1 className="text-3xl font-bold text-foreground">Faça seu Login</h1>
            <p className="mt-2 text-muted-foreground">
              Não tem uma conta? <Link href="/cadastro" className="text-primary hover:underline">Crie sua conta gratuita</Link>
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
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
                          autoComplete="current-password"
                          className="bg-muted/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="text-right">
                  <Link href="#" className="text-sm text-primary hover:underline">
                    Esqueceu sua senha?
                  </Link>
                </div>

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
                    'Entrar'
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
