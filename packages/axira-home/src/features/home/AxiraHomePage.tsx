import { useState, useCallback } from 'react';
import { cn } from '@axira/shared/utils';
import { useChatContext } from '../chat/context';

// Guardian data
import { MOCK_PULSE_ITEMS, MOCK_DAILY_BRIEF, getPulseSummary } from '../guardian/data/mockPulse';
import type { PulseItem, PulseAction, PulsePriority } from '../guardian/types';
import { PRIORITY_STYLES } from '../guardian/types';

/**
 * AxiraHomePage - Fusion of Action + Intelligence
 *
 * Layout:
 * - Top: Greeting + Command bar (action-oriented)
 * - Left: Priority pulse items (proactive intelligence)
 * - Right: Today's context (schedule, quick stats)
 */
export function AxiraHomePage() {
  const { openChat } = useChatContext();
  const [commandValue, setCommandValue] = useState('');

  const summary = getPulseSummary();
  const urgentItems = MOCK_PULSE_ITEMS.filter(i => i.priority === 'URGENT');
  const watchItems = MOCK_PULSE_ITEMS.filter(i => i.priority === 'WATCH').slice(0, 2);
  const brief = MOCK_DAILY_BRIEF;

  // Get time-based greeting
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const handleCommand = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (commandValue.trim()) {
      openChat(commandValue.trim());
      setCommandValue('');
    }
  }, [commandValue, openChat]);

  const handleItemAction = useCallback((action: PulseAction, item: PulseItem) => {
    console.log('Action:', action.actionType, 'Item:', item.id);
    // TODO: Handle action
  }, []);

  return (
    <div className="min-h-full bg-gray-950">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header Section - Greeting + Command */}
        <header className="mb-8">
          <h1 className="text-2xl font-light text-white mb-1">
            {timeGreeting}, Maya
          </h1>
          <p className="text-gray-500 mb-6">
            {formatDate(new Date())}
          </p>

          {/* Command Bar */}
          <form onSubmit={handleCommand} className="max-w-2xl">
            <div className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl',
              'bg-gray-900 border border-gray-800',
              'focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20',
              'transition-all'
            )}>
              <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={commandValue}
                onChange={(e) => setCommandValue(e.target.value)}
                placeholder="Ask Axira anything or search..."
                className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
              />
              <button
                type="button"
                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                </svg>
              </button>
            </div>
          </form>
        </header>

        {/* Summary Pills - Quick status */}
        <div className="flex items-center gap-4 mb-8">
          <SummaryPill count={summary.urgent} label="Urgent" color="red" />
          <SummaryPill count={summary.watch} label="Watch" color="amber" />
          <SummaryPill count={summary.opportunity} label="Opportunities" color="green" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column - Priority Items (2/3) */}
          <div className="lg:col-span-2 space-y-6">

            {/* Urgent Items */}
            {urgentItems.length > 0 && (
              <section>
                <SectionHeader
                  title="Needs Attention"
                  count={urgentItems.length}
                  priority="URGENT"
                />
                <div className="space-y-3 mt-3">
                  {urgentItems.map(item => (
                    <PulseItemCard
                      key={item.id}
                      item={item}
                      onAction={handleItemAction}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Watch Items */}
            {watchItems.length > 0 && (
              <section>
                <SectionHeader
                  title="Coming Up"
                  count={watchItems.length}
                  priority="WATCH"
                />
                <div className="space-y-3 mt-3">
                  {watchItems.map(item => (
                    <PulseItemCard
                      key={item.id}
                      item={item}
                      onAction={handleItemAction}
                      compact
                    />
                  ))}
                </div>
                {MOCK_PULSE_ITEMS.filter(i => i.priority === 'WATCH').length > 2 && (
                  <button className="mt-3 text-sm text-gray-500 hover:text-gray-400 transition-colors">
                    View all watch items →
                  </button>
                )}
              </section>
            )}
          </div>

          {/* Right Column - Context (1/3) */}
          <div className="space-y-6">

            {/* Today's Schedule */}
            <section className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">
                Today's Schedule
              </h3>
              <div className="space-y-3">
                {brief.meetingsToday.slice(0, 4).map(meeting => (
                  <MeetingRow key={meeting.id} meeting={meeting} />
                ))}
              </div>
            </section>

            {/* Quick Insights */}
            <section className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">
                Insights
              </h3>
              <div className="space-y-3">
                {brief.keyInsights.slice(0, 3).map(insight => (
                  <InsightRow key={insight.id} insight={insight} />
                ))}
              </div>
            </section>

            {/* Quick Actions */}
            <section className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <QuickActionButton label="New Account" icon="plus" />
                <QuickActionButton label="QA Review" icon="check" />
                <QuickActionButton label="Documents" icon="doc" />
                <QuickActionButton label="Reports" icon="chart" />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Sub-components ---

function SummaryPill({ count, label, color }: { count: number; label: string; color: 'red' | 'amber' | 'green' }) {
  const colors = {
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
  };

  const dotColors = {
    red: 'bg-red-500',
    amber: 'bg-amber-500',
    green: 'bg-green-500',
  };

  return (
    <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-full border', colors[color])}>
      <span className={cn('w-2 h-2 rounded-full', dotColors[color])} />
      <span className="font-semibold">{count}</span>
      <span className="text-sm opacity-80">{label}</span>
    </div>
  );
}

function SectionHeader({ title, count, priority }: { title: string; count: number; priority: PulsePriority }) {
  const styles = PRIORITY_STYLES[priority];
  return (
    <div className="flex items-center gap-2">
      <div className={cn('w-2 h-2 rounded-full', styles.dot)} />
      <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide">{title}</h2>
      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', styles.badge)}>
        {count}
      </span>
    </div>
  );
}

interface PulseItemCardProps {
  item: PulseItem;
  onAction: (action: PulseAction, item: PulseItem) => void;
  compact?: boolean;
}

function PulseItemCard({ item, onAction, compact }: PulseItemCardProps) {
  const styles = PRIORITY_STYLES[item.priority];
  const primaryAction = item.suggestedActions.find(a => a.primary);

  return (
    <div className={cn(
      'rounded-xl bg-gray-900/50 border overflow-hidden',
      styles.border,
      compact ? 'p-3' : 'p-4'
    )}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', styles.bg)}>
          <PriorityIcon priority={item.priority} className={styles.icon} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className={cn('font-medium text-white', compact && 'text-sm')}>{item.title}</h3>
              {item.subjectName && (
                <p className="text-sm text-blue-400">{item.subjectName}</p>
              )}
            </div>
            {item.daysUntilDue !== undefined && (
              <DueBadge days={item.daysUntilDue} priority={item.priority} />
            )}
          </div>

          <p className={cn('text-gray-400 mt-1', compact ? 'text-xs' : 'text-sm')}>
            {item.summary}
          </p>

          {/* Actions */}
          {primaryAction && !compact && (
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => onAction(primaryAction, item)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-500 transition-colors"
              >
                {primaryAction.label}
              </button>
              {item.suggestedActions.length > 1 && (
                <span className="text-xs text-gray-500">
                  +{item.suggestedActions.length - 1} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PriorityIcon({ priority, className }: { priority: PulsePriority; className?: string }) {
  if (priority === 'URGENT') {
    return (
      <svg className={cn('w-5 h-5', className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    );
  }
  if (priority === 'WATCH') {
    return (
      <svg className={cn('w-5 h-5', className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    );
  }
  return (
    <svg className={cn('w-5 h-5', className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 7l5 5-5 5M6 7l5 5-5 5" />
    </svg>
  );
}

function DueBadge({ days, priority }: { days: number; priority: PulsePriority }) {
  const styles = PRIORITY_STYLES[priority];
  let text: string;
  if (days === 0) text = 'Today';
  else if (days === 1) text = 'Tomorrow';
  else if (days < 0) text = `${Math.abs(days)}d overdue`;
  else if (days <= 7) text = `${days}d`;
  else if (days <= 30) text = `${Math.ceil(days / 7)}w`;
  else text = `${Math.ceil(days / 30)}mo`;

  return (
    <span className={cn('px-2 py-0.5 rounded text-xs font-medium', styles.badge)}>
      {text}
    </span>
  );
}

function MeetingRow({ meeting }: { meeting: typeof MOCK_DAILY_BRIEF.meetingsToday[0] }) {
  const isPast = meeting.time.includes('AM') && new Date().getHours() >= 12;

  return (
    <div className={cn(
      'flex items-center gap-3 py-2',
      isPast && 'opacity-50'
    )}>
      <span className="text-sm text-gray-500 w-16">{meeting.time}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white truncate">{meeting.title}</p>
        {meeting.customerName && (
          <p className="text-xs text-gray-500">{meeting.customerName}</p>
        )}
      </div>
      {meeting.briefingReady && (
        <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">
          Ready
        </span>
      )}
    </div>
  );
}

function InsightRow({ insight }: { insight: typeof MOCK_DAILY_BRIEF.keyInsights[0] }) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-6 h-6 rounded bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18h6M10 22h4M12 2v1M12 5a6 6 0 0 1 6 6c0 2.22-1.21 4.16-3 5.19V17a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-.81C7.21 15.16 6 13.22 6 11a6 6 0 0 1 6-6z" />
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-300">{insight.message}</p>
        {insight.metric && (
          <p className={cn(
            'text-sm font-semibold mt-0.5',
            insight.trend === 'UP' ? 'text-green-400' : insight.trend === 'DOWN' ? 'text-red-400' : 'text-blue-400'
          )}>
            {insight.metric}
          </p>
        )}
      </div>
    </div>
  );
}

function QuickActionButton({ label, icon }: { label: string; icon: string }) {
  const icons: Record<string, JSX.Element> = {
    plus: <path d="M12 5v14m-7-7h14" />,
    check: <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />,
    doc: <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    chart: <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>,
  };

  return (
    <button className={cn(
      'flex items-center gap-2 px-3 py-2 rounded-lg',
      'bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50',
      'text-sm text-gray-300 hover:text-white',
      'transition-colors'
    )}>
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {icons[icon]}
      </svg>
      {label}
    </button>
  );
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default AxiraHomePage;
