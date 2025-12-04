const EVIDENCE_SERVICE_URL = process.env.EVIDENCE_SERVICE_URL || 'http://localhost:8083';

export class EvidenceClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = EVIDENCE_SERVICE_URL;
  }

  async getEvidencePack(tenantId: string, caseId: string) {
    // In production, call Evidence service
    return {
      id: `pack-${caseId}`,
      caseId,
      createdAt: new Date().toISOString(),
      items: [],
    };
  }

  async getSubjectTimeline(tenantId: string, subjectKey: string) {
    // In production, call Evidence service
    return [];
  }
}
