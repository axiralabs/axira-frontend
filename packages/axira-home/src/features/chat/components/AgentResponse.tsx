import { useState } from 'react';
import { SimpleAvatar, Skeleton } from '@axira/shared/components';
import { cn } from '@axira/shared/utils';
import type { ChatMessage, ActionButton, QuickAction } from '../types';
import { PlanningIndicator } from './PlanningIndicator';
import { StructuredResponseCard } from './StructuredResponseCard';
import { ActionButtonsRow } from './ActionButtonsRow';
import { CitationList } from './CitationList';

interface AgentResponseProps {
  message: ChatMessage;
  onExplainClick?: (evidencePackId: string) => void;
  onFollowUpClick?: (question: string) => void;
  onQuickActionClick?: (action: QuickAction) => void;
  className?: string;
}

export function AgentResponse({ message, onExplainClick, onFollowUpClick, onQuickActionClick, className }: AgentResponseProps) {
  const isStreaming = message.isStreaming ?? false;
  const hasContent = message.content.length > 0;
  const hasPlanningInfo =
    message.planningState || (message.skillsExecuted && message.skillsExecuted.length > 0);
  const hasStructuredResponse = Boolean(message.structuredResponse);
  const hasCitations = Boolean(message.citations?.length);
  const hasActions = Boolean(message.structuredResponse?.availableActions?.length);
  const hasFollowUps = Boolean(message.followUpQuestions?.length);
  const hasQuickActions = Boolean(message.quickActions?.length);

  const handleActionClick = (action: ActionButton) => {
    // Handle action based on type
    console.log('Action clicked:', action);
    // TODO: Implement action handlers
  };

  const handleExplainClick = () => {
    if (message.evidencePackId && onExplainClick) {
      onExplainClick(message.evidencePackId);
    }
  };

  const handleFollowUpClick = (question: string) => {
    if (onFollowUpClick) {
      onFollowUpClick(question);
    }
  };

  const handleQuickActionClick = (action: QuickAction) => {
    console.log('Quick action clicked:', action);
    if (onQuickActionClick) {
      onQuickActionClick(action);
    }
  };

  return (
    <div className={cn('flex items-start gap-3', className)}>
      <SimpleAvatar fallback="AX" size="sm" className="bg-gray-700 text-gray-300" />
      <div className="flex-1 max-w-[85%] space-y-2">
        {/* Planning indicator */}
        {(isStreaming || hasPlanningInfo) && (
          <PlanningIndicator
            planningState={message.planningState ?? null}
            skillsExecuted={message.skillsExecuted ?? []}
            isStreaming={isStreaming}
          />
        )}

        {/* Structured response card */}
        {hasStructuredResponse && !isStreaming && message.structuredResponse && (
          <StructuredResponseCard response={message.structuredResponse} />
        )}

        {/* Response content */}
        {hasContent ? (
          <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-tl-sm px-4 py-2.5">
            <div className="text-sm text-gray-200">
              <FormattedContent content={message.content} />
            </div>
          </div>
        ) : isStreaming ? (
          <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-tl-sm px-4 py-2.5 space-y-2">
            <Skeleton className="h-4 w-full bg-gray-700" />
            <Skeleton className="h-4 w-3/4 bg-gray-700" />
            <Skeleton className="h-4 w-1/2 bg-gray-700" />
          </div>
        ) : null}

        {/* Citations */}
        {hasCitations && message.citations && (
          <CitationList citations={message.citations} />
        )}

        {/* Action buttons */}
        {!isStreaming && (hasActions || message.evidencePackId) && (
          <ActionButtonsRow
            actions={message.structuredResponse?.availableActions ?? []}
            onActionClick={handleActionClick}
            onExplainClick={message.evidencePackId ? handleExplainClick : undefined}
            className="mt-3"
          />
        )}

        {/* Quick Actions */}
        {!isStreaming && hasQuickActions && message.quickActions && (
          <div className="flex flex-wrap gap-2 mt-3">
            {message.quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickActionClick(action)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 hover:border-gray-600 transition-colors"
              >
                <QuickActionIcon icon={action.icon} />
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Follow-up Questions */}
        {!isStreaming && hasFollowUps && message.followUpQuestions && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium text-gray-500">Follow-up questions</p>
            <div className="flex flex-col gap-2">
              {message.followUpQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleFollowUpClick(question)}
                  className="text-left px-3 py-2 text-sm text-blue-400 bg-blue-900/20 border border-blue-800/50 rounded-lg hover:bg-blue-900/30 hover:border-blue-700 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Timestamp */}
        {!isStreaming && (
          <span className="text-xs text-gray-500 mt-2 block">
            {formatTime(message.timestamp)}
          </span>
        )}
      </div>
    </div>
  );
}

interface FormattedContentProps {
  content: string;
}

function FormattedContent({ content }: FormattedContentProps) {
  // Parse content into blocks (paragraphs, tables, lists)
  const blocks = parseContentBlocks(content);

  return (
    <div className="space-y-2">
      {blocks.map((block, index) => {
        if (block.type === 'chart') {
          return <ChartBlock key={index} chartType={block.chartType} data={block.data} />;
        }

        if (block.type === 'heading') {
          const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements;
          const headingClasses = {
            1: 'text-lg font-bold text-white mt-4 mb-2',
            2: 'text-base font-semibold text-white mt-3 mb-2',
            3: 'text-sm font-semibold text-gray-200 mt-2 mb-1',
          };
          return (
            <HeadingTag key={index} className={headingClasses[block.level as 1 | 2 | 3]}>
              {block.text}
            </HeadingTag>
          );
        }

        if (block.type === 'divider') {
          return <hr key={index} className="border-gray-700 my-4" />;
        }

        if (block.type === 'checkbox') {
          return (
            <div key={index} className="flex items-start gap-2">
              <span className={cn(
                'mt-0.5 w-4 h-4 rounded border flex items-center justify-center text-xs',
                block.checked
                  ? 'bg-green-600 border-green-600 text-white'
                  : 'border-gray-500 text-transparent'
              )}>
                {block.checked ? '✓' : ''}
              </span>
              <span className={cn(
                block.checked ? 'text-gray-400 line-through' : 'text-gray-300'
              )} dangerouslySetInnerHTML={{ __html: formatInlineText(block.text) }} />
            </div>
          );
        }

        if (block.type === 'table') {
          return (
            <div key={index} className="overflow-x-auto my-3">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-600">
                    {block.headers.map((header, hIdx) => (
                      <th
                        key={hIdx}
                        className="px-3 py-2 text-left font-semibold text-gray-300 bg-gray-700/50"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="border-b border-gray-700/50">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-3 py-2 text-gray-300">
                          {formatCellContent(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === 'empty') {
          return <br key={index} />;
        }

        if (block.type === 'bullet') {
          return (
            <p key={index} className="flex items-start gap-2">
              <span className="text-gray-500">•</span>
              <span dangerouslySetInnerHTML={{ __html: formatInlineText(block.text) }} />
            </p>
          );
        }

        if (block.type === 'numbered') {
          return (
            <p key={index} className="flex items-start gap-2">
              <span className="text-gray-500 min-w-[1.5rem]">{block.number}.</span>
              <span dangerouslySetInnerHTML={{ __html: formatInlineText(block.text) }} />
            </p>
          );
        }

        // Regular paragraph
        return (
          <p key={index} dangerouslySetInnerHTML={{ __html: formatInlineText(block.text) }} />
        );
      })}
    </div>
  );
}

// Chart component for visualizing data
interface ChartBlockProps {
  chartType: 'bar' | 'line' | 'pie' | 'bubble';
  data: { label: string; value: number; extra?: number }[];
}

const CHART_COLORS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-purple-500',
  'bg-rose-500',
  'bg-cyan-500',
  'bg-orange-500',
  'bg-indigo-500',
];

function ChartBlock({ chartType, data }: ChartBlockProps) {
  const maxValue = Math.max(...data.map(d => d.value));

  if (chartType === 'bar') {
    return (
      <div className="my-4 p-4 bg-gray-800/50 rounded-lg">
        <div className="space-y-3">
          {data.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">{item.label}</span>
                <span className="text-gray-300 font-medium">{item.value.toLocaleString()}{typeof item.value === 'number' && item.value < 100 ? '%' : ''}</span>
              </div>
              <div className="h-6 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-500', CHART_COLORS[idx % CHART_COLORS.length])}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (chartType === 'line') {
    // Simple line visualization using bars at different heights
    const points = data.map((item, idx) => ({
      x: (idx / (data.length - 1)) * 100,
      y: 100 - (item.value / maxValue) * 80,
      ...item,
    }));

    return (
      <div className="my-4 p-4 bg-gray-800/50 rounded-lg">
        <div className="relative h-32">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="border-t border-gray-700/50" />
            ))}
          </div>
          {/* Line and points */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Line */}
            <polyline
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              points={points.map(p => `${p.x},${p.y}`).join(' ')}
            />
            {/* Points */}
            {points.map((point, idx) => (
              <circle
                key={idx}
                cx={point.x}
                cy={point.y}
                r="3"
                fill="#3B82F6"
                stroke="#1E3A8A"
                strokeWidth="1"
              />
            ))}
          </svg>
        </div>
        {/* Labels */}
        <div className="flex justify-between mt-2">
          {data.map((item, idx) => (
            <span key={idx} className="text-xs text-gray-400">{item.label}</span>
          ))}
        </div>
      </div>
    );
  }

  if (chartType === 'pie') {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    return (
      <div className="my-4 p-4 bg-gray-800/50 rounded-lg">
        <div className="flex items-center gap-6">
          {/* Pie chart */}
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {data.map((item, idx) => {
                const percentage = item.value / total;
                const angle = percentage * 360;
                const startAngle = currentAngle;
                currentAngle += angle;

                const startRad = (startAngle * Math.PI) / 180;
                const endRad = ((startAngle + angle) * Math.PI) / 180;

                const x1 = 50 + 40 * Math.cos(startRad);
                const y1 = 50 + 40 * Math.sin(startRad);
                const x2 = 50 + 40 * Math.cos(endRad);
                const y2 = 50 + 40 * Math.sin(endRad);

                const largeArcFlag = angle > 180 ? 1 : 0;

                const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

                const colorClasses: Record<string, string> = {
                  'bg-blue-500': '#3B82F6',
                  'bg-emerald-500': '#10B981',
                  'bg-amber-500': '#F59E0B',
                  'bg-purple-500': '#8B5CF6',
                  'bg-rose-500': '#F43F5E',
                  'bg-cyan-500': '#06B6D4',
                  'bg-orange-500': '#F97316',
                  'bg-indigo-500': '#6366F1',
                };

                return (
                  <path
                    key={idx}
                    d={pathData}
                    fill={colorClasses[CHART_COLORS[idx % CHART_COLORS.length]]}
                    stroke="#1F2937"
                    strokeWidth="1"
                  />
                );
              })}
            </svg>
          </div>
          {/* Legend */}
          <div className="flex flex-col gap-2">
            {data.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className={cn('w-3 h-3 rounded-sm', CHART_COLORS[idx % CHART_COLORS.length])} />
                <span className="text-xs text-gray-400">{item.label}</span>
                <span className="text-xs text-gray-300 font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default: simple data display
  return (
    <div className="my-4 p-4 bg-gray-800/50 rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        {data.map((item, idx) => (
          <div key={idx} className="text-center p-3 bg-gray-700/30 rounded">
            <div className="text-lg font-semibold text-white">{item.value.toLocaleString()}</div>
            <div className="text-xs text-gray-400">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper to format cell content with special handling for status indicators
function formatCellContent(cell: string): React.ReactNode {
  // Status indicators with arrows
  if (cell.includes('↑')) {
    return <span className="text-green-400">{cell}</span>;
  }
  if (cell.includes('↓')) {
    return <span className="text-red-400">{cell}</span>;
  }
  if (cell.includes('→')) {
    return <span className="text-yellow-400">{cell}</span>;
  }
  // Percentage with + sign (positive)
  if (cell.match(/^\+\d+/)) {
    return <span className="text-green-400">{cell}</span>;
  }
  // Percentage with - sign (negative)
  if (cell.match(/^-\d+/) && !cell.match(/^-{2,}/)) {
    return <span className="text-red-400">{cell}</span>;
  }
  // Ready/Pass status
  if (cell.toLowerCase() === 'ready' || cell.toLowerCase() === 'pass' || cell.toLowerCase() === 'strong') {
    return <span className="text-green-400">{cell}</span>;
  }
  // Needs work/Fail status
  if (cell.toLowerCase().includes('needs') || cell.toLowerCase() === 'fail') {
    return <span className="text-amber-400">{cell}</span>;
  }
  // On track status
  if (cell.toLowerCase().includes('on track')) {
    return <span className="text-blue-400">{cell}</span>;
  }
  // Critical/High priority
  if (cell.toLowerCase() === 'critical' || cell.toLowerCase() === 'high') {
    return <span className="text-red-400 font-medium">{cell}</span>;
  }
  // Medium priority
  if (cell.toLowerCase() === 'medium') {
    return <span className="text-amber-400">{cell}</span>;
  }
  // Low priority
  if (cell.toLowerCase() === 'low') {
    return <span className="text-green-400">{cell}</span>;
  }
  return cell;
}

type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'empty' }
  | { type: 'bullet'; text: string }
  | { type: 'numbered'; number: string; text: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'chart'; chartType: 'bar' | 'line' | 'pie' | 'bubble'; data: { label: string; value: number; extra?: number }[] }
  | { type: 'heading'; level: number; text: string }
  | { type: 'divider' }
  | { type: 'checkbox'; checked: boolean; text: string };

function parseContentBlocks(content: string): ContentBlock[] {
  const lines = content.split('\n');
  const blocks: ContentBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Check for chart placeholder [CHART:type:data]
    const chartMatch = line.match(/\[CHART:(bar|line|pie|bubble):(.+)\]/);
    if (chartMatch) {
      const chartType = chartMatch[1] as 'bar' | 'line' | 'pie' | 'bubble';
      const dataStr = chartMatch[2];
      const data = dataStr.split(',').map(item => {
        // Format: label:value or label:value:extra (for bubble)
        const parts = item.trim().split(':');
        return {
          label: parts[0],
          value: parseFloat(parts[1]) || 0,
          extra: parts[2] ? parseFloat(parts[2]) : undefined,
        };
      });
      blocks.push({ type: 'chart', chartType, data });
      i++;
      continue;
    }

    // Check for heading (# or ##)
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({ type: 'heading', level: headingMatch[1].length, text: headingMatch[2] });
      i++;
      continue;
    }

    // Check for divider (---)
    if (line.match(/^-{3,}$/)) {
      blocks.push({ type: 'divider' });
      i++;
      continue;
    }

    // Check for checkbox (- [ ] or - [x])
    const checkboxMatch = line.match(/^-\s+\[([ x])\]\s+(.+)$/);
    if (checkboxMatch) {
      blocks.push({ type: 'checkbox', checked: checkboxMatch[1] === 'x', text: checkboxMatch[2] });
      i++;
      continue;
    }

    // Check for table start (line with | characters)
    if (line.includes('|') && line.trim().startsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].includes('|')) {
        tableLines.push(lines[i]);
        i++;
      }

      // Parse table
      if (tableLines.length >= 2) {
        const parseRow = (row: string) =>
          row
            .split('|')
            .map((cell) => cell.trim())
            .filter((cell) => cell && !cell.match(/^[-:]+$/));

        const headers = parseRow(tableLines[0]);
        // Skip separator row (the |---|---|---| row)
        const dataRows = tableLines
          .slice(2)
          .map(parseRow)
          .filter((row) => row.length > 0);

        blocks.push({ type: 'table', headers, rows: dataRows });
      }
      continue;
    }

    // Empty line
    if (!line.trim()) {
      blocks.push({ type: 'empty' });
      i++;
      continue;
    }

    // Bullet points
    if (line.match(/^[-*]\s/) && !line.match(/^-\s+\[/)) {
      blocks.push({ type: 'bullet', text: line.slice(2) });
      i++;
      continue;
    }

    // Numbered list
    if (line.match(/^\d+\.\s/)) {
      const match = line.match(/^(\d+)\.\s(.*)$/);
      if (match) {
        blocks.push({ type: 'numbered', number: match[1], text: match[2] });
      }
      i++;
      continue;
    }

    // Regular paragraph
    blocks.push({ type: 'paragraph', text: line });
    i++;
  }

  return blocks;
}

function formatInlineText(text: string): string {
  // Bold text: **text**
  return text.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Quick action icon component
function QuickActionIcon({ icon }: { icon?: string }) {
  const iconClass = "w-3.5 h-3.5";

  switch (icon) {
    case 'download':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      );
    case 'share':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      );
    case 'bookmark':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      );
    case 'copy':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      );
    case 'print':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 6 2 18 2 18 9" />
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <rect x="6" y="14" width="12" height="8" />
        </svg>
      );
    case 'calendar':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    case 'email':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      );
    case 'chart':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      );
    default:
      return null;
  }
}
