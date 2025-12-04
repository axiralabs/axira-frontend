// Mock Board Data - LSNB (Lone Star National Bank) Demo Data
import type {
  BoardMessage,
  BranchMetrics,
  StrategicInsight,
  BoardMetric,
  AuditTrail,
  EvidenceSource,
  DecisionStep,
} from '../types';

// ============================================
// BRANCH METRICS - Real-time Branch Performance
// ============================================

export const MOCK_BRANCH_METRICS: BranchMetrics[] = [
  {
    branchId: 'mcallen-001',
    branchName: 'McAllen Branch',
    branchManager: 'Sarah Rodriguez',

    // Financial Metrics
    revenue: 42.3,              // $42.3M quarterly
    revenueTrend: 'UP',
    revenueChange: 15.2,

    deposits: 312.5,            // $312.5M total deposits
    depositsTrend: 'UP',
    depositsChange: 8.4,

    loanPortfolio: 187.2,       // $187.2M in loans
    loanPortfolioTrend: 'UP',
    loanPortfolioChange: 12.1,

    // Profitability
    netInterestMargin: 3.85,    // 3.85% NIM
    nimTrend: 'UP',

    efficiency: 54.2,           // 54.2% efficiency ratio
    efficiencyTrend: 'DOWN',    // DOWN is good for efficiency

    // Growth
    newAccounts: 847,
    newAccountsTrend: 'UP',
    newAccountsChange: 23.5,

    customerGrowth: 12.4,       // 12.4% YoY

    // Customer Experience
    npsScore: 72,
    npsTrend: 'UP',

    customerSatisfaction: 92,
    satisfactionTrend: 'STABLE',

    // Operations
    employeeCount: 38,
    revenuePerEmployee: 1113,   // $1.113M per employee

    status: 'GOOD',
  },
  {
    branchId: 'edinburg-001',
    branchName: 'Edinburg Branch',
    branchManager: 'Michael Gonzalez',

    revenue: 38.7,
    revenueTrend: 'UP',
    revenueChange: 18.4,

    deposits: 278.9,
    depositsTrend: 'UP',
    depositsChange: 11.2,

    loanPortfolio: 156.8,
    loanPortfolioTrend: 'UP',
    loanPortfolioChange: 24.3,  // Strong loan growth

    netInterestMargin: 3.72,
    nimTrend: 'STABLE',

    efficiency: 58.7,
    efficiencyTrend: 'UP',      // UP means worsening

    newAccounts: 723,
    newAccountsTrend: 'UP',
    newAccountsChange: 31.2,    // High growth

    customerGrowth: 18.7,

    npsScore: 68,
    npsTrend: 'DOWN',

    customerSatisfaction: 87,
    satisfactionTrend: 'DOWN',

    employeeCount: 32,
    revenuePerEmployee: 1209,

    status: 'WARNING',  // Growing fast but satisfaction dropping
  },
  {
    branchId: 'pharr-001',
    branchName: 'Pharr Branch',
    branchManager: 'Linda Chen',

    revenue: 28.4,
    revenueTrend: 'STABLE',
    revenueChange: 4.2,

    deposits: 198.3,
    depositsTrend: 'UP',
    depositsChange: 5.8,

    loanPortfolio: 112.5,
    loanPortfolioTrend: 'STABLE',
    loanPortfolioChange: 3.1,

    netInterestMargin: 3.91,
    nimTrend: 'UP',

    efficiency: 52.1,           // Best efficiency
    efficiencyTrend: 'DOWN',

    newAccounts: 412,
    newAccountsTrend: 'STABLE',
    newAccountsChange: 2.8,

    customerGrowth: 5.2,

    npsScore: 78,               // Highest NPS
    npsTrend: 'UP',

    customerSatisfaction: 94,   // Highest satisfaction
    satisfactionTrend: 'UP',

    employeeCount: 24,
    revenuePerEmployee: 1183,

    status: 'GOOD',
  },
  {
    branchId: 'mission-001',
    branchName: 'Mission Branch',
    branchManager: 'David Martinez',

    revenue: 31.2,
    revenueTrend: 'UP',
    revenueChange: 8.6,

    deposits: 234.1,
    depositsTrend: 'UP',
    depositsChange: 6.3,

    loanPortfolio: 143.7,
    loanPortfolioTrend: 'UP',
    loanPortfolioChange: 9.8,

    netInterestMargin: 3.68,
    nimTrend: 'STABLE',

    efficiency: 56.4,
    efficiencyTrend: 'STABLE',

    newAccounts: 534,
    newAccountsTrend: 'UP',
    newAccountsChange: 11.4,

    customerGrowth: 8.9,

    npsScore: 71,
    npsTrend: 'STABLE',

    customerSatisfaction: 88,
    satisfactionTrend: 'UP',

    employeeCount: 28,
    revenuePerEmployee: 1114,

    status: 'GOOD',
  },
];

