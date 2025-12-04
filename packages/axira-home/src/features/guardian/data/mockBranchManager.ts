// Mock data for Branch Manager (Alex Chen) view

import type {
  UserProfile,
  BranchHealth,
  TeamWorkload,
  TeamMember,
  OperationalBottleneck,
  VIPEscalation,
  BranchManagerBrief,
  ManagerPulseItem,
} from '../types/branchManager';
import type { Meeting, BriefInsight } from '../types';

// =====================================================
// ALEX'S PROFILE
// =====================================================

export const ALEX_PROFILE: UserProfile = {
  id: 'alex-chen-001',
  name: 'Alex Chen',
  email: 'alex.chen@lsnb.com',
  role: 'BRANCH_MANAGER',
  initials: 'AC',
  branch: {
    id: 'mcallen-001',
    name: 'McAllen Branch',
    region: 'Rio Grande Valley',
    tier: 'FLAGSHIP',
  },
};

// =====================================================
// BRANCH HEALTH
// =====================================================

export const MOCK_BRANCH_HEALTH: BranchHealth = {
  branchId: 'mcallen-001',
  branchName: 'McAllen Branch',

  efficiencyScore: 94,
  efficiencyTrend: 'UP',
  efficiencyChange: 2.3,

  metrics: [
    {
      id: 'metric-efficiency',
      name: 'Operational Efficiency',
      category: 'EFFICIENCY',
      value: 94,
      unit: '%',
      target: 95,
      targetLabel: 'Target: 95%',
      status: 'GOOD',
      trend: 'UP',
      changePercent: 2.3,
      drillDownAvailable: true,
    },
    {
      id: 'metric-compliance',
      name: 'Compliance Score',
      category: 'COMPLIANCE',
      value: 97,
      unit: '%',
      target: 100,
      targetLabel: '3 items pending',
      status: 'WARNING',
      trend: 'STABLE',
      drillDownAvailable: true,
    },
    {
      id: 'metric-csat',
      name: 'Customer Satisfaction',
      category: 'CUSTOMER',
      value: 4.6,
      unit: '/5',
      target: 4.8,
      targetLabel: 'Target: 4.8',
      status: 'WARNING',
      trend: 'DOWN',
      changePercent: -0.2,
      drillDownAvailable: true,
    },
    {
      id: 'metric-team',
      name: 'Team Utilization',
      category: 'TEAM',
      value: 78,
      unit: '%',
      target: 85,
      targetLabel: 'Uneven distribution',
      status: 'WARNING',
      trend: 'STABLE',
      drillDownAvailable: true,
    },
  ],

  regionAverage: 89,
  rankInRegion: 2,
  totalBranchesInRegion: 12,

  asOf: new Date().toISOString(),
};

// =====================================================
// TEAM MEMBERS
// =====================================================

export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'maya-chen-001',
    name: 'Maya Chen',
    role: 'Senior Banker',
    initials: 'MC',
    pendingItems: 23,
    avgItemsPerDay: 8,
    capacityUsed: 145,
    workloadStatus: 'OVERLOADED',
    completionRate: 96,
    avgHandlingTime: 18,
    isAvailable: true,
    certifications: ['Business CDs', 'Commercial Lending', 'Wealth Advisory'],
    territories: ['García Corridor'],
  },
  {
    id: 'carlos-rodriguez-001',
    name: 'Carlos Rodriguez',
    role: 'Banker',
    initials: 'CR',
    pendingItems: 8,
    avgItemsPerDay: 7,
    capacityUsed: 57,
    workloadStatus: 'NORMAL',
    completionRate: 92,
    avgHandlingTime: 22,
    isAvailable: true,
    certifications: ['Consumer Lending'],
    territories: ['Downtown'],
  },
  {
    id: 'jennifer-park-001',
    name: 'Jennifer Park',
    role: 'Banker',
    initials: 'JP',
    pendingItems: 6,
    avgItemsPerDay: 7,
    capacityUsed: 43,
    workloadStatus: 'NORMAL',
    completionRate: 94,
    avgHandlingTime: 20,
    isAvailable: true,
    certifications: ['Consumer Lending', 'Mortgages'],
    territories: ['North McAllen'],
  },
  {
    id: 'david-kim-001',
    name: 'David Kim',
    role: 'Banker',
    initials: 'DK',
    pendingItems: 12,
    avgItemsPerDay: 8,
    capacityUsed: 75,
    workloadStatus: 'NORMAL',
    completionRate: 91,
    avgHandlingTime: 24,
    isAvailable: true,
    certifications: ['Consumer Lending'],
    territories: ['South McAllen'],
  },
  {
    id: 'lisa-thompson-001',
    name: 'Lisa Thompson',
    role: 'Junior Banker',
    initials: 'LT',
    pendingItems: 4,
    avgItemsPerDay: 6,
    capacityUsed: 33,
    workloadStatus: 'LIGHT',
    completionRate: 89,
    avgHandlingTime: 28,
    isAvailable: true,
    certifications: ['Consumer Lending'],
    territories: ['Walk-ins'],
  },
  {
    id: 'mike-santos-001',
    name: 'Mike Santos',
    role: 'Banker',
    initials: 'MS',
    pendingItems: 10,
    avgItemsPerDay: 7,
    capacityUsed: 71,
    workloadStatus: 'NORMAL',
    completionRate: 93,
    avgHandlingTime: 21,
    isAvailable: true,
    certifications: ['Consumer Lending', 'Business CDs'],
    territories: ['Mission Area'],
  },
];

