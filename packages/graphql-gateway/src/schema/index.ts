import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadSchema(filename: string): string {
  return readFileSync(join(__dirname, filename), 'utf-8');
}

export const typeDefs = `#graphql
  scalar JSON
  scalar DateTime

  type Query {
    # User & Auth
    me: User

    # Conversations
    episodes(first: Int, after: String): EpisodeConnection!
    episode(id: ID!): Episode
    messages(episodeId: ID!, first: Int, after: String): MessageConnection!

    # Agents
    agents(status: AgentStatus, first: Int, after: String): ProcessAgentConnection!
    agent(id: ID!): ProcessAgent

    # Skills
    skills(category: String, first: Int, after: String): SkillConnection!
    skill(id: ID!): Skill

    # Evidence
    evidencePack(caseId: ID!): EvidencePack
  }

  type Mutation {
    # Conversations
    sendMessage(input: SendMessageInput!): SendMessagePayload!
    createEpisode(input: CreateEpisodeInput!): Episode!

    # Agents
    createAgent(input: CreateAgentInput!): ProcessAgent!
    updateAgent(id: ID!, input: UpdateAgentInput!): ProcessAgent!
    publishAgent(id: ID!): ProcessAgent!

    # Skills
    executeSkill(input: ExecuteSkillInput!): SkillExecutionResult!
  }

  type Subscription {
    messageStream(episodeId: ID!): MessageStreamEvent!
  }

  # User types
  type User {
    userId: ID!
    displayName: String!
    roles: [String!]!
    branch: Branch
    resourceSet: ResourceSet!
  }

  type Branch {
    id: ID!
    name: String!
  }

  type ResourceSet {
    allowedSubjectKinds: [String!]!
    allowedBranches: [String!]!
    allowedProductTypes: [String!]!
    policyPacks: [String!]!
  }

  # Episode & Message types
  type Episode {
    id: ID!
    title: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    status: EpisodeStatus!
    subjectKey: String
    messages(first: Int, after: String): MessageConnection!
  }

  enum EpisodeStatus {
    ACTIVE
    COMPLETED
    ARCHIVED
  }

  type Message {
    id: ID!
    role: MessageRole!
    content: String!
    timestamp: DateTime!
    metadata: MessageMetadata
  }

  enum MessageRole {
    USER
    ASSISTANT
  }

  type MessageMetadata {
    subjectReferences: [SubjectReference!]!
    planningContext: PlanningContext
    structuredResponse: StructuredResponse
    accessDenials: [AccessDenial!]
  }

  type SubjectReference {
    subjectKey: String!
    subjectKind: String!
    displayName: String!
  }

  type PlanningContext {
    currentStep: String!
    currentAgent: String!
    steps: [PlanningStep!]!
  }

  type PlanningStep {
    id: ID!
    name: String!
    status: StepStatus!
    agentId: String
  }

  enum StepStatus {
    PENDING
    IN_PROGRESS
    COMPLETED
    FAILED
  }

  type StructuredResponse {
    summaryItems: [SummaryItem!]!
    citations: [Citation!]!
    availableActions: [ActionButton!]!
  }

  type SummaryItem {
    status: StatusType!
    message: String!
    details: String
  }

  enum StatusType {
    PASS
    WARNING
    FAIL
    DENIED
  }

  type Citation {
    id: ID!
    source: String!
    title: String!
    url: String
    snippet: String
  }

  type ActionButton {
    id: ID!
    label: String!
    action: String!
    variant: ButtonVariant!
    disabled: Boolean
  }

  enum ButtonVariant {
    PRIMARY
    SECONDARY
    DESTRUCTIVE
  }

  type AccessDenial {
    resourceId: String!
    reason: String!
  }

  # Process Agent types
  type ProcessAgent {
    id: ID!
    name: String!
    description: String!
    version: String!
    status: AgentStatus!
    workflow: Workflow!
    createdAt: DateTime!
    updatedAt: DateTime!
    createdBy: String!
  }

  enum AgentStatus {
    DRAFT
    IN_REVIEW
    PUBLISHED
    ARCHIVED
  }

  type Workflow {
    nodes: [WorkflowNode!]!
    edges: [WorkflowEdge!]!
  }

  type WorkflowNode {
    id: ID!
    type: NodeType!
    label: String!
    position: Position!
    config: JSON
    skillBinding: SkillBinding
  }

  enum NodeType {
    TRIGGER
    SKILL
    GATEWAY
    GUARD
    OUTPUT
  }

  type Position {
    x: Float!
    y: Float!
  }

  type SkillBinding {
    skillId: String!
    parameters: JSON
  }

  type WorkflowEdge {
    id: ID!
    source: String!
    target: String!
    label: String
    condition: String
  }

  # Skill types
  type Skill {
    id: ID!
    name: String!
    description: String!
    category: String!
    version: String!
    inputSchema: JSON!
    outputSchema: JSON!
  }

  type SkillExecutionResult {
    success: Boolean!
    output: JSON
    error: String
  }

  # Evidence types
  type EvidencePack {
    id: ID!
    caseId: ID!
    createdAt: DateTime!
    items: [EvidenceItem!]!
  }

  type EvidenceItem {
    id: ID!
    type: String!
    source: String!
    content: String!
    timestamp: DateTime!
    citations: [Citation!]!
  }

  # Pagination types
  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  type EpisodeConnection {
    edges: [EpisodeEdge!]!
    pageInfo: PageInfo!
  }

  type EpisodeEdge {
    node: Episode!
    cursor: String!
  }

  type MessageConnection {
    edges: [MessageEdge!]!
    pageInfo: PageInfo!
  }

  type MessageEdge {
    node: Message!
    cursor: String!
  }

  type ProcessAgentConnection {
    edges: [ProcessAgentEdge!]!
    pageInfo: PageInfo!
  }

  type ProcessAgentEdge {
    node: ProcessAgent!
    cursor: String!
  }

  type SkillConnection {
    edges: [SkillEdge!]!
    pageInfo: PageInfo!
  }

  type SkillEdge {
    node: Skill!
    cursor: String!
  }

  # Subscription types
  type MessageStreamEvent {
    chunk: String
    isComplete: Boolean!
    planningUpdate: PlanningUpdate
  }

  type PlanningUpdate {
    currentStep: String!
    currentAgent: String!
  }

  # Input types
  input SendMessageInput {
    episodeId: ID
    content: String!
    subjectKey: String
  }

  type SendMessagePayload {
    message: Message!
    episodeId: ID!
  }

  input CreateEpisodeInput {
    title: String
    subjectKey: String
  }

  input CreateAgentInput {
    name: String!
    description: String!
    workflow: WorkflowInput!
  }

  input UpdateAgentInput {
    name: String
    description: String
    workflow: WorkflowInput
  }

  input WorkflowInput {
    nodes: [WorkflowNodeInput!]!
    edges: [WorkflowEdgeInput!]!
  }

  input WorkflowNodeInput {
    id: ID!
    type: NodeType!
    label: String!
    position: PositionInput!
    config: JSON
    skillBinding: SkillBindingInput
  }

  input PositionInput {
    x: Float!
    y: Float!
  }

  input SkillBindingInput {
    skillId: String!
    parameters: JSON
  }

  input WorkflowEdgeInput {
    id: ID!
    source: String!
    target: String!
    label: String
    condition: String
  }

  input ExecuteSkillInput {
    skillId: ID!
    parameters: JSON!
  }
`;
