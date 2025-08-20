"use client";

import { DashboardProvider } from '@/contexts/DashboardContext';
import { DashboardContent } from '@/components/dashboard/DashboardContent';

interface DashboardPageProps {
  params: {
    projectId: string;
  };
}

export default function DashboardPage({ params }: DashboardPageProps) {
  return (
    <DashboardProvider projectId={params.projectId}>
      <DashboardContent />
    </DashboardProvider>
  );
}
