# CLAUDE.md - Axira Frontend Development

> **This file instructs Claude Code on how to build Axira Home and Axira Studio frontends.**

## Quick Context

You are building two React/TypeScript frontend applications for **Axira**, a Responsible AI Platform for Community Banks.

- **Axira Home**: End-user app for bankers and QA reviewers (chat, dashboards, evidence viewing)
- **Axira Studio**: Admin/IT app for workflow design and governance (DAG editor, trust graph viz)

Both apps communicate with 8 backend microservices via a **GraphQL Gateway**.

---

## Golden Rules

1. **Always use TypeScript** - strict mode, no `any` types
2. **GraphQL first** - all data fetching via Apollo Client
3. **Tenant isolation** - every request includes orgId/tenantId context
4. **Component composition** - Radix UI primitives + Tailwind CSS
5. **Feature-based structure** - organize by feature, not file type
6. **Accessibility** - ARIA labels, keyboard nav, focus management

---

## Project Structure

```
axira-frontend/
├── packages/
│   ├── shared/                 # Shared across both apps
│   │   ├── components/         # Button, Card, Modal, etc.
│   │   ├── hooks/              # useAuth, useTenant, useDebounce
│   │   ├── graphql/            # Generated types, fragments
│   │   ├── types/              # Shared TypeScript types
│   │   └── utils/              # formatDate, cn(), etc.
│   │
│   ├── axira-home/             # Banker/QA app (:5173)
│   │   └── src/features/
│   │       ├── chat/           # Chat interface
│   │       ├── dashboard/      # QA dashboard
│   │       ├── evidence/       # Evidence viewer
│   │       ├── workqueue/      # Work queue
│   │       └── subjects/       # Subject context
│   │
│   ├── axira-studio/           # Admin/IT app (:5174)
│   │   └── src/features/
│   │       ├── agent-designer/ # DAG workflow editor
│   │       ├── workflow-builder/ # Conversational builder
│   │       ├── trust-graph/    # Trust graph visualizer
│   │       ├── skill-catalog/  # Skill browser
│   │       └── governance/     # Publish/approve flows
│   │
│   └── graphql-gateway/        # BFF (:4000)
│       ├── schema/             # GraphQL schema
│       ├── resolvers/          # Resolver implementations
│       └── datasources/        # Service clients
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + TypeScript 5 |
| Build | Vite |
| Monorepo | Turborepo |
| State | TanStack Query (server), Zustand (client) |
| GraphQL | Apollo Client 3 |
| Routing | React Router v6 |
| UI | Radix UI + Tailwind CSS |
| DAG Editor | ReactFlow |
| Graphs | D3.js, Recharts |
| Forms | React Hook Form + Zod |
| Testing | Vitest + RTL + Playwright |

---

## Backend Services (8 total)

| Service | Port | Purpose | Key Queries/Mutations |
|---------|------|---------|----------------------|
| Trust Graph | 8081 | Auth, permissions, resource sets | `me`, `resourceSet`, `checkAccess` |
| Skills | 8082 | Skill catalog, MCP integration | `skills`, `skill`, `executeSkill` |
| Evidence | 8083 | Audit trail, evidence packs | `evidencePack`, `subjectTimeline` |
| Conversation | 8084 | Chat, messages, channels | `sendMessage`, `messages`, `episodes` |
| Capability Graph | 8085 | Agent-skill mapping | `capabilities`, `agentCapabilities` |
| Agent Catalog | 8086 | BA/PA definitions | `agents`, `processAgents`, `publishAgent` |
| Orchestrator | 8090 | LangGraph runtime | (Called internally) |
| Memory | 8091 | Embeddings, context | `subjectMemory`, `recall` |

---

## Core Types

```typescript
// User context (from Trust Graph)
interface UserContext {
  userId: string;
  orgId: string;
  workspaceId: string;
  displayName: string;
  roles: string[];
  branch?: { id: string; name: string };
  resourceSet: ResourceSet;
}

interface ResourceSet {
  allowedSubjectKinds: string[];
  allowedBranches: string[];
  allowedProductTypes: string[];
  policyPacks: string[];
}

// Chat message
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: MessageMetadata;
}

interface MessageMetadata {
  subjectReferences: SubjectReference[];
  planningContext?: PlanningContext;
  structuredResponse?: StructuredResponse;
  accessDenials?: AccessDenial[];
}

// Structured response in chat
interface StructuredResponse {
  summaryItems: SummaryItem[];
  citations: Citation[];
  availableActions: ActionButton[];
}

interface SummaryItem {
  status: 'PASS' | 'WARNING' | 'FAIL' | 'DENIED';
  message: string;
  details?: string;
}

