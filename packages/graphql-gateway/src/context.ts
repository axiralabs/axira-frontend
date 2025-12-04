import { TrustGraphClient } from './datasources/TrustGraphClient';
import { ConversationClient } from './datasources/ConversationClient';
import { AgentCatalogClient } from './datasources/AgentCatalogClient';
import { SkillsClient } from './datasources/SkillsClient';
import { EvidenceClient } from './datasources/EvidenceClient';

export interface Context {
  tenantId: string | null;
  workspaceId: string | null;
  token: string | null;
  dataSources: {
    trustGraph: TrustGraphClient;
    conversation: ConversationClient;
    agentCatalog: AgentCatalogClient;
    skills: SkillsClient;
    evidence: EvidenceClient;
  };
}

interface ContextParams {
  tenantId?: string;
  workspaceId?: string;
  token?: string;
}

export function createContext(params: ContextParams): Context {
  const { tenantId, workspaceId, token } = params;

  return {
    tenantId: tenantId ?? null,
    workspaceId: workspaceId ?? null,
    token: token ?? null,
    dataSources: {
      trustGraph: new TrustGraphClient(),
      conversation: new ConversationClient(),
      agentCatalog: new AgentCatalogClient(),
      skills: new SkillsClient(),
      evidence: new EvidenceClient(),
    },
  };
}
