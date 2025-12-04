// Branch Manager specific types for Guardian view

import type { PulseItem, PulsePriority, BriefInsight, Meeting } from '../types';

// =====================================================
// USER CONTEXT & ROLES
// =====================================================

export type UserRole =
  | 'BRANCH_BANKER'      // Maya - handles individual customers
  | 'BRANCH_MANAGER'     // Alex - oversees branch operations
  | 'QA_REVIEWER'        // Reviews compliance cases
  | 'OPS_LEAD'           // Operational leadership
  | 'IT_ADMIN';          // System administration

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branch?: BranchInfo;
  team?: TeamMember[];
  avatar?: string;
  initials: string;
}

export interface BranchInfo {
  id: string;
  name: string;
  region: string;
  tier: 'FLAGSHIP' | 'STANDARD' | 'COMMUNITY';
}

// =====================================================
// BRANCH HEALTH METRICS
// =====================================================

export interface BranchHealth {
  branchId: string;
  branchName: string;

  // Overall efficiency score (0-100)
  efficiencyScore: number;
  efficiencyTrend: 'UP' | 'DOWN' | 'STABLE';
  efficiencyChange: number; // +/-% from last period

  // Component scores
  metrics: BranchMetric[];

  // Comparison to region
  regionAverage: number;
  rankInRegion: number;
  totalBranchesInRegion: number;

  // Last updated
  asOf: string;
}

export interface BranchMetric {
  id: string;
  name: string;
  category: 'EFFICIENCY' | 'COMPLIANCE' | 'CUSTOMER' | 'TEAM';

  // Current value
  value: number;
  unit: string; // '%', 'min', 'count', 'score'

  // Target
  target?: number;
  targetLabel?: string;

  // Status
  status: 'GOOD' | 'WARNING' | 'CRITICAL';

  // Trend
  trend: 'UP' | 'DOWN' | 'STABLE';
  changePercent?: number;

  // For drill-down
  drillDownAvailable: boolean;
}

// =====================================================
// TEAM MANAGEMENT
// =====================================================

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  initials: string;

  // Workload
  pendingItems: number;
  avgItemsPerDay: number;
  capacityUsed: number; // 0-100%
  workloadStatus: 'LIGHT' | 'NORMAL' | 'HEAVY' | 'OVERLOADED';

  // Performance
  completionRate: number;
  avgHandlingTime: number; // minutes

  // Availability
  isAvailable: boolean;
  outOfOfficeUntil?: string;

  // Specializations
  certifications: string[];
  territories: string[];
}

export interface TeamWorkload {
  branchId: string;
  totalPendingItems: number;
  teamSize: number;
  avgItemsPerBanker: number;

  // Distribution analysis
  distribution: 'EVEN' | 'UNEVEN' | 'CRITICAL';
  overloadedCount: number;
  underutilizedCount: number;

  // Members sorted by workload
  members: TeamMember[];

  // Recommendations
  recommendations: WorkloadRecommendation[];
}

export interface WorkloadRecommendation {
  id: string;
  type: 'REDISTRIBUTE' | 'TRAINING' | 'TERRITORY' | 'TEMPORARY_HELP';
  title: string;
  description: string;
  impact: string;

  // For redistribute
  fromMember?: string;
  toMember?: string;
  itemCount?: number;

  // For training
  trainingName?: string;
  trainingDate?: string;

  // Actions
  primaryAction: { label: string; action: string };
  secondaryActions?: { label: string; action: string }[];
}

// =====================================================
// OPERATIONAL BOTTLENECKS
// =====================================================

export interface OperationalBottleneck {
  id: string;
  priority: PulsePriority;

  // What process is affected
  processName: string;
  processId: string;

  // The problem
  title: string;
  summary: string;

  // Impact metrics
  currentValue: number;
  targetValue: number;
  unit: string;
  deviation: number; // % above/below target

  // Affected items
  affectedCount: number;
  affectedLabel: string; // "accounts", "customers", etc.

  // Root cause analysis
  rootCauses: RootCause[];

  // Time range
  detectedAt: string;
  timePeriod: string; // "This week", "Last 7 days", etc.

  // Comparison
  comparison?: {
    branchName: string;
    value: number;
    difference: number;
  };

  // Recommendation
  recommendation?: BottleneckRecommendation;

  // Actions
  actions: BottleneckAction[];
}

export interface RootCause {
  id: string;
  description: string;
  percentage: number; // % of issues caused by this
  isActionable: boolean;
}

