import { useState } from 'react';
import { cn } from '@axira/shared/utils';
import type { StrategicInsight, InsightCategory, SourceSystem } from '../types';
import { INSIGHT_CATEGORY_STYLES, SOURCE_SYSTEM_CONFIG } from '../types';

interface StrategicInsightsPanelProps {
  insights: StrategicInsight[];
  onInsightClick?: (insight: StrategicInsight) => void;
  className?: string;
}

export function StrategicInsightsPanel({ insights, onInsightClick, className }: StrategicInsightsPanelProps) {
  const [activeCategory, setActiveCategory] = useState<InsightCategory | null>(null);
  const [expandedInsightId, setExpandedInsightId] = useState<string | null>(null);

  const categories: InsightCategory[] = ['INVEST', 'WATCH', 'OPTIMIZE', 'RISK'];
  const filteredInsights = activeCategory
    ? insights.filter((i) => i.category === activeCategory)
    : insights;

  const handleInsightToggle = (insightId: string) => {
    if (expandedInsightId === insightId) {
      setExpandedInsightId(null);
    } else {
      setExpandedInsightId(insightId);
    }
  };

  const handleAskAboutInsight = (insight: StrategicInsight) => {
    onInsightClick?.(insight);
  };

  // Group by category for display
  const investInsights = filteredInsights.filter((i) => i.category === 'INVEST');
  const watchInsights = filteredInsights.filter((i) => i.category === 'WATCH');
  const optimizeInsights = filteredInsights.filter((i) => i.category === 'OPTIMIZE');
  const riskInsights = filteredInsights.filter((i) => i.category === 'RISK');

  return (
    <div className={cn('rounded-xl border border-gray-700 bg-gray-800/50 overflow-hidden', className)}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">Strategic Recommendations</h3>
        <p className="text-sm text-gray-400">AI-generated insights from operational data</p>
      </div>

      {/* Category Filters */}
      <div className="px-4 py-3 border-b border-gray-700 flex gap-2 flex-wrap">
        <button
          onClick={() => setActiveCategory(null)}
          className={cn(
            'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
            activeCategory === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          )}
        >
          All ({insights.length})
        </button>
        {categories.map((cat) => {
          const count = insights.filter((i) => i.category === cat).length;
          if (count === 0) return null;
          const styles = INSIGHT_CATEGORY_STYLES[cat];
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                activeCategory === cat
                  ? `${styles.bgColor} ${styles.textColor}`
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              )}
            >
              {styles.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Insights Grid */}
      <div className="p-4 space-y-4">
        {/* Invest Section */}
        {investInsights.length > 0 && (
          <InsightSection
            title="Invest More"
            icon={<TrendingUpIcon className="w-5 h-5" />}
            insights={investInsights}
            onInsightToggle={handleInsightToggle}
            onAskAboutInsight={handleAskAboutInsight}
            expandedInsightId={expandedInsightId}
            category="INVEST"
          />
        )}

        {/* Watch Section */}
        {watchInsights.length > 0 && (
          <InsightSection
            title="Watch Closely"
            icon={<EyeIcon className="w-5 h-5" />}
            insights={watchInsights}
            onInsightToggle={handleInsightToggle}
            onAskAboutInsight={handleAskAboutInsight}
            expandedInsightId={expandedInsightId}
            category="WATCH"
          />
        )}

        {/* Optimize Section */}
        {optimizeInsights.length > 0 && (
          <InsightSection
            title="Optimize"
            icon={<SettingsIcon className="w-5 h-5" />}
            insights={optimizeInsights}
            onInsightToggle={handleInsightToggle}
            onAskAboutInsight={handleAskAboutInsight}
            expandedInsightId={expandedInsightId}
            category="OPTIMIZE"
          />
        )}

        {/* Risk Section */}
        {riskInsights.length > 0 && (
          <InsightSection
            title="Risk Alerts"
            icon={<AlertIcon className="w-5 h-5" />}
            insights={riskInsights}
            onInsightToggle={handleInsightToggle}
            onAskAboutInsight={handleAskAboutInsight}
            expandedInsightId={expandedInsightId}
            category="RISK"
          />
        )}
      </div>
    </div>
  );
}

interface InsightSectionProps {
  title: string;
  icon: React.ReactNode;
  insights: StrategicInsight[];
  onInsightToggle: (insightId: string) => void;
  onAskAboutInsight: (insight: StrategicInsight) => void;
  expandedInsightId: string | null;
  category: InsightCategory;
}

function InsightSection({ title, icon, insights, onInsightToggle, onAskAboutInsight, expandedInsightId, category }: InsightSectionProps) {
  const styles = INSIGHT_CATEGORY_STYLES[category];

  return (
    <div>
      <div className={cn('flex items-center gap-2 mb-3', styles.textColor)}>
        {icon}
        <h4 className="font-semibold">{title}</h4>
      </div>
      <div className="space-y-3">
        {insights.map((insight) => (
          <InsightCard
            key={insight.id}
            insight={insight}
            isExpanded={expandedInsightId === insight.id}
            onToggle={() => onInsightToggle(insight.id)}
            onAskAbout={() => onAskAboutInsight(insight)}
          />
        ))}
      </div>
    </div>
  );
}

interface InsightCardProps {
  insight: StrategicInsight;
  isExpanded: boolean;
  onToggle: () => void;
  onAskAbout: () => void;
}

function InsightCard({ insight, isExpanded, onToggle, onAskAbout }: InsightCardProps) {
  const styles = INSIGHT_CATEGORY_STYLES[insight.category];

  return (
    <div
      className={cn(
        'rounded-lg border transition-all cursor-pointer',
        styles.bgColor,
        `border-l-4 ${styles.borderColor} border-t-gray-700 border-r-gray-700 border-b-gray-700`,
        isExpanded && 'ring-1 ring-blue-500/50'
      )}
      onClick={onToggle}
    >
      {/* Header */}
      <div
        className="w-full text-left p-4"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h5 className="font-medium text-white">{insight.title}</h5>
            <p className="text-sm text-gray-300 mt-1">{insight.summary}</p>

            {/* Impact badge */}
            {insight.estimatedImpact && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-700/50 text-sm">
                <DollarIcon className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-medium">{insight.estimatedImpact}</span>
              </div>
            )}

            {/* Source count */}
            <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <DatabaseIcon className="w-3.5 h-3.5" />
                {insight.sources.length} data sources
              </span>
              {insight.relatedBranches && (
                <span className="flex items-center gap-1">
                  <BuildingIcon className="w-3.5 h-3.5" />
                  {insight.relatedBranches.length} branches
                </span>
              )}
            </div>
          </div>

          <ChevronDownIcon className={cn(
            'w-5 h-5 text-gray-500 flex-shrink-0 transition-transform',
            isExpanded && 'rotate-180'
          )} />
        </div>
      </div>

      {/* Expanded Deep Dive Content */}
      {isExpanded && (
        <InsightDeepDive insight={insight} onAskAbout={onAskAbout} />
      )}
    </div>
  );
}

