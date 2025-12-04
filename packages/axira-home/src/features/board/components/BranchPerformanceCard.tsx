import { useState } from 'react';
import { cn } from '@axira/shared/utils';
import type { BranchMetrics, MetricTrend } from '../types';
import { METRIC_STATUS_STYLES } from '../types';

interface BranchPerformanceCardProps {
  branches: BranchMetrics[];
  onBranchClick?: (branchId: string) => void;
  className?: string;
}

export function BranchPerformanceCard({ branches, onBranchClick, className }: BranchPerformanceCardProps) {
  const [expandedBranch, setExpandedBranch] = useState<string | null>(null);

  const handleToggle = (branchId: string) => {
    setExpandedBranch(expandedBranch === branchId ? null : branchId);
  };

  // Calculate totals for header
  const totals = branches.reduce(
    (acc, b) => ({
      revenue: acc.revenue + b.revenue,
      deposits: acc.deposits + b.deposits,
      loanPortfolio: acc.loanPortfolio + b.loanPortfolio,
      newAccounts: acc.newAccounts + b.newAccounts,
    }),
    { revenue: 0, deposits: 0, loanPortfolio: 0, newAccounts: 0 }
  );

  return (
    <div className={cn('rounded-xl border border-gray-700 bg-gray-800/50 overflow-hidden', className)}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Branch Performance</h3>
            <p className="text-sm text-gray-400">Q4 2024 Financial & Operational Metrics • Click to expand</p>
          </div>
          <div className="hidden lg:flex items-center gap-6 text-right">
            <div>
              <p className="text-xs text-gray-500">Total Revenue</p>
              <p className="text-sm font-semibold text-white">${totals.revenue.toFixed(1)}M</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Deposits</p>
              <p className="text-sm font-semibold text-white">${totals.deposits.toFixed(1)}M</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Loan Portfolio</p>
              <p className="text-sm font-semibold text-white">${totals.loanPortfolio.toFixed(1)}M</p>
            </div>
          </div>
        </div>
      </div>

      {/* Branch List */}
      <div className="divide-y divide-gray-700">
        {branches.map((branch) => (
          <BranchRow
            key={branch.branchId}
            branch={branch}
            isExpanded={expandedBranch === branch.branchId}
            onToggle={() => handleToggle(branch.branchId)}
            onDrillDown={() => onBranchClick?.(branch.branchId)}
          />
        ))}
      </div>
    </div>
  );
}

interface BranchRowProps {
  branch: BranchMetrics;
  isExpanded: boolean;
  onToggle: () => void;
  onDrillDown?: () => void;
}

