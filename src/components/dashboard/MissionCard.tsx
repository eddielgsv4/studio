"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Play, 
  CheckCircle, 
  Lock, 
  Clock, 
  Zap, 
  Users, 
  Star,
  Gift,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Mission } from '@/lib/types-dashboard';
import { useDashboard } from '@/contexts/DashboardContext';
import { TeamOfferModal } from './TeamOfferModal';

interface MissionCardProps {
  mission: Mission;
  stageId: string;
}

export function MissionCard({ mission, stageId }: MissionCardProps) {
  const { startMission, completeMission, updateChecklist, executeWithAgent, askForDetails, project } = useDashboard();
  const [showTeamOffer, setShowTeamOffer] = useState(false);

  const handleAskForDetails = async () => {
    await askForDetails('mission', mission.id, mission.title);
  };

  const getMissionStatusColor = (status: Mission['status']) => {
    switch (status) {
      case 'completed':
        return { 
          bg: 'bg-emerald-950/40', 
          border: 'border-emerald-800/60', 
          text: 'text-emerald-400',
          accent: 'bg-emerald-900/30'
        };
      case 'in_progress':
        return { 
          bg: 'bg-blue-950/40', 
          border: 'border-blue-800/60', 
          text: 'text-blue-400',
          accent: 'bg-blue-900/30'
        };
      case 'available':
        return { 
          bg: 'bg-gray-800/60', 
          border: 'border-gray-700/50', 
          text: 'text-gray-300',
          accent: 'bg-gray-700/30'
        };
      case 'locked':
        return { 
          bg: 'bg-gray-900/60', 
          border: 'border-gray-800/30', 
          text: 'text-gray-500',
          accent: 'bg-gray-800/30'
        };
      default:
        return { 
          bg: 'bg-gray-800/60', 
          border: 'border-gray-700/50', 
          text: 'text-gray-300',
          accent: 'bg-gray-700/30'
        };
    }
  };

  const getDifficultyColor = (difficulty: Mission['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-900/30 border-green-700/50';
      case 'medium': return 'text-amber-400 bg-amber-900/30 border-amber-700/50';
      case 'hard': return 'text-red-400 bg-red-900/30 border-red-700/50';
      default: return 'text-gray-400 bg-gray-900/30 border-gray-700/50';
    }
  };

  const getImpactColor = (impact: Mission['impact']) => {
    switch (impact) {
      case 'high': return 'text-orange-400 bg-orange-900/30 border-orange-700/50';
      case 'medium': return 'text-yellow-400 bg-yellow-900/30 border-yellow-700/50';
      case 'low': return 'text-gray-400 bg-gray-900/30 border-gray-700/50';
      default: return 'text-gray-400 bg-gray-900/30 border-gray-700/50';
    }
  };

  const getTypeIcon = (type: Mission['type']) => {
    switch (type) {
      case 'self': return <Clock className="h-4 w-4" />;
      case 'agent': return <Zap className="h-4 w-4" />;
      case 'team': return <Users className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const statusColors = getMissionStatusColor(mission.status);
  
  // Calculate checklist progress
  const completedItems = mission.checklist.filter(item => item.completed).length;
  const totalItems = mission.checklist.length;
  const checklistProgress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  
  // Check if all required items are completed
  const requiredItems = mission.checklist.filter(item => item.required);
  const completedRequired = requiredItems.filter(item => item.completed).length;
  const canComplete = completedRequired === requiredItems.length && mission.status === 'in_progress';

  const handleStartMission = async () => {
    if (mission.status === 'available') {
      await startMission(mission.id);
    }
  };

  const handleCompleteMission = async () => {
    if (canComplete) {
      await completeMission(mission.id);
    }
  };

  const handleExecuteWithAgent = async () => {
    if (mission.agentCost && project && project.wallet.credits >= mission.agentCost) {
      await executeWithAgent(mission.id);
    }
  };

  const handleChecklistChange = async (checklistId: string, completed: boolean) => {
    await updateChecklist(mission.id, checklistId, completed);
  };

  const handleTeamContact = () => {
    if (mission.teamOffer) {
      setShowTeamOffer(true);
    }
  };

  return (
    <>
      <Card className={cn("transition-all", statusColors.bg, statusColors.border)}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={cn("p-2 rounded-lg", statusColors.accent)}>
                {mission.status === 'completed' ? (
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                ) : mission.status === 'locked' ? (
                  <Lock className="h-5 w-5 text-gray-500" />
                ) : (
                  getTypeIcon(mission.type)
                )}
              </div>
              <div>
                <h4 className={cn("text-base font-semibold", statusColors.text)}>
                  {mission.title}
                </h4>
                <p className="text-sm text-gray-400">{mission.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={cn("text-xs", getDifficultyColor(mission.difficulty))}>
                {mission.difficulty === 'easy' && 'Fácil'}
                {mission.difficulty === 'medium' && 'Médio'}
                {mission.difficulty === 'hard' && 'Difícil'}
              </Badge>
              <Badge variant="outline" className={cn("text-xs", getImpactColor(mission.impact))}>
                {mission.impact === 'high' && 'Alto Impacto'}
                {mission.impact === 'medium' && 'Médio Impacto'}
                {mission.impact === 'low' && 'Baixo Impacto'}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Mission Info */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">
                <Clock className="h-4 w-4 inline mr-1" />
                {mission.estimatedTime}
              </span>
              {mission.agentCost && (
                <span className="text-amber-400">
                  <Zap className="h-4 w-4 inline mr-1" />
                  {mission.agentCost} créditos
                </span>
              )}
            </div>
            
            <div className="text-xs text-gray-500">
              {mission.status === 'locked' && mission.unlockConditions && (
                <span>🔒 {mission.unlockConditions[0]}</span>
              )}
            </div>
          </div>

          {/* Checklist */}
          {mission.status !== 'locked' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300">Checklist</span>
                <span className="text-xs text-gray-500">
                  {completedItems}/{totalItems} completos
                </span>
              </div>
              
              <Progress value={checklistProgress} className="h-2" />
              
              {mission.status === 'in_progress' && (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {mission.checklist.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={(checked) => 
                          handleChecklistChange(item.id, checked as boolean)
                        }
                        disabled={mission.status !== 'in_progress'}
                      />
                      <span className={cn(
                        "text-sm",
                        item.completed ? "text-gray-500 line-through" : "text-gray-300",
                        item.required && "font-medium"
                      )}>
                        {item.text}
                        {item.required && <span className="text-red-400 ml-1">*</span>}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Rewards */}
          {mission.rewards.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-300 flex items-center">
                <Gift className="h-4 w-4 mr-1" />
                Recompensas
              </span>
              <div className="flex flex-wrap gap-1">
                {mission.rewards.map((reward, index) => (
                  <Badge key={index} variant="outline" className="text-xs text-green-400 border-green-700/50">
                    {reward.description}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              {mission.status === 'available' && (
                <Button size="sm" onClick={handleStartMission}>
                  <Play className="h-4 w-4 mr-1" />
                  Iniciar
                </Button>
              )}
              
              {mission.status === 'in_progress' && canComplete && (
                <Button size="sm" onClick={handleCompleteMission}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Concluir
                </Button>
              )}
              
              {mission.status === 'completed' && (
                <Badge className="bg-emerald-900/30 text-emerald-400 border-emerald-700/50">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Concluída
                </Badge>
              )}
              
              {mission.status === 'locked' && (
                <Badge variant="outline" className="text-gray-500 border-gray-700/50">
                  <Lock className="h-3 w-3 mr-1" />
                  Bloqueada
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {/* Agent Execution */}
              {mission.type === 'agent' && mission.agentCost && mission.status === 'available' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleExecuteWithAgent}
                  disabled={!project || project.wallet.credits < mission.agentCost}
                  className="text-amber-400 border-amber-700/50 hover:bg-amber-900/30"
                >
                  <Zap className="h-4 w-4 mr-1" />
                  Executar com Agente
                </Button>
              )}
              
              {/* Team Contact */}
              {mission.type === 'team' && mission.teamOffer && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleTeamContact}
                  className="text-blue-400 border-blue-700/50 hover:bg-blue-900/30"
                >
                  <Users className="h-4 w-4 mr-1" />
                  Contratar Equipe
                </Button>
              )}
              
              {/* Ask for Details */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleAskForDetails}
                disabled={!project || project.wallet.credits < 5}
                className="text-amber-400 hover:text-amber-300 hover:bg-amber-900/20"
                title="Pedir análise detalhada (5 créditos)"
              >
                <Zap className="h-3 w-3 mr-1" />
                Detalhes (5 ⚡)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Offer Modal */}
      {mission.teamOffer && (
        <TeamOfferModal
          offer={mission.teamOffer}
          isOpen={showTeamOffer}
          onClose={() => setShowTeamOffer(false)}
        />
      )}
    </>
  );
}
