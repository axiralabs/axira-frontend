import { cn } from '@axira/shared/utils';
import type { WorkItem } from '../types';
import { WORK_ITEM_ICONS } from '../types';

interface WorkCardProps {
  item: WorkItem;
  onClick?: () => void;
  className?: string;
}

/**
 * A prepared work item card - clean, informative, inviting to click.
 * Not an alert, but actual work ready to start.
 */
export function WorkCard({ item, onClick, className }: WorkCardProps) {
  const iconPath = WORK_ITEM_ICONS[item.icon];

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-4 rounded-xl',
        'bg-gray-900/60 hover:bg-gray-800/80',
        'border border-gray-800 hover:border-gray-700',
        'transition-all duration-200',
        'group',
        className
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={cn(
          'flex items-center justify-center w-10 h-10 rounded-lg',
          'bg-gray-800 group-hover:bg-gray-700',
          'text-gray-400 group-hover:text-gray-300',
          'transition-colors'
        )}>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d={iconPath} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-medium text-white group-hover:text-white truncate">
              {item.title}
            </h3>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {item.reasonLabel}
            </span>
          </div>

          {/* Subtitle */}
          {item.subtitle && (
            <p className="text-sm text-gray-400 truncate mt-0.5">
              {item.subtitle}
            </p>
          )}

          {/* Context summary */}
          {item.contextReady && item.contextSummary && (
            <div className="flex items-center gap-1.5 mt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-xs text-gray-500">
                {item.contextSummary}
              </span>
              {item.estimatedMinutes && (
                <>
                  <span className="text-gray-600">•</span>
                  <span className="text-xs text-gray-500">
                    ~{item.estimatedMinutes} min
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Arrow indicator */}
        <svg
          className={cn(
            'w-5 h-5 text-gray-600 group-hover:text-gray-400',
            'transition-all duration-200',
            'group-hover:translate-x-0.5'
          )}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </button>
  );
}

interface WorkCardListProps {
  items: WorkItem[];
  onItemClick?: (item: WorkItem) => void;
  title?: string;
  className?: string;
}

/**
 * List of work cards with optional title.
 */
export function WorkCardList({ items, onItemClick, title, className }: WorkCardListProps) {
  if (items.length === 0) return null;

  return (
    <div className={cn('space-y-3', className)}>
      {title && (
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          {title} ({items.length} ready)
        </h2>
      )}
      <div className="space-y-2">
        {items.map((item) => (
          <WorkCard
            key={item.id}
            item={item}
            onClick={() => onItemClick?.(item)}
          />
        ))}
      </div>
    </div>
  );
}
