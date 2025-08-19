import { ecosystemData } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Icons } from "../icons";


export default function Ecosystem() {
    return (
        <section id="ecosistema" className="w-full bg-background">
            <div className="container mx-auto max-w-7xl px-4">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                        Um <span className="text-primary italic">Ecossistema de Vendas</span> Inteligente e Conectado
                    </h2>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                        {ecosystemData.subtitle}
                    </p>
                </div>

                <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8">
                    {ecosystemData.features.map((feature) => {
                         const FeatureIcon = Icons[feature.icon as keyof typeof Icons];
                        return (
                        <Card key={feature.title} className="bg-card shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1">
                           <CardHeader>
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                    <FeatureIcon className="h-6 w-6 text-primary" aria-hidden="true" />
                                </div>
                               <CardTitle className="mt-5 text-xl">{feature.title}</CardTitle>
                           </CardHeader>
                            <CardContent className="pt-0">
                               <CardDescription>{feature.description}</CardDescription>
                            </CardContent>
                        </Card>
                    )})}
                </div>
            </div>
        </section>
    )
}
