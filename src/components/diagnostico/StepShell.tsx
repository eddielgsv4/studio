import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";

interface StepShellProps {
  title: string;
  description: string;
  aside: React.ReactNode;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export function StepShell({ title, description, aside, children, footer }: StepShellProps) {
  return (
    <div className="flex min-h-screen w-full bg-secondary">
      <aside className="hidden w-[380px] flex-col border-r border-border bg-background p-8 lg:flex">
        {aside}
      </aside>
      <main className="flex flex-1 flex-col">
        <div className="flex-1 px-4 py-8 sm:p-8">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
            <p className="mt-2 text-muted-foreground">{description}</p>
            <div className="mt-8">
              {children}
            </div>
          </div>
        </div>
        {footer}
      </main>
    </div>
  );
}

export const TipCard = ({ title, tips }: { title: string; tips: string[] }) => (
    <div className="mt-8 rounded-lg border border-border bg-card p-6">
        <h3 className="flex items-center text-lg font-semibold text-foreground">
            <Icons.zap className="mr-3 h-5 w-5 text-primary" />
            {title}
        </h3>
        <ul className="mt-4 space-y-3">
            {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <Icons.chevronRight className="mt-1 h-4 w-4 flex-shrink-0 text-primary" />
                    <span>{tip}</span>
                </li>
            ))}
        </ul>
    </div>
)
