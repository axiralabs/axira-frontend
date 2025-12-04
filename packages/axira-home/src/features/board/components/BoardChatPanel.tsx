import { useState, useCallback } from 'react';
import { cn } from '@axira/shared/utils';
import { PromptTemplateCard } from '../../chat/components/PromptTemplateCard';
import type { PromptTemplate } from '../../chat/data/promptTemplates';
import { BOARD_PROMPT_TEMPLATES, BOARD_TEMPLATE_CATEGORIES } from '../data/boardPromptTemplates';
import type { BoardMessage, BoardAction, AuditTrail } from '../types';
import {
  MOCK_BOARD_CONVERSATION,
  MOCK_EXPLAIN_CONVERSATION,
  MOCK_STRATEGIC_CONVERSATION,
  createMockAuditTrail,
} from '../data/mockBoardData';

interface BoardChatPanelProps {
  className?: string;
  onOpenEvidence?: (auditTrail: AuditTrail) => void;
}

export function BoardChatPanel({ className, onOpenEvidence }: BoardChatPanelProps) {
  const [messages, setMessages] = useState<BoardMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showTemplates, setShowTemplates] = useState(true);

  // Filter templates by category
  const filteredTemplates = activeCategory === 'all'
    ? BOARD_PROMPT_TEMPLATES
    : BOARD_PROMPT_TEMPLATES.filter(t => t.category === activeCategory);

  // Handle sending a message
  const handleSendMessage = useCallback((content: string) => {
    const userMessage: BoardMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setShowTemplates(false);

    const lowerContent = content.toLowerCase();

    setTimeout(() => {
      let responseMessages: BoardMessage[];

      if (lowerContent.includes('risk') || lowerContent.includes('exposure') || lowerContent.includes('mcallen') || lowerContent.includes('edinburg')) {
        responseMessages = MOCK_BOARD_CONVERSATION;
      } else if (lowerContent.includes('how') && (lowerContent.includes('decide') || lowerContent.includes('determine') || lowerContent.includes('know'))) {
        responseMessages = MOCK_EXPLAIN_CONVERSATION;
      } else if (lowerContent.includes('invest') || lowerContent.includes('focus') || lowerContent.includes('strategy') || lowerContent.includes('next') || lowerContent.includes('priorit')) {
        responseMessages = MOCK_STRATEGIC_CONVERSATION;
      } else {
        responseMessages = MOCK_BOARD_CONVERSATION;
      }

      const assistantResponse = responseMessages.find((m) => m.role === 'assistant');
      if (assistantResponse) {
        const newResponse: BoardMessage = {
          ...assistantResponse,
          id: `msg-${Date.now()}-response`,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, newResponse]);
      }

      setIsLoading(false);
    }, 2500);
  }, []);

  // Handle template selection
  const handleTemplateSelect = useCallback((template: PromptTemplate) => {
    // Replace placeholders with default values
    let prompt = template.template;
    template.placeholders.forEach(p => {
      prompt = prompt.replace(`{${p.key}}`, p.defaultValue || '');
    });
    handleSendMessage(prompt);
  }, [handleSendMessage]);

  // Handle input submit
  const handleSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputValue.trim() && !isLoading) {
      handleSendMessage(inputValue.trim());
      setInputValue('');
    }
  }, [inputValue, isLoading, handleSendMessage]);

  // Handle key press
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  // Handle explain click
  const handleExplainClick = useCallback((message: BoardMessage) => {
    const userQuery = messages.find(m => m.role === 'user')?.content || 'Query';
    const auditTrail = createMockAuditTrail(userQuery);
    onOpenEvidence?.(auditTrail);
  }, [messages, onOpenEvidence]);

  // Clear conversation
  const handleClear = useCallback(() => {
    setMessages([]);
    setShowTemplates(true);
  }, []);

  return (
    <div className={cn('flex flex-col rounded-xl border border-gray-700 bg-gray-800/50 overflow-hidden', className)}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <AxiraIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Ask Axira</h3>
            <p className="text-xs text-gray-500">Strategic Intelligence</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleClear}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px]">
        {messages.length === 0 && showTemplates ? (
          // Show prompt templates when no messages
          <div className="space-y-3">
            {/* Category filters */}
            <div className="flex gap-1 flex-wrap">
              {BOARD_TEMPLATE_CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={cn(
                    'px-2 py-1 rounded text-xs font-medium transition-colors',
                    activeCategory === cat.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Template cards */}
            <div className="space-y-2">
              {filteredTemplates.slice(0, 4).map((template) => (
                <BoardPromptCard
                  key={template.id}
                  template={template}
                  onClick={handleTemplateSelect}
                />
              ))}
            </div>
          </div>
        ) : (
          // Show messages
          <>
            {messages.map((message) => (
              <div key={message.id}>
                {message.role === 'user' ? (
                  <UserMessageBubble content={message.content} />
                ) : (
                  <AssistantMessageBubble
                    message={message}
                    onExplainClick={() => handleExplainClick(message)}
                  />
                )}
              </div>
            ))}
            {isLoading && <LoadingIndicator />}
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a strategic question..."
            disabled={isLoading}
            className={cn(
              'flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white',
              'placeholder:text-gray-500 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500',
              'disabled:opacity-50'
            )}
            rows={2}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className={cn(
              'px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg self-end',
              'transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <SendIcon className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

// Compact prompt card for board panel
function BoardPromptCard({ template, onClick }: { template: PromptTemplate; onClick: (t: PromptTemplate) => void }) {
  return (
    <button
      onClick={() => onClick(template)}
      className="w-full text-left p-3 bg-gray-900/50 border border-gray-700 rounded-lg hover:border-blue-500/50 hover:bg-gray-800 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', template.iconColor)}>
          <TemplateIcon type={template.icon} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-200">{template.title}</h4>
          <p className="text-xs text-gray-500 truncate">{template.description}</p>
        </div>
      </div>
    </button>
  );
}

// User message bubble
function UserMessageBubble({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] px-4 py-2 bg-blue-600 rounded-2xl rounded-br-md">
        <p className="text-sm text-white">{content}</p>
      </div>
    </div>
  );
}

// Assistant message bubble
function AssistantMessageBubble({ message, onExplainClick }: { message: BoardMessage; onExplainClick: () => void }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
        <AxiraIcon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-gray-900/50 rounded-2xl rounded-tl-md p-4">
          <p className="text-sm text-gray-200 whitespace-pre-wrap">{message.content}</p>

          {/* Structured items */}
          {message.structuredItems && message.structuredItems.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.structuredItems.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <StatusBadge status={item.status} />
                  <span className="text-gray-300">{item.message}</span>
                </div>
              ))}
            </div>
          )}

          {/* Citations */}
          {message.citations && message.citations.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-700">
              <p className="text-xs text-gray-500 mb-2">Sources</p>
              <div className="flex flex-wrap gap-1">
                {message.citations.map((citation, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-gray-700/50 rounded text-xs text-gray-400">
                    {citation.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={onExplainClick}
            className="text-xs text-gray-500 hover:text-blue-400 transition-colors flex items-center gap-1"
          >
            <ExplainIcon className="w-3.5 h-3.5" />
            How did you decide this?
          </button>
        </div>
      </div>
    </div>
  );
}

// Status badge
function StatusBadge({ status }: { status: 'PASS' | 'WARNING' | 'FAIL' | 'DENIED' | 'INFO' }) {
  const styles = {
    PASS: 'bg-green-500/20 text-green-400',
    WARNING: 'bg-yellow-500/20 text-yellow-400',
    FAIL: 'bg-red-500/20 text-red-400',
    DENIED: 'bg-gray-500/20 text-gray-400',
    INFO: 'bg-blue-500/20 text-blue-400',
  };

  const icons = {
    PASS: <CheckIcon className="w-3 h-3" />,
    WARNING: <WarningIcon className="w-3 h-3" />,
    FAIL: <XIcon className="w-3 h-3" />,
    DENIED: <LockIcon className="w-3 h-3" />,
    INFO: <InfoIcon className="w-3 h-3" />,
  };

  return (
    <span className={cn('w-5 h-5 rounded flex items-center justify-center flex-shrink-0', styles[status])}>
      {icons[status]}
    </span>
  );
}

// Loading indicator
function LoadingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <AxiraIcon className="w-4 h-4 text-white" />
      </div>
      <div className="bg-gray-900/50 rounded-2xl rounded-tl-md px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-sm text-gray-400">Analyzing data sources...</span>
        </div>
      </div>
    </div>
  );
}

// Icons
function AxiraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function ExplainIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function TemplateIcon({ type }: { type: PromptTemplate['icon'] }) {
  const className = 'w-4 h-4';

  switch (type) {
    case 'document':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      );
    case 'search':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
    case 'check':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      );
    case 'alert':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      );
    case 'user':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case 'money':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    default:
      return null;
  }
}