// Process Agent (for Studio)
interface ProcessAgent {
  id: string;
  name: string;
  version: string;
  status: 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED';
  workflow: Workflow;
}

interface Workflow {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

interface WorkflowNode {
  id: string;
  type: 'TRIGGER' | 'SKILL' | 'GATEWAY' | 'GUARD' | 'OUTPUT';
  position: { x: number; y: number };
  config: Record<string, unknown>;
  skillBinding?: { skillId: string; parameters: Record<string, unknown> };
}
```

---

## GraphQL Patterns

### Always include tenant context:
```typescript
// Apollo Link to add headers
const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    authorization: `Bearer ${getToken()}`,
    'x-tenant-id': getTenantId(),
    'x-workspace-id': getWorkspaceId(),
  },
}));
```

### Query patterns:
```graphql
# Always use fragments for reusable types
fragment MessageFields on Message {
  id
  role
  content
  timestamp
  metadata {
    ...MessageMetadataFields
  }
}

# Paginate lists
query GetMessages($episodeId: ID!, $first: Int, $after: String) {
  messages(episodeId: $episodeId, first: $first, after: $after) {
    edges {
      node { ...MessageFields }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

### Mutation patterns:
```graphql
mutation SendMessage($input: SendMessageInput!) {
  sendMessage(input: $input) {
    message { ...MessageFields }
    episodeId
  }
}
```

### Subscription patterns (for streaming):
```graphql
subscription OnMessageStream($episodeId: ID!) {
  messageStream(episodeId: $episodeId) {
    chunk
    isComplete
    planningUpdate { currentStep currentAgent }
  }
}
```

---

## Component Patterns

### Feature module structure:
```
features/chat/
├── components/
│   ├── ChatContainer.tsx
│   ├── MessageThread.tsx
│   ├── UserMessage.tsx
│   ├── AgentResponse.tsx
│   ├── PlanningIndicator.tsx
│   ├── StructuredResponseCard.tsx
│   ├── CitationList.tsx
│   ├── ActionButtons.tsx
│   └── ExplainPanel.tsx
├── hooks/
│   ├── useConversation.ts
│   ├── useMessageStream.ts
│   └── useExplainability.ts
├── graphql/
│   ├── queries.ts
│   ├── mutations.ts
│   └── subscriptions.ts
├── types.ts
└── index.ts
```

### Component pattern:
```typescript
// ChatContainer.tsx
import { useMemo } from 'react';
import { useConversation } from './hooks/useConversation';
import { MessageThread } from './components/MessageThread';
import { ChatInput } from './components/ChatInput';

interface ChatContainerProps {
  episodeId?: string;
  subjectKey?: string;
}

export function ChatContainer({ episodeId, subjectKey }: ChatContainerProps) {
  const { messages, sendMessage, isLoading } = useConversation(episodeId);
  
  return (
    <div className="flex flex-col h-full">
      <MessageThread messages={messages} />
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}
```

### Hook pattern:
```typescript
// useConversation.ts
import { useQuery, useMutation } from '@apollo/client';
import { GET_MESSAGES, SEND_MESSAGE } from './graphql/queries';

export function useConversation(episodeId?: string) {
  const { data, loading } = useQuery(GET_MESSAGES, {
    variables: { episodeId },
    skip: !episodeId,
  });
  
  const [sendMessageMutation] = useMutation(SEND_MESSAGE, {
    update(cache, { data }) {
      // Optimistic update
    },
  });
  
  return {
    messages: data?.messages?.edges?.map(e => e.node) ?? [],
    isLoading: loading,
    sendMessage: (content: string) => sendMessageMutation({
      variables: { input: { episodeId, content } },
    }),
  };
}
```

---

## Styling Guidelines

### Use Tailwind utility classes:
```tsx
// Good
<div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">

// Avoid inline styles
<div style={{ display: 'flex', alignItems: 'center' }}>
```

### Status colors (consistent across apps):
```typescript
const STATUS_COLORS = {
  PASS: 'text-green-600 bg-green-50',
  WARNING: 'text-yellow-600 bg-yellow-50',
  FAIL: 'text-red-600 bg-red-50',
  DENIED: 'text-gray-600 bg-gray-100',
} as const;
```

### Use cn() for conditional classes:
```typescript
import { cn } from '@/utils/cn';

<button className={cn(
  'px-4 py-2 rounded-md',
  variant === 'primary' && 'bg-blue-600 text-white',
  variant === 'secondary' && 'bg-gray-100 text-gray-900',
  disabled && 'opacity-50 cursor-not-allowed'
)}>
```

---

## Key Demo Flows to Implement

### Pillar 1: Maya's Copilot (Axira Home)
1. User sends natural language query about customer
2. Show planning indicator (which agents/skills running)
3. Display structured response with status badges
4. Show citations with clickable links
5. "How did you decide this?" → opens explain panel
6. Action buttons (Create QA Case, Notify)

### Pillar 2: QA Dashboard (Axira Home)
1. Dashboard with summary metrics (checked, passed, exceptions)
2. Work queue table with filtering/sorting
3. Case detail view with document checklist
4. Evidence pack viewer with timeline
5. Action buttons (Create Incident, Notify Branch)

### Pillar 3: Workflow Builder (Axira Studio)
1. Conversational interface to describe new workflow
2. Agent asks clarifying questions with button choices
3. Shows workflow preview card
4. "Create as Draft" → saves to Agent Catalog
5. DAG editor opens with new agent
6. Governance queue for approval

---

## Implementation Priorities

### Week 1-2: Foundation
- [ ] Set up Turborepo monorepo
- [ ] Create shared component library
- [ ] Set up GraphQL Gateway with basic resolvers
- [ ] Implement auth flow with mock JWT
- [ ] Create navigation shells for both apps

### Week 3-4: Chat Core
- [ ] Message thread with virtual scrolling
- [ ] Send message mutation
- [ ] Streaming subscription
- [ ] Planning indicator component
- [ ] Structured response card

### Week 5-6: Chat Polish + QA
- [ ] Explainability panel
- [ ] Citations and actions
- [ ] QA dashboard with metrics
- [ ] Work queue table
- [ ] Case detail view
- [ ] Evidence pack viewer

### Week 7-8: Studio Core
- [ ] ReactFlow DAG canvas
- [ ] Node types (trigger, skill, gateway, etc.)
- [ ] Properties panel
- [ ] Save/load agent definitions
- [ ] Basic validation

### Week 9-10: Studio Polish
- [ ] Conversational workflow builder
- [ ] Trust graph visualizer (D3)
- [ ] Skill catalog browser
- [ ] Governance queue
- [ ] Publish flow

---

## Common Pitfalls to Avoid

1. **Don't fetch data in components** - use hooks
2. **Don't skip TypeScript generics** - Apollo queries need proper typing
3. **Don't hardcode tenant** - always get from context
4. **Don't forget loading states** - use skeletons
5. **Don't forget error boundaries** - wrap features
6. **Don't skip accessibility** - add ARIA labels
7. **Don't over-fetch** - use fragments, pagination
8. **Don't block on streaming** - use subscriptions properly

---

## Testing Requirements

### Unit tests for:
- Utility functions
- Custom hooks (with renderHook)
- Component rendering

### Integration tests for:
- User flows (send message → receive)
- Form submissions
- Navigation

### E2E tests (Playwright) for:
- Demo flow 1: Maya's cold-open question
- Demo flow 2: QA work queue drill-down
- Demo flow 3: Create workflow via conversation

---

## Environment Variables

```env
# Both apps
VITE_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
VITE_GRAPHQL_WS_ENDPOINT=ws://localhost:4000/graphql
VITE_AUTH_DOMAIN=auth.local

# Axira Home
VITE_APP_NAME=Axira Home
VITE_STUDIO_URL=http://localhost:5174

# Axira Studio
VITE_APP_NAME=Axira Studio
VITE_HOME_URL=http://localhost:5173
```

---

## Quick Commands

```bash
# Install dependencies
pnpm install

# Start all apps (dev)
pnpm dev

# Start specific app
pnpm --filter axira-home dev
pnpm --filter axira-studio dev
pnpm --filter graphql-gateway dev

# Generate GraphQL types
pnpm codegen

# Run tests
pnpm test

# Build all
pnpm build

# Lint
pnpm lint
```

---

## Ask Claude to...

**"Set up the chat feature for Axira Home"**
→ Claude should create the feature structure under `packages/axira-home/src/features/chat/`

**"Create the GraphQL schema for conversations"**
→ Claude should create types.graphql and resolvers in `packages/graphql-gateway/src/schema/conversation/`

**"Build the DAG editor for process agents"**
→ Claude should use ReactFlow, create custom node components, and wire to Agent Catalog service

**"Add the explainability panel"**
→ Claude should create a slide-over component that fetches from Evidence service

**"Implement the QA dashboard"**
→ Claude should create dashboard with summary cards, work queue table, and connect to Evidence service

---

## Reference: Demo Data IDs

Use these consistent IDs for demo scenarios:

```typescript
const DEMO_IDS = {
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
};
```

---

**Now go build Axira! Start with the monorepo setup and shared components.**
