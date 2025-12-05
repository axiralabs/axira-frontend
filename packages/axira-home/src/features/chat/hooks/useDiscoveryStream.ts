import { useCallback, useState } from 'react';
import type {
  ConversationSSEEvent,
  DiscoveryState,
  SemanticCandidate,
  CapabilityAccessDecision,
} from '../types';

/**
 * Initial discovery state - no discovery in progress
 */
const initialDiscoveryState: DiscoveryState = {
  status: 'idle',
};

/**
 * Hook to manage discovery state from SSE stream events.
 *
 * This hook processes discovery-related events from the orchestrator
 * and maintains the current discovery state for UI display.
 *
 * Discovery flow:
 * 1. Intent Detection - Parse user message for intent/domain
 * 2. Feature Computation - Fetch subject features from Feature Store
 * 3. Capability Discovery - Find matching capabilities from Capability Graph
 * 4. Policy Evaluation - Check access with Trust Graph
 * 5. Capability Selection - Select best matching capability
 * 6. Execution - Execute the selected capability
 */
export function useDiscoveryStream() {
  const [discoveryState, setDiscoveryState] = useState<DiscoveryState>(initialDiscoveryState);

  /**
   * Reset discovery state to initial
   */
  const resetDiscovery = useCallback(() => {
    setDiscoveryState(initialDiscoveryState);
  }, []);

  /**
   * Handle a discovery-related SSE event and update state accordingly
   */
  const handleDiscoveryEvent = useCallback((event: ConversationSSEEvent) => {
    const eventType = event.type?.toUpperCase?.() || event.type;

    setDiscoveryState((prev) => {
      switch (eventType) {
        // Graph started - begin discovery process
        case 'GRAPH_STARTED':
          return {
            ...prev,
            status: 'detecting_intent',
          };

        // Intent detected from user message
        case 'DISCOVERY_INTENT_DETECTED':
        case 'DISCOVERY.INTENT_DETECTED': {
          const payload = (event as Record<string, unknown>).payload as {
            intent?: string;
            domain?: string;
            confidence?: number;
          } | undefined;

          return {
            ...prev,
            status: 'computing_features',
            detectedIntent: payload?.intent,
            detectedDomain: payload?.domain,
            intentConfidence: payload?.confidence,
          };
        }

        // Features computed from Feature Store
        case 'DISCOVERY_FEATURES_COMPUTED':
        case 'DISCOVERY.FEATURES_COMPUTED': {
          const payload = (event as Record<string, unknown>).payload as {
            subjectKey?: string;
            features?: Record<string, unknown>;
            computationTimeMs?: number;
          } | undefined;

          return {
            ...prev,
            status: 'discovering_capabilities',
            featuresComputed: payload?.features,
          };
        }

        // Capability candidates found from Capability Graph
        case 'DISCOVERY_CANDIDATES_FOUND':
        case 'DISCOVERY.CANDIDATES_FOUND': {
          const payload = (event as Record<string, unknown>).payload as {
            candidates?: SemanticCandidate[];
            totalMatches?: number;
            searchMethod?: string;
          } | undefined;

          return {
            ...prev,
            status: 'evaluating_policy',
            candidates: payload?.candidates,
            totalMatches: payload?.totalMatches,
          };
        }

        // Policy evaluated from Trust Graph
        case 'DISCOVERY_POLICY_EVALUATED':
        case 'DISCOVERY.POLICY_EVALUATED': {
          const payload = (event as Record<string, unknown>).payload as {
            capabilityKey?: string;
            decision?: CapabilityAccessDecision;
          } | undefined;

          return {
            ...prev,
            status: 'selecting_capability',
            policyDecision: payload?.decision,
          };
        }

        // Capability selected for execution
        case 'DISCOVERY_CAPABILITY_SELECTED':
        case 'DISCOVERY.CAPABILITY_SELECTED': {
          const payload = (event as Record<string, unknown>).payload as {
            capabilityKey?: string;
            capabilityName?: string;
            capabilityType?: 'ATOMIC' | 'COMPOSITE' | 'INTELLIGENT';
            matchScore?: number;
            selectionReason?: string;
          } | undefined;

          return {
            ...prev,
            status: 'executing',
            selectedCapability: payload ? {
              key: payload.capabilityKey || '',
              name: payload.capabilityName,
              type: payload.capabilityType,
              matchScore: payload.matchScore || 0,
              reason: payload.selectionReason,
            } : undefined,
          };
        }

        // Capability execution started
        case 'CAPABILITY_EXECUTION_STARTED':
        case 'CAPABILITY.EXECUTION_STARTED': {
          const payload = (event as Record<string, unknown>).payload as {
            capabilityKey?: string;
            capabilityType?: 'ATOMIC' | 'COMPOSITE' | 'INTELLIGENT';
          } | undefined;

          return {
            ...prev,
            status: 'executing',
            executionStatus: {
              capabilityKey: payload?.capabilityKey || prev.selectedCapability?.key || '',
              isRunning: true,
            },
          };
        }

        // Capability execution completed
        case 'CAPABILITY_EXECUTION_COMPLETED':
        case 'CAPABILITY.EXECUTION_COMPLETED': {
          const payload = (event as Record<string, unknown>).payload as {
            capabilityKey?: string;
            success?: boolean;
            executionTimeMs?: number;
            error?: string;
          } | undefined;

          return {
            ...prev,
            executionStatus: {
              capabilityKey: payload?.capabilityKey || prev.executionStatus?.capabilityKey || '',
              isRunning: false,
              success: payload?.success,
              executionTimeMs: payload?.executionTimeMs,
              error: payload?.error,
            },
          };
        }

        // Graph completed - discovery finished
        case 'GRAPH_COMPLETED':
        case 'DONE':
          // Keep the final state but mark as no longer streaming
          return prev;

        default:
          return prev;
      }
    });
  }, []);

  /**
   * Check if a given event is discovery-related
   */
  const isDiscoveryEvent = useCallback((event: ConversationSSEEvent): boolean => {
    const eventType = event.type?.toUpperCase?.() || event.type;
    return (
      eventType.startsWith('DISCOVERY') ||
      eventType.startsWith('CAPABILITY') ||
      eventType === 'GRAPH_STARTED' ||
      eventType === 'GRAPH_COMPLETED'
    );
  }, []);

  /**
   * Get a human-readable description of the current discovery status
   */
  const getStatusDescription = useCallback((): string => {
    switch (discoveryState.status) {
      case 'idle':
        return '';
      case 'detecting_intent':
        return 'Understanding your request...';
      case 'computing_features':
        return discoveryState.detectedIntent
          ? `Detected: ${discoveryState.detectedIntent} (${discoveryState.detectedDomain})`
          : 'Analyzing context...';
      case 'discovering_capabilities':
        return 'Finding matching capabilities...';
      case 'evaluating_policy':
        return discoveryState.candidates
          ? `Found ${discoveryState.candidates.length} capabilities, checking access...`
          : 'Evaluating access policies...';
      case 'selecting_capability':
        return 'Selecting best capability...';
      case 'executing':
        return discoveryState.selectedCapability
          ? `Executing: ${discoveryState.selectedCapability.name || discoveryState.selectedCapability.key}`
          : 'Executing capability...';
      default:
        return '';
    }
  }, [discoveryState]);

  return {
    discoveryState,
    handleDiscoveryEvent,
    resetDiscovery,
    isDiscoveryEvent,
    getStatusDescription,
  };
}

export type UseDiscoveryStreamReturn = ReturnType<typeof useDiscoveryStream>;
