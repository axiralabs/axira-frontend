// Studio Types - Admin Interface
//
// Migration Note (Unified Capability Model):
// The platform is migrating from BA/PA (Business Agent/Process Agent) model
// to a unified Agent → Capability model. Legacy types are marked @deprecated.
// New code should use:
//   - AgentType.UNIFIED instead of 'business' | 'process'
//   - CapabilityType (ATOMIC, COMPOSITE, INTELLIGENT) for capability classification
//   - SemanticCapability instead of ProcessAgentReference

// Re-export build types for workflow
export * from '../build/types';

// ============================================================================
// UNIFIED CAPABILITY MODEL (use these for new code)
// ============================================================================

/**
 * Capability types in the unified model.
 * - ATOMIC: Single skill execution (replaces simple Process Agents)
 * - COMPOSITE: Orchestrated workflow of capabilities (replaces PA with DAG)
 * - INTELLIGENT: LLM-driven dynamic planning (replaces Business Agent routing)
 */
export type CapabilityType = 'ATOMIC' | 'COMPOSITE' | 'INTELLIGENT';

/**
 * Agent types in the unified model.
 * - UNIFIED: Standard agent that can have any capability types bound to it
 * - SYSTEM: Background/infrastructure agents (unchanged)
 * @deprecated 'business' and 'process' are deprecated - use 'unified' for new agents
 */
export type AgentType = 'unified' | 'system' | 'business' | 'process';

/**
 * Unified capability definition - replaces the BA/PA distinction.
 */
export interface CapabilityDefinition {
  id: string;
  key: string;
  name: string;
  description: string;
  capabilityType: CapabilityType;

  // Semantic discovery fields
  domain?: string;
  intent?: string;
  semanticDescription?: string;

  // For ATOMIC: direct skill binding
  boundSkillKey?: string;

  // For COMPOSITE: child capabilities
  childCapabilities?: string[];

  // For INTELLIGENT: planning configuration
  planningConfig?: Record<string, unknown>;

  // Contract
  inputSchema?: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;

  // Governance
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  costBand: 'LOW' | 'MEDIUM' | 'HIGH';
  healthStatus: 'healthy' | 'degraded' | 'unhealthy';

  // Status
  status: 'draft' | 'published' | 'deprecated';
  version: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Agent-to-capability binding in the unified model.
 */
export interface AgentCapabilityBinding {
  id: string;
  agentId: string;
  capabilityId: string;
  priority: number;
  isDefault: boolean;
  conditions?: string[]; // CEL expressions
}

// ============================================================================
// LEGACY TYPES (deprecated - use unified model above for new code)
// ============================================================================

// Agent Catalog Types (common metrics - still valid)
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

/**
 * Agent summary for listing.
 * @deprecated The 'type' field with 'business' | 'process' values is deprecated.
 *             Use AgentType = 'unified' for new agents and CapabilityDefinition
 *             for capability information.
 */
export interface AgentSummary {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'published' | 'deprecated';
  /** @deprecated Use 'unified' for new agents. BA/PA distinction replaced by capabilities. */
  type: 'business' | 'process' | 'unified' | 'system';
  health: AgentHealth;
  metrics: AgentMetrics;
  /** @deprecated Use capabilityCount instead. */
  processAgentCount?: number;
  /** Count of capabilities bound to this agent (unified model). */
  capabilityCount?: number;
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

/**
 * Process Agent with Workflow (detailed for editing).
 * @deprecated Use CapabilityDefinition with capabilityType='COMPOSITE' instead.
 *             This interface will be removed once BA/PA migration is complete.
 */
export interface ProcessAgentDetail extends Omit<AgentSummary, 'processAgentCount'> {
  /** @deprecated Use AgentCapabilityBinding instead of parent relationships. */
  parentBusinessAgentId?: string;
  /** @deprecated Use AgentCapabilityBinding instead of parent relationships. */
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

/**
 * Business Agent with Process Agents.
 * @deprecated Use unified AgentSummary with type='unified' and bound CapabilityDefinitions instead.
 *             The BA→PA relationship is replaced by Agent→Capability bindings.
 */
export interface BusinessAgentDetail extends Omit<AgentSummary, 'type'> {
  /** @deprecated Always 'business' for legacy BA. Use 'unified' for new agents. */
  type: 'business';
  /** @deprecated Use AgentCapabilityBinding to get bound capabilities instead. */
  processAgents: ProcessAgentReference[];
  systemPrompt: string;
  persona: string;
  guardrails: string[];
  /** Bound capabilities for unified agents (new model). */
  capabilities?: CapabilityDefinition[];
}

/**
 * Process Agent reference in BA→PA relationship.
 * @deprecated Use CapabilityDefinition instead. PA becomes a COMPOSITE or ATOMIC capability.
 */
export interface ProcessAgentReference {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'published' | 'deprecated';
  health: AgentHealth;
  skillCount: number;
}
