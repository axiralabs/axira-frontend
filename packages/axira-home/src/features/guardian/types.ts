// Guardian Types - Proactive Intelligence System

// Priority levels for pulse items
export type PulsePriority = 'URGENT' | 'WATCH' | 'OPPORTUNITY';

// Categories of proactive alerts
export type PulseCategory =
  | 'REGULATORY'      // Compliance deadlines, expirations
  | 'RELATIONSHIP'    // Customer lifecycle events
  | 'RISK'            // Anomaly detection, early warnings
  | 'OPPORTUNITY'     // Cross-sell, retention signals
  | 'OPERATIONAL';    // Process bottlenecks, efficiency

// Subject types that can be associated with pulse items
export type SubjectType = 'CUSTOMER' | 'ACCOUNT' | 'LOAN' | 'CASE';

// Action types that can be taken on pulse items
export type ActionType =
  | 'CALL'
  | 'EMAIL'
  | 'SCHEDULE'
  | 'CREATE_CASE'
  | 'VIEW_DETAILS'
  | 'PREPARE'
  | 'DISMISS';

// Asset types that can be prepared by the Guardian
export type AssetType = 'FORM' | 'TALKING_POINTS' | 'REPORT' | 'DOCUMENT';

// Trend direction for insights
export type TrendDirection = 'UP' | 'DOWN' | 'STABLE';

// Relationship health status
export type RelationshipHealth = 'HEALTHY' | 'AT_RISK' | 'GROWING' | 'DECLINING';

// Relationship lifecycle stage
export type RelationshipStage = 'NEW' | 'ESTABLISHED' | 'MATURE' | 'AT_RISK';

// Event types in relationship timeline
export type RelationshipEventType = 'MILESTONE' | 'RENEWAL' | 'REVIEW' | 'EXPIRATION' | 'OPPORTUNITY';

// An action that can be taken on a pulse item
export interface PulseAction {
  id: string;
  label: string;
  actionType: ActionType;
  primary?: boolean;
  disabled?: boolean;
  disabledReason?: string;
}

// A prepared asset (form, talking points, report)
export interface PreparedAsset {
  id: string;
  type: AssetType;
  title: string;
  description?: string;
  url?: string;
  generatedAt: string;
}

// A single pulse item surfaced by the Guardian
export interface PulseItem {
  id: string;
  priority: PulsePriority;
  category: PulseCategory;

  // Display
  title: string;
  summary: string;
  details?: string;

  // Context
  subjectKey?: string;           // e.g., "customer:garcia-household-001"
  subjectName?: string;          // e.g., "García Household"
  subjectType?: SubjectType;

  // Timing
  dueDate?: string;              // When action needed
  daysUntilDue?: number;
  detectedAt: string;            // When Guardian noticed this

  // Source
  watcherType: string;           // Which watcher detected this
  confidence: number;            // 0-1 confidence score

  // Actions
  suggestedActions: PulseAction[];

  // Preparation
  preparedAssets?: PreparedAsset[];
}

// A brief insight shown in the daily summary
export interface BriefInsight {
  id: string;
  message: string;
  metric?: string;           // e.g., "+15% from last week"
  trend?: TrendDirection;
  source: string;
}

// A meeting in the schedule
export interface Meeting {
  id: string;
  title: string;
  time: string;
  customerName?: string;
  customerId?: string;
  briefingReady: boolean;
}

// Daily Brief - morning intelligence summary
export interface DailyBrief {
  date: string;
  greeting: string;

  // Summary counts
  urgentCount: number;
  watchCount: number;
  opportunityCount: number;

  // Highlights
  topPriority?: PulseItem;
  keyInsights: BriefInsight[];

  // Schedule context
  meetingsToday: Meeting[];
  nextMeeting?: Meeting;
}

// An event in the relationship timeline
export interface RelationshipEvent {
  id: string;
  type: RelationshipEventType;
  title: string;
  date: string;
  daysAway: number;
  automated: boolean;            // Will Guardian handle automatically?
  requiresAction: boolean;
}

// Relationship view for customer lifecycle
export interface CustomerRelationship {
  customerId: string;
  customerName: string;
  relationshipStart: string;      // When became customer
  relationshipHealth: RelationshipHealth;
  healthScore: number;            // 0-100

  // Lifecycle stage
  stage: RelationshipStage;

  // Key metrics
  totalAccounts: number;
  activeProducts: string[];
  lifetimeValue?: number;

  // Recent activity
  lastInteraction: string;
  lastInteractionType: string;

  // Upcoming
  upcomingEvents: RelationshipEvent[];

  // Pulse items for this customer
  activePulseItems: PulseItem[];
}

// Watcher configuration (what the Guardian monitors)
export interface WatcherConfig {
  id: string;
  name: string;
  description: string;
  category: PulseCategory;
  enabled: boolean;

  // What it monitors
  monitoredEntities: string[];   // e.g., ["accounts", "customers"]
  triggers: string[];            // e.g., ["expiration < 30 days"]

  // How it responds
  defaultPriority: PulsePriority;
  autoActions?: string[];        // Actions taken automatically
}

// Pulse summary counts
export interface PulseSummary {
  urgent: number;
  watch: number;
  opportunity: number;
  total: number;
}

// Style configuration for priority levels
export interface PriorityStyles {
  border: string;
  bg: string;
  bgHover: string;
  icon: string;
  badge: string;
  dot: string;
}

// Priority style map
export const PRIORITY_STYLES: Record<PulsePriority, PriorityStyles> = {
  URGENT: {
    border: 'border-l-4 border-l-red-500',
    bg: 'bg-red-500/10',
    bgHover: 'hover:bg-red-500/20',
    icon: 'text-red-500',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400',
    dot: 'bg-red-500',
  },
  WATCH: {
    border: 'border-l-4 border-l-amber-500',
    bg: 'bg-amber-500/10',
    bgHover: 'hover:bg-amber-500/20',
    icon: 'text-amber-500',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  OPPORTUNITY: {
    border: 'border-l-4 border-l-green-500',
    bg: 'bg-green-500/10',
    bgHover: 'hover:bg-green-500/20',
    icon: 'text-green-500',
    badge: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400',
    dot: 'bg-green-500',
  },
};

// Category icons and labels
export const CATEGORY_CONFIG: Record<PulseCategory, { label: string; icon: string }> = {
  REGULATORY: { label: 'Regulatory', icon: 'shield' },
  RELATIONSHIP: { label: 'Relationship', icon: 'users' },
  RISK: { label: 'Risk', icon: 'alert-triangle' },
  OPPORTUNITY: { label: 'Opportunity', icon: 'trending-up' },
  OPERATIONAL: { label: 'Operational', icon: 'settings' },
};
