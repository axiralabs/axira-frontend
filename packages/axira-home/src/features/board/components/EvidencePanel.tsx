import { useState } from 'react';
import { cn } from '@axira/shared/utils';
import type { AuditTrail, DecisionStep, EvidenceSource, AccessDecision } from '../types';
import { SOURCE_SYSTEM_CONFIG } from '../types';

interface EvidencePanelProps {
  auditTrail: AuditTrail;
  onClose: () => void;
  className?: string;
}

export function EvidencePanel({ auditTrail, onClose, className }: EvidencePanelProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'steps' | 'sources' | 'access' | 'audit'>('summary');

  const tabs = [
    { id: 'summary', label: 'Summary' },
    { id: 'steps', label: 'Decision Steps' },
    { id: 'sources', label: 'Data Sources' },
    { id: 'access', label: 'Access Decisions' },
    { id: 'audit', label: 'Hash Chain' },
  ] as const;

  // Collect all sources from all steps
  const allSources = auditTrail.decisionSteps.flatMap((step) => step.sources);

  return (
    <div className={cn('fixed inset-y-0 right-0 w-full max-w-2xl bg-gray-900 border-l border-gray-700 shadow-2xl z-50', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <ShieldCheckIcon className="w-6 h-6 text-green-500" />
            Evidence Pack
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Complete audit trail for this response
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Verification Banner */}
      <div className={cn(
        'mx-6 mt-4 p-4 rounded-lg border',
        auditTrail.hashChain.verified
          ? 'bg-green-900/20 border-green-700'
          : 'bg-red-900/20 border-red-700'
      )}>
        <div className="flex items-center gap-3">
          {auditTrail.hashChain.verified ? (
            <CheckCircleIcon className="w-6 h-6 text-green-500" />
          ) : (
            <AlertCircleIcon className="w-6 h-6 text-red-500" />
          )}
          <div>
            <p className={cn(
              'font-medium',
              auditTrail.hashChain.verified ? 'text-green-400' : 'text-red-400'
            )}>
              {auditTrail.hashChain.verified ? 'Evidence Chain Verified' : 'Verification Failed'}
            </p>
            <p className="text-sm text-gray-400">
              {auditTrail.hashChain.verified
                ? 'All evidence is cryptographically verified and tamper-proof'
                : 'Hash chain integrity check failed'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-6 mt-4 border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-t-lg transition-colors',
              activeTab === tab.id
                ? 'bg-gray-800 text-white border-t border-x border-gray-700'
                : 'text-gray-400 hover:text-white'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6" style={{ height: 'calc(100vh - 260px)' }}>
        {activeTab === 'summary' && (
          <SummaryTab auditTrail={auditTrail} sourcesCount={allSources.length} />
        )}
        {activeTab === 'steps' && (
          <DecisionStepsTab steps={auditTrail.decisionSteps} />
        )}
        {activeTab === 'sources' && (
          <SourcesTab sources={allSources} />
        )}
        {activeTab === 'access' && (
          <AccessDecisionsTab decisions={auditTrail.accessDecisions} />
        )}
        {activeTab === 'audit' && (
          <HashChainTab hashChain={auditTrail.hashChain} />
        )}
      </div>
    </div>
  );
}

// Summary Tab
function SummaryTab({ auditTrail, sourcesCount }: { auditTrail: AuditTrail; sourcesCount: number }) {
  return (
    <div className="space-y-6">
      {/* Query */}
      <div className="rounded-lg bg-gray-800/50 border border-gray-700 p-4">
        <p className="text-sm text-gray-500 mb-2">Original Query</p>
        <p className="text-white">{auditTrail.queryText}</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          label="Processing Time"
          value={`${auditTrail.totalDurationMs}ms`}
          icon={<ClockIcon className="w-5 h-5" />}
        />
        <MetricCard
          label="Decision Steps"
          value={auditTrail.decisionSteps.length.toString()}
          icon={<ListIcon className="w-5 h-5" />}
        />
        <MetricCard
          label="Data Sources"
          value={sourcesCount.toString()}
          icon={<DatabaseIcon className="w-5 h-5" />}
        />
        <MetricCard
          label="Access Checks"
          value={auditTrail.accessDecisions.length.toString()}
          icon={<ShieldIcon className="w-5 h-5" />}
        />
      </div>

      {/* Timeline */}
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-3">Execution Timeline</h3>
        <div className="space-y-3">
          <TimelineItem
            time={auditTrail.requestedAt}
            label="Request received"
            type="start"
          />
          {auditTrail.decisionSteps.map((step) => (
            <TimelineItem
              key={step.id}
              time={step.timestamp}
              label={`${step.agentName}: ${step.skillName}`}
              duration={step.durationMs}
              type="step"
              status={step.outcome}
            />
          ))}
          <TimelineItem
            time={auditTrail.completedAt}
            label="Response delivered"
            type="end"
          />
        </div>
      </div>

      {/* Responsible AI Notice */}
      <div className="rounded-lg bg-blue-900/20 border border-blue-700 p-4">
        <div className="flex items-start gap-3">
          <SparklesIcon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-300">Responsible AI</p>
            <p className="text-sm text-gray-400 mt-1">
              This response was generated using verified data sources with full audit trail.
              No hallucinations — only information traceable to your systems.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Decision Steps Tab
function DecisionStepsTab({ steps }: { steps: DecisionStep[] }) {
  return (
    <div className="space-y-4">
      {steps.map((step) => (
        <DecisionStepCard key={step.id} step={step} />
      ))}
    </div>
  );
}

function DecisionStepCard({ step }: { step: DecisionStep }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={cn(
      'rounded-lg border overflow-hidden',
      step.outcome === 'PASS' && 'border-green-700/50 bg-green-900/10',
      step.outcome === 'WARNING' && 'border-amber-700/50 bg-amber-900/10',
      step.outcome === 'FAIL' && 'border-red-700/50 bg-red-900/10',
      step.outcome === 'INFO' && 'border-gray-700 bg-gray-800/50',
    )}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-medium text-white">
            {step.stepNumber}
          </div>
          <div>
            <p className="font-medium text-white">{step.description}</p>
            <p className="text-sm text-gray-400">{step.agentName} • {step.skillName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">{step.durationMs}ms</span>
          <OutcomeBadge outcome={step.outcome} />
          <ChevronIcon className={cn('w-5 h-5 text-gray-500 transition-transform', isExpanded && 'rotate-180')} />
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-700/50">
          <p className="text-sm text-gray-500 mt-3 mb-2">Sources Used ({step.sources.length})</p>
          <div className="space-y-2">
            {step.sources.map((source) => (
              <SourceCard key={source.id} source={source} compact />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Sources Tab
function SourcesTab({ sources }: { sources: EvidenceSource[] }) {
  // Group by system
  const grouped = sources.reduce((acc, source) => {
    if (!acc[source.system]) acc[source.system] = [];
    acc[source.system].push(source);
    return acc;
  }, {} as Record<string, EvidenceSource[]>);

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([system, systemSources]) => {
        const config = SOURCE_SYSTEM_CONFIG[system as keyof typeof SOURCE_SYSTEM_CONFIG];
        return (
          <div key={system}>
            <div className="flex items-center gap-2 mb-3">
              <SystemIcon system={system} className={cn('w-5 h-5', config?.color || 'text-gray-400')} />
              <h3 className="font-medium text-white">{config?.label || system}</h3>
              <span className="text-xs text-gray-500">({systemSources.length})</span>
            </div>
            <div className="space-y-2">
              {systemSources.map((source) => (
                <SourceCard key={source.id} source={source} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SourceCard({ source, compact }: { source: EvidenceSource; compact?: boolean }) {
  const config = SOURCE_SYSTEM_CONFIG[source.system];

  return (
    <div className={cn(
      'rounded-lg border border-gray-700 bg-gray-800/30 p-3',
      compact && 'p-2'
    )}>
      <div className="flex items-start gap-3">
        <SystemIcon system={source.system} className={cn('w-4 h-4 mt-0.5', config?.color || 'text-gray-400')} />
        <div className="flex-1 min-w-0">
          <p className={cn('text-gray-200', compact ? 'text-xs' : 'text-sm')}>{source.description}</p>
          {source.documentName && (
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              <FileIcon className="w-3 h-3" />
              {source.documentName}
            </p>
          )}
          {source.dataPoint && (
            <p className="text-xs text-blue-400 mt-1">{source.dataPoint}</p>
          )}
          {source.policyReference && (
            <p className="text-xs text-amber-400 mt-1">Policy: {source.policyReference}</p>
          )}
          <p className="text-xs text-gray-600 mt-1">
            Accessed: {new Date(source.accessedAt).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}

// Access Decisions Tab
function AccessDecisionsTab({ decisions }: { decisions: AccessDecision[] }) {
  const allowed = decisions.filter((d) => d.action === 'ALLOWED');
  const denied = decisions.filter((d) => d.action === 'DENIED');

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex gap-4">
        <div className="flex-1 rounded-lg bg-green-900/20 border border-green-700 p-3 text-center">
          <p className="text-2xl font-bold text-green-400">{allowed.length}</p>
          <p className="text-sm text-gray-400">Allowed</p>
        </div>
        <div className="flex-1 rounded-lg bg-red-900/20 border border-red-700 p-3 text-center">
          <p className="text-2xl font-bold text-red-400">{denied.length}</p>
          <p className="text-sm text-gray-400">Denied</p>
        </div>
      </div>

      {/* Decisions List */}
      <div className="space-y-2">
        {decisions.map((decision) => (
          <div
            key={decision.id}
            className={cn(
              'rounded-lg border p-3',
              decision.action === 'ALLOWED' ? 'border-green-700/50 bg-green-900/10' : 'border-red-700/50 bg-red-900/10'
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {decision.action === 'ALLOWED' ? (
                  <CheckIcon className="w-4 h-4 text-green-500" />
                ) : (
                  <XIcon className="w-4 h-4 text-red-500" />
                )}
                <span className={cn(
                  'text-sm font-medium',
                  decision.action === 'ALLOWED' ? 'text-green-400' : 'text-red-400'
                )}>
                  {decision.action}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(decision.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-sm text-gray-200">{decision.resource}</p>
            <p className="text-xs text-gray-500 mt-1">{decision.resourceType}</p>
            <p className="text-xs text-gray-400 mt-2">{decision.reason}</p>
            <p className="text-xs text-blue-400 mt-1">Policy: {decision.policyRef}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Hash Chain Tab
function HashChainTab({ hashChain }: { hashChain: AuditTrail['hashChain'] }) {
  return (
    <div className="space-y-6">
      {/* Status */}
      <div className={cn(
        'rounded-lg border p-4',
        hashChain.verified ? 'border-green-700 bg-green-900/20' : 'border-red-700 bg-red-900/20'
      )}>
        <div className="flex items-center gap-3 mb-4">
          {hashChain.verified ? (
            <CheckCircleIcon className="w-8 h-8 text-green-500" />
          ) : (
            <AlertCircleIcon className="w-8 h-8 text-red-500" />
          )}
          <div>
            <p className={cn(
              'text-lg font-semibold',
              hashChain.verified ? 'text-green-400' : 'text-red-400'
            )}>
              {hashChain.verified ? 'Integrity Verified' : 'Integrity Check Failed'}
            </p>
            <p className="text-sm text-gray-400">
              {hashChain.verified
                ? 'The evidence chain has not been tampered with'
                : 'Hash chain verification failed'}
            </p>
          </div>
        </div>
      </div>

      {/* Hash Details */}
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500 mb-2">Current Hash</p>
          <div className="font-mono text-xs bg-gray-800 rounded-lg p-3 text-green-400 break-all">
            {hashChain.hash}
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-2">Previous Hash</p>
          <div className="font-mono text-xs bg-gray-800 rounded-lg p-3 text-gray-400 break-all">
            {hashChain.previousHash}
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="rounded-lg bg-gray-800/50 border border-gray-700 p-4">
        <h4 className="font-medium text-white mb-2">What is a Hash Chain?</h4>
        <p className="text-sm text-gray-400">
          Every piece of evidence in this response is cryptographically linked together
          using SHA-256 hashing. This creates an immutable audit trail that cannot be
          modified without detection — the same technology used in blockchain systems.
        </p>
      </div>
    </div>
  );
}

// Helper Components
function MetricCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-gray-800/50 border border-gray-700 p-4">
      <div className="flex items-center gap-2 text-gray-400 mb-2">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function TimelineItem({
  time,
  label,
  duration,
  type,
  status,
}: {
  time: string;
  label: string;
  duration?: number;
  type: 'start' | 'step' | 'end';
  status?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-16">
        {new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </span>
      <div className={cn(
        'w-3 h-3 rounded-full',
        type === 'start' && 'bg-blue-500',
        type === 'end' && 'bg-green-500',
        type === 'step' && status === 'PASS' && 'bg-green-500',
        type === 'step' && status === 'WARNING' && 'bg-amber-500',
        type === 'step' && status === 'FAIL' && 'bg-red-500',
        type === 'step' && status === 'INFO' && 'bg-gray-500',
      )} />
      <span className="text-sm text-gray-300 flex-1">{label}</span>
      {duration && <span className="text-xs text-gray-500">{duration}ms</span>}
    </div>
  );
}

function OutcomeBadge({ outcome }: { outcome: string }) {
  const config: Record<string, { label: string; className: string }> = {
    PASS: { label: 'Pass', className: 'bg-green-900/50 text-green-400' },
    WARNING: { label: 'Warning', className: 'bg-amber-900/50 text-amber-400' },
    FAIL: { label: 'Fail', className: 'bg-red-900/50 text-red-400' },
    INFO: { label: 'Info', className: 'bg-gray-700 text-gray-400' },
  };

  const { label, className } = config[outcome] || config.INFO;

  return (
    <span className={cn('px-2 py-0.5 rounded text-xs font-medium', className)}>
      {label}
    </span>
  );
}

function SystemIcon({ system, className }: { system: string; className?: string }) {
  switch (system) {
    case 'SILVERLAKE_CORE':
      return <DatabaseIcon className={className} />;
    case 'SYNERGY_DMS':
      return <FolderIcon className={className} />;
    case 'SHAREPOINT':
      return <FileTextIcon className={className} />;
    case 'LEXISNEXIS':
      return <ShieldIcon className={className} />;
    case 'HR_SYSTEM':
      return <UsersIcon className={className} />;
    case 'AXIRA_ANALYTICS':
      return <BarChartIcon className={className} />;
    case 'REGULATORY_FEED':
      return <BellIcon className={className} />;
    default:
      return <DatabaseIcon className={className} />;
  }
}

// Icons
function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="M22 4L12 14.01l-3-3" />
    </svg>
  );
}

function AlertCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function DatabaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3l1.912 5.813L20 10l-6.088 1.187L12 17l-1.912-5.813L4 10l6.088-1.187L12 3z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function FileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

function FolderIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function FileTextIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function BarChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
