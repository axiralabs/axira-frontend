import { cn } from '@axira/shared/utils';
import type { ProactiveNudge as ProactiveNudgeType } from '../types';

interface ProactiveNudgeProps {
  nudge: ProactiveNudgeType;
  onAccept?: () => void;
  onDismiss?: () => void;
  className?: string;
}

/**
 * A single proactive nudge - one actionable suggestion from Axira.
 * Subtle, helpful, not intrusive. Only one shown at a time.
 */
export function ProactiveNudge({
  nudge,
  onAccept,
  onDismiss,
  className,
}: ProactiveNudgeProps) {
  return (
    <div className={cn(
      'flex items-start gap-3 p-4 rounded-xl',
      'bg-gradient-to-r from-blue-500/5 to-purple-500/5',
      'border border-blue-500/10',
      className
    )}>
      {/* Lightbulb icon */}
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex-shrink-0">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 18h6M10 22h4M12 2v1M12 5a6 6 0 0 1 6 6c0 2.22-1.21 4.16-3 5.19V17a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-.81C7.21 15.16 6 13.22 6 11a6 6 0 0 1 6-6z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-300">
          <span className="text-white">{nudge.message}</span>
          {' — '}
          <span className="text-gray-400">{nudge.suggestion}</span>
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={onAccept}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium',
              'bg-blue-600 hover:bg-blue-500 text-white',
              'transition-colors'
            )}
          >
            {nudge.primaryAction.label}
          </button>

          {nudge.dismissable && (
            <button
              onClick={onDismiss}
              className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
            >
              Not now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
