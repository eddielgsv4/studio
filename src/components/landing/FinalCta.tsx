
import Link from "next/link";
import { Button } from "../ui/button";
import { Icons } from "../icons";

export default function FinalCta() {
    return (
        <section id="cta-final" className="w-full py-16 md:py-24 bg-background">
            <div className="container mx-auto max-w-5xl px-4">
                <div className="rounded-2xl border border-primary/20 bg-card p-10 text-center shadow-[0_8px_60px_rgba(225,29,46,0.15)]">
                    <h2 className="text-4xl font-bold tracking-tight text-foreground text-balance">
                        Pronto para descobrir onde você está <span className="text-primary italic">perdendo dinheiro?</span>
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Receba um diagnóstico completo e um plano de ação para otimizar seu funil de vendas hoje mesmo.
                    </p>
                    <div className="mt-8 flex justify-center">
                        <Button size="lg" asChild data-analytics-id="footer_cta_click">
                            <Link href="/cadastro">
                                Gerar Meu Diagnóstico Gratuito
                                <Icons.arrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
