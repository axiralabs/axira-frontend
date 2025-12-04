import type { Citation } from '@axira/shared/types';

// ============================================================================
// Conversation Types (from Conversation Service)
// ============================================================================

export type ChannelType =
  | 'HOME_CHAT'
  | 'QA_REVIEW'
  | 'CASE_ASSIST'
  | 'CASE_REVIEW'
  | 'INCIDENT_ASSIST'
  | 'WORKFLOW_RUN'
  | 'OTHER';

export type MessageRole = 'USER' | 'ASSISTANT' | 'SYSTEM' | 'TOOL' | 'SKILL';

export interface Conversation {
  id: string;
  subject: string;
  channelType: ChannelType;
  tenantId: string;
  workspaceId: string;
  branchId?: string;
  businessAgentKey?: string;
  businessAgentVersion?: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  archived: boolean;
  highRisk: boolean;
  tags: string[];
  metadata?: ConversationMetadata;
}

export interface ConversationMetadata {
  participantUserIds?: string[];
  primaryCustomerId?: string;
  primaryAccountId?: string;
  caseId?: string;
  originatingSystem?: string;
  languageCode?: string;
  subjectKey?: string;
  subjectKind?: string;
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  role: MessageRole;
  authorId?: string;
  text: string;
  structuredContent?: Record<string, unknown>;
  contentType?: string;
  visibleToEndUser: boolean;
  correlationId?: string;
  createdAt: string;
  updatedAt?: string;
  evidencePackId?: string;
  planSummary?: Record<string, unknown>;
  toolCall?: ToolCallMetadata;
}

export interface ToolCallMetadata {
  skillId?: string;
  skillName?: string;
  executionId?: string;
  status?: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED';
  inputSummary?: string;
  outputSummary?: string;
  durationMs?: number;
}

// ============================================================================
// SSE Stream Event Types (from Conversation Service chat/stream endpoint)
// ============================================================================

export interface BaseSSEEvent {
  type: string;
  source?: string;
  businessAgentId?: string;
  processAgentKey?: string;
  skillKey?: string;
  conversationId: string;
  turnId?: string;
  correlationId?: string;
  planId?: string;
  evidencePackId?: string;
  finalEvent?: boolean;
  createdAt?: string;
}

export interface TokenEvent extends BaseSSEEvent {
  type: 'TOKEN';
  text: string;
}

export interface AssistantMessageEvent extends BaseSSEEvent {
  type: 'ASSISTANT_MESSAGE';
  text: string;
  payload?: Record<string, unknown>;
}

export interface PlannerStepEvent extends BaseSSEEvent {
  type: 'PLANNER_STEP';
  text?: string;
  payload?: {
    step?: string;
    businessAgentName?: string;
    processAgentName?: string;
    stage?: string;
    summary?: string;
  };
}

export interface ProcessAgentSelectedEvent extends BaseSSEEvent {
  type: 'PROCESS_AGENT_SELECTED';
  text?: string;
  payload?: {
    processAgentKey: string;
    processAgentName?: string;
  };
}

export interface SkillSelectedEvent extends BaseSSEEvent {
  type: 'SKILL_SELECTED';
  text?: string;
  payload?: {
    skillId: string;
    skillName?: string;
    status?: 'RUNNING' | 'SUCCESS' | 'FAILED';
    durationMs?: number;
  };
}

export interface ToolCallEvent extends BaseSSEEvent {
  type: 'TOOL_CALL';
  text?: string;
  payload?: {
    toolId: string;
    toolName?: string;
    input?: Record<string, unknown>;
  };
}

export interface ToolResultEvent extends BaseSSEEvent {
  type: 'TOOL_RESULT';
  text?: string;
  payload?: {
    toolId: string;
    status: 'SUCCESS' | 'FAILED';
    output?: Record<string, unknown>;
    error?: string;
  };
}

export interface SearchStepEvent extends BaseSSEEvent {
  type: 'SEARCH_STEP';
  text?: string;
  payload?: {
    query?: string;
    resultCount?: number;
  };
}

export interface FinalAnswerEvent extends BaseSSEEvent {
  type: 'FINAL_ANSWER';
  text: string;
  payload?: {
    structuredResponse?: StructuredResponse;
    citations?: Citation[];
  };
}

export interface DoneEvent extends BaseSSEEvent {
  type: 'DONE';
  finalEvent: true;
}

export interface ErrorEvent extends BaseSSEEvent {
  type: 'ERROR';
  text: string;
  payload?: {
    code?: string;
    details?: string;
  };
}

export type ConversationSSEEvent =
  | TokenEvent
  | AssistantMessageEvent
  | PlannerStepEvent
  | ProcessAgentSelectedEvent
  | SkillSelectedEvent
  | ToolCallEvent
  | ToolResultEvent
  | SearchStepEvent
  | FinalAnswerEvent
  | DoneEvent
  | ErrorEvent;

// ============================================================================
// Request/Response DTOs
// ============================================================================

