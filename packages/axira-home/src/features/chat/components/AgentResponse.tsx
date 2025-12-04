import { useState } from 'react';
import { SimpleAvatar, Skeleton } from '@axira/shared/components';
import { cn } from '@axira/shared/utils';
import type { ChatMessage, ActionButton } from '../types';
import { PlanningIndicator } from './PlanningIndicator';
import { StructuredResponseCard } from './StructuredResponseCard';
import { ActionButtonsRow } from './ActionButtonsRow';
import { CitationList } from './CitationList';

interface AgentResponseProps {
  message: ChatMessage;
  onExplainClick?: (evidencePackId: string) => void;
  className?: string;
}

export function AgentResponse({ message, onExplainClick, className }: AgentResponseProps) {
  const isStreaming = message.isStreaming ?? false;
  const hasContent = message.content.length > 0;
  const hasPlanningInfo =
    message.planningState || (message.skillsExecuted && message.skillsExecuted.length > 0);
  const hasStructuredResponse = Boolean(message.structuredResponse);
  const hasCitations = Boolean(message.citations?.length);
  const hasActions = Boolean(message.structuredResponse?.availableActions?.length);

  const handleActionClick = (action: ActionButton) => {
    // Handle action based on type
    console.log('Action clicked:', action);
    // TODO: Implement action handlers
  };

  const handleExplainClick = () => {
    if (message.evidencePackId && onExplainClick) {
      onExplainClick(message.evidencePackId);
    }
  };

  return (
    <div className={cn('flex items-start gap-3', className)}>
      <SimpleAvatar fallback="AX" size="sm" className="bg-gray-700 text-gray-300" />
      <div className="flex-1 max-w-[85%] space-y-2">
        {/* Planning indicator */}
        {(isStreaming || hasPlanningInfo) && (
          <PlanningIndicator
            planningState={message.planningState ?? null}
            skillsExecuted={message.skillsExecuted ?? []}
            isStreaming={isStreaming}
          />
        )}

        {/* Structured response card */}
        {hasStructuredResponse && !isStreaming && message.structuredResponse && (
          <StructuredResponseCard response={message.structuredResponse} />
        )}

        {/* Response content */}
        {hasContent ? (
          <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-tl-sm px-4 py-2.5">
            <div className="text-sm text-gray-200">
              <FormattedContent content={message.content} />
            </div>
          </div>
        ) : isStreaming ? (
          <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-tl-sm px-4 py-2.5 space-y-2">
            <Skeleton className="h-4 w-full bg-gray-700" />
            <Skeleton className="h-4 w-3/4 bg-gray-700" />
            <Skeleton className="h-4 w-1/2 bg-gray-700" />
          </div>
        ) : null}

        {/* Citations */}
        {hasCitations && message.citations && (
          <CitationList citations={message.citations} />
        )}

        {/* Action buttons */}
        {!isStreaming && (hasActions || message.evidencePackId) && (
          <ActionButtonsRow
            actions={message.structuredResponse?.availableActions ?? []}
            onActionClick={handleActionClick}
            onExplainClick={message.evidencePackId ? handleExplainClick : undefined}
            className="mt-3"
          />
        )}

        {/* Timestamp */}
        {!isStreaming && (
          <span className="text-xs text-gray-500">
            {formatTime(message.timestamp)}
          </span>
        )}
      </div>
    </div>
  );
}

interface FormattedContentProps {
  content: string;
}

function FormattedContent({ content }: FormattedContentProps) {
  // Simple markdown-like formatting
  const lines = content.split('\n');

  return (
    <>
      {lines.map((line, index) => {
        // Empty line = paragraph break
        if (!line.trim()) {
          return <br key={index} />;
        }

        // Bullet points
        if (line.match(/^[-*]\s/)) {
          return (
            <p key={index} className="flex items-start gap-2">
              <span className="text-gray-500">-</span>
              <span>{line.slice(2)}</span>
            </p>
          );
        }

        // Numbered list
        if (line.match(/^\d+\.\s/)) {
          const [num, ...rest] = line.split(/\.\s/);
          return (
            <p key={index} className="flex items-start gap-2">
              <span className="text-gray-500 min-w-[1.5rem]">{num}.</span>
              <span>{rest.join('. ')}</span>
            </p>
          );
        }

        // Bold text: **text**
        const formattedLine = line.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');

        // Regular paragraph
        return <p key={index} dangerouslySetInnerHTML={{ __html: formattedLine }} />;
      })}
    </>
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
