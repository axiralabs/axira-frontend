import type {
  Conversation,
  ConversationMessage,
  CreateConversationRequest,
  ChatStreamRequest,
  ConversationSSEEvent,
  ConversationListItem,
} from '../features/chat/types';

const BASE_URL = import.meta.env.VITE_CONVERSATION_SERVICE_URL || '';

interface RequestOptions {
  tenantId: string;
  userId: string;
  workspaceId?: string;
}

function buildHeaders(options: RequestOptions): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'X-Tenant-Id': options.tenantId,
    'X-User-Id': options.userId,
    ...(options.workspaceId && { 'X-Workspace-Id': options.workspaceId }),
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`API error ${response.status}: ${errorText}`);
  }
  return response.json();
}

// ============================================================================
// Conversation CRUD Operations
// ============================================================================

// Response from the backend create endpoint
interface CreateConversationResponse {
  conversationId: string;
  subject: string;
  channelType: string;
  tenantId: string;
  workspaceId: string;
  createdByUserId: string;
  createdAt: string;
  businessAgentKey?: string;
  businessAgentVersion?: string;
}

export async function createConversation(
  request: CreateConversationRequest,
  options: RequestOptions
): Promise<Conversation> {
  const response = await fetch(`${BASE_URL}/api/conversations`, {
    method: 'POST',
    headers: buildHeaders(options),
    body: JSON.stringify(request),
  });
  const data = await handleResponse<CreateConversationResponse>(response);

  // Transform response to match Conversation type
  return {
    id: data.conversationId,
    subject: data.subject,
    channelType: data.channelType as Conversation['channelType'],
    tenantId: data.tenantId,
    workspaceId: data.workspaceId,
    businessAgentKey: data.businessAgentKey,
    businessAgentVersion: data.businessAgentVersion,
    createdAt: data.createdAt,
    updatedAt: data.createdAt,
    archived: false,
    highRisk: false,
    tags: [],
  };
}

export async function getConversation(
  conversationId: string,
  options: RequestOptions,
  includeMessages = false
): Promise<Conversation> {
  const url = new URL(`${BASE_URL}/api/conversations/${conversationId}`);
  if (includeMessages) {
    url.searchParams.set('includeMessages', 'true');
  }
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: buildHeaders(options),
  });
  return handleResponse<Conversation>(response);
}

export async function listConversations(
  options: RequestOptions & {
    channelType?: string;
    branchId?: string;
    tags?: string[];
    highRiskOnly?: boolean;
    subjectContains?: string;
    updatedAfter?: string;
    page?: number;
    size?: number;
  }
): Promise<{ conversations: ConversationListItem[]; totalCount: number }> {
  const url = new URL(`${BASE_URL}/api/conversations`);

  if (options.channelType) url.searchParams.set('channelType', options.channelType);
  if (options.workspaceId) url.searchParams.set('workspaceId', options.workspaceId);
  if (options.branchId) url.searchParams.set('branchId', options.branchId);
  if (options.tags?.length) url.searchParams.set('tags', options.tags.join(','));
  if (options.highRiskOnly) url.searchParams.set('highRiskOnly', 'true');
  if (options.subjectContains) url.searchParams.set('subjectContains', options.subjectContains);
  if (options.updatedAfter) url.searchParams.set('updatedAfter', options.updatedAfter);
  if (options.page !== undefined) url.searchParams.set('page', options.page.toString());
  if (options.size !== undefined) url.searchParams.set('size', options.size.toString());

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: buildHeaders(options),
  });
  return handleResponse(response);
}

export async function archiveConversation(
  conversationId: string,
  options: RequestOptions
): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/conversations/${conversationId}/archive`, {
    method: 'POST',
    headers: buildHeaders(options),
  });
  if (!response.ok) {
    throw new Error(`Failed to archive conversation: ${response.status}`);
  }
}

export async function deleteConversation(
  conversationId: string,
  options: RequestOptions
): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/conversations/${conversationId}`, {
    method: 'DELETE',
    headers: buildHeaders(options),
  });
  if (!response.ok) {
    throw new Error(`Failed to delete conversation: ${response.status}`);
  }
}

// ============================================================================
// Message Operations
// ============================================================================

export async function getMessages(
  conversationId: string,
  options: RequestOptions & {
    limit?: number;
    before?: string;
  }
): Promise<ConversationMessage[]> {
  const url = new URL(`${BASE_URL}/api/conversations/${conversationId}/messages`);
  if (options.limit) url.searchParams.set('limit', options.limit.toString());
  if (options.before) url.searchParams.set('before', options.before);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: buildHeaders(options),
  });
  return handleResponse<ConversationMessage[]>(response);
}

// ============================================================================
// SSE Streaming Chat
// ============================================================================

export interface StreamChatCallbacks {
  onEvent: (event: ConversationSSEEvent) => void;
  onError: (error: Error) => void;
  onComplete: () => void;
}

/**
 * Stream chat messages via Server-Sent Events.
 *
 * The Conversation Service returns SSE in standard format:
 * ```
 * event: TOKEN
 * data: {"type":"TOKEN","text":"Hello",...}
 *
 * event: FINAL_ANSWER
 * data: {"type":"FINAL_ANSWER","text":"...",...}
 * ```
 *
 * @returns AbortController to cancel the stream
 */
export function streamChat(
  conversationId: string,
  request: ChatStreamRequest,
  callbacks: StreamChatCallbacks,
  options: RequestOptions
): AbortController {
  const abortController = new AbortController();

  (async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/conversations/${conversationId}/chat/stream`,
        {
          method: 'POST',
          headers: {
            ...buildHeaders(options),
            Accept: 'text/event-stream',
          },
          body: JSON.stringify(request),
          signal: abortController.signal,
        }
      );

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`Stream request failed: ${response.status} - ${errorText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let currentEventType = '';
      let currentData = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          // Parse SSE format
          if (line.startsWith('event:')) {
            currentEventType = line.slice(6).trim();
          } else if (line.startsWith('data:')) {
            currentData = line.slice(5).trim();
          } else if (line === '' && currentData) {
            // Empty line = end of event, process it
            try {
              const parsed = JSON.parse(currentData) as ConversationSSEEvent;
              // Use event type from SSE if present, otherwise from data
              if (currentEventType && !parsed.type) {
                (parsed as { type: string }).type = currentEventType;
              }
              callbacks.onEvent(parsed);
            } catch (parseError) {
              console.warn('Failed to parse SSE data:', currentData, parseError);
            }
            currentEventType = '';
            currentData = '';
          }
        }
      }

      // Process any remaining data in buffer
      if (currentData) {
        try {
          const parsed = JSON.parse(currentData) as ConversationSSEEvent;
          callbacks.onEvent(parsed);
        } catch {
          // Ignore incomplete data at end
        }
      }

      callbacks.onComplete();
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Stream was intentionally aborted
        callbacks.onComplete();
        return;
      }
      callbacks.onError(error instanceof Error ? error : new Error('Unknown error'));
    }
  })();

  return abortController;
}

// ============================================================================
// Convenience Exports
// ============================================================================

export const conversationService = {
  createConversation,
  getConversation,
  listConversations,
  archiveConversation,
  deleteConversation,
  getMessages,
  streamChat,
};

export default conversationService;
