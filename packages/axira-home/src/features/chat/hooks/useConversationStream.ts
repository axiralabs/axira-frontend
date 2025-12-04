import { useCallback, useState, useRef } from 'react';
import { streamChat, type StreamChatCallbacks } from '../../../services/conversationService';
import type {
  ConversationSSEEvent,
  ChatStreamRequest,
  PlanningState,
  SkillExecution,
  StructuredResponse,
} from '../types';
import type { Citation } from '@axira/shared/types';

export interface UseConversationStreamOptions {
  tenantId: string;
  userId: string;
  workspaceId?: string;
}

export interface ConversationStreamState {
  events: ConversationSSEEvent[];
  isStreaming: boolean;
  error: Error | null;
  streamingText: string;
  finalAnswer: string | null;
  planningState: PlanningState | null;
  skillsExecuted: SkillExecution[];
  structuredResponse: StructuredResponse | null;
  citations: Citation[];
  evidencePackId: string | null;
  isDone: boolean;
}

export interface UseConversationStreamReturn extends ConversationStreamState {
  sendMessage: (
    conversationId: string,
    message: string,
    options?: {
      subjectKey?: string;
      subjectKind?: string;
      branchId?: string;
      bankerId?: string;
      attachments?: ChatStreamRequest['userMessage']['attachments'];
    }
  ) => void;
  reset: () => void;
  abort: () => void;
}

const initialState: ConversationStreamState = {
  events: [],
  isStreaming: false,
  error: null,
  streamingText: '',
  finalAnswer: null,
  planningState: null,
  skillsExecuted: [],
  structuredResponse: null,
  citations: [],
  evidencePackId: null,
  isDone: false,
};

