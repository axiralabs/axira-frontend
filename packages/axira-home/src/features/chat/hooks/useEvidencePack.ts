import { useState, useEffect, useCallback } from 'react';
import { useAuth, useTenant } from '@axira/shared/hooks';
import {
  getEvidencePack,
  getHashChain,
  verifyHashChain,
} from '../../../services/evidenceService';
import type {
  EvidencePack,
  HashChainEntry,
} from '../types';
import type { HashChainVerificationResult } from '../../../services/evidenceService';

interface UseEvidencePackOptions {
  packId: string | null;
  autoLoad?: boolean;
}

interface UseEvidencePackState {
  evidencePack: EvidencePack | null;
  hashChain: HashChainEntry[];
  verification: HashChainVerificationResult | null;
  isLoading: boolean;
  isLoadingHashChain: boolean;
  isVerifying: boolean;
  error: Error | null;
}

interface UseEvidencePackReturn extends UseEvidencePackState {
  loadEvidencePack: () => Promise<void>;
  loadHashChain: () => Promise<void>;
  verifyChain: () => Promise<void>;
  reset: () => void;
}

const initialState: UseEvidencePackState = {
  evidencePack: null,
  hashChain: [],
  verification: null,
  isLoading: false,
  isLoadingHashChain: false,
  isVerifying: false,
  error: null,
};

export function useEvidencePack({
  packId,
  autoLoad = true,
}: UseEvidencePackOptions): UseEvidencePackReturn {
  const { user } = useAuth();
  const { orgId } = useTenant();
  const [state, setState] = useState<UseEvidencePackState>(initialState);

  const requestOptions = {
    tenantId: orgId || 'lsnb-001',
    userId: user?.userId || 'maya-chen-001',
  };

  const loadEvidencePack = useCallback(async () => {
    if (!packId) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const pack = await getEvidencePack(packId, requestOptions);
      setState((prev) => ({
        ...prev,
        evidencePack: pack,
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Failed to load evidence pack'),
        isLoading: false,
      }));
    }
  }, [packId, requestOptions.tenantId, requestOptions.userId]);

  const loadHashChain = useCallback(async () => {
    if (!packId) return;

    setState((prev) => ({ ...prev, isLoadingHashChain: true }));

    try {
      const chain = await getHashChain(packId, requestOptions);
      setState((prev) => ({
        ...prev,
        hashChain: chain,
        isLoadingHashChain: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Failed to load hash chain'),
        isLoadingHashChain: false,
      }));
    }
  }, [packId, requestOptions.tenantId, requestOptions.userId]);

  const verifyChain = useCallback(async () => {
    if (!packId) return;

    setState((prev) => ({ ...prev, isVerifying: true }));

    try {
      const result = await verifyHashChain(packId, requestOptions);
      setState((prev) => ({
        ...prev,
        verification: result,
        isVerifying: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Failed to verify hash chain'),
        isVerifying: false,
      }));
    }
  }, [packId, requestOptions.tenantId, requestOptions.userId]);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  // Auto-load when packId changes
  useEffect(() => {
    if (autoLoad && packId) {
      loadEvidencePack();
    }
  }, [packId, autoLoad, loadEvidencePack]);

  return {
    ...state,
    loadEvidencePack,
    loadHashChain,
    verifyChain,
    reset,
  };
}
