import { useState } from 'react';
import { Badge, Skeleton } from '@axira/shared/components';
import { cn } from '@axira/shared/utils';
import type { PlanningState, SkillExecution } from '../types';

interface PlanningIndicatorProps {
  planningState: PlanningState | null;
  skillsExecuted: SkillExecution[];
  isStreaming: boolean;
  className?: string;
}

export function PlanningIndicator({
  planningState,
  skillsExecuted,
  isStreaming,
  className,
}: PlanningIndicatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isStreaming && !planningState && skillsExecuted.length === 0) {
    return null;
  }

  const currentAgent = planningState?.businessAgentName || planningState?.businessAgentId;
  const currentProcess = planningState?.processAgentName || planningState?.processAgentKey;
  const stage = planningState?.stage;

  return (
    <div className={cn('space-y-2', className)}>
      {/* Compact view */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors text-left"
        aria-expanded={isExpanded}
        aria-label="Toggle planning details"
      >
        {isStreaming && (
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-blue-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
          </span>
        )}

        <span className="flex-1 text-sm text-gray-400">
          {isStreaming ? (
            <>
              {currentAgent && (
                <span className="font-medium text-gray-200">{currentAgent}</span>
              )}
              {currentProcess && (
                <span className="text-gray-400">
                  {' '}via {currentProcess}
                </span>
              )}
              {stage && (
                <span className="text-gray-500 italic"> - {stage}</span>
              )}
              {!currentAgent && !currentProcess && 'Processing...'}
            </>
          ) : (
            `Executed ${skillsExecuted.length} skill${skillsExecuted.length !== 1 ? 's' : ''}`
          )}
        </span>

        <ChevronIcon
          className={cn(
            'h-4 w-4 text-gray-500 transition-transform',
            isExpanded && 'rotate-180'
          )}
        />
      </button>

      {/* Expanded details */}
      {isExpanded && (
        <div className="ml-4 space-y-1.5 border-l-2 border-gray-700 pl-3">
          {planningState?.summary && (
            <p className="text-xs text-gray-400">{planningState.summary}</p>
          )}

          {skillsExecuted.length > 0 && (
            <div className="space-y-1">
              <span className="text-xs font-medium text-gray-400">Skills:</span>
              {skillsExecuted.map((skill) => (
                <SkillExecutionItem key={skill.skillId} skill={skill} />
              ))}
            </div>
          )}

          {isStreaming && skillsExecuted.length === 0 && (
            <div className="space-y-1">
              <Skeleton className="h-4 w-32 bg-gray-700" />
              <Skeleton className="h-4 w-24 bg-gray-700" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface SkillExecutionItemProps {
  skill: SkillExecution;
}

function SkillExecutionItem({ skill }: SkillExecutionItemProps) {
  const statusConfig = getStatusConfig(skill.status);

  return (
    <div className="flex items-center gap-2 text-xs">
      <statusConfig.icon className={cn('h-3.5 w-3.5', statusConfig.iconClass)} />
      <span className="font-medium text-gray-300">{skill.skillName || skill.skillId}</span>
      <Badge variant={statusConfig.variant} className="text-[10px] px-1.5 py-0">
        {skill.status}
      </Badge>
      {skill.durationMs != null && (
        <span className="text-gray-500">{skill.durationMs}ms</span>
      )}
    </div>
  );
}

type StatusConfig = {
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
};

function getStatusConfig(status: string): StatusConfig {
  switch (status) {
    case 'SUCCESS':
      return { icon: CheckIcon, iconClass: 'text-green-400', variant: 'default' };
    case 'RUNNING':
      return { icon: SpinnerIcon, iconClass: 'text-blue-400 animate-spin', variant: 'secondary' };
    case 'FAILED':
      return { icon: XIcon, iconClass: 'text-red-400', variant: 'destructive' };
    default:
      return { icon: CircleIcon, iconClass: 'text-gray-500', variant: 'outline' };
  }
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function CircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}
