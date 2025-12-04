import { useState, useRef, useCallback } from 'react';
import { cn } from '@axira/shared/utils';
import type { QuickAction } from '../types';

interface CommandInputProps {
  onSubmit?: (message: string) => void;
  quickActions?: QuickAction[];
  onQuickAction?: (action: QuickAction) => void;
  placeholder?: string;
  isProcessing?: boolean;
  className?: string;
}

/**
 * Central conversational input - the primary way to interact with Axira.
 * Clean, focused, inviting.
 */
export function CommandInput({
  onSubmit,
  quickActions = [],
  onQuickAction,
  placeholder = 'What would you like to work on?',
  isProcessing = false,
  className,
}: CommandInputProps) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(() => {
    if (message.trim() && !isProcessing) {
      onSubmit?.(message.trim());
      setMessage('');
    }
  }, [message, isProcessing, onSubmit]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  return (
    <div className={cn('w-full max-w-2xl', className)}>
      {/* Main input container */}
      <div
        className={cn(
          'relative rounded-2xl transition-all duration-200',
          'bg-gray-900/80 backdrop-blur-sm',
          'border',
          isFocused
            ? 'border-blue-500/50 shadow-lg shadow-blue-500/10'
            : 'border-gray-700/50 hover:border-gray-600'
        )}
      >
        <div className="flex items-center px-5 py-4">
          {/* Input field */}
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={isProcessing}
            className={cn(
              'flex-1 bg-transparent text-base text-white placeholder-gray-500',
              'focus:outline-none',
              isProcessing && 'opacity-50'
            )}
          />

          {/* Voice input button */}
          <button
            type="button"
            className="p-2 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors"
            aria-label="Voice input"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </button>

          {/* Submit button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!message.trim() || isProcessing}
            className={cn(
              'ml-2 p-2 rounded-xl transition-all duration-200',
              message.trim() && !isProcessing
                ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-500/10'
                : 'text-gray-600'
            )}
            aria-label="Send"
          >
            {isProcessing ? (
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Quick actions - subtle suggestions */}
      {quickActions.length > 0 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <span className="text-sm text-gray-600">Quick:</span>
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => onQuickAction?.(action)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm',
                'text-gray-400 hover:text-white',
                'bg-gray-800/50 hover:bg-gray-800',
                'border border-gray-700/50 hover:border-gray-600',
                'transition-all duration-150'
              )}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
