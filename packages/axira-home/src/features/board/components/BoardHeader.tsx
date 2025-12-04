import { cn } from '@axira/shared/utils';

interface BoardHeaderProps {
  userName?: string;
  className?: string;
}

export function BoardHeader({ userName = 'Board Member', className }: BoardHeaderProps) {
  const now = new Date();
  const greeting = getGreeting();
  const formattedDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className={cn('', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">
            {greeting}, {userName}
          </h1>
          <p className="text-gray-400 mt-1">{formattedDate}</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Axira Logo/Badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30">
            <AxiraIcon className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">Guardian Intelligence</span>
          </div>
          {/* Live indicator */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Live Data
          </div>
        </div>
      </div>

      {/* Tagline */}
      <p className="mt-4 text-lg text-gray-300 max-w-3xl">
        Your strategic intelligence dashboard — powered by{' '}
        <span className="text-blue-400">47,000+ operational decisions</span> analyzed this quarter.
      </p>
    </header>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function AxiraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2L2 7L12 12L22 7L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 17L12 22L22 17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 12L12 17L22 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