export interface CreateConversationRequest {
  subject: string;
  channelType: ChannelType;
  workspaceId: string;
  branchId?: string;
  primaryCustomerId?: string;
  primaryAccountId?: string;
  caseId?: string;
  originatingSystem?: string;
  tags?: string[];
  participantUserIds?: string[];
  languageCode?: string;
  highRisk?: boolean;
  businessAgentKey?: string;
  businessAgentVersion?: string;
  initialMessage?: {
    role: MessageRole;
    text: string;
    structuredContent?: Record<string, unknown>;
    contentType?: string;
  };
}

export interface ChatStreamRequest {
  userMessage: {
    role: 'USER';
    text: string;
    structuredContent?: Record<string, unknown>;
    contentType?: string;
    visibleToEndUser: boolean;
    correlationId?: string;
    attachments?: AttachmentReference[];
    toolCall?: ToolCallMetadata;
  };
  agentIdOverride?: string;
  runtimeContext?: Record<string, unknown>;
  streamTimeoutMillis?: number;
  subjectKey?: string;
  subjectKind?: string;
  workspaceId?: string;
  branchId?: string;
  bankerId?: string;
  historySummary?: Record<string, unknown>;
}

export interface AttachmentReference {
  attachmentId: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  checksum?: string;
}

// ============================================================================
// Structured Response Types
// ============================================================================

export type StatusType = 'PASS' | 'WARNING' | 'FAIL' | 'DENIED';

export interface StructuredResponse {
  summaryItems: SummaryItem[];
  citations: Citation[];
  availableActions: ActionButton[];
}

export interface SummaryItem {
  status: StatusType;
  message: string;
  details?: string;
  resourceRef?: string;
}

export interface ActionButton {
  id: string;
  label: string;
  actionType: 'CREATE_CASE' | 'NOTIFY' | 'ESCALATE' | 'EXPLAIN' | 'CUSTOM';
  variant: 'primary' | 'secondary' | 'ghost' | 'destructive';
  disabled?: boolean;
  data?: Record<string, unknown>;
}

// ============================================================================
// Evidence Types (from Evidence Service)
// ============================================================================

export interface EvidencePack {
  pack: EvidencePackInfo;
  nodes: EvidenceNode[];
  edges: EvidenceEdge[];
  totalNodes: number;
  totalEdges: number;
}

export interface EvidencePackInfo {
  id: string;
  subject: EvidenceSubject;
  scope: EvidenceScope;
  finalized: boolean;
  createdAt: string;
  finalizedAt?: string;
  blobReference?: string;
  outcome?: EvidenceOutcome;
}

export interface EvidenceSubject {
  subjectType: string;
  subjectId: string;
}

export interface EvidenceScope {
  tenantId: string;
  bankId: string;
  workspaceId?: string;
  agentId?: string;
  processId?: string;
  runId?: string;
}

export interface EvidenceOutcome {
  status: 'PASS' | 'WARNING' | 'FAIL';
  summaryMessage?: string;
  exceptionCount?: number;
  warningCount?: number;
}

export interface EvidenceNode {
  id: string;
  packId: string;
  evidenceType: 'SEARCH_RESULT' | 'SKILL_EXECUTION' | 'POLICY_DECISION' | 'MESSAGE' | 'SYSTEM_EVENT';
  description?: string;
  sourceSystem?: string;
  occurredAt?: string;
  recordedAt: string;
  attributes?: Record<string, unknown>;
}

export interface EvidenceEdge {
  from: string;
  to: string;
  relationType: 'CAUSED_BY' | 'SUPPORTS' | 'DERIVED_FROM' | 'ATTACHED_TO' | 'NEXT';
  createdAt: string;
}

export interface HashChainEntry {
  chainId: string;
  sequenceNumber: number;
  previousHash: string;
  hash: string;
  evidenceId: string;
  createdAt: string;
}

// ============================================================================
// UI State Types
// ============================================================================

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  conversationId?: string;
  evidencePackId?: string;
  planningState?: PlanningState | null;
  skillsExecuted?: SkillExecution[];
  structuredResponse?: StructuredResponse;
  citations?: Citation[];
}

export interface PlanningState {
  businessAgentId?: string;
  businessAgentName?: string;
  processAgentKey?: string;
  processAgentName?: string;
  stage?: string;
  summary?: string;
}

export interface SkillExecution {
  skillId: string;
  skillName?: string;
  status: 'RUNNING' | 'SUCCESS' | 'FAILED';
  durationMs?: number;
}

export interface AgentOption {
  key: string;
  name: string;
  description?: string;
}

export interface SubjectContext {
  subjectKey: string;
  subjectKind: string;
  displayName: string;
}

// ============================================================================
// Conversation List Item (for sidebar)
// ============================================================================

export interface ConversationListItem {
  id: string;
  subject: string;
  channelType: ChannelType;
  businessAgentKey?: string;
  lastMessagePreview?: string;
  updatedAt: string;
  messageCount?: number;
  archived: boolean;
}
