import type { Context } from '../context';

// Mock data for development
const mockUser = {
  userId: 'maya-chen-001',
  displayName: 'Maya Chen',
  roles: ['banker', 'branch-user'],
  branch: { id: 'branch-001', name: 'Main Street Branch' },
  resourceSet: {
    allowedSubjectKinds: ['customer', 'account', 'loan'],
    allowedBranches: ['branch-001', 'branch-002'],
    allowedProductTypes: ['DDA', 'Savings', 'CD'],
    policyPacks: ['standard-banking'],
  },
};

const mockEpisodes = [
  {
    id: 'ep-001',
    title: 'Garcia Account Review',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'ACTIVE',
    subjectKey: 'garcia-household-001',
  },
];

const mockMessages = [
  {
    id: 'msg-001',
    role: 'USER',
    content: 'What is the status of the Garcia account?',
    timestamp: new Date().toISOString(),
    metadata: null,
  },
  {
    id: 'msg-002',
    role: 'ASSISTANT',
    content: 'I found the Garcia household account. All documents are present and verified.',
    timestamp: new Date().toISOString(),
    metadata: {
      subjectReferences: [
        { subjectKey: 'garcia-household-001', subjectKind: 'customer', displayName: 'Garcia Household' },
      ],
      structuredResponse: {
        summaryItems: [
          { status: 'PASS', message: 'All KYC documents verified', details: null },
          { status: 'PASS', message: 'Account in good standing', details: null },
        ],
        citations: [
          { id: 'cit-001', source: 'Core Banking', title: 'Account Summary', url: null, snippet: null },
        ],
        availableActions: [
          { id: 'act-001', label: 'View Details', action: 'navigate:/accounts/garcia', variant: 'PRIMARY', disabled: false },
        ],
      },
      planningContext: null,
      accessDenials: null,
    },
  },
];

const mockAgents = [
  {
    id: 'agent-001',
    name: 'Branch Banker Assistant',
    description: 'Assists branch bankers with customer inquiries',
    version: '1.0.0',
    status: 'PUBLISHED',
    workflow: { nodes: [], edges: [] },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'admin',
  },
];

const mockSkills = [
  {
    id: 'skill-001',
    name: 'Document Presence Check',
    description: 'Verifies presence of required documents',
    category: 'Validation',
    version: '1.0.0',
    inputSchema: { type: 'object', properties: { accountId: { type: 'string' } } },
    outputSchema: { type: 'object', properties: { present: { type: 'boolean' } } },
  },
  {
    id: 'skill-002',
    name: 'KYC Verification',
    description: 'Performs KYC verification checks',
    category: 'Compliance',
    version: '2.1.0',
    inputSchema: { type: 'object', properties: { customerId: { type: 'string' } } },
    outputSchema: { type: 'object', properties: { verified: { type: 'boolean' } } },
  },
];

function createConnection<T>(items: T[], first?: number, after?: string) {
  const edges = items.map((node, index) => ({
    node,
    cursor: Buffer.from(`cursor:${index}`).toString('base64'),
  }));

  return {
    edges: first ? edges.slice(0, first) : edges,
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: edges[0]?.cursor ?? null,
      endCursor: edges[edges.length - 1]?.cursor ?? null,
    },
  };
}

export const resolvers = {
  Query: {
    me: (_: unknown, __: unknown, context: Context) => {
      // In production, fetch from Trust Graph service using context.token
      return mockUser;
    },

    episodes: (_: unknown, args: { first?: number; after?: string }) => {
      return createConnection(mockEpisodes, args.first, args.after);
    },

    episode: (_: unknown, args: { id: string }) => {
      return mockEpisodes.find((e) => e.id === args.id) ?? null;
    },

    messages: (_: unknown, args: { episodeId: string; first?: number; after?: string }) => {
      return createConnection(mockMessages, args.first, args.after);
    },

    agents: (_: unknown, args: { status?: string; first?: number; after?: string }) => {
      const filtered = args.status
        ? mockAgents.filter((a) => a.status === args.status)
        : mockAgents;
      return createConnection(filtered, args.first, args.after);
    },

    agent: (_: unknown, args: { id: string }) => {
      return mockAgents.find((a) => a.id === args.id) ?? null;
    },

    skills: (_: unknown, args: { category?: string; first?: number; after?: string }) => {
      const filtered = args.category
        ? mockSkills.filter((s) => s.category === args.category)
        : mockSkills;
      return createConnection(filtered, args.first, args.after);
    },

    skill: (_: unknown, args: { id: string }) => {
      return mockSkills.find((s) => s.id === args.id) ?? null;
    },

    evidencePack: (_: unknown, args: { caseId: string }) => {
      return {
        id: `pack-${args.caseId}`,
        caseId: args.caseId,
        createdAt: new Date().toISOString(),
        items: [],
      };
    },
  },

  Mutation: {
    sendMessage: (_: unknown, args: { input: { episodeId?: string; content: string; subjectKey?: string } }) => {
      const newMessage = {
        id: `msg-${Date.now()}`,
        role: 'USER' as const,
        content: args.input.content,
        timestamp: new Date().toISOString(),
        metadata: null,
      };

      return {
        message: newMessage,
        episodeId: args.input.episodeId ?? `ep-${Date.now()}`,
      };
    },

    createEpisode: (_: unknown, args: { input: { title?: string; subjectKey?: string } }) => {
      return {
        id: `ep-${Date.now()}`,
        title: args.input.title ?? 'New Conversation',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'ACTIVE',
        subjectKey: args.input.subjectKey ?? null,
      };
    },

    createAgent: (_: unknown, args: { input: { name: string; description: string; workflow: unknown } }) => {
      return {
        id: `agent-${Date.now()}`,
        name: args.input.name,
        description: args.input.description,
        version: '0.1.0',
        status: 'DRAFT',
        workflow: args.input.workflow,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'current-user',
      };
    },

    updateAgent: (_: unknown, args: { id: string; input: { name?: string; description?: string; workflow?: unknown } }) => {
      const agent = mockAgents.find((a) => a.id === args.id);
      if (!agent) throw new Error('Agent not found');

      return {
        ...agent,
        ...args.input,
        updatedAt: new Date().toISOString(),
      };
    },

    publishAgent: (_: unknown, args: { id: string }) => {
      const agent = mockAgents.find((a) => a.id === args.id);
      if (!agent) throw new Error('Agent not found');

      return {
        ...agent,
        status: 'IN_REVIEW',
        updatedAt: new Date().toISOString(),
      };
    },

    executeSkill: (_: unknown, args: { input: { skillId: string; parameters: unknown } }) => {
      return {
        success: true,
        output: { result: 'Skill executed successfully' },
        error: null,
      };
    },
  },

  Subscription: {
    messageStream: {
      subscribe: async function* (_: unknown, args: { episodeId: string }) {
        // In production, this would subscribe to a real event stream
        yield {
          messageStream: {
            chunk: 'Processing your request...',
            isComplete: false,
            planningUpdate: { currentStep: 'analyzing', currentAgent: 'branch-banker' },
          },
        };

        await new Promise((resolve) => setTimeout(resolve, 1000));

        yield {
          messageStream: {
            chunk: 'Here is the information you requested.',
            isComplete: true,
            planningUpdate: null,
          },
        };
      },
    },
  },

  Episode: {
    messages: (parent: { id: string }, args: { first?: number; after?: string }) => {
      return createConnection(mockMessages, args.first, args.after);
    },
  },
};