// ============================================
// EXECUTIVE KPIs
// ============================================

export const MOCK_EXECUTIVE_KPIS: BoardMetric[] = [
  {
    id: 'kpi-total-revenue',
    label: 'Total Revenue',
    value: '$140.6M',
    previousValue: '$128.2M',
    trend: 'UP',
    trendValue: '+9.7%',
    status: 'GOOD',
    source: 'SILVERLAKE_CORE',
    lastUpdated: '2025-01-14T06:00:00Z',
  },
  {
    id: 'kpi-total-deposits',
    label: 'Total Deposits',
    value: '$1.02B',
    previousValue: '$948M',
    trend: 'UP',
    trendValue: '+7.8%',
    status: 'GOOD',
    source: 'SILVERLAKE_CORE',
    lastUpdated: '2025-01-14T06:00:00Z',
  },
  {
    id: 'kpi-loan-portfolio',
    label: 'Loan Portfolio',
    value: '$600.2M',
    previousValue: '$542.8M',
    trend: 'UP',
    trendValue: '+10.6%',
    status: 'GOOD',
    source: 'LOAN_ORIGINATION',
    lastUpdated: '2025-01-14T06:00:00Z',
  },
  {
    id: 'kpi-net-interest-margin',
    label: 'Net Interest Margin',
    value: 3.79,
    previousValue: 3.62,
    unit: '%',
    trend: 'UP',
    trendValue: '+17bp',
    status: 'GOOD',
    source: 'SILVERLAKE_CORE',
    lastUpdated: '2025-01-14T06:00:00Z',
  },
];

// ============================================
// STRATEGIC INSIGHTS
// ============================================

