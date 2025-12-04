import { useState } from 'react';
import { cn } from '@axira/shared/utils';

export interface BranchChartData {
  branchName: string;
  branchId: string;
  revenue: number;
  satisfaction: number;
  compliance: number;
  efficiency: number;
  growth: number;
  color: string;
}

interface BranchComparisonChartProps {
  branches: BranchChartData[];
  className?: string;
  onBranchClick?: (branchId: string) => void;
}

type MetricKey = 'revenue' | 'satisfaction' | 'compliance' | 'efficiency' | 'growth';

const METRICS: Array<{ key: MetricKey; label: string; unit: string; format: (v: number) => string }> = [
  { key: 'revenue', label: 'Revenue', unit: '$M', format: (v) => `$${v.toFixed(1)}M` },
  { key: 'satisfaction', label: 'Satisfaction', unit: '%', format: (v) => `${v}%` },
  { key: 'compliance', label: 'Compliance', unit: '%', format: (v) => `${v.toFixed(1)}%` },
  { key: 'efficiency', label: 'Efficiency', unit: 'score', format: (v) => v.toFixed(0) },
  { key: 'growth', label: 'YoY Growth', unit: '%', format: (v) => `${v > 0 ? '+' : ''}${v}%` },
];

export function BranchComparisonChart({ branches, className, onBranchClick }: BranchComparisonChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('revenue');
  const [hoveredBranch, setHoveredBranch] = useState<string | null>(null);

  const currentMetric = METRICS.find(m => m.key === selectedMetric)!;
  const maxValue = Math.max(...branches.map(b => b[selectedMetric]));

  return (
    <div className={cn('rounded-xl border border-gray-700 bg-gray-800/50 overflow-hidden', className)}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Branch Comparison</h3>
            <p className="text-sm text-gray-400">Q4 2024 Performance Metrics</p>
          </div>
          <div className="flex items-center gap-1">
            <ChartBarIcon className="w-5 h-5 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Metric Tabs */}
      <div className="px-4 py-2 border-b border-gray-700 flex gap-1 overflow-x-auto">
        {METRICS.map((metric) => (
          <button
            key={metric.key}
            onClick={() => setSelectedMetric(metric.key)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
              selectedMetric === metric.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-white'
            )}
          >
            {metric.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="p-4">
        <div className="space-y-3">
          {branches.map((branch) => {
            const value = branch[selectedMetric];
            const percentage = (value / maxValue) * 100;
            const isHovered = hoveredBranch === branch.branchId;

            return (
              <div
                key={branch.branchId}
                className={cn(
                  'group cursor-pointer transition-all',
                  isHovered && 'scale-[1.02]'
                )}
                onMouseEnter={() => setHoveredBranch(branch.branchId)}
                onMouseLeave={() => setHoveredBranch(null)}
                onClick={() => onBranchClick?.(branch.branchId)}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: branch.color }}
                    />
                    <span className={cn(
                      'text-sm font-medium transition-colors',
                      isHovered ? 'text-white' : 'text-gray-300'
                    )}>
                      {branch.branchName}
                    </span>
                  </div>
                  <span className={cn(
                    'text-sm font-semibold transition-colors',
                    isHovered ? 'text-white' : 'text-gray-200',
                    selectedMetric === 'growth' && value > 0 && 'text-green-400',
                    selectedMetric === 'growth' && value < 0 && 'text-red-400'
                  )}>
                    {currentMetric.format(value)}
                  </span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      isHovered && 'brightness-110'
                    )}
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: branch.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="mt-4 pt-4 border-t border-gray-700/50 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Highest</div>
            <div className="text-sm font-semibold text-green-400">
              {currentMetric.format(Math.max(...branches.map(b => b[selectedMetric])))}
            </div>
            <div className="text-xs text-gray-400">
              {branches.reduce((a, b) => b[selectedMetric] > a[selectedMetric] ? b : a).branchName}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Average</div>
            <div className="text-sm font-semibold text-blue-400">
              {currentMetric.format(
                branches.reduce((sum, b) => sum + b[selectedMetric], 0) / branches.length
              )}
            </div>
            <div className="text-xs text-gray-400">All Branches</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Lowest</div>
            <div className="text-sm font-semibold text-yellow-400">
              {currentMetric.format(Math.min(...branches.map(b => b[selectedMetric])))}
            </div>
            <div className="text-xs text-gray-400">
              {branches.reduce((a, b) => b[selectedMetric] < a[selectedMetric] ? b : a).branchName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Trend Chart Component - Interactive with hover and branch breakdown
export interface TrendData {
  month: string;
  value: number;
}

export interface BranchTrendBreakdown {
  branchName: string;
  value: number;
  change: number;
  color: string;
}

interface TrendChartProps {
  title: string;
  subtitle?: string;
  data: TrendData[];
  branchBreakdown?: BranchTrendBreakdown[];
  unit?: string;
  prefix?: string;
  trend?: number;
  className?: string;
  onBranchClick?: (branchName: string) => void;
}

export function TrendChart({
  title,
  subtitle,
  data,
  branchBreakdown,
  unit = '',
  prefix = '',
  trend,
  className,
  onBranchClick
}: TrendChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [hoveredBranch, setHoveredBranch] = useState<string | null>(null);

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  // Calculate points for the line
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((item.value - minValue) / range) * 60 - 20;
    return { x, y, value: item.value, label: item.month };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L 100 100 L 0 100 Z`;

  const currentValue = data[data.length - 1].value;
  const displayValue = hoveredPoint !== null ? points[hoveredPoint].value : currentValue;
  const displayLabel = hoveredPoint !== null ? points[hoveredPoint].label : 'Current';

  // Format value for display
  const formatValue = (val: number) => {
    if (prefix === '$' && val >= 1) {
      return `${prefix}${val.toFixed(1)}${unit}`;
    }
    return `${prefix}${val.toFixed(1)}${unit}`;
  };

  return (
    <div className={cn('rounded-xl border border-gray-700 bg-gray-800/50 overflow-hidden', className)}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-semibold text-white">{title}</h4>
            {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
          </div>
          {trend !== undefined && (
            <span className={cn(
              'text-xs px-2 py-1 rounded-full font-medium',
              trend >= 0 ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
            )}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last quarter
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* Current Value Display */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">
              {formatValue(displayValue)}
            </span>
            <span className="text-sm text-gray-400">{displayLabel}</span>
          </div>
        </div>

        {/* Interactive Chart */}
        <div className="h-20 relative mb-2">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            {[40, 60, 80].map(y => (
              <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#374151" strokeWidth="0.2" strokeDasharray="2,2" />
            ))}

            {/* Area fill */}
            <path d={areaD} fill="url(#trendGradient)" opacity="0.2" />

            {/* Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Points */}
            {points.map((p, i) => (
              <g key={i}>
                {/* Larger invisible hit area */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="8"
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(i)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                {/* Visible point */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hoveredPoint === i ? 5 : 3}
                  fill={hoveredPoint === i ? '#60a5fa' : '#3b82f6'}
                  stroke="#1e3a8a"
                  strokeWidth="1.5"
                  className="transition-all duration-150"
                />
                {/* Hover tooltip line */}
                {hoveredPoint === i && (
                  <line x1={p.x} y1={p.y} x2={p.x} y2="100" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="2,2" />
                )}
              </g>
            ))}

            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Month Labels */}
        <div className="flex justify-between text-xs text-gray-500 mb-4">
          {data.map((item, i) => (
            <span
              key={i}
              className={cn(
                'transition-colors cursor-default',
                hoveredPoint === i && 'text-blue-400 font-medium'
              )}
            >
              {item.month}
            </span>
          ))}
        </div>

        {/* Branch Breakdown */}
        {branchBreakdown && branchBreakdown.length > 0 && (
          <div className="border-t border-gray-700 pt-3">
            <p className="text-xs text-gray-500 mb-2">By Branch</p>
            <div className="space-y-2">
              {branchBreakdown.map((branch) => (
                <div
                  key={branch.branchName}
                  className={cn(
                    'flex items-center justify-between px-2 py-1.5 rounded-lg transition-colors cursor-pointer',
                    hoveredBranch === branch.branchName ? 'bg-gray-700' : 'hover:bg-gray-700/50'
                  )}
                  onMouseEnter={() => setHoveredBranch(branch.branchName)}
                  onMouseLeave={() => setHoveredBranch(null)}
                  onClick={() => onBranchClick?.(branch.branchName)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: branch.color }} />
                    <span className="text-sm text-gray-300">{branch.branchName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">
                      {formatValue(branch.value)}
                    </span>
                    <span className={cn(
                      'text-xs',
                      branch.change >= 0 ? 'text-green-400' : 'text-red-400'
                    )}>
                      {branch.change >= 0 ? '+' : ''}{branch.change}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Icons
function ChartBarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="10" width="4" height="10" rx="1" />
      <rect x="10" y="5" width="4" height="15" rx="1" />
      <rect x="17" y="8" width="4" height="12" rx="1" />
    </svg>
  );
}
