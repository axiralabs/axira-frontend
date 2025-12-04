import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type ChatViewMode = 'sidebar' | 'expanded' | 'fullscreen';

export interface Conversation {
  id: string;
  subject: string;
  lastMessage: string;
  timestamp: string;
  agentKey: string;
  agentName: string;
}

interface ChatContextValue {
  isOpen: boolean;
  viewMode: ChatViewMode;
  sidebarWidth: number;
  initialMessage: string | null;
  currentConversationId: string | null;
  conversations: Conversation[];
  openChat: (message?: string) => void;
  closeChat: () => void;
  toggleChat: () => void;
  setViewMode: (mode: ChatViewMode) => void;
  setSidebarWidth: (width: number) => void;
  clearInitialMessage: () => void;
  createNewConversation: () => void;
  switchConversation: (conversationId: string) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

const MIN_SIDEBAR_WIDTH = 450;
const MAX_SIDEBAR_WIDTH = 900;
const DEFAULT_SIDEBAR_WIDTH = 500;

// Mock conversations for demo
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    subject: 'Garcia Household Documents',
    lastMessage: 'All required documents are present for DDA ending 1234',
    timestamp: '2 hours ago',
    agentKey: 'branch-banker-assistant',
    agentName: 'Branch Banker',
  },
  {
    id: 'conv-2',
    subject: 'CIP Review Status',
    lastMessage: 'Found 3 pending reviews that need attention',
    timestamp: 'Yesterday',
    agentKey: 'qa-reviewer',
    agentName: 'QA Reviewer',
  },
  {
    id: 'conv-3',
    subject: 'Martinez LLC Meeting Prep',
    lastMessage: 'Here are the key points for your upcoming meeting',
    timestamp: '2 days ago',
    agentKey: 'branch-banker-assistant',
    agentName: 'Branch Banker',
  },
];

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewModeState] = useState<ChatViewMode>('sidebar');
  const [sidebarWidth, setSidebarWidthState] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [initialMessage, setInitialMessage] = useState<string | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);

  const openChat = useCallback((message?: string) => {
    if (message) {
      setInitialMessage(message);
      // Create a new conversation when opening with a message
      setCurrentConversationId(null);
    }
    setIsOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
    // Reset to sidebar mode when closing
    setViewModeState('sidebar');
  }, []);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const setViewMode = useCallback((mode: ChatViewMode) => {
    setViewModeState(mode);
  }, []);

  const setSidebarWidth = useCallback((width: number) => {
    const clampedWidth = Math.min(Math.max(width, MIN_SIDEBAR_WIDTH), MAX_SIDEBAR_WIDTH);
    setSidebarWidthState(clampedWidth);
  }, []);

  const clearInitialMessage = useCallback(() => {
    setInitialMessage(null);
  }, []);

  const createNewConversation = useCallback(() => {
    setCurrentConversationId(null);
    setInitialMessage(null);
  }, []);

  const switchConversation = useCallback((conversationId: string) => {
    setCurrentConversationId(conversationId);
    setInitialMessage(null);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        viewMode,
        sidebarWidth,
        initialMessage,
        currentConversationId,
        conversations,
        openChat,
        closeChat,
        toggleChat,
        setViewMode,
        setSidebarWidth,
        clearInitialMessage,
        createNewConversation,
        switchConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}
