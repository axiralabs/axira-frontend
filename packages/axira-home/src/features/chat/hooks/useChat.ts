import { useCallback, useState, useEffect, useRef } from 'react';
import { useAuth, useTenant } from '@axira/shared/hooks';
import { useConversationStream } from './useConversationStream';
import {
  createConversation,
  getConversation,
  listConversations,
} from '../../../services/conversationService';
import type {
  ChatMessage,
  AgentOption,
  Conversation,
  ConversationListItem,
  SubjectContext,
} from '../types';

// Default agent for the chat
const DEFAULT_AGENT: AgentOption = {
  key: 'branch-banker-assistant',
  name: 'Branch Banker Assistant',
  description: 'Helps with customer inquiries, document checks, and account information',
};

// Available agents
const AVAILABLE_AGENTS: AgentOption[] = [
  DEFAULT_AGENT,
  {
    key: 'qa-reviewer',
    name: 'QA Reviewer',
    description: 'Assists with QA reviews and compliance checks',
  },
  {
    key: 'doc-presence-check',
    name: 'Document Checker',
    description: 'Verifies document presence and completeness',
  },
];

// LocalStorage key for persisting current conversation
const CONVERSATION_STORAGE_KEY = 'axira-current-conversation-id';

interface UseChatOptions {
  initialAgentKey?: string;
  initialConversationId?: string;
}

