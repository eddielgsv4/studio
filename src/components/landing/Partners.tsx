
import { partnersData } from "@/lib/data";
import Image from "next/image";

const PartnerLogo = ({ name, src, width = 140, height = 50 }: { name: string; src: string; width?: number; height?: number }) => (
    <div 
        className="mx-10 flex-shrink-0 w-40 h-16 flex items-center justify-center transition duration-300"
        data-analytics-id={`partner_logo_${name}`}
    >
        <Image 
          src={src} 
          alt={`${name} logo`}
          width={width}
          height={height}
          className="object-contain"
          unoptimized
        />
    </div>
);


export default function Partners() {
    const duplicatedPartners = [...partnersData.logos, ...partnersData.logos];
    return (
        <section id="parceiros" className="w-full bg-background py-16 md:py-24">
            <div className="container mx-auto max-w-7xl px-4">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
                        Tecnologia <span className="text-primary italic">Validada por Líderes</span> de Mercado
                    </h2>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground text-balance">
                        {partnersData.subtitle}
                    </p>
                </div>

                <div className="relative mt-16">
                    <div className="marquee overflow-x-hidden">
                        <div className="marquee-content flex w-max">
                            {duplicatedPartners.map((logo, index) => (
                                <PartnerLogo key={`${logo.name}-${index}`} {...logo} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
