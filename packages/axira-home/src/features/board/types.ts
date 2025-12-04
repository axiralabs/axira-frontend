// Board Intelligence Types - Executive Dashboard for Board Members

// ============================================
// SOURCE SYSTEMS
// ============================================

export type SourceSystem =
  | 'SILVERLAKE_CORE'       // Jack Henry Silverlake - Core Banking
  | 'SYNERGY_DMS'           // Synergy - Document Management System
  | 'SHAREPOINT'            // SharePoint - Policy Documents
  | 'LEXISNEXIS'            // LexisNexis - KYC/AML Data
  | 'CARD_PROCESSOR'        // Debit/Credit Card Processing
  | 'LOAN_ORIGINATION'      // Loan Origination System
  | 'CRM_SYSTEM'            // Customer Relationship Management
  | 'HR_SYSTEM'             // HR & Staffing Data
  | 'AXIRA_ANALYTICS'       // Axira Internal Analytics
  | 'REGULATORY_FEED';      // Regulatory Update Feed

export const SOURCE_SYSTEM_CONFIG: Record<SourceSystem, {
  label: string;
  icon: string;
  color: string;
}> = {
  SILVERLAKE_CORE: { label: 'Jack Henry Silverlake', icon: 'database', color: 'text-blue-400' },
  SYNERGY_DMS: { label: 'Synergy DMS', icon: 'folder', color: 'text-green-400' },
  SHAREPOINT: { label: 'SharePoint', icon: 'file-text', color: 'text-orange-400' },
  LEXISNEXIS: { label: 'LexisNexis', icon: 'shield', color: 'text-purple-400' },
  CARD_PROCESSOR: { label: 'Card Processor', icon: 'credit-card', color: 'text-cyan-400' },
  LOAN_ORIGINATION: { label: 'Loan Origination', icon: 'landmark', color: 'text-yellow-400' },
  CRM_SYSTEM: { label: 'CRM', icon: 'users', color: 'text-pink-400' },
  HR_SYSTEM: { label: 'HR System', icon: 'briefcase', color: 'text-indigo-400' },
  AXIRA_ANALYTICS: { label: 'Axira Analytics', icon: 'bar-chart', color: 'text-emerald-400' },
  REGULATORY_FEED: { label: 'Regulatory Feed', icon: 'bell', color: 'text-red-400' },
};

// ============================================
// EVIDENCE & AUDIT TRAIL
// ============================================

export interface EvidenceSource {
  id: string;
  system: SourceSystem;
  description: string;
  documentId?: string;
  documentName?: string;
  url?: string;
  accessedAt: string;
  dataPoint?: string;          // Specific data retrieved
  policyReference?: string;    // Policy that allows this access
}

export interface DecisionStep {
  id: string;
  stepNumber: number;
  description: string;
  agentName: string;           // Which Process Agent
  skillName: string;           // Which Skill
  sources: EvidenceSource[];
  outcome: 'PASS' | 'WARNING' | 'FAIL' | 'INFO';
  durationMs: number;
  timestamp: string;
}

export interface AuditTrail {
  id: string;
  queryText: string;
  requestedAt: string;
  completedAt: string;
  totalDurationMs: number;
  userId: string;
  tenantId: string;
  decisionSteps: DecisionStep[];
  hashChain: {
    hash: string;
    previousHash: string;
    verified: boolean;
  };
  accessDecisions: AccessDecision[];
}

export interface AccessDecision {
  id: string;
  resource: string;
  resourceType: string;
  action: 'ALLOWED' | 'DENIED';
  reason: string;
  policyRef: string;
  timestamp: string;
}

// ============================================
// BOARD METRICS & KPIs
// ============================================

export type MetricTrend = 'UP' | 'DOWN' | 'STABLE';
export type MetricStatus = 'GOOD' | 'WARNING' | 'CRITICAL';

export interface BoardMetric {
  id: string;
  label: string;
  value: string | number;
  previousValue?: string | number;
  unit?: string;
  trend: MetricTrend;
  trendValue?: string;        // e.g., "+15%"
  status: MetricStatus;
  source: SourceSystem;
  lastUpdated: string;
}

export interface BranchMetrics {
  branchId: string;
  branchName: string;
  branchManager: string;

  // Financial Metrics (Executive Level)
  revenue: number;              // Quarterly revenue in millions
  revenueTrend: MetricTrend;
  revenueChange: number;        // % change

  deposits: number;             // Total deposits in millions
  depositsTrend: MetricTrend;
  depositsChange: number;

  loanPortfolio: number;        // Total loans in millions
  loanPortfolioTrend: MetricTrend;
  loanPortfolioChange: number;

  // Profitability Metrics
  netInterestMargin: number;    // NIM as percentage
  nimTrend: MetricTrend;

  efficiency: number;           // Efficiency ratio (lower is better)
  efficiencyTrend: MetricTrend;

  // Growth Metrics
  newAccounts: number;          // New accounts this quarter
  newAccountsTrend: MetricTrend;
  newAccountsChange: number;