export function useChat(options: UseChatOptions = {}) {
  const { user } = useAuth();
  const { orgId, workspaceId } = useTenant();

  // State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentOption>(
    AVAILABLE_AGENTS.find((a) => a.key === options.initialAgentKey) || DEFAULT_AGENT
  );
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [conversationList, setConversationList] = useState<ConversationListItem[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [subjectContext, setSubjectContext] = useState<SubjectContext | null>(null);
  const [currentStreamingMessageId, setCurrentStreamingMessageId] = useState<string | null>(null);

  // Track if we've initialized
  const initializedRef = useRef(false);

  // Request options for API calls
  const requestOptions = {
    tenantId: orgId || 'lsnb-001',
    userId: user?.userId || 'maya-chen-001',
    workspaceId: workspaceId || 'lsnb-main',
  };

  // Conversation stream hook
  const {
    isStreaming,
    error: streamError,
    streamingText,
    finalAnswer,
    planningState,
    skillsExecuted,
    structuredResponse,
    citations,
    evidencePackId,
    isDone,
    sendMessage: sendStreamMessage,
    reset: resetStream,
    abort: abortStream,
  } = useConversationStream(requestOptions);

  // Update streaming message with real-time data
  useEffect(() => {
    if (!currentStreamingMessageId) return;

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === currentStreamingMessageId
          ? {
              ...msg,
              content: streamingText || msg.content,
              planningState,
              skillsExecuted,
              isStreaming: true,
            }
          : msg
      )
    );
  }, [currentStreamingMessageId, streamingText, planningState, skillsExecuted]);

  // Handle final answer
  useEffect(() => {
    if (!currentStreamingMessageId || !finalAnswer) return;

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === currentStreamingMessageId
          ? {
              ...msg,
              content: finalAnswer,
              isStreaming: false,
              evidencePackId: evidencePackId || undefined,
              structuredResponse: structuredResponse || undefined,
              citations: citations.length > 0 ? citations : undefined,
            }
          : msg
      )
    );
  }, [currentStreamingMessageId, finalAnswer, evidencePackId, structuredResponse, citations]);

  // Handle stream completion
  useEffect(() => {
    if (!isDone || !currentStreamingMessageId) return;

    // If we completed but don't have final answer, show error message
    if (!finalAnswer && streamError) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === currentStreamingMessageId
            ? {
                ...msg,
                content: `Sorry, I encountered an error: ${streamError.message}`,
                isStreaming: false,
              }
            : msg
        )
      );
    }

    setCurrentStreamingMessageId(null);
  }, [isDone, currentStreamingMessageId, finalAnswer, streamError]);

  // Load conversations on mount
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const loadConversations = async () => {
      setIsLoadingConversations(true);
      try {
        const result = await listConversations({
          ...requestOptions,
          channelType: 'HOME_CHAT',
          size: 20,
        });
        setConversationList(result.conversations);

        // Check for persisted conversation or initial conversation ID
        const persistedId = localStorage.getItem(CONVERSATION_STORAGE_KEY);
        const conversationIdToLoad = options.initialConversationId || persistedId;

        if (conversationIdToLoad) {
          // Try to load the existing conversation
          try {
            const conversation = await getConversation(
              conversationIdToLoad,
              requestOptions,
              true // includeMessages
            );
            setCurrentConversation(conversation);
            localStorage.setItem(CONVERSATION_STORAGE_KEY, conversation.id);
          } catch {
            // Conversation doesn't exist, clear persisted ID
            localStorage.removeItem(CONVERSATION_STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error('Failed to load conversations:', error);
      } finally {
        setIsLoadingConversations(false);
      }
    };

    loadConversations();
  }, []);

  // Create a new conversation
  const createNewConversation = useCallback(
    async (subject?: string): Promise<Conversation> => {
      const conversation = await createConversation(
        {
          subject: subject || 'New Conversation',
          channelType: 'HOME_CHAT',
          workspaceId: requestOptions.workspaceId!,
          businessAgentKey: selectedAgent.key,
          participantUserIds: [requestOptions.userId],
        },
        requestOptions
      );

      setCurrentConversation(conversation);
      localStorage.setItem(CONVERSATION_STORAGE_KEY, conversation.id);

      // Add to conversation list
      setConversationList((prev) => [
        {
          id: conversation.id,
          subject: conversation.subject,
          channelType: conversation.channelType,
          businessAgentKey: conversation.businessAgentKey,
          updatedAt: conversation.updatedAt,
          archived: conversation.archived,
        },
        ...prev,
      ]);

      return conversation;
    },
    [requestOptions, selectedAgent.key]
  );

  // Switch to a different conversation
  const switchConversation = useCallback(
    async (conversationId: string) => {
      // Abort any ongoing stream
      abortStream();
      resetStream();
      setMessages([]);
      setCurrentStreamingMessageId(null);

      try {
        const conversation = await getConversation(
          conversationId,
          requestOptions,
          true // includeMessages
        );
        setCurrentConversation(conversation);
        localStorage.setItem(CONVERSATION_STORAGE_KEY, conversation.id);

        // Update selected agent if conversation has one
        if (conversation.businessAgentKey) {
          const agent = AVAILABLE_AGENTS.find((a) => a.key === conversation.businessAgentKey);
          if (agent) {
            setSelectedAgent(agent);
          }
        }

        // TODO: Convert conversation messages to ChatMessage format
        // This would require fetching messages separately and transforming them
      } catch (error) {
        console.error('Failed to switch conversation:', error);
      }
    },
    [requestOptions, abortStream, resetStream]
  );

  // Send a message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      let conversation = currentConversation;

      // Create a new conversation if we don't have one
      if (!conversation) {
        try {
          // Use first sentence or first 50 chars as subject
          const subject = content.length > 50
            ? content.substring(0, 47) + '...'
            : content.split(/[.!?]/)[0] || content;

          conversation = await createNewConversation(subject);
        } catch (error) {
          console.error('Failed to create conversation:', error);
          // Show error in UI by adding a failed message
          const errorMessageId = crypto.randomUUID();
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: 'user',
              content,
              timestamp: new Date(),
            },
            {
              id: errorMessageId,
              role: 'assistant',
              content: `Failed to create conversation: ${error instanceof Error ? error.message : 'Unknown error'}`,
              timestamp: new Date(),
              isStreaming: false,
            },
          ]);
          return;
        }
      }

      // Add user message to UI
      const userMessageId = crypto.randomUUID();
      const userMessage: ChatMessage = {
        id: userMessageId,
        role: 'user',
        content,
        timestamp: new Date(),
        conversationId: conversation.id,
      };

      // Add placeholder for assistant response
      const assistantMessageId = crypto.randomUUID();
      const assistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        conversationId: conversation.id,
        isStreaming: true,
        planningState: null,
        skillsExecuted: [],
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setCurrentStreamingMessageId(assistantMessageId);

      // Reset stream state and send message
      resetStream();
      sendStreamMessage(conversation.id, content, {
        subjectKey: subjectContext?.subjectKey,
        subjectKind: subjectContext?.subjectKind,
        branchId: requestOptions.workspaceId,
        bankerId: requestOptions.userId,
      });

      // Update conversation list with latest timestamp
      setConversationList((prev) =>
        prev.map((c) =>
          c.id === conversation!.id
            ? { ...c, updatedAt: new Date().toISOString(), lastMessagePreview: content }
            : c
        )
      );
    },
    [currentConversation, createNewConversation, resetStream, sendStreamMessage, subjectContext, requestOptions]
  );

  // Start a new chat (clears current conversation)
  const startNewChat = useCallback(() => {
    abortStream();
    resetStream();
    setMessages([]);
    setCurrentConversation(null);
    setCurrentStreamingMessageId(null);
    setSubjectContext(null);
    localStorage.removeItem(CONVERSATION_STORAGE_KEY);
  }, [abortStream, resetStream]);

  // Clear messages without clearing conversation
  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentStreamingMessageId(null);
    resetStream();
  }, [resetStream]);

  // Set subject context for the conversation
  const setSubject = useCallback((subject: SubjectContext | null) => {
    setSubjectContext(subject);
  }, []);

  return {
    // Message state
    messages,
    isStreaming,
    error: streamError,

    // Conversation state
    currentConversation,
    conversationList,
    isLoadingConversations,

    // Agent state
    selectedAgent,
    availableAgents: AVAILABLE_AGENTS,
    setSelectedAgent,

    // Subject context
    subjectContext,
    setSubject,

    // Actions
    sendMessage,
    clearMessages,
    startNewChat,
    createNewConversation,
    switchConversation,

    // User info
    userName: user?.displayName,
  };
}
