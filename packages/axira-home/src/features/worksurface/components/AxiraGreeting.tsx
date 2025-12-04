import { cn } from '@axira/shared/utils';
import type { ContextualGreeting } from '../types';

interface AxiraGreetingProps {
  greeting: ContextualGreeting;
  className?: string;
}

/**
 * Contextual greeting from Axira - conversational, aware of user's day.
 * Feels like a colleague checking in, not a system message.
 */
export function AxiraGreeting({ greeting, className }: AxiraGreetingProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {/* Primary greeting - large, warm */}
      <h1 className="text-3xl font-light text-white tracking-tight">
        {greeting.greeting}
      </h1>

      {/* Context line - what Axira knows about their day */}
      {(greeting.context || greeting.readyLine) && (
        <p className="text-lg text-gray-400 font-light leading-relaxed max-w-2xl">
          {greeting.context}
          {greeting.context && greeting.readyLine && ' '}
          {greeting.readyLine}
        </p>
      )}
    </div>
  );
}
