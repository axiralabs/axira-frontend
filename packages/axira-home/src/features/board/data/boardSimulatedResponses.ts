// Simulated responses for board prompt templates
// Each response includes rich content with tables, charts data, and insights

export interface SimulatedResponse {
  templateId: string;
  content: string;
  planningSteps: { agent: string; skill: string | null; stage: string }[];
  sources: { id: string; source: string; title: string; url: string }[];
  followUpQuestions: string[];
  quickActions: { id: string; label: string; icon?: 'download' | 'share' | 'bookmark' | 'copy' | 'print' | 'calendar' | 'email' | 'chart' }[];
}

export const BOARD_SIMULATED_RESPONSES: Record<string, SimulatedResponse> = {
  'risk-overview': {
    templateId: 'risk-overview',
    content: `Based on our enterprise risk assessment for Q4 2024, here is the comprehensive risk exposure breakdown:

**Overall Risk Score: 72/100** (Moderate-Low)

| Risk Category | Exposure | Trend | Priority |
|---------------|----------|-------|----------|
| Credit Risk | $12.4M | ↓ Improving | Medium |
| Operational Risk | $8.2M | → Stable | Low |
| Compliance Risk | $3.1M | ↑ Attention | High |
| Market Risk | $5.7M | → Stable | Medium |
| Liquidity Risk | $2.8M | ↓ Improving | Low |

**Branch Risk Distribution:**

| Branch | Risk Score | Top Concern |
|--------|------------|-------------|
| McAllen | 68 | Compliance gaps in new accounts |
| Edinburg | 74 | Commercial loan concentration |
| Harlingen | 71 | Document expiration backlog |
| Brownsville | 76 | BSA/AML monitoring alerts |
| Mission | 65 | No significant concerns |

**Key Findings:**
- **Credit Risk** decreased 8% due to improved underwriting standards
- **Compliance Risk** requires attention - 23 pending items from recent audit
- **Brownsville branch** needs immediate focus on BSA/AML monitoring

**Recommended Actions:**
1. Address 23 compliance items before OCC examination
2. Increase BSA/AML staff training at Brownsville
3. Review commercial loan concentration limits at Edinburg`,
    planningSteps: [
      { agent: 'Business Planner', skill: null, stage: 'Analyzing risk query...' },
      { agent: 'Board Intelligence Agent', skill: 'Risk Assessment Engine', stage: 'Computing enterprise risk metrics...' },
      { agent: 'Board Intelligence Agent', skill: 'Branch Analytics', stage: 'Aggregating branch-level risk data...' },
      { agent: 'Board Intelligence Agent', skill: 'Trend Analysis', stage: 'Calculating risk trends...' },
      { agent: 'Board Intelligence Agent', skill: 'Insight Generator', stage: 'Generating risk recommendations...' },
    ],
    sources: [
      { id: 'src-1', source: 'SILVERLAKE_CORE', title: 'Core Risk Dashboard', url: '#silverlake-risk' },
      { id: 'src-2', source: 'AXIRA_ANALYTICS', title: 'Risk Analytics Platform', url: '#analytics-risk' },
      { id: 'src-3', source: 'SHAREPOINT', title: 'Q4 Risk Assessment Report', url: '#sharepoint-risk' },
    ],
    followUpQuestions: [
      'What are the specific compliance items we need to address?',
      'Show me the BSA/AML alerts for Brownsville branch',
      'Compare our risk metrics to industry benchmarks',
    ],
    quickActions: [
      { id: 'download-report', label: 'Download Report', icon: 'download' },
      { id: 'share-board', label: 'Share with Board', icon: 'share' },
      { id: 'schedule-review', label: 'Schedule Review', icon: 'calendar' },
    ],
  },

  'branch-comparison': {
    templateId: 'branch-comparison',
    content: `Here is the comprehensive branch performance comparison for Q4 2024:

**Performance Summary**

| Branch | Revenue | YoY Growth | NPS | Compliance |
|--------|---------|------------|-----|------------|
| McAllen | $52.3M | +14.2% | 72 | 96% |
| Edinburg | $41.5M | +8.7% | 68 | 94% |
| Harlingen | $38.9M | +6.3% | 65 | 91% |
| Brownsville | $35.2M | +4.1% | 62 | 88% |
| Mission | $28.7M | +11.5% | 70 | 95% |

**Top Performer: McAllen Branch**
- Highest revenue ($52.3M) and growth rate (+14.2%)
- Best customer satisfaction (NPS 72)
- Strong compliance score (96%)

**Efficiency Metrics**

| Branch | Revenue/Employee | Cost Ratio | Accounts/FTE |
|--------|------------------|------------|--------------|
| McAllen | $523K | 54.2% | 312 |
| Mission | $478K | 56.1% | 298 |
| Edinburg | $415K | 58.3% | 276 |
| Harlingen | $389K | 61.2% | 254 |
| Brownsville | $352K | 63.8% | 231 |

**Key Insights:**
- **McAllen** leads across all major metrics
- **Mission** shows strongest efficiency improvement (+18% YoY)
- **Brownsville** needs operational focus - highest cost ratio

**Chart Data - Revenue by Branch (Q4 2024):**
[CHART:bar:McAllen:52.3,Edinburg:41.5,Harlingen:38.9,Brownsville:35.2,Mission:28.7]

**Recommendations:**
1. Replicate McAllen's customer acquisition model at underperforming branches
2. Implement Mission's efficiency practices at Harlingen and Brownsville
3. Focus compliance training at Brownsville (88% → target 95%)`,
    planningSteps: [
      { agent: 'Business Planner', skill: null, stage: 'Processing branch comparison request...' },
      { agent: 'Board Intelligence Agent', skill: 'Data Retrieval', stage: 'Fetching branch performance data...' },
      { agent: 'Board Intelligence Agent', skill: 'Financial Analytics', stage: 'Computing revenue and growth metrics...' },
      { agent: 'Board Intelligence Agent', skill: 'Benchmarking Engine', stage: 'Comparing branch performance...' },
      { agent: 'Board Intelligence Agent', skill: 'Visualization Generator', stage: 'Creating performance charts...' },
    ],
    sources: [
      { id: 'src-1', source: 'SILVERLAKE_CORE', title: 'Branch Financial Reports', url: '#silverlake-branch' },
      { id: 'src-2', source: 'AXIRA_ANALYTICS', title: 'Performance Dashboard', url: '#analytics-perf' },
      { id: 'src-3', source: 'SHAREPOINT', title: 'Customer Satisfaction Survey Results', url: '#sharepoint-nps' },
    ],
    followUpQuestions: [
      'What drove McAllen\'s exceptional performance this quarter?',
      'How can we improve Brownsville\'s NPS score?',
      'Show staffing levels and productivity by branch',
    ],
    quickActions: [
      { id: 'export-excel', label: 'Export to Excel', icon: 'download' },
      { id: 'view-trends', label: 'View Trends', icon: 'chart' },
      { id: 'email-managers', label: 'Email Branch Managers', icon: 'email' },
    ],
  },

  'investment-analysis': {
    templateId: 'investment-analysis',
    content: `Based on performance data and market analysis, here are the recommended Q1 investment priorities:

**Investment Recommendations Summary**

| Priority | Initiative | Investment | Expected ROI | Timeline |
|----------|-----------|------------|--------------|----------|
| 1 | Digital Banking Platform | $2.5M | 22% | 18 months |
| 2 | McAllen Branch Expansion | $1.8M | 25% | 12 months |
| 3 | AI-Powered Risk Analytics | $1.2M | 18% | 24 months |
| 4 | Customer Experience Program | $800K | 15% | 9 months |
| 5 | Staff Training Academy | $500K | 12% | 6 months |

**Total Recommended Investment: $6.8M**
**Projected 3-Year Return: $12.4M**

**Priority 1: Digital Banking Platform ($2.5M)**
- Mobile app modernization with biometric authentication
- Real-time transaction alerts and insights
- Projected impact: 25% increase in digital adoption
- Break-even: 14 months

**Priority 2: McAllen Expansion ($1.8M)**
- New commercial lending center
- Additional 8 FTEs to support growth
- Projected impact: $8.2M additional revenue over 3 years
- Break-even: 10 months

**ROI Projection Chart:**
[CHART:line:Q1:2%,Q2:8%,Q3:15%,Q4:22%,Y2Q1:28%,Y2Q2:35%]

**Budget Allocation by Category:**
[CHART:pie:Technology:45%,Expansion:26%,Training:12%,Customer Experience:17%]

**Risk-Adjusted Analysis:**

| Initiative | Best Case | Base Case | Worst Case |
|------------|-----------|-----------|------------|
| Digital Platform | 28% ROI | 22% ROI | 12% ROI |
| McAllen Expansion | 32% ROI | 25% ROI | 15% ROI |
| AI Analytics | 24% ROI | 18% ROI | 8% ROI |

**Recommendations:**
1. Proceed immediately with Digital Banking and McAllen Expansion
2. Phase AI Analytics implementation over 2 quarters
3. Begin staff training in Q1 to support all initiatives`,
    planningSteps: [
      { agent: 'Business Planner', skill: null, stage: 'Analyzing investment query...' },
      { agent: 'Board Intelligence Agent', skill: 'Financial Modeling', stage: 'Running ROI projections...' },
      { agent: 'Board Intelligence Agent', skill: 'Market Analysis', stage: 'Evaluating market opportunities...' },
      { agent: 'Board Intelligence Agent', skill: 'Risk Calculator', stage: 'Computing risk-adjusted returns...' },
      { agent: 'Board Intelligence Agent', skill: 'Strategic Planner', stage: 'Generating investment recommendations...' },
    ],
    sources: [
      { id: 'src-1', source: 'AXIRA_ANALYTICS', title: 'Investment Analysis Model', url: '#analytics-invest' },
      { id: 'src-2', source: 'SHAREPOINT', title: 'Strategic Planning Documents', url: '#sharepoint-strategy' },
      { id: 'src-3', source: 'SILVERLAKE_CORE', title: 'Financial Projections', url: '#silverlake-finance' },
    ],
    followUpQuestions: [
      'What are the risks associated with the digital banking investment?',
      'Can we phase the McAllen expansion over multiple quarters?',
      'How does this compare to last year\'s investment returns?',
    ],
    quickActions: [
      { id: 'download-business-case', label: 'Download Business Case', icon: 'download' },
      { id: 'share-committee', label: 'Share with Committee', icon: 'share' },
      { id: 'bookmark', label: 'Save for Review', icon: 'bookmark' },
    ],
  },

  'compliance-dashboard': {
    templateId: 'compliance-dashboard',
    content: `Here is the 6-month compliance trend analysis for LSNB:

**Overall Compliance Score: 93.2%** (Target: 95%)

**Monthly Trend (Last 6 Months):**

| Month | Score | Issues | Resolved | Open |
|-------|-------|--------|----------|------|
| July | 91.5% | 42 | 38 | 4 |
| August | 92.1% | 38 | 35 | 3 |
| September | 92.8% | 35 | 33 | 2 |
| October | 93.0% | 31 | 28 | 3 |
| November | 93.4% | 28 | 25 | 3 |
| December | 93.2% | 25 | 22 | 3 |

**Compliance Trend Chart:**
[CHART:line:Jul:91.5,Aug:92.1,Sep:92.8,Oct:93.0,Nov:93.4,Dec:93.2]

**Category Breakdown:**

| Category | Current | 6Mo Ago | Change |
|----------|---------|---------|--------|
| BSA/AML | 94.1% | 90.2% | +3.9% |
| CIP/KYC | 95.8% | 93.1% | +2.7% |
| Document Management | 91.2% | 89.5% | +1.7% |
| Reg E Compliance | 92.5% | 91.8% | +0.7% |
| Fair Lending | 96.2% | 95.8% | +0.4% |

**Areas Needing Attention:**

1. **Document Management (91.2%)**
   - 47 expired documents pending renewal
   - 12 missing signature cards
   - Action: Dedicated cleanup sprint needed

2. **Reg E Compliance (92.5%)**
   - 8 late dispute resolutions
   - 3 notification timing issues
   - Action: Process automation recommended

**Branch Compliance Scores:**

| Branch | Score | Trend | Issues |
|--------|-------|-------|--------|
| Mission | 96.1% | ↑ | 2 |
| McAllen | 95.8% | → | 4 |
| Edinburg | 93.2% | ↑ | 6 |
| Harlingen | 91.5% | → | 8 |
| Brownsville | 88.4% | ↓ | 12 |

**Critical Items (Due within 30 days):**
- 5 BSA/AML reports pending submission
- 12 CIP re-verification required
- 3 fair lending audits to complete

**Recommendations:**
1. Deploy compliance team to Brownsville for intensive review
2. Automate document expiration tracking
3. Implement weekly compliance checkpoints at all branches`,
    planningSteps: [
      { agent: 'Business Planner', skill: null, stage: 'Processing compliance query...' },
      { agent: 'Board Intelligence Agent', skill: 'Compliance Monitor', stage: 'Fetching compliance metrics...' },
      { agent: 'Board Intelligence Agent', skill: 'Trend Analysis', stage: 'Computing 6-month trends...' },
      { agent: 'Board Intelligence Agent', skill: 'Issue Tracker', stage: 'Aggregating open compliance items...' },
      { agent: 'Board Intelligence Agent', skill: 'Action Generator', stage: 'Creating remediation recommendations...' },
    ],
    sources: [
      { id: 'src-1', source: 'SYNERGY_DMS', title: 'Compliance Tracking System', url: '#synergy-compliance' },
      { id: 'src-2', source: 'AXIRA_ANALYTICS', title: 'Compliance Analytics', url: '#analytics-compliance' },
      { id: 'src-3', source: 'SHAREPOINT', title: 'Regulatory Calendar', url: '#sharepoint-reg' },
    ],
    followUpQuestions: [
      'What is the detailed breakdown of compliance items by category?',
      'When is the next OCC examination scheduled?',
      'Show compliance history for Brownsville branch',
    ],
    quickActions: [
      { id: 'download-compliance', label: 'Download Full Report', icon: 'download' },
      { id: 'print-summary', label: 'Print Summary', icon: 'print' },
      { id: 'schedule-audit', label: 'Schedule Audit', icon: 'calendar' },
    ],
  },

  'quarterly-report': {
    templateId: 'quarterly-report',
    content: `# LSNB Board Report - Q4 2024

## Executive Summary

Q4 2024 delivered strong results with **$196.6M total revenue** (+9.1% YoY) and improved operational efficiency across all branches.

---

## Financial Highlights

| Metric | Q4 2024 | Q4 2023 | Change |
|--------|---------|---------|--------|
| Total Revenue | $196.6M | $180.2M | +9.1% |
| Net Income | $42.3M | $38.1M | +11.0% |
| Total Deposits | $1.82B | $1.65B | +10.3% |
| Total Loans | $1.24B | $1.12B | +10.7% |
| Net Interest Margin | 3.79% | 3.65% | +14bp |

**Revenue by Segment:**
[CHART:pie:Commercial Lending:42%,Consumer Banking:35%,Wealth Management:15%,Other:8%]

---

## Risk Assessment

**Enterprise Risk Score: 72/100** (Moderate-Low)

| Risk Type | Status | Trend |
|-----------|--------|-------|
| Credit | Satisfactory | Improving |
| Liquidity | Strong | Stable |
| Operational | Satisfactory | Stable |
| Compliance | Needs Attention | Improving |

**Key Risk Items:**
- 23 compliance items pending (down from 35 in Q3)
- Commercial loan concentration at Edinburg requires monitoring
- BSA/AML program at Brownsville needs enhancement

---

## Branch Performance

| Branch | Revenue | Growth | Efficiency |
|--------|---------|--------|------------|
| McAllen | $52.3M | +14.2% | 54.2% |
| Edinburg | $41.5M | +8.7% | 58.3% |
| Harlingen | $38.9M | +6.3% | 61.2% |
| Brownsville | $35.2M | +4.1% | 63.8% |
| Mission | $28.7M | +11.5% | 56.1% |

---

## Strategic Recommendations

**For Board Approval:**

1. **Digital Transformation Investment ($2.5M)**
   - Modernize mobile banking platform
   - Expected ROI: 22% over 18 months
   - *Recommend: Approve*

2. **McAllen Commercial Center Expansion ($1.8M)**
   - Capitalize on market leadership
   - Expected ROI: 25% over 12 months
   - *Recommend: Approve*

3. **Brownsville Compliance Enhancement ($400K)**
   - Address BSA/AML gaps before OCC exam
   - Risk mitigation priority
   - *Recommend: Approve urgently*

---

## Outlook

**Q1 2025 Projections:**
- Revenue: $198-202M (+4-6% QoQ)
- Deposit Growth: 2-3%
- Loan Growth: 3-4%
- NIM: 3.75-3.85%

**Key Dates:**
- OCC Examination: March 15-28, 2025
- Q1 Board Meeting: April 22, 2025
- Strategic Planning Session: May 15, 2025`,
    planningSteps: [
      { agent: 'Business Planner', skill: null, stage: 'Preparing board report...' },
      { agent: 'Board Intelligence Agent', skill: 'Data Aggregation', stage: 'Collecting quarterly data...' },
      { agent: 'Board Intelligence Agent', skill: 'Financial Reporting', stage: 'Generating financial summaries...' },
      { agent: 'Board Intelligence Agent', skill: 'Risk Assessment', stage: 'Compiling risk overview...' },
      { agent: 'Board Intelligence Agent', skill: 'Strategic Analysis', stage: 'Formulating recommendations...' },
      { agent: 'Board Intelligence Agent', skill: 'Report Generator', stage: 'Formatting final report...' },
    ],
    sources: [
      { id: 'src-1', source: 'SILVERLAKE_CORE', title: 'Q4 Financial Statements', url: '#silverlake-q4' },
      { id: 'src-2', source: 'AXIRA_ANALYTICS', title: 'Board Analytics Dashboard', url: '#analytics-board' },
      { id: 'src-3', source: 'SHAREPOINT', title: 'Strategic Planning Documents', url: '#sharepoint-board' },
      { id: 'src-4', source: 'SYNERGY_DMS', title: 'Compliance Reports', url: '#synergy-board' },
    ],
    followUpQuestions: [
      'Compare this quarter with Q3 performance',
      'What are the key risks heading into Q1?',
      'Show detailed breakdown of commercial lending revenue',
    ],
    quickActions: [
      { id: 'download-pdf', label: 'Download PDF', icon: 'download' },
      { id: 'share-board', label: 'Share with Board', icon: 'share' },
      { id: 'print-report', label: 'Print Report', icon: 'print' },
      { id: 'copy-summary', label: 'Copy Summary', icon: 'copy' },
    ],
  },

  'regulatory-prep': {
    templateId: 'regulatory-prep',
    content: `# OCC Examination Readiness Assessment

**Examination Date: March 15-28, 2025**
**Overall Readiness Score: 78%** (Target: 95%)

---

## Readiness by Category

| Category | Score | Status | Gap Items |
|----------|-------|--------|-----------|
| Capital Adequacy | 94% | Ready | 2 minor |
| Asset Quality | 88% | On Track | 5 items |
| Management | 82% | Needs Work | 8 items |
| Earnings | 91% | Ready | 3 minor |
| Liquidity | 96% | Ready | 1 minor |
| Sensitivity | 85% | On Track | 6 items |

**Readiness Trend Chart:**
[CHART:bar:Capital:94,Assets:88,Management:82,Earnings:91,Liquidity:96,Sensitivity:85]

---

## Critical Gaps Requiring Immediate Attention

### 1. BSA/AML Program (Priority: Critical)
| Issue | Branch | Due Date | Owner |
|-------|--------|----------|-------|
| SAR filing backlog | Brownsville | Feb 15 | J. Martinez |
| CDD updates | All | Feb 28 | Compliance |
| Training gaps | Brownsville | Feb 20 | HR |

### 2. Document Management (Priority: High)
| Issue | Count | Due Date | Owner |
|-------|-------|----------|-------|
| Expired IDs | 47 | Feb 28 | Branch Ops |
| Missing signature cards | 12 | Feb 15 | Branch Ops |
| CIP re-verification | 23 | Mar 1 | Compliance |

### 3. Internal Controls (Priority: Medium)
| Issue | Status | Due Date | Owner |
|-------|--------|----------|-------|
| Audit findings remediation | 3 open | Feb 28 | Internal Audit |
| Policy updates | 5 pending | Feb 20 | Compliance |
| Procedure documentation | 8 incomplete | Mar 5 | Operations |

---

## 90-Day Remediation Plan

**Week 1-4 (Immediate):**
- [ ] Clear SAR filing backlog at Brownsville
- [ ] Complete CDD updates for high-risk customers
- [ ] Update 47 expired customer IDs
- [ ] Close 3 open audit findings

**Week 5-8 (Short-term):**
- [ ] Complete BSA/AML training at all branches
- [ ] Update 5 pending policies
- [ ] Implement enhanced monitoring at Brownsville
- [ ] Complete CIP re-verification

**Week 9-12 (Pre-exam):**
- [ ] Conduct mock examination
- [ ] Final documentation review
- [ ] Staff preparation sessions
- [ ] Management committee briefing

---

## Resource Requirements

| Resource | Current | Needed | Gap |
|----------|---------|--------|-----|
| Compliance Staff | 8 | 10 | +2 |
| BSA Analysts | 3 | 5 | +2 |
| Training Hours | 120 | 280 | +160 |
| Budget | $150K | $280K | +$130K |

**Recommendations:**
1. **Immediately** hire 2 temporary BSA analysts
2. **By Feb 15** complete all critical Brownsville items
3. **By Feb 28** clear all document management gaps
4. **By Mar 10** conduct full mock examination
5. **Request** additional $130K budget for remediation`,
    planningSteps: [
      { agent: 'Business Planner', skill: null, stage: 'Processing regulatory readiness query...' },
      { agent: 'Board Intelligence Agent', skill: 'Compliance Scanner', stage: 'Assessing current compliance status...' },
      { agent: 'Board Intelligence Agent', skill: 'Gap Analyzer', stage: 'Identifying examination gaps...' },
      { agent: 'Board Intelligence Agent', skill: 'Remediation Planner', stage: 'Creating action plan...' },
      { agent: 'Board Intelligence Agent', skill: 'Resource Calculator', stage: 'Computing resource requirements...' },
    ],
    sources: [
      { id: 'src-1', source: 'SYNERGY_DMS', title: 'OCC Exam Checklist', url: '#synergy-occ' },
      { id: 'src-2', source: 'SHAREPOINT', title: 'Regulatory Calendar', url: '#sharepoint-reg' },
      { id: 'src-3', source: 'AXIRA_ANALYTICS', title: 'Compliance Gap Analysis', url: '#analytics-gap' },
      { id: 'src-4', source: 'LEXISNEXIS', title: 'Regulatory Updates', url: '#lexis-reg' },
    ],
    followUpQuestions: [
      'What are the specific BSA/AML gaps at Brownsville?',
      'How do our CAMELS scores compare to peer banks?',
      'Show the 90-day remediation timeline in detail',
    ],
    quickActions: [
      { id: 'download-checklist', label: 'Download Checklist', icon: 'download' },
      { id: 'email-team', label: 'Email Compliance Team', icon: 'email' },
      { id: 'schedule-meeting', label: 'Schedule Prep Meeting', icon: 'calendar' },
    ],
  },

  'customer-insights': {
    templateId: 'customer-insights',
    content: `# Customer Growth Analysis - Q4 2024

**Total Customers: 48,732** (+8.4% YoY)
**New Accounts This Quarter: 2,847**

---

## Customer Growth by Segment

| Segment | Count | Growth | Revenue/Customer |
|---------|-------|--------|------------------|
| Commercial | 3,241 | +12.3% | $8,420 |
| Small Business | 8,567 | +15.1% | $2,180 |
| Consumer Premium | 12,438 | +9.2% | $1,450 |
| Consumer Standard | 24,486 | +5.8% | $680 |

**Growth Trend Chart:**
[CHART:line:Q1:44200,Q2:45800,Q3:47100,Q4:48732]

---

## Branch Customer Acquisition

| Branch | New Customers | Growth Rate | Retention |
|--------|---------------|-------------|-----------|
| McAllen | 892 | +18.2% | 94.1% |
| Mission | 624 | +16.8% | 93.5% |
| Edinburg | 578 | +11.4% | 91.8% |
| Harlingen | 432 | +8.7% | 90.2% |
| Brownsville | 321 | +5.2% | 88.6% |

**Top Performer: McAllen Branch**
- Highest acquisition rate (+18.2%)
- Best retention (94.1%)
- Driving commercial segment growth

---

## Customer Acquisition Channels

| Channel | New Customers | Cost/Acquisition | Conversion |
|---------|---------------|------------------|------------|
| Referrals | 1,024 | $45 | 32% |
| Digital Marketing | 687 | $125 | 8% |
| Branch Walk-ins | 542 | $180 | 45% |
| Business Development | 398 | $320 | 52% |
| Events/Seminars | 196 | $210 | 18% |

**Channel Efficiency Chart:**
[CHART:bar:Referrals:1024,Digital:687,Walk-ins:542,BizDev:398,Events:196]

---

## Customer Satisfaction Trends

| Metric | Q4 2024 | Q3 2024 | Change |
|--------|---------|---------|--------|
| NPS Score | 68 | 65 | +3 |
| CSAT | 87% | 85% | +2% |
| Effort Score | 4.2/5 | 4.0/5 | +0.2 |

**NPS by Branch:**

| Branch | NPS | Trend |
|--------|-----|-------|
| McAllen | 72 | ↑ |
| Mission | 70 | ↑ |
| Edinburg | 68 | → |
| Harlingen | 65 | → |
| Brownsville | 62 | ↓ |

---

## Key Insights

1. **Small Business Surge**: +15.1% growth driven by McAllen commercial center
2. **Referrals Lead**: Lowest cost, highest quality acquisition channel
3. **Digital Gap**: Digital conversion at 8% vs industry average 12%
4. **Retention Risk**: Brownsville showing declining retention (88.6%)

**Recommendations:**
1. Expand referral program with enhanced incentives
2. Invest in digital conversion optimization
3. Deploy retention team at Brownsville
4. Replicate McAllen's small business playbook at other branches`,
    planningSteps: [
      { agent: 'Business Planner', skill: null, stage: 'Processing customer growth query...' },
      { agent: 'Board Intelligence Agent', skill: 'Customer Analytics', stage: 'Analyzing customer data...' },
      { agent: 'Board Intelligence Agent', skill: 'Segmentation Engine', stage: 'Computing segment metrics...' },
      { agent: 'Board Intelligence Agent', skill: 'Acquisition Tracker', stage: 'Evaluating channel performance...' },
      { agent: 'Board Intelligence Agent', skill: 'Satisfaction Analyzer', stage: 'Processing NPS and CSAT data...' },
    ],
    sources: [
      { id: 'src-1', source: 'SILVERLAKE_CORE', title: 'Customer Master Data', url: '#silverlake-cust' },
      { id: 'src-2', source: 'AXIRA_ANALYTICS', title: 'Customer Intelligence', url: '#analytics-cust' },
      { id: 'src-3', source: 'SHAREPOINT', title: 'NPS Survey Results', url: '#sharepoint-nps' },
    ],
    followUpQuestions: [
      'What is driving Brownsville\'s declining retention rate?',
      'How can we improve digital conversion to match industry average?',
      'Show the customer acquisition funnel for referrals',
    ],
    quickActions: [
      { id: 'export-data', label: 'Export Customer Data', icon: 'download' },
      { id: 'view-segments', label: 'View Segments', icon: 'chart' },
      { id: 'share-marketing', label: 'Share with Marketing', icon: 'share' },
    ],
  },

  'strategic-opportunities': {
    templateId: 'strategic-opportunities',
    content: `# Strategic Growth Opportunities Analysis

**Planning Horizon: 2025-2027**
**Market: Rio Grande Valley, South Texas**

---

## Top Growth Opportunities

| Rank | Opportunity | Market Size | Our Share | Potential |
|------|-------------|-------------|-----------|-----------|
| 1 | Commercial Real Estate | $2.8B | 8% | +$45M |
| 2 | Healthcare Banking | $1.2B | 5% | +$28M |
| 3 | Agricultural Lending | $890M | 12% | +$18M |
| 4 | Cross-Border Services | $650M | 3% | +$22M |
| 5 | Digital-First Banking | $420M | 2% | +$15M |

**Opportunity Matrix Chart:**
[CHART:bubble:CRE:2800:8,Healthcare:1200:5,Agriculture:890:12,CrossBorder:650:3,Digital:420:2]

---

## Opportunity 1: Commercial Real Estate

**Market Analysis:**
- RGV commercial construction up 23% YoY
- Major developments: SpaceX expansion, logistics hubs
- Key competitors: Frost Bank, Texas Capital

**Our Position:**
| Metric | LSNB | Market Leader | Gap |
|--------|------|---------------|-----|
| Market Share | 8% | 22% (Frost) | -14% |
| Avg Loan Size | $1.2M | $2.8M | -$1.6M |
| Approval Time | 45 days | 30 days | +15 days |

**Action Plan:**
1. Hire 2 CRE specialists (Q1 2025)
2. Increase CRE lending limit to $5M
3. Streamline underwriting (target: 30 days)
4. **Investment:** $800K | **3-Year Return:** $4.2M

---

## Opportunity 2: Healthcare Banking

**Market Analysis:**
- 47 medical practices in RGV underserved
- Healthcare employment growing 8% annually
- High-value deposit relationships

**Our Position:**
| Metric | LSNB | Opportunity |
|--------|------|-------------|
| Healthcare clients | 23 | 70+ |
| Avg relationship | $180K | $450K+ |
| Specialized products | 2 | 8 needed |

**Action Plan:**
1. Launch Healthcare Banking division
2. Partner with medical associations
3. Develop specialized products (practice loans, equipment financing)
4. **Investment:** $500K | **3-Year Return:** $2.8M

---

## Competitive Positioning

**Market Share Comparison:**

| Competitor | Total Share | Commercial | Consumer |
|------------|-------------|------------|----------|
| Frost Bank | 28% | 32% | 24% |
| Texas Capital | 18% | 22% | 15% |
| **LSNB** | **14%** | **12%** | **16%** |
| IBC Bank | 12% | 10% | 14% |
| Others | 28% | 24% | 31% |

**Competitive Advantages:**
- Community presence and relationships
- Local decision-making speed
- Bilingual staff (78% Spanish-fluent)
- Strong agricultural expertise

**Competitive Gaps:**
- Digital banking features
- Commercial lending capacity
- Cross-border capabilities

---

## Strategic Recommendations

**Year 1 (2025):**
1. Launch CRE expansion initiative
2. Establish Healthcare Banking unit
3. Upgrade digital platform

**Year 2 (2026):**
1. Expand cross-border services
2. Agricultural lending growth
3. New branch in Mission area

**Year 3 (2027):**
1. Digital-first product launch
2. M&A opportunity evaluation
3. Market share target: 18%

**Total Investment Required:** $6.2M
**Projected Revenue Impact:** $128M over 3 years
**Expected Market Share:** 14% → 18%`,
    planningSteps: [
      { agent: 'Business Planner', skill: null, stage: 'Processing strategic opportunities query...' },
      { agent: 'Board Intelligence Agent', skill: 'Market Intelligence', stage: 'Analyzing market data...' },
      { agent: 'Board Intelligence Agent', skill: 'Competitive Analysis', stage: 'Evaluating competitor positioning...' },
      { agent: 'Board Intelligence Agent', skill: 'Opportunity Scorer', stage: 'Ranking growth opportunities...' },
      { agent: 'Board Intelligence Agent', skill: 'Strategic Planner', stage: 'Generating recommendations...' },
    ],
    sources: [
      { id: 'src-1', source: 'AXIRA_ANALYTICS', title: 'Market Analysis Report', url: '#analytics-market' },
      { id: 'src-2', source: 'SHAREPOINT', title: 'Strategic Planning Documents', url: '#sharepoint-strategy' },
      { id: 'src-3', source: 'SILVERLAKE_CORE', title: 'Competitive Intelligence', url: '#silverlake-comp' },
    ],
    followUpQuestions: [
      'Deep dive into the Commercial Real Estate opportunity',
      'What resources do we need for Healthcare Banking?',
      'How do we compare against Frost Bank specifically?',
    ],
    quickActions: [
      { id: 'download-strategy', label: 'Download Strategy Doc', icon: 'download' },
      { id: 'share-leadership', label: 'Share with Leadership', icon: 'share' },
      { id: 'schedule-planning', label: 'Schedule Strategy Session', icon: 'calendar' },
    ],
  },
};