export const MOCK_STRATEGIC_INSIGHTS: StrategicInsight[] = [
  {
    id: 'insight-001',
    category: 'INVEST',
    priority: 'HIGH',
    title: 'Commercial Lending Growth Opportunity',
    summary: 'Edinburg Branch shows 23% growth in commercial lending but is understaffed by 4.2 FTE',
    details: 'Analysis of Q4 2024 data shows strong demand for commercial loans in Edinburg market. Current processing delays average 12 days vs. 5-day target. Competitive analysis indicates market share opportunity of 8-12% if capacity is addressed.',
    recommendation: 'Consider reallocating 2 FTE from Mission Branch (58% capacity) and hiring 2 additional commercial loan officers',
    estimatedImpact: '$2.1M annual revenue opportunity',
    metrics: [
      {
        id: 'metric-edinburg-growth',
        label: 'YoY Growth',
        value: '23%',
        trend: 'UP',
        status: 'GOOD',
        source: 'SILVERLAKE_CORE',
        lastUpdated: '2025-01-14T06:00:00Z',
      },
      {
        id: 'metric-edinburg-understaffed',
        label: 'Staff Gap',
        value: '4.2 FTE',
        trend: 'STABLE',
        status: 'WARNING',
        source: 'HR_SYSTEM',
        lastUpdated: '2025-01-14T06:00:00Z',
      },
    ],
    sources: [
      {
        id: 'src-001',
        system: 'SILVERLAKE_CORE',
        description: 'Commercial loan volume and pipeline data',
        accessedAt: '2025-01-14T05:30:00Z',
        dataPoint: 'Q4 2024 commercial loan applications: 847 (+23% YoY)',
      },
      {
        id: 'src-002',
        system: 'HR_SYSTEM',
        description: 'Branch staffing levels and capacity',
        accessedAt: '2025-01-14T05:31:00Z',
        dataPoint: 'Edinburg current: 12 FTE, Required: 16.2 FTE',
      },
    ],
    relatedBranches: ['edinburg-001', 'mission-001'],
    createdAt: '2025-01-14T06:00:00Z',
  },
  {
    id: 'insight-002',
    category: 'INVEST',
    priority: 'MEDIUM',
    title: 'Digital Onboarding Automation',
    summary: '67% of account opening delays stem from document collection. Automation could save 1,200 hours/quarter',
    details: 'Process mining analysis reveals document collection is the primary bottleneck in new account opening. Current average: 4.2 days from application to account opening. Industry benchmark: 1.5 days. Primary delays: ID verification (28%), proof of address (24%), signature collection (15%).',
    recommendation: 'Implement digital document capture with OCR and e-signature integration',
    estimatedImpact: '1,200 hours/quarter saved, 65% reduction in time-to-open',
    metrics: [
      {
        id: 'metric-doc-delay',
        label: 'Doc Collection Delays',
        value: '67%',
        trend: 'STABLE',
        status: 'WARNING',
        source: 'AXIRA_ANALYTICS',
        lastUpdated: '2025-01-14T06:00:00Z',
      },
    ],
    sources: [
      {
        id: 'src-003',
        system: 'AXIRA_ANALYTICS',
        description: 'Process mining analysis of account opening workflow',
        accessedAt: '2025-01-14T05:32:00Z',
        dataPoint: 'Average time-to-open: 4.2 days (target: 1.5 days)',
      },
    ],
    relatedBranches: ['mcallen-001', 'edinburg-001', 'pharr-001', 'mission-001'],
    createdAt: '2025-01-14T06:00:00Z',
  },
  {
    id: 'insight-003',
    category: 'WATCH',
    priority: 'HIGH',
    title: 'Consumer Disputes Volume Increase',
    summary: 'Dispute volume up 34% with resolution time increasing 12%. Root cause: new Reg E requirements',
    details: 'Since October 2024 Reg E amendments took effect, consumer dispute volume has increased significantly. Current resolution SLA compliance: 78% (target: 95%). Primary issues: provisional credit timing, investigation documentation requirements.',
    recommendation: 'Review dispute handling procedures against new Reg E requirements. Consider additional training or temporary staffing.',
    estimatedImpact: 'Regulatory risk if not addressed within 60 days',
    metrics: [
      {
        id: 'metric-dispute-volume',
        label: 'Dispute Volume',
        value: '+34%',
        trend: 'UP',
        status: 'CRITICAL',
        source: 'SILVERLAKE_CORE',
        lastUpdated: '2025-01-14T06:00:00Z',
      },
      {
        id: 'metric-resolution-time',
        label: 'Resolution Time',
        value: '+12%',
        trend: 'UP',
        status: 'WARNING',
        source: 'SILVERLAKE_CORE',
        lastUpdated: '2025-01-14T06:00:00Z',
      },
    ],
    sources: [
      {
        id: 'src-004',
        system: 'SILVERLAKE_CORE',
        description: 'Dispute case volume and resolution metrics',
        accessedAt: '2025-01-14T05:33:00Z',
        dataPoint: 'Q4 disputes: 1,247 (Q3: 930)',
      },
      {
        id: 'src-005',
        system: 'REGULATORY_FEED',
        description: 'Reg E amendment effective October 2024',
        accessedAt: '2025-01-14T05:33:00Z',
        policyReference: 'CFPB Reg E Amendment 2024-10',
      },
    ],
    relatedBranches: ['mcallen-001', 'edinburg-001'],
    createdAt: '2025-01-14T06:00:00Z',
  },
  {
    id: 'insight-004',
    category: 'OPTIMIZE',
    priority: 'MEDIUM',
    title: 'McAllen Retail Capacity Reallocation',
    summary: 'McAllen retail fully staffed but operating at 82% capacity. Consider cross-training for commercial.',
    details: 'McAllen Branch retail operations are well-staffed with experienced team members. Current capacity utilization suggests opportunity to cross-train 2-3 team members on commercial lending to support Edinburg growth without new hires.',
    recommendation: 'Implement cross-training program for 3 McAllen retail staff on commercial loan processing',
    estimatedImpact: 'Address 50% of Edinburg capacity gap without new hires',
    metrics: [
      {
        id: 'metric-mcallen-capacity',
        label: 'Capacity Used',
        value: '82%',
        trend: 'STABLE',
        status: 'GOOD',
        source: 'HR_SYSTEM',
        lastUpdated: '2025-01-14T06:00:00Z',
      },
    ],
    sources: [
      {
        id: 'src-006',
        system: 'HR_SYSTEM',
        description: 'Staff utilization and training records',
        accessedAt: '2025-01-14T05:34:00Z',
        dataPoint: 'McAllen eligible for cross-training: 4 staff members',
      },
    ],
    relatedBranches: ['mcallen-001'],
    createdAt: '2025-01-14T06:00:00Z',
  },
];

