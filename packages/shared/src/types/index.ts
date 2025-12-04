// User context from Trust Graph
export interface UserContext {
  userId: string;
  orgId: string;
  workspaceId: string;
  displayName: string;
  roles: string[];
  branch?: {
    id: string;
    name: string;
  };
  resourceSet: ResourceSet;
}

export interface ResourceSet {
  allowedSubjectKinds: string[];
  allowedBranches: string[];
  allowedProductTypes: string[];
  policyPacks: string[];
}

// Chat message types
export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  metadata?: MessageMetadata;
}

export interface MessageMetadata {
  subjectReferences: SubjectReference[];
  planningContext?: PlanningContext;
  structuredResponse?: StructuredResponse;
  accessDenials?: AccessDenial[];
}

export interface SubjectReference {
  subjectKey: string;
  subjectKind: string;
  displayName: string;
}

export interface PlanningContext {
  currentStep: string;
  currentAgent: string;
  steps: PlanningStep[];
}

export interface PlanningStep {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  agentId?: string;
}

// Structured response types
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
}

export interface Citation {
  id: string;
  source: string;
  title: string;
  url?: string;
  snippet?: string;
}

export interface ActionButton {
  id: string;
  label: string;
  action: string;
  variant: 'primary' | 'secondary' | 'destructive';
  disabled?: boolean;
}

export interface AccessDenial {
  resourceId: string;
  reason: string;
}

// Episode and conversation types
export interface Episode {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'completed' | 'archived';
  subjectKey?: string;
}

export interface ConversationChannel {
  id: string;
  name: string;
  type: 'chat' | 'embedded' | 'api';
  createdAt: string;
}

// Process Agent types (for Studio)
export type AgentStatus = 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED' | 'ARCHIVED';

export interface ProcessAgent {
  id: string;
  name: string;
  description: string;
  version: string;
  status: AgentStatus;
  workflow: Workflow;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Workflow {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export type NodeType = 'TRIGGER' | 'SKILL' | 'GATEWAY' | 'GUARD' | 'OUTPUT';

export interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  position: { x: number; y: number };
  config: Record<string, unknown>;
  skillBinding?: SkillBinding;
}

export interface SkillBinding {
  skillId: string;
  parameters: Record<string, unknown>;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  condition?: string;
}

// Skill types
export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  inputSchema: Record<string, unknown>;
  outputSchema: Record<string, unknown>;
  version: string;
}

// Evidence types
export interface EvidencePack {
  id: string;
  caseId: string;
  items: EvidenceItem[];
  createdAt: string;
}

export interface EvidenceItem {
  id: string;
  type: string;
  source: string;
  content: string;
  timestamp: string;
  citations: Citation[];
}

// Demo IDs for consistent testing
export const DEMO_IDS = {
  org: 'lsnb-001',
  workspace: 'lsnb-main',
  users: {
    maya: 'maya-chen-001',
    qaReviewer: 'carlos-martinez-001',
    opsLead: 'sarah-johnson-001',
    itAdmin: 'mike-thompson-001',
  },
  customers: {
    garcia: 'garcia-household-001',
  },
  accounts: {
    garciaDDA: 'garcia-dda-1234',
    garciaSavings: 'garcia-savings-5678',
  },
  agents: {
    branchBanker: 'branch-banker-assistant-001',
    qaReviewer: 'qa-reviewer-agent-001',
    docPresence: 'doc-presence-check-001',
  },
} as const;

// Re-export streaming types
export * from './streaming';
