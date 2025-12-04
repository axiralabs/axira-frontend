import { type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';
import type { StatusType } from '../types';

const STATUS_STYLES: Record<StatusType, string> = {
  PASS: 'bg-green-50 text-green-700 border-green-200',
  WARNING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  FAIL: 'bg-red-50 text-red-700 border-red-200',
  DENIED: 'bg-gray-50 text-gray-600 border-gray-200',
};

const STATUS_ICONS: Record<StatusType, string> = {
  PASS: '✓',
  WARNING: '⚠',
  FAIL: '✗',
  DENIED: '⊘',
};

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: StatusType;
  showIcon?: boolean;
}

export function StatusBadge({ status, showIcon = true, className, children, ...props }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium',
        STATUS_STYLES[status],
        className
      )}
      {...props}
    >
      {showIcon && <span aria-hidden="true">{STATUS_ICONS[status]}</span>}
      {children ?? status}
    </span>
  );
}