// ============================================
// MOCK AUDIT TRAIL
// ============================================

export function createMockAuditTrail(queryText: string): AuditTrail {
  const now = new Date();
  const startTime = new Date(now.getTime() - 2500);

  const steps: DecisionStep[] = [
    {
      id: 'step-001',
      stepNumber: 1,
      description: 'Retrieving branch performance metrics from core banking system',
      agentName: 'Branch Analytics Agent',
      skillName: 'CoreBankingQuery',
      sources: [
        {
          id: 'evidence-001',
          system: 'SILVERLAKE_CORE',
          description: 'Branch performance dashboard query',
          documentName: 'Branch_Performance_Q4_2024.rpt',
          accessedAt: startTime.toISOString(),
          dataPoint: 'Retrieved metrics for 4 branches: McAllen, Edinburg, Pharr, Mission',
          policyReference: 'LSNB-POL-2024-03: Data Access Policy',
        },
      ],
      outcome: 'PASS',
      durationMs: 245,
      timestamp: startTime.toISOString(),
    },
    {
      id: 'step-002',
      stepNumber: 2,
      description: 'Cross-referencing compliance data from document management',
      agentName: 'Compliance Review Agent',
      skillName: 'DocumentPresenceCheck',
      sources: [
        {
          id: 'evidence-002',
          system: 'SYNERGY_DMS',
          description: 'Document compliance status query',
          documentName: 'compliance_status_report.json',
          accessedAt: new Date(startTime.getTime() + 300).toISOString(),
          dataPoint: '3,216 accounts reviewed, 21 items flagged',
        },
        {
          id: 'evidence-003',
          system: 'SHAREPOINT',
          description: 'Policy compliance reference',
          documentName: 'LSNB_Compliance_Policy_2024.pdf',
          url: 'https://lsnb.sharepoint.com/policies/compliance-2024',
          accessedAt: new Date(startTime.getTime() + 350).toISOString(),
          policyReference: 'Section 4.2: Document Retention Requirements',
        },
      ],
      outcome: 'WARNING',
      durationMs: 412,
      timestamp: new Date(startTime.getTime() + 300).toISOString(),
    },
    {
      id: 'step-003',
      stepNumber: 3,
      description: 'Analyzing risk exposure across branches',
      agentName: 'Risk Assessment Agent',
      skillName: 'ExposureCalculation',
      sources: [
        {
          id: 'evidence-004',
          system: 'SILVERLAKE_CORE',
          description: 'Risk exposure calculation',
          accessedAt: new Date(startTime.getTime() + 750).toISOString(),
          dataPoint: 'Total exposure: $266K across 4 branches',
        },
        {
          id: 'evidence-005',
          system: 'LEXISNEXIS',
          description: 'External risk factor validation',
          accessedAt: new Date(startTime.getTime() + 900).toISOString(),
          dataPoint: 'No adverse findings for flagged accounts',
        },
      ],
      outcome: 'PASS',
      durationMs: 523,
      timestamp: new Date(startTime.getTime() + 750).toISOString(),
    },
    {
      id: 'step-004',
      stepNumber: 4,
      description: 'Generating strategic recommendations',
      agentName: 'Strategic Analysis Agent',
      skillName: 'InsightGeneration',
      sources: [
        {
          id: 'evidence-006',
          system: 'AXIRA_ANALYTICS',
          description: 'Historical trend analysis',
          accessedAt: new Date(startTime.getTime() + 1300).toISOString(),
          dataPoint: 'Compared against 12-month historical baseline',
        },
        {
          id: 'evidence-007',
          system: 'HR_SYSTEM',
          description: 'Staffing and capacity data',
          accessedAt: new Date(startTime.getTime() + 1400).toISOString(),
          dataPoint: 'Branch capacity utilization: 58%-118%',
        },
      ],
      outcome: 'PASS',
      durationMs: 834,
      timestamp: new Date(startTime.getTime() + 1300).toISOString(),
    },
  ];

  return {
    id: `audit-${Date.now()}`,
    queryText,
    requestedAt: startTime.toISOString(),
    completedAt: now.toISOString(),
    totalDurationMs: 2500,
    userId: 'board-member-001',
    tenantId: 'lsnb-001',
    decisionSteps: steps,
    hashChain: {
      hash: 'a3f2b8c9d1e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0',
      previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
      verified: true,
    },
    accessDecisions: [
      {
        id: 'access-001',
        resource: 'branch_performance_metrics',
        resourceType: 'REPORT',
        action: 'ALLOWED',
        reason: 'Board member role has access to all branch metrics',
        policyRef: 'LSNB-RBAC-2024: Board Member Access',
        timestamp: startTime.toISOString(),
      },
      {
        id: 'access-002',
        resource: 'individual_customer_data',
        resourceType: 'PII',
        action: 'DENIED',
        reason: 'Board view shows aggregated data only - individual PII masked',
        policyRef: 'LSNB-PRIVACY-2024: Data Minimization',
        timestamp: new Date(startTime.getTime() + 100).toISOString(),
      },
      {
        id: 'access-003',
        resource: 'compliance_policy_documents',
        resourceType: 'POLICY',
        action: 'ALLOWED',
        reason: 'Policy documents accessible to all authenticated users',
        policyRef: 'LSNB-POL-2024-01: Policy Transparency',
        timestamp: new Date(startTime.getTime() + 400).toISOString(),
      },
    ],
  };
}

