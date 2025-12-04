import { useState, useCallback } from 'react';
import { cn } from '@axira/shared/utils';
import type { PulsePriority, PulseItem, PulseAction, Meeting } from './types';
import { MOCK_PULSE_ITEMS, MOCK_DAILY_BRIEF, getPulseSummary } from './data/mockPulse';

// Components
import { GuardianHeader } from './components/GuardianHeader';
import { PulseSummaryBar } from './components/PulseSummaryBar';
import { PulseSection } from './components/PulseSection';
import { DailyBrief } from './components/DailyBrief';
import { QuickAsk } from './components/QuickAsk';

interface GuardianPageProps {
  userName?: string;
}

export function GuardianPage({ userName = 'Maya' }: GuardianPageProps) {
  const [activeFilter, setActiveFilter] = useState<PulsePriority | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Record<PulsePriority, boolean>>({
    URGENT: false,
    WATCH: false,
    OPPORTUNITY: false,
  });

  // Get pulse items grouped by priority
  const pulseItems = MOCK_PULSE_ITEMS;
  const summary = getPulseSummary();

  const urgentItems = pulseItems.filter(item => item.priority === 'URGENT');
  const watchItems = pulseItems.filter(item => item.priority === 'WATCH');
  const opportunityItems = pulseItems.filter(item => item.priority === 'OPPORTUNITY');

  // Filter handler
  const handleFilterClick = useCallback((priority: PulsePriority | null) => {
    setActiveFilter(priority);
  }, []);

  // Section collapse handler
  const handleToggleSection = useCallback((priority: PulsePriority) => {
    setCollapsedSections(prev => ({
      ...prev,
      [priority]: !prev[priority],
    }));
  }, []);

  // Action handler
  const handleAction = useCallback((action: PulseAction, item: PulseItem) => {
    console.log('Action triggered:', action.actionType, 'for item:', item.id);
    // TODO: Implement action handlers
    // - VIEW_DETAILS: Navigate to detail view or open modal
    // - CALL: Initiate phone call or show number
    // - EMAIL: Open email compose
    // - SCHEDULE: Open calendar integration
    // - CREATE_CASE: Create QA case
    // - PREPARE: Generate preparation materials
  }, []);

  // Subject click handler
  const handleSubjectClick = useCallback((subjectKey: string) => {
    console.log('Navigate to subject:', subjectKey);
    // TODO: Navigate to subject detail page
  }, []);

  // Meeting click handler
  const handleMeetingClick = useCallback((meeting: Meeting) => {
    console.log('Meeting clicked:', meeting.id);
    // TODO: Open meeting prep or calendar
  }, []);

  // Quick ask handler
  const handleQuickAsk = useCallback((message: string) => {
    console.log('Quick ask:', message);
    // TODO: Navigate to chat with message or handle inline
  }, []);

  // Expand chat handler
  const handleExpandChat = useCallback(() => {
    console.log('Expand to full chat');
    // TODO: Navigate to full chat view
  }, []);

  // Determine which sections to show based on filter
  const showUrgent = !activeFilter || activeFilter === 'URGENT';
  const showWatch = !activeFilter || activeFilter === 'WATCH';
  const showOpportunity = !activeFilter || activeFilter === 'OPPORTUNITY';

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <GuardianHeader userName={userName} className="mb-6" />

        {/* Summary Bar */}
        <PulseSummaryBar
          summary={summary}
          activeFilter={activeFilter}
          onFilterClick={handleFilterClick}
          className="mb-6"
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Pulse Items (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Urgent Section */}
            {showUrgent && urgentItems.length > 0 && (
              <PulseSection
                priority="URGENT"
                items={urgentItems}
                onAction={handleAction}
                onSubjectClick={handleSubjectClick}
                collapsed={collapsedSections.URGENT}
                onToggleCollapse={() => handleToggleSection('URGENT')}
              />
            )}

            {/* Watch Section */}
            {showWatch && watchItems.length > 0 && (
              <PulseSection
                priority="WATCH"
                items={watchItems}
                onAction={handleAction}
                onSubjectClick={handleSubjectClick}
                collapsed={collapsedSections.WATCH}
                onToggleCollapse={() => handleToggleSection('WATCH')}
                maxItems={activeFilter ? undefined : 3}
              />
            )}

            {/* Opportunity Section */}
            {showOpportunity && opportunityItems.length > 0 && (
              <PulseSection
                priority="OPPORTUNITY"
                items={opportunityItems}
                onAction={handleAction}
                onSubjectClick={handleSubjectClick}
                collapsed={collapsedSections.OPPORTUNITY}
                onToggleCollapse={() => handleToggleSection('OPPORTUNITY')}
                maxItems={activeFilter ? undefined : 3}
              />
            )}

            {/* Empty state */}
            {!urgentItems.length && !watchItems.length && !opportunityItems.length && (
              <EmptyState />
            )}
          </div>

          {/* Right Column - Daily Brief & QuickAsk (1/3 width) */}
          <div className="space-y-6">
            {/* Daily Brief */}
            <DailyBrief
              brief={MOCK_DAILY_BRIEF}
              onMeetingClick={handleMeetingClick}
            />

            {/* Quick Ask */}
            <QuickAsk
              onSend={handleQuickAsk}
              onExpand={handleExpandChat}
              placeholder="Ask about anything..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-400 mb-4">
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-white mb-2">All Clear</h3>
      <p className="text-gray-400 text-center max-w-sm">
        No items need your attention right now. Your Guardian is always watching.
      </p>
    </div>
  );
}

export default GuardianPage;
