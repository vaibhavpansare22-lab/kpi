export type UserRole = 'admin' | 'manager' | 'employee';
export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  managerId: string | null;
  department: string;
  title: string;
  avatar: string;
  status: UserStatus;
  joinedDate: string;
  phone?: string;
  location?: string;
}

export type TaskStatus = 'not_started' | 'in_progress' | 'completed' | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskSource = 'manual' | 'rally' | 'workday';

export interface Task {
  id: string;
  assignedTo: string; // userId
  createdBy: string;  // userId
  title: string;
  description: string;
  category: string;
  startDate: string;
  dueDate: string;
  completedDate?: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimatedHours: number;
  actualHours: number;
  source: TaskSource;
  approved?: boolean;
  storyPoints?: number;
  externalRef?: string;
}

export type MetricType = 'numeric' | 'percentage' | 'boolean' | 'rating_scale';
export type KpiFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly';
export type MetricDirection = 'higher_is_better' | 'lower_is_better';

export interface KPI {
  id: string;
  name: string;
  description: string;
  ownerManagerId: string; // manager who created this
  appliesToUserIds: string[] | 'ALL'; // specific user ids or all direct reports
  metricType: MetricType;
  direction: MetricDirection;
  targetValue: number;
  weight: number; // e.g. 15 for 15%
  frequency: KpiFrequency;
  unit: string; // '%', 'pts', 'hrs', 'score', 'tasks'
  isSystemCalculated?: boolean;
  systemCalculationType?: 'task_completion_rate' | 'on_time_delivery' | 'cycle_time' | 'rally_story_points' | 'workday_utilization' | 'defect_rate' | 'manager_rating';
}

export interface KPIResult {
  id: string;
  kpiId: string;
  userId: string;
  period: string; // e.g., 'August 2026', 'Q3 2026', 'Week 34'
  actualValue: number;
  computedScore: number; // 0 - 100
  notes?: string;
  updatedDate: string;
  evaluatorId?: string;
}

export type IntegrationType = 'rally' | 'workday';
export type ConnectionStatus = 'connected' | 'disconnected' | 'syncing' | 'error';
export type SyncFrequency = 'hourly' | 'daily' | 'weekly' | 'manual';

export interface Integration {
  id: string;
  type: IntegrationType;
  name: string;
  connectionStatus: ConnectionStatus;
  apiEndpoint: string;
  authToken: string;
  tenantOrWorkspaceId: string;
  syncFrequency: SyncFrequency;
  lastSyncedAt: string | null;
  recordsCount: number;
  errorMessage?: string;
  autoSync: boolean;
}

export type PeriodType = 'weekly' | 'monthly' | 'quarterly';

export interface UserPerformanceSummary {
  userId: string;
  user: User;
  overallScore: number;
  scoreTrend: number; // e.g. +4.5% vs previous period
  previousPeriodScore: number;
  completedTasksCount: number;
  totalTasksCount: number;
  taskCompletionRate: number;
  onTimeDeliveryRate: number;
  avgCycleTimeDays: number;
  kpiScores: {
    kpi: KPI;
    actualValue: number;
    targetValue: number;
    score: number;
    status: 'exceeded' | 'met' | 'at_risk' | 'lagging';
    history: { period: string; value: number; score: number }[];
  }[];
  scoreHistory: { period: string; score: number; tasksCount: number }[];
}

export interface OrgHierarchyNode {
  user: User;
  directReports: OrgHierarchyNode[];
}