// ============================================
// MOCK CONVERSATION - Board Q&A Demo
// ============================================

export const MOCK_BOARD_CONVERSATION: BoardMessage[] = [
  {
    id: 'msg-001',
    role: 'user',
    content: "What's our risk exposure across the McAllen and Edinburg branches right now?",
    timestamp: '2025-01-14T09:00:00Z',
  },
  {
    id: 'msg-002',
    role: 'assistant',
    content: 'Based on my analysis of current branch operations, here is the risk exposure summary:',
    timestamp: '2025-01-14T09:00:03Z',
    structuredResponse: {
      summaryItems: [
        {
          id: 'summary-mcallen',
          status: 'PASS',
          title: 'McAllen Branch',
          message: '98.2% compliance rate - Up 1.3% from last month',
          details: '1,247 accounts reviewed this week',
          metric: {
            value: '$47K',
            trend: 'DOWN',
            trendValue: 'down from $89K',
          },
          subItems: [
            {
              id: 'summary-mcallen-1',
              status: 'PASS',
              title: 'Document Compliance',
              message: 'All required documents present for 98.2% of accounts',
            },
            {
              id: 'summary-mcallen-2',
              status: 'WARNING',
              title: 'Flagged Items',
              message: '3 high-priority items need attention',
            },
          ],
        },
        {
          id: 'summary-edinburg',
          status: 'WARNING',
          title: 'Edinburg Branch',
          message: '94.1% compliance rate - Below 95% target',
          details: '892 accounts reviewed',
          metric: {
            value: '$156K',
            trend: 'UP',
            trendValue: 'needs review',
          },
          subItems: [
            {
              id: 'summary-edinburg-1',
              status: 'WARNING',
              title: 'Documentation Gaps',
              message: '12 items need attention',
            },
            {
              id: 'summary-edinburg-2',
              status: 'INFO',
              title: 'Root Cause',
              message: '4x more gaps in commercial accounts due to understaffing',
            },
          ],
        },
        {
          id: 'summary-recommendation',
          status: 'INFO',
          title: 'Recommendation',
          message: 'Consider resource reallocation from McAllen (fully staffed) to address Edinburg capacity gap',
        },
      ],
      citations: [
        {
          id: 'cite-001',
          source: 'SILVERLAKE_CORE',
          label: 'Core Banking Data',
          description: 'Branch performance metrics retrieved at 6:00 AM today',
        },
        {
          id: 'cite-002',
          source: 'SYNERGY_DMS',
          label: 'Document Status',
          description: 'Compliance verification from Synergy DMS',
        },
        {
          id: 'cite-003',
          source: 'SHAREPOINT',
          label: 'LSNB Policy 2024-03',
          description: 'Branch Compliance Requirements',
          url: 'https://lsnb.sharepoint.com/policies/compliance-2024',
          policyRef: 'Section 4.2',
        },
      ],
      availableActions: [
        {
          id: 'action-001',
          label: 'View Evidence',
          actionType: 'OPEN_EVIDENCE',
          primary: true,
          icon: 'file-search',
        },
        {
          id: 'action-002',
          label: 'See Trend',
          actionType: 'DRILL_DOWN',
          icon: 'trending-up',
        },
        {
          id: 'action-003',
          label: 'Download Report',
          actionType: 'DOWNLOAD_REPORT',
          icon: 'download',
        },
      ],
    },
    planningContext: {
      isPlanning: false,
      stepsCompleted: 4,
      totalSteps: 4,
      steps: [
        {
          id: 'plan-001',
          name: 'Branch Performance Query',
          status: 'COMPLETED',
          agentName: 'Branch Analytics Agent',
          skillName: 'CoreBankingQuery',
          durationMs: 245,
        },
        {
          id: 'plan-002',
          name: 'Compliance Verification',
          status: 'COMPLETED',
          agentName: 'Compliance Review Agent',
          skillName: 'DocumentPresenceCheck',
          durationMs: 412,
        },
        {
          id: 'plan-003',
          name: 'Risk Calculation',
          status: 'COMPLETED',
          agentName: 'Risk Assessment Agent',
          skillName: 'ExposureCalculation',
          durationMs: 523,
        },
        {
          id: 'plan-004',
          name: 'Strategic Analysis',
          status: 'COMPLETED',
          agentName: 'Strategic Analysis Agent',
          skillName: 'InsightGeneration',
          durationMs: 834,
        },
      ],
    },
  },
];

