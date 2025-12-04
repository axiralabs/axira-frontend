import { cn } from '@axira/shared/utils';
import type { PulseItem, PulsePriority, PulseAction } from '../types';
import { PRIORITY_STYLES } from '../types';
import { PulseCard } from './PulseCard';

interface PulseSectionProps {
  priority: PulsePriority;
  items: PulseItem[];
  onAction?: (action: PulseAction, item: PulseItem) => void;
  onSubjectClick?: (subjectKey: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  maxItems?: number;
  className?: string;
}

export function PulseSection({
  priority,
  items,
  onAction,
  onSubjectClick,
  collapsed = false,
  onToggleCollapse,
  maxItems,
  className,
}: PulseSectionProps) {
  const styles = PRIORITY_STYLES[priority];
  const displayItems = maxItems ? items.slice(0, maxItems) : items;
  const hasMore = maxItems && items.length > maxItems;

  const labels = {
    URGENT: 'Needs Immediate Attention',
    WATCH: 'Keep an Eye On',
    OPPORTUNITY: 'Opportunities',
  };

  if (items.length === 0) return null;

  return (
    <div className={cn('space-y-3', className)}>
      {/* Section Header */}
      <button
        onClick={onToggleCollapse}
        className="flex items-center gap-2 group w-full"
      >
        <div className={cn('w-2 h-2 rounded-full', styles.dot)} />
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
          {labels[priority]}
        </h2>
        <span className={cn(
          'px-2 py-0.5 rounded-full text-xs font-medium',
          styles.badge
        )}>
          {items.length}
        </span>
        <div className="flex-1" />
        {onToggleCollapse && (
          <svg
            className={cn(
              'w-4 h-4 text-gray-500 transition-transform',
              collapsed && '-rotate-90'
            )}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {/* Items */}
      {!collapsed && (
        <div className="space-y-3">
          {displayItems.map(item => (
            <PulseCard
              key={item.id}
              item={item}
              onAction={onAction}
              onSubjectClick={onSubjectClick}
            />
          ))}

          {hasMore && (
            <button className="w-full py-2 text-sm text-gray-400 hover:text-white transition-colors">
              View {items.length - maxItems!} more
            </button>
          )}
        </div>
      )}
    </div>
  );
}
