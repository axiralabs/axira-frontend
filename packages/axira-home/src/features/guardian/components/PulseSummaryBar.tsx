import { cn } from '@axira/shared/utils';
import type { PulseSummary } from '../types';

interface PulseSummaryBarProps {
  summary: PulseSummary;
  onFilterClick?: (priority: 'URGENT' | 'WATCH' | 'OPPORTUNITY' | null) => void;
  activeFilter?: 'URGENT' | 'WATCH' | 'OPPORTUNITY' | null;
  className?: string;
}

export function PulseSummaryBar({
  summary,
  onFilterClick,
  activeFilter,
  className,
}: PulseSummaryBarProps) {
  return (
    <div className={cn(
      'flex items-center gap-6 px-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700',
      className
    )}>
      <SummaryPill
        count={summary.urgent}
        label="Urgent"
        color="red"
        active={activeFilter === 'URGENT'}
        onClick={() => onFilterClick?.(activeFilter === 'URGENT' ? null : 'URGENT')}
      />
      <SummaryPill
        count={summary.watch}
        label="Watch"
        color="amber"
        active={activeFilter === 'WATCH'}
        onClick={() => onFilterClick?.(activeFilter === 'WATCH' ? null : 'WATCH')}
      />
      <SummaryPill
        count={summary.opportunity}
        label="Opportunities"
        color="green"
        active={activeFilter === 'OPPORTUNITY'}
        onClick={() => onFilterClick?.(activeFilter === 'OPPORTUNITY' ? null : 'OPPORTUNITY')}
      />
    </div>
  );
}

interface SummaryPillProps {
  count: number;
  label: string;
  color: 'red' | 'amber' | 'green';
  active?: boolean;
  onClick?: () => void;
}

function SummaryPill({ count, label, color, active, onClick }: SummaryPillProps) {
  const colorClasses = {
    red: {
      dot: 'bg-red-500',
      text: 'text-red-400',
      activeBg: 'bg-red-500/20 ring-1 ring-red-500/50',
    },
    amber: {
      dot: 'bg-amber-500',
      text: 'text-amber-400',
      activeBg: 'bg-amber-500/20 ring-1 ring-amber-500/50',
    },
    green: {
      dot: 'bg-green-500',
      text: 'text-green-400',
      activeBg: 'bg-green-500/20 ring-1 ring-green-500/50',
    },
  };

  const colors = colorClasses[color];

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-full transition-all',
        'hover:bg-gray-700/50',
        active && colors.activeBg
      )}
    >
      <span className={cn('w-2.5 h-2.5 rounded-full', colors.dot)} />
      <span className={cn('text-lg font-semibold', colors.text)}>{count}</span>
      <span className="text-sm text-gray-400">{label}</span>
    </button>
  );
}