// =====================================================
// TEAM WORKLOAD
// =====================================================

export const MOCK_TEAM_WORKLOAD: TeamWorkload = {
  branchId: 'mcallen-001',
  totalPendingItems: 63,
  teamSize: 6,
  avgItemsPerBanker: 10.5,
  distribution: 'UNEVEN',
  overloadedCount: 1,
  underutilizedCount: 1,
  members: MOCK_TEAM_MEMBERS,
  recommendations: [
    {
      id: 'rec-001',
      type: 'REDISTRIBUTE',
      title: 'Move 6 CD Renewals to Lisa Thompson',
      description: 'Lisa has bandwidth (4 items vs team avg 10) and handled CD renewals last quarter with 98% success rate.',
      impact: 'Maya: 23 → 17 items | Lisa: 4 → 10 items',
      fromMember: 'Maya Chen',
      toMember: 'Lisa Thompson',
      itemCount: 6,
      primaryAction: { label: 'Apply Redistribution', action: 'redistribute' },
      secondaryActions: [
        { label: 'Modify Selection', action: 'modify' },
        { label: 'Choose Manually', action: 'manual' },
      ],
    },
    {
      id: 'rec-002',
      type: 'TRAINING',
      title: 'Certify Lisa Thompson for Business CDs',
      description: 'Would allow Lisa to handle more complex items, reducing dependency on Maya.',
      impact: 'Expands team capacity for commercial products',
      trainingName: 'Business CD Certification',
      trainingDate: 'Next Tuesday (2 hours)',
      primaryAction: { label: 'Schedule Training', action: 'schedule_training' },
    },
    {
      id: 'rec-003',
      type: 'TERRITORY',
      title: 'Split García Corridor Territory',
      description: 'García Corridor had 15 new accounts last month (branch avg: 8/banker). Split between Maya and Carlos.',
      impact: 'Would balance new account load long-term',
      primaryAction: { label: 'Review Territory Map', action: 'view_territory' },
    },
  ],
};

// =====================================================
// OPERATIONAL BOTTLENECKS
// =====================================================

