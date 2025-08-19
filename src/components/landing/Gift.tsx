import Link from "next/link";
import { Button } from "../ui/button";
import { Icons } from "../icons";

const giftData = {
    title: "Temos um <span class='uppercase font-bold italic text-green-500'>PRESENTE</span> para você iniciar sua <span class='italic font-bold text-white'>Jornada de Evolução Comercial</span>",
    subtitle: "Ao final da sua jornada de diagnóstico, você não apenas entende seus gargalos, mas também ganha as ferramentas para resolvê-los.",
    bullets: [
        {
            icon: "target" as keyof typeof Icons,
            title: "Diagnóstico Completo do Funil",
            description: "Score de cada etapa, benchmarks e análise com IA avançada."
        },
        {
            icon: "bot" as keyof typeof Icons,
            title: "Créditos para o Copiloto",
            description: "Teste todos os recursos do seu agente de IA para otimizar a operação."
        },
        {
            icon: "shield" as keyof typeof Icons,
            title: "100% Gratuito, Sem Riscos",
            description: "Sem cartão de crédito, sem mensalidade. Apenas valor real para o seu negócio."
        }
    ],
    cta: "Receber meu presente agora",
    caption: "Ative agora e receba seu diagnóstico + créditos de presente para começar sua evolução comercial."
}

export default function Gift() {
    return (
        <section id="presente" className="w-full bg-background py-16 md:py-24">
            <div className="container mx-auto max-w-5xl px-4">
                <div className="relative">
                    <div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl">
                         <div className="absolute -inset-20 bg-green-500/25 opacity-75 blur-3xl"></div>
                    </div>
                    <div className="relative rounded-2xl border border-white/20 bg-black/40 p-8 shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-lg md:p-12 lg:p-16">
                         <div className="text-center">
                            <div className="mb-6 flex justify-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                                    <Icons.gift className="h-8 w-8 text-green-500" />
                                </div>
                            </div>
                            <h2 
                                className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
                                dangerouslySetInnerHTML={{ __html: giftData.title }}
                            />
                            <p className="mt-6 max-w-3xl mx-auto text-base leading-7 text-white/80 md:text-lg">
                                {giftData.subtitle}
                            </p>
                        </div>

                        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
                            {giftData.bullets.map((bullet) => {
                                const Icon = Icons[bullet.icon];
                                return (
                                    <div key={bullet.title} className="flex flex-col items-center text-center">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10 mb-4">
                                            <Icon className="h-6 w-6 text-green-500" />
                                        </div>
                                        <h3 className="text-lg font-bold text-white">{bullet.title}</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">{bullet.description}</p>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="mt-12 flex flex-col items-center gap-4">
                            <Button 
                                size="lg" 
                                asChild 
                                className="w-full sm:w-auto bg-green-500 text-white shadow-lg shadow-green-500/20 transition-all duration-150 transform hover:bg-green-600 hover:-translate-y-0.5"
                                data-analytics-id="gift_cta_click"
                            >
                                <Link href="/diagnostico/inicio">{giftData.cta}</Link>
                            </Button>
                            <p className="text-xs text-muted-foreground/70">{giftData.caption}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
