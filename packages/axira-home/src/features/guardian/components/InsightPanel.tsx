import { cn } from '@axira/shared/utils';
import type { BriefInsight } from '../types';

interface InsightPanelProps {
  insights: BriefInsight[];
  title?: string;
  className?: string;
}

export function InsightPanel({
  insights,
  title = 'Proactive Insights',
  className,
}: InsightPanelProps) {
  if (insights.length === 0) return null;

  return (
    <div className={cn('bg-gray-800/50 rounded-lg border border-gray-700 p-4', className)}>
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
        {title}
      </h3>
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <InsightCard key={insight.id} insight={insight} featured={index === 0} />
        ))}
      </div>
    </div>
  );
}

interface InsightCardProps {
  insight: BriefInsight;
  featured?: boolean;
}

function InsightCard({ insight, featured }: InsightCardProps) {
  const trendStyles = {
    UP: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-400',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      ),
    },
    DOWN: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
          <polyline points="17 18 23 18 23 12" />
        </svg>
      ),
    },
    STABLE: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      ),
    },
  };

  const trendStyle = insight.trend ? trendStyles[insight.trend] : trendStyles.STABLE;

  return (
    <div
      className={cn(
        'rounded-lg p-3 transition-all',
        featured ? `${trendStyle.bg} border ${trendStyle.border}` : 'hover:bg-gray-700/30'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Trend indicator or lightbulb */}
        {insight.trend ? (
          <div className={cn(
            'flex items-center justify-center w-10 h-10 rounded-lg',
            trendStyle.bg,
            trendStyle.text
          )}>
            {trendStyle.icon}
          </div>
        ) : (
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18h6M10 22h4M12 2v1M12 5a6 6 0 0 1 6 6c0 2.22-1.21 4.16-3 5.19V17a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-.81C7.21 15.16 6 13.22 6 11a6 6 0 0 1 6-6z" />
            </svg>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className={cn(
            'text-sm',
            featured ? 'text-white font-medium' : 'text-gray-300'
          )}>
            {insight.message}
          </p>

          <div className="flex items-center gap-3 mt-2">
            {insight.metric && (
              <span className={cn(
                'text-lg font-bold',
                trendStyle.text
              )}>
                {insight.metric}
              </span>
            )}
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              {insight.source}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Compact version for sidebar
interface CompactInsightProps {
  insight: BriefInsight;
  className?: string;
}

export function CompactInsight({ insight, className }: CompactInsightProps) {
  return (
    <div className={cn('flex items-center gap-2 py-2', className)}>
      <div className="flex items-center justify-center w-6 h-6 rounded bg-amber-500/10 text-amber-400">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18h6M10 22h4M12 2v1M12 5a6 6 0 0 1 6 6c0 2.22-1.21 4.16-3 5.19V17a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-.81C7.21 15.16 6 13.22 6 11a6 6 0 0 1 6-6z" />
        </svg>
      </div>
      <p className="text-sm text-gray-400 flex-1">{insight.message}</p>
      {insight.metric && (
        <span className={cn(
          'text-sm font-semibold',
          insight.trend === 'UP' && 'text-green-400',
          insight.trend === 'DOWN' && 'text-red-400',
          (!insight.trend || insight.trend === 'STABLE') && 'text-blue-400'
        )}>
          {insight.metric}
        </span>
      )}
    </div>
  );
}
