import { Icons } from "@/components/icons";
import Link from "next/link";
import { ProgressBar } from "@/components/diagnostico/ProgressBar";
import { DiagnosticProvider } from "@/contexts/DiagnosticContext";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <DiagnosticProvider>
        <header className="sticky top-0 z-20 w-full border-b border-border bg-background/95 backdrop-blur-sm">
            <div className="container flex h-16 max-w-7xl items-center justify-between">
                 <Link href="/" className="flex items-center gap-2">
                    <Icons.logo className="h-6 w-6" />
                    <span className="font-bold text-lg">V4SalesAI</span>
                 </Link>
                 <div className="w-full max-w-md hidden sm:block">
                    <ProgressBar />
                 </div>
                 <div>
                    {/* Placeholder */}
                 </div>
            </div>
        </header>
        {children}
    </DiagnosticProvider>
  );
}
