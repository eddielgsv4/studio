
"use client";

import { withAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/dashboard/Header';
import { StatCards } from '@/components/dashboard/StatCards';

function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Dashboard</h1>
        <StatCards />
      </main>
    </div>
  );
}

export default withAuth(Dashboard);
