import { useState, useRef, useCallback } from 'react';
import { cn } from '@axira/shared/utils';

interface QuickAskProps {
  onSend?: (message: string) => void;
  onExpand?: () => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
}

export function QuickAsk({
  onSend,
  onExpand,
  placeholder = 'Ask anything...',
  isLoading = false,
  className,
}: QuickAskProps) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(() => {
    if (message.trim() && !isLoading) {
      onSend?.(message.trim());
      setMessage('');
    }
  }, [message, isLoading, onSend]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  return (
    <div className={cn(
      'bg-gray-800/50 rounded-lg border transition-all',
      isFocused ? 'border-blue-500/50 ring-1 ring-blue-500/20' : 'border-gray-700',
      className
    )}>
      <div className="flex items-center gap-2 p-3">
        {/* Search/Chat icon */}
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-700/50 text-gray-400">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={isLoading}
          className={cn(
            'flex-1 bg-transparent text-sm text-white placeholder-gray-500',
            'focus:outline-none',
            isLoading && 'opacity-50'
          )}
        />

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Voice input (visual only for now) */}
          <button
            type="button"
            className="p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-700/50 transition-colors"
            aria-label="Voice input"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </button>

          {/* Expand to full chat */}
          {onExpand && (
            <button
              type="button"
              onClick={onExpand}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-700/50 transition-colors"
              aria-label="Open full chat"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            </button>
          )}

          {/* Send button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!message.trim() || isLoading}
            className={cn(
              'p-2 rounded-lg transition-colors',
              message.trim() && !isLoading
                ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-500/10'
                : 'text-gray-600 cursor-not-allowed'
            )}
            aria-label="Send message"
          >
            {isLoading ? (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="1" />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Quick suggestions (shown when focused and empty) */}
      {isFocused && !message && (
        <div className="border-t border-gray-700 px-3 py-2">
          <div className="flex flex-wrap gap-2">
            <QuickSuggestion
              text="What's urgent today?"
              onClick={() => {
                setMessage("What's urgent today?");
                inputRef.current?.focus();
              }}
            />
            <QuickSuggestion
              text="Prepare for my next meeting"
              onClick={() => {
                setMessage('Prepare for my next meeting');
                inputRef.current?.focus();
              }}
            />
            <QuickSuggestion
              text="Show renewals this week"
              onClick={() => {
                setMessage('Show renewals this week');
                inputRef.current?.focus();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface QuickSuggestionProps {
  text: string;
  onClick: () => void;
}

function QuickSuggestion({ text, onClick }: QuickSuggestionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-2.5 py-1 rounded-full text-xs',
        'bg-gray-700/50 text-gray-400',
        'hover:bg-gray-700 hover:text-gray-300',
        'transition-colors'
      )}
    >
      {text}
    </button>
  );
}
