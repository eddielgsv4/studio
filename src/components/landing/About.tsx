
import { aboutBullets, aboutData } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Icons } from '../icons';
import Link from 'next/link';
import { Card, CardContent } from '../ui/card';

const CtaBar = () => (
    <div className="mt-20">
        <Card className="bg-card/50 shadow-[0_8px_40px_rgba(0,0,0,.35)] border-border/50">
            <CardContent className="p-6">
                <div className="flex w-full flex-col items-center gap-4 text-center md:flex-row md:justify-between">
                    <p className="text-lg font-medium text-foreground text-balance">
                        {aboutData.cta.text}
                    </p>
                    <Button asChild size="lg" className="flex-shrink-0">
                        <Link href={aboutData.cta.href}>{aboutData.cta.buttonText}</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
);

export default function About() {
  return (
    <section id="o-que-e" className="w-full bg-background">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                O que é o <span className='text-primary italic'>V4SalesAI?</span>
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground text-balance">
                {aboutData.subtitle}
            </p>
            <p className="mt-4 text-base leading-7 text-muted-foreground/80 text-balance">
                {aboutData.paragraph}
            </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-12 lg:max-w-none lg:grid-cols-3">
                {aboutBullets.map((feature) => {
                    const Icon = Icons[feature.icon as keyof typeof Icons];
                    return (
                        <div key={feature.name} className="flex flex-col">
                            <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-foreground">
                                <Icon className="h-6 w-6 flex-none text-primary" aria-hidden="true" />
                                {feature.name}
                            </dt>
                            <dd className="mt-3 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                                <p className="flex-auto text-balance">{feature.description}</p>
                            </dd>
                        </div>
                    );
                })}
            </dl>
        </div>
        <CtaBar />
      </div>
    </section>
  );
}
