import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@axira/shared/hooks';
import { Button, Card } from '@axira/shared/components';
import { AxiraLogoInline } from '../../components/AxiraLogo';
import { useChatContext } from '../chat/context';

export function HomePage() {
  const { user } = useAuth();
  const { openChat } = useChatContext();
  const [searchQuery, setSearchQuery] = useState('');

  const greeting = getGreeting();
  const firstName = user?.displayName?.split(' ')[0] || 'Maya';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Open chat sidebar with the query
      openChat(searchQuery.trim());
      setSearchQuery('');
    }
  };

  const handleQuickAction = (query: string) => {
    openChat(query);
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      {/* Greeting */}
      <h1 className="text-4xl font-semibold text-center text-white mb-8">
        {greeting}, {firstName}
      </h1>

      {/* Ask Axira Search Bar */}
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-4">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <AxiraLogoInline />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ask Axira"
            className="w-full h-14 pl-14 pr-14 text-lg bg-gray-900 border-2 border-gray-700 text-white placeholder-gray-500 rounded-full focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            <MicIcon className="w-6 h-6" />
          </button>
        </div>
      </form>

      {/* Quick Action Pills */}
      <div className="flex justify-center gap-3 mb-10">
        <QuickActionPill onClick={() => handleQuickAction('What changed since yesterday?')}>
          What changed since yesterday?
        </QuickActionPill>
        <QuickActionPill onClick={() => handleQuickAction('Prep for my next meeting')}>
          Prep for my next meeting
        </QuickActionPill>
        <QuickActionPill onClick={() => handleQuickAction('Show pending QA checks')}>
          Show pending QA checks
        </QuickActionPill>
      </div>

      {/* Glance Cards */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Yesterday at a glance */}
        <Card className="p-6 bg-blue-900/30 border border-blue-800/50">
          <h2 className="text-lg font-semibold text-center text-white mb-4">
            Yesterday at a glance
          </h2>
          <div className="space-y-3">
            <GlanceItem icon={<CheckCircleIcon className="text-green-400" />}>
              Closed 6 account opening checks
            </GlanceItem>
            <GlanceItem icon={<DocumentIcon className="text-blue-400" />}>
              Reviewed 2 CIP exceptions
            </GlanceItem>
            <GlanceItem icon={<AlertIcon className="text-orange-400" />}>
              Resolved 1 document incident
            </GlanceItem>
          </div>
        </Card>

        {/* Today at a glance */}
        <Card className="p-6 bg-amber-900/30 border border-amber-800/50">
          <h2 className="text-lg font-semibold text-center text-white mb-4">
            Today at a glance
          </h2>
          <div className="space-y-3">
            <GlanceItem icon={<CalendarIcon className="text-blue-400" />}>
              3 customer appointments
            </GlanceItem>
            <GlanceItem icon={<WarningIcon className="text-amber-400" />}>
              4 QA checks due
            </GlanceItem>
            <GlanceItem icon={<AlertCircleIcon className="text-red-400" />}>
              1 incident awaiting follow-up
            </GlanceItem>
          </div>
        </Card>
      </div>

      {/* Start next best action button */}
      <div className="text-center mb-2">
        <Button
          onClick={() => handleQuickAction('What should I work on next?')}
          className="px-8 py-3 text-base font-medium bg-gradient-to-r from-cyan-400 via-green-400 via-yellow-400 via-pink-400 to-purple-400 text-white rounded-full hover:opacity-90 transition-opacity"
        >
          Start next best action
        </Button>
      </div>
      <p className="text-center text-xs text-gray-500 mb-10">Powered by Axira Agents</p>

      {/* Bottom sections */}
      <div className="grid grid-cols-3 gap-8">
        {/* Work Queue */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Work Queue</h3>
            <Link to="/work" className="text-sm text-blue-400 hover:text-blue-300">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            <WorkQueueItem label="CIP review cases" status="Open" />
            <WorkQueueItem label="Document incidents" status="Open" />
            <WorkQueueItem label="New messages" />
          </div>
        </div>

        {/* Today's meetings */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Today's meetings</h3>
          <div className="space-y-3">
            <MeetingItem time="10:00 AM" title="New business account" action="Prep" />
            <MeetingItem time="11:30 AM" title="Minor account review" action="View insights" />
            <MeetingItem time="3:00 PM" title="Loan application discussion" />
          </div>
        </div>

        {/* Next meeting briefing */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Next meeting briefing</h3>
          <Card className="p-4 bg-gray-900 border border-gray-800">
            <h4 className="font-semibold text-white">Martinez LLC</h4>
            <p className="text-sm text-blue-400 mt-1">KYC risk  medium</p>
            <p className="text-sm text-gray-400 mt-2">Ask about new financing needs</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function QuickActionPill({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 text-sm text-gray-300 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
    >
      {children}
    </button>
  );
}

function GlanceItem({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-5 h-5 flex-shrink-0">{icon}</span>
      <span className="text-sm text-gray-300">{children}</span>
    </div>
  );
}

function WorkQueueItem({ label, status }: { label: string; status?: string }) {
  return (
    <div className="flex items-center gap-3">
      <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-gray-800" />
      <span className="text-sm text-gray-300 flex-1">{label}</span>
      {status && (
        <span className="text-sm text-blue-400 font-medium">{status}</span>
      )}
    </div>
  );
}

function MeetingItem({ time, title, action }: { time: string; title: string; action?: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-500 w-20">{time}</span>
      <span className="text-sm text-gray-300 flex-1">{title}</span>
      {action && (
        <Button variant="outline" size="sm" className="text-xs h-7 px-3 rounded-full border-gray-700 text-gray-300 hover:bg-gray-800">
          {action}
        </Button>
      )}
    </div>
  );
}

// Icons
function MicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
    </svg>
  );
}

function AlertCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </svg>
  );
}
