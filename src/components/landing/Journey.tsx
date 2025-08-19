
import { journeyData } from "@/lib/data"
import { Badge } from "../ui/badge";

export default function Journey() {
    return (
        <section id="jornada" className="w-full bg-secondary">
            <div className="container mx-auto max-w-7xl px-4">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
                        Sua <span className="text-primary italic">Jornada de Evolução</span> Começa Agora
                    </h2>
                     <p className="mt-6 text-lg leading-8 text-muted-foreground text-balance">
                        {journeyData.subtitle}
                    </p>
                </div>

                <div className="relative mx-auto mt-16 max-w-5xl">
                    <div className="absolute hidden lg:block top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2"></div>
                    <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3">
                        {journeyData.steps.map((step, index) => (
                            <div key={index} className="relative flex flex-col items-center text-center">
                                <div className="z-10 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold border-4 border-secondary">
                                    {index + 1}
                                </div>
                                <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
                                <p className="mt-2 text-muted-foreground text-balance">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
