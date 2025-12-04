import { cn } from '@axira/shared/utils';
import type { ConversationListItem } from '../types';

interface ConversationItemProps {
  conversation: ConversationListItem;
  isActive: boolean;
  onClick: () => void;
}

export function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
  const formattedDate = formatRelativeTime(conversation.updatedAt);

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-3 rounded-lg transition-colors',
        'hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-ring',
        isActive && 'bg-accent'
      )}
      aria-current={isActive ? 'true' : undefined}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{conversation.subject}</p>
          {conversation.lastMessagePreview && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {conversation.lastMessagePreview}
            </p>
          )}
        </div>
        <span className="text-xs text-muted-foreground shrink-0">{formattedDate}</span>
      </div>
      {conversation.businessAgentKey && (
        <div className="mt-1.5">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-primary/10 text-primary">
            {formatAgentName(conversation.businessAgentKey)}
          </span>
        </div>
      )}
    </button>
  );
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function formatAgentName(agentKey: string): string {
  // Convert kebab-case to Title Case
  return agentKey
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
