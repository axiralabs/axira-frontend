import { cn } from '@axira/shared/utils';
import type { DailyBrief as DailyBriefType, Meeting, BriefInsight } from '../types';

interface DailyBriefProps {
  brief: DailyBriefType;
  onMeetingClick?: (meeting: Meeting) => void;
  className?: string;
}

export function DailyBrief({
  brief,
  onMeetingClick,
  className,
}: DailyBriefProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Today's Schedule */}
      <section className="bg-gray-800/50 rounded-lg border border-gray-700 p-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Today's Schedule
        </h3>
        <div className="space-y-2">
          {brief.meetingsToday.map(meeting => (
            <MeetingRow
              key={meeting.id}
              meeting={meeting}
              isNext={brief.nextMeeting?.id === meeting.id}
              onClick={() => onMeetingClick?.(meeting)}
            />
          ))}
          {brief.meetingsToday.length === 0 && (
            <p className="text-sm text-gray-500 italic">No meetings scheduled</p>
          )}
        </div>
      </section>

      {/* Key Insights */}
      {brief.keyInsights.length > 0 && (
        <section className="bg-gray-800/50 rounded-lg border border-gray-700 p-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Insights
          </h3>
          <div className="space-y-3">
            {brief.keyInsights.map(insight => (
              <InsightRow key={insight.id} insight={insight} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

interface MeetingRowProps {
  meeting: Meeting;
  isNext: boolean;
  onClick?: () => void;
}

function MeetingRow({ meeting, isNext, onClick }: MeetingRowProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors',
        'hover:bg-gray-700/50',
        isNext && 'bg-blue-500/10 ring-1 ring-blue-500/30'
      )}
    >
      {/* Time */}
      <span className={cn(
        'text-sm font-medium w-16 flex-shrink-0',
        isNext ? 'text-blue-400' : 'text-gray-400'
      )}>
        {meeting.time}
      </span>

      {/* Meeting info */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm font-medium truncate',
          isNext ? 'text-white' : 'text-gray-300'
        )}>
          {meeting.title}
        </p>
        {meeting.customerName && (
          <p className="text-xs text-gray-500 truncate">
            {meeting.customerName}
          </p>
        )}
      </div>

      {/* Briefing status */}
      {meeting.briefingReady ? (
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 13l4 4L19 7" />
          </svg>
          Ready
        </span>
      ) : (
        <span className="px-2 py-0.5 rounded-full bg-gray-700 text-gray-400 text-xs">
          No prep
        </span>
      )}
    </button>
  );
}

interface InsightRowProps {
  insight: BriefInsight;
}

function InsightRow({ insight }: InsightRowProps) {
  const trendIcon = {
    UP: (
      <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M7 17l5-5 5 5M7 7l5 5 5-5" />
      </svg>
    ),
    DOWN: (
      <svg className="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M7 7l5 5 5-5M7 17l5-5 5 5" />
      </svg>
    ),
    STABLE: (
      <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14" />
      </svg>
    ),
  };

  return (
    <div className="flex items-start gap-3">
      {/* Lightbulb icon */}
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex-shrink-0">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18h6M10 22h4M12 2v1M12 5a6 6 0 0 1 6 6c0 2.22-1.21 4.16-3 5.19V17a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-.81C7.21 15.16 6 13.22 6 11a6 6 0 0 1 6-6z" />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-300">{insight.message}</p>
        <div className="flex items-center gap-2 mt-1">
          {insight.metric && (
            <span className={cn(
              'text-sm font-semibold',
              insight.trend === 'UP' && 'text-green-400',
              insight.trend === 'DOWN' && 'text-red-400',
              !insight.trend && 'text-blue-400'
            )}>
              {insight.metric}
            </span>
          )}
          {insight.trend && trendIcon[insight.trend]}
          <span className="text-xs text-gray-500">{insight.source}</span>
        </div>
      </div>
    </div>
  );
}
