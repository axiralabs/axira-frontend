import { useState } from 'react';
import { cn } from '@axira/shared/utils';
import type { OperationalBottleneck, RootCause } from '../../types/branchManager';
import { PRIORITY_STYLES } from '../../types';

interface OperationalBottleneckCardProps {
  bottleneck: OperationalBottleneck;
  onAction?: (action: string, bottleneck: OperationalBottleneck) => void;
  className?: string;
  expanded?: boolean;
}

export function OperationalBottleneckCard({
  bottleneck,
  onAction,
  className,
  expanded: initialExpanded = false,
}: OperationalBottleneckCardProps) {
  const [expanded, setExpanded] = useState(initialExpanded);
  const priorityStyle = PRIORITY_STYLES[bottleneck.priority];

  return (
    <div className={cn(
      'rounded-xl bg-gray-900/50 border overflow-hidden',
      priorityStyle.border,
      className
    )}>
      {/* Header - Always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left hover:bg-gray-800/30 transition-colors"
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', priorityStyle.bg)}>
            <svg className={cn('w-5 h-5', priorityStyle.icon)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-medium text-white">{bottleneck.title}</h3>
                <p className="text-sm text-gray-400 mt-0.5">{bottleneck.summary}</p>
              </div>
              <DeviationBadge
                current={bottleneck.currentValue}
                target={bottleneck.targetValue}
                unit={bottleneck.unit}
              />
            </div>

            {/* Quick stats */}
            <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                {bottleneck.affectedCount} {bottleneck.affectedLabel}
              </span>
              <span>{bottleneck.timePeriod}</span>
              {bottleneck.comparison && (
                <span className="text-blue-400">
                  vs {bottleneck.comparison.branchName}: {bottleneck.comparison.value}{bottleneck.unit}
                </span>
              )}
            </div>
          </div>

          {/* Expand icon */}
          <svg
            className={cn(
              'w-5 h-5 text-gray-500 transition-transform flex-shrink-0',
              expanded && 'rotate-180'
            )}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-gray-800">
          {/* Process Timeline Visualization */}
          <div className="p-4 border-b border-gray-800 bg-gray-900/30">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Process Timeline
            </h4>
            <ProcessTimeline processName={bottleneck.processName} />
          </div>

          {/* Root Causes */}
          <div className="p-4 border-b border-gray-800">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Root Cause Analysis
            </h4>
            <div className="space-y-2">
              {bottleneck.rootCauses.map(cause => (
                <RootCauseRow key={cause.id} cause={cause} />
              ))}
            </div>
          </div>

          {/* Recommendation */}
          {bottleneck.recommendation && (
            <div className="p-4 border-b border-gray-800 bg-blue-500/5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18h6M10 22h4M12 2v1M12 5a6 6 0 0 1 6 6c0 2.22-1.21 4.16-3 5.19V17a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-.81C7.21 15.16 6 13.22 6 11a6 6 0 0 1 6-6z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white">{bottleneck.recommendation.title}</h4>
                  <p className="text-sm text-gray-400 mt-1">{bottleneck.recommendation.description}</p>
                  {bottleneck.recommendation.evidence && (
                    <p className="text-sm text-green-400 mt-2">
                      ✓ {bottleneck.recommendation.evidence}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-3">
                    <EffortImpactBadge label="Effort" value={bottleneck.recommendation.effort} />
                    <EffortImpactBadge label="Impact" value={bottleneck.recommendation.impact} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="p-4 flex items-center gap-2">
            {bottleneck.actions.map(action => (
              <button
                key={action.id}
                onClick={() => onAction?.(action.action, bottleneck)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  action.type === 'PRIMARY'
                    ? 'bg-blue-600 text-white hover:bg-blue-500'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                )}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface DeviationBadgeProps {
  current: number;
  target: number;
  unit: string;
}

function DeviationBadge({ current, target, unit }: DeviationBadgeProps) {
  const deviation = ((current - target) / target) * 100;
  const isAbove = deviation > 0;

  return (
    <div className="text-right flex-shrink-0">
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-semibold text-white">{current}</span>
        <span className="text-sm text-gray-500">{unit}</span>
      </div>
      <p className={cn(
        'text-xs font-medium',
        isAbove ? 'text-red-400' : 'text-green-400'
      )}>
        {isAbove ? '+' : ''}{deviation.toFixed(0)}% vs target
      </p>
    </div>
  );
}

interface RootCauseRowProps {
  cause: RootCause;
}

function RootCauseRow({ cause }: RootCauseRowProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 text-right">
        <span className="text-sm font-semibold text-white">{cause.percentage}%</span>
      </div>
      <div className="flex-1">
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full',
              cause.isActionable ? 'bg-blue-500' : 'bg-gray-600'
            )}
            style={{ width: `${cause.percentage}%` }}
          />
        </div>
      </div>
      <div className="flex-[2] min-w-0">
        <p className={cn(
          'text-sm truncate',
          cause.isActionable ? 'text-gray-300' : 'text-gray-500'
        )}>
          {cause.description}
        </p>
      </div>
      {cause.isActionable && (
        <span className="px-1.5 py-0.5 rounded text-xs bg-blue-500/10 text-blue-400">
          Actionable
        </span>
      )}
    </div>
  );
}

function ProcessTimeline({ processName }: { processName: string }) {
  // Mock timeline for account opening - would be dynamic in real implementation
  const steps = processName === 'Account Opening'
    ? [
        { name: 'Customer Info', time: '5 min', status: 'complete' },
        { name: 'ID Scan', time: '2 min', status: 'complete' },
        { name: 'ID Verify', time: '15 min', status: 'bottleneck' },
        { name: 'Manual Review', time: '20 min', status: 'warning' },
        { name: 'Account Created', time: '5 min', status: 'complete' },
      ]
    : [
        { name: 'Initiate', time: '2 min', status: 'complete' },
        { name: 'Screening', time: '8 min', status: 'bottleneck' },
        { name: 'Review', time: '15 min', status: 'warning' },
        { name: 'Complete', time: '2 min', status: 'complete' },
      ];

  return (
    <div className="flex items-center gap-1">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center flex-1">
          <div className={cn(
            'flex-1 flex flex-col items-center p-2 rounded-lg text-center',
            step.status === 'bottleneck' && 'bg-red-500/10 border border-red-500/30',
            step.status === 'warning' && 'bg-amber-500/10',
          )}>
            <span className={cn(
              'text-xs',
              step.status === 'bottleneck' ? 'text-red-400' : step.status === 'warning' ? 'text-amber-400' : 'text-gray-400'
            )}>
              {step.name}
            </span>
            <span className={cn(
              'text-xs mt-0.5',
              step.status === 'bottleneck' ? 'text-red-500 font-medium' : 'text-gray-500'
            )}>
              {step.time}
            </span>
            {step.status === 'bottleneck' && (
              <span className="text-[10px] text-red-400 mt-1">BOTTLENECK</span>
            )}
          </div>
          {i < steps.length - 1 && (
            <svg className="w-4 h-4 text-gray-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5l7 7-7 7" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

function EffortImpactBadge({ label, value }: { label: string; value: 'LOW' | 'MEDIUM' | 'HIGH' }) {
  const colors = {
    LOW: label === 'Effort' ? 'text-green-400' : 'text-gray-400',
    MEDIUM: 'text-amber-400',
    HIGH: label === 'Effort' ? 'text-red-400' : 'text-green-400',
  };

  return (
    <span className="text-xs text-gray-500">
      {label}: <span className={cn('font-medium', colors[value])}>{value.toLowerCase()}</span>
    </span>
  );
}

// Compact card for pulse list
export function BottleneckPulseCard({
  bottleneck,
  onAction,
}: {
  bottleneck: OperationalBottleneck;
  onAction?: (action: string) => void;
}) {
  const priorityStyle = PRIORITY_STYLES[bottleneck.priority];
  const primaryAction = bottleneck.actions.find(a => a.type === 'PRIMARY');

  return (
    <div className={cn(
      'rounded-xl bg-gray-900/50 border p-4',
      priorityStyle.border
    )}>
      <div className="flex items-start gap-3">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', priorityStyle.bg)}>
          <svg className={cn('w-5 h-5', priorityStyle.icon)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white">{bottleneck.title}</h3>
          <p className="text-sm text-gray-400 mt-0.5">{bottleneck.summary}</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
            <span>{bottleneck.affectedCount} {bottleneck.affectedLabel}</span>
            <span>•</span>
            <span>Target: {bottleneck.targetValue}{bottleneck.unit}</span>
          </div>
          {primaryAction && (
            <button
              onClick={() => onAction?.(primaryAction.action)}
              className="mt-3 px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-500 transition-colors"
            >
              {primaryAction.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
