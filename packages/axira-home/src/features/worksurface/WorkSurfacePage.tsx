import { useState, useCallback } from 'react';
import { cn } from '@axira/shared/utils';
import type { WorkItem, QuickAction, ProactiveNudge as ProactiveNudgeType } from './types';

// Components
import { AxiraGreeting } from './components/AxiraGreeting';
import { CommandInput } from './components/CommandInput';
import { WorkCardList } from './components/WorkCard';
import { ProactiveNudge } from './components/ProactiveNudge';

// Mock data
import {
  MOCK_USER_CONTEXT,
  MOCK_WORK_ITEMS,
  MOCK_PROACTIVE_NUDGE,
  MOCK_QUICK_ACTIONS,
  getContextualGreeting,
} from './data/mockWorkSurface';

/**
 * WorkSurfacePage - The calm, intelligent work surface.
 *
 * Design principles:
 * - Conversational first - primary interface is natural language
 * - Cards as work items - not alerts, but prepared work
 * - Single proactive nudge - one thing at a time
 * - Minimal visual noise - breathing room, white space
 * - Presence, not dashboard - Axira is here to help
 */
export function WorkSurfacePage() {
  const [nudge, setNudge] = useState<ProactiveNudgeType | null>(MOCK_PROACTIVE_NUDGE);
  const [isProcessing, setIsProcessing] = useState(false);

  // Get contextual greeting
  const greeting = getContextualGreeting(MOCK_USER_CONTEXT);

  // Handler for command input
  const handleCommand = useCallback((message: string) => {
    console.log('Command:', message);
    setIsProcessing(true);
    // TODO: Send to orchestrator, open chat with context
    setTimeout(() => setIsProcessing(false), 1000);
  }, []);

  // Handler for quick actions
  const handleQuickAction = useCallback((action: QuickAction) => {
    console.log('Quick action:', action);
    if (action.actionType === 'ASK_AGENT') {
      handleCommand(action.target);
    }
    // TODO: Handle other action types
  }, [handleCommand]);

  // Handler for work item click
  const handleWorkItemClick = useCallback((item: WorkItem) => {
    console.log('Work item clicked:', item);
    // TODO: Navigate to work context or open in slide-over
  }, []);

  // Handler for nudge accept
  const handleNudgeAccept = useCallback(() => {
    console.log('Nudge accepted:', nudge);
    setNudge(null);
    // TODO: Execute the suggested action
  }, [nudge]);

  // Handler for nudge dismiss
  const handleNudgeDismiss = useCallback(() => {
    console.log('Nudge dismissed');
    setNudge(null);
  }, []);

  // Get recent subjects for footer
  const recentNames = MOCK_USER_CONTEXT.recentSubjects.slice(0, 3).map(s => s.name);

  return (
    <div className="min-h-full bg-gray-950 flex flex-col">
      {/* Main content - centered, breathing room */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-3xl space-y-10">

          {/* Greeting - conversational, aware */}
          <AxiraGreeting greeting={greeting} className="text-center" />

          {/* Command input - primary interaction */}
          <CommandInput
            onSubmit={handleCommand}
            quickActions={MOCK_QUICK_ACTIONS}
            onQuickAction={handleQuickAction}
            isProcessing={isProcessing}
            className="mx-auto"
          />

          {/* Work queue - prepared work items */}
          {MOCK_WORK_ITEMS.length > 0 && (
            <WorkCardList
              items={MOCK_WORK_ITEMS}
              onItemClick={handleWorkItemClick}
              title="Your Work Queue"
              className="pt-6"
            />
          )}

          {/* Proactive nudge - single suggestion */}
          {nudge && (
            <div className="pt-4">
              <ProactiveNudge
                nudge={nudge}
                onAccept={handleNudgeAccept}
                onDismiss={handleNudgeDismiss}
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer - recent context */}
      {recentNames.length > 0 && (
        <footer className="px-6 py-4 border-t border-gray-900">
          <div className="max-w-3xl mx-auto flex items-center gap-2 text-sm text-gray-600">
            <span>Recent:</span>
            {recentNames.map((name, i) => (
              <span key={name}>
                <button className="text-gray-500 hover:text-gray-400 transition-colors">
                  {name}
                </button>
                {i < recentNames.length - 1 && <span className="mx-1">•</span>}
              </span>
            ))}
          </div>
        </footer>
      )}
    </div>
  );
}

export default WorkSurfacePage;