export const MOCK_BOTTLENECKS: OperationalBottleneck[] = [
  {
    id: 'bottleneck-001',
    priority: 'WATCH',
    processName: 'Account Opening',
    processId: 'process-account-opening',
    title: 'Account Opening taking 47 min avg',
    summary: 'ID verification step failing 34% → triggering manual review',
    currentValue: 47,
    targetValue: 25,
    unit: 'min',
    deviation: 88, // 88% above target
    affectedCount: 12,
    affectedLabel: 'new accounts this week',
    detectedAt: '2025-01-14T06:00:00Z',
    timePeriod: 'This week',
    rootCauses: [
      {
        id: 'cause-001',
        description: 'Document glare/blur from mobile uploads',
        percentage: 68,
        isActionable: true,
      },
      {
        id: 'cause-002',
        description: 'Out-of-state IDs not recognized',
        percentage: 22,
        isActionable: true,
      },
      {
        id: 'cause-003',
        description: 'Expired documents',
        percentage: 10,
        isActionable: false,
      },
    ],
    comparison: {
      branchName: 'Edinburg Branch',
      value: 28,
      difference: -19,
    },
    recommendation: {
      title: 'Enable "Guided Capture" for ID photos',
      description: 'This feature coaches customers to retake blurry photos with real-time feedback.',
      evidence: 'Edinburg Branch enabled this → ID verification failures dropped 60%',
      effort: 'LOW',
      impact: 'HIGH',
    },
    actions: [
      { id: 'act-001', label: 'Enable for McAllen', type: 'PRIMARY', action: 'enable_guided_capture' },
      { id: 'act-002', label: 'See Breakdown', type: 'SECONDARY', action: 'view_breakdown' },
      { id: 'act-003', label: 'Compare Branches', type: 'SECONDARY', action: 'compare_branches' },
    ],
  },
  {
    id: 'bottleneck-002',
    priority: 'WATCH',
    processName: 'Wire Transfers',
    processId: 'process-wire-transfer',
    title: 'Wire processing delayed by sanctions screening',
    summary: 'False positive rate at 8.2% vs 3% regional average',
    currentValue: 8.2,
    targetValue: 3,
    unit: '%',
    deviation: 173,
    affectedCount: 7,
    affectedLabel: 'wires blocked this week',
    detectedAt: '2025-01-13T14:00:00Z',
    timePeriod: 'Last 7 days',
    rootCauses: [
      {
        id: 'cause-004',
        description: 'Generic name matches (Henderson, Garcia, etc.)',
        percentage: 45,
        isActionable: true,
      },
      {
        id: 'cause-005',
        description: 'Repeat blocks on whitelisted counterparties',
        percentage: 35,
        isActionable: true,
      },
      {
        id: 'cause-006',
        description: 'Legitimate high-risk jurisdiction',
        percentage: 20,
        isActionable: false,
      },
    ],
    recommendation: {
      title: 'Request counterparty whitelist review',
      description: 'Submit 5 frequently-used business counterparties for BSA Officer approval.',
      evidence: 'Similar branches reduced false positives 40% after whitelist cleanup',
      effort: 'MEDIUM',
      impact: 'MEDIUM',
    },
    actions: [
      { id: 'act-004', label: 'View Blocked Wires', type: 'PRIMARY', action: 'view_blocked' },
      { id: 'act-005', label: 'Request Whitelist Review', type: 'SECONDARY', action: 'request_review' },
    ],
  },
];

// =====================================================
// VIP ESCALATIONS
// =====================================================

