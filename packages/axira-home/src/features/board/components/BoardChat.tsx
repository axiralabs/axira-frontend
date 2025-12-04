import { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '@axira/shared/utils';
import type {
  BoardMessage,
  BoardStructuredResponse,
  BoardPlanningContext,
  BoardSummaryItem,
  BoardCitation,
  BoardAction,
  AuditTrail,
} from '../types';
import { SOURCE_SYSTEM_CONFIG } from '../types';

interface BoardChatProps {
  messages: BoardMessage[];
  onSendMessage: (message: string) => void;
  onActionClick?: (action: BoardAction, message: BoardMessage) => void;
  onOpenEvidence?: (message: BoardMessage) => void;
  isLoading?: boolean;
  className?: string;
}

export function BoardChat({
  messages,
  onSendMessage,
  onActionClick,
  onOpenEvidence,
  isLoading,
  className,
}: BoardChatProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputValue.trim() || isLoading) return;
      onSendMessage(inputValue.trim());
      setInputValue('');
    },
    [inputValue, isLoading, onSendMessage]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit]
  );

  // Suggested questions for empty state
  const suggestedQuestions = [
    "What's our risk exposure across all branches?",
    "Where should we focus investment next year?",
    "How is our compliance trending?",
    "Which branches need attention?",
  ];

  return (
    <div className={cn('flex flex-col h-full rounded-xl border border-gray-700 bg-gray-800/50 overflow-hidden', className)}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-blue-400" />
            Ask Axira
          </h3>
          <p className="text-sm text-gray-400">Strategic intelligence at your fingertips</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <ShieldCheckIcon className="w-4 h-4 text-green-500" />
          Auditable
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <EmptyState
            questions={suggestedQuestions}
            onQuestionClick={onSendMessage}
          />
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onActionClick={(action) => onActionClick?.(action, message)}
              onOpenEvidence={() => onOpenEvidence?.(message)}
            />
          ))
        )}

        {/* Loading indicator */}
        {isLoading && <LoadingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
        <div className="relative">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about risk, compliance, or strategy..."
            rows={1}
            className={cn(
              'w-full px-4 py-3 pr-12 rounded-lg resize-none',
              'bg-gray-900 border border-gray-600 text-white placeholder-gray-500',
              'focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg',
              'text-gray-400 hover:text-white hover:bg-gray-700',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-colors'
            )}
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Every response is backed by auditable evidence from your systems
        </p>
      </form>
    </div>
  );
}

