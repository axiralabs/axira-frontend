import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { PromptTemplate, TemplateCategory } from '../data/promptTemplates';

export type ChatViewMode = 'sidebar' | 'expanded' | 'fullscreen';

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  subject: string;
  lastMessage: string;
  timestamp: string;
  agentKey: string;
  agentName: string;
  messages: ConversationMessage[];
}

interface ChatContextValue {
  isOpen: boolean;
  viewMode: ChatViewMode;
  sidebarWidth: number;
  initialMessage: string | null;
  currentConversationId: string | null;
  conversations: Conversation[];
  promptTemplates: PromptTemplate[] | null;
  templateCategories: TemplateCategory[] | null;
  openChat: (message?: string, options?: { promptTemplates?: PromptTemplate[]; templateCategories?: TemplateCategory[] }) => void;
  closeChat: () => void;
  toggleChat: () => void;
  setViewMode: (mode: ChatViewMode) => void;
  setSidebarWidth: (width: number) => void;
  clearInitialMessage: () => void;
  createNewConversation: () => void;
  switchConversation: (conversationId: string) => void;
  setPromptTemplates: (templates: PromptTemplate[] | null, categories?: TemplateCategory[] | null) => void;
  getCurrentConversationMessages: () => ConversationMessage[];
}

const ChatContext = createContext<ChatContextValue | null>(null);

const MIN_SIDEBAR_WIDTH = 450;
const MAX_SIDEBAR_WIDTH = 900;
const DEFAULT_SIDEBAR_WIDTH = 500;

