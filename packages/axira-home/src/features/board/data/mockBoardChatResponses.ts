import type { ChatMessage, StructuredResponse, PlanningState, SkillExecution } from '../../chat/types';

// Chart data types for board responses
export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'donut';
  title: string;
  data: Array<{
    label: string;
    value: number;
    color?: string;
    trend?: number; // percentage change
  }>;
  unit?: string;
  comparison?: {
    period: string;
    change: number;
  };
}

export interface BoardChatResponse {
  query: string;
  keywords: string[]; // Keywords to match for this response
  planningState: PlanningState;
  skillsExecuted: SkillExecution[];
  structuredResponse?: StructuredResponse;
  content: string;
  charts?: ChartData[];
  evidencePackId?: string;
}

// Mock responses for common board queries
export const BOARD_MOCK_RESPONSES: BoardChatResponse[] = [
  // Risk Exposure Query
  {
    query: 'What is our current risk exposure?',
    keywords: ['risk', 'exposure', 'risk exposure'],
    planningState: {
      businessAgentId: 'board-advisor',
      businessAgentName: 'Board Advisor',
      processAgentKey: 'risk-analysis-pa',
      processAgentName: 'Risk Analysis',
      stage: 'complete',
      summary: 'Analyzing risk exposure across all branches and portfolios',
    },
    skillsExecuted: [
      { skillId: 'risk-aggregator', skillName: 'Risk Aggregator', status: 'SUCCESS', durationMs: 450 },
      { skillId: 'compliance-checker', skillName: 'Compliance Checker', status: 'SUCCESS', durationMs: 320 },
      { skillId: 'portfolio-analyzer', skillName: 'Portfolio Analyzer', status: 'SUCCESS', durationMs: 280 },
    ],
    structuredResponse: {
      summaryItems: [
        { status: 'WARNING', message: 'Compliance risk elevated in McAllen branch', details: 'Document verification backlog of 23 accounts' },
        { status: 'PASS', message: 'Credit risk within acceptable limits', details: 'Portfolio NPL ratio at 1.2%, below 2% threshold' },
        { status: 'PASS', message: 'Operational risk stable', details: 'All critical systems operating normally' },
        { status: 'WARNING', message: 'Regulatory examination due in 45 days', details: 'OCC annual review scheduled for Q1' },
      ],
      citations: [],
      availableActions: [
        { id: 'view-risk-report', label: 'View Full Risk Report', actionType: 'CUSTOM', variant: 'primary' },
        { id: 'schedule-review', label: 'Schedule Risk Committee', actionType: 'CUSTOM', variant: 'secondary' },
      ],
    },
    content: `**Risk Exposure Summary - December 2024**

Based on comprehensive analysis across all branches and portfolios:

**Overall Risk Rating: MODERATE**

1. **Compliance Risk** - Elevated attention required
   - McAllen branch has a document verification backlog
   - 23 accounts pending review for signature cards
   - Recommendation: Allocate additional QA resources

2. **Credit Risk** - Within acceptable parameters
   - Total loan portfolio: $847M
   - Non-performing loans: 1.2% (threshold: 2.0%)
   - Delinquency trend: Stable

3. **Operational Risk** - Low concern
   - System uptime: 99.97%
   - No critical incidents in past 30 days
   - Fraud detection systems operational

4. **Regulatory Risk** - Action required
   - OCC examination scheduled in 45 days
   - Recommend pre-examination readiness review`,
    charts: [
      {
        type: 'bar',
        title: 'Risk Exposure by Category',
        data: [
          { label: 'Compliance', value: 65, color: '#f59e0b' },
          { label: 'Credit', value: 35, color: '#22c55e' },
          { label: 'Operational', value: 25, color: '#22c55e' },
          { label: 'Regulatory', value: 55, color: '#f59e0b' },
        ],
        unit: 'Risk Score',
      },
      {
        type: 'line',
        title: 'Risk Trend (6 Months)',
        data: [
          { label: 'Jul', value: 42 },
          { label: 'Aug', value: 45 },
          { label: 'Sep', value: 48 },
          { label: 'Oct', value: 44 },
          { label: 'Nov', value: 47 },
          { label: 'Dec', value: 45 },
        ],
        unit: 'Composite Score',
      },
    ],
    evidencePackId: 'ep-risk-analysis-001',
  },

  // Investment Query
  {
    query: 'Where should we invest next quarter?',
    keywords: ['invest', 'investment', 'next quarter', 'priorities', 'allocate'],
    planningState: {
      businessAgentId: 'board-advisor',
      businessAgentName: 'Board Advisor',
      processAgentKey: 'investment-analysis-pa',
      processAgentName: 'Investment Analysis',
      stage: 'complete',
      summary: 'Analyzing investment opportunities and ROI projections',
    },
    skillsExecuted: [
      { skillId: 'market-analyzer', skillName: 'Market Analyzer', status: 'SUCCESS', durationMs: 520 },
      { skillId: 'roi-calculator', skillName: 'ROI Calculator', status: 'SUCCESS', durationMs: 380 },
      { skillId: 'branch-performance', skillName: 'Branch Performance', status: 'SUCCESS', durationMs: 290 },
    ],
    structuredResponse: {
      summaryItems: [
        { status: 'PASS', message: 'Digital banking platform upgrade - High ROI potential', details: 'Projected 340% ROI over 18 months' },
        { status: 'PASS', message: 'Edinburg branch expansion recommended', details: 'Market analysis shows 15% growth opportunity' },
        { status: 'WARNING', message: 'Staff training investment needed', details: 'Compliance training gap identified' },
      ],
      citations: [],
      availableActions: [
        { id: 'view-analysis', label: 'View Full Analysis', actionType: 'CUSTOM', variant: 'primary' },
        { id: 'create-proposal', label: 'Create Investment Proposal', actionType: 'CUSTOM', variant: 'secondary' },
      ],
    },
    content: `**Q1 2025 Investment Recommendations**

Based on comprehensive market analysis and operational data:

**Top Investment Priorities:**

1. **Digital Banking Platform Enhancement** - Priority: HIGH
   - Estimated Investment: $450K
   - Projected ROI: 340% over 18 months
   - Customer adoption rate projected: 67%
   - Competitive advantage: Significant

2. **Edinburg Branch Expansion** - Priority: HIGH
   - Market growth opportunity: 15%
   - Underserved demographic: Small business
   - Estimated revenue increase: $2.1M annually
   - Break-even: 14 months

3. **Compliance Technology Investment** - Priority: MEDIUM
   - Regulatory automation tools
   - Document verification AI
   - Risk reduction: 35%
   - Staff efficiency gain: 40%

4. **Staff Training & Development** - Priority: MEDIUM
   - Compliance certification programs
   - Customer service excellence
   - Leadership development
   - Budget recommendation: $180K`,
    charts: [
      {
        type: 'bar',
        title: 'Projected ROI by Investment',
        data: [
          { label: 'Digital Platform', value: 340, color: '#22c55e' },
          { label: 'Branch Expansion', value: 180, color: '#22c55e' },
          { label: 'Compliance Tech', value: 120, color: '#3b82f6' },
          { label: 'Training', value: 85, color: '#3b82f6' },
        ],
        unit: '% ROI',
      },
      {
        type: 'pie',
        title: 'Recommended Budget Allocation',
        data: [
          { label: 'Digital Platform', value: 450, color: '#3b82f6' },
          { label: 'Branch Expansion', value: 800, color: '#22c55e' },
          { label: 'Compliance Tech', value: 280, color: '#8b5cf6' },
          { label: 'Training', value: 180, color: '#f59e0b' },
        ],
        unit: '$K',
      },
    ],
    evidencePackId: 'ep-investment-001',
  },

  // Branch Performance Query
  {
    query: 'Show branch performance summary',
    keywords: ['branch', 'performance', 'branches', 'summary', 'comparison'],
    planningState: {
      businessAgentId: 'board-advisor',
      businessAgentName: 'Board Advisor',
      processAgentKey: 'branch-analytics-pa',
      processAgentName: 'Branch Analytics',
      stage: 'complete',
      summary: 'Aggregating performance metrics across all branches',
    },
    skillsExecuted: [
      { skillId: 'branch-metrics', skillName: 'Branch Metrics Collector', status: 'SUCCESS', durationMs: 410 },
      { skillId: 'kpi-calculator', skillName: 'KPI Calculator', status: 'SUCCESS', durationMs: 350 },
      { skillId: 'trend-analyzer', skillName: 'Trend Analyzer', status: 'SUCCESS', durationMs: 280 },
    ],
    structuredResponse: {
      summaryItems: [
        { status: 'PASS', message: 'McAllen branch leads in customer satisfaction', details: '92% satisfaction score, +5% from last quarter' },
        { status: 'PASS', message: 'Edinburg branch highest revenue growth', details: '+18% YoY, exceeding target by 8%' },
        { status: 'WARNING', message: 'Brownsville branch efficiency needs attention', details: 'Processing time 15% above benchmark' },
        { status: 'PASS', message: 'Mission branch compliance rate excellent', details: '98.5% compliance, best in network' },
      ],
      citations: [],
      availableActions: [
        { id: 'detailed-report', label: 'View Detailed Report', actionType: 'CUSTOM', variant: 'primary' },
        { id: 'compare-branches', label: 'Compare Branches', actionType: 'CUSTOM', variant: 'secondary' },
      ],
    },
    content: `**Branch Performance Summary - Q4 2024**

**Network Overview:**
- Total Branches: 4
- Combined Assets: $1.2B
- Overall Customer Satisfaction: 89%
- Network Compliance Rate: 96.2%

**Branch Rankings:**

| Branch | Revenue | Satisfaction | Compliance | Efficiency |
|--------|---------|--------------|------------|------------|
| McAllen | $42.3M | 92% | 97.1% | A |
| Edinburg | $38.7M | 87% | 96.8% | A- |
| Mission | $31.2M | 88% | 98.5% | B+ |
| Brownsville | $28.1M | 85% | 94.2% | B |

**Key Insights:**
- McAllen continues to lead in customer experience
- Edinburg showing strongest growth trajectory
- Mission has best compliance record
- Brownsville needs operational improvement focus`,
    charts: [
      {
        type: 'bar',
        title: 'Revenue by Branch (Q4 2024)',
        data: [
          { label: 'McAllen', value: 42.3, color: '#3b82f6' },
          { label: 'Edinburg', value: 38.7, color: '#22c55e' },
          { label: 'Mission', value: 31.2, color: '#8b5cf6' },
          { label: 'Brownsville', value: 28.1, color: '#f59e0b' },
        ],
        unit: '$M',
      },
      {
        type: 'bar',
        title: 'Customer Satisfaction Score',
        data: [
          { label: 'McAllen', value: 92, color: '#22c55e' },
          { label: 'Edinburg', value: 87, color: '#22c55e' },
          { label: 'Mission', value: 88, color: '#22c55e' },
          { label: 'Brownsville', value: 85, color: '#f59e0b' },
        ],
        unit: '%',
      },
      {
        type: 'bar',
        title: 'Compliance Rate',
        data: [
          { label: 'McAllen', value: 97.1, color: '#22c55e' },
          { label: 'Edinburg', value: 96.8, color: '#22c55e' },
          { label: 'Mission', value: 98.5, color: '#22c55e' },
          { label: 'Brownsville', value: 94.2, color: '#f59e0b' },
        ],
        unit: '%',
      },
    ],
    evidencePackId: 'ep-branch-performance-001',
  },

  // Compliance Trends Query
  {
    query: 'Show me compliance trends',
    keywords: ['compliance', 'trends', 'regulatory', 'audit'],
    planningState: {
      businessAgentId: 'board-advisor',
      businessAgentName: 'Board Advisor',
      processAgentKey: 'compliance-analytics-pa',
      processAgentName: 'Compliance Analytics',
      stage: 'complete',
      summary: 'Analyzing compliance trends and regulatory metrics',
    },
    skillsExecuted: [
      { skillId: 'compliance-aggregator', skillName: 'Compliance Aggregator', status: 'SUCCESS', durationMs: 380 },
      { skillId: 'audit-analyzer', skillName: 'Audit Analyzer', status: 'SUCCESS', durationMs: 290 },
      { skillId: 'exception-tracker', skillName: 'Exception Tracker', status: 'SUCCESS', durationMs: 240 },
    ],
    structuredResponse: {
      summaryItems: [
        { status: 'PASS', message: 'Overall compliance rate improved to 96.2%', details: 'Up from 94.8% last quarter' },
        { status: 'WARNING', message: 'BSA/AML documentation gaps identified', details: '12 accounts require updated CDD' },
        { status: 'PASS', message: 'Reg E compliance at 100%', details: 'All debit card disclosures current' },
        { status: 'PASS', message: 'TRID compliance rate: 99.2%', details: 'Minor timing issues resolved' },
      ],
      citations: [],
      availableActions: [
        { id: 'compliance-report', label: 'Full Compliance Report', actionType: 'CUSTOM', variant: 'primary' },
        { id: 'schedule-audit', label: 'Schedule Internal Audit', actionType: 'CUSTOM', variant: 'secondary' },
      ],
    },
    content: `**Compliance Trends Analysis - 2024**

**Overall Compliance Health: GOOD**

**Key Metrics:**
- Overall Compliance Rate: 96.2% (+1.4% QoQ)
- Open Exceptions: 47 (down from 62)
- Average Resolution Time: 4.2 days

**Regulatory Area Performance:**

1. **BSA/AML** - Attention Needed
   - CDD refresh rate: 94%
   - SAR filing timeliness: 100%
   - Gap: 12 accounts need CDD updates

2. **Consumer Compliance** - Strong
   - Reg E: 100%
   - TRID: 99.2%
   - HMDA: 98.7%

3. **Document Management** - Improving
   - Signature card completion: 97%
   - Beneficial ownership: 96%
   - W-8/W-9 compliance: 95%

**Trend Analysis:**
Compliance rates have shown consistent improvement over the past 6 months, with document verification being the primary area requiring continued focus.`,
    charts: [
      {
        type: 'line',
        title: 'Compliance Rate Trend',
        data: [
          { label: 'Jul', value: 93.5 },
          { label: 'Aug', value: 94.2 },
          { label: 'Sep', value: 94.8 },
          { label: 'Oct', value: 95.4 },
          { label: 'Nov', value: 95.9 },
          { label: 'Dec', value: 96.2 },
        ],
        unit: '%',
      },
      {
        type: 'bar',
        title: 'Compliance by Category',
        data: [
          { label: 'BSA/AML', value: 94, color: '#f59e0b' },
          { label: 'Consumer', value: 99, color: '#22c55e' },
          { label: 'Documents', value: 96, color: '#22c55e' },
          { label: 'Operations', value: 97, color: '#22c55e' },
        ],
        unit: '%',
      },
    ],
    evidencePackId: 'ep-compliance-001',
  },

  // Board Report Query
  {
    query: 'Generate a board report',
    keywords: ['board report', 'quarterly report', 'executive summary', 'generate report'],
    planningState: {
      businessAgentId: 'board-advisor',
      businessAgentName: 'Board Advisor',
      processAgentKey: 'report-generator-pa',
      processAgentName: 'Report Generator',
      stage: 'complete',
      summary: 'Generating comprehensive board report',
    },
    skillsExecuted: [
      { skillId: 'data-aggregator', skillName: 'Data Aggregator', status: 'SUCCESS', durationMs: 680 },
      { skillId: 'report-compiler', skillName: 'Report Compiler', status: 'SUCCESS', durationMs: 520 },
      { skillId: 'insight-generator', skillName: 'Insight Generator', status: 'SUCCESS', durationMs: 440 },
    ],
    structuredResponse: {
      summaryItems: [
        { status: 'PASS', message: 'Q4 2024 performance exceeded targets', details: 'Revenue +12%, Customer growth +8%' },
        { status: 'PASS', message: 'Asset quality remains strong', details: 'NPL ratio at 1.2%, well below peers' },
        { status: 'WARNING', message: 'Technology investment needed', details: 'Digital adoption below industry average' },
        { status: 'PASS', message: 'Capital ratios healthy', details: 'Tier 1 Capital: 12.8%, above regulatory minimum' },
      ],
      citations: [],
      availableActions: [
        { id: 'download-pdf', label: 'Download PDF Report', actionType: 'CUSTOM', variant: 'primary' },
        { id: 'share-report', label: 'Share with Board', actionType: 'CUSTOM', variant: 'secondary' },
      ],
    },
    content: `**Quarterly Board Report - Q4 2024**
**Lone Star National Bank**

---

**EXECUTIVE SUMMARY**

Q4 2024 was a strong quarter for Lone Star National Bank, with performance exceeding expectations across most key metrics.

**Financial Highlights:**
- Total Assets: $1.24B (+6% YoY)
- Net Income: $4.2M (+15% QoQ)
- ROA: 1.35%
- ROE: 11.2%
- Net Interest Margin: 3.42%

**Operational Highlights:**
- Customer accounts: 47,200 (+8% YoY)
- Digital banking adoption: 62%
- Customer satisfaction: 89%
- Employee retention: 94%

**Risk & Compliance:**
- Compliance rate: 96.2%
- NPL ratio: 1.2%
- Tier 1 Capital: 12.8%
- Liquidity ratio: 28%

**Strategic Initiatives Status:**
1. Digital transformation - On track
2. Branch expansion - Planning phase
3. Process automation - 60% complete
4. Talent development - Ongoing

**Board Recommendations:**
1. Approve Q1 2025 technology investment
2. Review branch expansion timeline
3. Conduct strategic planning session`,
    charts: [
      {
        type: 'bar',
        title: 'Quarterly Revenue ($M)',
        data: [
          { label: 'Q1', value: 32.5 },
          { label: 'Q2', value: 35.8 },
          { label: 'Q3', value: 38.2 },
          { label: 'Q4', value: 42.8 },
        ],
        unit: '$M',
        comparison: { period: 'YoY', change: 12 },
      },
      {
        type: 'donut',
        title: 'Revenue by Segment',
        data: [
          { label: 'Consumer', value: 45, color: '#3b82f6' },
          { label: 'Commercial', value: 35, color: '#22c55e' },
          { label: 'Wealth', value: 12, color: '#8b5cf6' },
          { label: 'Other', value: 8, color: '#f59e0b' },
        ],
        unit: '%',
      },
    ],
    evidencePackId: 'ep-board-report-001',
  },
];

