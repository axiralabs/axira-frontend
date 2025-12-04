import { useEffect, useState, useCallback, useRef } from 'react';
import { cn } from '@axira/shared/utils';
import { useAuth } from '@axira/shared/hooks';
import { useChatContext, type ChatViewMode, type Conversation } from '../context';
import { useChat } from '../hooks/useChat';
import { AxiraLogo } from '../../../components/AxiraLogo';
import { MessageThread } from './MessageThread';
import { EvidenceSlideOver } from './EvidenceSlideOver';
import { PromptTemplateCard } from './PromptTemplateCard';
import { PlaceholderEditor } from './PlaceholderEditor';
import { PROMPT_TEMPLATES, TEMPLATE_CATEGORIES, type PromptTemplate } from '../data/promptTemplates';
import type { AgentOption } from '../types';

export function ChatSlideOver() {
  const {
    isOpen,
    viewMode,
    sidebarWidth,
    closeChat,
    setViewMode,
    setSidebarWidth,
    initialMessage,
    clearInitialMessage,
    currentConversationId,
    conversations,
    createNewConversation,
    switchConversation,
  } = useChatContext();
  const { user } = useAuth();
  const firstName = user?.displayName?.split(' ')[0] || 'there';

  const {
    messages,
    isStreaming,
    selectedAgent,
    availableAgents,
    setSelectedAgent,
    sendMessage,
  } = useChat();

  // UI State
  const [agentDropdownOpen, setAgentDropdownOpen] = useState(false);
  const [evidenceSlideOverOpen, setEvidenceSlideOverOpen] = useState(false);
  const [selectedEvidencePackId, setSelectedEvidencePackId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [showConversationSidebar, setShowConversationSidebar] = useState(true);

  // Resize state
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);

  // Handle initial message from context
  useEffect(() => {
    if (initialMessage && isOpen) {
      sendMessage(initialMessage);
      clearInitialMessage();
    }
  }, [initialMessage, isOpen, sendMessage, clearInitialMessage]);

  // Handle resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, setSidebarWidth]);

  const handleSend = useCallback(() => {
    if (inputValue.trim() && !isStreaming) {
      sendMessage(inputValue.trim());
      setInputValue('');
    }
  }, [inputValue, isStreaming, sendMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleTemplateSelect = useCallback((template: PromptTemplate) => {
    setSelectedTemplate(template);
  }, []);

  const handleTemplateSubmit = useCallback(
    (filledTemplate: string) => {
      sendMessage(filledTemplate);
      setSelectedTemplate(null);
    },
    [sendMessage]
  );

  const handleExplainClick = useCallback((evidencePackId: string) => {
    setSelectedEvidencePackId(evidencePackId);
    setEvidenceSlideOverOpen(true);
  }, []);

  const handleAgentSelect = useCallback(
    (agent: AgentOption) => {
      setSelectedAgent(agent);
      setAgentDropdownOpen(false);
    },
    [setSelectedAgent]
  );

  const cycleViewMode = useCallback(() => {
    const modes: ChatViewMode[] = ['sidebar', 'expanded', 'fullscreen'];
    const currentIndex = modes.indexOf(viewMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setViewMode(modes[nextIndex]);
  }, [viewMode, setViewMode]);

  const filteredTemplates = selectedCategory === 'all'
    ? PROMPT_TEMPLATES
    : PROMPT_TEMPLATES.filter((t) => t.category === selectedCategory);

  if (!isOpen) return null;

  const hasMessages = messages.length > 0;
  const isFullscreen = viewMode === 'fullscreen';
  const isExpanded = viewMode === 'expanded';

  // Calculate panel width based on mode (add 256px for conversation sidebar when visible)
  const conversationSidebarWidth = showConversationSidebar ? 256 : 0;
  const totalWidth = sidebarWidth + conversationSidebarWidth;
  const panelStyle: React.CSSProperties = isFullscreen
    ? { width: '100%', maxWidth: '100%' }
    : isExpanded
    ? { width: '70%', maxWidth: '1100px' }
    : { width: `${totalWidth}px`, maxWidth: 'calc(100vw - 16px)' };

  return (
    <>
      {/* Backdrop */}
      {!isFullscreen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={closeChat}
          aria-hidden="true"
        />
      )}

      {/* Slide-over panel */}
      <div
        className={cn(
          'fixed top-0 h-full bg-gray-900 shadow-2xl z-50',
          'flex',
          'transform transition-all duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
          isFullscreen ? 'left-0 right-0' : 'right-0'
        )}
        style={panelStyle}
      >
        {/* Resize handle */}
        {!isFullscreen && (
          <div
            ref={resizeRef}
            onMouseDown={() => setIsResizing(true)}
            className={cn(
              'absolute left-0 top-0 bottom-0 w-1 cursor-col-resize',
              'hover:bg-blue-500 transition-colors',
              isResizing && 'bg-blue-500'
            )}
          />
        )}

        {/* Conversation History Sidebar */}
        {showConversationSidebar && (
          <div className="w-64 border-r border-gray-800 bg-gray-950 flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-800">
              <button
                onClick={createNewConversation}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                New Chat
              </button>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto py-2">
              <div className="px-3 mb-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Recent</p>
              </div>
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => switchConversation(conv.id)}
                  className={cn(
                    'w-full px-3 py-2.5 text-left hover:bg-gray-800 transition-colors',
                    currentConversationId === conv.id && 'bg-gray-800'
                  )}
                >
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <ConversationIcon className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-200 truncate">{conv.subject}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{conv.lastMessage}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-600">{conv.timestamp}</span>
                        <span className="text-xs text-blue-400">{conv.agentName}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowConversationSidebar(!showConversationSidebar)}
                className="p-1.5 hover:bg-gray-800 rounded"
                aria-label="Toggle sidebar"
              >
                <MenuIcon className="w-5 h-5 text-gray-400" />
              </button>

              {/* Agent switcher */}
              <div className="relative">
                <button
                  onClick={() => setAgentDropdownOpen(!agentDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-400 border border-gray-700 rounded-full hover:bg-gray-800 transition-colors"
                >
                  <AxiraLogo size="sm" className="w-5 h-5" />
                  <span>{selectedAgent.name.split(' ')[0]}</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>

                {agentDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setAgentDropdownOpen(false)} />
                    <AgentDropdown
                      agents={availableAgents}
                      selectedAgent={selectedAgent}
                      onSelect={handleAgentSelect}
                    />
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={cycleViewMode}
                className="p-2 hover:bg-gray-800 rounded"
                aria-label={isFullscreen ? 'Exit fullscreen' : isExpanded ? 'Fullscreen' : 'Expand'}
                title={isFullscreen ? 'Exit fullscreen' : isExpanded ? 'Fullscreen' : 'Expand'}
              >
                {isFullscreen ? (
                  <MinimizeIcon className="w-5 h-5 text-gray-400" />
                ) : (
                  <ExpandIcon className="w-5 h-5 text-gray-400" />
                )}
              </button>
              <button className="p-2 hover:bg-gray-800 rounded" aria-label="More">
                <MoreIcon className="w-5 h-5 text-gray-400" />
              </button>
              <button onClick={closeChat} className="p-2 hover:bg-gray-800 rounded" aria-label="Close">
                <CloseIcon className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-gray-950">
            {!hasMessages ? (
              /* Empty state - Welcome screen with templates */
              <div className="flex-1 overflow-y-auto">
                <div className={cn(
                  'flex flex-col items-center pt-12 pb-8 px-6',
                  isFullscreen && 'max-w-4xl mx-auto'
                )}>
                  <AxiraLogo size="lg" className="mb-6" />
                  <h2 className="text-2xl font-semibold text-white mb-2">
                    How can I help, {firstName}?
                  </h2>
                  <p className="text-gray-500 text-center mb-8 max-w-md">
                    Ask a question or select a template below to get started
                  </p>

                  {/* Category Filters */}
                  <div className="flex items-center gap-2 mb-6">
                    {TEMPLATE_CATEGORIES.map((cat) => (
                      <button
                        key={cat.key}
                        onClick={() => setSelectedCategory(cat.key)}
                        className={cn(
                          'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                          selectedCategory === cat.key
                            ? 'bg-blue-900/50 text-blue-400'
                            : 'text-gray-400 hover:bg-gray-800'
                        )}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Template Grid */}
                  <div className={cn(
                    'w-full grid gap-4',
                    isFullscreen ? 'grid-cols-3' : isExpanded ? 'grid-cols-2' : 'grid-cols-1'
                  )}>
                    {filteredTemplates.map((template) => (
                      <PromptTemplateCard
                        key={template.id}
                        template={template}
                        onClick={handleTemplateSelect}
                      />
                    ))}
                  </div>

                  {/* Results count */}
                  <p className="text-sm text-gray-500 mt-6">
                    {filteredTemplates.length} templates
                  </p>
                </div>
              </div>
            ) : (
              /* Message thread */
              <MessageThread
                messages={messages}
                userName={user?.displayName}
                onExplainClick={handleExplainClick}
                className="flex-1"
              />
            )}
          </div>

          {/* Input area */}
          <div className="border-t border-gray-800 p-4 bg-gray-900">
            <div className="relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write a prompt, @someone, or use / for actions"
                className={cn(
                  'w-full px-4 py-3 pr-12 text-sm bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg resize-none',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]'
                )}
                rows={2}
                disabled={isStreaming}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isStreaming}
                className={cn(
                  'absolute right-3 bottom-3 p-1.5 rounded transition-colors',
                  inputValue.trim() && !isStreaming
                    ? 'text-blue-400 hover:bg-gray-700'
                    : 'text-gray-600'
                )}
                aria-label="Send message"
              >
                <SendIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between mt-2 px-1">
              <div className="flex items-center gap-2">
                <button className="p-1.5 hover:bg-gray-800 rounded text-gray-500">
                  <PlusIcon className="w-4 h-4" />
                </button>
                <button className="p-1.5 hover:bg-gray-800 rounded text-gray-500">
                  <SettingsIcon className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <InfoIcon className="w-3 h-3" />
                Uses AI. Verify results.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Template Placeholder Editor Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <PlaceholderEditor
            template={selectedTemplate}
            onSubmit={handleTemplateSubmit}
            onCancel={() => setSelectedTemplate(null)}
          />
        </div>
      )}

      {/* Evidence Slide-Over */}
      <EvidenceSlideOver
        open={evidenceSlideOverOpen}
        onOpenChange={setEvidenceSlideOverOpen}
        evidencePackId={selectedEvidencePackId}
      />
    </>
  );
}

// Agent Dropdown Component
function AgentDropdown({
  agents,
  selectedAgent,
  onSelect,
}: {
  agents: AgentOption[];
  selectedAgent: AgentOption;
  onSelect: (agent: AgentOption) => void;
}) {
  return (
    <div className="absolute top-full left-0 mt-2 w-72 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-20">
      <div className="p-3 border-b border-gray-700">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
          Switch to another agent
        </p>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search agents"
            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="py-2 max-h-64 overflow-y-auto">
        {agents.map((agent) => (
          <button
            key={agent.key}
            onClick={() => onSelect(agent)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-700 transition-colors',
              selectedAgent.key === agent.key && 'bg-blue-900/30'
            )}
          >
            <AgentIcon agentKey={agent.key} />
            <span className="text-sm font-medium text-gray-200">{agent.name}</span>
            {selectedAgent.key === agent.key && (
              <CheckIcon className="w-4 h-4 text-blue-400 ml-auto" />
            )}
          </button>
        ))}
      </div>
      <div className="border-t border-gray-700 py-2">
        <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-700 text-sm text-gray-400">
          <BrowseIcon className="w-5 h-5" />
          Browse agents
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-700 text-sm text-gray-400">
          <PlusIcon className="w-5 h-5" />
          Create agent
        </button>
      </div>
    </div>
  );
}

// Icon Components
function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
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

function BrowseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ExpandIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

function MinimizeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="4 14 10 14 10 20" />
      <polyline points="20 10 14 10 14 4" />
      <line x1="14" y1="10" x2="21" y2="3" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

function MoreIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
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

function AgentIcon({ agentKey }: { agentKey: string }) {
  const colors: Record<string, string> = {
    'branch-banker-assistant': 'bg-green-900/50 text-green-400',
    'qa-reviewer': 'bg-orange-900/50 text-orange-400',
    'doc-presence-check': 'bg-blue-900/50 text-blue-400',
  };

  const colorClass = colors[agentKey] || 'bg-gray-700 text-gray-400';

  return (
    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', colorClass)}>
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2" />
        <path d="M20 14h2" />
        <path d="M15 13v2" />
        <path d="M9 13v2" />
      </svg>
    </div>
  );
}

function ConversationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