// ============================================
// SECOND CONVERSATION - "How did you decide this?"
// ============================================

export const MOCK_EXPLAIN_CONVERSATION: BoardMessage[] = [
  {
    id: 'explain-001',
    role: 'user',
    content: 'How did you determine the Edinburg exposure figure?',
    timestamp: '2025-01-14T09:01:00Z',
  },
  {
    id: 'explain-002',
    role: 'assistant',
    content: 'Here is the complete decision transparency for the Edinburg exposure calculation:',
    timestamp: '2025-01-14T09:01:02Z',
    structuredResponse: {
      summaryItems: [
        {
          id: 'explain-step1',
          status: 'PASS',
          title: 'Step 1: Document Presence Check',
          message: 'Verified 47 document types against RegE, BSA/AML, and LSNB Policy 2024-03',
          details: 'Source: Synergy DMS, Core Banking',
        },
        {
          id: 'explain-step2',
          status: 'PASS',
          title: 'Step 2: CIP/CIF Validation',
          message: 'Cross-referenced customer records against identity verification requirements',
          details: 'Source: Silverlake Core, LexisNexis',
        },
        {
          id: 'explain-step3',
          status: 'PASS',
          title: 'Step 3: Risk Scoring',
          message: 'Applied LSNB risk matrix v2.1 to calculate exposure',
          details: 'Validated by: Compliance Team (Jan 2024)',
        },
      ],
      citations: [
        {
          id: 'cite-explain-001',
          source: 'SYNERGY_DMS',
          label: 'Document Verification Log',
          description: '892 accounts checked, 12 exceptions found',
          documentId: 'DOC-2025-01-14-001',
        },
        {
          id: 'cite-explain-002',
          source: 'SILVERLAKE_CORE',
          label: 'Account Risk Scores',
          description: 'Risk matrix application results',
        },
        {
          id: 'cite-explain-003',
          source: 'LEXISNEXIS',
          label: 'Identity Verification',
          description: 'External validation results',
        },
        {
          id: 'cite-explain-004',
          source: 'SHAREPOINT',
          label: 'LSNB Risk Matrix v2.1',
          description: 'Approved January 2024',
          url: 'https://lsnb.sharepoint.com/policies/risk-matrix-2024',
          policyRef: 'Risk Matrix v2.1',
        },
      ],
      availableActions: [
        {
          id: 'action-audit',
          label: 'Open Full Audit Trail',
          actionType: 'OPEN_EVIDENCE',
          primary: true,
          icon: 'shield-check',
        },
      ],
    },
  },
];

