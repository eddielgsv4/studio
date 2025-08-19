
import { heroData } from '@/lib/data';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Icons } from '../icons';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
    return (
        <section id="inicio" className="relative w-full bg-background pt-12 md:pt-16 pb-12">
             <div
                aria-hidden="true"
                className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-20"
            >
                <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-black"></div>
                <div className="blur-[106px] h-32 bg-gradient-to-r from-primary/50 to-black"></div>
            </div>
            <div className="container relative mx-auto max-w-7xl px-4">
                <div className="mx-auto max-w-4xl text-center">
                    <Badge variant="outline" className="px-4 py-2 text-sm border-primary/20 bg-primary/10 text-primary shadow-sm">
                        {heroData.pill}
                    </Badge>
                    <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl text-balance">
                        {heroData.titlePart1} <span className="text-primary italic font-bold">{heroData.titleHighlight}</span>
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground text-balance">
                        {heroData.subtitle}
                    </p>
                    
                    <div className="mt-10 flex flex-col items-center gap-x-6 gap-y-4 sm:flex-row sm:justify-center">
                         <Button size="lg" asChild className="shadow-lg shadow-primary/20">
                            <Link href={heroData.ctaPrimary.href} data-analytics-id={heroData.ctaPrimary.analyticsId}>
                                {heroData.ctaPrimary.text}
                            </Link>
                        </Button>
                    </div>
                    
                    <div className="mt-12 flex flex-col items-center sm:items-start gap-y-5 sm:flex-row sm:justify-center sm:gap-x-12">
                        {heroData.bullets.map((bullet) => {
                            const Icon = Icons[bullet.icon as keyof typeof Icons];
                            return (
                            <div key={bullet.text} className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                                    <Icon className="h-5 w-5 text-primary" />
                                </div>
                                <span className="text-base font-medium text-foreground">{bullet.text}</span>
                            </div>
                        )})}
                    </div>
                </div>
            </div>
        </section>
    );
}
