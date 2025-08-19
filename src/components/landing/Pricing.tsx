
import { pricingData } from "@/lib/data";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Icons } from "../icons";
import Link from "next/link";

export default function Pricing() {
    return (
        <section id="payperknow" className="w-full bg-secondary">
            <div className="container mx-auto max-w-7xl px-4">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
                        <span className="text-primary italic">Pay-Per-Know</span>: Pague apenas pelo que usar
                    </h2>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground text-balance">
                        {pricingData.paragraph}
                    </p>
                </div>

                <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
                    {pricingData.steps.map(step => {
                        const StepIcon = Icons[step.icon as keyof typeof Icons];
                        return (
                            <Card key={step.title} className="bg-card text-center shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1">
                                <CardHeader className="items-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                        <StepIcon className="h-8 w-8 text-primary" />
                                    </div>
                                </CardHeader>
                                <CardContent className="px-6 pb-6">
                                    <CardTitle className="text-xl">{step.title}</CardTitle>
                                    <CardDescription className="mt-3 text-balance">{step.description}</CardDescription>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
                    {pricingData.pills.map(pill => (
                        <Badge key={pill} variant="outline" className="text-base px-4 py-2 border-primary/50 text-primary">{pill}</Badge>
                    ))}
                </div>
                
                 <div className="mt-16">
                    <Card className="bg-card/50 shadow-[0_8px_40px_rgba(0,0,0,.35)] border-border/50">
                        <CardContent className="p-6">
                            <div className="flex w-full flex-col items-center gap-4 text-center md:flex-row md:justify-between">
                                <p className="text-lg font-medium text-foreground text-balance">
                                    {pricingData.cta.text}
                                </p>
                                <Button asChild size="lg" className="flex-shrink-0" data-analytics-id="pay_cta_click">
                                    <Link href={pricingData.cta.href}>{pricingData.cta.buttonText}</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
