import { useEffect, useRef } from 'react';
import { ScrollArea } from '@axira/shared/components';
import { cn } from '@axira/shared/utils';
import type { ChatMessage } from '../types';
import { UserMessage } from './UserMessage';
import { AgentResponse } from './AgentResponse';

interface MessageThreadProps {
  messages: ChatMessage[];
  userName?: string;
  className?: string;
  autoScroll?: boolean;
  onExplainClick?: (evidencePackId: string) => void;
}

export function MessageThread({
  messages,
  userName,
  className,
  autoScroll = true,
  onExplainClick,
}: MessageThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, autoScroll]);

  if (messages.length === 0) {
    return (
      <div className={cn('flex-1 flex items-center justify-center', className)}>
        <EmptyState />
      </div>
    );
  }

  return (
    <ScrollArea ref={scrollAreaRef} className={cn('flex-1', className)}>
      <div className="flex flex-col gap-4 p-4">
        {messages.map((message) => (
          <div key={message.id}>
            {message.role === 'user' ? (
              <UserMessage message={message} userName={userName} />
            ) : (
              <AgentResponse message={message} onExplainClick={onExplainClick} />
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}

function EmptyState() {
  return (
    <div className="text-center p-8 max-w-md">
      <div className="mx-auto w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center mb-4">
        <ChatIcon className="w-6 h-6 text-blue-400" />
      </div>
      <h3 className="text-lg font-medium text-white mb-2">Start a Conversation</h3>
      <p className="text-gray-400 text-sm">
        Ask a question about a customer, account, or any banking inquiry. The assistant will help
        you find the information you need.
      </p>
      <div className="mt-6 space-y-2 text-left">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Try asking
        </p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_PROMPTS.map((prompt, index) => (
            <span
              key={index}
              className="text-xs bg-gray-800 px-2.5 py-1 rounded-full text-gray-400"
            >
              {prompt}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const EXAMPLE_PROMPTS = [
  'Check documents for Garcia household',
  'What accounts need attention?',
  'Show pending QA cases',
];

function ChatIcon({ className }: { className?: string }) {
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
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
