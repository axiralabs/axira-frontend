// Studio Types - Admin Interface

// Re-export build types for workflow
export * from '../build/types';

// Agent Catalog Types
export interface AgentMetrics {
  totalInvocations: number;
  successRate: number;
  avgLatency: number;
  avgTokensUsed: number;
  feedbackScore: number; // 1-5
  feedbackCount: number;
  lastInvoked: string;
  errorRate: number;
}

export interface AgentHealth {
  status: 'healthy' | 'degraded' | 'unhealthy' | 'offline';
  lastHealthCheck: string;
  issues: string[];
  uptime: number; // percentage
}

export interface AgentVersion {
  version: string;
  publishedAt: string;
  publishedBy: string;
  changeLog: string;
  status: 'draft' | 'published' | 'deprecated';
}

export interface AgentSummary {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'published' | 'deprecated';
  type: 'business' | 'process';
  health: AgentHealth;
  metrics: AgentMetrics;
  processAgentCount?: number;
  skillCount: number;
  connectorCount: number;
  versions: AgentVersion[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags: string[];
}

// Connector Types
export interface ConnectorConfig {
  id: string;
  name: string;
  type: 'core_banking' | 'document' | 'communication' | 'compliance' | 'mcp';
  provider: string;
  status: 'active' | 'inactive' | 'error' | 'pending';
  health: {
    status: 'healthy' | 'degraded' | 'unhealthy';
    latency: number;
    uptime: number;
    lastChecked: string;
  };
  config: Record<string, unknown>;
  credentials?: {
    type: 'api_key' | 'oauth' | 'basic';
    isConfigured: boolean;
  };
  enabledSkills: string[];
  createdAt: string;
  updatedAt: string;
}

// Domain Types
export interface DomainMapping {
  id: string;
  domain: string;
  status: 'active' | 'pending' | 'error';
  sslStatus: 'valid' | 'pending' | 'expired';
  verifiedAt?: string;
  expiresAt?: string;
}

// User Management Types
export interface StudioUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'builder' | 'viewer';
  status: 'active' | 'invited' | 'disabled';
  lastActive: string;
  createdAt: string;
}

// Testing Types
export interface TestRun {
  id: string;
  agentId: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  input: string;
  expectedOutput?: string;
  actualOutput?: string;
  duration?: number;
  createdAt: string;
}

// Studio Navigation
export type StudioSection =
  | 'overview'
  | 'agents'
  | 'agent-builder'
  | 'connectors'
  | 'testing'
  | 'users'
  | 'domains'
  | 'settings';

// Process Agent with Workflow (detailed for editing)
export interface ProcessAgentDetail extends Omit<AgentSummary, 'processAgentCount'> {
  parentBusinessAgentId?: string;
  parentBusinessAgentName?: string;
  workflow: {
    id: string;
    nodes: WorkflowNodeSummary[];
    edges: WorkflowEdgeSummary[];
  };
  skills: SkillBinding[];
  systemPrompt: string;
  guardrails: string[];
}

export interface WorkflowNodeSummary {
  id: string;
  type: 'start' | 'skill' | 'condition' | 'guard' | 'output' | 'agent';
  label: string;
  skillId?: string;
}

export interface WorkflowEdgeSummary {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface SkillBinding {
  skillId: string;
  skillName: string;
  connectorId: string;
  connectorName: string;
  isHealthy: boolean;
}

// Business Agent with Process Agents
export interface BusinessAgentDetail extends Omit<AgentSummary, 'type'> {
  type: 'business';
  processAgents: ProcessAgentReference[];
  systemPrompt: string;
  persona: string;
  guardrails: string[];
}

export interface ProcessAgentReference {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'published' | 'deprecated';
  health: AgentHealth;
  skillCount: number;
}