export const MOCK_VIP_ESCALATIONS: VIPEscalation[] = [
  {
    id: 'vip-001',
    priority: 'URGENT',
    customerId: 'henderson-family-001',
    customerName: 'Henderson Family',
    relationshipValue: 2300000,
    relationshipTenure: 12,
    customerTier: 'VIP',
    issueType: 'WIRE_BLOCKED',
    issueTitle: 'Wire transfer blocked - sanctions screening false positive',
    issueSummary: '$45,000 wire to "Henderson Supply Co" (his own business) blocked. Customer called twice, frustrated.',
    issueDetails: 'Name matched partial list entry "H. Anderson". Same business wire was blocked in November and released after 2 hours.',
    status: 'OPEN',
    openDuration: '4 hours',
    openDurationMinutes: 240,
    customerSentiment: 'FRUSTRATED',
    contactCount: 2,
    lastContact: '9:42 AM',
    escalatedBy: 'Maya Chen',
    escalatedByRole: 'Senior Banker',
    escalatedAt: '2025-01-14T09:45:00Z',
    attritionRisk: 'HIGH',
    axiraAssessment: {
      recommendation: 'Safe to release. 99.2% confidence this is a false positive.',
      confidence: 0.992,
      reasoning: 'Henderson Supply Co is the customer\'s own registered business. Same wire pattern released 3 times in past 12 months. No SAR history.',
    },
    preparedMaterials: [
      {
        id: 'mat-001',
        type: 'AUTHORIZATION',
        title: 'Release Authorization Form',
        description: 'Pre-filled, needs your signature',
        status: 'READY',
      },
      {
        id: 'mat-002',
        type: 'TALKING_POINTS',
        title: 'Talking Points for Robert',
        description: 'Acknowledge frustration, explain regulatory requirement, offer expedited whitelist',
        status: 'READY',
      },
      {
        id: 'mat-003',
        type: 'RETENTION_OFFER',
        title: 'Retention Offer',
        description: 'Waive next 3 months wire fees ($75 value)',
        status: 'READY',
      },
      {
        id: 'mat-004',
        type: 'HISTORY',
        title: 'Customer History',
        description: 'Last 90 days activity and previous incidents',
        status: 'READY',
      },
    ],
    actions: [
      { id: 'vip-act-001', label: 'Release Wire', type: 'PRIMARY', action: 'release_wire', icon: 'check' },
      { id: 'vip-act-002', label: 'Call Robert', type: 'SECONDARY', action: 'call_customer', icon: 'phone' },
      { id: 'vip-act-003', label: 'Send Apology', type: 'SECONDARY', action: 'send_email', icon: 'mail' },
      { id: 'vip-act-004', label: 'Apply Retention', type: 'TERTIARY', action: 'apply_retention', icon: 'gift' },
    ],
  },
  {
    id: 'vip-002',
    priority: 'HIGH',
    customerId: 'ramirez-enterprises-001',
    customerName: 'Ramirez Enterprises',
    relationshipValue: 850000,
    relationshipTenure: 8,
    customerTier: 'PREMIER',
    issueType: 'LOAN_QUESTION',
    issueTitle: 'Commercial loan rate lock expiring',
    issueSummary: 'Pre-approved $500K expansion loan rate lock expires tomorrow. Customer hasn\'t responded to 3 outreach attempts.',
    status: 'OPEN',
    openDuration: '2 days',
    openDurationMinutes: 2880,
    customerSentiment: 'NEUTRAL',
    contactCount: 0,
    escalatedBy: 'David Kim',
    escalatedByRole: 'Banker',
    escalatedAt: '2025-01-12T14:00:00Z',
    attritionRisk: 'MEDIUM',
    axiraAssessment: {
      recommendation: 'Schedule direct call. Customer may be shopping rates.',
      confidence: 0.75,
      reasoning: 'Customer recently had credit pulls from two other lenders. May need competitive offer.',
    },
    preparedMaterials: [
      {
        id: 'mat-005',
        type: 'TALKING_POINTS',
        title: 'Rate Comparison Sheet',
        description: 'Our offer vs market rates',
        status: 'READY',
      },
      {
        id: 'mat-006',
        type: 'RETENTION_OFFER',
        title: 'Rate Match Authorization',
        description: 'Authority to match competitor rate within 25bps',
        status: 'READY',
      },
    ],
    actions: [
      { id: 'vip-act-005', label: 'Call Now', type: 'PRIMARY', action: 'call_customer', icon: 'phone' },
      { id: 'vip-act-006', label: 'Extend Lock', type: 'SECONDARY', action: 'extend_lock', icon: 'clock' },
      { id: 'vip-act-007', label: 'View Offer', type: 'TERTIARY', action: 'view_offer', icon: 'file' },
    ],
  },
];

// =====================================================
// MANAGER PULSE ITEMS
// =====================================================

