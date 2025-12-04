import { useState } from 'react';
import { cn } from '@axira/shared/utils';
import type { Case, CaseFilters, CaseStats } from './types';

// Mock data for demo
const MOCK_CASES: Case[] = [
  {
    id: '1',
    caseNumber: '10482',
    title: 'Address Change QA Review',
    slaStatus: 'due-today',
    owner: { id: 'ash', name: 'Ash M.', initials: 'A' },
    updatedAt: '2h ago',
    status: 'Open',
    customer: 'Customer',
    accountNumber: '4728-11',
  },
  {
    id: '2',
    caseNumber: '10481',
    title: 'Direct Deposit QA Review',
    slaStatus: 'overdue',
    owner: { id: 'apatel', name: 'A. Patel', initials: 'A' },
    updatedAt: '10h ago',
    status: 'Open',
  },
  {
    id: '3',
    caseNumber: '10480',
    title: 'Foreign Address QA Review',
    slaStatus: 'due-next',
    owner: { id: 'ash', name: 'Ash M.', initials: 'A' },
    updatedAt: '10h ago',
    status: 'Open',
  },
  {
    id: '4',
    caseNumber: '10479',
    title: 'Tax Form Upload QA Review',
    slaStatus: 'open',
    owner: { id: 'anmd', name: 'Anmd R.', initials: 'A' },
    updatedAt: '10h ago',
    status: 'Open',
  },
  {
    id: '5',
    caseNumber: '10478',
    title: 'Change of Address Form',
    slaStatus: 'open',
    owner: { id: 'rtext', name: 'R. Text', initials: 'R' },
    updatedAt: '1 day ago',
    status: 'Open',
  },
  {
    id: '6',
    caseNumber: '10477',
    title: 'Beneficiary Document Review',
    slaStatus: 'open',
    owner: { id: 'rtext', name: 'R. Text', initials: 'R' },
    updatedAt: '1 day ago',
    status: 'Open',
  },
];

const MOCK_STATS: CaseStats = {
  open: 7,
  closed: 21,
  overdue: 3,
};

const OWNERS = [
  { id: 'ash', name: 'Ash M.', initials: 'A', color: 'bg-blue-500' },
  { id: 'apatel', name: 'A. Patel', initials: 'A', color: 'bg-yellow-500' },
];

