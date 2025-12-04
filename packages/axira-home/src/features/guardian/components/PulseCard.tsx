import { useState } from 'react';
import { cn } from '@axira/shared/utils';
import type { PulseItem, PulseAction, PreparedAsset } from '../types';
import { PRIORITY_STYLES } from '../types';

interface PulseCardProps {
  item: PulseItem;
  onAction?: (action: PulseAction, item: PulseItem) => void;
  onSubjectClick?: (subjectKey: string) => void;
  className?: string;
}

export function PulseCard({
  item,
  onAction,
  onSubjectClick,
  className,
}: PulseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const styles = PRIORITY_STYLES[item.priority];

  const primaryAction = item.suggestedActions.find(a => a.primary);
  const secondaryActions = item.suggestedActions.filter(a => !a.primary);

  return (
    <div
      className={cn(
        'rounded-lg bg-gray-800/50 border border-gray-700 overflow-hidden transition-all',
        styles.border,
        className
      )}
    >
      {/* Main Content */}
      <div
        className={cn(
          'p-4 cursor-pointer',
          styles.bgHover
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-3">
          <PriorityIcon priority={item.priority} />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-medium text-white">{item.title}</h3>
                {item.subjectName && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.subjectKey) onSubjectClick?.(item.subjectKey);
                    }}
                    className="text-sm text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    {item.subjectName}
                  </button>
                )}
              </div>

              {item.daysUntilDue !== undefined && (
                <DueBadge days={item.daysUntilDue} priority={item.priority} />
              )}
            </div>

            <p className="mt-1 text-sm text-gray-400">{item.summary}</p>

            {/* Collapsed Actions */}
            {!isExpanded && primaryAction && (
              <div className="mt-3 flex items-center gap-2">
                <ActionButton
                  action={primaryAction}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction?.(primaryAction, item);
                  }}
                  primary
                />
                {secondaryActions.length > 0 && (
                  <span className="text-xs text-gray-500">
                    +{secondaryActions.length} more actions
                  </span>
                )}
              </div>
            )}
          </div>

          <ExpandIcon expanded={isExpanded} />
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-700 p-4 space-y-4">
          {/* Details */}
          {item.details && (
            <p className="text-sm text-gray-300">{item.details}</p>
          )}

          {/* Prepared Assets */}
          {item.preparedAssets && item.preparedAssets.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Prepared for You
              </h4>
              <div className="space-y-2">
                {item.preparedAssets.map(asset => (
                  <AssetCard key={asset.id} asset={asset} />
                ))}
              </div>
            </div>
          )}

          {/* All Actions */}
          <div className="flex flex-wrap gap-2">
            {item.suggestedActions.map(action => (
              <ActionButton
                key={action.id}
                action={action}
                onClick={() => onAction?.(action, item)}
                primary={action.primary}
              />
            ))}
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-700/50">
            <span>Detected by: {item.watcherType}</span>
            <span>Confidence: {Math.round(item.confidence * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}

function PriorityIcon({ priority }: { priority: 'URGENT' | 'WATCH' | 'OPPORTUNITY' }) {
  const styles = PRIORITY_STYLES[priority];

  return (
    <div className={cn(
      'flex items-center justify-center w-10 h-10 rounded-lg',
      styles.bg
    )}>
      {priority === 'URGENT' && (
        <svg className={cn('w-5 h-5', styles.icon)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )}
      {priority === 'WATCH' && (
        <svg className={cn('w-5 h-5', styles.icon)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      )}
      {priority === 'OPPORTUNITY' && (
        <svg className={cn('w-5 h-5', styles.icon)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13 7l5 5-5 5M6 7l5 5-5 5" />
        </svg>
      )}
    </div>
  );
}

function DueBadge({ days, priority }: { days: number; priority: 'URGENT' | 'WATCH' | 'OPPORTUNITY' }) {
  let text: string;
  if (days === 0) text = 'Today';
  else if (days === 1) text = 'Tomorrow';
  else if (days < 0) text = `${Math.abs(days)}d overdue`;
  else if (days <= 7) text = `${days}d`;
  else if (days <= 30) text = `${Math.ceil(days / 7)}w`;
  else text = `${Math.ceil(days / 30)}mo`;

  const styles = PRIORITY_STYLES[priority];

  return (
    <span className={cn(
      'px-2 py-0.5 rounded text-xs font-medium',
      styles.badge
    )}>
      {text}
    </span>
  );
}

function ExpandIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={cn(
        'w-5 h-5 text-gray-500 transition-transform',
        expanded && 'rotate-180'
      )}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function AssetCard({ asset }: { asset: PreparedAsset }) {
  const iconMap = {
    FORM: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    TALKING_POINTS: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    REPORT: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    DOCUMENT: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  };

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors cursor-pointer">
      <div className="flex items-center justify-center w-8 h-8 rounded bg-blue-500/20 text-blue-400">
        {iconMap[asset.type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{asset.title}</p>
        {asset.description && (
          <p className="text-xs text-gray-400 truncate">{asset.description}</p>
        )}
      </div>
      <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    </div>
  );
}

function ActionButton({
  action,
  onClick,
  primary,
}: {
  action: PulseAction;
  onClick: (e: React.MouseEvent) => void;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={action.disabled}
      className={cn(
        'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
        primary
          ? 'bg-blue-600 text-white hover:bg-blue-500'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600',
        action.disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {action.label}
    </button>
  );
}
