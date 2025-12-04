import { useCallback, useState, useRef } from 'react';
import type {
  StreamEvent,
  PlannerUpdateEvent,
  NodeStatusEvent,
  FinalAnswerEvent,
  GraphCompletedEvent,
  OrchestrationRequest,
} from '../types/streaming';

export interface UseOrchestrationStreamOptions {
  tenantId: string;
  userId: string;
  workspaceId?: string;
  serviceToken?: string;
  baseUrl?: string;
}

export interface OrchestrationStreamState {
  events: StreamEvent[];
  isStreaming: boolean;
  error: Error | null;
  finalAnswer: string | null;
  planningState: PlannerUpdateEvent | null;
  skillsExecuted: NodeStatusEvent[];
  completedState: GraphCompletedEvent | null;
}

export interface UseOrchestrationStreamReturn extends OrchestrationStreamState {
  sendMessage: (
    businessAgentKey: string,
    message: string,
    subject?: Record<string, unknown>
  ) => Promise<void>;
  reset: () => void;
  abort: () => void;
}

// Use empty string to leverage Vite proxy in development
// In production, this would be set via environment variable
const ORCHESTRATOR_BASE_URL = '';

export function useOrchestrationStream(
  options: UseOrchestrationStreamOptions
): UseOrchestrationStreamReturn {
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [finalAnswer, setFinalAnswer] = useState<string | null>(null);
  const [planningState, setPlanningState] = useState<PlannerUpdateEvent | null>(null);
  const [skillsExecuted, setSkillsExecuted] = useState<NodeStatusEvent[]>([]);
  const [completedState, setCompletedState] = useState<GraphCompletedEvent | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    setEvents([]);
    setError(null);
    setFinalAnswer(null);
    setPlanningState(null);
    setSkillsExecuted([]);
    setCompletedState(null);
  }, []);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const sendMessage = useCallback(
    async (
      businessAgentKey: string,
      message: string,
      subject?: Record<string, unknown>
    ) => {
      // Abort any existing stream
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Reset state
      reset();
      setIsStreaming(true);

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const requestId = crypto.randomUUID();
      const baseUrl = options.baseUrl || ORCHESTRATOR_BASE_URL;

      const requestBody: OrchestrationRequest = {
        request_id: requestId,
        business_agent_key: businessAgentKey,
        user_id: options.userId,
        tenant_id: options.tenantId,
        workspace_id: options.workspaceId,
        message,
        subject: subject || {},
      };

      try {
        const response = await fetch(`${baseUrl}/orchestration/run/stream-events`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/x-ndjson',
            'X-Tenant-Id': options.tenantId,
            'X-User-Id': options.userId,
            ...(options.workspaceId && { 'X-Workspace-Id': options.workspaceId }),
            ...(options.serviceToken && { 'X-Service-Token': options.serviceToken }),
          },
          body: JSON.stringify(requestBody),
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`Orchestration request failed: ${response.status} ${response.statusText}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('Response body is not readable');
        }

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.trim()) continue;

            try {
              const event = JSON.parse(line) as StreamEvent;
              setEvents((prev) => [...prev, event]);

              // Update UI state based on event type
              switch (event.type) {
                case 'planner.update':
                  setPlanningState(event as PlannerUpdateEvent);
                  break;
                case 'node.status': {
                  const nodeEvent = event as NodeStatusEvent;
                  if (nodeEvent.node_type === 'skill') {
                    setSkillsExecuted((prev) => {
                      // Update existing or add new
                      const existingIndex = prev.findIndex(
                        (s) => s.node_id === nodeEvent.node_id
                      );
                      if (existingIndex >= 0) {
                        const updated = [...prev];
                        updated[existingIndex] = nodeEvent;
                        return updated;
                      }
                      return [...prev, nodeEvent];
                    });
                  }
                  break;
                }
                case 'final_answer':
                  setFinalAnswer((event as FinalAnswerEvent).message);
                  break;
                case 'graph_completed':
                  setCompletedState(event as GraphCompletedEvent);
                  break;
              }
            } catch (parseError) {
              console.warn('Failed to parse stream event:', line, parseError);
            }
          }
        }

        // Process any remaining buffer
        if (buffer.trim()) {
          try {
            const event = JSON.parse(buffer) as StreamEvent;
            setEvents((prev) => [...prev, event]);
          } catch {
            // Ignore incomplete final line
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          // Stream was intentionally aborted
          return;
        }
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [options, reset]
  );

  return {
    events,
    isStreaming,
    error,
    finalAnswer,
    planningState,
    skillsExecuted,
    completedState,
    sendMessage,
    reset,
    abort,
  };
}
