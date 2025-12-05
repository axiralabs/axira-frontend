import { useState } from 'react';
import { Badge } from '@axira/shared/components';
import { cn } from '@axira/shared/utils';
import type { DiscoveryState, SemanticCandidate, CapabilityAccessDecision } from '../types';

interface DiscoveryIndicatorProps {
  discoveryState: DiscoveryState;
  isStreaming: boolean;
  className?: string;
}

/**
 * DiscoveryIndicator displays the current state of dynamic capability discovery.
 *
 * It shows:
 * - Current discovery stage (intent detection, capability search, policy check, etc.)
 * - Detected intent and domain
 * - Capability candidates found
 * - Policy decision status
 * - Selected capability for execution
 */
export function DiscoveryIndicator({
  discoveryState,
  isStreaming,
  className,
}: DiscoveryIndicatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Don't render if no discovery is in progress
  if (!isStreaming && discoveryState.status === 'idle') {
    return null;
  }

  const showDetails = discoveryState.status !== 'idle';

  return (
    <div className={cn('space-y-2', className)}>
      {/* Compact header view */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 p-2 rounded-lg bg-indigo-900/30 hover:bg-indigo-900/50 transition-colors text-left border border-indigo-700/50"
        aria-expanded={isExpanded}
        aria-label="Toggle discovery details"
      >
        {/* Animated pulse for active discovery */}
        {isStreaming && discoveryState.status !== 'idle' && (
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
          </span>
        )}

        {/* Discovery icon */}
        <DiscoveryIcon className="h-4 w-4 text-indigo-400" />

        {/* Status text */}
        <span className="flex-1 text-sm text-indigo-200">
          <DiscoveryStatusText discoveryState={discoveryState} />
        </span>

        {/* Stage badge */}
        {discoveryState.status !== 'idle' && (
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-indigo-800/50 text-indigo-200">
            {formatStageName(discoveryState.status)}
          </Badge>
        )}

        {/* Expand chevron */}
        <ChevronIcon
          className={cn(
            'h-4 w-4 text-indigo-400 transition-transform',
            isExpanded && 'rotate-180'
          )}
        />
      </button>

      {/* Expanded details */}
      {isExpanded && showDetails && (
        <div className="ml-4 space-y-2 border-l-2 border-indigo-700/50 pl-3">
          {/* Intent & Domain */}
          {(discoveryState.detectedIntent || discoveryState.detectedDomain) && (
            <div className="flex items-center gap-2 text-xs">
              <IntentIcon className="h-3.5 w-3.5 text-indigo-400" />
              <span className="text-gray-400">Intent:</span>
              <span className="font-medium text-indigo-300">
                {discoveryState.detectedIntent || 'detecting...'}
              </span>
              {discoveryState.detectedDomain && (
                <Badge variant="outline" className="text-[10px] px-1 py-0 border-indigo-600 text-indigo-300">
                  {discoveryState.detectedDomain}
                </Badge>
              )}
              {discoveryState.intentConfidence != null && (
                <span className="text-gray-500">
                  ({Math.round(discoveryState.intentConfidence * 100)}%)
                </span>
              )}
            </div>
          )}

          {/* Candidates */}
          {discoveryState.candidates && discoveryState.candidates.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <SearchIcon className="h-3.5 w-3.5 text-indigo-400" />
                <span>Capabilities found: {discoveryState.totalMatches || discoveryState.candidates.length}</span>
              </div>
              <div className="pl-5 space-y-1">
                {discoveryState.candidates.slice(0, 3).map((candidate) => (
                  <CandidateItem
                    key={candidate.capabilityKey}
                    candidate={candidate}
                    isSelected={discoveryState.selectedCapability?.key === candidate.capabilityKey}
                  />
                ))}
                {discoveryState.candidates.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{discoveryState.candidates.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Policy Decision */}
          {discoveryState.policyDecision && (
            <PolicyDecisionItem decision={discoveryState.policyDecision} />
          )}

          {/* Selected Capability */}
          {discoveryState.selectedCapability && (
            <div className="flex items-center gap-2 text-xs">
              <CheckIcon className="h-3.5 w-3.5 text-green-400" />
              <span className="text-gray-400">Selected:</span>
              <span className="font-medium text-green-300">
                {discoveryState.selectedCapability.name || discoveryState.selectedCapability.key}
              </span>
              <Badge variant="outline" className="text-[10px] px-1 py-0 border-green-600 text-green-300">
                {discoveryState.selectedCapability.type || 'ATOMIC'}
              </Badge>
              <span className="text-gray-500">
                ({Math.round(discoveryState.selectedCapability.matchScore * 100)}% match)
              </span>
            </div>
          )}

          {/* Execution Status */}
          {discoveryState.executionStatus && (
            <ExecutionStatusItem status={discoveryState.executionStatus} />
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

function DiscoveryStatusText({ discoveryState }: { discoveryState: DiscoveryState }) {
  switch (discoveryState.status) {
    case 'idle':
      return <span className="text-gray-500">Ready</span>;
    case 'detecting_intent':
      return <span>Understanding your request...</span>;
    case 'computing_features':
      return (
        <span>
          {discoveryState.detectedIntent ? (
            <>
              Detected <span className="font-medium">{discoveryState.detectedIntent}</span>
              {discoveryState.detectedDomain && (
                <span className="text-indigo-400"> ({discoveryState.detectedDomain})</span>
              )}
            </>
          ) : (
            'Analyzing context...'
          )}
        </span>
      );
    case 'discovering_capabilities':
      return <span>Finding matching capabilities...</span>;
    case 'evaluating_policy':
      return (
        <span>
          Found {discoveryState.candidates?.length || 0} capabilities, checking access...
        </span>
      );
    case 'selecting_capability':
      return <span>Selecting best capability...</span>;
    case 'executing':
      return (
        <span>
          Executing{' '}
          <span className="font-medium">
            {discoveryState.selectedCapability?.name || discoveryState.selectedCapability?.key || 'capability'}
          </span>
        </span>
      );
    default:
      return <span>Processing...</span>;
  }
}

interface CandidateItemProps {
  candidate: SemanticCandidate;
  isSelected: boolean;
}

function CandidateItem({ candidate, isSelected }: CandidateItemProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 text-xs px-2 py-1 rounded',
        isSelected ? 'bg-green-900/30 border border-green-700/50' : 'bg-gray-800/30'
      )}
    >
      {isSelected ? (
        <CheckIcon className="h-3 w-3 text-green-400" />
      ) : (
        <CircleIcon className="h-3 w-3 text-gray-500" />
      )}
      <span className={cn('font-medium', isSelected ? 'text-green-300' : 'text-gray-300')}>
        {candidate.capabilityName}
      </span>
      <Badge
        variant="outline"
        className={cn(
          'text-[9px] px-1 py-0',
          candidate.capabilityType === 'INTELLIGENT'
            ? 'border-purple-600 text-purple-300'
            : candidate.capabilityType === 'COMPOSITE'
            ? 'border-blue-600 text-blue-300'
            : 'border-gray-600 text-gray-300'
        )}
      >
        {candidate.capabilityType}
      </Badge>
      <span className="text-gray-500 ml-auto">{Math.round(candidate.matchScore * 100)}%</span>
    </div>
  );
}

function PolicyDecisionItem({ decision }: { decision: CapabilityAccessDecision }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {decision.allowed ? (
        <>
          <ShieldCheckIcon className="h-3.5 w-3.5 text-green-400" />
          <span className="text-green-300">Access granted</span>
        </>
      ) : (
        <>
          <ShieldXIcon className="h-3.5 w-3.5 text-red-400" />
          <span className="text-red-300">Access denied</span>
          {decision.reason && (
            <span className="text-gray-500">- {decision.reason}</span>
          )}
        </>
      )}
      {decision.policyRef && (
        <span className="text-gray-500 text-[10px]">({decision.policyRef})</span>
      )}
    </div>
  );
}

interface ExecutionStatusItemProps {
  status: NonNullable<DiscoveryState['executionStatus']>;
}

function ExecutionStatusItem({ status }: ExecutionStatusItemProps) {
  if (status.isRunning) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <SpinnerIcon className="h-3.5 w-3.5 text-blue-400 animate-spin" />
        <span className="text-blue-300">Executing...</span>
      </div>
    );
  }

  if (status.success === false) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <XIcon className="h-3.5 w-3.5 text-red-400" />
        <span className="text-red-300">Execution failed</span>
        {status.error && <span className="text-gray-500">- {status.error}</span>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <CheckIcon className="h-3.5 w-3.5 text-green-400" />
      <span className="text-green-300">Completed</span>
      {status.executionTimeMs != null && (
        <span className="text-gray-500">{status.executionTimeMs}ms</span>
      )}
    </div>
  );
}

// ============================================================================
// Helper functions
// ============================================================================

function formatStageName(status: DiscoveryState['status']): string {
  switch (status) {
    case 'detecting_intent':
      return 'Intent';
    case 'computing_features':
      return 'Features';
    case 'discovering_capabilities':
      return 'Discovery';
    case 'evaluating_policy':
      return 'Policy';
    case 'selecting_capability':
      return 'Selection';
    case 'executing':
      return 'Executing';
    default:
      return '';
  }
}

// ============================================================================
// Icons
// ============================================================================

function DiscoveryIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function IntentIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function CircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ShieldXIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m14.5 9-5 5" />
      <path d="m9.5 9 5 5" />
    </svg>
  );
}