// Deep Dive Component for expanded insight
function InsightDeepDive({ insight, onAskAbout }: { insight: StrategicInsight; onAskAbout: () => void }) {
  const styles = INSIGHT_CATEGORY_STYLES[insight.category];

  // Generate mock detailed analysis based on category
  const analysisDetails = getInsightAnalysis(insight);

  return (
    <div className="px-4 pb-4 border-t border-gray-700/50">
      {/* Analysis Section */}
      <div className="mt-4 space-y-4">
        {/* Key Findings */}
        <div>
          <h6 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
            <LightbulbIcon className="w-4 h-4 text-yellow-400" />
            Key Findings
          </h6>
          <ul className="space-y-2">
            {analysisDetails.findings.map((finding, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                <span className={cn('w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0', styles.textColor.replace('text-', 'bg-'))} />
                {finding}
              </li>
            ))}
          </ul>
        </div>

        {/* Metrics Grid */}
        <div>
          <h6 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
            <ChartIcon className="w-4 h-4 text-blue-400" />
            Supporting Metrics
          </h6>
          <div className="grid grid-cols-2 gap-3">
            {analysisDetails.metrics.map((metric, idx) => (
              <div key={idx} className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-xs text-gray-400">{metric.label}</div>
                <div className="text-lg font-semibold text-white">{metric.value}</div>
                {metric.trend && (
                  <div className={cn(
                    'text-xs flex items-center gap-1 mt-1',
                    metric.trend.startsWith('+') ? 'text-green-400' : metric.trend.startsWith('-') ? 'text-red-400' : 'text-gray-400'
                  )}>
                    {metric.trend.startsWith('+') ? <TrendingUpSmallIcon className="w-3 h-3" /> :
                     metric.trend.startsWith('-') ? <TrendingDownIcon className="w-3 h-3" /> : null}
                    {metric.trend}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Related Branches */}
        {insight.relatedBranches && insight.relatedBranches.length > 0 && (
          <div>
            <h6 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <BuildingIcon className="w-4 h-4 text-purple-400" />
              Affected Branches
            </h6>
            <div className="flex flex-wrap gap-2">
              {insight.relatedBranches.map((branch, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300">
                  {branch}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Data Sources */}
        <div>
          <h6 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
            <DatabaseIcon className="w-4 h-4 text-cyan-400" />
            Data Sources
          </h6>
          <div className="space-y-2">
            {insight.sources.map((source, idx) => {
              const sourceConfig = SOURCE_SYSTEM_CONFIG[source.system] || { label: source.system, icon: 'database', color: 'text-gray-400' };
              return (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <DatabaseIcon className={cn('w-4 h-4', sourceConfig.color)} />
                  <span className="text-gray-300">{sourceConfig.label}</span>
                  {source.dataPoint && (
                    <span className="text-gray-500 text-xs">- {source.dataPoint}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommended Actions */}
        <div>
          <h6 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
            <PlayIcon className="w-4 h-4 text-green-400" />
            Recommended Actions
          </h6>
          <div className="space-y-2">
            {analysisDetails.actions.map((action, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 bg-gray-800/30 rounded-lg">
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                  styles.bgColor, styles.textColor
                )}>
                  {idx + 1}
                </div>
                <span className="text-sm text-gray-300">{action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onAskAbout}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <ChatIcon className="w-4 h-4" />
            Ask Axira
          </button>
          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors flex items-center justify-center gap-2">
            <ReportIcon className="w-4 h-4" />
            Report
          </button>
          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors flex items-center justify-center gap-2">
            <ShareIcon className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper function to generate mock analysis details based on insight
function getInsightAnalysis(insight: StrategicInsight): {
  findings: string[];
  metrics: Array<{ label: string; value: string; trend?: string }>;
  actions: string[];
} {
  // Generate category-specific mock data
  switch (insight.category) {
    case 'INVEST':
      return {
        findings: [
          'Customer acquisition cost decreased by 18% in this segment',
          'Cross-sell success rate is 2.3x higher than average',
          'Net Promoter Score improved from 42 to 67 year-over-year',
          'Average relationship depth increased to 4.2 products per customer'
        ],
        metrics: [
          { label: 'ROI (Projected)', value: '340%', trend: '+85% vs avg' },
          { label: 'Payback Period', value: '8 months' },
          { label: 'Market Opportunity', value: '$2.4M' },
          { label: 'Competition Index', value: 'Low' }
        ],
        actions: [
          'Allocate additional marketing budget to target segment',
          'Train staff on new product features',
          'Set up performance tracking dashboard',
          'Schedule quarterly review meetings'
        ]
      };
    case 'WATCH':
      return {
        findings: [
          'Trend has been developing over the past 6 months',
          'Early indicators show potential for both positive and negative outcomes',
          'Similar patterns observed in peer institutions led to 15% variance',
          'Current mitigation measures are partially effective'
        ],
        metrics: [
          { label: 'Risk Score', value: 'Medium', trend: 'Stable' },
          { label: 'Monitoring Freq', value: 'Weekly' },
          { label: 'Alert Threshold', value: '15%' },
          { label: 'Days to Decision', value: '45' }
        ],
        actions: [
          'Increase monitoring frequency to daily',
          'Establish clear escalation criteria',
          'Prepare contingency action plan',
          'Brief leadership team on potential scenarios'
        ]
      };
    case 'OPTIMIZE':
      return {
        findings: [
          'Current process efficiency is at 72% of benchmark',
          'Automation could reduce manual effort by 40%',
          'Similar optimizations in other departments yielded 25% cost savings',
          'Staff satisfaction scores correlate with process improvements'
        ],
        metrics: [
          { label: 'Efficiency Gap', value: '28%', trend: 'Opportunity' },
          { label: 'Est. Annual Savings', value: '$180K' },
          { label: 'Implementation Time', value: '3 months' },
          { label: 'Effort Required', value: 'Medium' }
        ],
        actions: [
          'Conduct detailed process mapping session',
          'Identify quick wins for immediate implementation',
          'Build business case for technology investment',
          'Assign process owner and improvement team'
        ]
      };
    case 'RISK':
    default:
      return {
        findings: [
          'Risk exposure has increased 23% quarter-over-quarter',
          'Current controls are insufficient for emerging threats',
          'Regulatory scrutiny in this area is intensifying',
          'Peer institutions have reported similar concerns'
        ],
        metrics: [
          { label: 'Risk Exposure', value: '$850K', trend: '+23% QoQ' },
          { label: 'Control Effectiveness', value: '65%' },
          { label: 'Incidents (YTD)', value: '12' },
          { label: 'Days Since Last', value: '18' }
        ],
        actions: [
          'Implement additional control measures immediately',
          'Schedule risk committee review',
          'Update incident response procedures',
          'Commission independent assessment'
        ]
      };
  }
}

// Icons
function TrendingUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 6l-9.5 9.5-5-5L1 18" />
      <path d="M17 6h6v6" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18h6M10 22h4M12 2v1M4.22 4.22l.71.71M1 12h1M4.22 19.78l.71-.71M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function TrendingUpSmallIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 6l-9.5 9.5-5-5L1 18" />
      <path d="M17 6h6v6" />
    </svg>
  );
}

function TrendingDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 18l-9.5-9.5-5 5L1 6" />
      <path d="M17 18h6v-6" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ReportIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function DollarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
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

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <line x1="8" y1="6" x2="8" y2="6" />
      <line x1="16" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="8" y2="10" />
      <line x1="16" y1="10" x2="16" y2="10" />
      <line x1="8" y1="14" x2="8" y2="14" />
      <line x1="16" y1="14" x2="16" y2="14" />
    </svg>
  );
}
