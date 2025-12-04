import { useState, useCallback } from 'react';
import { cn } from '@axira/shared/utils';
import { useChatContext } from '../chat/context';

// Maya's QA-specific mock data
const YESTERDAY_GLANCE = [
  { id: 'y1', text: 'Closed 6 account opening checks', status: 'done', icon: 'check' },
  { id: 'y2', text: 'Reviewed 2 CIP exceptions', status: 'review', icon: 'flag' },
  { id: 'y3', text: 'Resolved 1 document incident', status: 'resolved', icon: 'flag' },
];

const TODAY_GLANCE = [
  { id: 't1', text: '3 customer appointments', icon: 'calendar' },
  { id: 't2', text: '4 QA checks due', icon: 'alert' },
  { id: 't3', text: '1 incident awaiting follow-up', icon: 'clock' },
];

const WORK_QUEUE = [
  { id: 'wq1', label: 'CIP review cases', action: 'Open' },
  { id: 'wq2', label: 'Document incidents', action: 'Open' },
  { id: 'wq3', label: 'New messages', action: null },
];

const TODAYS_MEETINGS = [
  { id: 'm1', time: '10:00 AM', title: 'New business account', action: 'Prep' },
  { id: 'm2', time: '11:30 AM', title: 'Minor account review', action: 'View insights' },
  { id: 'm3', time: '3:00 PM', title: 'Loan application discussion', action: null },
];

const NEXT_MEETING = {
  customer: 'Martinez LLC',
  risk: 'KYC risk medium',
  insight: 'Ask about new financing needs',
};

/**
 * QAReviewerHomePage - Maya Chen's Dashboard (Dark Theme)
 */
export function QAReviewerHomePage() {
  const { openChat } = useChatContext();
  const [commandValue, setCommandValue] = useState('');

  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const handleCommand = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (commandValue.trim()) {
      openChat(commandValue.trim());
      setCommandValue('');
    }
  }, [commandValue, openChat]);

  const handleQuickAction = useCallback((query: string) => {
    openChat(query);
  }, [openChat]);

  const quickActions = [
    'What changed since yesterday?',
    'Prep for my next meeting',
    'Show pending QA checks',
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-950">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Greeting */}
        <h1 className="text-3xl font-semibold text-white text-center mb-6">
          {timeGreeting}, Maya
        </h1>

        {/* Ask Axira Command Bar */}
        <div className="max-w-2xl mx-auto mb-4">
          <form onSubmit={handleCommand}>
            <div className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-full',
              'bg-gray-900 border border-gray-700',
              'focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/50',
              'transition-all duration-200'
            )}>
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-orange-400 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <input
                type="text"
                value={commandValue}
                onChange={(e) => setCommandValue(e.target.value)}
                placeholder="Ask Axira"
                className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
              />
              <button type="button" className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                </svg>
              </button>
            </div>
          </form>
        </div>

        {/* Quick Action Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {quickActions.map((action) => (
            <button
              key={action}
              onClick={() => handleQuickAction(action)}
              className={cn(
                'px-4 py-2 rounded-full',
                'bg-gray-900 border border-gray-700',
                'text-sm text-gray-300 hover:text-white hover:border-gray-600 hover:bg-gray-800',
                'transition-all duration-200'
              )}
            >
              {action}
            </button>
          ))}
        </div>

        {/* Yesterday / Today at a glance */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Yesterday */}
          <div className="bg-amber-500/10 rounded-xl p-5 border border-amber-500/20">
            <h3 className="text-lg font-semibold text-white mb-4">Yesterday at a glance</h3>
            <div className="space-y-3">
              {YESTERDAY_GLANCE.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <GlanceIcon type={item.icon} status={item.status} />
                  <span className="text-gray-300">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Today */}
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Today at a glance</h3>
            <div className="space-y-3">
              {TODAY_GLANCE.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <GlanceIcon type={item.icon} />
                  <span className="text-gray-300">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Start next best action button */}
        <div className="flex flex-col items-center mb-8">
          <button
            onClick={() => handleQuickAction('Start next best action')}
            className={cn(
              'px-8 py-3 rounded-full',
              'bg-gradient-to-r from-blue-600 to-purple-600',
              'text-white font-medium',
              'shadow-lg hover:shadow-xl hover:from-blue-500 hover:to-purple-500',
              'transition-all duration-200'
            )}
          >
            Start next best action
          </button>
          <span className="text-xs text-gray-500 mt-2">Powered by Axira Agents</span>
        </div>

        {/* Bottom Three Columns */}
        <div className="grid grid-cols-3 gap-6">
          {/* Work Queue */}
          <div>
            <h3 className="text-base font-semibold text-white mb-3">Work Queue</h3>
            <div className="space-y-2">
              {WORK_QUEUE.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500" />
                  <span className="flex-1 text-gray-300">{item.label}</span>
                  {item.action && (
                    <button className="text-sm text-blue-400 hover:text-blue-300">{item.action}</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Today's meetings */}
          <div>
            <h3 className="text-base font-semibold text-white mb-3">Today's meetings</h3>
            <div className="space-y-2">
              {TODAYS_MEETINGS.map(meeting => (
                <div key={meeting.id} className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 w-20">{meeting.time}</span>
                  <span className="flex-1 text-gray-300">{meeting.title}</span>
                  {meeting.action && (
                    <button className="px-2 py-1 text-xs rounded border border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                      {meeting.action}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Next meeting briefing */}
          <div>
            <h3 className="text-base font-semibold text-white mb-3">Next meeting briefing</h3>
            <div className="space-y-2">
              <p className="font-medium text-white">{NEXT_MEETING.customer}</p>
              <p className="text-sm text-amber-400">{NEXT_MEETING.risk}</p>
              <p className="text-sm text-gray-400">{NEXT_MEETING.insight}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GlanceIcon({ type, status }: { type: string; status?: string }) {
  if (type === 'check' || status === 'done') {
    return (
      <div className="w-6 h-6 rounded flex items-center justify-center bg-green-500/20">
        <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }

  if (type === 'flag' || status === 'review' || status === 'resolved') {
    return (
      <div className="w-6 h-6 rounded flex items-center justify-center bg-orange-500/20">
        <svg className="w-4 h-4 text-orange-400" viewBox="0 0 24 24" fill="currentColor">
          <rect x="8" y="4" width="8" height="16" rx="1" />
        </svg>
      </div>
    );
  }

  if (type === 'calendar') {
    return (
      <div className="w-6 h-6 rounded flex items-center justify-center bg-blue-500/20">
        <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      </div>
    );
  }

  if (type === 'alert') {
    return (
      <div className="w-6 h-6 rounded flex items-center justify-center bg-amber-500/20">
        <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
    );
  }

  if (type === 'clock') {
    return (
      <div className="w-6 h-6 rounded flex items-center justify-center bg-red-500/20">
        <svg className="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      </div>
    );
  }

  return null;
}

export default QAReviewerHomePage;