function BranchRow({ branch, isExpanded, onToggle, onDrillDown }: BranchRowProps) {
  const statusStyles = METRIC_STATUS_STYLES[branch.status];

  return (
    <div>
      {/* Main Row - Clickable */}
      <button
        onClick={onToggle}
        className={cn(
          'w-full px-4 py-4 text-left hover:bg-gray-700/50 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500',
          isExpanded && 'bg-gray-700/30'
        )}
      >
        <div className="flex items-center justify-between">
          {/* Left: Branch info */}
          <div className="flex items-center gap-3 min-w-[180px]">
            {/* Status indicator */}
            <div className={cn('w-3 h-3 rounded-full', statusStyles.dotColor)} />

            <div>
              <p className="font-medium text-white">{branch.branchName}</p>
              <p className="text-sm text-gray-400">{branch.branchManager}</p>
            </div>
          </div>

          {/* Right: Key metrics */}
          <div className="flex items-center gap-6">
            {/* Revenue */}
            <div className="text-right min-w-[80px]">
              <div className="flex items-center justify-end gap-1">
                <span className="text-lg font-semibold text-white">
                  ${branch.revenue.toFixed(1)}M
                </span>
                <TrendIndicator
                  trend={branch.revenueTrend}
                  value={branch.revenueChange}
                />
              </div>
              <p className="text-xs text-gray-500">Revenue</p>
            </div>

            {/* Deposits */}
            <div className="hidden md:block text-right min-w-[80px]">
              <div className="flex items-center justify-end gap-1">
                <span className="text-lg font-semibold text-white">
                  ${branch.deposits.toFixed(0)}M
                </span>
                <TrendIndicator
                  trend={branch.depositsTrend}
                  value={branch.depositsChange}
                />
              </div>
              <p className="text-xs text-gray-500">Deposits</p>
            </div>

            {/* NIM */}
            <div className="hidden lg:block text-right min-w-[70px]">
              <div className="flex items-center justify-end gap-1">
                <span className={cn(
                  'text-lg font-semibold',
                  branch.netInterestMargin >= 3.8 ? 'text-green-400' :
                  branch.netInterestMargin >= 3.5 ? 'text-white' : 'text-amber-400'
                )}>
                  {branch.netInterestMargin.toFixed(2)}%
                </span>
                <TrendIndicator trend={branch.nimTrend} value={0} />
              </div>
              <p className="text-xs text-gray-500">NIM</p>
            </div>

            {/* Customer Growth */}
            <div className="hidden lg:block text-right min-w-[70px]">
              <span className={cn(
                'inline-flex items-center justify-center px-2 py-0.5 rounded-full text-sm font-medium',
                branch.customerGrowth >= 15 ? 'bg-green-900/50 text-green-400' :
                branch.customerGrowth >= 8 ? 'bg-blue-900/50 text-blue-400' :
                'bg-gray-700 text-gray-300'
              )}>
                +{branch.customerGrowth}%
              </span>
              <p className="text-xs text-gray-500 mt-0.5">Growth</p>
            </div>

            {/* NPS Score */}
            <div className="hidden xl:block text-right min-w-[60px]">
              <NPSBadge score={branch.npsScore} trend={branch.npsTrend} />
            </div>

            {/* Expand Arrow */}
            <ChevronIcon className={cn(
              'w-5 h-5 text-gray-500 transition-transform',
              isExpanded && 'rotate-180'
            )} />
          </div>
        </div>
      </button>

      {/* Expanded Details */}
      {isExpanded && (
        <BranchExpandedDetails branch={branch} onDrillDown={onDrillDown} />
      )}
    </div>
  );
}

interface BranchExpandedDetailsProps {
  branch: BranchMetrics;
  onDrillDown?: () => void;
}

