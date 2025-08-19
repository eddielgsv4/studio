
"use client";

import { DollarSign, TrendingUp, Users, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card';

const stats = [
  { title: "Revenue", value: "$45,231.89", description: "+20.1% from last month", icon: DollarSign },
  { title: "Leads", value: "+2350", description: "+180.1% from last month", icon: Users },
  { title: "Conversion Rate", value: "12.5%", description: "+12% from last month", icon: TrendingUp },
  { title: "Avg. Deal Size", value: "$1,230", description: "+5% from last month", icon: Zap },
]

export function StatCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map(stat => (
        <Card key={stat.title}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
          <stat.icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stat.value}</div>
          <p className="text-xs text-muted-foreground">{stat.description}</p>
        </CardContent>
      </Card>
      ))}
    </div>
  )
}
