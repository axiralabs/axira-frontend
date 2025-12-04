import { useState, useCallback } from 'react';
import { Card, Button } from '@axira/shared/components';
import { cn } from '@axira/shared/utils';
import { useChat } from '../hooks/useChat';
import { MessageThread } from './MessageThread';
import { ChatInput } from './ChatInput';
import { AgentSelector } from './AgentSelector';
import { ConversationSidebar } from './ConversationSidebar';
import { EvidenceSlideOver } from './EvidenceSlideOver';

interface ChatContainerProps {
  conversationId?: string;
  subjectKey?: string;
  className?: string;
  showSidebar?: boolean;
}

export function ChatContainer({
  conversationId,
  subjectKey,
  className,
  showSidebar = true,
}: ChatContainerProps) {
  const {
    messages,
    isStreaming,
    error,
    currentConversation,
    conversationList,
    isLoadingConversations,
    selectedAgent,
    availableAgents,
    setSelectedAgent,
    subjectContext,
    sendMessage,
    clearMessages,
    startNewChat,
    switchConversation,
    userName,
  } = useChat({
    initialConversationId: conversationId,
  });

  // Evidence slide-over state
  const [evidenceSlideOverOpen, setEvidenceSlideOverOpen] = useState(false);
  const [selectedEvidencePackId, setSelectedEvidencePackId] = useState<string | null>(null);

  const handleSend = (content: string) => {
    sendMessage(content);
  };

  const handleExplainClick = useCallback((evidencePackId: string) => {
    setSelectedEvidencePackId(evidencePackId);
    setEvidenceSlideOverOpen(true);
  }, []);

  return (
    <>
      <div className={cn('flex h-full', className)}>
        {/* Sidebar */}
        {showSidebar && (
          <ConversationSidebar
            conversations={conversationList}
            currentConversationId={currentConversation?.id}
            isLoading={isLoadingConversations}
            onSelectConversation={switchConversation}
            onNewConversation={startNewChat}
            className="w-64 shrink-0 border-r"
          />
        )}

        {/* Main chat area */}
        <Card className="flex flex-col flex-1 overflow-hidden border-0 rounded-none">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <AgentSelector
                agents={availableAgents}
                selectedAgent={selectedAgent}
                onSelect={setSelectedAgent}
                disabled={isStreaming}
              />
              {currentConversation && (
                <span className="text-sm text-muted-foreground">
                  {currentConversation.subject}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {subjectContext && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  {subjectContext.displayName}
                </span>
              )}
              {messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearMessages}
                  disabled={isStreaming}
                  aria-label="Clear conversation"
                >
                  <TrashIcon className="h-4 w-4" />
                  <span className="ml-1">Clear</span>
                </Button>
              )}
            </div>
          </div>

          {/* Error display */}
          {error && (
            <div className="mx-4 mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error.message}</p>
            </div>
          )}

          {/* Message thread */}
          <MessageThread
            messages={messages}
            userName={userName}
            onExplainClick={handleExplainClick}
            className="flex-1 min-h-0"
          />

          {/* Input area */}
          <div className="p-4 border-t bg-background">
            <ChatInput
              onSend={handleSend}
              disabled={isStreaming}
              placeholder={`Ask ${selectedAgent.name}...`}
            />
          </div>
        </Card>
      </div>

      {/* Evidence Slide-Over */}
      <EvidenceSlideOver
        open={evidenceSlideOverOpen}
        onOpenChange={setEvidenceSlideOverOpen}
        evidencePackId={selectedEvidencePackId}
      />
    </>
  );
}

function TrashIcon({ className }: { className?: string }) {
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
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}
