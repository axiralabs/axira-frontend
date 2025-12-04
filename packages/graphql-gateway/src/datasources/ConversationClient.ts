const CONVERSATION_SERVICE_URL = process.env.CONVERSATION_SERVICE_URL || 'http://localhost:8084';

export class ConversationClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = CONVERSATION_SERVICE_URL;
  }

  async getEpisodes(tenantId: string, workspaceId: string, first?: number, after?: string) {
    // In production, call Conversation service
    return [];
  }

  async getEpisode(tenantId: string, episodeId: string) {
    // In production, call Conversation service
    return null;
  }

  async getMessages(tenantId: string, episodeId: string, first?: number, after?: string) {
    // In production, call Conversation service
    return [];
  }

  async sendMessage(tenantId: string, workspaceId: string, input: { episodeId?: string; content: string }) {
    // In production, call Conversation service
    return {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.content,
      timestamp: new Date().toISOString(),
    };
  }

  async createEpisode(tenantId: string, workspaceId: string, input: { title?: string; subjectKey?: string }) {
    // In production, call Conversation service
    return {
      id: `ep-${Date.now()}`,
      title: input.title ?? 'New Conversation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
    };
  }
}
