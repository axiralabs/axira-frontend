import { cn } from '@axira/shared/utils';
import type { BranchHealth, BranchMetric } from '../../types/branchManager';
import { METRIC_STATUS_STYLES } from '../../types/branchManager';

interface BranchHealthCardProps {
  health: BranchHealth;
  className?: string;
  compact?: boolean;
}

export function BranchHealthCard({ health, className, compact }: BranchHealthCardProps) {
  return (
    <div className={cn(
      'rounded-xl bg-gray-900/50 border border-gray-800 overflow-hidden',
      className
    )}>
      {/* Header with main score */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
              Branch Health
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">{health.branchName}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-white">{health.efficiencyScore}</span>
              <span className="text-lg text-gray-500">%</span>
              <TrendIndicator trend={health.efficiencyTrend} change={health.efficiencyChange} />
            </div>
            <p className="text-xs text-gray-500">
              #{health.rankInRegion} of {health.totalBranchesInRegion} in region
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className={cn(
        'grid gap-px bg-gray-800',
        compact ? 'grid-cols-2' : 'grid-cols-4'
      )}>
        {health.metrics.map(metric => (
          <MetricCell key={metric.id} metric={metric} compact={compact} />
        ))}
      </div>
    </div>
  );
}

interface MetricCellProps {
  metric: BranchMetric;
  compact?: boolean;
}

function MetricCell({ metric, compact }: MetricCellProps) {
  const statusStyle = METRIC_STATUS_STYLES[metric.status];

  return (
    <div className={cn(
      'bg-gray-900/50 p-3',
      metric.drillDownAvailable && 'cursor-pointer hover:bg-gray-800/50 transition-colors'
    )}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 truncate">{metric.name}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={cn('text-xl font-semibold', statusStyle.text)}>
              {metric.value}
            </span>
            <span className="text-sm text-gray-500">{metric.unit}</span>
          </div>
          {!compact && metric.targetLabel && (
            <p className="text-xs text-gray-600 mt-0.5 truncate">{metric.targetLabel}</p>
          )}
        </div>
        <div className={cn('w-2 h-2 rounded-full mt-1', statusStyle.bg.replace('/10', ''))} />
      </div>
    </div>
  );
}

interface TrendIndicatorProps {
  trend: 'UP' | 'DOWN' | 'STABLE';
  change?: number;
}

function TrendIndicator({ trend, change }: TrendIndicatorProps) {
  if (trend === 'STABLE') {
    return (
      <span className="text-gray-500 text-sm">—</span>
    );
  }

  const isUp = trend === 'UP';
  return (
    <span className={cn(
      'flex items-center text-sm font-medium',
      isUp ? 'text-green-400' : 'text-red-400'
    )}>
      {isUp ? (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 17l5-5 5 5M7 7l5 5 5-5" />
        </svg>
      ) : (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 7l5 5 5-5M7 17l5-5 5 5" />
        </svg>
      )}
      {change !== undefined && (
        <span className="ml-0.5">{isUp ? '+' : ''}{change}%</span>
      )}
    </span>
  );
}

// Compact version for sidebar
export function BranchHealthCompact({ health, className }: { health: BranchHealth; className?: string }) {
  return (
    <div className={cn('space-y-3', className)}>
      {health.metrics.map(metric => {
        const statusStyle = METRIC_STATUS_STYLES[metric.status];
        return (
          <div key={metric.id} className="flex items-center justify-between">
            <span className="text-sm text-gray-400">{metric.name.replace('Operational ', '')}</span>
            <div className="flex items-center gap-2">
              <span className={cn('text-sm font-semibold', statusStyle.text)}>
                {metric.value}{metric.unit}
              </span>
              {metric.trend !== 'STABLE' && (
                <span className={cn(
                  'text-xs',
                  metric.trend === 'UP' ? 'text-green-400' : 'text-red-400'
                )}>
                  {metric.trend === 'UP' ? '↑' : '↓'}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
