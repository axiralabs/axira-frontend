# Axira Frontend

> Modern React/TypeScript monorepo for the Axira Responsible AI Platform for Community Banks

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff.svg)](https://vitejs.dev/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.0-000.svg)](https://turbo.build/)
[![pnpm](https://img.shields.io/badge/pnpm-9.0-f69220.svg)](https://pnpm.io/)

## Overview

Axira Frontend is a monorepo containing two React applications and a shared component library that power the Axira platform - a Responsible AI system designed to amplify human judgment in community banking operations.

### Applications

| Application | Port | Description |
|-------------|------|-------------|
| **Axira Home** | 5173 | End-user application for bankers and QA reviewers - chat interface, dashboards, evidence viewing |
| **Axira Studio** | 5174 | Admin/IT application for workflow design, agent management, and governance |
| **GraphQL Gateway** | 4000 | Backend-for-Frontend (BFF) layer that aggregates backend microservices |

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface                            │
│  ┌─────────────────────┐       ┌─────────────────────────────┐  │
│  │    Axira Home       │       │      Axira Studio           │  │
│  │    (Port 5173)      │       │      (Port 5174)            │  │
│  │                     │       │                             │  │
│  │  • Chat Interface   │       │  • DAG Workflow Editor      │  │
│  │  • QA Dashboard     │       │  • Agent Designer           │  │
│  │  • Evidence Viewer  │       │  • Skill Catalog            │  │
│  │  • Work Queue       │       │  • Governance Queue         │  │
│  └──────────┬──────────┘       └──────────────┬──────────────┘  │
│             │                                  │                  │
│             └──────────────┬───────────────────┘                  │
│                            │                                      │
│             ┌──────────────▼──────────────┐                      │
│             │    GraphQL Gateway          │                      │
│             │       (Port 4000)           │                      │
│             │                             │                      │
│             │  • Schema Composition       │                      │
│             │  • Auth Context             │                      │
│             │  • Service Aggregation      │                      │
│             └──────────────┬──────────────┘                      │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │    Backend Microservices     │
              │  (8080-8091, 9001, 9010)     │
              └──────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | React 18 + TypeScript 5 |
| **Build Tool** | Vite 5 |
| **Monorepo** | Turborepo 2.0 |
| **Package Manager** | pnpm 9.0 |
| **State Management** | Apollo Client (server state) + React Context (UI state) |
| **GraphQL** | Apollo Client 3 |
| **Routing** | React Router v6 |
| **UI Components** | Radix UI (headless) + Tailwind CSS |
| **DAG Editor** | ReactFlow |
| **Charts** | Recharts |
| **Icons** | Lucide React |

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 20.0.0
- **pnpm** >= 9.0.0

```bash
# Install pnpm if not already installed
npm install -g pnpm

# Verify installations
node --version   # Should be >= 20.0.0
pnpm --version   # Should be >= 9.0.0
```

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/axiralabs/axira-frontend.git
cd axira-frontend
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install all dependencies for all packages in the monorepo.

### 3. Environment Setup

Create environment files for each application:

```bash
# For Axira Home
cp packages/axira-home/.env.example packages/axira-home/.env.local

# For Axira Studio
cp packages/axira-studio/.env.example packages/axira-studio/.env.local

# For GraphQL Gateway
cp packages/graphql-gateway/.env.example packages/graphql-gateway/.env.local
```

Or create them manually with the following content:

**packages/axira-home/.env.local**
```env
VITE_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
VITE_GRAPHQL_WS_ENDPOINT=ws://localhost:4000/graphql
VITE_ORCHESTRATOR_URL=http://localhost:8080
VITE_APP_NAME=Axira Home
```

**packages/axira-studio/.env.local**
```env
VITE_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
VITE_GRAPHQL_WS_ENDPOINT=ws://localhost:4000/graphql
VITE_APP_NAME=Axira Studio
```

**packages/graphql-gateway/.env.local**
```env
PORT=4000
TRUST_GRAPH_URL=http://localhost:8081
CONVERSATION_SERVICE_URL=http://localhost:8082
AGENT_CATALOG_URL=http://localhost:8083
EVIDENCE_SERVICE_URL=http://localhost:8085
CAPABILITY_GRAPH_URL=http://localhost:8089
ORCHESTRATOR_URL=http://localhost:8080
MEMORY_SERVICE_URL=http://localhost:8091
SKILLS_SERVICE_URL=http://localhost:9001
```

## Running Locally

### Start All Applications (Development Mode)

```bash
pnpm dev
```

This starts all applications concurrently:
- **Axira Home**: http://localhost:5173
- **Axira Studio**: http://localhost:5174
- **GraphQL Gateway**: http://localhost:4000

### Start Individual Applications

```bash
# Start only Axira Home
pnpm --filter @axira/home dev

# Start only Axira Studio
pnpm --filter @axira/studio dev

# Start only GraphQL Gateway
pnpm --filter @axira/graphql-gateway dev
```

### Start with Backend Services

For full functionality, you'll need the Axira backend services running. See the [Backend Setup](#backend-setup) section below.

## Project Structure

```
axira-frontend/
├── packages/
│   ├── shared/                     # Shared UI library
│   │   ├── src/
│   │   │   ├── components/         # Radix UI-based components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── StatusBadge.tsx
│   │   │   │   └── ...
│   │   │   ├── hooks/              # Shared React hooks
│   │   │   │   ├── useAuth.tsx
│   │   │   │   ├── useTenant.tsx
│   │   │   │   └── useOrchestrationStream.ts
│   │   │   ├── graphql/            # Apollo Client setup
│   │   │   ├── types/              # TypeScript types
│   │   │   └── utils/              # Utility functions
│   │   └── package.json
│   │
│   ├── axira-home/                 # Banker/QA application
│   │   ├── src/
│   │   │   ├── features/
│   │   │   │   ├── chat/           # Chat interface with streaming
│   │   │   │   ├── home/           # Role-based home pages
│   │   │   │   ├── dashboard/      # QA dashboard
│   │   │   │   ├── guardian/       # Pulse/insights feature
│   │   │   │   ├── work/           # Work management
│   │   │   │   ├── workqueue/      # QA work queue
│   │   │   │   ├── worksurface/    # Work context surface
│   │   │   │   └── studio/         # Embedded studio views
│   │   │   ├── components/         # App-specific components
│   │   │   ├── services/           # API service clients
│   │   │   ├── App.tsx             # Route definitions
│   │   │   └── main.tsx            # Entry point
│   │   └── package.json
│   │
│   ├── axira-studio/               # Admin/IT application
│   │   ├── src/
│   │   │   ├── features/
│   │   │   │   ├── agent-designer/ # ReactFlow DAG editor
│   │   │   │   ├── workflow-builder/ # Conversational builder
│   │   │   │   ├── skill-catalog/  # Skill browser
│   │   │   │   └── governance/     # Approval queue
│   │   │   ├── components/         # App-specific components
│   │   │   ├── App.tsx             # Route definitions
│   │   │   └── main.tsx            # Entry point
│   │   └── package.json
│   │
│   └── graphql-gateway/            # BFF layer
│       ├── src/
│       │   ├── datasources/        # Service clients
│       │   ├── resolvers/          # GraphQL resolvers
│       │   ├── schema/             # GraphQL type definitions
│       │   └── index.ts            # Server entry point
│       └── package.json
│
├── turbo.json                      # Turborepo configuration
├── pnpm-workspace.yaml             # pnpm workspace config
├── package.json                    # Root package.json
└── README.md
```

## Available Scripts

### Root Level Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all packages for production |
| `pnpm lint` | Run ESLint across all packages |
| `pnpm test` | Run tests across all packages |
| `pnpm clean` | Clean all build artifacts and node_modules |
| `pnpm format` | Format code with Prettier |

### Package-Specific Commands

```bash
# Run command in specific package
pnpm --filter @axira/home <command>
pnpm --filter @axira/studio <command>
pnpm --filter @axira/shared <command>
pnpm --filter @axira/graphql-gateway <command>

# Examples
pnpm --filter @axira/home dev          # Start Axira Home
pnpm --filter @axira/home build        # Build Axira Home
pnpm --filter @axira/shared build      # Build shared library
```

## Backend Setup

The frontend applications require the Axira backend services to be running for full functionality.

### Required Backend Services

| Service | Port | Purpose |
|---------|------|---------|
| Orchestrator | 8080 | LangGraph runtime, planning, streaming |
| Trust Graph | 8081 | Access control, tenant management |
| Conversation | 8082 | Chat messages, channels, feedback |
| Agent Catalog | 8083 | BA/PA definitions, publishing |
| Evidence | 8085 | Audit trail, evidence packs |
| Capability Graph | 8089 | Capability discovery, agent-skill mapping |
| Memory | 8091 | Embeddings, subject memory |
| Skills | 9001 | Skill catalog, MCP integration |
| Weather MCP | 9010 | Demo MCP server |

### Starting Backend Services

```bash
# From the axira-workspace root directory

# Start infrastructure (PostgreSQL, Redis, LocalStack)
docker-compose up -d postgres redis localstack

# Start Java services (each in separate terminal)
cd axira-trust-graph-service && ./gradlew bootRun
cd axira-conversation-service && ./gradlew bootRun
cd axira-agent-catalog && ./gradlew bootRun
cd axira-evidence-service && ./gradlew bootRun
cd axira-capability-graph-service && ./gradlew bootRun
cd axira-skills-service && ./gradlew bootRun

# Start Python services
cd axira-orchestrator-sidecar && uvicorn axira_orchestrator.main:app --port 8080
cd axira-memory-service && uvicorn main:app --port 8091
cd axira-mcp-servers/weather-server && python main.py
```

### Running Without Backend (Demo Mode)

The applications include mock data for demonstration purposes. Some features will work with mock data even without backend services:

- Role-based home pages with persona switching
- Mock chat conversations
- Dashboard with sample metrics
- UI component exploration

## Demo Users

The platform includes demo personas for testing:

| User | Role | Description |
|------|------|-------------|
| Maya Chen | Branch Banker | McAllen Branch banker using copilot |
| Carlos Martinez | QA Reviewer | Reviews compliance cases |
| Sarah Johnson | Ops Lead | Operations lead using workflow builder |
| Mike Thompson | IT Admin | IT administrator in Studio |

## Key Features

### Axira Home

- **Chat Interface**: Natural language queries with streaming responses
- **Planning Indicator**: Real-time display of agent/skill execution
- **Structured Responses**: Status badges, citations, action buttons
- **Explainability Panel**: "How did you decide this?" evidence viewer
- **QA Dashboard**: Metrics, work queue, case drill-down
- **Evidence Viewer**: Timeline, inputs, decision path visualization

### Axira Studio

- **DAG Workflow Editor**: ReactFlow-based visual editor for Process Agents
- **Conversational Builder**: Natural language workflow creation
- **Skill Catalog**: Browse and configure available skills
- **Governance Queue**: Review and approve agent changes
- **Trust Graph Visualizer**: D3-based access control visualization

## Configuration

### Tailwind CSS Theme

The applications use a consistent HSL-based color system defined in `tailwind.config.js`:

```javascript
colors: {
  border: "hsl(var(--border))",
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  primary: {
    DEFAULT: "hsl(var(--primary))",
    foreground: "hsl(var(--primary-foreground))",
  },
  // ... more colors
}
```

### Status Colors

Consistent status indication across the platform:

| Status | Color | Usage |
|--------|-------|-------|
| PASS | Green | Successful checks, complete items |
| WARNING | Yellow | Attention needed, partial issues |
| FAIL | Red | Failed checks, errors |
| DENIED | Gray | Access denied, policy blocked |

## Troubleshooting

### Common Issues

**1. pnpm install fails**
```bash
# Clear pnpm cache and reinstall
pnpm store prune
rm -rf node_modules
pnpm install
```

**2. Port already in use**
```bash
# Find and kill process on port (e.g., 5173)
lsof -ti:5173 | xargs kill -9
```

**3. TypeScript errors after pulling changes**
```bash
# Rebuild all packages
pnpm clean
pnpm install
pnpm build
```

**4. GraphQL types out of sync**
```bash
# Regenerate GraphQL types
pnpm codegen
```

### Development Tips

- Use `pnpm --filter` to run commands in specific packages
- The shared package must be built before other packages can use it
- Hot module replacement (HMR) is enabled for all Vite apps
- GraphQL Playground is available at http://localhost:4000/graphql

## Contributing

1. Create a feature branch from `main`
2. Make your changes following the existing patterns
3. Ensure all lint and type checks pass: `pnpm lint`
4. Test your changes locally
5. Submit a pull request

### Code Style

- Use TypeScript strict mode (no `any` types)
- Follow feature-based folder structure
- Use Radix UI primitives for accessibility
- Apply Tailwind CSS utility classes
- Include proper ARIA labels for accessibility

## License

Proprietary - Axira Labs

## Links

- [Axira Platform Documentation](https://docs.axira.ai)
- [Backend Services Repository](https://github.com/axiralabs)
- [Issue Tracker](https://github.com/axiralabs/axira-frontend/issues)
