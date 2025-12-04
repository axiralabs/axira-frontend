// Stream event types from Orchestrator NDJSON streaming endpoint

export interface BaseStreamEvent {
  type: string;
  request_id: string;
  execution_id: string;
}

export interface PlannerUpdateEvent extends BaseStreamEvent {
  type: 'planner.update';
  business_agent_key: string;
  business_agent_name: string | null;
  process_agent_key: string | null;
  process_agent_name: string | null;
  stage: string | null;
  summary: string | null;
  raw: Record<string, unknown>;
}

export interface NodeStatusEvent extends BaseStreamEvent {
  type: 'node.status';
  node_id: string;
  node_type: string | null; // 'skill' | 'planner' | 'decision' | etc.
  status: 'SUCCESS' | 'FAILED' | 'RUNNING';
  skill_id: string | null;
  skill_name: string | null;
  duration_ms: number | null;
  raw: Record<string, unknown>;
}

export interface LlmTokensEvent extends BaseStreamEvent {
  type: 'llm.tokens';
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  model: string;
}

export interface DebugLogEvent extends BaseStreamEvent {
  type: 'debug_log';
  message: string;
  level: string;
}

export interface FinalAnswerEvent extends BaseStreamEvent {
  type: 'final_answer';
  message: string;
  confidence: number | null;
  citations: Citation[];
}

export interface GraphCompletedEvent extends BaseStreamEvent {
  type: 'graph_completed';
  status: 'COMPLETED' | 'FAILED' | 'TIMEOUT';
  total_duration_ms: number;
  tokens_used_total: number;
  skill_call_count: number;
  llm_call_count: number;
}

// Union type of all stream events
export type StreamEvent =
  | PlannerUpdateEvent
  | NodeStatusEvent
  | LlmTokensEvent
  | DebugLogEvent
  | FinalAnswerEvent
  | GraphCompletedEvent;

// Helper type guard functions
export function isPlannerUpdateEvent(event: StreamEvent): event is PlannerUpdateEvent {
  return event.type === 'planner.update';
}

export function isNodeStatusEvent(event: StreamEvent): event is NodeStatusEvent {
  return event.type === 'node.status';
}

export function isLlmTokensEvent(event: StreamEvent): event is LlmTokensEvent {
  return event.type === 'llm.tokens';
}

export function isDebugLogEvent(event: StreamEvent): event is DebugLogEvent {
  return event.type === 'debug_log';
}

export function isFinalAnswerEvent(event: StreamEvent): event is FinalAnswerEvent {
  return event.type === 'final_answer';
}

export function isGraphCompletedEvent(event: StreamEvent): event is GraphCompletedEvent {
  return event.type === 'graph_completed';
}

// Request payload for orchestration
export interface OrchestrationRequest {
  request_id: string;
  business_agent_key: string;
  user_id: string;
  tenant_id: string;
  workspace_id?: string;
  message: string;
  subject?: Record<string, unknown>;
}

// Citation type (used in final_answer)
export interface Citation {
  id: string;
  source: string;
  title: string;
  url?: string;
  snippet?: string;
}
