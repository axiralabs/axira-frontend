import type { PulseItem, DailyBrief, CustomerRelationship } from '../types';

export const MOCK_PULSE_ITEMS: PulseItem[] = [
  // URGENT - García beneficiary form
  {
    id: 'pulse-001',
    priority: 'URGENT',
    category: 'REGULATORY',
    title: 'Beneficiary Form Expiring',
    summary: 'García Household savings account beneficiary designation expires in 14 days',
    details: 'Account ending in 5678 requires updated beneficiary form by Jan 28th. Customer has a branch visit scheduled for Friday.',
    subjectKey: 'customer:garcia-household-001',
    subjectName: 'García Household',
    subjectType: 'CUSTOMER',
    dueDate: '2025-01-28',
    daysUntilDue: 14,
    detectedAt: '2025-01-14T06:00:00Z',
    watcherType: 'regulatory-clock',
    confidence: 1.0,
    suggestedActions: [
      { id: 'act-1', label: 'Preview Meeting Brief', actionType: 'VIEW_DETAILS', primary: true },
      { id: 'act-2', label: 'Call Now', actionType: 'CALL' },
      { id: 'act-3', label: 'Send Form Link', actionType: 'EMAIL' },
    ],
    preparedAssets: [
      { id: 'asset-1', type: 'FORM', title: 'Beneficiary Designation Form', description: 'Pre-filled with customer info', generatedAt: '2025-01-14T06:05:00Z' },
      { id: 'asset-2', type: 'TALKING_POINTS', title: 'Meeting Talking Points', description: 'Compliance + upsell opportunities', generatedAt: '2025-01-14T06:05:00Z' },
    ],
  },

  // URGENT - Unusual pattern detected
  {
    id: 'pulse-002',
    priority: 'URGENT',
    category: 'RISK',
    title: 'Unusual Transaction Pattern',
    summary: '23 accounts in McAllen branch show similar funding patterns - potential structuring',
    details: 'All opened in last 60 days, same employer, similar deposit amounts. Doesn\'t violate rules yet but matches early indicators.',
    dueDate: undefined,
    detectedAt: '2025-01-14T05:30:00Z',
    watcherType: 'pattern-anomaly',
    confidence: 0.78,
    suggestedActions: [
      { id: 'act-4', label: 'View Evidence Pack', actionType: 'VIEW_DETAILS', primary: true },
      { id: 'act-5', label: 'Create SAR Case', actionType: 'CREATE_CASE' },
      { id: 'act-6', label: 'Flag for Enhanced Monitoring', actionType: 'PREPARE' },
    ],
  },

  // WATCH - CD maturity
  {
    id: 'pulse-003',
    priority: 'WATCH',
    category: 'RELATIONSHIP',
    title: 'CD Maturity - Rate Conversation',
    summary: 'Martinez Family CD matures next week. Current rate environment suggests renewal discussion.',
    details: 'Similar customers chose: 67% higher rate same term, 23% different term. Customer LTV: $45,000.',
    subjectKey: 'customer:martinez-family-001',
    subjectName: 'Martinez Family',
    subjectType: 'CUSTOMER',
    dueDate: '2025-01-21',
    daysUntilDue: 7,
    detectedAt: '2025-01-14T06:00:00Z',
    watcherType: 'life-event-detector',
    confidence: 1.0,
    suggestedActions: [
      { id: 'act-7', label: 'Prepare Rate Options', actionType: 'PREPARE', primary: true },
      { id: 'act-8', label: 'Schedule Call', actionType: 'SCHEDULE' },
    ],
    preparedAssets: [
      { id: 'asset-3', type: 'REPORT', title: 'CD Renewal Options', description: 'Personalized rate comparison', generatedAt: '2025-01-14T06:10:00Z' },
    ],
  },

  // WATCH - Youth account conversion
  {
    id: 'pulse-004',
    priority: 'WATCH',
    category: 'RELATIONSHIP',
    title: 'Youth Account Conversion',
    summary: 'Ana García turns 18 in 6 months - account will convert to adult status',
    details: 'Opportunity to discuss: authorized user on parent account, independent account, college savings. Family has been customers for 12 years.',
    subjectKey: 'customer:garcia-household-001',
    subjectName: 'García Household (Ana)',
    subjectType: 'CUSTOMER',
    dueDate: '2025-07-15',
    daysUntilDue: 182,
    detectedAt: '2025-01-14T06:00:00Z',
    watcherType: 'life-event-detector',
    confidence: 1.0,
    suggestedActions: [
      { id: 'act-9', label: 'Learn About Options', actionType: 'VIEW_DETAILS', primary: true },
      { id: 'act-10', label: 'Add to Friday Meeting', actionType: 'PREPARE' },
    ],
  },

  // WATCH - KYC refresh needed
  {
    id: 'pulse-007',
    priority: 'WATCH',
    category: 'REGULATORY',
    title: 'KYC Refresh Due',
    summary: 'Thompson Industries annual KYC review due in 21 days',
    details: 'Commercial account requires updated beneficial ownership documentation per FinCEN requirements.',
    subjectKey: 'customer:thompson-industries-001',
    subjectName: 'Thompson Industries',
    subjectType: 'CUSTOMER',
    dueDate: '2025-02-04',
    daysUntilDue: 21,
    detectedAt: '2025-01-14T06:00:00Z',
    watcherType: 'regulatory-clock',
    confidence: 1.0,
    suggestedActions: [
      { id: 'act-15', label: 'Send Document Request', actionType: 'EMAIL', primary: true },
      { id: 'act-16', label: 'Schedule Review Call', actionType: 'SCHEDULE' },
    ],
  },

  // OPPORTUNITY - Savings promotion
  {
    id: 'pulse-005',
    priority: 'OPPORTUNITY',
    category: 'OPPORTUNITY',
    title: 'Savings Rate Promotion Match',
    summary: '3 customers eligible for new high-yield savings promotion',
    details: 'Based on balance thresholds and relationship tenure. Estimated additional deposits: $125,000.',
    detectedAt: '2025-01-14T06:00:00Z',
    watcherType: 'opportunity-spotter',
    confidence: 0.85,
    suggestedActions: [
      { id: 'act-11', label: 'View Customer List', actionType: 'VIEW_DETAILS', primary: true },
      { id: 'act-12', label: 'Send Campaign', actionType: 'EMAIL' },
    ],
  },

  // OPPORTUNITY - Engagement signal
  {
    id: 'pulse-006',
    priority: 'OPPORTUNITY',
    category: 'RELATIONSHIP',
    title: 'Increased Digital Engagement',
    summary: 'Johnson Family mobile app usage up 40% this month',
    details: 'Indicates potential life event or increased financial activity. Good time for proactive outreach.',
    subjectKey: 'customer:johnson-family-001',
    subjectName: 'Johnson Family',
    subjectType: 'CUSTOMER',
    detectedAt: '2025-01-13T18:00:00Z',
    watcherType: 'relationship-health-monitor',
    confidence: 0.72,
    suggestedActions: [
      { id: 'act-13', label: 'View Activity', actionType: 'VIEW_DETAILS' },
      { id: 'act-14', label: 'Send Check-in', actionType: 'EMAIL', primary: true },
    ],
  },

  // OPPORTUNITY - Cross-sell signal
  {
    id: 'pulse-008',
    priority: 'OPPORTUNITY',
    category: 'OPPORTUNITY',
    title: 'Home Loan Pre-Qualification',
    summary: 'Rodriguez Family shows home buying signals',
    details: 'Recent credit pulls from mortgage lenders detected. Customer has strong relationship history and excellent credit. Pre-approve for competitive rates.',
    subjectKey: 'customer:rodriguez-family-001',
    subjectName: 'Rodriguez Family',
    subjectType: 'CUSTOMER',
    detectedAt: '2025-01-13T14:00:00Z',
    watcherType: 'opportunity-spotter',
    confidence: 0.82,
    suggestedActions: [
      { id: 'act-17', label: 'Generate Pre-Approval', actionType: 'PREPARE', primary: true },
      { id: 'act-18', label: 'Call Customer', actionType: 'CALL' },
    ],
  },
];

