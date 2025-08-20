'use client';

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { StepFooter } from "@/components/diagnostico/StepFooter";
import { StepShell } from "@/components/diagnostico/StepShell";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";

export default function InicioPage() {
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const handleAuthRedirect = () => {
        localStorage.setItem('redirectUrl', pathname);
        router.push('/auth/signin');
    };

    // Content for the aside section (assuming it's consistent)
    const AsideContent = (
        <div className="flex h-full items-center justify-center">
            <Icons.logo className="h-32 w-32 text-primary" />
        </div>
    );
    
    // Content for the footer section
    const Footer = (
     <StepFooter 
        backHref="/"
     >
        <Button size="lg" asChild>
            <Link href="/diagnostico/conta" data-analytics-id="diag_start_click" className="flex items-center whitespace-nowrap">
                Começar o Diagnóstico
                <Icons.arrowRight className="ml-2 h-4 w-4" />
            </Link>
        </Button>
     </StepFooter>
   );


    return (
        <StepShell
            title="Seu Diagnóstico Inteligente Começa Agora"
            description="Vamos mapear seu funil de vendas, comparar com benchmarks do mercado e entregar um plano de ação para você focar no que realmente importa. Esta jornada leva cerca de 5 minutos."
            aside={AsideContent}
            footer={Footer}
        >
             <div className="flex h-[40vh] flex-col items-center justify-center rounded-xl bg-card border text-center p-8">
                <div className="relative mb-6">
                    <div className="absolute -inset-2 rounded-full bg-primary/10 blur-xl"></div>
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-background border">
                        <Icons.logo className="h-12 w-12 text-primary" />
                    </div>
                </div>
                
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Pronto para Começar?
                </h2>
                <p className="mt-4 max-w-2xl text-md leading-8 text-muted-foreground">
                    Clique em "Começar o Diagnóstico" para ir ao primeiro passo: a criação da sua conta.
                </p>
                <p className="mt-4 text-xs text-muted-foreground">É gratuito e não requer cartão de crédito.</p>
            </div>
        </StepShell>
    )
}