export interface BottleneckRecommendation {
  title: string;
  description: string;
  evidence?: string; // "Edinburg Branch enabled this → failures dropped 60%"
  effort: 'LOW' | 'MEDIUM' | 'HIGH';
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface BottleneckAction {
  id: string;
  label: string;
  type: 'PRIMARY' | 'SECONDARY';
  action: string;
}

// =====================================================
// VIP ESCALATIONS
// =====================================================

export interface VIPEscalation {
  id: string;
  priority: 'URGENT' | 'HIGH';

  // Customer info
  customerId: string;
  customerName: string;
  relationshipValue: number;
  relationshipTenure: number; // years
  customerTier: 'VIP' | 'PREMIER' | 'STANDARD';

  // The issue
  issueType: string;
  issueTitle: string;
  issueSummary: string;
  issueDetails?: string;

  // Status
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'ESCALATED';
  openDuration: string; // "4 hours", "2 days"
  openDurationMinutes: number;

  // Sentiment
  customerSentiment: 'FRUSTRATED' | 'CONCERNED' | 'NEUTRAL' | 'SATISFIED';
  contactCount: number; // How many times they've called
  lastContact?: string;

  // Who flagged it
  escalatedBy: string;
  escalatedByRole: string;
  escalatedAt: string;

  // Risk assessment
  attritionRisk: 'HIGH' | 'MEDIUM' | 'LOW';
  axiraAssessment?: {
    recommendation: string;
    confidence: number;
    reasoning: string;
  };

  // Prepared materials
  preparedMaterials: PreparedMaterial[];

  // Actions
  actions: VIPAction[];
}

export interface PreparedMaterial {
  id: string;
  type: 'AUTHORIZATION' | 'TALKING_POINTS' | 'RETENTION_OFFER' | 'FORM' | 'HISTORY';
  title: string;
  description?: string;
  status: 'READY' | 'GENERATING' | 'NOT_AVAILABLE';
}

export interface VIPAction {
  id: string;
  label: string;
  type: 'PRIMARY' | 'SECONDARY' | 'TERTIARY';
  action: string;
  icon?: string;
}

// =====================================================
// BRANCH MANAGER PULSE ITEMS
// =====================================================

// Extended pulse item for manager-specific concerns
export interface ManagerPulseItem extends PulseItem {
  // Manager-specific properties
  affectedTeamMember?: string;
  branchImpact?: 'HIGH' | 'MEDIUM' | 'LOW';
  requiresApproval?: boolean;
  delegatable?: boolean;

  // For bottlenecks
  bottleneck?: OperationalBottleneck;

  // For escalations
  escalation?: VIPEscalation;

  // For team issues
  teamWorkload?: TeamWorkload;
}

// =====================================================
// BRANCH MANAGER DAILY BRIEF
// =====================================================

export interface BranchManagerBrief {
  date: string;
  greeting: string;

  // Branch health summary
  branchHealth: BranchHealth;

  // Counts (manager sees different things)
  vipEscalations: number;
  operationalBottlenecks: number;
  teamIssues: number;
  complianceItems: number;
  opportunities: number;

  // Highlights
  topPriority?: ManagerPulseItem;
  keyInsights: BriefInsight[];

  // Team overview
  teamWorkload: TeamWorkload;

  // Schedule
  meetingsToday: Meeting[];
  nextMeeting?: Meeting;

  // Quick stats
  quickStats: QuickStat[];
}

export interface QuickStat {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'UP' | 'DOWN' | 'STABLE';
  status?: 'GOOD' | 'WARNING' | 'CRITICAL';
}

// =====================================================
// STYLE CONSTANTS
// =====================================================

export const WORKLOAD_STYLES = {
  LIGHT: {
    bg: 'bg-green-500/10',
    text: 'text-green-400',
    bar: 'bg-green-500',
    label: 'Light',
  },
  NORMAL: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    bar: 'bg-blue-500',
    label: 'Normal',
  },
  HEAVY: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    bar: 'bg-amber-500',
    label: 'Heavy',
  },
  OVERLOADED: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    bar: 'bg-red-500',
    label: 'Overloaded',
  },
} as const;

export const METRIC_STATUS_STYLES = {
  GOOD: {
    bg: 'bg-green-500/10',
    text: 'text-green-400',
    icon: 'check-circle',
  },
  WARNING: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    icon: 'alert-circle',
  },
  CRITICAL: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    icon: 'x-circle',
  },
} as const;

export const SENTIMENT_STYLES = {
  FRUSTRATED: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    label: 'Frustrated',
  },
  CONCERNED: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    label: 'Concerned',
  },
  NEUTRAL: {
    bg: 'bg-gray-500/10',
    text: 'text-gray-400',
    label: 'Neutral',
  },
  SATISFIED: {
    bg: 'bg-green-500/10',
    text: 'text-green-400',
    label: 'Satisfied',
  },
} as const;
