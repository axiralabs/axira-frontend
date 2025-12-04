import { Button } from '@axira/shared/components';
import { cn } from '@axira/shared/utils';
import type { ActionButton } from '../types';

interface ActionButtonsRowProps {
  actions: ActionButton[];
  onActionClick: (action: ActionButton) => void;
  onExplainClick?: () => void;
  className?: string;
}

export function ActionButtonsRow({
  actions,
  onActionClick,
  onExplainClick,
  className,
}: ActionButtonsRowProps) {
  if (!actions.length && !onExplainClick) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {actions.map((action) => (
        <Button
          key={action.id}
          variant={mapVariant(action.variant)}
          size="sm"
          onClick={() => onActionClick(action)}
          disabled={action.disabled}
        >
          {getActionIcon(action.actionType)}
          <span className="ml-1.5">{action.label}</span>
        </Button>
      ))}
      {onExplainClick && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onExplainClick}
          className="text-muted-foreground hover:text-foreground"
        >
          <QuestionIcon className="h-4 w-4" />
          <span className="ml-1.5">How did you decide this?</span>
        </Button>
      )}
    </div>
  );
}

function mapVariant(
  variant: ActionButton['variant']
): 'default' | 'secondary' | 'ghost' | 'destructive' {
  switch (variant) {
    case 'primary':
      return 'default';
    case 'secondary':
      return 'secondary';
    case 'ghost':
      return 'ghost';
    case 'destructive':
      return 'destructive';
    default:
      return 'default';
  }
}

function getActionIcon(actionType: ActionButton['actionType']) {
  switch (actionType) {
    case 'CREATE_CASE':
      return <FileIcon className="h-4 w-4" />;
    case 'NOTIFY':
      return <BellIcon className="h-4 w-4" />;
    case 'ESCALATE':
      return <ArrowUpIcon className="h-4 w-4" />;
    case 'EXPLAIN':
      return <QuestionIcon className="h-4 w-4" />;
    case 'CUSTOM':
    default:
      return null;
  }
}

function FileIcon({ className }: { className?: string }) {
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
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
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
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function ArrowUpIcon({ className }: { className?: string }) {
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
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

function QuestionIcon({ className }: { className?: string }) {
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
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