function BranchExpandedDetails({ branch, onDrillDown }: BranchExpandedDetailsProps) {
  return (
    <div className="px-4 pb-4 bg-gray-800/30">
      <div className="border-t border-gray-700 pt-4">
        {/* Financial Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <MetricBox
            label="Quarterly Revenue"
            value={`$${branch.revenue.toFixed(1)}M`}
            subtext={`${branch.revenueChange > 0 ? '+' : ''}${branch.revenueChange}% vs LQ`}
            status={branch.revenueChange >= 10 ? 'good' : branch.revenueChange >= 5 ? 'neutral' : 'warning'}
          />
          <MetricBox
            label="Total Deposits"
            value={`$${branch.deposits.toFixed(1)}M`}
            subtext={`${branch.depositsChange > 0 ? '+' : ''}${branch.depositsChange}% growth`}
            status={branch.depositsChange >= 8 ? 'good' : 'neutral'}
          />
          <MetricBox
            label="Loan Portfolio"
            value={`$${branch.loanPortfolio.toFixed(1)}M`}
            subtext={`${branch.loanPortfolioChange > 0 ? '+' : ''}${branch.loanPortfolioChange}% growth`}
            status={branch.loanPortfolioChange >= 10 ? 'good' : 'neutral'}
          />
          <MetricBox
            label="Net Interest Margin"
            value={`${branch.netInterestMargin.toFixed(2)}%`}
            subtext="Industry avg: 3.50%"
            status={branch.netInterestMargin >= 3.8 ? 'good' : branch.netInterestMargin >= 3.5 ? 'neutral' : 'warning'}
          />
        </div>

        {/* Growth & Efficiency */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Growth & Efficiency</h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricBox
              label="New Accounts"
              value={branch.newAccounts.toLocaleString()}
              subtext={`${branch.newAccountsChange > 0 ? '+' : ''}${branch.newAccountsChange}% vs LQ`}
              status={branch.newAccountsChange >= 20 ? 'good' : branch.newAccountsChange >= 10 ? 'neutral' : 'warning'}
            />
            <MetricBox
              label="Customer Growth"
              value={`${branch.customerGrowth}%`}
              subtext="Year-over-year"
              status={branch.customerGrowth >= 15 ? 'good' : branch.customerGrowth >= 8 ? 'neutral' : 'warning'}
            />
            <MetricBox
              label="Efficiency Ratio"
              value={`${branch.efficiency}%`}
              subtext="Lower is better"
              status={branch.efficiency <= 55 ? 'good' : branch.efficiency <= 60 ? 'neutral' : 'warning'}
            />
            <MetricBox
              label="Revenue/Employee"
              value={`$${(branch.revenuePerEmployee / 1000).toFixed(2)}M`}
              subtext={`${branch.employeeCount} employees`}
              status={branch.revenuePerEmployee >= 1150 ? 'good' : branch.revenuePerEmployee >= 1000 ? 'neutral' : 'warning'}
            />
          </div>
        </div>

        {/* Customer Experience */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Customer Experience</h4>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-4 px-4 py-3 rounded-lg bg-gray-700/30">
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Net Promoter Score</p>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'text-2xl font-bold',
                    branch.npsScore >= 70 ? 'text-green-400' :
                    branch.npsScore >= 50 ? 'text-amber-400' : 'text-red-400'
                  )}>
                    {branch.npsScore}
                  </span>
                  <TrendIndicator trend={branch.npsTrend} value={0} />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {branch.npsScore >= 70 ? 'Excellent' :
                   branch.npsScore >= 50 ? 'Good' : 'Needs attention'}
                </p>
              </div>
              <NPSGauge score={branch.npsScore} />
            </div>

            <div className="flex items-center gap-4 px-4 py-3 rounded-lg bg-gray-700/30">
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Customer Satisfaction</p>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'text-2xl font-bold',
                    branch.customerSatisfaction >= 90 ? 'text-green-400' :
                    branch.customerSatisfaction >= 80 ? 'text-amber-400' : 'text-red-400'
                  )}>
                    {branch.customerSatisfaction}%
                  </span>
                  <TrendIndicator trend={branch.satisfactionTrend} value={0} />
                </div>
              </div>
              <SatisfactionBar value={branch.customerSatisfaction} />
            </div>

            <div className="px-4 py-3 rounded-lg bg-gray-700/30">
              <p className="text-xs text-gray-500 mb-1">Team Size</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">{branch.employeeCount}</span>
                <span className="text-sm text-gray-400">FTE</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                ${(branch.revenue / branch.employeeCount).toFixed(2)}M revenue per employee
              </p>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Key Insights</h4>
          <div className="space-y-2">
            {getInsightsForBranch(branch).map((insight, idx) => (
              <div
                key={idx}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg border',
                  insight.type === 'positive' && 'bg-green-900/20 border-green-700/30',
                  insight.type === 'warning' && 'bg-amber-900/20 border-amber-700/30',
                  insight.type === 'info' && 'bg-blue-900/20 border-blue-700/30'
                )}
              >
                {insight.type === 'positive' && <TrendUpIcon className="w-4 h-4 text-green-400 flex-shrink-0" />}
                {insight.type === 'warning' && <AlertIcon className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                {insight.type === 'info' && <InfoIcon className="w-4 h-4 text-blue-400 flex-shrink-0" />}
                <span className="text-sm text-gray-300">{insight.message}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onDrillDown}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-colors"
          >
            Full Branch Report
          </button>
          <button className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 text-sm font-medium hover:bg-gray-600 transition-colors">
            Financial Details
          </button>
          <button className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 text-sm font-medium hover:bg-gray-600 transition-colors">
            Compare Branches
          </button>
        </div>
      </div>
    </div>
  );
}

