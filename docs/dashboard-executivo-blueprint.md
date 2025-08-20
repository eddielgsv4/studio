# **V4SALESAI - DASHBOARD EXECUTIVO BLUEPRINT**

## **VISÃO GERAL**

Este documento define a arquitetura completa do Dashboard Executivo V4SalesAI, focado em um sistema pós-diagnóstico baseado em missões, agentes IA e evolução contínua de scores. Todo o sistema é construído sobre Firebase Firestore para garantir escalabilidade e real-time.

---

## **1. ARQUITETURA FIRESTORE**

### **1.1 Estrutura de Collections**

```
firestore/
├── users/{userId}                          # Dados do usuário
├── projects/{projectId}                    # Projetos do usuário
│   ├── missions/{missionId}                # Missões do projeto
│   ├── interactions/{interactionId}        # Interações com agentes
│   ├── events/{eventId}                    # Timeline de eventos
│   └── audits/{auditId}                    # Histórico de reauditorias
├── wallet_transactions/{transactionId}     # Transações de créditos
├── mission_templates/{templateId}          # Templates de missões
└── system_config/{configId}               # Configurações do sistema
```

### **1.2 Documentos Principais**

#### **Users Collection**
```typescript
interface UserDocument {
  // Identificação
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  
  // Wallet
  wallet: {
    credits: number;              // Créditos disponíveis
    totalCreditsUsed: number;     // Total histórico usado
    totalCreditsEarned: number;   // Total histórico ganho
    lastRefill: Timestamp;        // Última recarga
    plan: 'free' | 'pro' | 'enterprise';
    monthlyLimit: number;         // Limite mensal do plano
  };
  
  // Configurações
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    language: 'pt-BR' | 'en-US';
    timezone: string;
  };
  
  // Métricas de uso
  usage: {
    projectsCreated: number;
    totalInteractions: number;
    lastLogin: Timestamp;
    onboardingCompleted: boolean;
  };
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### **Projects Collection**
```typescript
interface ProjectDocument {
  // Identificação
  id: string;
  userId: string;
  name: string;
  description?: string;
  
  // Dados da empresa
  company: {
    name: string;
    segment: string;
    businessModel: 'B2B' | 'B2C' | 'B2B2C';
    size: 'startup' | 'pequena' | 'media' | 'grande';
    website?: string;
    mainChallenge: string;
    ticketMedio?: number;
    cicloVendas?: number;
  };
  
  // Métricas coletadas (readonly após diagnóstico)
  diagnosticData: {
    collectedAt: Timestamp;
    topo: {
      visitanteLead: number;
      ctrAnuncios: number;
      formPreenchido: number;
      investimentoMensal: number;
      leadsMes: number;
    };
    meio: {
      leadMQL: number;
      tempoPrimeiraResposta: number;
      showRate: number;
      tentativasContato: number;
      canalPreferido: string;
    };
    fundo: {
      mqlSQL: number;
      sqlVenda: number;
      propostaFechamento: number;
      followUpsMedios: number;
      cicloVendas: number;
    };
    pos: {
      recompra60d: number;
      churn30d: number;
      churn60d: number;
      churn90d: number;
      nps?: number;
      ltv?: number;
    };
  };
  
  // Scores atuais (atualizados por reauditoria)
  currentScores: {
    topo: number;
    meio: number;
    fundo: number;
    pos: number;
    overall: number;
    lastUpdated: Timestamp;
    confidence: {
      topo: number;
      meio: number;
      fundo: number;
      pos: number;
      overall: number;
    };
  };
  
  // Progresso das missões
  progress: {
    topo: {
      completedMissions: number;
      totalMissions: number;
      unlockedMissions: string[]; // IDs das missões desbloqueadas
    };
    meio: {
      completedMissions: number;
      totalMissions: number;
      unlockedMissions: string[];
    };
    fundo: {
      completedMissions: number;
      totalMissions: number;
      unlockedMissions: string[];
    };
    pos: {
      completedMissions: number;
      totalMissions: number;
      unlockedMissions: string[];
    };
  };
  
  // Estado do projeto
  status: 'diagnostic_pending' | 'active' | 'paused' | 'completed';
  lastActivity: Timestamp;
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### **Missions Subcollection**
```typescript
interface MissionDocument {
  // Identificação
  id: string;
  projectId: string;
  templateId: string; // Referência ao template
  
  // Dados da missão
  stage: 'topo' | 'meio' | 'fundo' | 'pos';
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string; // "30min", "2h", etc.
  estimatedImpact: string; // "+25% conversão"
  
  // Checklist
  checklist: {
    id: string;
    text: string;
    completed: boolean;
    completedAt?: Timestamp;
    completedBy?: 'user' | 'agent';
  }[];
  
  // Estado
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  progress: number; // 0-100%
  
  // Execução
  executionType: 'self' | 'agent' | 'service';
  agentInteractions: string[]; // IDs das interações
  
  // Unlock conditions
  unlockConditions: {
    requiredMissions?: string[]; // Missões que devem estar completas
    minimumScore?: number; // Score mínimo da etapa
    manualUnlock?: boolean; // Desbloqueada manualmente
  };
  
  // Service offer (se aplicável)
  serviceOffer?: {
    title: string;
    description: string;
    price: string;
    timeline: string;
    whatsappMessage: string;
    benefits: string[];
  };
  
  // Timestamps
  unlockedAt?: Timestamp;
  startedAt?: Timestamp;
  completedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### **Interactions Subcollection**
```typescript
interface InteractionDocument {
  // Identificação
  id: string;
  projectId: string;
  missionId?: string; // Se relacionada a uma missão específica
  
  // Tipo de interação
  type: 'mission_execution' | 'general_chat' | 'stage_consultation';
  stage?: 'topo' | 'meio' | 'fundo' | 'pos';
  
  // Agente
  agentType: 'micro' | 'macro' | 'general';
  agentPrompt: string; // Prompt usado
  
  // Conversa
  messages: {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Timestamp;
    metadata?: Record<string, any>;
  }[];
  
  // Custos
  creditsUsed: number;
  tokensUsed?: number;
  
  // Resultados
  outcome?: {
    missionProgress?: number;
    checklistUpdates?: string[];
    scoreImpact?: number;
    nextSteps?: string[];
  };
  
  // Estado
  status: 'active' | 'completed' | 'abandoned';
  
  // Timestamps
  startedAt: Timestamp;
  lastMessageAt: Timestamp;
  completedAt?: Timestamp;
}
```

#### **Wallet Transactions Collection**
```typescript
interface WalletTransactionDocument {
  // Identificação
  id: string;
  userId: string;
  
  // Transação
  type: 'agent_interaction' | 'mission_bonus' | 'refill' | 'purchase' | 'bonus';
  amount: number; // Positivo para créditos, negativo para gastos
  description: string;
  
  // Contexto
  projectId?: string;
  missionId?: string;
  interactionId?: string;
  
  // Detalhes
  metadata: {
    agentType?: string;
    tokensUsed?: number;
    planType?: string;
    paymentMethod?: string;
    promoCode?: string;
  };
  
  // Estado
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  
  // Saldos (snapshot no momento da transação)
  balanceBefore: number;
  balanceAfter: number;
  
  // Timestamps
  createdAt: Timestamp;
  processedAt?: Timestamp;
}
```

#### **Events Subcollection (Timeline)**
```typescript
interface EventDocument {
  // Identificação
  id: string;
  projectId: string;
  
  // Evento
  type: 'mission_started' | 'mission_completed' | 'score_updated' | 'audit_run' | 'agent_interaction' | 'milestone_reached';
  title: string;
  description: string;
  
