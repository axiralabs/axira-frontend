import { useState, useCallback, useEffect } from 'react';
import { cn } from '@axira/shared/utils';
import { useChatContext } from '../chat/context';
import type { AuditTrail, StrategicInsight } from './types';
import { BOARD_PROMPT_TEMPLATES, BOARD_TEMPLATE_CATEGORIES } from './data/boardPromptTemplates';
import {
  BoardHeader,
  ExecutiveKPIBar,
  BranchPerformanceCard,
  StrategicInsightsPanel,
  EvidencePanel,
  BranchComparisonChart,
  TrendChart,
} from './components';
import {
  MOCK_EXECUTIVE_KPIS,
  MOCK_BRANCH_METRICS,
  MOCK_STRATEGIC_INSIGHTS,
  MOCK_BRANCH_CHART_DATA,
  MOCK_REVENUE_TREND,
  MOCK_COMPLIANCE_TREND,
  MOCK_REVENUE_BREAKDOWN,
  MOCK_COMPLIANCE_BREAKDOWN,
  createMockAuditTrail,
} from './data/mockBoardData';

interface BoardPageProps {
  userName?: string;
}

// Board member name for the demo
const BOARD_MEMBER_NAME = 'Margaret';

// Board-specific quick action prompts
const BOARD_QUICK_ACTIONS = [
  'What is our current risk exposure?',
  'Where should we invest next quarter?',
  'Show branch performance summary',
];

export function BoardPage({ userName = BOARD_MEMBER_NAME }: BoardPageProps) {
  const { openChat, setPromptTemplates } = useChatContext();
  const [commandValue, setCommandValue] = useState('');

  // Set board-specific prompt templates when this page is active
  useEffect(() => {
    setPromptTemplates(BOARD_PROMPT_TEMPLATES, BOARD_TEMPLATE_CATEGORIES);

    // Clean up when leaving the page
    return () => {
      setPromptTemplates(null, null);
    };
  }, [setPromptTemplates]);

  // Evidence panel state
  const [evidencePanelOpen, setEvidencePanelOpen] = useState(false);
  const [currentAuditTrail, setCurrentAuditTrail] = useState<AuditTrail | null>(null);

  // Time-based greeting
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Handle command submission - opens chat with query
  const handleCommand = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (commandValue.trim()) {
      openChat(commandValue.trim());
      setCommandValue('');
    }
  }, [commandValue, openChat]);

  // Handle quick action click
  const handleQuickAction = useCallback((query: string) => {
    openChat(query);
  }, [openChat]);

  // Handle branch click
  const handleBranchClick = useCallback((branchId: string) => {
    openChat(`Show me details for ${branchId} branch`);
  }, [openChat]);

  // Handle insight click
  const handleInsightClick = useCallback((insight: StrategicInsight) => {
    openChat(`Tell me more about: ${insight.title}`);
  }, [openChat]);

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Greeting Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-white">
            {timeGreeting}, {userName}
          </h1>
          <p className="text-gray-400 mt-1">Strategic Intelligence Dashboard</p>
        </div>

        {/* Ask Axira Command Bar - Same style as home */}
        <div className="max-w-2xl mx-auto mb-4">
          <form onSubmit={handleCommand}>
            <div className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-full',
              'bg-gray-900 border border-gray-700',
              'focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/50',
              'transition-all duration-200'
            )}>
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-orange-400 flex items-center justify-center flex-shrink-0">
                <AxiraIcon className="w-4 h-4 text-white" />
              </div>
              <input
                type="text"
                value={commandValue}
                onChange={(e) => setCommandValue(e.target.value)}
                placeholder="Ask Axira"
                className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
              />
              <button type="button" className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                <MicrophoneIcon className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>

        {/* Quick Action Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {BOARD_QUICK_ACTIONS.map((action) => (
            <button
              key={action}
              onClick={() => handleQuickAction(action)}
              className={cn(
                'px-4 py-2 rounded-full',
                'bg-gray-900 border border-gray-700',
                'text-sm text-gray-300 hover:text-white hover:border-gray-600 hover:bg-gray-800',
                'transition-all duration-200'
              )}
            >
              {action}
            </button>
          ))}
        </div>

        {/* Executive KPIs */}
        <ExecutiveKPIBar metrics={MOCK_EXECUTIVE_KPIS} className="mb-6" />

        {/* Branch Performance & Comparison - Side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6 items-stretch">
          {/* Branch Performance Details - Takes 2 columns */}
          <div className="lg:col-span-2 flex">
            <BranchPerformanceCard
              branches={MOCK_BRANCH_METRICS}
              onBranchClick={handleBranchClick}
              className="flex-1"
            />
          </div>

          {/* Branch Comparison Chart - Takes 1 column */}
          <div className="flex">
            <BranchComparisonChart
              branches={MOCK_BRANCH_CHART_DATA}
              onBranchClick={handleBranchClick}
              className="flex-1"
            />
          </div>
        </div>

        {/* Strategic Insights - Full Width */}
        <div className="mb-6">
          <StrategicInsightsPanel
            insights={MOCK_STRATEGIC_INSIGHTS}
            onInsightClick={handleInsightClick}
          />
        </div>

        {/* Trend Charts Grid - 2 columns on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Revenue Trend with Branch Breakdown */}
          <TrendChart
            title="Total Revenue"
            subtitle="Q4 2024 Performance"
            data={MOCK_REVENUE_TREND}
            branchBreakdown={MOCK_REVENUE_BREAKDOWN}
            prefix="$"
            unit="M"
            trend={12}
            onBranchClick={(name) => openChat(`Show me revenue details for ${name} branch`)}
          />

          {/* Compliance Trend with Branch Breakdown */}
          <TrendChart
            title="Compliance Rate"
            subtitle="Organization average"
            data={MOCK_COMPLIANCE_TREND}
            branchBreakdown={MOCK_COMPLIANCE_BREAKDOWN}
            unit="%"
            trend={2.9}
            onBranchClick={(name) => openChat(`Show me compliance details for ${name} branch`)}
          />
        </div>

        {/* Quick Actions Bar */}
        <div className="mt-6 flex justify-center gap-3">
          <QuickActionButton
            icon={<DownloadIcon className="w-4 h-4" />}
            label="Board Report"
            onClick={() => openChat('Generate a board report for this quarter')}
          />
          <QuickActionButton
            icon={<CalendarIcon className="w-4 h-4" />}
            label="Schedule Review"
            onClick={() => openChat('Help me schedule a quarterly review meeting')}
          />
          <QuickActionButton
            icon={<TrendingUpIcon className="w-4 h-4" />}
            label="Full Analytics"
            onClick={() => openChat('Show me comprehensive analytics')}
          />
        </div>
      </div>

      {/* Evidence Panel Slide-over */}
      {evidencePanelOpen && currentAuditTrail && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setEvidencePanelOpen(false)}
          />
          {/* Panel */}
          <EvidencePanel
            auditTrail={currentAuditTrail}
            onClose={() => setEvidencePanelOpen(false)}
          />
        </>
      )}
    </div>
  );
}

// Quick Action Button
function QuickActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium',
        'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white',
        'border border-gray-700 hover:border-gray-600',
        'transition-colors'
      )}
    >
      {icon}
      {label}
    </button>
  );
}

// Icons
function AxiraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

function MicrophoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function TrendingUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 6l-9.5 9.5-5-5L1 18" />
      <path d="M17 6h6v6" />
    </svg>
  );
}

export default BoardPage;