// Mock conversations for demo with full Q&A history (board-focused)
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    subject: 'Q4 Branch Performance Analysis',
    lastMessage: 'McAllen shows the strongest growth trajectory at 14.2%...',
    timestamp: '2 hours ago',
    agentKey: 'branch-banker-assistant',
    agentName: 'Board Assistant',
    messages: [
      {
        id: 'msg-1-1',
        role: 'user',
        content: 'Which branch is performing best this quarter?',
        timestamp: '2 hours ago',
      },
      {
        id: 'msg-1-2',
        role: 'assistant',
        content: `Based on Q4 2024 performance data, **McAllen Branch** is the top performer across key metrics:

**Financial Performance:**
- Revenue: $52.3M (+14.2% YoY)
- Deposits: $380M (+12.5% growth)
- Loan Portfolio: $220M with healthy diversification

**Operational Excellence:**
- Net Interest Margin: 3.92% (highest across all branches)
- Efficiency Ratio: 54.2% (best in class)
- Revenue per Employee: $523K

**Customer Experience:**
- NPS Score: 72 (Excellent)
- Customer Satisfaction: 89%
- New Account Growth: 156 accounts (+18.2%)

McAllen's success is driven by strong commercial lending activity and excellent customer retention in the Rio Grande Valley market.`,
        timestamp: '2 hours ago',
      },
      {
        id: 'msg-1-3',
        role: 'user',
        content: 'What about Edinburg? How does it compare?',
        timestamp: '2 hours ago',
      },
      {
        id: 'msg-1-4',
        role: 'assistant',
        content: `**Edinburg Branch** shows solid performance but trails McAllen in key areas:

**Comparison Summary:**
| Metric | Edinburg | McAllen | Gap |
|--------|----------|---------|-----|
| Revenue | $41.5M | $52.3M | -20.6% |
| NIM | 3.65% | 3.92% | -27bp |
| NPS | 68 | 72 | -4 pts |
| Efficiency | 58.1% | 54.2% | +3.9% |

**Areas for Improvement:**
- Customer acquisition cost is 15% higher than McAllen
- Commercial loan pipeline is smaller ($45M vs $78M)
- Staff productivity metrics suggest potential for optimization

**Recommendation:** Consider implementing McAllen's customer onboarding process at Edinburg, which has proven effective at reducing acquisition costs and improving early engagement metrics.`,
        timestamp: '2 hours ago',
      },
    ],
  },
  {
    id: 'conv-2',
    subject: 'Investment Allocation Strategy',
    lastMessage: 'Technology modernization and branch expansion show strongest ROI...',
    timestamp: 'Yesterday',
    agentKey: 'branch-banker-assistant',
    agentName: 'Board Assistant',
    messages: [
      {
        id: 'msg-2-1',
        role: 'user',
        content: 'Where should we focus our investment next quarter?',
        timestamp: 'Yesterday',
      },
      {
        id: 'msg-2-2',
        role: 'assistant',
        content: `Based on current performance data and market analysis, I recommend focusing investments in three strategic areas:

**1. Technology Modernization ($2.5M)**
- Core banking system upgrade for real-time processing
- Mobile banking enhancements (projected 25% adoption increase)
- Expected ROI: 18% over 24 months

**2. McAllen Branch Expansion ($1.8M)**
- New commercial lending center
- Additional staff to support growing customer base
- Expected ROI: 22% based on current growth trajectory

**3. Digital Marketing & Customer Acquisition ($800K)**
- Targeted campaigns in underserved markets
- Referral program enhancement
- Expected customer growth: 12% YoY

**Total Investment:** $5.1M
**Projected 3-Year Return:** $8.2M`,
        timestamp: 'Yesterday',
      },
      {
        id: 'msg-2-3',
        role: 'user',
        content: 'What are the risks associated with the technology investment?',
        timestamp: 'Yesterday',
      },
      {
        id: 'msg-2-4',
        role: 'assistant',
        content: `**Technology Investment Risk Assessment:**

**Implementation Risks (Medium):**
- Migration complexity: 6-month timeline with potential 2-month buffer
- Staff training requirements: 120 hours per employee
- Temporary processing delays during cutover (planned for low-volume period)

**Financial Risks (Low):**
- Vendor contract locked at fixed price
- Contingency budget of 15% built into estimates
- Phased rollout reduces exposure

**Operational Risks (Medium-Low):**
- Fallback to current system available during transition
- 99.9% uptime SLA with vendor penalties
- 24/7 support during first 90 days post-launch

**Mitigation Strategy:**
1. Pilot program at Harlingen branch (smallest volume)
2. Parallel systems for 30 days before full cutover
3. Dedicated project team with executive sponsorship
4. Weekly board updates during implementation

**Risk-Adjusted ROI:** 15.5% (accounting for 2.5% risk factor)

The technology investment carries manageable risk with strong upside potential. The vendor has successfully completed 12 similar implementations at community banks of our size.`,
        timestamp: 'Yesterday',
      },
    ],
  },
];

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewModeState] = useState<ChatViewMode>('sidebar');
  const [sidebarWidth, setSidebarWidthState] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [initialMessage, setInitialMessage] = useState<string | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [promptTemplates, setPromptTemplatesState] = useState<PromptTemplate[] | null>(null);
  const [templateCategories, setTemplateCategoriesState] = useState<TemplateCategory[] | null>(null);

  const openChat = useCallback((message?: string, options?: { promptTemplates?: PromptTemplate[]; templateCategories?: TemplateCategory[] }) => {
    if (message) {
      setInitialMessage(message);
      // Create a new conversation when opening with a message
      setCurrentConversationId(null);
    }
    // Set custom templates if provided
    if (options?.promptTemplates) {
      setPromptTemplatesState(options.promptTemplates);
    }
    if (options?.templateCategories) {
      setTemplateCategoriesState(options.templateCategories);
    }
    setIsOpen(true);
  }, []);

  const setPromptTemplates = useCallback((templates: PromptTemplate[] | null, categories?: TemplateCategory[] | null) => {
    setPromptTemplatesState(templates);
    if (categories !== undefined) {
      setTemplateCategoriesState(categories);
    }
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

  const getCurrentConversationMessages = useCallback((): ConversationMessage[] => {
    if (!currentConversationId) return [];
    const conversation = conversations.find(c => c.id === currentConversationId);
    return conversation?.messages || [];
  }, [currentConversationId, conversations]);

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        viewMode,
        sidebarWidth,
        initialMessage,
        currentConversationId,
        conversations,
        promptTemplates,
        templateCategories,
        openChat,
        closeChat,
        toggleChat,
        setViewMode,
        setSidebarWidth,
        clearInitialMessage,
        createNewConversation,
        switchConversation,
        setPromptTemplates,
        getCurrentConversationMessages,
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
