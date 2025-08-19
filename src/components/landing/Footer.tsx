import { footerData, navLinks } from "@/lib/data";
import { Icons } from "../icons";
import Link from "next/link";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-secondary border-t">
            <div className="container mx-auto max-w-7xl px-4 py-16">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    <div className="space-y-4">
                        <Link href="#inicio" aria-label="V4SalesAI Home">
                            <Icons.logo className="h-8 w-8" />
                        </Link>
                        <p className="max-w-xs text-muted-foreground">{footerData.tagline}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-8 lg:col-span-2 lg:grid-cols-4">
                        <div>
                            <p className="font-semibold text-foreground">Navegação</p>
                             <ul role="list" className="mt-4 space-y-3">
                                {navLinks.map(link => (
                                     <li key={link.label}>
                                        <a href={link.href} className="text-muted-foreground transition-colors hover:text-foreground">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <p className="font-semibold text-foreground">Legal</p>
                             <ul role="list" className="mt-4 space-y-3">
                                 <li><a href="#" className="text-muted-foreground transition-colors hover:text-foreground">Termos de Serviço</a></li>
                                 <li><a href="#" className="text-muted-foreground transition-colors hover:text-foreground">Política de Privacidade</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-16 border-t pt-8">
                    <p className="text-center text-sm text-muted-foreground">
                        {footerData.copyright.replace('{ano}', currentYear.toString())}
                    </p>
                </div>
            </div>
        </footer>
    );
}
