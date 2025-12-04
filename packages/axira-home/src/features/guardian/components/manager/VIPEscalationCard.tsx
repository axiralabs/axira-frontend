import { useState } from 'react';
import { cn } from '@axira/shared/utils';
import type { VIPEscalation, PreparedMaterial, VIPAction } from '../../types/branchManager';
import { SENTIMENT_STYLES } from '../../types/branchManager';
import { formatCurrency } from '../../data/mockBranchManager';

interface VIPEscalationCardProps {
  escalation: VIPEscalation;
  onAction?: (action: string, escalation: VIPEscalation) => void;
  className?: string;
  expanded?: boolean;
}

export function VIPEscalationCard({
  escalation,
  onAction,
  className,
  expanded: initialExpanded = false,
}: VIPEscalationCardProps) {
  const [expanded, setExpanded] = useState(initialExpanded);
  const sentimentStyle = SENTIMENT_STYLES[escalation.customerSentiment];

  return (
    <div className={cn(
      'rounded-xl bg-gray-900/50 border-l-4 border-red-500 overflow-hidden',
      className
    )}>
      {/* Header - Always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left hover:bg-gray-800/30 transition-colors"
      >
        <div className="flex items-start gap-3">
          {/* Priority Icon */}
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-white">{escalation.issueTitle}</h3>
                  <CustomerTierBadge tier={escalation.customerTier} />
                </div>
                <p className="text-sm text-blue-400">{escalation.customerName}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-white">
                  {formatCurrency(escalation.relationshipValue)}
                </p>
                <p className="text-xs text-gray-500">{escalation.relationshipTenure}yr relationship</p>
              </div>
            </div>

            <p className="text-sm text-gray-400 mt-2">{escalation.issueSummary}</p>

            {/* Status row */}
            <div className="mt-3 flex items-center gap-3 flex-wrap">
              <StatusBadge duration={escalation.openDuration} />
              <SentimentBadge sentiment={escalation.customerSentiment} contactCount={escalation.contactCount} />
              {escalation.attritionRisk === 'HIGH' && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
                  High Attrition Risk
                </span>
              )}
              <span className="text-xs text-gray-500">
                Escalated by {escalation.escalatedBy}
              </span>
            </div>
          </div>

          {/* Expand icon */}
          <svg
            className={cn(
              'w-5 h-5 text-gray-500 transition-transform flex-shrink-0',
              expanded && 'rotate-180'
            )}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-gray-800">
          {/* Customer Context */}
          <div className="p-4 border-b border-gray-800 bg-gray-900/30">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Customer Context
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ContextItem label="Relationship Value" value={formatCurrency(escalation.relationshipValue)} />
              <ContextItem label="Tenure" value={`${escalation.relationshipTenure} years`} />
              <ContextItem label="Customer Tier" value={escalation.customerTier} />
              <ContextItem label="Last Contact" value={escalation.lastContact || 'N/A'} />
            </div>
          </div>

          {/* Issue Details */}
          {escalation.issueDetails && (
            <div className="p-4 border-b border-gray-800">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Issue Details
              </h4>
              <p className="text-sm text-gray-300">{escalation.issueDetails}</p>
            </div>
          )}

          {/* Axira Assessment */}
          {escalation.axiraAssessment && (
            <div className="p-4 border-b border-gray-800 bg-blue-500/5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-white">Axira Assessment</h4>
                    <span className={cn(
                      'px-2 py-0.5 rounded-full text-xs font-medium',
                      escalation.axiraAssessment.confidence > 0.9
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-amber-500/20 text-amber-400'
                    )}>
                      {(escalation.axiraAssessment.confidence * 100).toFixed(0)}% confidence
                    </span>
                  </div>
                  <p className="text-sm text-green-400 mt-1">{escalation.axiraAssessment.recommendation}</p>
                  <p className="text-xs text-gray-500 mt-1">{escalation.axiraAssessment.reasoning}</p>
                </div>
              </div>
            </div>
          )}

          {/* Prepared Materials */}
          <div className="p-4 border-b border-gray-800">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Prepared for You
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {escalation.preparedMaterials.map(material => (
                <MaterialItem key={material.id} material={material} />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="p-4">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Actions
            </h4>
            <div className="flex flex-wrap items-center gap-2">
              {escalation.actions.map(action => (
                <ActionButton
                  key={action.id}
                  action={action}
                  onClick={() => onAction?.(action.action, escalation)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CustomerTierBadge({ tier }: { tier: 'VIP' | 'PREMIER' | 'STANDARD' }) {
  const styles = {
    VIP: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    PREMIER: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    STANDARD: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };

  return (
    <span className={cn('px-2 py-0.5 rounded border text-xs font-medium', styles[tier])}>
      {tier}
    </span>
  );
}

function StatusBadge({ duration }: { duration: string }) {
  return (
    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs">
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
      Open {duration}
    </span>
  );
}

function SentimentBadge({ sentiment, contactCount }: { sentiment: VIPEscalation['customerSentiment']; contactCount: number }) {
  const style = SENTIMENT_STYLES[sentiment];

  return (
    <span className={cn('flex items-center gap-1 px-2 py-0.5 rounded-full text-xs', style.bg, style.text)}>
      {sentiment === 'FRUSTRATED' && '😤'}
      {sentiment === 'CONCERNED' && '😟'}
      {sentiment === 'NEUTRAL' && '😐'}
      {sentiment === 'SATISFIED' && '😊'}
      {style.label}
      {contactCount > 1 && ` (${contactCount} calls)`}
    </span>
  );
}

function ContextItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-white">{value}</p>
    </div>
  );
}

function MaterialItem({ material }: { material: PreparedMaterial }) {
  const typeIcons = {
    AUTHORIZATION: '📋',
    TALKING_POINTS: '💬',
    RETENTION_OFFER: '🎁',
    FORM: '📄',
    HISTORY: '📊',
  };

  return (
    <button className={cn(
      'flex items-start gap-2 p-3 rounded-lg text-left transition-colors',
      'bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50',
      material.status !== 'READY' && 'opacity-50'
    )}>
      <span className="text-lg">{typeIcons[material.type]}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{material.title}</p>
        {material.description && (
          <p className="text-xs text-gray-500 truncate">{material.description}</p>
        )}
      </div>
      {material.status === 'READY' ? (
        <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-1" />
      ) : (
        <span className="text-xs text-gray-500">{material.status.toLowerCase()}</span>
      )}
    </button>
  );
}

function ActionButton({ action, onClick }: { action: VIPAction; onClick: () => void }) {
  const icons: Record<string, JSX.Element> = {
    check: <path d="M5 13l4 4L19 7" />,
    phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />,
    mail: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>,
    gift: <><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></>,
    clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
    file: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />,
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
        action.type === 'PRIMARY'
          ? 'bg-blue-600 text-white hover:bg-blue-500'
          : action.type === 'SECONDARY'
          ? 'bg-gray-700 text-white hover:bg-gray-600'
          : 'text-gray-400 hover:text-white hover:bg-gray-700'
      )}
    >
      {action.icon && icons[action.icon] && (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {icons[action.icon]}
        </svg>
      )}
      {action.label}
    </button>
  );
}

// Compact card for pulse list
export function VIPEscalationPulseCard({
  escalation,
  onAction,
}: {
  escalation: VIPEscalation;
  onAction?: (action: string) => void;
}) {
  const primaryAction = escalation.actions.find(a => a.type === 'PRIMARY');

  return (
    <div className="rounded-xl bg-gray-900/50 border-l-4 border-red-500 p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-white">VIP: {escalation.customerName}</h3>
            <CustomerTierBadge tier={escalation.customerTier} />
          </div>
          <p className="text-sm text-gray-400 mt-0.5">{escalation.issueSummary}</p>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <StatusBadge duration={escalation.openDuration} />
            <span className="text-xs text-gray-500">{formatCurrency(escalation.relationshipValue)} relationship</span>
          </div>
          {primaryAction && (
            <button
              onClick={() => onAction?.(primaryAction.action)}
              className="mt-3 px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-500 transition-colors"
            >
              {primaryAction.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
