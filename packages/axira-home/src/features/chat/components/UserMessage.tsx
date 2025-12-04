import { SimpleAvatar } from '@axira/shared/components';
import { cn } from '@axira/shared/utils';
import type { ChatMessage } from '../types';

interface UserMessageProps {
  message: ChatMessage;
  userName?: string;
  className?: string;
}

export function UserMessage({ message, userName = 'You', className }: UserMessageProps) {
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={cn('flex items-start gap-3 justify-end', className)}>
      <div className="flex-1 max-w-[80%] flex flex-col items-end">
        <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5">
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        <span className="text-xs text-gray-500 mt-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
      <SimpleAvatar fallback={initials} size="sm" className="bg-blue-600 text-white" />
    </div>
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
