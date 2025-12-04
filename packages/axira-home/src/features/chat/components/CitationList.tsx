import { cn } from '@axira/shared/utils';
import type { Citation } from '@axira/shared/types';

interface CitationListProps {
  citations: Citation[];
  className?: string;
}

// Source system icons and colors
const SOURCE_STYLES: Record<string, { icon: string; color: string; bgColor: string }> = {
  SILVERLAKE_CORE: { icon: '🏦', color: 'text-blue-400', bgColor: 'bg-blue-900/30' },
  SHAREPOINT: { icon: '📄', color: 'text-orange-400', bgColor: 'bg-orange-900/30' },
  AXIRA_ANALYTICS: { icon: '📊', color: 'text-emerald-400', bgColor: 'bg-emerald-900/30' },
  SYNERGY_DMS: { icon: '📁', color: 'text-green-400', bgColor: 'bg-green-900/30' },
  LEXISNEXIS: { icon: '🛡️', color: 'text-purple-400', bgColor: 'bg-purple-900/30' },
};

export function CitationList({ citations, className }: CitationListProps) {
  if (!citations.length) return null;

  return (
    <div className={cn('mt-3 pt-3 border-t border-gray-700', className)}>
      <p className="text-xs font-medium text-gray-400 mb-2">Sources</p>
      <div className="flex flex-wrap gap-2">
        {citations.map((citation, index) => (
          <CitationChip key={citation.id || index} citation={citation} index={index + 1} />
        ))}
      </div>
    </div>
  );
}

interface CitationChipProps {
  citation: Citation;
  index: number;
}

function CitationChip({ citation, index }: CitationChipProps) {
  const hasRealLink = Boolean(citation.url) && !citation.url?.startsWith('#');
  const sourceStyle = SOURCE_STYLES[citation.source] || { icon: '📎', color: 'text-gray-400', bgColor: 'bg-gray-800' };

  const content = (
    <>
      <span className="text-sm">{sourceStyle.icon}</span>
      <span className={cn('truncate max-w-[180px]', sourceStyle.color)}>{citation.title || citation.source}</span>
    </>
  );

  // Only render as a link if it's a real URL (not a hash link)
  if (hasRealLink) {
    return (
      <a
        href={citation.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg transition-colors border border-gray-700',
          sourceStyle.bgColor,
          'hover:border-gray-600 hover:brightness-110'
        )}
        title={citation.title || citation.source}
      >
        {content}
        <ExternalLinkIcon className="h-3 w-3 shrink-0 text-gray-500" />
      </a>
    );
  }

  // For hash links or no links, render as a non-interactive chip
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border border-gray-700 cursor-default',
        sourceStyle.bgColor
      )}
      title={citation.title || citation.source}
    >
      {content}
    </span>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
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
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