// Empty State with suggested questions
function EmptyState({
  questions,
  onQuestionClick,
}: {
  questions: string[];
  onQuestionClick: (q: string) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-8">
      <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
        <SparklesIcon className="w-8 h-8 text-blue-400" />
      </div>
      <h4 className="text-lg font-medium text-white mb-2">What would you like to know?</h4>
      <p className="text-gray-400 text-center max-w-md mb-6">
        Ask me anything about your bank's operations, risk, compliance, or strategy.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
        {questions.map((q) => (
          <button
            key={q}
            onClick={() => onQuestionClick(q)}
            className={cn(
              'px-4 py-3 rounded-lg text-left text-sm',
              'bg-gray-700/50 border border-gray-600 text-gray-300',
              'hover:bg-gray-700 hover:border-gray-500 transition-colors'
            )}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

// Message Bubble
interface MessageBubbleProps {
  message: BoardMessage;
  onActionClick?: (action: BoardAction) => void;
  onOpenEvidence?: () => void;
}

function MessageBubble({ message, onActionClick, onOpenEvidence }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div className={cn('max-w-[85%]', isUser ? 'order-2' : 'order-1')}>
        {/* Avatar */}
        {!isUser && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <AxiraLogoIcon className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-gray-400">Axira</span>
          </div>
        )}

        {/* Message Content */}
        <div
          className={cn(
            'rounded-2xl px-4 py-3',
            isUser
              ? 'bg-blue-600 text-white rounded-br-md'
              : 'bg-gray-700/50 text-gray-100 rounded-bl-md'
          )}
        >
          <p className="text-sm">{message.content}</p>
        </div>

        {/* Planning Indicator */}
        {!isUser && message.planningContext && (
          <PlanningIndicator context={message.planningContext} className="mt-3" />
        )}

        {/* Structured Response */}
        {!isUser && message.structuredResponse && (
          <StructuredResponseCard
            response={message.structuredResponse}
            onActionClick={onActionClick}
            onOpenEvidence={onOpenEvidence}
            className="mt-3"
          />
        )}

        {/* Timestamp */}
        <p className={cn('text-xs text-gray-500 mt-1', isUser ? 'text-right' : 'text-left')}>
          {formatTimestamp(message.timestamp)}
        </p>
      </div>
    </div>
  );
}

// Planning Indicator - Shows which agents/skills are running
interface PlanningIndicatorProps {
  context: BoardPlanningContext;
  className?: string;
}

function PlanningIndicator({ context, className }: PlanningIndicatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={cn('rounded-lg bg-gray-800/50 border border-gray-700 overflow-hidden', className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2 flex items-center justify-between text-left hover:bg-gray-700/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <CpuIcon className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-gray-300">
            {context.isPlanning ? 'Processing...' : 'Analysis Complete'}
          </span>
          <span className="text-xs text-gray-500">
            {context.stepsCompleted}/{context.totalSteps} steps
          </span>
        </div>
        <ChevronIcon className={cn('w-4 h-4 text-gray-500 transition-transform', isExpanded && 'rotate-180')} />
      </button>

      {isExpanded && (
        <div className="px-3 pb-3 space-y-2">
          {context.steps.map((step) => (
            <div key={step.id} className="flex items-center gap-3 text-sm">
              <StepStatusIcon status={step.status} />
              <div className="flex-1 min-w-0">
                <p className="text-gray-300 truncate">{step.name}</p>
                <p className="text-xs text-gray-500">{step.agentName}</p>
              </div>
              {step.durationMs && (
                <span className="text-xs text-gray-500">{step.durationMs}ms</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StepStatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'COMPLETED':
      return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
    case 'RUNNING':
      return <SpinnerIcon className="w-4 h-4 text-blue-400 animate-spin" />;
    case 'FAILED':
      return <XCircleIcon className="w-4 h-4 text-red-500" />;
    default:
      return <CircleIcon className="w-4 h-4 text-gray-500" />;
  }
}

// Structured Response Card
interface StructuredResponseCardProps {
  response: BoardStructuredResponse;
  onActionClick?: (action: BoardAction) => void;
  onOpenEvidence?: () => void;
  className?: string;
}

function StructuredResponseCard({ response, onActionClick, onOpenEvidence, className }: StructuredResponseCardProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Summary Items */}
      <div className="rounded-lg bg-gray-800/50 border border-gray-700 p-4 space-y-3">
        {response.summaryItems.map((item) => (
          <SummaryItemRow key={item.id} item={item} />
        ))}
      </div>

      {/* Citations */}
      {response.citations.length > 0 && (
        <div className="rounded-lg bg-gray-800/30 border border-gray-700/50 p-3">
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <DatabaseIcon className="w-3.5 h-3.5" />
            Sources
          </p>
          <div className="flex flex-wrap gap-2">
            {response.citations.map((citation) => (
              <CitationBadge key={citation.id} citation={citation} />
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {response.availableActions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {response.availableActions.map((action) => (
            <button
              key={action.id}
              onClick={() => {
                if (action.actionType === 'OPEN_EVIDENCE') {
                  onOpenEvidence?.();
                } else {
                  onActionClick?.(action);
                }
              }}
              className={cn(
                'px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2',
                action.primary
                  ? 'bg-blue-600 text-white hover:bg-blue-500'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              )}
            >
              <ActionIcon type={action.actionType} />
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Summary Item Row with status badge
function SummaryItemRow({ item, depth = 0 }: { item: BoardSummaryItem; depth?: number }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasSubItems = item.subItems && item.subItems.length > 0;

  return (
    <div className={cn(depth > 0 && 'ml-6 mt-2')}>
      <div className="flex items-start gap-3">
        <StatusBadge status={item.status} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-200">{item.title}</p>
            {item.metric && (
              <span className={cn(
                'text-sm font-semibold',
                item.metric.trend === 'UP' && 'text-green-400',
                item.metric.trend === 'DOWN' && 'text-red-400',
                !item.metric.trend && 'text-gray-300'
              )}>
                {item.metric.value}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400">{item.message}</p>
          {item.details && <p className="text-xs text-gray-500 mt-0.5">{item.details}</p>}
          {item.metric?.trendValue && (
            <p className="text-xs text-gray-500 mt-0.5">{item.metric.trendValue}</p>
          )}
        </div>
        {hasSubItems && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-500 hover:text-gray-300"
          >
            <ChevronIcon className={cn('w-4 h-4 transition-transform', isExpanded && 'rotate-180')} />
          </button>
        )}
      </div>
      {hasSubItems && isExpanded && (
        <div className="mt-2 space-y-2">
          {item.subItems!.map((subItem) => (
            <SummaryItemRow key={subItem.id} item={subItem} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

// Status Badge
function StatusBadge({ status }: { status: BoardSummaryItem['status'] }) {
  const config: Record<string, { icon: React.ReactNode; className: string }> = {
    PASS: { icon: <CheckIcon className="w-3.5 h-3.5" />, className: 'bg-green-900/50 text-green-400 border-green-700' },
    WARNING: { icon: <AlertIcon className="w-3.5 h-3.5" />, className: 'bg-amber-900/50 text-amber-400 border-amber-700' },
    FAIL: { icon: <XIcon className="w-3.5 h-3.5" />, className: 'bg-red-900/50 text-red-400 border-red-700' },
    INFO: { icon: <InfoIcon className="w-3.5 h-3.5" />, className: 'bg-blue-900/50 text-blue-400 border-blue-700' },
    DENIED: { icon: <LockIcon className="w-3.5 h-3.5" />, className: 'bg-gray-700 text-gray-400 border-gray-600' },
  };

  const { icon, className } = config[status] || config.INFO;

  return (
    <span className={cn('inline-flex items-center justify-center w-6 h-6 rounded-full border shrink-0', className)}>
      {icon}
    </span>
  );
}

// Citation Badge
function CitationBadge({ citation }: { citation: BoardCitation }) {
  const config = SOURCE_SYSTEM_CONFIG[citation.source];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs',
        'bg-gray-700/50 border border-gray-600 text-gray-300',
        'hover:bg-gray-700 transition-colors cursor-pointer'
      )}
      title={citation.description}
    >
      <SourceIcon system={citation.source} className={cn('w-3.5 h-3.5', config?.color || 'text-gray-400')} />
      {citation.label}
    </span>
  );
}

// Source System Icon
function SourceIcon({ system, className }: { system: string; className?: string }) {
  // Return appropriate icon based on system
  switch (system) {
    case 'SILVERLAKE_CORE':
      return <DatabaseIcon className={className} />;
    case 'SYNERGY_DMS':
      return <FolderIcon className={className} />;
    case 'SHAREPOINT':
      return <FileTextIcon className={className} />;
    case 'LEXISNEXIS':
      return <ShieldIcon className={className} />;
    default:
      return <DatabaseIcon className={className} />;
  }
}

// Action Icon
function ActionIcon({ type }: { type: string }) {
  switch (type) {
    case 'OPEN_EVIDENCE':
      return <SearchIcon className="w-4 h-4" />;
    case 'DRILL_DOWN':
      return <TrendingUpIcon className="w-4 h-4" />;
    case 'DOWNLOAD_REPORT':
      return <DownloadIcon className="w-4 h-4" />;
    case 'SCHEDULE_REVIEW':
      return <CalendarIcon className="w-4 h-4" />;
    default:
      return <ChevronRightIcon className="w-4 h-4" />;
  }
}

// Loading Indicator
function LoadingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <AxiraLogoIcon className="w-4 h-4 text-white" />
      </div>
      <div className="flex items-center gap-2 px-4 py-3 rounded-2xl rounded-bl-md bg-gray-700/50">
        <SpinnerIcon className="w-4 h-4 text-blue-400 animate-spin" />
        <span className="text-sm text-gray-300">Analyzing your data...</span>
      </div>
    </div>
  );
}

// Utility Functions
function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

// Icons
function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3l1.912 5.813L20 10l-6.088 1.187L12 17l-1.912-5.813L4 10l6.088-1.187L12 3z" />
      <path d="M5 3l.586 1.781L7.5 5.5l-1.914.719L5 8l-.586-1.781L2.5 5.5l1.914-.719L5 3z" />
      <path d="M19 17l.586 1.781L21.5 19.5l-1.914.719L19 22l-.586-1.781L16.5 19.5l1.914-.719L19 17z" />
    </svg>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

function AxiraLogoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

function CpuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="M22 4L12 14.01l-3-3" />
    </svg>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function XCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  );
}

function CircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

function DatabaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

function FolderIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function FileTextIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function TrendingUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 6l-9.5 9.5-5-5L1 18" />
      <path d="M17 6h6v6" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
