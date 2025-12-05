import { useState } from 'react';
import { Badge, Button, Card } from '@axira/shared/components';
import { cn } from '@axira/shared/utils';

// ============================================================================
// Types
// ============================================================================

export type ScheduledTaskStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
export type OutputAction = 'NOTIFY' | 'STORE' | 'BOTH';

export interface ScheduledTask {
  id: string;
  tenantId: string;
  capabilityKey: string;
  capabilityDomain?: string;
  capabilityName?: string;
  parameters?: Record<string, unknown>;
  subjectKey?: string;
  subjectName?: string;
  cronExpression: string;
  cronHumanReadable?: string;
  timezone: string;
  nextRunAt?: string;
  lastRunAt?: string;
  lastRunStatus?: string;
  outputAction: OutputAction;
  notificationChannel?: string;
  status: ScheduledTaskStatus;
  createdAt: string;
  sourceConversationId?: string;
}

interface ScheduledTasksListProps {
  tasks: ScheduledTask[];
  isLoading?: boolean;
  onPause?: (taskId: string) => void;
  onResume?: (taskId: string) => void;
  onCancel?: (taskId: string) => void;
  onViewDetails?: (task: ScheduledTask) => void;
  className?: string;
}

// ============================================================================
// Main Component
// ============================================================================

