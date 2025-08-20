"use client";

import { use } from 'react';
import { LiveProjectProvider } from '@/contexts/LiveProjectContext';
import { ChatPane } from '@/components/live/ChatPane';
import { FunnelPanel } from '@/components/live/FunnelPanel';
import { SummaryPanel } from '@/components/live/SummaryPanel';
import { LiveHeader } from '@/components/live/LiveHeader';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface LiveProjectPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default function LiveProjectPage({ params }: LiveProjectPageProps) {
  const { projectId } = use(params);
  
  return (
    <LiveProjectProvider projectId={projectId}>
      <LiveProjectContent />
    </LiveProjectProvider>
  );
}

function LiveProjectContent() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header fixo */}
      <LiveHeader />
      
      {/* Layout principal */}
      <div className="max-w-[1800px] mx-auto px-4 pt-6">
        <div className="live-layout grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Painel de Funil Expandido - Lado Esquerdo - 2/3 da largura */}
          <div className="lg:col-span-2 flex flex-col">
            <FunnelPanel />
          </div>
          
          {/* Painel de Chat - Lado Direito - 1/3 da largura - Sticky */}
          <div className="flex flex-col">
            <div className="sticky top-6" style={{ height: 'calc(100vh - 120px)' }}>
              <ChatPane />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