export const MOCK_MANAGER_PULSE_ITEMS: ManagerPulseItem[] = [
  // VIP Escalation
  {
    id: 'mgr-pulse-001',
    priority: 'URGENT',
    category: 'RELATIONSHIP',
    title: 'VIP Escalation: Henderson Family',
    summary: 'Wire transfer blocked - customer called twice, frustrated. $2.3M relationship at risk.',
    details: '$45,000 wire to own business blocked by sanctions screening false positive.',
    subjectKey: 'customer:henderson-family-001',
    subjectName: 'Henderson Family',
    subjectType: 'CUSTOMER',
    daysUntilDue: 0,
    detectedAt: '2025-01-14T09:45:00Z',
    watcherType: 'vip-escalation-monitor',
    confidence: 1.0,
    suggestedActions: [
      { id: 'act-001', label: 'Take Over', actionType: 'VIEW_DETAILS', primary: true },
      { id: 'act-002', label: 'Call Customer', actionType: 'CALL' },
      { id: 'act-003', label: 'View Case', actionType: 'VIEW_DETAILS' },
    ],
    branchImpact: 'HIGH',
    requiresApproval: true,
    escalation: MOCK_VIP_ESCALATIONS[0],
  },
  // Compliance items
  {
    id: 'mgr-pulse-002',
    priority: 'URGENT',
    category: 'REGULATORY',
    title: '3 accounts missing beneficiary forms',
    summary: 'Due for examiner review in 5 days. Branch compliance score at risk.',
    details: 'Customers: García, Martinez, Thompson. Forms must be collected before Friday.',
    daysUntilDue: 5,
    detectedAt: '2025-01-14T06:00:00Z',
    watcherType: 'regulatory-clock',
    confidence: 1.0,
    suggestedActions: [
      { id: 'act-004', label: 'Assign to Team', actionType: 'PREPARE', primary: true },
      { id: 'act-005', label: 'View All', actionType: 'VIEW_DETAILS' },
      { id: 'act-006', label: 'Generate Outreach', actionType: 'EMAIL' },
    ],
    branchImpact: 'HIGH',
    delegatable: true,
  },
  // Team issue
  {
    id: 'mgr-pulse-003',
    priority: 'WATCH',
    category: 'OPERATIONAL',
    title: 'Maya Chen: 23 pending items',
    summary: 'Team average is 8. CD renewals backing up. Potential overload situation.',
    details: 'Maya\'s queue breakdown: 9 CD renewals, 6 new account followups, 5 document collection, 3 customer calls.',
    subjectKey: 'team:maya-chen-001',
    subjectName: 'Maya Chen',
    subjectType: 'CASE',
    detectedAt: '2025-01-14T06:00:00Z',
    watcherType: 'team-load-monitor',
    confidence: 1.0,
    suggestedActions: [
      { id: 'act-007', label: 'Redistribute Work', actionType: 'PREPARE', primary: true },
      { id: 'act-008', label: 'Check In with Maya', actionType: 'SCHEDULE' },
    ],
    affectedTeamMember: 'Maya Chen',
    branchImpact: 'MEDIUM',
    teamWorkload: MOCK_TEAM_WORKLOAD,
  },
  // Operational bottleneck
  {
    id: 'mgr-pulse-004',
    priority: 'WATCH',
    category: 'OPERATIONAL',
    title: 'Account Opening taking 47 min avg',
    summary: 'Target is 25 min. ID verification failing 34% → manual review required.',
    details: 'Root cause: 68% due to document glare/blur from mobile uploads.',
    detectedAt: '2025-01-14T06:00:00Z',
    watcherType: 'process-efficiency-monitor',
    confidence: 0.95,
    suggestedActions: [
      { id: 'act-009', label: 'See Breakdown', actionType: 'VIEW_DETAILS', primary: true },
      { id: 'act-010', label: 'Compare to Edinburg', actionType: 'VIEW_DETAILS' },
    ],
    branchImpact: 'MEDIUM',
    bottleneck: MOCK_BOTTLENECKS[0],
  },
  // Second VIP
  {
    id: 'mgr-pulse-005',
    priority: 'WATCH',
    category: 'RELATIONSHIP',
    title: 'Ramirez Enterprises - Loan lock expiring',
    summary: '$500K expansion loan rate lock expires tomorrow. No response to 3 outreach attempts.',
    details: 'Customer may be shopping rates - credit pulls detected from competitors.',
    subjectKey: 'customer:ramirez-enterprises-001',
    subjectName: 'Ramirez Enterprises',
    subjectType: 'CUSTOMER',
    daysUntilDue: 1,
    detectedAt: '2025-01-12T14:00:00Z',
    watcherType: 'relationship-health-monitor',
    confidence: 0.75,
    suggestedActions: [
      { id: 'act-011', label: 'Call Now', actionType: 'CALL', primary: true },
      { id: 'act-012', label: 'Extend Lock', actionType: 'PREPARE' },
    ],
    branchImpact: 'HIGH',
    escalation: MOCK_VIP_ESCALATIONS[1],
  },
  // Opportunities
  {
    id: 'mgr-pulse-006',
    priority: 'OPPORTUNITY',
    category: 'OPPORTUNITY',
    title: 'Q1 Promotion: 8 eligible customers',
    summary: 'High-yield savings promotion matches 8 customers. Estimated $320K additional deposits.',
    detectedAt: '2025-01-14T06:00:00Z',
    watcherType: 'opportunity-spotter',
    confidence: 0.88,
    suggestedActions: [
      { id: 'act-013', label: 'View Customers', actionType: 'VIEW_DETAILS', primary: true },
      { id: 'act-014', label: 'Assign Campaign', actionType: 'PREPARE' },
    ],
    branchImpact: 'MEDIUM',
    delegatable: true,
  },
  {
    id: 'mgr-pulse-007',
    priority: 'OPPORTUNITY',
    category: 'OPPORTUNITY',
    title: 'Cross-sell: 3 mortgage pre-qualifications',
    summary: 'Rodriguez, Patel, and Williams families showing home-buying signals.',
    detectedAt: '2025-01-13T14:00:00Z',
    watcherType: 'opportunity-spotter',
    confidence: 0.82,
    suggestedActions: [
      { id: 'act-015', label: 'Review Leads', actionType: 'VIEW_DETAILS', primary: true },
      { id: 'act-016', label: 'Assign to Banker', actionType: 'PREPARE' },
    ],
    branchImpact: 'HIGH',
    delegatable: true,
  },
];