// Helper to get items by priority
export function getPulseItemsByPriority(priority: 'URGENT' | 'WATCH' | 'OPPORTUNITY'): PulseItem[] {
  return MOCK_PULSE_ITEMS.filter(item => item.priority === priority);
}

// Get pulse summary counts
export function getPulseSummary() {
  return {
    urgent: MOCK_PULSE_ITEMS.filter(i => i.priority === 'URGENT').length,
    watch: MOCK_PULSE_ITEMS.filter(i => i.priority === 'WATCH').length,
    opportunity: MOCK_PULSE_ITEMS.filter(i => i.priority === 'OPPORTUNITY').length,
    total: MOCK_PULSE_ITEMS.length,
  };
}

export const MOCK_DAILY_BRIEF: DailyBrief = {
  date: new Date().toISOString().split('T')[0],
  greeting: 'Good morning, Maya. You have a productive day ahead.',
  urgentCount: getPulseSummary().urgent,
  watchCount: getPulseSummary().watch,
  opportunityCount: getPulseSummary().opportunity,
  topPriority: MOCK_PULSE_ITEMS[0],
  keyInsights: [
    {
      id: 'insight-1',
      message: 'Your retention rate is 12% above branch average',
      metric: '+12%',
      trend: 'UP',
      source: 'Performance Analytics'
    },
    {
      id: 'insight-2',
      message: '3 customers have renewals this month',
      source: 'Life Event Detector'
    },
    {
      id: 'insight-3',
      message: 'Document completion rate improved to 94%',
      metric: '94%',
      trend: 'UP',
      source: 'QA Dashboard'
    },
  ],
  meetingsToday: [
    {
      id: 'meeting-1',
      title: 'García Household Review',
      time: '9:00 AM',
      customerName: 'García Household',
      customerId: 'garcia-household-001',
      briefingReady: true
    },
    {
      id: 'meeting-2',
      title: 'Branch Staff Meeting',
      time: '11:00 AM',
      briefingReady: false
    },
    {
      id: 'meeting-3',
      title: 'Martinez Follow-up Call',
      time: '2:00 PM',
      customerName: 'Martinez Family',
      customerId: 'martinez-family-001',
      briefingReady: true
    },
    {
      id: 'meeting-4',
      title: 'New Account Opening',
      time: '3:30 PM',
      customerName: 'Sarah Wilson',
      customerId: 'wilson-001',
      briefingReady: false
    },
  ],
  nextMeeting: {
    id: 'meeting-1',
    title: 'García Household Review',
    time: '9:00 AM',
    customerName: 'García Household',
    customerId: 'garcia-household-001',
    briefingReady: true
  },
};

