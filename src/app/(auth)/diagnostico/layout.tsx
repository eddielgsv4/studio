import { DiagnosticProvider } from "@/contexts/DiagnosticContext";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <DiagnosticProvider>
        {children}
    </DiagnosticProvider>
  );
}