export function WorkPage() {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>('1');
  const [filters, setFilters] = useState<CaseFilters>({
    status: ['Open'],
    sla: [],
    owner: [],
    sensitivity: [],
  });

  const selectedCase = MOCK_CASES.find((c) => c.id === selectedCaseId);

  const toggleFilter = (category: keyof CaseFilters, value: string) => {
    setFilters((prev) => {
      const current = prev[category];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  return (
    <div className="flex h-[calc(100vh-56px)]">
      {/* Left Sidebar - Filters */}
      <aside className="w-56 border-r border-gray-800 bg-gray-900 p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold text-white mb-4">My Cases</h2>

        {/* Status Filters */}
        <div className="space-y-1 mb-6">
          <FilterButton
            active={filters.status.includes('Open')}
            onClick={() => toggleFilter('status', 'Open')}
          >
            Open
          </FilterButton>
          <FilterButton
            active={filters.status.includes('Waiting on Customer')}
            onClick={() => toggleFilter('status', 'Waiting on Customer')}
          >
            Waiting on Customer
          </FilterButton>
          <FilterButton
            active={filters.status.includes('Ready for Approval')}
            onClick={() => toggleFilter('status', 'Ready for Approval')}
          >
            Ready for Approval
          </FilterButton>
          <FilterButton
            active={filters.status.includes('Closed')}
            onClick={() => toggleFilter('status', 'Closed')}
          >
            Closed
          </FilterButton>
        </div>

        {/* SLA Filters */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">SLA</h3>
          <div className="space-y-1">
            <FilterButton
              active={filters.sla.includes('due-today')}
              onClick={() => toggleFilter('sla', 'due-today')}
            >
              Due today
            </FilterButton>
            <FilterButton
              active={filters.sla.includes('due-this-week')}
              onClick={() => toggleFilter('sla', 'due-this-week')}
            >
              Due this week
            </FilterButton>
            <FilterButton
              active={filters.sla.includes('overdue')}
              onClick={() => toggleFilter('sla', 'overdue')}
            >
              Overdue
            </FilterButton>
          </div>
        </div>

        {/* Owner Filters */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Owner</h3>
          <div className="space-y-1">
            {OWNERS.map((owner) => (
              <FilterButton
                key={owner.id}
                active={filters.owner.includes(owner.id)}
                onClick={() => toggleFilter('owner', owner.id)}
              >
                <span
                  className={cn(
                    'w-6 h-6 rounded text-white text-xs flex items-center justify-center mr-2',
                    owner.color
                  )}
                >
                  {owner.initials}
                </span>
                {owner.name}
              </FilterButton>
            ))}
          </div>
        </div>

        {/* Sensitivity Filters */}
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Sensitivity</h3>
          <div className="space-y-1">
            <FilterButton
              active={filters.sensitivity.includes('Verified')}
              onClick={() => toggleFilter('sensitivity', 'Verified')}
            >
              Verified
            </FilterButton>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-gray-950">
        {/* Stats Cards */}
        <div className="flex gap-4 p-6 pb-4">
          <StatCard value={MOCK_STATS.open} label="Open" color="bg-emerald-600" />
          <StatCard value={MOCK_STATS.closed} label="Closed" color="bg-teal-600" />
          <StatCard value={MOCK_STATS.overdue} label="Overdue" color="bg-orange-600" />
        </div>

        {/* Case Table */}
        <div className="flex-1 px-6 pb-6 overflow-hidden flex flex-col">
          <div className="bg-gray-900 rounded-lg border border-gray-800 flex-1 overflow-hidden flex flex-col">
            {/* Table Header */}
            <div className="border-b border-gray-800 px-4 py-3">
              <h3 className="font-semibold text-white">Status</h3>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-800 sticky top-0">
                  <tr className="text-left text-sm text-gray-400">
                    <th className="px-4 py-3 font-medium">Case</th>
                    <th className="px-4 py-3 font-medium">SLA</th>
                    <th className="px-4 py-3 font-medium">Owner</th>
                    <th className="px-4 py-3 font-medium">Updated</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Actx</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_CASES.map((caseItem) => (
                    <tr
                      key={caseItem.id}
                      onClick={() => setSelectedCaseId(caseItem.id)}
                      className={cn(
                        'border-b border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors',
                        selectedCaseId === caseItem.id && 'bg-blue-900/30'
                      )}
                    >
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-200">{caseItem.title}</span>
                      </td>
                      <td className="px-4 py-3">
                        <SLABadge status={caseItem.slaStatus} />
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-blue-400">{caseItem.owner.name}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-400">{caseItem.updatedAt}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-400">{caseItem.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-sm text-blue-400 hover:text-blue-300">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Immediate Attention */}
            <div className="border-t border-gray-800 p-4">
              <h4 className="font-semibold text-white mb-2">Immediate Attention</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full" />
                  <span className="text-sm text-gray-300">Direct Deposit QA Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-blue-500 rounded-full" />
                  </div>
                  <span className="text-sm text-gray-500">1 day</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar - Selected Case */}
      <aside className="w-72 border-l border-gray-800 bg-gray-900 p-4 overflow-y-auto">
        {selectedCase ? (
          <>
            <h3 className="text-lg font-semibold text-white mb-4">Selected Case</h3>

            <div className="mb-4">
              <p className="text-sm text-gray-500">Case #{selectedCase.caseNumber}</p>
              <p className="font-semibold text-white mt-1">{selectedCase.title}</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Customer</span>
                <span className="text-sm text-gray-200">
                  {selectedCase.customer || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Account</span>
                <span className="text-sm text-gray-200">
                  {selectedCase.accountNumber || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <span className="text-sm text-gray-200">Ready for Approval</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mb-4">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Approve
              </button>
              <button className="flex-1 px-4 py-2 border border-gray-700 text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                Request Rework
              </button>
            </div>

            <button className="w-full px-4 py-2 border border-gray-700 text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors mb-6">
              Open Timeline
            </button>

            {/* Immediate Attention */}
            <div className="mb-6">
              <h4 className="font-semibold text-white mb-2">Immediate Attention</h4>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full" />
                <span className="text-sm text-gray-300">Direct Deposit QA Review</span>
              </div>
            </div>

            {/* Activity */}
            <div>
              <h4 className="font-semibold text-white mb-2">Activity</h4>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 bg-white rounded-full mt-1.5" />
                <span className="text-sm text-gray-300">
                  Quality Review Agent runs address verification
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            Select a case to view details
          </div>
        )}
      </aside>
    </div>
  );
}

function FilterButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors text-left',
        active
          ? 'bg-blue-900/50 text-blue-400 font-medium'
          : 'text-gray-300 hover:bg-gray-800'
      )}
    >
      {children}
    </button>
  );
}

function StatCard({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div className={cn('rounded-lg px-6 py-4 min-w-[140px]', color)}>
      <p className="text-4xl font-bold text-white">{value}</p>
      <p className="text-white text-sm mt-1">{label}</p>
    </div>
  );
}

function SLABadge({ status }: { status: Case['slaStatus'] }) {
  const config = {
    open: { label: 'Open', className: 'bg-gray-700 text-gray-300' },
    'due-today': { label: 'Due today', className: 'bg-yellow-900/50 text-yellow-400' },
    'due-next': { label: 'Due next', className: 'bg-yellow-900/30 text-yellow-500' },
    overdue: { label: 'Overdue', className: 'bg-red-900/50 text-red-400' },
  };

  const { label, className } = config[status];

  return (
    <span className={cn('px-2 py-1 text-xs font-medium rounded', className)}>
      {label}
    </span>
  );
}
