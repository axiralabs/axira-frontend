import { cn } from '@axira/shared/utils';
import type { BoardMetric, MetricTrend, MetricStatus } from '../types';
import { METRIC_STATUS_STYLES } from '../types';

interface ExecutiveKPIBarProps {
  metrics: BoardMetric[];
  className?: string;
}

export function ExecutiveKPIBar({ metrics, className }: ExecutiveKPIBarProps) {
  return (
    <div className={cn('grid grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      {metrics.map((metric) => (
        <KPICard key={metric.id} metric={metric} />
      ))}
    </div>
  );
}

interface KPICardProps {
  metric: BoardMetric;
}

function KPICard({ metric }: KPICardProps) {
  const statusStyles = METRIC_STATUS_STYLES[metric.status];

  return (
    <div
      className={cn(
        'relative rounded-xl border border-gray-700 p-4 overflow-hidden',
        'bg-gray-800/50 hover:bg-gray-800/70 transition-colors'
      )}
    >
      {/* Status indicator dot */}
      <div className={cn('absolute top-3 right-3 w-2 h-2 rounded-full', statusStyles.dotColor)} />

      {/* Label */}
      <p className="text-sm text-gray-400 mb-1">{metric.label}</p>

      {/* Value */}
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-white">
          {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
        </span>
        {metric.unit && <span className="text-lg text-gray-400">{metric.unit}</span>}
      </div>

      {/* Trend */}
      {metric.trendValue && (
        <div className="flex items-center gap-1 mt-2">
          <TrendIcon trend={metric.trend} />
          <span
            className={cn(
              'text-sm font-medium',
              metric.trend === 'UP' && metric.status === 'GOOD' && 'text-green-400',
              metric.trend === 'UP' && metric.status !== 'GOOD' && 'text-red-400',
              metric.trend === 'DOWN' && metric.status === 'GOOD' && 'text-green-400',
              metric.trend === 'DOWN' && metric.status !== 'GOOD' && 'text-red-400',
              metric.trend === 'STABLE' && 'text-gray-400'
            )}
          >
            {metric.trendValue}
          </span>
          <span className="text-xs text-gray-500">vs last period</span>
        </div>
      )}
    </div>
  );
}

function TrendIcon({ trend }: { trend: MetricTrend }) {
  const baseClass = 'w-4 h-4';

  switch (trend) {
    case 'UP':
      return (
        <svg className={cn(baseClass, 'text-current')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 17l5-5 5 5" />
          <path d="M7 11l5-5 5 5" />
        </svg>
      );
    case 'DOWN':
      return (
        <svg className={cn(baseClass, 'text-current')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 7l5 5 5-5" />
          <path d="M7 13l5 5 5-5" />
        </svg>
      );
    case 'STABLE':
      return (
        <svg className={cn(baseClass, 'text-gray-400')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14" />
        </svg>
      );
  }
}