// Helper to get response by template ID
export function getSimulatedResponse(templateId: string): SimulatedResponse | null {
  return BOARD_SIMULATED_RESPONSES[templateId] || null;
}

// Helper to match a user message to a template
export function matchTemplateFromMessage(message: string): string | null {
  const lowerMessage = message.toLowerCase();

  // Risk keywords
  if (lowerMessage.includes('risk') && (lowerMessage.includes('exposure') || lowerMessage.includes('overview') || lowerMessage.includes('breakdown'))) {
    return 'risk-overview';
  }

  // Branch comparison keywords
  if ((lowerMessage.includes('branch') && lowerMessage.includes('comparison')) ||
      (lowerMessage.includes('branch') && lowerMessage.includes('performance') && lowerMessage.includes('summary'))) {
    return 'branch-comparison';
  }

  // Investment keywords
  if (lowerMessage.includes('invest') || (lowerMessage.includes('roi') && lowerMessage.includes('projection'))) {
    return 'investment-analysis';
  }

  // Compliance keywords
  if (lowerMessage.includes('compliance') && lowerMessage.includes('trend')) {
    return 'compliance-dashboard';
  }

  // Board report keywords
  if (lowerMessage.includes('board report') || (lowerMessage.includes('quarterly') && lowerMessage.includes('report'))) {
    return 'quarterly-report';
  }

  // Regulatory/OCC keywords
  if (lowerMessage.includes('occ') || lowerMessage.includes('examination') || lowerMessage.includes('regulatory')) {
    return 'regulatory-prep';
  }

  // Customer growth keywords
  if (lowerMessage.includes('customer') && (lowerMessage.includes('growth') || lowerMessage.includes('acquisition'))) {
    return 'customer-insights';
  }

  // Strategic opportunities keywords
  if (lowerMessage.includes('growth opportunit') || lowerMessage.includes('strategic') || lowerMessage.includes('expansion')) {
    return 'strategic-opportunities';
  }

  return null;
}
