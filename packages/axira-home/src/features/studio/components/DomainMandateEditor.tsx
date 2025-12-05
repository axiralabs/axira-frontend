import { useState, useCallback } from 'react';
import { cn } from '@axira/shared/utils';

// ============================================================================
// Types
// ============================================================================

export type DiscoveryMode = 'SEMANTIC' | 'EXPLICIT' | 'HYBRID' | 'RESTRICTED';

export interface DomainMandate {
  allowedDomains: string[];
  discoveryMode: DiscoveryMode;
  domainPriority: Record<string, number>;
  capabilityConstraints: string[];
}

export interface DomainMandateEditorProps {
  agentId: string;
  agentName: string;
  mandates: DomainMandate;
  availableDomains?: string[];
  onSave: (mandates: DomainMandate) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  className?: string;
}

// Default available domains for banking vertical
const DEFAULT_DOMAINS = [
  'compliance',
  'operations',
  'customer_service',
  'lending',
  'deposits',
  'wealth_management',
  'risk_management',
  'fraud_detection',
  'reporting',
  'general',
];

// Discovery mode descriptions
const DISCOVERY_MODE_INFO: Record<DiscoveryMode, { label: string; description: string }> = {
  SEMANTIC: {
    label: 'Semantic',
    description: 'Use intent and domain matching to discover capabilities dynamically. Best for flexible, general-purpose agents.',
  },
  EXPLICIT: {
    label: 'Explicit',
    description: 'Only use capabilities explicitly bound to this agent. Best for tightly controlled workflows.',
  },
  HYBRID: {
    label: 'Hybrid',
    description: 'Try explicit bindings first, then fall back to semantic discovery. Balances control with flexibility.',
  },
  RESTRICTED: {
    label: 'Restricted',
    description: 'Only discover capabilities within allowed domains. Best for domain-specific agents.',
  },
};

// ============================================================================
// Main Component
// ============================================================================

