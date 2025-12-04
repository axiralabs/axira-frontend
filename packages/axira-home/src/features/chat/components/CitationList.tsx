import { cn } from '@axira/shared/utils';
import type { Citation } from '@axira/shared/types';

interface CitationListProps {
  citations: Citation[];
  className?: string;
}

export function CitationList({ citations, className }: CitationListProps) {
  if (!citations.length) return null;

  return (
    <div className={cn('mt-3 pt-3 border-t', className)}>
      <p className="text-xs font-medium text-muted-foreground mb-2">Sources</p>
      <div className="flex flex-wrap gap-1.5">
        {citations.map((citation, index) => (
          <CitationChip key={index} citation={citation} index={index + 1} />
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
  const hasLink = Boolean(citation.url);

  const content = (
    <>
      <span className="inline-flex items-center justify-center w-4 h-4 bg-primary/20 text-primary text-[10px] font-medium rounded-full shrink-0">
        {index}
      </span>
      <span className="truncate max-w-[200px]">{citation.title || citation.source}</span>
    </>
  );

  if (hasLink) {
    return (
      <a
        href={citation.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-2 py-1 text-xs bg-muted hover:bg-accent rounded-md transition-colors"
        title={citation.title || citation.source}
      >
        {content}
        <ExternalLinkIcon className="h-3 w-3 shrink-0 opacity-50" />
      </a>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-1 text-xs bg-muted rounded-md"
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
