
'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const steps = [
  { path: '/diagnostico/conta', label: 'Conta' },
  { path: '/diagnostico/empresa', label: 'Empresa' },
  { path: '/diagnostico/produto', label: 'Produto' },
  { path: '/diagnostico/go-to-market', label: 'GTM' },
  { path: '/diagnostico/funil/metricas', label: 'Funil' },
  { path: '/diagnostico/time-processo', label: 'Time' },
  { path: '/diagnostico/economia', label: 'Economia' },
  { path: '/diagnostico/resumo', label: 'Resumo' },
];

export function ProgressBar() {
  const pathname = usePathname();
  
  const currentStepIndex = steps.slice().reverse().findIndex(step => pathname.startsWith(step.path));
  const activeStepIndex = steps.length - 1 - currentStepIndex;

  const progress = activeStepIndex >= 0 ? ((activeStepIndex + 1) / steps.length) * 100 : 0;

  return (
    <div className="w-full">
      <div className="relative h-2 w-full rounded-full bg-secondary">
        <div
          className="absolute h-2 rounded-full bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="mt-2 grid grid-cols-8 text-center text-xs text-muted-foreground">
        {steps.map((step, index) => (
          <div key={step.label} className={cn(
            "font-medium",
            index <= activeStepIndex ? "text-primary" : "text-muted-foreground"
          )}>
            {step.label}
          </div>
        ))}
      </div>
    </div>
  );
}