export const MOCK_CUSTOMER_RELATIONSHIPS: CustomerRelationship[] = [
  {
    customerId: 'garcia-household-001',
    customerName: 'García Household',
    relationshipStart: '2012-03-15',
    relationshipHealth: 'HEALTHY',
    healthScore: 85,
    stage: 'MATURE',
    totalAccounts: 4,
    activeProducts: ['DDA', 'Savings', 'CD', 'Credit Card'],
    lifetimeValue: 125000,
    lastInteraction: '2025-01-10',
    lastInteractionType: 'Branch Visit',
    upcomingEvents: [
      { id: 'evt-1', type: 'EXPIRATION', title: 'Beneficiary form expires', date: '2025-01-28', daysAway: 14, automated: false, requiresAction: true },
      { id: 'evt-2', type: 'MILESTONE', title: 'Ana turns 18', date: '2025-07-15', daysAway: 182, automated: false, requiresAction: true },
      { id: 'evt-3', type: 'RENEWAL', title: 'CD Maturity', date: '2025-09-01', daysAway: 230, automated: true, requiresAction: false },
    ],
    activePulseItems: MOCK_PULSE_ITEMS.filter(p => p.subjectKey === 'customer:garcia-household-001'),
  },
  {
    customerId: 'martinez-family-001',
    customerName: 'Martinez Family',
    relationshipStart: '2018-06-20',
    relationshipHealth: 'GROWING',
    healthScore: 78,
    stage: 'ESTABLISHED',
    totalAccounts: 3,
    activeProducts: ['DDA', 'CD', 'Auto Loan'],
    lifetimeValue: 45000,
    lastInteraction: '2025-01-05',
    lastInteractionType: 'Phone Call',
    upcomingEvents: [
      { id: 'evt-4', type: 'RENEWAL', title: 'CD Matures', date: '2025-01-21', daysAway: 7, automated: false, requiresAction: true },
    ],
    activePulseItems: MOCK_PULSE_ITEMS.filter(p => p.subjectKey === 'customer:martinez-family-001'),
  },
];
