"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  ExternalLink,
  Zap,
  Star,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TeamOffer } from '@/lib/types-dashboard';
import { useDashboard } from '@/contexts/DashboardContext';

interface TeamOfferModalProps {
  offer: TeamOffer;
  isOpen: boolean;
  onClose: () => void;
}

export function TeamOfferModal({ offer, isOpen, onClose }: TeamOfferModalProps) {
  const { contactTeam } = useDashboard();

  const handleContact = () => {
    contactTeam(offer);
    onClose();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl">
            <div className="p-2 bg-blue-900/30 rounded-lg">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <span>{offer.title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Urgency Banner */}
          {offer.urgency && (
            <Card className="bg-orange-950/40 border-orange-800/60">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-orange-400" />
                  <span className="text-orange-400 font-medium">{offer.urgency}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Sobre o Serviço</h3>
            <p className="text-gray-300 leading-relaxed">{offer.description}</p>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Main Price */}
            <Card className="bg-gray-800/60 border-gray-700/50">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <DollarSign className="h-5 w-5 text-green-400" />
                    <span className="text-sm text-gray-400">Investimento Total</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {formatPrice(offer.price)}
                  </div>
                  <div className="text-xs text-gray-500">Pagamento único</div>
                </div>
              </CardContent>
            </Card>

            {/* Installments */}
            {offer.installments && (
              <Card className="bg-blue-950/40 border-blue-800/60">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Clock className="h-5 w-5 text-blue-400" />
                      <span className="text-sm text-gray-400">Parcelamento</span>
                    </div>
                    <div className="text-xl font-bold text-blue-400 mb-1">
                      {offer.installments.count}x {formatPrice(offer.installments.value)}
                    </div>
                    <div className="text-xs text-gray-500">Sem juros</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Benefits */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <Star className="h-5 w-5 mr-2 text-amber-400" />
              O que está incluído
            </h3>
            <div className="grid gap-2">
              {offer.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-800/40 border border-gray-700/30 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Value Proposition */}
          <Card className="bg-emerald-950/40 border-emerald-800/60">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-emerald-900/30 rounded-lg">
                  <Zap className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-emerald-400 font-semibold mb-1">Por que escolher nossa equipe?</h4>
                  <p className="text-sm text-gray-300">
                    Nossa equipe especializada já implementou soluções similares para mais de 200 empresas, 
                    com resultados comprovados e garantia de satisfação. Você terá acompanhamento dedicado 
                    e suporte completo durante todo o processo.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
            <Button variant="outline" onClick={onClose}>
              Talvez Depois
            </Button>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="text-gray-300">
                <ExternalLink className="h-4 w-4 mr-2" />
                Ver Portfólio
              </Button>
              
              <Button 
                onClick={handleContact}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Users className="h-4 w-4 mr-2" />
                {offer.ctaText}
              </Button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="text-center text-xs text-gray-500 pt-2">
            Ao clicar em "{offer.ctaText}", você será redirecionado para o WhatsApp para conversar com nossa equipe.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