// ============================================
// STRATEGIC QUESTION CONVERSATION
// ============================================

export const MOCK_STRATEGIC_CONVERSATION: BoardMessage[] = [
  {
    id: 'strategic-001',
    role: 'user',
    content: 'Based on Q3 performance, where should we focus investment next year?',
    timestamp: '2025-01-14T09:05:00Z',
  },
  {
    id: 'strategic-002',
    role: 'assistant',
    content: 'Based on operational data across all branches, here are my strategic recommendations:',
    timestamp: '2025-01-14T09:05:04Z',
    structuredResponse: {
      summaryItems: [
        {
          id: 'strategic-invest',
          status: 'PASS',
          title: 'INVEST MORE',
          message: 'Two areas show strong ROI potential',
          subItems: [
            {
              id: 'strategic-invest-1',
              status: 'PASS',
              title: 'Commercial Lending (Edinburg)',
              message: '23% growth, but 4.2 FTE understaffed',
              details: 'Estimated revenue opportunity: $2.1M',
            },
            {
              id: 'strategic-invest-2',
              status: 'PASS',
              title: 'Digital Onboarding',
              message: '67% of delays are document collection',
              details: 'Automation could save 1,200 hours/quarter',
            },
          ],
        },
        {
          id: 'strategic-watch',
          status: 'WARNING',
          title: 'WATCH CLOSELY',
          message: 'Consumer Disputes',
          subItems: [
            {
              id: 'strategic-watch-1',
              status: 'WARNING',
              title: 'Volume Up 34%',
              message: 'Resolution time up 12%',
              details: 'Root cause: New Reg E requirements',
            },
          ],
        },
        {
          id: 'strategic-optimize',
          status: 'INFO',
          title: 'OPTIMIZE',
          message: 'McAllen Retail',
          subItems: [
            {
              id: 'strategic-optimize-1',
              status: 'INFO',
              title: 'Fully Staffed',
              message: '18% capacity unused',
              details: 'Consider cross-training for commercial support',
            },
          ],
        },
      ],
      insights: MOCK_STRATEGIC_INSIGHTS,
      citations: [
        {
          id: 'cite-strategic-001',
          source: 'AXIRA_ANALYTICS',
          label: 'Operational Analysis',
          description: '47,000 decisions tracked this quarter',
        },
        {
          id: 'cite-strategic-002',
          source: 'SILVERLAKE_CORE',
          label: 'Financial Performance',
          description: 'Q3-Q4 2024 branch metrics',
        },
        {
          id: 'cite-strategic-003',
          source: 'HR_SYSTEM',
          label: 'Capacity Planning',
          description: 'Staffing and utilization data',
        },
      ],
      availableActions: [
        {
          id: 'action-report',
          label: 'Download Board Report',
          actionType: 'DOWNLOAD_REPORT',
          primary: true,
          icon: 'file-text',
        },
        {
          id: 'action-review',
          label: 'Schedule Deep Dive',
          actionType: 'SCHEDULE_REVIEW',
          icon: 'calendar',
        },
      ],
    },
  },
];

// ============================================
// BRANCH COMPARISON CHART DATA
// ============================================

import type { BranchChartData, TrendData } from '../components/BranchComparisonChart';

