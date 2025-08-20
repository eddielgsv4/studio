"use client";

import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  TrendingDown,
  Gift
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboard } from '@/contexts/DashboardContext';

export function NotificationBanner() {
  const { notifications, markNotificationRead } = useDashboard();
  const [dismissedNotifications, setDismissedNotifications] = useState<string[]>([]);

  // Get unread notifications that haven't been dismissed
  const activeNotifications = notifications.filter(
    n => !n.read && !dismissedNotifications.includes(n.id)
  );

  const handleDismiss = (notificationId: string) => {
    setDismissedNotifications(prev => [...prev, notificationId]);
    markNotificationRead(notificationId);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'mission_available':
      case 'milestone_reached':
        return <Gift className="h-4 w-4" />;
      case 'score_drop':
        return <TrendingDown className="h-4 w-4" />;
      case 'low_credits':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getNotificationStyle = (severity: string) => {
    switch (severity) {
      case 'success':
        return {
          bg: 'bg-emerald-950/40',
          border: 'border-emerald-800/60',
          text: 'text-emerald-400',
          icon: 'text-emerald-400'
        };
      case 'warning':
        return {
          bg: 'bg-amber-950/40',
          border: 'border-amber-800/60',
          text: 'text-amber-400',
          icon: 'text-amber-400'
        };
      case 'error':
        return {
          bg: 'bg-red-950/40',
          border: 'border-red-800/60',
          text: 'text-red-400',
          icon: 'text-red-400'
        };
      default:
        return {
          bg: 'bg-blue-950/40',
          border: 'border-blue-800/60',
          text: 'text-blue-400',
          icon: 'text-blue-400'
        };
    }
  };

  if (activeNotifications.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 p-4 pb-0">
      {activeNotifications.slice(0, 3).map((notification) => {
        const style = getNotificationStyle(notification.severity);
        
        return (
          <Alert 
            key={notification.id}
            className={cn("relative", style.bg, style.border)}
          >
            <div className="flex items-start space-x-3">
              <div className={cn("mt-0.5", style.icon)}>
                {getNotificationIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={cn("text-sm font-semibold", style.text)}>
                    {notification.title}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {notification.timestamp.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDismiss(notification.id)}
                      className="h-6 w-6 hover:bg-gray-800"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <AlertDescription className="text-gray-300 mt-1">
                  {notification.message}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        );
      })}
      
      {activeNotifications.length > 3 && (
        <div className="text-center">
          <Button variant="ghost" size="sm" className="text-xs text-gray-400">
            <Bell className="h-3 w-3 mr-1" />
            +{activeNotifications.length - 3} mais notificações
          </Button>
        </div>
      )}
    </div>
  );
}
