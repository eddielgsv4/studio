
"use client"

import * as React from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Menu, Wallet, Plus } from "lucide-react"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { useDiagnostic } from "@/contexts/DiagnosticContext"
import { addCredits } from "@/lib/credits"
import { useToast } from "@/hooks/use-toast"

interface SidebarContextProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
}

const SidebarContext = React.createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = () => {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isOpen, setIsOpen] = React.useState(!isMobile);

  React.useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen, isMobile }}>
      <TooltipProvider delayDuration={0}>
        {children}
      </TooltipProvider>
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const { isOpen, isMobile, setIsOpen } = useSidebar();

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-[280px] p-0 bg-card border-r-0">
          <div className="flex h-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className={cn(
      "hidden md:flex flex-col border-r transition-all duration-300 ease-in-out bg-card",
      isOpen ? "w-64" : "w-16",
      className
    )}>
      {children}
    </aside>
  );
};

export const SidebarHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const { isOpen } = useSidebar();
  return (
    <div className={cn(
        "p-4 flex items-center h-16 border-b", 
        isOpen ? 'justify-between' : 'justify-center',
        className
    )}>
      {children}
    </div>
  );
};

export const SidebarBody = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    const { isOpen } = useSidebar();
    return (
        <div className={cn("flex flex-col justify-between flex-1", className)}>
            <nav className="flex-1 overflow-y-auto px-4 py-4">
                <div className="flex flex-col gap-2">
                    {children}
                </div>
            </nav>
             <div className="px-4 py-4 border-t">
                <UserCredits />
            </div>
        </div>
    )
}

const UserCredits = () => {
    const { isOpen, isMobile } = useSidebar();
    const { user, wallet, refreshWallet } = useDiagnostic();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);

    const handleAddCredits = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            await addCredits(user.uid, 100); // Add 100 credits for demo
            refreshWallet();
            toast({ title: "Créditos adicionados!", description: "100 créditos foram adicionados à sua carteira." });
        } catch (error) {
            toast({ variant: 'destructive', title: "Erro", description: "Não foi possível adicionar créditos." });
        } finally {
            setIsLoading(false);
        }
    }

    if (!wallet) {
        return (
             <div className={cn("flex items-center", isOpen ? "justify-between" : "justify-center")}>
                <span className="text-xs text-muted-foreground">Carregando...</span>
            </div>
        )
    }

    const content = (
         <div className={cn("flex items-center", isOpen || isMobile ? "justify-between" : "justify-center")}>
            <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                <div className={cn("flex flex-col transition-opacity duration-200", isOpen || isMobile ? "opacity-100" : "opacity-0")}>
                    <span className="text-sm font-bold">{wallet.balance}</span>
                    <span className="text-xs text-muted-foreground">créditos</span>
                </div>
            </div>
            {(isOpen || isMobile) && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleAddCredits} disabled={isLoading}>
                            <Plus className={cn("h-4 w-4", isLoading && "animate-spin")} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Comprar mais créditos</TooltipContent>
                </Tooltip>
            )}
        </div>
    );

    return content;
}


export const SidebarItem = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string; }) => {
    const { isOpen, isMobile, setIsOpen } = useSidebar();
    const pathname = usePathname();
    const active = pathname === href;

    const handleClick = () => {
      if(isMobile) {
        setIsOpen(false);
      }
    }

    const itemContent = (
        <Link href={href} onClick={handleClick} className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors w-full",
            active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
        )}>
            {icon}
            <span className={cn(
                "transition-opacity duration-200 whitespace-nowrap", 
                isOpen ? "opacity-100" : "opacity-0"
            )}>{label}</span>
        </Link>
    );
    
    if (isOpen) {
        return itemContent;
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                {itemContent}
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={10}>
                {label}
            </TooltipContent>
        </Tooltip>
    );
}

export const SidebarTrigger = () => {
    const { setIsOpen } = useSidebar();
    return (
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(true)}>
            <Menu />
        </Button>
    )
}