export const MOCK_BRANCH_CHART_DATA: BranchChartData[] = [
  {
    branchName: 'McAllen',
    branchId: 'mcallen-001',
    revenue: 42.3,
    satisfaction: 92,
    compliance: 97.1,
    efficiency: 88,
    growth: 12,
    color: '#3b82f6',
  },
  {
    branchName: 'Edinburg',
    branchId: 'edinburg-001',
    revenue: 38.7,
    satisfaction: 87,
    compliance: 96.8,
    efficiency: 82,
    growth: 18,
    color: '#22c55e',
  },
  {
    branchName: 'Mission',
    branchId: 'mission-001',
    revenue: 31.2,
    satisfaction: 88,
    compliance: 98.5,
    efficiency: 75,
    growth: 8,
    color: '#8b5cf6',
  },
  {
    branchName: 'Brownsville',
    branchId: 'brownsville-001',
    revenue: 28.1,
    satisfaction: 85,
    compliance: 94.2,
    efficiency: 71,
    growth: 5,
    color: '#f59e0b',
  },
];

export const MOCK_REVENUE_TREND: TrendData[] = [
  { month: 'Jul', value: 32.5 },
  { month: 'Aug', value: 34.2 },
  { month: 'Sep', value: 35.8 },
  { month: 'Oct', value: 38.2 },
  { month: 'Nov', value: 40.1 },
  { month: 'Dec', value: 42.8 },
];

export const MOCK_COMPLIANCE_TREND: TrendData[] = [
  { month: 'Jul', value: 93.5 },
  { month: 'Aug', value: 94.2 },
  { month: 'Sep', value: 94.8 },
  { month: 'Oct', value: 95.4 },
  { month: 'Nov', value: 95.9 },
  { month: 'Dec', value: 96.2 },
];

// Branch breakdown for revenue trend
import type { BranchTrendBreakdown } from '../components/BranchComparisonChart';

export const MOCK_REVENUE_BREAKDOWN: BranchTrendBreakdown[] = [
  { branchName: 'McAllen', value: 42.3, change: 15, color: '#3b82f6' },
  { branchName: 'Edinburg', value: 38.7, change: 18, color: '#22c55e' },
  { branchName: 'Mission', value: 31.2, change: 8, color: '#8b5cf6' },
  { branchName: 'Brownsville', value: 28.1, change: 5, color: '#f59e0b' },
];

export const MOCK_COMPLIANCE_BREAKDOWN: BranchTrendBreakdown[] = [
  { branchName: 'McAllen', value: 98.2, change: 1.3, color: '#3b82f6' },
  { branchName: 'Mission', value: 97.8, change: 0.2, color: '#8b5cf6' },
  { branchName: 'Edinburg', value: 94.1, change: -2.1, color: '#22c55e' },
  { branchName: 'Brownsville', value: 94.2, change: 0.5, color: '#f59e0b' },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getTotalMetrics() {
  const total = MOCK_BRANCH_METRICS.reduce(
    (acc, branch) => ({
      revenue: acc.revenue + branch.revenue,
      deposits: acc.deposits + branch.deposits,
      loanPortfolio: acc.loanPortfolio + branch.loanPortfolio,
      newAccounts: acc.newAccounts + branch.newAccounts,
      employeeCount: acc.employeeCount + branch.employeeCount,
    }),
    { revenue: 0, deposits: 0, loanPortfolio: 0, newAccounts: 0, employeeCount: 0 }
  );

  const avgNIM =
    MOCK_BRANCH_METRICS.reduce((acc, b) => acc + b.netInterestMargin, 0) /
    MOCK_BRANCH_METRICS.length;

  const avgCustomerGrowth =
    MOCK_BRANCH_METRICS.reduce((acc, b) => acc + b.customerGrowth, 0) /
    MOCK_BRANCH_METRICS.length;

  return {
    ...total,
    avgNIM: Math.round(avgNIM * 100) / 100,
    avgCustomerGrowth: Math.round(avgCustomerGrowth * 10) / 10,
    branchCount: MOCK_BRANCH_METRICS.length,
  };
}

export function getBranchById(branchId: string): BranchMetrics | undefined {
  return MOCK_BRANCH_METRICS.find((b) => b.branchId === branchId);
}

export function getInsightsByCategory(category: string): StrategicInsight[] {
  return MOCK_STRATEGIC_INSIGHTS.filter((i) => i.category === category);
}
