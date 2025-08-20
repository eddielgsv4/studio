"use client";

import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Coins, 
  X, 
  CreditCard, 
  Zap, 
  Crown,
  ArrowUp,
  CheckCircle,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NotificationAlert } from '@/lib/types-dashboard';

interface WalletBannerProps {
  credits: number;
  plan: 'free' | 'pro' | 'enterprise';
  notification: NotificationAlert;
}

export function WalletBanner({ credits, plan, notification }: WalletBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  if (isDismissed) {
    return null;
  }

  const getPlanInfo = (planType: string) => {
    switch (planType) {
      case 'pro':
        return {
          name: 'Pro',
          monthlyCredits: 1000,
          price: 97,
          features: ['1000 créditos/mês', 'Agentes ilimitados', 'Suporte prioritário', 'Relatórios avançados']
        };
      case 'enterprise':
        return {
          name: 'Enterprise',
          monthlyCredits: 5000,
          price: 297,
          features: ['5000 créditos/mês', 'Equipe dedicada', 'Implementação personalizada', 'SLA garantido']
        };
      default:
        return {
          name: 'Gratuito',
          monthlyCredits: 200,
          price: 0,
          features: ['200 créditos/mês', 'Funcionalidades básicas']
        };
    }
  };

  const currentPlan = getPlanInfo(plan);
  const proPlan = getPlanInfo('pro');
  const enterprisePlan = getPlanInfo('enterprise');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <>
      <Alert className="mx-4 mt-4 bg-amber-950/40 border-amber-800/60">
        <div className="flex items-start space-x-3">
          <Coins className="h-5 w-5 text-amber-400 mt-0.5" />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-amber-400">
                {notification.title}
              </h4>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDismissed(true)}
                className="h-6 w-6 hover:bg-amber-900/30"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            
            <AlertDescription className="text-gray-300 mt-1 mb-3">
              {notification.message}
            </AlertDescription>
            
            {/* Credits Progress */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Créditos restantes</span>
                <span>{credits} de {currentPlan.monthlyCredits}</span>
              </div>
              <Progress 
                value={(credits / currentPlan.monthlyCredits) * 100} 
                className="h-2"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setShowUpgradeModal(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white"
                size="sm"
              >
                <ArrowUp className="h-4 w-4 mr-1" />
                Fazer Upgrade
              </Button>
              
              <Button variant="outline" size="sm" className="text-gray-300">
                <Zap className="h-4 w-4 mr-1" />
                Comprar Créditos
              </Button>
            </div>
          </div>
        </div>
      </Alert>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-xl">
              <Crown className="h-6 w-6 text-amber-400" />
              <span>Upgrade do Seu Plano</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Current Plan Status */}
            <div className="p-4 bg-gray-800/60 border border-gray-700/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Plano Atual: {currentPlan.name}</h3>
                  <p className="text-sm text-gray-400">
                    {credits} créditos restantes de {currentPlan.monthlyCredits} mensais
                  </p>
                </div>
                <Badge variant="outline" className="text-amber-400 border-amber-700/50">
                  {((credits / currentPlan.monthlyCredits) * 100).toFixed(0)}% restante
                </Badge>
              </div>
            </div>

            {/* Plan Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pro Plan */}
              <div className="relative p-6 bg-blue-950/40 border border-blue-800/60 rounded-lg">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white">Mais Popular</Badge>
                </div>
                
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-white mb-2">Plano Pro</h3>
                  <div className="text-3xl font-bold text-blue-400 mb-1">
                    {formatPrice(proPlan.price)}
                  </div>
                  <div className="text-sm text-gray-400">por mês</div>
                </div>

                <div className="space-y-3 mb-6">
                  {proPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Escolher Pro
                </Button>
              </div>

              {/* Enterprise Plan */}
              <div className="relative p-6 bg-purple-950/40 border border-purple-800/60 rounded-lg">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-600 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                </div>
                
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-white mb-2">Plano Enterprise</h3>
                  <div className="text-3xl font-bold text-purple-400 mb-1">
                    {formatPrice(enterprisePlan.price)}
                  </div>
                  <div className="text-sm text-gray-400">por mês</div>
                </div>

                <div className="space-y-3 mb-6">
                  {enterprisePlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  <Crown className="h-4 w-4 mr-2" />
                  Escolher Enterprise
                </Button>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-lg">
              <h4 className="text-emerald-400 font-semibold mb-2 flex items-center">
                <Zap className="h-4 w-4 mr-2" />
                Por que fazer upgrade?
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                <div>• Execute mais missões com agentes IA</div>
                <div>• Acesso a funcionalidades avançadas</div>
                <div>• Suporte prioritário da nossa equipe</div>
                <div>• Relatórios e insights detalhados</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
              <Button variant="outline" onClick={() => setShowUpgradeModal(false)}>
                Continuar no Plano Gratuito
              </Button>
              
              <div className="flex items-center space-x-3">
                <Button variant="outline" className="text-gray-300">
                  Falar com Vendas
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  <Crown className="h-4 w-4 mr-2" />
                  Fazer Upgrade Agora
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
