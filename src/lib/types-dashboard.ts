// Dashboard Executivo Types
export interface DashboardProject {
  id: string;
  name: string;
  company: {
    name: string;
    segment: string;
    ticketMedio: number;
  };
  createdAt: Date;
  lastUpdated: Date;
  status: 'active' | 'paused' | 'completed';
  overallScore: number;
  stages: FunnelStage[];
  wallet: WalletInfo;
}

export interface FunnelStage {
  id: 'topo' | 'meio' | 'fundo' | 'pos';
  name: string;
  icon: string;
  description: string;
  score: number;
  confidence: number;
  status: 'excellent' | 'good' | 'attention' | 'critical';
  metrics: StageMetrics;
  missions: Mission[];
  completedMissions: number;
  totalMissions: number;
  isExpanded?: boolean;
}

export interface StageMetrics {
  primary: MetricItem[];
  secondary: MetricItem[];
  benchmarks: BenchmarkItem[];
}

export interface MetricItem {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  format: 'percentage' | 'number' | 'currency' | 'days' | 'minutes';
}

export interface BenchmarkItem {
  metric: string;
  current: number;
  benchmark: number;
  status: 'above' | 'below' | 'equal';
  industry: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'self' | 'agent' | 'team';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  impact: 'low' | 'medium' | 'high';
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  checklist: ChecklistItem[];
  rewards: MissionReward[];
  unlockConditions?: string[];
  agentCost?: number; // Credits needed for agent execution
  teamOffer?: TeamOffer; // Commercial offer details
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  required: boolean;
}

export interface MissionReward {
  type: 'score_boost' | 'unlock_mission' | 'credits' | 'insight';
  value: number | string;
  description: string;
}

export interface TeamOffer {
  title: string;
  description: string;
  price: number;
  installments?: {
    count: number;
    value: number;
  };
  benefits: string[];
  whatsappNumber: string;
  ctaText: string;
  urgency?: string;
}

export interface WalletInfo {
  credits: number;
  plan: 'free' | 'pro' | 'enterprise';
  monthlyLimit: number;
  usedThisMonth: number;
  resetDate: Date;
}

export interface DashboardEvent {
  type: 'mission_started' | 'mission_completed' | 'audit_run' | 'score_updated' | 'agent_request' | 'team_contact';
  timestamp: Date;
  missionId?: string;
  stageId?: string;
  data: Record<string, any>;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  stageContext?: string; // Which stage the chat is focused on
}

export interface NotificationAlert {
  id: string;
  type: 'score_drop' | 'mission_available' | 'low_credits' | 'milestone_reached';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

// Service Interfaces
export interface DashboardService {
  getProject(projectId: string): Promise<DashboardProject>;
  updateProject(projectId: string, updates: Partial<DashboardProject>): Promise<void>;
  expandStage(projectId: string, stageId: string): Promise<void>;
  collapseAllStages(projectId: string): Promise<void>;
}

export interface MissionService {
  startMission(projectId: string, missionId: string): Promise<void>;
  completeMission(projectId: string, missionId: string): Promise<void>;
  updateChecklist(projectId: string, missionId: string, checklistId: string, completed: boolean): Promise<void>;
  executeWithAgent(projectId: string, missionId: string): Promise<void>;
  unlockMissions(projectId: string, stageId: string): Promise<Mission[]>;
}

export interface WalletService {
  getWallet(userId: string): Promise<WalletInfo>;
  deductCredits(userId: string, amount: number, reason: string): Promise<boolean>;
  addCredits(userId: string, amount: number, reason: string): Promise<void>;
  checkLimit(userId: string, requestedAmount: number): Promise<boolean>;
}

export interface AuditService {
  runStageAudit(projectId: string, stageId: string): Promise<{
    newScore: number;
    improvements: string[];
    newMissions: Mission[];
  }>;
  runFullAudit(projectId: string): Promise<DashboardProject>;
}

// Context Types
export interface DashboardContextType {
  project: DashboardProject | null;
  isLoading: boolean;
  error: string | null;
  expandedStage: string | null;
  chatMessages: ChatMessage[];
  notifications: NotificationAlert[];
  
  // Actions
  loadProject: (projectId: string) => Promise<void>;
  expandStage: (stageId: string) => void;
  collapseAllStages: () => void;
  startMission: (missionId: string) => Promise<void>;
  completeMission: (missionId: string) => Promise<void>;
  updateChecklist: (missionId: string, checklistId: string, completed: boolean) => Promise<void>;
  executeWithAgent: (missionId: string) => Promise<void>;
  sendChatMessage: (message: string, stageContext?: string) => Promise<void>;
  askForDetails: (type: 'benchmark' | 'mission', itemId: string, context: string) => Promise<void>;
  markNotificationRead: (notificationId: string) => void;
  contactTeam: (offer: TeamOffer) => void;
}

// Filter and Search Types
export interface DashboardFilters {
  stage?: string;
  missionStatus?: Mission['status'];
  missionType?: Mission['type'];
  difficulty?: Mission['difficulty'];
  impact?: Mission['impact'];
}

export interface DashboardStats {
  totalMissions: number;
  completedMissions: number;
  availableMissions: number;
  totalScore: number;
  creditsUsed: number;
  creditsRemaining: number;
}