// =====================================================
// ALEX'S SCHEDULE
// =====================================================

export const MOCK_ALEX_MEETINGS: Meeting[] = [
  {
    id: 'alex-meeting-001',
    title: 'Henderson Call (VIP)',
    time: '8:30 AM',
    customerName: 'Robert Henderson',
    customerId: 'henderson-family-001',
    briefingReady: true,
  },
  {
    id: 'alex-meeting-002',
    title: 'Weekly Team Standup',
    time: '10:00 AM',
    briefingReady: true,
  },
  {
    id: 'alex-meeting-003',
    title: 'Regional Call',
    time: '2:00 PM',
    briefingReady: false,
  },
  {
    id: 'alex-meeting-004',
    title: 'García Household Visit',
    time: '4:00 PM',
    customerName: 'García Household',
    customerId: 'garcia-household-001',
    briefingReady: true,
  },
];

// =====================================================
// ALEX'S INSIGHTS
// =====================================================

export const MOCK_ALEX_INSIGHTS: BriefInsight[] = [
  {
    id: 'alex-insight-001',
    message: 'Branch efficiency up 2.3% this month',
    metric: '+2.3%',
    trend: 'UP',
    source: 'Branch Analytics',
  },
  {
    id: 'alex-insight-002',
    message: 'Team completing 94% of items on time',
    metric: '94%',
    trend: 'UP',
    source: 'Performance Tracker',
  },
  {
    id: 'alex-insight-003',
    message: '3 compliance items due this week',
    metric: '3',
    trend: 'STABLE',
    source: 'Regulatory Clock',
  },
  {
    id: 'alex-insight-004',
    message: '$320K deposit opportunity identified',
    metric: '$320K',
    trend: 'UP',
    source: 'Opportunity Spotter',
  },
];

// =====================================================
// BRANCH MANAGER DAILY BRIEF
// =====================================================

export const MOCK_BRANCH_MANAGER_BRIEF: BranchManagerBrief = {
  date: new Date().toISOString().split('T')[0],
  greeting: 'Good morning, Alex. McAllen Branch is running at 94% efficiency.',

  branchHealth: MOCK_BRANCH_HEALTH,

  vipEscalations: MOCK_VIP_ESCALATIONS.length,
  operationalBottlenecks: MOCK_BOTTLENECKS.length,
  teamIssues: 1, // Maya overloaded
  complianceItems: 3,
  opportunities: 2,

  topPriority: MOCK_MANAGER_PULSE_ITEMS[0],
  keyInsights: MOCK_ALEX_INSIGHTS,

  teamWorkload: MOCK_TEAM_WORKLOAD,

  meetingsToday: MOCK_ALEX_MEETINGS,
  nextMeeting: MOCK_ALEX_MEETINGS[0],

  quickStats: [
    {
      id: 'stat-001',
      label: 'Efficiency',
      value: 94,
      unit: '%',
      trend: 'UP',
      status: 'GOOD',
    },
    {
      id: 'stat-002',
      label: 'Compliance',
      value: 97,
      unit: '%',
      trend: 'STABLE',
      status: 'WARNING',
    },
    {
      id: 'stat-003',
      label: 'CSAT',
      value: 4.6,
      unit: '/5',
      trend: 'DOWN',
      status: 'WARNING',
    },
    {
      id: 'stat-004',
      label: 'Team Load',
      value: 'Uneven',
      status: 'WARNING',
    },
  ],
};

// =====================================================
// HELPER FUNCTIONS
// =====================================================

export function getManagerPulseSummary() {
  const items = MOCK_MANAGER_PULSE_ITEMS;
  return {
    urgent: items.filter(i => i.priority === 'URGENT').length,
    watch: items.filter(i => i.priority === 'WATCH').length,
    opportunity: items.filter(i => i.priority === 'OPPORTUNITY').length,
    total: items.length,
    vipEscalations: MOCK_VIP_ESCALATIONS.length,
    bottlenecks: MOCK_BOTTLENECKS.length,
  };
}

export function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  if (minutes < 1440) {
    const hours = Math.floor(minutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  const days = Math.floor(minutes / 1440);
  return `${days} day${days > 1 ? 's' : ''}`;
}