  // Contexto
  stage?: 'topo' | 'meio' | 'fundo' | 'pos';
  missionId?: string;
  interactionId?: string;
  
  // Dados do evento
  data: {
    oldValue?: any;
    newValue?: any;
    impact?: string;
    creditsUsed?: number;
    scoreChange?: number;
  };
  
  // Visibilidade
  visibility: 'user' | 'system' | 'admin';
  importance: 'low' | 'medium' | 'high' | 'critical';
  
  // Timestamp
  createdAt: Timestamp;
}
```

### **1.3 Índices Necessários**

```javascript
// Firestore Indexes
const indexes = [
  // Projects por usuário
  {
    collection: 'projects',
    fields: [
      { field: 'userId', order: 'ASCENDING' },
      { field: 'updatedAt', order: 'DESCENDING' }
    ]
  },
  
  // Missões por projeto e status
  {
    collection: 'projects/{projectId}/missions',
    fields: [
      { field: 'stage', order: 'ASCENDING' },
      { field: 'status', order: 'ASCENDING' },
      { field: 'createdAt', order: 'ASCENDING' }
    ]
  },
  
  // Transações por usuário
  {
    collection: 'wallet_transactions',
    fields: [
      { field: 'userId', order: 'ASCENDING' },
      { field: 'createdAt', order: 'DESCENDING' }
    ]
  },
  
  // Eventos por projeto
  {
    collection: 'projects/{projectId}/events',
    fields: [
      { field: 'type', order: 'ASCENDING' },
      { field: 'createdAt', order: 'DESCENDING' }
    ]
  },
  
  // Interações por projeto
  {
    collection: 'projects/{projectId}/interactions',
    fields: [
      { field: 'status', order: 'ASCENDING' },
      { field: 'lastMessageAt', order: 'DESCENDING' }
    ]
  }
];
```

### **1.4 Security Rules**

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users - só o próprio usuário pode acessar
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Projects - só o dono pode acessar
    match /projects/{projectId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      
      // Missões do projeto
      match /missions/{missionId} {
        allow read, write: if request.auth != null && 
          request.auth.uid == get(/databases/$(database)/documents/projects/$(projectId)).data.userId;
      }
      
      // Interações do projeto
      match /interactions/{interactionId} {
        allow read, write: if request.auth != null && 
          request.auth.uid == get(/databases/$(database)/documents/projects/$(projectId)).data.userId;
      }
      
      // Eventos do projeto
      match /events/{eventId} {
        allow read: if request.auth != null && 
          request.auth.uid == get(/databases/$(database)/documents/projects/$(projectId)).data.userId;
        allow write: if false; // Só o sistema pode escrever eventos
      }
    }
    
    // Transações de wallet - só o próprio usuário
    match /wallet_transactions/{transactionId} {
      allow read: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow write: if false; // Só o sistema pode criar transações
    }
    
    // Templates de missões - leitura pública
    match /mission_templates/{templateId} {
      allow read: if true;
      allow write: if false; // Só admins
    }
    
    // Configurações do sistema - leitura pública
    match /system_config/{configId} {
      allow read: if true;
      allow write: if false; // Só admins
    }
  }
}
```

---

## **2. INTERFACES TYPESCRIPT**

### **2.1 Types Principais**

```typescript
// studio/src/lib/types-dashboard.ts

import { Timestamp } from 'firebase/firestore';

// ============================================================================
// USER & WALLET TYPES
// ============================================================================

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  wallet: UserWallet;
  preferences: UserPreferences;
  usage: UserUsage;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWallet {
  credits: number;
  totalCreditsUsed: number;
  totalCreditsEarned: number;
  lastRefill: Date;
  plan: 'free' | 'pro' | 'enterprise';
  monthlyLimit: number;
}

export interface UserPreferences {
  notifications: boolean;
  emailUpdates: boolean;
  language: 'pt-BR' | 'en-US';
  timezone: string;
}

export interface UserUsage {
  projectsCreated: number;
  totalInteractions: number;
  lastLogin: Date;
  onboardingCompleted: boolean;
}

// ============================================================================
// PROJECT TYPES
// ============================================================================

export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  company: CompanyData;
  diagnosticData: DiagnosticData;
  currentScores: ProjectScores;
  progress: ProjectProgress;
  status: 'diagnostic_pending' | 'active' | 'paused' | 'completed';
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyData {
  name: string;
  segment: string;
  businessModel: 'B2B' | 'B2C' | 'B2B2C';
  size: 'startup' | 'pequena' | 'media' | 'grande';
  website?: string;
  mainChallenge: string;
  ticketMedio?: number;
  cicloVendas?: number;
}

export interface DiagnosticData {
  collectedAt: Date;
  topo: TopoMetrics;
  meio: MeioMetrics;
  fundo: FundoMetrics;
  pos: PosMetrics;
}

export interface ProjectScores {
  topo: number;
  meio: number;
  fundo: number;
  pos: number;
  overall: number;
  lastUpdated: Date;
  confidence: {
    topo: number;
    meio: number;
    fundo: number;
    pos: number;
    overall: number;
  };
}

export interface ProjectProgress {
  topo: StageProgress;
  meio: StageProgress;
  fundo: StageProgress;
  pos: StageProgress;
}

export interface StageProgress {
  completedMissions: number;
  totalMissions: number;
  unlockedMissions: string[];
}

// ============================================================================
// MISSION TYPES
// ============================================================================

export interface Mission {
  id: string;
  projectId: string;
  templateId: string;
  stage: 'topo' | 'meio' | 'fundo' | 'pos';
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  estimatedImpact: string;
  checklist: ChecklistItem[];
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  progress: number;
  executionType: 'self' | 'agent' | 'service';
  agentInteractions: string[];
  unlockConditions: UnlockConditions;
  serviceOffer?: ServiceOffer;
  unlockedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  completedAt?: Date;
  completedBy?: 'user' | 'agent';
}

export interface UnlockConditions {
  requiredMissions?: string[];
  minimumScore?: number;
  manualUnlock?: boolean;
}

export interface ServiceOffer {
  title: string;
  description: string;
  price: string;
  timeline: string;
  whatsappMessage: string;
  benefits: string[];
}

// ============================================================================
// INTERACTION TYPES
// ============================================================================

export interface Interaction {
  id: string;
  projectId: string;
  missionId?: string;
  type: 'mission_execution' | 'general_chat' | 'stage_consultation';
  stage?: 'topo' | 'meio' | 'fundo' | 'pos';
  agentType: 'micro' | 'macro' | 'general';
  agentPrompt: string;
  messages: ChatMessage[];
  creditsUsed: number;
  tokensUsed?: number;
  outcome?: InteractionOutcome;
  status: 'active' | 'completed' | 'abandoned';
  startedAt: Date;
  lastMessageAt: Date;
  completedAt?: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface InteractionOutcome {
  missionProgress?: number;
  checklistUpdates?: string[];
  scoreImpact?: number;
  nextSteps?: string[];
}

// ============================================================================
// WALLET TRANSACTION TYPES
// ============================================================================

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'agent_interaction' | 'mission_bonus' | 'refill' | 'purchase' | 'bonus';
  amount: number;
  description: string;
  projectId?: string;
  missionId?: string;
  interactionId?: string;
  metadata: TransactionMetadata;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  balanceBefore: number;
  balanceAfter: number;
  createdAt: Date;
  processedAt?: Date;
}

export interface TransactionMetadata {
  agentType?: string;
  tokensUsed?: number;
  planType?: string;
  paymentMethod?: string;
  promoCode?: string;
}

// ============================================================================
// EVENT TYPES
// ============================================================================

export interface ProjectEvent {
  id: string;
  projectId: string;
  type: 'mission_started' | 'mission_completed' | 'score_updated' | 'audit_run' | 'agent_interaction' | 'milestone_reached';
  title: string;
  description: string;
  stage?: 'topo' | 'meio' | 'fundo' | 'pos';
  missionId?: string;
  interactionId?: string;
  data: EventData;
  visibility: 'user' | 'system' | 'admin';
  importance: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
}

export interface EventData {
  oldValue?: any;
  newValue?: any;
  impact?: string;
  creditsUsed?: number;
  scoreChange?: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type StageType = 'topo' | 'meio' | 'fundo' | 'pos';
export type MissionStatus = 'locked' | 'available' | 'in_progress' | 'completed';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type ExecutionType = 'self' | 'agent' | 'service';
export type AgentType = 'micro' | 'macro' | 'general';

// ============================================================================
// FIRESTORE CONVERTERS
// ============================================================================

export const firestoreConverters = {
  // Converter para User
  user: {
    toFirestore: (user: User) => ({
      ...user,
      createdAt: Timestamp.fromDate(user.createdAt),
      updatedAt: Timestamp.fromDate(user.updatedAt),
      wallet: {
        ...user.wallet,
        lastRefill: Timestamp.fromDate(user.wallet.lastRefill)
      },
      usage: {
        ...user.usage,
        lastLogin: Timestamp.fromDate(user.usage.lastLogin)
      }
    }),
    fromFirestore: (snapshot: any) => {
      const data = snapshot.data();
      return {
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        wallet: {
          ...data.wallet,
          lastRefill: data.wallet.lastRefill.toDate()
        },
        usage: {
          ...data.usage,
          lastLogin: data.usage.lastLogin.toDate()
        }
      } as User;
    }
  },
  
  // Converter para Project
  project: {
    toFirestore: (project: Project) => ({
      ...project,
      createdAt: Timestamp.fromDate(project.createdAt),
      updatedAt: Timestamp.fromDate(project.updatedAt),
      lastActivity: Timestamp.fromDate(project.lastActivity),
      diagnosticData: {
        ...project.diagnosticData,
        collectedAt: Timestamp.fromDate(project.diagnosticData.collectedAt)
      },
      currentScores: {
        ...project.currentScores,
        lastUpdated: Timestamp.fromDate(project.currentScores.lastUpdated)
      }
    }),
    fromFirestore: (snapshot: any) => {
      const data = snapshot.data();
      return {
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        lastActivity: data.lastActivity.toDate(),
        diagnosticData: {
          ...data.diagnosticData,
          collectedAt: data.diagnosticData.collectedAt.toDate()
        },
        currentScores: {
          ...data.currentScores,
          lastUpdated: data.currentScores.lastUpdated.toDate()
        }
      } as Project;
    }
  },
  
  // Converter para Mission
  mission: {
    toFirestore: (mission: Mission) => ({
      ...mission,
      createdAt: Timestamp.fromDate(mission.createdAt),
      updatedAt: Timestamp.fromDate(mission.updatedAt),
      unlockedAt: mission.unlockedAt ? Timestamp.fromDate(mission.unlockedAt) : null,
      startedAt: mission.startedAt ? Timestamp.fromDate(mission.startedAt) : null,
      completedAt: mission.completedAt ? Timestamp.fromDate(mission.completedAt) : null,
      checklist: mission.checklist.map(item => ({
        ...item,
        completedAt: item.completedAt ? Timestamp.fromDate(item.completedAt) : null
      }))
    }),
    fromFirestore: (snapshot: any) => {
      const data = snapshot.data();
      return {
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        unlockedAt: data.unlockedAt?.toDate(),
        startedAt: data.startedAt?.toDate(),
        completedAt: data.completedAt?.toDate(),
        checklist: data.checklist.map((item: any) => ({
          ...item,
          completedAt: item.completedAt?.toDate()
        }))
      } as Mission;
    }
  }
};
```

---

## **3. SERVIÇOS FIRESTORE**

### **3.1 Wallet Service**

```typescript
// studio/src/lib/services/wallet.ts

import { 
  doc, 
  collection, 
  addDoc, 
  updateDoc, 
  increment, 
  runTransaction,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { WalletTransaction, User } from '@/lib/types-dashboard';

export class WalletService {
  
  /**
   * Deduz créditos do usuário de forma atômica
   */
  async deductCredits(
    userId: string, 
    amount: number, 
    description: string,
    metadata: {
      projectId?: string;
      missionId?: string;
      interactionId?: string;
      agentType?: string;
      tokensUsed?: number;
    } = {}
  ): Promise<WalletTransaction> {
    
    return await runTransaction(db, async (transaction) => {
      // Buscar usuário atual
      const userRef = doc(db, 'users', userId);
      const userDoc = await transaction.get(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('Usuário não encontrado');
      }
      
      const userData = userDoc.data() as User;
      const currentCredits = userData.wallet.credits;
      
      // Verificar se tem créditos suficientes
      if (currentCredits < amount) {
        throw new Error(`Créditos insuficientes. Disponível: ${currentCredits}, Necessário: ${amount}`);
      }
      
      // Criar transação
      const transactionRef = doc(collection(db, 'wallet_transactions'));
      const walletTransaction: WalletTransaction = {
        id: transactionRef.id,
        userId,
        type: 'agent_interaction',
        amount: -amount,
        description,
        ...metadata,
        metadata: {
          agentType: metadata.agentType,
          tokensUsed: metadata.tokensUsed
        },
        status: 'completed',
        balanceBefore: currentCredits,
        balanceAfter: currentCredits - amount,
        createdAt: new Date(),
        processedAt: new Date()
      };
      
      // Atualizar saldo do usuário
      transaction.update(userRef, {
        'wallet.credits': increment(-amount),
        'wallet.totalCreditsUsed': increment(amount),
        updatedAt: new Date()
      });
      
      // Salvar transação
      transaction.set(transactionRef, walletTransaction);
      
      return walletTransaction;
    });
  }
  
  /**
   * Adiciona créditos (bônus, recarga, etc.)
   */
  async addCredits(
    userId: string,
    amount: number,
    type: 'mission_bonus' | 'refill' | 'purchase' | 'bonus',
    description: string,
    metadata: Record<string, any> = {}
  ): Promise<WalletTransaction> {
    
    return await runTransaction(db, async (transaction) => {
      const userRef = doc(db, 'users', userId);
      const userDoc = await transaction.get(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('Usuário não encontrado');
      }
      
      const userData = userDoc.data() as User;
      const currentCredits = userData.wallet.credits;
      
      // Criar transação
      const transactionRef = doc(collection(db, 'wallet_transactions'));
      const walletTransaction: WalletTransaction = {
        id: transactionRef.id,
        userId,
        type,
        amount,
        description,
        metadata,
        status: 'completed',
        balanceBefore: currentCredits,
        balanceAfter: currentCredits + amount,
        createdAt: new Date(),
        processedAt: new Date()
      };
      
      // Atualizar saldo do usuário
      transaction.update(userRef, {
        'wallet.credits': increment(amount),
        'wallet.totalCreditsEarned': increment(amount),
        updatedAt: new Date()
      });
      
      // Salvar transação
      transaction.set(transactionRef, walletTransaction);
      
      return walletTransaction;
    });
  }
  
  /**
   * Busca histórico de transações
   */
  async getTransactionHistory(
    userId: string, 
    limitCount: number = 50
  ): Promise<WalletTransaction[]> {
    
    const q = query(
      collection(db, 'wallet_transactions'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as WalletTransaction[];
  }
  
  /**
   * Verifica se usuário tem créditos suficientes
   */
  async hasEnoughCredits(userId: string, amount: number): Promise<boolean> {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return false;
    }
    
    const userData = userDoc.data() as User;
    return userData.wallet.credits >= amount;
  }
  
  /**
   * Calcula alertas de wallet
   */
  getWalletAlerts(credits: number): {
    showLowCredits: boolean;
    showNoCredits: boolean;
    alertLevel: 'none' | 'warning' | 'critical';
  } {
    if (credits === 0) {
      return {
        showLowCredits: false,
        showNoCredits: true,
        alertLevel: 'critical'
      };
    }
    
    if (credits < 20) {
      return {
        showLowCredits: true,
        showNoCredits: false,
        alertLevel: 'warning'
      };
    }
    
    return {
      showLowCredits: false,
      showNoCredits: false,
      alertLevel: 'none'
    };
  }
}

export const walletService = new WalletService();
```

### **3.2 Mission Service**

```typescript
// studio/src/lib/services/missions.ts

import { 
  doc, 
  collection, 
  addDoc, 
  updateDoc, 
  getDocs,
  query,
  where,
  orderBy,
  runTransaction,
  writeBatch,
  arrayUnion
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Mission, Project, ChecklistItem } from '@/lib/types-dashboard';

export class MissionService {
  
  /**
   * Cria missões iniciais para um projeto
   */
  async initializeProjectMissions(projectId: string): Promise<void> {
    const batch = writeBatch(db);
    
    // Buscar templates de missões
    const templates = await this.getMissionTemplates();
    
    // Criar missões baseadas nos templates
    for (const template of templates) {
      const missionRef = doc(collection(db, `projects/${projectId}/missions`));
      
      const mission: Partial<Mission> = {
        id: missionRef.id,
        projectId,
        templateId: template.id,
        stage: template.stage,
        title: template.title,
        description: template.description,
        difficulty: template.difficulty,
        estimatedTime: template.estimatedTime,
        estimatedImpact: template.estimatedImpact,
        checklist: template.checklist.map(item => ({
          ...item,
          completed: false
        })),
        status: template.unlockConditions?.manualUnlock ? 'available' : 'locked',
        progress: 0,
        executionType: template.executionType,
        agentInteractions: [],
        unlockConditions: template.unlockConditions,
        serviceOffer: template.serviceOffer,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      batch.set(missionRef, mission);
    }
    
    await batch.commit();
  }
  
  /**
   * Atualiza checklist de uma missão
   */
  async updateMissionChecklist(
    projectId: string,
    missionId: string,
    checklistItemId: string,
    completed: boolean,
    completedBy: 'user' | 'agent' = 'user'
  ): Promise<void> {
    
    return await runTransaction(db, async (transaction) => {
      const missionRef = doc(db, `projects/${projectId}/missions/${missionId}`);
      const missionDoc = await transaction.get(missionRef);
      
      if (!missionDoc.exists()) {
        throw new Error('Missão não encontrada');
      }
      
      const mission = missionDoc.data() as Mission;
      
      // Atualizar checklist
      const updatedChecklist = mission.checklist.map(item => {
        if (item.id === checklistItemId) {
          return {
            ...item,
            completed,
            completedAt: completed ? new Date() : undefined,
            completedBy: completed ? completedBy : undefined
          };
        }
        return item;
      });
      
      // Calcular novo progresso
      const completedItems = updatedChecklist.filter(item => item.completed).length;
      const progress = Math.round((completedItems / updatedChecklist.length) * 100);
      
      // Determinar novo status
      let newStatus = mission.status;
      if (progress === 100 && mission.status !== 'completed') {
        newStatus = 'completed';
      } else if (progress > 0 && mission.status === 'available') {
        newStatus = 'in_progress';
      }
      
      // Atualizar missão
      transaction.update(missionRef, {
        checklist: updatedChecklist,
        progress,
        status: newStatus,
        updatedAt: new Date(),
        ...(newStatus === 'completed' && { completedAt: new Date() })
      });
      
      // Se missão foi completada, criar evento
      if (newStatus === 'completed' && mission.status !== 'completed') {
        await this.createMissionCompletedEvent(projectId, missionId, mission);
      }
    });
  }
  
  /**
   * Desbloqueia novas missões baseadas em condições
   */
  async unlockMissions(projectId: string, completedMissionId: string): Promise<string[]> {
    const unlockedMissions: string[] = [];
    
    // Buscar todas as missões do projeto
    const missionsQuery = query(
      collection(db, `projects/${projectId}/missions`),
      where('status', '==', 'locked')
    );
    
    const missionsSnapshot = await getDocs(missionsQuery);
    const batch = writeBatch(db);
    
    for (const missionDoc of missionsSnapshot.docs) {
      const mission = missionDoc.data() as Mission;
      
      // Verificar condições de unlock
      if (this.shouldUnlockMission(mission, completedMissionId)) {
        batch.update(missionDoc.ref, {
          status: 'available',
          unlockedAt: new Date(),
          updatedAt: new Date()
        });
        
        unlockedMissions.push(mission.id);
      }
    }
    
    if (unlockedMissions.length > 0) {
      await batch.commit();
    }
    
    return unlockedMissions;
  }
  
  /**
   * Busca missões por etapa e status
   */
  async getMissionsByStage(
    projectId: string, 
    stage: 'topo' | 'meio' | 'fundo' | 'pos',
    status?: 'locked' | 'available' | 'in_progress' | 'completed'
  ): Promise<Mission[]> {
    
    let q = query(
      collection(db, `projects/${projectId}/missions`),
      where('stage', '==', stage),
      orderBy('createdAt', 'asc')
    );
    
    if (status) {
      q = query(q, where('status', '==', status));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Mission[];
  }
  
  private shouldUnlockMission(mission: Mission, completedMissionId: string): boolean {
    const conditions = mission.unlockConditions;
    
    if (!conditions) return false;
    
    // Verificar se a missão completada está nas condições
    if (conditions.requiredMissions?.includes(completedMissionId)) {
      return true;
    }
    
    return false;
  }
  
  private async createMissionCompletedEvent(
    projectId: string, 
    missionId: string, 
    mission: Mission
  ): Promise<void> {
    const eventRef = doc(collection(db, `projects/${projectId}/events`));
    
    const event = {
      id: eventRef.id,
      projectId,
      type: 'mission_completed',
      title: 'Missão Completada',
      description: `${mission.title} foi completada com sucesso`,
      stage: mission.stage,
      missionId,
      data: {
        impact: mission.estimatedImpact,
        difficulty: mission.difficulty
      },
      visibility: 'user',
      importance: 'medium',
      createdAt: new Date()
    };
    
    await addDoc(collection(db, `projects/${projectId}/events`), event);
  }
  
  private async getMissionTemplates(): Promise<any[]> {
    // Por enquanto, retornar templates hardcoded
    // Futuramente, buscar de mission_templates collection
    return MISSION_TEMPLATES;
  }
}

export const missionService = new MissionService();

// Templates de missões (será movido para Firestore)
const MISSION_TEMPLATES = [
  // TOPO DE FUNIL
  {
    id: 'topo-proposta-valor',
    stage: 'topo',
    title: 'Definir Proposta de Valor',
    description: 'Crie uma proposta clara que diferencia sua empresa no mercado',
    difficulty: 'medium',
    estimatedTime: '45min',
    estimatedImpact: '+25% conversão',
    executionType: 'self',
    checklist: [
      { id: '1', text: 'Identifique o problema principal do seu cliente ideal' },
      { id: '2', text: 'Defina sua solução única e diferenciada' },
      { id: '3', text: 'Crie o headline principal da proposta' },
      { id: '4', text: 'Valide com 3 clientes atuais' },
      { id: '5', text: 'Implemente nos materiais de marketing' }
    ],
    unlockConditions: { manualUnlock: true }
  },
  {
    id: 'topo-lead-magnet',
    stage: 'topo',
    title: 'Criar Lead Magnet',
    description: 'Desenvolva um material valioso para capturar leads qualificados',
    difficulty: 'hard',
    estimatedTime: '2h',
    estimatedImpact: '+40% leads',
    executionType: 'agent',
    checklist: [
      { id: '1', text: 'Escolha o formato ideal (ebook, checklist, template)' },
      { id: '2', text: 'Defina título irresistível' },
      { id: '3', text: 'Crie o conteúdo completo' },
      { id: '4', text: 'Configure landing page de captura' },
      { id: '5', text: 'Teste formulário e entrega automática' }
    ],
    unlockConditions: { 
      requiredMissions: ['topo-proposta-valor'],
      minimumScore: 60
    },
    serviceOffer: {
      title: 'Lead Magnet Profissional',
      description: 'Nossa equipe cria seu lead magnet completo em 48h',
      price: '3x R$ 97',
      timeline: '48 horas',
      whatsappMessage: 'Quero contratar o Lead Magnet Profissional',
      benefits: [
        'Design profissional',
        'Copywriting persuasivo',
        'Landing page otimizada',
        'Integração com automação'
      ]
    }
  },
  
  // MEIO DE FUNIL
  {
    id: 'meio-bot-qualificacao',
    stage: 'meio',
    title: 'Bot de Qualificação',
    description: 'Automatize a qualificação inicial via WhatsApp',
    difficulty: 'hard',
    estimatedTime: '3h',
    estimatedImpact: '+60% eficiência',
    executionType: 'agent',
    checklist: [
      { id: '1', text: 'Mapeie perguntas de qualificação essenciais' },
      { id: '2', text: 'Crie fluxo de conversa inteligente' },
      { id: '3', text: 'Configure respostas automáticas' },
      { id: '4', text: 'Teste com leads reais' },
      { id: '5', text: 'Integre com CRM/planilha' }
    ],
    unlockConditions: { 
      requiredMissions: ['topo-lead-magnet'],
      minimumScore: 65
    },
    serviceOffer: {
      title: 'IA SDR Completa',
      description: 'Bot + IA + Integração CRM em 7 dias',
      price: '12x R$ 99,97',
      timeline: '7 dias',
      whatsappMessage: 'Quero implementar a IA SDR completa',
      benefits: [
        'Bot WhatsApp personalizado',
        'IA de qualificação avançada',
        'Integração com CRM',
        'Dashboard de métricas',
        'Suporte técnico 30 dias'
      ]
    }
  },
  
  // FUNDO DE FUNIL
  {
    id: 'fundo-playbook-vendas',
    stage: 'fundo',
    title: 'Playbook de Vendas',
    description: 'Estruture processo de vendas replicável',
    difficulty: 'medium',
    estimatedTime: '90min',
    estimatedImpact: '+30% fechamento',
    executionType: 'self',
    checklist: [
      { id: '1', text: 'Mapeie etapas do processo de vendas' },
      { id: '2', text: 'Defina critérios de qualificação (BANT)' },
      { id: '3', text: 'Crie roteiro de descoberta' },
      { id: '4', text: 'Estruture apresentação de proposta' },
      { id: '5', text: 'Defina follow-ups padrão' }
    ],
    unlockConditions: { 
      requiredMissions: ['meio-bot-qualificacao']
    }
  },
  
  // PÓS-CONVERSÃO
  {
    id: 'pos-onboarding',
    stage: 'pos',
    title: 'Onboarding de Clientes',
    description: 'Garanta sucesso inicial dos novos clientes',
    difficulty: 'medium',
    estimatedTime: '60min',
    estimatedImpact: '-40% churn',
    executionType: 'self',
    checklist: [
      { id: '1', text: 'Mapeie jornada ideal do cliente' },
      { id: '2', text: 'Crie sequência de boas-vindas' },
      { id: '3', text: 'Defina marcos de sucesso (milestones)' },
      { id: '4', text: 'Configure check-ins automáticos' },
      { id: '5', text: 'Implemente coleta de feedback' }
    ],
    unlockConditions: { 
      requiredMissions: ['fundo-playbook-vendas']
    }
  }
];
```

### **3.3 Project Service**

```typescript
// studio/src/lib/services/projects.ts

import { 
  doc, 
  collection, 
  addDoc, 
  updateDoc, 
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  runTransaction
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Project, ProjectScores } from '@/lib/types-dashboard';
import { missionService } from './missions';
import { walletService } from './wallet';

export class ProjectService {
  
  /**
   * Cria novo projeto
   */
  async createProject(
    userId: string,
    projectData: {
      name: string;
      description?: string;
      company: any;
      diagnosticData: any;
    }
  ): Promise<Project> {
    
    return await runTransaction(db, async (transaction) => {
      // Verificar se usuário existe
      const userRef = doc(db, 'users', userId);
      const userDoc = await transaction.get(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('Usuário não encontrado');
      }
      
      // Criar projeto
      const projectRef = doc(collection(db, 'projects'));
      const now = new Date();
      
      const project: Project = {
        id: projectRef.id,
        userId,
        ...projectData,
        currentScores: {
          topo: 0,
          meio: 0,
          fundo: 0,
          pos: 0,
          overall: 0,
          lastUpdated: now,
          confidence: {
            topo: 0,
            meio: 0,
            fundo: 0,
            pos: 0,
            overall: 0
          }
        },
        progress: {
          topo: { completedMissions: 0, totalMissions: 0, unlockedMissions: [] },
          meio: { completedMissions: 0, totalMissions: 0, unlockedMissions: [] },
          fundo: { completedMissions: 0, totalMissions: 0, unlockedMissions: [] },
          pos: { completedMissions: 0, totalMissions: 0, unlockedMissions: [] }
        },
        status: 'active',
        lastActivity: now,
        createdAt: now,
        updatedAt: now
      };
      
      transaction.set(projectRef, project);
      
      // Atualizar contador de projetos do usuário
      transaction.update(userRef, {
        'usage.projectsCreated': increment(1),
        updatedAt: now
      });
      
      return project;
    });
  }
  
  /**
   * Busca projetos do usuário
   */
  async getUserProjects(userId: string): Promise<Project[]> {
    const q = query(
      collection(db, 'projects'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Project[];
  }
  
  /**
   * Busca projeto por ID
   */
  async getProject(projectId: string): Promise<Project | null> {
    const projectRef = doc(db, 'projects', projectId);
    const projectDoc = await getDoc(projectRef);
    
    if (!projectDoc.exists()) {
      return null;
    }
    
    return {
      id: projectDoc.id,
      ...projectDoc.data()
    } as Project;
  }
  
  /**
   * Atualiza scores do projeto
   */
  async updateProjectScores(
    projectId: string,
    newScores: Partial<ProjectScores>
  ): Promise<void> {
    
    const projectRef = doc(db, 'projects', projectId);
    
    await updateDoc(projectRef, {
      currentScores: {
        ...newScores,
        lastUpdated: new Date()
      },
      updatedAt: new Date()
    });
    
    // Criar evento de atualização de score
    await this.createScoreUpdateEvent(projectId, newScores);
  }
  
  /**
   * Atualiza progresso de missões
   */
  async updateMissionProgress(
    projectId: string,
    stage: 'topo' | 'meio' | 'fundo' | 'pos',
    completedMissions: number,
    totalMissions: number
  ): Promise<void> {
    
    const projectRef = doc(db, 'projects', projectId);
    
    await updateDoc(projectRef, {
      [`progress.${stage}.completedMissions`]: completedMissions,
      [`progress.${stage}.totalMissions`]: totalMissions,
      lastActivity: new Date(),
      updatedAt: new Date()
    });
  }
  
  /**
   * Executa reauditoria de uma etapa
   */
  async runStageAudit(
    projectId: string,
    stage: 'topo' | 'meio' | 'fundo' | 'pos'
  ): Promise<{ newScore: number; insights: string[] }> {
    
    // Buscar projeto e missões completadas
    const project = await this.getProject(projectId);
    if (!project) {
      throw new Error('Projeto não encontrado');
    }
    
    const completedMissions = await missionService.getMissionsByStage(
      projectId, 
      stage, 
      'completed'
    );
    
    // Calcular novo score baseado nas missões completadas
    const newScore = this.calculateStageScore(stage, completedMissions, project);
    
    // Gerar insights baseados no progresso
    const insights = this.generateStageInsights(stage, completedMissions, project);
    
    // Atualizar score no projeto
    await this.updateProjectScores(projectId, {
      [stage]: newScore,
      overall: this.calculateOverallScore(project.currentScores, stage, newScore)
    });
    
    // Criar evento de auditoria
    await this.createAuditEvent(projectId, stage, newScore);
    
    return { newScore, insights };
  }
  
  private calculateStageScore(
    stage: string, 
    completedMissions: any[], 
    project: Project
  ): number {
    // Lógica de cálculo de score baseada em:
    // - Número de missões completadas
    // - Dificuldade das missões
    // - Métricas originais do diagnóstico
    
    const baseScore = project.currentScores[stage as keyof ProjectScores] || 0;
    const missionBonus = completedMissions.length * 10; // 10 pontos por missão
    const difficultyBonus = completedMissions.reduce((acc, mission) => {
      return acc + (mission.difficulty === 'hard' ? 15 : mission.difficulty === 'medium' ? 10 : 5);
    }, 0);
    
    return Math.min(100, baseScore + missionBonus + difficultyBonus);
  }
  
  private calculateOverallScore(
    currentScores: ProjectScores,
    updatedStage: string,
    newStageScore: number
  ): number {
    const scores = { ...currentScores };
    scores[updatedStage as keyof ProjectScores] = newStageScore;
    
    return Math.round((scores.topo + scores.meio + scores.fundo + scores.pos) / 4);
  }
  
  private generateStageInsights(
    stage: string,
    completedMissions: any[],
    project: Project
  ): string[] {
    const insights: string[] = [];
    
    if (completedMissions.length === 0) {
      insights.push(`Nenhuma missão completada em ${stage}. Comece pelas missões básicas.`);
    } else if (completedMissions.length >= 3) {
      insights.push(`Excelente progresso em ${stage}! ${completedMissions.length} missões completadas.`);
    }
    
    // Adicionar insights específicos por etapa
    switch (stage) {
      case 'topo':
        if (completedMissions.some(m => m.templateId === 'topo-lead-magnet')) {
          insights.push('Lead magnet implementado! Monitore taxa de conversão.');
        }
        break;
      case 'meio':
        if (completedMissions.some(m => m.templateId === 'meio-bot-qualificacao')) {
          insights.push('Bot de qualificação ativo! Acompanhe tempo de resposta.');
        }
        break;
    }
    
    return insights;
  }
  
  private async createScoreUpdateEvent(
    projectId: string,
    newScores: Partial<ProjectScores>
  ): Promise<void> {
    const eventRef = doc(collection(db, `projects/${projectId}/events`));
    
    const event = {
      id: eventRef.id,
      projectId,
      type: 'score_updated',
      title: 'Score Atualizado',
      description: 'Scores do projeto foram recalculados',
      data: {
        newScores,
        scoreChange: newScores.overall || 0
      },
      visibility: 'user',
      importance: 'medium',
      createdAt: new Date()
    };
    
    await addDoc(collection(db, `projects/${projectId}/events`), event);
  }
  
  private async createAuditEvent(
    projectId: string,
    stage: string,
    newScore: number
  ): Promise<void> {
    const eventRef = doc(collection(db, `projects/${projectId}/events`));
    
    const event = {
      id: eventRef.id,
      projectId,
      type: 'audit_run',
      title: 'Reauditoria Executada',
      description: `Reauditoria da etapa ${stage} completada`,
      stage,
      data: {
        newScore,
        auditType: 'stage'
      },
      visibility: 'user',
      importance: 'high',
      createdAt: new Date()
    };
    
    await addDoc(collection(db, `projects/${projectId}/events`), event);
  }
}

export const projectService = new ProjectService();
```

---

## **4. PRÓXIMOS PASSOS DETALHADOS**

### **4.1 Fase 1: Estrutura Base (Semana 1)**

#### **Dia 1-2: Setup Firestore e Types**
- [ ] Criar `studio/src/lib/types-dashboard.ts` com todas as interfaces
- [ ] Configurar Firestore rules em `firestore.rules`
- [ ] Criar índices necessários no Firebase Console
- [ ] Implementar converters Firestore para Date/Timestamp

#### **Dia 3-4: Serviços Base**
- [ ] Implementar `WalletService` completo
- [ ] Implementar `ProjectService` básico
- [ ] Implementar `MissionService` inicial
- [ ] Criar hooks React para cada serviço

#### **Dia 5-7: Layout e Componentes Base**
- [ ] Criar rota `/dashboard/[projectId]`
- [ ] Implementar layout 4x4 responsivo
- [ ] Criar componentes `StageCard`, `MissionCard`, `WalletDisplay`
- [ ] Implementar sistema de expansão/contração

### **4.2 Fase 2: Funcionalidades Core (Semana 2)**

#### **Dia 8-10: Sistema de Missões**
- [ ] Implementar biblioteca de templates de missões
- [ ] Criar sistema de checklist interativo
- [ ] Implementar lógica de unlock de missões
- [ ] Criar eventos de progresso

#### **Dia 11-12: Sistema de Wallet**
- [ ] Implementar dedução de créditos
- [ ] Criar alertas de wallet baixo
- [ ] Implementar histórico de transações
- [ ] Criar componentes de recarga

#### **Dia 13-14: Agentes Básicos**
- [ ] Implementar micro-agentes por etapa
- [ ] Criar sistema de interações
- [ ] Implementar cobrança de créditos
- [ ] Criar logs de conversas

### **4.3 Fase 3: Experiência Premium (Semana 3)**

#### **Dia 15-17: Ofertas Comerciais**
- [ ] Implementar pop-ups contextuais
- [ ] Criar cards de ofertas de serviços
- [ ] Integrar links WhatsApp
- [ ] Implementar tracking de conversões

#### **Dia 18-19: Reauditoria e Scores**
- [ ] Implementar macro-agente orquestrador
- [ ] Criar sistema de reauditoria automática
- [ ] Implementar atualização de scores
- [ ] Criar timeline de progresso

#### **Dia 20-21: Mobile e Responsividade**
- [ ] Implementar tabs para mobile
- [ ] Otimizar componentes para touch
- [ ] Criar navegação mobile-first
- [ ] Testes em dispositivos reais

### **4.4 Fase 4: Polimento e Launch (Semana 4)**

#### **Dia 22-24: Microanimações e UX**
- [ ] Implementar transições suaves
- [ ] Criar animações de progresso
- [ ] Adicionar feedback visual
- [ ] Implementar confetti em milestones

#### **Dia 25-26: Analytics e Monitoramento**
- [ ] Implementar tracking de eventos
- [ ] Criar dashboard de métricas
- [ ] Configurar alertas de sistema
- [ ] Implementar logs de erro

#### **Dia 27-28: Testes e Deploy**
- [ ] Testes de integração completos
- [ ] Testes de performance
- [ ] Deploy em staging
- [ ] Deploy em produção

---

## **5. CONSIDERAÇÕES TÉCNICAS**

### **5.1 Performance**

```typescript
// Otimizações de Performance
const optimizations = {
  // Lazy loading de componentes
  lazyComponents: [
    'MissionExpanded',
    'ServiceOfferModal',
    'ChatInterface'
  ],
  
  // Cache de dados
  cacheStrategy: {
    projects: '5min',
    missions: '2min',
    wallet: '30s'
  },
  
  // Debounce de atualizações
  debounceConfig: {
    missionProgress: 500,
    walletUpdates: 1000,
    scoreCalculation: 2000
  }
};
```

### **5.2 Segurança**

```typescript
// Validações de Segurança
const securityValidations = {
  // Validação de créditos antes de ações
  validateCredits: async (userId: string, cost: number) => {
    const hasCredits = await walletService.hasEnoughCredits(userId, cost);
    if (!hasCredits) {
      throw new Error('Créditos insuficientes');
    }
  },
  
  // Validação de propriedade de projeto
  validateProjectOwnership: async (userId: string, projectId: string) => {
    const project = await projectService.getProject(projectId);
    if (!project || project.userId !== userId) {
      throw new Error('Acesso negado');
    }
  },
  
  // Rate limiting por usuário
  rateLimiting: {
    agentInteractions: '10/min',
    missionUpdates: '50/min',
    walletOperations: '20/min'
  }
};
```

### **5.3 Monitoramento e Analytics**

```typescript
// Sistema de Analytics
const analytics = {
  // Eventos de tracking
  trackEvent: (eventName: string, properties: Record<string, any>) => {
    // Implementar com Firebase Analytics ou Mixpanel
    console.log('Analytics:', eventName, properties);
  },
  
  // Métricas de negócio
  businessMetrics: [
    'mission_completion_rate',
    'agent_usage_frequency',
    'credit_consumption_rate',
    'service_offer_conversion',
    'user_retention_rate'
  ],
  
  // Alertas de sistema
  systemAlerts: {
    highCreditUsage: 'credits_per_hour > 1000',
    lowMissionCompletion: 'completion_rate < 0.3',
    errorRate: 'error_rate > 0.05'
  }
};
```

---

## **6. HOOKS E CONTEXTOS REACT**

### **6.1 Dashboard Context**

```typescript
// studio/src/contexts/DashboardContext.tsx

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { projectService } from '@/lib/services/projects';
import { missionService } from '@/lib/services/missions';
import { walletService } from '@/lib/services/wallet';
import type { Project, Mission, User, WalletTransaction } from '@/lib/types-dashboard';

interface DashboardContextType {
  // Estado
  project: Project | null;
  missions: Mission[];
  user: User | null;
  wallet: {
    credits: number;
    transactions: WalletTransaction[];
    alerts: {
      showLowCredits: boolean;
      showNoCredits: boolean;
      alertLevel: 'none' | 'warning' | 'critical';
    };
  };
  
  // Loading states
  isLoading: boolean;
  isLoadingMissions: boolean;
  isLoadingWallet: boolean;
  
  // UI state
  expandedStage: string | null;
  selectedMission: Mission | null;
  
  // Actions
  loadProject: (projectId: string) => Promise<void>;
  updateMissionChecklist: (missionId: string, checklistItemId: string, completed: boolean) => Promise<void>;
  executeWithAgent: (missionId: string) => Promise<void>;
  expandStage: (stage: string) => void;
  collapseStage: () => void;
  selectMission: (mission: Mission) => void;
  runStageAudit: (stage: string) => Promise<void>;
  
  // Wallet actions
  deductCredits: (amount: number, description: string, metadata?: any) => Promise<void>;
  refreshWallet: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ 
  children, 
  projectId 
}: { 
  children: React.ReactNode;
  projectId: string;
}) {
  const { user } = useAuth();
  
  // Estado
  const [project, setProject] = useState<Project | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [wallet, setWallet] = useState({
    credits: 0,
    transactions: [],
    alerts: {
      showLowCredits: false,
      showNoCredits: false,
      alertLevel: 'none' as const
    }
  });
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMissions, setIsLoadingMissions] = useState(false);
  const [isLoadingWallet, setIsLoadingWallet] = useState(false);
  
  // UI state
  const [expandedStage, setExpandedStage] = useState<string | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  
  // Carregar projeto
  const loadProject = useCallback(async (projectId: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Carregar projeto
      const projectData = await projectService.getProject(projectId);
      if (!projectData) {
        throw new Error('Projeto não encontrado');
      }
      
      setProject(projectData);
      
      // Carregar missões
      setIsLoadingMissions(true);
      const allMissions: Mission[] = [];
      
      for (const stage of ['topo', 'meio', 'fundo', 'pos'] as const) {
        const stageMissions = await missionService.getMissionsByStage(projectId, stage);
        allMissions.push(...stageMissions);
      }
      
      setMissions(allMissions);
      setIsLoadingMissions(false);
      
    } catch (error) {
      console.error('Erro ao carregar projeto:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  // Carregar wallet
  const refreshWallet = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoadingWallet(true);
      
      // Buscar dados do usuário (incluindo wallet)
      const userData = await userService.getUser(user.uid);
      if (userData) {
        const alerts = walletService.getWalletAlerts(userData.wallet.credits);
        
        setWallet({
          credits: userData.wallet.credits,
          transactions: await walletService.getTransactionHistory(user.uid, 20),
          alerts
        });
      }
      
    } catch (error) {
      console.error('Erro ao carregar wallet:', error);
    } finally {
      setIsLoadingWallet(false);
    }
  }, [user]);
  
  // Atualizar checklist de missão
  const updateMissionChecklist = useCallback(async (
    missionId: string, 
    checklistItemId: string, 
    completed: boolean
  ) => {
    if (!project) return;
    
    try {
      await missionService.updateMissionChecklist(
        project.id, 
        missionId, 
        checklistItemId, 
        completed
      );
      
      // Recarregar missões
      await loadProject(project.id);
      
    } catch (error) {
      console.error('Erro ao atualizar checklist:', error);
    }
  }, [project, loadProject]);
  
  // Executar com agente
  const executeWithAgent = useCallback(async (missionId: string) => {
    if (!user || !project) return;
    
    try {
      // Verificar créditos
      if (wallet.credits < 5) {
        throw new Error('Créditos insuficientes');
      }
      
      // Deduzir créditos
      await deductCredits(5, 'Execução de missão com agente', {
        projectId: project.id,
        missionId
      });
      
      // Aqui integraria com o sistema de agentes
      console.log('Executando missão com agente:', missionId);
      
    } catch (error) {
      console.error('Erro ao executar com agente:', error);
    }
  }, [user, project, wallet.credits]);
  
  // Deduzir créditos
  const deductCredits = useCallback(async (
    amount: number, 
    description: string, 
    metadata?: any
  ) => {
    if (!user) return;
    
    try {
      await walletService.deductCredits(user.uid, amount, description, metadata);
      await refreshWallet();
      
    } catch (error) {
      console.error('Erro ao deduzir créditos:', error);
      throw error;
    }
  }, [user, refreshWallet]);
  
  // Executar reauditoria
  const runStageAudit = useCallback(async (stage: string) => {
    if (!project) return;
    
    try {
      const result = await projectService.runStageAudit(project.id, stage as any);
      
      // Recarregar projeto para ver novos scores
      await loadProject(project.id);
      
      console.log('Reauditoria concluída:', result);
      
    } catch (error) {
      console.error('Erro na reauditoria:', error);
    }
  }, [project, loadProject]);
  
  // UI actions
  const expandStage = useCallback((stage: string) => {
    setExpandedStage(expandedStage === stage ? null : stage);
  }, [expandedStage]);
  
  const collapseStage = useCallback(() => {
    setExpandedStage(null);
  }, []);
  
  const selectMission = useCallback((mission: Mission) => {
    setSelectedMission(mission);
  }, []);
  
  // Efeitos
  useEffect(() => {
    if (projectId && user) {
      loadProject(projectId);
      refreshWallet();
    }
  }, [projectId, user, loadProject, refreshWallet]);
  
  const value: DashboardContextType = {
    // Estado
    project,
    missions,
    user,
    wallet,
    
    // Loading states
    isLoading,
    isLoadingMissions,
    isLoadingWallet,
    
    // UI state
    expandedStage,
    selectedMission,
    
    // Actions
    loadProject,
    updateMissionChecklist,
    executeWithAgent,
    expandStage,
    collapseStage,
    selectMission,
    runStageAudit,
    
    // Wallet actions
    deductCredits,
    refreshWallet
  };
  
  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
```

### **6.2 Custom Hooks**

```typescript
// studio/src/hooks/useMissions.ts

import { useState, useEffect } from 'react';
import { missionService } from '@/lib/services/missions';
import type { Mission } from '@/lib/types-dashboard';

export function useMissions(projectId: string, stage?: string) {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadMissions() {
      try {
        setIsLoading(true);
        setError(null);
        
        if (stage) {
          const stageMissions = await missionService.getMissionsByStage(projectId, stage as any);
          setMissions(stageMissions);
        } else {
          // Carregar todas as missões
          const allMissions: Mission[] = [];
          for (const s of ['topo', 'meio', 'fundo', 'pos'] as const) {
            const stageMissions = await missionService.getMissionsByStage(projectId, s);
            allMissions.push(...stageMissions);
          }
          setMissions(allMissions);
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar missões');
      } finally {
        setIsLoading(false);
      }
    }
    
    if (projectId) {
      loadMissions();
    }
  }, [projectId, stage]);
  
  return { missions, isLoading, error };
}

// studio/src/hooks/useWallet.ts

import { useState, useEffect } from 'react';
import { walletService } from '@/lib/services/wallet';
import type { WalletTransaction } from '@/lib/types-dashboard';

export function useWallet(userId: string) {
  const [credits, setCredits] = useState(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [alerts, setAlerts] = useState({
    showLowCredits: false,
    showNoCredits: false,
    alertLevel: 'none' as const
  });
  const [isLoading, setIsLoading] = useState(true);
  
  const refreshWallet = async () => {
    try {
      setIsLoading(true);
      
      // Buscar transações recentes
      const recentTransactions = await walletService.getTransactionHistory(userId, 20);
      setTransactions(recentTransactions);
      
      // Calcular créditos atuais (seria melhor buscar do documento do usuário)
      const currentCredits = recentTransactions.length > 0 
        ? recentTransactions[0].balanceAfter 
        : 100; // Default para novos usuários
      
      setCredits(currentCredits);
      
      // Calcular alertas
      const walletAlerts = walletService.getWalletAlerts(currentCredits);
      setAlerts(walletAlerts);
      
    } catch (error) {
      console.error('Erro ao carregar wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (userId) {
      refreshWallet();
    }
  }, [userId]);
  
  return {
    credits,
    transactions,
    alerts,
    isLoading,
    refreshWallet
  };
}
```

---

## **7. COMPONENTES UI PRINCIPAIS**

### **7.1 Estrutura de Componentes**

```typescript
// Hierarquia de componentes do Dashboard
const componentHierarchy = {
  'DashboardPage': {
    'DashboardHeader': [
      'ProjectInfo',
      'WalletDisplay', 
      'ScoreCircle',
      'ActionButtons'
    ],
    'DashboardGrid': [
      'StageCard[]',
      'ExpandedStagePanel?'
    ],
    'FloatingChat': [],
    'CommercialModals': [
      'ServiceOfferModal',
      'UpgradeModal',
      'WhatsAppModal'
    ]
  }
};
```

### **7.2 Componentes Principais**

```typescript
// studio/src/components/dashboard/StageCard.tsx

interface StageCardProps {
  stage: 'topo' | 'meio' | 'fundo' | 'pos';
  score: number;
  progress: { completed: number; total: number };
  missions: Mission[];
  expanded: boolean;
  onClick: () => void;
}

// studio/src/components/dashboard/MissionCard.tsx

interface MissionCardProps {
  mission: Mission;
  onChecklistUpdate: (itemId: string, completed: boolean) => void;
  onExecuteWithAgent: () => void;
  onShowServiceOffer: () => void;
}

// studio/src/components/dashboard/WalletDisplay.tsx

interface WalletDisplayProps {
  credits: number;
  alerts: WalletAlerts;
  onUpgrade: () => void;
}
```

---

## **8. RESUMO EXECUTIVO**

### **8.1 Arquitetura Técnica**

✅ **Firestore como Backend**: Estrutura escalável com collections hierárquicas
✅ **TypeScript Types**: Interfaces completas com converters Firestore
✅ **Serviços Modulares**: WalletService, MissionService, ProjectService
✅ **React Context**: Estado global com DashboardProvider
✅ **Security Rules**: Acesso controlado por usuário
✅ **Real-time Updates**: Sincronização automática de dados

### **8.2 Funcionalidades Core**

✅ **Sistema de Missões**: Templates, checklists, unlock conditions
✅ **Wallet de Créditos**: Transações atômicas, alertas, histórico
✅ **Agentes IA**: Micro-agentes por etapa, cobrança por uso
✅ **Reauditoria**: Recálculo automático de scores
✅ **Ofertas Comerciais**: Pop-ups contextuais, integração WhatsApp
✅ **Timeline de Eventos**: Histórico completo de ações

### **8.3 Experiência do Usuário**

✅ **Layout 4x4**: Grid responsivo com expansão Notion-like
✅ **Cores Consistentes**: Mesmo design system do live dashboard
✅ **Mobile First**: Tabs navigation, componentes touch-friendly
✅ **Microanimações**: Feedback visual, transições suaves
✅ **Gamificação**: Progresso, milestones, confetti

### **8.4 Cronograma de Implementação**

**Semana 1**: Estrutura base + Firestore setup
**Semana 2**: Funcionalidades core + Sistema de missões
**Semana 3**: Experiência premium + Ofertas comerciais  
**Semana 4**: Polimento + Deploy

### **8.5 Próximos Passos Imediatos**

1. **Criar types-dashboard.ts** com todas as interfaces
2. **Configurar Firestore rules** e índices
3. **Implementar serviços base** (Wallet, Mission, Project)
4. **Criar rota /dashboard/[projectId]** com layout básico
5. **Implementar componentes StageCard** e sistema de expansão

---

## **CONCLUSÃO**

Este blueprint fornece uma arquitetura completa e detalhada para o Dashboard Executivo V4SalesAI. A implementação seguirá uma abordagem incremental, garantindo que cada fase entregue valor funcional enquanto constrói a base para as próximas funcionalidades.

O sistema foi projetado para ser:
- **Escalável**: Arquitetura Firestore suporta crescimento
- **Seguro**: Rules e validações em múltiplas camadas  
- **Performante**: Cache, lazy loading, debounce
- **Monetizável**: Sistema de créditos e ofertas integradas
- **Engajante**: UX gamificada com progresso visual

A combinação de missões práticas, agentes IA especializados e ofertas comerciais contextuais cria um ecossistema completo que guia o usuário desde o diagnóstico até a implementação de melhorias, maximizando tanto o valor entregue quanto as oportunidades de receita.
