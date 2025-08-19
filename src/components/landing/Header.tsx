
'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { navLinks } from '@/lib/data';
import { Button } from '../ui/button';
import { Icons } from '../icons';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '../ui/sheet';
import Link from 'next/link';
import { useDiagnostic } from '@/contexts/DiagnosticContext';

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const context = useDiagnostic();

    useEffect(() => {
        setIsMounted(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith('#')) {
            e.preventDefault();
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
        setIsMobileMenuOpen(false);
    };

    const renderPlaceholderHeader = () => (
         <header className="sticky top-0 z-50 w-full bg-transparent">
             <div className="mx-auto max-w-7xl px-4 md:px-6">
                <div className="flex h-20 items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <Icons.logo className="h-8 w-8" />
                        <span className="font-bold text-lg">V4SalesAI</span>
                    </Link>
                    <div className="flex items-center md:hidden">
                        <Button variant="ghost" size="icon">
                            <Icons.menu className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );

    if (!isMounted) {
        return renderPlaceholderHeader();
    }

    const user = null; 
    const isAdmin = false;

    const renderAuthButtons = () => {
        return user ? (
            <Button asChild>
                <Link href="/dashboard">Meu Dashboard</Link>
            </Button>
        ) : (
            <>
                <Button asChild variant="outline">
                <Link href="/auth/signin">Login</Link>
                </Button>
                <Button asChild>
                    <Link href="/diagnostico/inicio" data-analytics-id="nav_cta_click">Quero meu diagnóstico</Link>
                </Button>
            </>
        );
    }
    
     const renderMobileAuthButtons = () => {
        return user ? (
            <Button className="w-full" asChild>
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    Meu Dashboard
                </Link>
            </Button>
        ) : (
            <>
                <Button className="w-full" variant="outline" asChild>
                        <Link href="/auth/signin" onClick={() => setIsMobileMenuOpen(false)}>
                        Login
                    </Link>
                </Button>
                <Button className="w-full" asChild>
                    <Link href="/diagnostico/inicio" data-analytics-id="mobile_sheet_cta_click" onClick={() => setIsMobileMenuOpen(false)}>
                        Quero meu diagnóstico
                    </Link>
                </Button>
            </>
        );
    }

    const NavMenu = ({ className, onLinkClick }: { className?: string, onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void }) => (
        <nav className={cn("items-center space-x-8 text-sm font-medium", className)}>
            {navLinks.map((link) => (
                <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => onLinkClick(e, link.href)}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                >
                    {link.label}
                </a>
            ))}
            {isAdmin && (
                <Link href="/admin/dashboard" className="text-primary transition-colors hover:text-primary/80 font-semibold">Admin</Link>
            )}
        </nav>
    );

    return (
        <>
            <header className={cn(
                "sticky top-0 z-50 w-full transition-all duration-300",
                isScrolled ? "border-b border-border/40 bg-background/80 backdrop-blur-lg" : "bg-transparent"
            )}>
                 <div className="mx-auto max-w-7xl px-4 md:px-6">
                    <div className="flex h-20 items-center justify-between">
                        {/* Left: Logo */}
                        <Link href="/" onClick={(e) => handleLinkClick(e, '/')} className="flex items-center space-x-2">
                            <Icons.logo className="h-8 w-8" />
                            <span className="font-bold text-lg">V4SalesAI</span>
                        </Link>

                        {/* Center: Nav (Desktop) */}
                        <div className="hidden md:flex flex-1 items-center justify-center">
                            <NavMenu className="hidden md:flex" onLinkClick={handleLinkClick} />
                        </div>
                        
                        {/* Right: Actions (Desktop) */}
                        <div className="hidden md:flex items-center justify-end space-x-4">
                            {renderAuthButtons()}
                        </div>
                        
                        {/* Mobile Menu Button */}
                        <div className="flex items-center md:hidden">
                            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Icons.menu className="h-6 w-6" />
                                        <span className="sr-only">Abrir menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-full max-w-sm bg-background p-0">
                                    <SheetTitle className="sr-only">Menu Principal</SheetTitle>
                                    <SheetDescription className="sr-only">Navegue pelas seções do site ou acesse sua conta.</SheetDescription>
                                    <div className="flex h-full flex-col">
                                        <div className="p-4 border-b">
                                            <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                                                <Icons.logo className="h-8 w-8" />
                                                <span className="font-bold text-lg">V4SalesAI</span>
                                            </Link>
                                        </div>
                                        <nav className="flex flex-col space-y-2 p-4">
                                            {navLinks.map((link) => (
                                                <a
                                                    key={link.label}
                                                    href={link.href}
                                                    onClick={(e) => handleLinkClick(e, link.href)}
                                                    className="px-4 py-3 text-lg rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                                                >
                                                    {link.label}
                                                </a>
                                            ))}
                                            {isAdmin && (
                                                <Link href="/admin/dashboard"  onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-lg rounded-md text-primary transition-colors hover:bg-secondary font-semibold">Admin</Link>
                                            )}
                                        </nav>
                                        <div className="mt-auto flex flex-col gap-4 border-t p-4">
                                            {renderMobileAuthButtons()}
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </header>
            <div className="md:hidden fixed bottom-4 right-4 z-50 animate-in fade-in-50 slide-in-from-bottom-10 duration-300">
                <Button asChild size="lg" data-analytics-id="mobile_cta_click">
                    <Link href="/diagnostico/inicio">Começar Diagnóstico</Link>
                </Button>
            </div>
        </>
    );
}