export function useConversationStream(
  options: UseConversationStreamOptions
): UseConversationStreamReturn {
  const [state, setState] = useState<ConversationStreamState>(initialState);
  const abortControllerRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setState((prev) => ({ ...prev, isStreaming: false }));
  }, []);

  const sendMessage = useCallback(
    (
      conversationId: string,
      message: string,
      messageOptions?: {
        subjectKey?: string;
        subjectKind?: string;
        branchId?: string;
        bankerId?: string;
        attachments?: ChatStreamRequest['userMessage']['attachments'];
      }
    ) => {
      // Abort any existing stream
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Reset state and start streaming
      setState({
        ...initialState,
        isStreaming: true,
      });

      const request: ChatStreamRequest = {
        userMessage: {
          role: 'USER',
          text: message,
          visibleToEndUser: true,
          attachments: messageOptions?.attachments,
        },
        subjectKey: messageOptions?.subjectKey,
        subjectKind: messageOptions?.subjectKind,
        workspaceId: options.workspaceId,
        branchId: messageOptions?.branchId,
        bankerId: messageOptions?.bankerId,
      };

      const callbacks: StreamChatCallbacks = {
        onEvent: (event) => {
          setState((prev) => {
            const newState = { ...prev };
            newState.events = [...prev.events, event];

            // Handle various event types from the backend
            // The backend sends snake_case types like 'planner.update', 'graph_started', etc.
            const eventType = event.type?.toLowerCase?.() || event.type;

            switch (eventType) {
              // Token streaming
              case 'token':
              case 'TOKEN':
                if ('text' in event && event.text) {
                  newState.streamingText = prev.streamingText + event.text;
                }
                break;

              // Graph lifecycle events
              case 'graph_started':
                // Initial event - update planning state with agent info
                newState.planningState = {
                  businessAgentId: event.businessAgentId,
                  processAgentKey: event.processAgentKey,
                  stage: 'started',
                };
                break;

              case 'graph_completed':
                // Stream completed
                newState.isDone = true;
                newState.isStreaming = false;
                break;

              // Planner events
              case 'planner.update':
              case 'planner_step':
              case 'PLANNER_STEP':
                newState.planningState = {
                  businessAgentId: event.businessAgentId,
                  businessAgentName: (event as Record<string, unknown>).businessAgentName as string | undefined,
                  processAgentKey: event.processAgentKey,
                  processAgentName: (event as Record<string, unknown>).processAgentName as string | undefined,
                  stage: (event as Record<string, unknown>).stage as string | undefined || 'planning',
                  summary: (event as Record<string, unknown>).summary as string | undefined,
                };
                break;

              // Node/skill execution events
              case 'node.status':
                // Skill execution status
                if ((event as Record<string, unknown>).skillId || (event as Record<string, unknown>).skillName) {
                  const skillExecution: SkillExecution = {
                    skillId: ((event as Record<string, unknown>).skillId as string) || ((event as Record<string, unknown>).nodeId as string) || '',
                    skillName: (event as Record<string, unknown>).skillName as string | undefined,
                    status: ((event as Record<string, unknown>).status as string) === 'SUCCESS' ? 'SUCCESS' :
                           ((event as Record<string, unknown>).status as string) === 'FAILED' ? 'FAILED' : 'RUNNING',
                    durationMs: (event as Record<string, unknown>).durationMs as number | undefined,
                  };

                  const existingIndex = prev.skillsExecuted.findIndex(
                    (s) => s.skillId === skillExecution.skillId
                  );

                  if (existingIndex >= 0) {
                    const updated = [...prev.skillsExecuted];
                    updated[existingIndex] = skillExecution;
                    newState.skillsExecuted = updated;
                  } else {
                    newState.skillsExecuted = [...prev.skillsExecuted, skillExecution];
                  }
                }
                break;

              case 'skill_selected':
              case 'SKILL_SELECTED': {
                const payload = (event as Record<string, unknown>).payload as Record<string, unknown> | undefined;
                const skillExecution: SkillExecution = {
                  skillId: (payload?.skillId as string) || event.skillKey || '',
                  skillName: payload?.skillName as string | undefined,
                  status: (payload?.status as 'RUNNING' | 'SUCCESS' | 'FAILED') || 'RUNNING',
                  durationMs: payload?.durationMs as number | undefined,
                };

                const existingIndex = prev.skillsExecuted.findIndex(
                  (s) => s.skillId === skillExecution.skillId
                );

                if (existingIndex >= 0) {
                  const updated = [...prev.skillsExecuted];
                  updated[existingIndex] = skillExecution;
                  newState.skillsExecuted = updated;
                } else {
                  newState.skillsExecuted = [...prev.skillsExecuted, skillExecution];
                }
                break;
              }

              // LLM token events (for metrics/display)
              case 'llm.tokens':
                // Could track token usage if needed
                break;

              // Debug events
              case 'debug_log':
                // Could log or display debug info
                break;

              // Final answer
              case 'final_answer':
              case 'FINAL_ANSWER': {
                const text = ('text' in event ? event.text : (event as Record<string, unknown>).message) as string;
                const payload = (event as Record<string, unknown>).payload as Record<string, unknown> | undefined;

                if (text) {
                  newState.finalAnswer = text;
                  newState.streamingText = text;
                }
                if (payload?.structuredResponse) {
                  newState.structuredResponse = payload.structuredResponse as StructuredResponse;
                }
                if (payload?.citations) {
                  newState.citations = payload.citations as Citation[];
                }
                if (event.evidencePackId) {
                  newState.evidencePackId = event.evidencePackId;
                }
                break;
              }

              case 'done':
              case 'DONE':
                newState.isDone = true;
                newState.isStreaming = false;
                if (event.evidencePackId) {
                  newState.evidencePackId = event.evidencePackId;
                }
                break;

              case 'error':
              case 'ERROR': {
                const payload = (event as Record<string, unknown>).payload as Record<string, unknown> | undefined;
                const text = ('text' in event ? event.text : (event as Record<string, unknown>).message) as string;
                newState.error = new Error(
                  (payload?.details as string) || text || 'Unknown error'
                );
                break;
              }

              default:
                // Log unknown event types for debugging
                console.log('Unknown SSE event type:', eventType, event);
                break;
            }

            return newState;
          });
        },

        onError: (error) => {
          setState((prev) => ({
            ...prev,
            error,
            isStreaming: false,
          }));
        },

        onComplete: () => {
          setState((prev) => ({
            ...prev,
            isStreaming: false,
            isDone: true,
          }));
          abortControllerRef.current = null;
        },
      };

      // Start streaming
      const controller = streamChat(
        conversationId,
        request,
        callbacks,
        {
          tenantId: options.tenantId,
          userId: options.userId,
          workspaceId: options.workspaceId,
        }
      );

      abortControllerRef.current = controller;
    },
    [options.tenantId, options.userId, options.workspaceId]
  );

  return {
    ...state,
    sendMessage,
    reset,
    abort,
  };
}
