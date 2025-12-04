import type { EvidencePack, HashChainEntry } from '../features/chat/types';

const BASE_URL = import.meta.env.VITE_EVIDENCE_SERVICE_URL || '';

interface RequestOptions {
  tenantId: string;
  userId: string;
}

function buildHeaders(options: RequestOptions): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'X-Tenant-Id': options.tenantId,
    'X-User-Id': options.userId,
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`API error ${response.status}: ${errorText}`);
  }
  return response.json();
}

// ============================================================================
// Evidence Pack Operations
// ============================================================================

/**
 * Get a complete evidence pack with nodes and edges.
 */
export async function getEvidencePack(
  packId: string,
  options: RequestOptions
): Promise<EvidencePack> {
  const response = await fetch(`${BASE_URL}/api/evidence-packs/${packId}`, {
    method: 'GET',
    headers: buildHeaders(options),
  });
  return handleResponse<EvidencePack>(response);
}

/**
 * Get evidence pack summary (without full graph).
 */
export async function getEvidencePackSummary(
  packId: string,
  options: RequestOptions
): Promise<EvidencePack['pack']> {
  const response = await fetch(`${BASE_URL}/api/evidence-packs/${packId}/summary`, {
    method: 'GET',
    headers: buildHeaders(options),
  });
  return handleResponse<EvidencePack['pack']>(response);
}

// ============================================================================
// Evidence Query Operations
// ============================================================================

/**
 * Query evidence paths with filtering.
 */
export async function queryEvidencePaths(
  options: RequestOptions & {
    packId?: string;
    subjectType?: string;
    subjectId?: string;
    evidenceType?: string;
    fromTimestamp?: string;
    toTimestamp?: string;
    maxResults?: number;
  }
): Promise<EvidencePack['nodes']> {
  const url = new URL(`${BASE_URL}/api/evidence/paths`);

  if (options.packId) url.searchParams.set('packId', options.packId);
  if (options.subjectType) url.searchParams.set('subjectType', options.subjectType);
  if (options.subjectId) url.searchParams.set('subjectId', options.subjectId);
  if (options.evidenceType) url.searchParams.set('evidenceType', options.evidenceType);
  if (options.fromTimestamp) url.searchParams.set('fromTimestamp', options.fromTimestamp);
  if (options.toTimestamp) url.searchParams.set('toTimestamp', options.toTimestamp);
  if (options.maxResults) url.searchParams.set('maxResults', options.maxResults.toString());

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: buildHeaders(options),
  });
  return handleResponse<EvidencePack['nodes']>(response);
}

// ============================================================================
// Subject Operations
// ============================================================================

/**
 * Get episodes for a subject (timeline of interactions).
 */
export async function getSubjectEpisodes(
  subjectRef: string, // format: "subjectType:subjectId"
  options: RequestOptions
): Promise<SubjectEpisode[]> {
  const response = await fetch(`${BASE_URL}/api/subjects/${encodeURIComponent(subjectRef)}/episodes`, {
    method: 'GET',
    headers: buildHeaders(options),
  });
  return handleResponse<SubjectEpisode[]>(response);
}

/**
 * Get projection for a subject (cached snapshot of facts).
 */
export async function getSubjectProjection(
  subjectRef: string,
  options: RequestOptions
): Promise<SubjectProjection> {
  const response = await fetch(`${BASE_URL}/api/subjects/${encodeURIComponent(subjectRef)}/projection`, {
    method: 'GET',
    headers: buildHeaders(options),
  });
  return handleResponse<SubjectProjection>(response);
}

// ============================================================================
// Hash Chain (Audit Trail)
// ============================================================================

/**
 * Get hash chain entries for an evidence pack (for audit verification).
 */
export async function getHashChain(
  packId: string,
  options: RequestOptions
): Promise<HashChainEntry[]> {
  const response = await fetch(`${BASE_URL}/api/evidence-packs/${packId}/hash-chain`, {
    method: 'GET',
    headers: buildHeaders(options),
  });
  return handleResponse<HashChainEntry[]>(response);
}

/**
 * Verify hash chain integrity for an evidence pack.
 */
export async function verifyHashChain(
  packId: string,
  options: RequestOptions
): Promise<HashChainVerificationResult> {
  const response = await fetch(`${BASE_URL}/api/evidence-packs/${packId}/hash-chain/verify`, {
    method: 'POST',
    headers: buildHeaders(options),
  });
  return handleResponse<HashChainVerificationResult>(response);
}

// ============================================================================
// Additional Types
// ============================================================================

export interface SubjectEpisode {
  entryId: string;
  timestamp: string;
  episodeId?: string;
  caseId?: string;
  journeyKey?: string;
  result?: 'PASS' | 'FAIL' | 'EXCEPTION';
  evidencePackId?: string;
  incidents?: string[];
}

export interface SubjectProjection {
  tenantId: string;
  subjectKey: string;
  profile: Record<string, unknown>;
  snapshotAt: string;
  validUntil?: string;
  etag?: string;
}

export interface HashChainVerificationResult {
  valid: boolean;
  chainLength: number;
  brokenAtSequence?: number;
  errorMessage?: string;
  verifiedAt: string;
}

// ============================================================================
// Convenience Exports
// ============================================================================

export const evidenceService = {
  getEvidencePack,
  getEvidencePackSummary,
  queryEvidencePaths,
  getSubjectEpisodes,
  getSubjectProjection,
  getHashChain,
  verifyHashChain,
};

export default evidenceService;