export function DomainMandateEditor({
  agentId,
  agentName,
  mandates,
  availableDomains = DEFAULT_DOMAINS,
  onSave,
  onCancel,
  isLoading = false,
  className,
}: DomainMandateEditorProps) {
  const [localMandates, setLocalMandates] = useState<DomainMandate>(mandates);
  const [hasChanges, setHasChanges] = useState(false);
  const [newConstraint, setNewConstraint] = useState('');

  const updateMandates = useCallback((updates: Partial<DomainMandate>) => {
    setLocalMandates((prev) => ({ ...prev, ...updates }));
    setHasChanges(true);
  }, []);

  const handleDomainToggle = useCallback((domain: string) => {
    setLocalMandates((prev) => {
      const isSelected = prev.allowedDomains.includes(domain);
      const newAllowedDomains = isSelected
        ? prev.allowedDomains.filter((d) => d !== domain)
        : [...prev.allowedDomains, domain];

      // Remove priority for deselected domains
      const newPriority = { ...prev.domainPriority };
      if (isSelected) {
        delete newPriority[domain];
      } else if (!(domain in newPriority)) {
        newPriority[domain] = 1.0;
      }

      return {
        ...prev,
        allowedDomains: newAllowedDomains,
        domainPriority: newPriority,
      };
    });
    setHasChanges(true);
  }, []);

  const handlePriorityChange = useCallback((domain: string, priority: number) => {
    setLocalMandates((prev) => ({
      ...prev,
      domainPriority: {
        ...prev.domainPriority,
        [domain]: priority,
      },
    }));
    setHasChanges(true);
  }, []);

  const handleAddConstraint = useCallback(() => {
    if (newConstraint.trim()) {
      setLocalMandates((prev) => ({
        ...prev,
        capabilityConstraints: [...prev.capabilityConstraints, newConstraint.trim()],
      }));
      setNewConstraint('');
      setHasChanges(true);
    }
  }, [newConstraint]);

  const handleRemoveConstraint = useCallback((index: number) => {
    setLocalMandates((prev) => ({
      ...prev,
      capabilityConstraints: prev.capabilityConstraints.filter((_, i) => i !== index),
    }));
    setHasChanges(true);
  }, []);

  const handleSave = useCallback(() => {
    onSave(localMandates);
    setHasChanges(false);
  }, [localMandates, onSave]);

  const handleReset = useCallback(() => {
    setLocalMandates(mandates);
    setHasChanges(false);
  }, [mandates]);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Discovery Configuration</h2>
          <p className="text-sm text-gray-400 mt-1">
            Configure how <span className="text-white">{agentName}</span> discovers and uses capabilities
          </p>
        </div>
        {hasChanges && (
          <span className="text-xs px-2 py-1 bg-yellow-600/20 text-yellow-400 rounded">
            Unsaved changes
          </span>
        )}
      </div>

      {/* Discovery Mode Selector */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
        <h3 className="text-sm font-medium text-white mb-4">Discovery Mode</h3>
        <div className="grid grid-cols-2 gap-3">
          {(Object.entries(DISCOVERY_MODE_INFO) as [DiscoveryMode, typeof DISCOVERY_MODE_INFO[DiscoveryMode]][]).map(
            ([mode, info]) => (
              <button
                key={mode}
                type="button"
                onClick={() => updateMandates({ discoveryMode: mode })}
                className={cn(
                  'p-4 rounded-lg border text-left transition-colors',
                  localMandates.discoveryMode === mode
                    ? 'border-blue-500 bg-blue-600/10'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                      localMandates.discoveryMode === mode
                        ? 'border-blue-500'
                        : 'border-gray-600'
                    )}
                  >
                    {localMandates.discoveryMode === mode && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <span className="font-medium text-white">{info.label}</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{info.description}</p>
              </button>
            )
          )}
        </div>
      </div>

      {/* Domain Selection */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-white">Allowed Domains</h3>
          <span className="text-xs text-gray-500">
            {localMandates.allowedDomains.length} of {availableDomains.length} selected
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {availableDomains.map((domain) => {
            const isSelected = localMandates.allowedDomains.includes(domain);
            return (
              <button
                key={domain}
                type="button"
                onClick={() => handleDomainToggle(domain)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                )}
              >
                {formatDomainLabel(domain)}
              </button>
            );
          })}
        </div>

        {localMandates.allowedDomains.length === 0 && (
          <p className="text-xs text-yellow-400 flex items-center gap-1">
            <WarningIcon className="w-3.5 h-3.5" />
            No domains selected. Agent will not be able to discover any capabilities.
          </p>
        )}
      </div>

      {/* Domain Priority */}
      {localMandates.allowedDomains.length > 0 && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-white">Domain Priority</h3>
              <p className="text-xs text-gray-500 mt-1">
                Higher priority domains are preferred during capability selection
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {localMandates.allowedDomains.map((domain) => {
              const priority = localMandates.domainPriority[domain] ?? 1.0;
              return (
                <div key={domain} className="flex items-center gap-4">
                  <div className="w-32 text-sm text-white">{formatDomainLabel(domain)}</div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={priority}
                    onChange={(e) => handlePriorityChange(domain, parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="w-16 text-right">
                    <span
                      className={cn(
                        'text-sm font-mono',
                        priority > 1.2 ? 'text-green-400' : priority < 0.8 ? 'text-red-400' : 'text-gray-400'
                      )}
                    >
                      {priority.toFixed(1)}x
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Capability Constraints (CEL expressions) */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-white">Capability Constraints</h3>
            <p className="text-xs text-gray-500 mt-1">
              CEL expressions to filter capabilities at runtime
            </p>
          </div>
        </div>

        {/* Existing constraints */}
        {localMandates.capabilityConstraints.length > 0 && (
          <div className="space-y-2 mb-4">
            {localMandates.capabilityConstraints.map((constraint, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2"
              >
                <CodeIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <code className="flex-1 text-sm text-gray-300 font-mono truncate">
                  {constraint}
                </code>
                <button
                  type="button"
                  onClick={() => handleRemoveConstraint(index)}
                  className="text-gray-500 hover:text-red-400 transition-colors"
                  aria-label="Remove constraint"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add new constraint */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newConstraint}
            onChange={(e) => setNewConstraint(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddConstraint();
              }
            }}
            placeholder="capability.riskLevel <= 'MEDIUM'"
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={handleAddConstraint}
            disabled={!newConstraint.trim()}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm text-white transition-colors"
          >
            Add
          </button>
        </div>

        {/* Examples */}
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-2">Examples:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "capability.riskLevel <= 'MEDIUM'",
              "capability.costBand != 'HIGH'",
              "capability.healthStatus == 'healthy'",
            ].map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setNewConstraint(example)}
                className="text-xs px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-400 hover:text-white font-mono transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium text-white transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={handleReset}
          disabled={!hasChanges}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium text-white transition-colors"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isLoading || !hasChanges}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium text-white transition-colors inline-flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <SpinnerIcon className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Helper Functions
// ============================================================================

function formatDomainLabel(domain: string): string {
  return domain
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// ============================================================================
// Icons
// ============================================================================

function WarningIcon({ className }: { className?: string }) {
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
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function CodeIcon({ className }: { className?: string }) {
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
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
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