export function ScheduledTasksList({
  tasks,
  isLoading = false,
  onPause,
  onResume,
  onCancel,
  onViewDetails,
  className,
}: ScheduledTasksListProps) {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className={cn('space-y-3', className)}>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 bg-gray-900 border border-gray-800 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-700 rounded w-1/2" />
          </Card>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card className={cn('p-6 bg-gray-900 border border-gray-800 text-center', className)}>
        <ClockIcon className="w-12 h-12 mx-auto text-gray-600 mb-3" />
        <h3 className="text-lg font-medium text-gray-300 mb-1">No scheduled tasks</h3>
        <p className="text-sm text-gray-500">
          Say "Schedule this for every Monday" in chat to create a recurring task
        </p>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {tasks.map((task) => (
        <ScheduledTaskCard
          key={task.id}
          task={task}
          isExpanded={expandedTaskId === task.id}
          onToggleExpand={() => setExpandedTaskId(
            expandedTaskId === task.id ? null : task.id
          )}
          onPause={onPause}
          onResume={onResume}
          onCancel={onCancel}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}

// ============================================================================
// Task Card Component
// ============================================================================

interface ScheduledTaskCardProps {
  task: ScheduledTask;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onPause?: (taskId: string) => void;
  onResume?: (taskId: string) => void;
  onCancel?: (taskId: string) => void;
  onViewDetails?: (task: ScheduledTask) => void;
}

function ScheduledTaskCard({
  task,
  isExpanded,
  onToggleExpand,
  onPause,
  onResume,
  onCancel,
  onViewDetails,
}: ScheduledTaskCardProps) {
  const statusConfig = getStatusConfig(task.status);

  return (
    <Card className="bg-gray-900 border border-gray-800 overflow-hidden">
      {/* Main row */}
      <button
        type="button"
        onClick={onToggleExpand}
        className="w-full p-4 flex items-center gap-3 text-left hover:bg-gray-800/50 transition-colors"
        aria-expanded={isExpanded}
      >
        {/* Status indicator */}
        <div className={cn('w-2 h-2 rounded-full', statusConfig.dotColor)} />

        {/* Task info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-200 truncate">
              {task.capabilityName || task.capabilityKey}
            </span>
            {task.capabilityDomain && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-gray-600 text-gray-400">
                {task.capabilityDomain}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>{task.cronHumanReadable || task.cronExpression}</span>
            {task.subjectName && (
              <>
                <span className="text-gray-600">·</span>
                <span>{task.subjectName}</span>
              </>
            )}
          </div>
        </div>

        {/* Status badge */}
        <Badge variant={statusConfig.variant} className="text-[10px] px-2 py-0.5">
          {task.status}
        </Badge>

        {/* Expand chevron */}
        <ChevronIcon
          className={cn(
            'w-4 h-4 text-gray-500 transition-transform',
            isExpanded && 'rotate-180'
          )}
        />
      </button>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t border-gray-800 space-y-3">
          {/* Next run */}
          {task.nextRunAt && task.status === 'ACTIVE' && (
            <div className="flex items-center gap-2 text-sm">
              <ClockIcon className="w-4 h-4 text-blue-400" />
              <span className="text-gray-400">Next run:</span>
              <span className="text-gray-200">{formatDateTime(task.nextRunAt)}</span>
              <span className="text-gray-500">({task.timezone})</span>
            </div>
          )}

          {/* Last run */}
          {task.lastRunAt && (
            <div className="flex items-center gap-2 text-sm">
              <HistoryIcon className="w-4 h-4 text-gray-500" />
              <span className="text-gray-400">Last run:</span>
              <span className="text-gray-200">{formatDateTime(task.lastRunAt)}</span>
              {task.lastRunStatus && (
                <Badge
                  variant={task.lastRunStatus === 'SUCCESS' ? 'default' : 'destructive'}
                  className="text-[9px] px-1.5 py-0"
                >
                  {task.lastRunStatus}
                </Badge>
              )}
            </div>
          )}

          {/* Output action */}
          <div className="flex items-center gap-2 text-sm">
            <BellIcon className="w-4 h-4 text-gray-500" />
            <span className="text-gray-400">Output:</span>
            <span className="text-gray-200">
              {task.outputAction === 'NOTIFY' && 'Notification'}
              {task.outputAction === 'STORE' && 'Store only'}
              {task.outputAction === 'BOTH' && 'Notification + Store'}
            </span>
            {task.notificationChannel && (
              <span className="text-gray-500">({task.notificationChannel})</span>
            )}
          </div>

          {/* Parameters preview */}
          {task.parameters && Object.keys(task.parameters).length > 0 && (
            <div className="text-sm">
              <span className="text-gray-400">Parameters: </span>
              <span className="text-gray-500 font-mono text-xs">
                {JSON.stringify(task.parameters).slice(0, 50)}
                {JSON.stringify(task.parameters).length > 50 && '...'}
              </span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-2">
            {task.status === 'ACTIVE' && onPause && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPause(task.id)}
                className="text-xs h-7 px-3 border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <PauseIcon className="w-3 h-3 mr-1" />
                Pause
              </Button>
            )}
            {task.status === 'PAUSED' && onResume && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onResume(task.id)}
                className="text-xs h-7 px-3 border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <PlayIcon className="w-3 h-3 mr-1" />
                Resume
              </Button>
            )}
            {(task.status === 'ACTIVE' || task.status === 'PAUSED') && onCancel && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCancel(task.id)}
                className="text-xs h-7 px-3 border-gray-700 text-red-400 hover:bg-red-900/20"
              >
                <XIcon className="w-3 h-3 mr-1" />
                Cancel
              </Button>
            )}
            {onViewDetails && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewDetails(task)}
                className="text-xs h-7 px-3 text-gray-400 hover:text-gray-200 ml-auto"
              >
                View details
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

// ============================================================================
// Helper functions
// ============================================================================

type StatusConfig = {
  dotColor: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
};

function getStatusConfig(status: ScheduledTaskStatus): StatusConfig {
  switch (status) {
    case 'ACTIVE':
      return { dotColor: 'bg-green-500', variant: 'default' };
    case 'PAUSED':
      return { dotColor: 'bg-yellow-500', variant: 'secondary' };
    case 'COMPLETED':
      return { dotColor: 'bg-blue-500', variant: 'outline' };
    case 'FAILED':
      return { dotColor: 'bg-red-500', variant: 'destructive' };
    case 'CANCELLED':
      return { dotColor: 'bg-gray-500', variant: 'outline' };
    default:
      return { dotColor: 'bg-gray-500', variant: 'outline' };
  }
}

function formatDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return isoString;
  }
}

// ============================================================================
// Icons
// ============================================================================

function ClockIcon({ className }: { className?: string }) {
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
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
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
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function HistoryIcon({ className }: { className?: string }) {
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
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
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
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
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

function PauseIcon({ className }: { className?: string }) {
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
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
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
      <polygon points="5 3 19 12 5 21 5 3" />
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
