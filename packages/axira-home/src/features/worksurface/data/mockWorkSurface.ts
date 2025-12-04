import type {
  WorkItem,
  ProactiveNudge,
  ContextualGreeting,
  UserWorkContext,
  RecentSubject,
  QuickAction,
} from '../types';

/**
 * Generate contextual greeting based on time and user context.
 */
export function getContextualGreeting(context: UserWorkContext): ContextualGreeting {
  const hour = new Date().getHours();
  let timeGreeting: string;

  if (hour < 12) {
    timeGreeting = 'Good morning';
  } else if (hour < 17) {
    timeGreeting = 'Good afternoon';
  } else {
    timeGreeting = 'Good evening';
  }

  const greeting = `${timeGreeting}, ${context.userName}.`;

  // Build context based on what's happened today
  let contextLine: string | undefined;
  let readyLine: string | undefined;

  const completedMeetings = context.meetingsToday.filter(m => m.status === 'COMPLETED');
  const upcomingMeetings = context.meetingsToday.filter(m => m.status === 'UPCOMING');

  if (completedMeetings.length > 0) {
    const lastMeeting = completedMeetings[completedMeetings.length - 1];
    if (lastMeeting.followUpsLogged && lastMeeting.followUpsLogged > 0) {
      contextLine = `Your ${lastMeeting.time} ${lastMeeting.customerName || lastMeeting.title} meeting went well — I've noted the follow-ups.`;
    }
  }

  if (context.tasksCompletedToday > 0) {
    readyLine = `You've completed ${context.tasksCompletedToday} task${context.tasksCompletedToday > 1 ? 's' : ''} today.`;
  }

  return { greeting, context: contextLine, readyLine };
}

/**
 * Mock user work context for Maya Chen.
 */
export const MOCK_USER_CONTEXT: UserWorkContext = {
  userId: 'maya-chen-001',
  userName: 'Maya',

  meetingsToday: [
    {
      id: 'meeting-1',
      title: 'García Household Review',
      time: '9:00 AM',
      customerName: 'García Household',
      customerId: 'garcia-household-001',
      status: 'COMPLETED',
      briefingReady: true,
      followUpsLogged: 2,
    },
    {
      id: 'meeting-2',
      title: 'Branch Staff Meeting',
      time: '11:00 AM',
      status: 'COMPLETED',
      briefingReady: false,
    },
    {
      id: 'meeting-3',
      title: 'Martinez Follow-up Call',
      time: '2:00 PM',
      customerName: 'Martinez Family',
      customerId: 'martinez-family-001',
      status: 'UPCOMING',
      briefingReady: true,
    },
    {
      id: 'meeting-4',
      title: 'New Account Opening',
      time: '3:30 PM',
      customerName: 'Sarah Wilson',
      customerId: 'wilson-001',
      status: 'UPCOMING',
      briefingReady: false,
    },
  ],
  meetingsCompleted: 2,
  tasksCompletedToday: 5,

  recentSubjects: [
    { type: 'CUSTOMER', key: 'garcia-household-001', name: 'García Household', lastAccessed: '2025-01-14T09:45:00Z', accessCount: 3 },
    { type: 'CUSTOMER', key: 'martinez-family-001', name: 'Martinez Family', lastAccessed: '2025-01-14T08:30:00Z', accessCount: 2 },
    { type: 'LOAN', key: 'loan-thompson-001', name: 'Thompson Industries Loan', lastAccessed: '2025-01-13T16:00:00Z', accessCount: 1 },
  ],

  avgTasksPerDay: 12,
};

/**
 * Mock work items - prepared work ready to engage.
 */
export const MOCK_WORK_ITEMS: WorkItem[] = [
  {
    id: 'work-1',
    title: 'Martinez CD Renewal',
    subtitle: 'Martinez Family',
    reason: 'DUE_SOON',
    reasonLabel: 'Due in 7 days',
    contextReady: true,
    contextSummary: 'Rate options prepared',
    estimatedMinutes: 15,
    subject: {
      type: 'CUSTOMER',
      key: 'martinez-family-001',
      name: 'Martinez Family',
    },
    icon: 'renewal',
    priority: 1,
    surfacedAt: '2025-01-14T06:00:00Z',
  },
  {
    id: 'work-2',
    title: 'QA Reviews',
    subtitle: '5 accounts from overnight',
    reason: 'BATCH_RESULT',
    reasonLabel: 'From overnight',
    contextReady: true,
    contextSummary: 'Quick review needed',
    estimatedMinutes: 10,
    icon: 'review',
    priority: 2,
    surfacedAt: '2025-01-14T06:00:00Z',
  },
  {
    id: 'work-3',
    title: 'García Follow-ups',
    subtitle: 'García Household',
    reason: 'FOLLOW_UP',
    reasonLabel: 'From this morning',
    contextReady: true,
    contextSummary: '2 items to complete',
    estimatedMinutes: 10,
    subject: {
      type: 'CUSTOMER',
      key: 'garcia-household-001',
      name: 'García Household',
    },
    icon: 'task',
    priority: 3,
    surfacedAt: '2025-01-14T10:00:00Z',
  },
];

/**
 * Mock proactive nudge - only one at a time.
 */
export const MOCK_PROACTIVE_NUDGE: ProactiveNudge = {
  id: 'nudge-1',
  message: 'Thompson Industries KYC due in 3 weeks',
  suggestion: 'want me to start the document request?',
  primaryAction: {
    label: 'Yes, start it',
    actionType: 'START_TASK',
  },
  dismissable: true,
  source: 'regulatory-clock',
  confidence: 1.0,
  subject: {
    type: 'CUSTOMER',
    key: 'thompson-industries-001',
    name: 'Thompson Industries',
  },
};

/**
 * Quick action suggestions.
 */
export const MOCK_QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'quick-1',
    label: 'García review',
    actionType: 'START_WORK',
    target: 'garcia-household-001',
  },
  {
    id: 'quick-2',
    label: 'Process application',
    actionType: 'ASK_AGENT',
    target: 'Help me process a new account application',
  },
  {
    id: 'quick-3',
    label: 'Check documents',
    actionType: 'ASK_AGENT',
    target: 'What documents are missing for my customers?',
  },
];

/**
 * Get recent subjects formatted for display.
 */
export function getRecentSubjectsDisplay(subjects: RecentSubject[]): string[] {
  return subjects.slice(0, 5).map(s => s.name);
}
