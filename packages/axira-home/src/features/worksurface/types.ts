// Work Surface Types - The Jarvis-like Work Experience

/**
 * A prepared work item ready for the user to engage with.
 * Not an alert - actual work with context already prepared.
 */
export interface WorkItem {
  id: string;

  // What is this work?
  title: string;
  subtitle?: string;

  // Why is it ready now?
  reason: WorkItemReason;
  reasonLabel: string;  // "9:00 AM meeting" | "Due in 7 days" | "From overnight"

  // What's prepared?
  contextReady: boolean;
  contextSummary?: string;  // "Rate options prepared" | "2 items to discuss"

  // Effort estimate
  estimatedMinutes?: number;

  // What it relates to
  subject?: {
    type: 'CUSTOMER' | 'ACCOUNT' | 'LOAN' | 'CASE';
    key: string;
    name: string;
  };

  // Visual
  icon: WorkItemIcon;

  // When to surface
  priority: number;  // Lower = more important
  surfacedAt: string;
}

export type WorkItemReason =
  | 'MEETING_TODAY'      // Upcoming meeting
  | 'DUE_SOON'           // Deadline approaching
  | 'BATCH_RESULT'       // From overnight processing
  | 'FOLLOW_UP'          // From previous interaction
  | 'ASSIGNED'           // Manager assigned
  | 'SCHEDULED';         // User scheduled this

export type WorkItemIcon =
  | 'calendar'    // Meeting
  | 'document'    // Document/form work
  | 'review'      // QA/Review task
  | 'call'        // Phone call
  | 'person'      // Customer related
  | 'renewal'     // Renewal/maturity
  | 'task';       // Generic task

/**
 * A single proactive nudge - one actionable suggestion.
 * Only one shown at a time to avoid overwhelm.
 */
export interface ProactiveNudge {
  id: string;

  // The message
  message: string;  // "Thompson Industries KYC due in 3 weeks"

  // The ask
  suggestion: string;  // "want me to start the document request?"

  // Actions
  primaryAction: {
    label: string;  // "Yes"
    actionType: string;
  };
  dismissable: boolean;

  // Context
  source: string;  // What triggered this
  confidence: number;

  // Subject if applicable
  subject?: {
    type: string;
    key: string;
    name: string;
  };
}

/**
 * Contextual greeting based on time, recent activity, and what's ahead.
 */
export interface ContextualGreeting {
  // Primary greeting
  greeting: string;  // "Good afternoon, Maya."

  // Context line - what Axira knows about recent activity
  context?: string;  // "Your 9 AM García meeting went well - I've noted the follow-ups."

  // What's ready
  readyLine?: string;  // "Martinez CD renewal is ready when you are."
}

/**
 * User's work context - what Axira knows about them today.
 */
export interface UserWorkContext {
  userId: string;
  userName: string;

  // Today's state
  meetingsToday: MeetingContext[];
  meetingsCompleted: number;
  tasksCompletedToday: number;

  // Current focus
  currentFocus?: {
    type: 'MEETING' | 'TASK' | 'REVIEW';
    subject?: string;
    startedAt: string;
  };

  // Recent activity
  recentSubjects: RecentSubject[];

  // Preferences learned
  preferredWorkHours?: { start: string; end: string };
  avgTasksPerDay: number;
}

export interface MeetingContext {
  id: string;
  title: string;
  time: string;
  customerName?: string;
  customerId?: string;
  status: 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED';
  briefingReady: boolean;
  followUpsLogged?: number;
}

export interface RecentSubject {
  type: string;
  key: string;
  name: string;
  lastAccessed: string;
  accessCount: number;
}

/**
 * Quick action suggestions based on common patterns.
 */
export interface QuickAction {
  id: string;
  label: string;
  description?: string;
  actionType: 'NAVIGATE' | 'START_WORK' | 'ASK_AGENT';
  target: string;  // Route or subject key or prompt
}

// Icon mapping for work items
export const WORK_ITEM_ICONS: Record<WorkItemIcon, string> = {
  calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  document: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  review: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  call: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
  person: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  renewal: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  task: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
};
