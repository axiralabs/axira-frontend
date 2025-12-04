import { useState } from 'react';
import { cn } from '@axira/shared/utils';
import type { TeamWorkload, TeamMember, WorkloadRecommendation } from '../../types/branchManager';
import { WORKLOAD_STYLES } from '../../types/branchManager';

interface TeamWorkloadCardProps {
  workload: TeamWorkload;
  onAction?: (action: string, data?: unknown) => void;
  className?: string;
}

export function TeamWorkloadCard({ workload, onAction, className }: TeamWorkloadCardProps) {
  const [expandedRec, setExpandedRec] = useState<string | null>(null);

  return (
    <div className={cn(
      'rounded-xl bg-gray-900/50 border border-gray-800 overflow-hidden',
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
              Team Workload
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {workload.teamSize} members • {workload.totalPendingItems} pending items
            </p>
          </div>
          <DistributionBadge distribution={workload.distribution} />
        </div>
      </div>

      {/* Team Members */}
      <div className="divide-y divide-gray-800">
        {workload.members.map(member => (
          <TeamMemberRow key={member.id} member={member} avgItems={workload.avgItemsPerBanker} />
        ))}
      </div>

      {/* Recommendations */}
      {workload.recommendations.length > 0 && (
        <div className="border-t border-gray-800 p-4 space-y-3">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Axira Recommendations
          </h4>
          {workload.recommendations.map(rec => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              expanded={expandedRec === rec.id}
              onToggle={() => setExpandedRec(expandedRec === rec.id ? null : rec.id)}
              onAction={onAction}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface TeamMemberRowProps {
  member: TeamMember;
  avgItems: number;
}

function TeamMemberRow({ member, avgItems }: TeamMemberRowProps) {
  const style = WORKLOAD_STYLES[member.workloadStatus];
  const barWidth = Math.min(member.capacityUsed, 150); // Cap at 150% for display

  return (
    <div className="p-3 hover:bg-gray-800/30 transition-colors">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
          'bg-gray-700 text-gray-300'
        )}>
          {member.initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white truncate">{member.name}</span>
              {member.workloadStatus === 'OVERLOADED' && (
                <span className={cn('px-1.5 py-0.5 rounded text-xs font-medium', style.bg, style.text)}>
                  {style.label}
                </span>
              )}
            </div>
            <span className="text-sm text-gray-400">
              {member.pendingItems} items
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-1.5 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all', style.bar)}
                style={{ width: `${barWidth}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 w-8">
              {member.capacityUsed}%
            </span>
          </div>

          {/* Details row */}
          <div className="mt-1 flex items-center gap-3 text-xs text-gray-600">
            <span>{member.role}</span>
            <span>•</span>
            <span>{member.completionRate}% completion</span>
            {member.certifications.length > 0 && (
              <>
                <span>•</span>
                <span className="text-blue-500/70">{member.certifications[0]}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface DistributionBadgeProps {
  distribution: 'EVEN' | 'UNEVEN' | 'CRITICAL';
}

function DistributionBadge({ distribution }: DistributionBadgeProps) {
  const styles = {
    EVEN: 'bg-green-500/10 text-green-400 border-green-500/20',
    UNEVEN: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    CRITICAL: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  const icons = {
    EVEN: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    UNEVEN: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    CRITICAL: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border',
      styles[distribution]
    )}>
      {icons[distribution]}
      {distribution === 'EVEN' ? 'Balanced' : distribution === 'UNEVEN' ? 'Uneven' : 'Critical'}
    </span>
  );
}

interface RecommendationCardProps {
  recommendation: WorkloadRecommendation;
  expanded: boolean;
  onToggle: () => void;
  onAction?: (action: string, data?: unknown) => void;
}

function RecommendationCard({ recommendation, expanded, onToggle, onAction }: RecommendationCardProps) {
  const typeIcons = {
    REDISTRIBUTE: '↔️',
    TRAINING: '📚',
    TERRITORY: '🗺️',
    TEMPORARY_HELP: '👥',
  };

  return (
    <div className={cn(
      'rounded-lg border transition-all',
      expanded ? 'bg-blue-500/5 border-blue-500/20' : 'bg-gray-800/30 border-gray-700/50'
    )}>
      <button
        onClick={onToggle}
        className="w-full p-3 flex items-start gap-3 text-left"
      >
        <span className="text-lg">{typeIcons[recommendation.type]}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white">{recommendation.title}</p>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
            {recommendation.description}
          </p>
        </div>
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
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {expanded && (
        <div className="px-3 pb-3 pt-0 ml-9">
          <p className="text-sm text-gray-400 mb-3">{recommendation.description}</p>

          {recommendation.impact && (
            <div className="mb-3 p-2 rounded bg-gray-800/50">
              <p className="text-xs text-gray-500">Impact:</p>
              <p className="text-sm text-gray-300">{recommendation.impact}</p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => onAction?.(recommendation.primaryAction.action, recommendation)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-500 transition-colors"
            >
              {recommendation.primaryAction.label}
            </button>
            {recommendation.secondaryActions?.map((action, i) => (
              <button
                key={i}
                onClick={() => onAction?.(action.action, recommendation)}
                className="px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
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

// Compact inline view for pulse items
export function TeamWorkloadInline({ workload }: { workload: TeamWorkload }) {
  const overloaded = workload.members.filter(m => m.workloadStatus === 'OVERLOADED');

  return (
    <div className="space-y-2">
      {overloaded.map(member => {
        const style = WORKLOAD_STYLES[member.workloadStatus];
        return (
          <div key={member.id} className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-300">
              {member.initials}
            </div>
            <span className="text-sm text-gray-300">{member.name}</span>
            <span className={cn('px-1.5 py-0.5 rounded text-xs', style.bg, style.text)}>
              {member.pendingItems} items
            </span>
          </div>
        );
      })}
    </div>
  );
}
