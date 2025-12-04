import { Card } from '@axira/shared/components';
import { cn } from '@axira/shared/utils';
import type { StructuredResponse, SummaryItem, StatusType } from '../types';

interface StructuredResponseCardProps {
  response: StructuredResponse;
  className?: string;
}

export function StructuredResponseCard({ response, className }: StructuredResponseCardProps) {
  if (!response.summaryItems.length) return null;

  return (
    <Card className={cn('p-4 bg-gray-800/50 border border-gray-700', className)}>
      <div className="space-y-3">
        {response.summaryItems.map((item, index) => (
          <SummaryItemRow key={index} item={item} />
        ))}
      </div>
    </Card>
  );
}

interface SummaryItemRowProps {
  item: SummaryItem;
}

function SummaryItemRow({ item }: SummaryItemRowProps) {
  return (
    <div className="flex items-start gap-3">
      <StatusBadge status={item.status} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-200">{item.message}</p>
        {item.details && (
          <p className="text-xs text-gray-400 mt-0.5">{item.details}</p>
        )}
        {item.resourceRef && (
          <a
            href={item.resourceRef}
            className="text-xs text-blue-400 hover:underline mt-1 inline-block"
            target="_blank"
            rel="noopener noreferrer"
          >
            View resource
          </a>
        )}
      </div>
    </div>
  );
}

interface StatusBadgeProps {
  status: StatusType;
}

const STATUS_CONFIG: Record<StatusType, { icon: React.ReactNode; className: string }> = {
  PASS: {
    icon: <CheckIcon className="h-3.5 w-3.5" />,
    className: 'bg-green-900/50 text-green-400 border-green-700',
  },
  WARNING: {
    icon: <AlertIcon className="h-3.5 w-3.5" />,
    className: 'bg-yellow-900/50 text-yellow-400 border-yellow-700',
  },
  FAIL: {
    icon: <XIcon className="h-3.5 w-3.5" />,
    className: 'bg-red-900/50 text-red-400 border-red-700',
  },
  DENIED: {
    icon: <LockIcon className="h-3.5 w-3.5" />,
    className: 'bg-gray-700 text-gray-400 border-gray-600',
  },
};

function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center w-6 h-6 rounded-full border shrink-0',
        config.className
      )}
      aria-label={status}
    >
      {config.icon}
    </span>
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
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
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
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
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
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
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
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