// Generate insights based on branch metrics
function getInsightsForBranch(branch: BranchMetrics): Array<{ type: 'positive' | 'warning' | 'info'; message: string }> {
  const insights: Array<{ type: 'positive' | 'warning' | 'info'; message: string }> = [];

  // Revenue insights
  if (branch.revenueChange >= 15) {
    insights.push({ type: 'positive', message: `Strong revenue growth at ${branch.revenueChange}% vs last quarter` });
  }

  // Loan growth insights
  if (branch.loanPortfolioChange >= 20) {
    insights.push({ type: 'positive', message: `Exceptional loan portfolio growth of ${branch.loanPortfolioChange}%` });
  }

  // NIM insights
  if (branch.netInterestMargin >= 3.9) {
    insights.push({ type: 'positive', message: `Above-average NIM at ${branch.netInterestMargin.toFixed(2)}% (industry: 3.50%)` });
  }

  // Customer satisfaction concerns
  if (branch.satisfactionTrend === 'DOWN') {
    insights.push({ type: 'warning', message: 'Customer satisfaction trending down - review service quality' });
  }

  // NPS concerns
  if (branch.npsTrend === 'DOWN') {
    insights.push({ type: 'warning', message: 'NPS declining - consider customer feedback initiatives' });
  }

  // Efficiency concerns
  if (branch.efficiency > 58) {
    insights.push({ type: 'warning', message: `Efficiency ratio at ${branch.efficiency}% - above target of 55%` });
  }

  // Customer growth highlight
  if (branch.customerGrowth >= 15) {
    insights.push({ type: 'info', message: `Strong customer acquisition with ${branch.customerGrowth}% YoY growth` });
  }

  // New accounts highlight
  if (branch.newAccountsChange >= 25) {
    insights.push({ type: 'info', message: `${branch.newAccounts} new accounts this quarter (+${branch.newAccountsChange}%)` });
  }

  return insights.slice(0, 3); // Return top 3 insights
}

// Metric Box Component
function MetricBox({
  label,
  value,
  subtext,
  status,
}: {
  label: string;
  value: string;
  subtext: string;
  status: 'good' | 'warning' | 'critical' | 'neutral';
}) {
  const statusColors = {
    good: 'text-green-400',
    warning: 'text-amber-400',
    critical: 'text-red-400',
    neutral: 'text-white',
  };

  return (
    <div className="p-3 rounded-lg bg-gray-700/30">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={cn('text-xl font-bold', statusColors[status])}>{value}</p>
      <p className="text-xs text-gray-500">{subtext}</p>
    </div>
  );
}

interface TrendIndicatorProps {
  trend: MetricTrend;
  value: number;
}

function TrendIndicator({ trend, value }: TrendIndicatorProps) {
  return (
    <span className={cn(
      'inline-flex items-center text-xs font-medium',
      trend === 'UP' && 'text-green-400',
      trend === 'DOWN' && 'text-red-400',
      trend === 'STABLE' && 'text-gray-400'
    )}>
      {trend === 'UP' && <ArrowUpIcon className="w-3 h-3" />}
      {trend === 'DOWN' && <ArrowDownIcon className="w-3 h-3" />}
      {trend === 'STABLE' && <MinusIcon className="w-3 h-3" />}
    </span>
  );
}

// NPS Badge Component
function NPSBadge({ score, trend }: { score: number; trend: MetricTrend }) {
  const bgColor = score >= 70 ? 'bg-green-900/50' : score >= 50 ? 'bg-amber-900/50' : 'bg-red-900/50';
  const textColor = score >= 70 ? 'text-green-400' : score >= 50 ? 'text-amber-400' : 'text-red-400';

  return (
    <div>
      <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded text-sm font-medium', bgColor, textColor)}>
        {score}
        {trend === 'UP' && <ArrowUpIcon className="w-3 h-3" />}
        {trend === 'DOWN' && <ArrowDownIcon className="w-3 h-3" />}
      </span>
      <p className="text-xs text-gray-500 mt-0.5">NPS</p>
    </div>
  );
}

// NPS Gauge mini visualization
function NPSGauge({ score }: { score: number }) {
  const percentage = Math.min(100, Math.max(0, (score + 100) / 2)); // NPS ranges -100 to 100
  const color = score >= 70 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="w-12 h-12 relative">
      <svg viewBox="0 0 36 36" className="w-full h-full">
        {/* Background circle */}
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#374151"
          strokeWidth="3"
        />
        {/* Progress circle */}
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={`${percentage}, 100`}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

// Satisfaction bar mini visualization
function SatisfactionBar({ value }: { value: number }) {
  const color = value >= 90 ? 'bg-green-500' : value >= 80 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="w-16 h-2 bg-gray-600 rounded-full overflow-hidden">
      <div
        className={cn('h-full rounded-full transition-all', color)}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

// Icons
function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function ArrowUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

function ArrowDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M19 12l-7 7-7-7" />
    </svg>
  );
}

function MinusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function TrendUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}