// Function to find matching response based on query
export function findBoardResponse(query: string): BoardChatResponse | null {
  const normalizedQuery = query.toLowerCase();

  for (const response of BOARD_MOCK_RESPONSES) {
    // Check if query matches any keywords
    const hasMatch = response.keywords.some(keyword =>
      normalizedQuery.includes(keyword.toLowerCase())
    );

    if (hasMatch) {
      return response;
    }
  }

  return null;
}

// Default fallback response for unmatched queries
export const DEFAULT_BOARD_RESPONSE: BoardChatResponse = {
  query: 'default',
  keywords: [],
  planningState: {
    businessAgentId: 'board-advisor',
    businessAgentName: 'Board Advisor',
    processAgentKey: 'general-analysis-pa',
    processAgentName: 'General Analysis',
    stage: 'complete',
    summary: 'Processing your request',
  },
  skillsExecuted: [
    { skillId: 'query-processor', skillName: 'Query Processor', status: 'SUCCESS', durationMs: 250 },
  ],
  content: `I understand you're asking about bank operations. Let me help you with some relevant information.

For detailed analysis, you can ask me about:
- **Risk exposure** - Current risk levels across all categories
- **Investment priorities** - Where to allocate resources
- **Branch performance** - Comparative metrics across locations
- **Compliance trends** - Regulatory and audit status
- **Board reports** - Comprehensive executive summaries

How can I assist you further?`,
};