  customerGrowth: number;       // % customer growth YoY

  // Customer Experience
  npsScore: number;             // Net Promoter Score
  npsTrend: MetricTrend;

  customerSatisfaction: number; // Satisfaction score out of 100
  satisfactionTrend: MetricTrend;

  // Operational Health
  employeeCount: number;
  revenuePerEmployee: number;   // Revenue per employee in thousands

  status: MetricStatus;
}

// ============================================
// STRATEGIC INSIGHTS
// ============================================

export type InsightCategory =
  | 'INVEST'        // Recommend investment
  | 'WATCH'         // Monitor closely
  | 'OPTIMIZE'      // Improve efficiency
  | 'RISK';         // Risk alert

export type InsightPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface StrategicInsight {
  id: string;
  category: InsightCategory;
  priority: InsightPriority;
  title: string;
  summary: string;
  details: string;
  metrics: BoardMetric[];
  recommendation?: string;
  estimatedImpact?: string;   // e.g., "$2.1M revenue opportunity"
  sources: EvidenceSource[];
  relatedBranches?: string[];
  createdAt: string;
}

// ============================================
// BOARD Q&A CONVERSATION
// ============================================

export type MessageRole = 'user' | 'assistant';

export interface BoardMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;

  // Assistant-specific fields
  structuredResponse?: BoardStructuredResponse;
  planningContext?: BoardPlanningContext;
  auditTrail?: AuditTrail;
  isStreaming?: boolean;
}

export interface BoardStructuredResponse {
  summaryItems: BoardSummaryItem[];
  insights?: StrategicInsight[];
  branchMetrics?: BranchMetrics[];
  citations: BoardCitation[];
  availableActions: BoardAction[];
}

export interface BoardSummaryItem {
  id: string;
  status: 'PASS' | 'WARNING' | 'FAIL' | 'INFO' | 'DENIED';
  title: string;
  message: string;
  details?: string;
  metric?: {
    value: string;
    trend?: MetricTrend;
    trendValue?: string;
  };
  subItems?: BoardSummaryItem[];
}

export interface BoardCitation {
  id: string;
  source: SourceSystem;
  label: string;
  description: string;
  url?: string;
  documentId?: string;
  policyRef?: string;
}

export interface BoardAction {
  id: string;
  label: string;
  actionType: 'VIEW_DETAILS' | 'DOWNLOAD_REPORT' | 'SCHEDULE_REVIEW' | 'DRILL_DOWN' | 'OPEN_EVIDENCE';
  primary?: boolean;
  icon?: string;
}

export interface BoardPlanningContext {
  isPlanning: boolean;
  currentAgent?: string;
  currentSkill?: string;
  stepsCompleted: number;
  totalSteps: number;
  steps: {
    id: string;
    name: string;
    status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
    agentName: string;
    skillName?: string;
    durationMs?: number;
  }[];
}

// ============================================
// BOARD DASHBOARD STATE
// ============================================

export interface BoardDashboardState {
  selectedBranch: string | null;
  selectedTimeRange: 'TODAY' | 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR';
  activeInsightCategory: InsightCategory | null;
  evidencePanelOpen: boolean;
  selectedAuditTrail: AuditTrail | null;
}

// ============================================
// STYLE CONFIGURATIONS
// ============================================

export const INSIGHT_CATEGORY_STYLES: Record<InsightCategory, {
  label: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  icon: string;
}> = {
  INVEST: {
    label: 'Invest',
    bgColor: 'bg-green-900/50',
    textColor: 'text-green-400',
    borderColor: 'border-green-500',
    icon: 'trending-up',
  },
  WATCH: {
    label: 'Watch Closely',
    bgColor: 'bg-amber-900/50',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500',
    icon: 'eye',
  },
  OPTIMIZE: {
    label: 'Optimize',
    bgColor: 'bg-blue-900/50',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500',
    icon: 'settings',
  },
  RISK: {
    label: 'Risk Alert',
    bgColor: 'bg-red-900/50',
    textColor: 'text-red-400',
    borderColor: 'border-red-500',
    icon: 'alert-triangle',
  },
};

export const METRIC_STATUS_STYLES: Record<MetricStatus, {
  bgColor: string;
  textColor: string;
  dotColor: string;
}> = {
  GOOD: {
    bgColor: 'bg-green-900/30',
    textColor: 'text-green-400',
    dotColor: 'bg-green-500',
  },
  WARNING: {
    bgColor: 'bg-amber-900/30',
    textColor: 'text-amber-400',
    dotColor: 'bg-amber-500',
  },
  CRITICAL: {
    bgColor: 'bg-red-900/30',
    textColor: 'text-red-400',
    dotColor: 'bg-red-500',
  },
};

export const TREND_ICONS: Record<MetricTrend, string> = {
  UP: 'arrow-up',
  DOWN: 'arrow-down',
  STABLE: 'minus',
};
