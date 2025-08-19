import { diagnosisData } from "@/lib/data"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Icons } from "../icons"
import StatBar from "./StatBar"
import Link from "next/link"

const TipCard = ({ tips }: { tips: string[] }) => (
    <div className="mt-6 rounded-lg bg-secondary p-4">
        <h4 className="flex items-center text-sm font-semibold text-foreground">
            <Icons.bot className="mr-2 h-5 w-5 flex-none text-primary" />
            Copiloto Sugere
        </h4>
        <ul className="mt-3 space-y-2 pl-1 text-sm text-muted-foreground">
            {tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                    <Icons.chevronRight className="mr-2 mt-1 h-3 w-3 flex-shrink-0 text-primary" />
                    <span>{tip}</span>
                </li>
            ))}
        </ul>
    </div>
);


export default function DiagnosisSection() {
    return (
        <section id="diagnostico" className="w-full bg-background">
            <div className="container mx-auto max-w-7xl px-4">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                        Entenda Seu <span className="text-primary italic">Funil de Vendas</span> de Ponta a Ponta
                    </h2>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                        Visualize a saúde da sua operação comercial em cada etapa, comparada com <span className="font-semibold text-foreground">benchmarks reais</span> do seu setor, e receba um plano de ação claro.
                    </p>
                </div>

                <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {diagnosisData.stages.map((stage) => {
                        const StageIcon = Icons[stage.icon as keyof typeof Icons];
                        return (
                            <Card key={stage.title} className="flex flex-col bg-card shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1">
                                <CardHeader>
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                            <StageIcon className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl">{stage.title}</CardTitle>
                                            <CardDescription className="text-sm">{stage.description}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex flex-1 flex-col justify-between pt-0">
                                    <div className="space-y-4">
                                        {stage.metrics.map(metric => (
                                            <StatBar key={metric.label} {...metric} />
                                        ))}
                                    </div>
                                    <TipCard tips={stage.tips} />
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                <div className="mt-20 text-center">
                    <Button size="lg" asChild data-analytics-id="diag_cta_click">
                        <Link href="/diagnostico/conta">
                            Quero Meu Diagnóstico com IA AGORA!
                            <Icons.arrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
