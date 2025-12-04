import { cn } from '@axira/shared/utils';

interface GuardianHeaderProps {
  userName: string;
  greeting?: string;
  className?: string;
}

export function GuardianHeader({
  userName,
  greeting,
  className,
}: GuardianHeaderProps) {
  const timeOfDay = getTimeOfDay();
  const defaultGreeting = `Good ${timeOfDay}, ${userName}. Here's what needs your attention.`;

  return (
    <div className={cn('space-y-1', className)}>
      <h1 className="text-2xl font-semibold text-white">
        {greeting || defaultGreeting}
      </h1>
      <p className="text-gray-400">
        {formatDate(new Date())}
      </p>
    </div>
  );
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
