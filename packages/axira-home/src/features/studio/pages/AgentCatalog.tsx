import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@axira/shared/utils';
import { STUDIO_AGENTS } from '../data/agents';
import type { AgentSummary } from '../types';

type FilterStatus = 'all' | 'published' | 'draft' | 'deprecated';
type FilterHealth = 'all' | 'healthy' | 'degraded' | 'unhealthy' | 'offline';
type SortBy = 'name' | 'invocations' | 'feedback' | 'updated';
type ViewTab = 'business' | 'process';

export function AgentCatalog() {
  const [activeTab, setActiveTab] = useState<ViewTab>('business');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [healthFilter, setHealthFilter] = useState<FilterHealth>('all');
  const [sortBy, setSortBy] = useState<SortBy>('updated');
  const [searchQuery, setSearchQuery] = useState('');

  const businessAgents = STUDIO_AGENTS.filter((a) => a.type === 'business');
  const processAgents = STUDIO_AGENTS.filter((a) => a.type === 'process');

  const agentsToShow = activeTab === 'business' ? businessAgents : processAgents;

  const filteredAgents = agentsToShow
    .filter((agent) => {
      if (statusFilter !== 'all' && agent.status !== statusFilter) return false;
      if (healthFilter !== 'all' && agent.health.status !== healthFilter) return false;
      if (searchQuery && !agent.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'invocations':
          return b.metrics.totalInvocations - a.metrics.totalInvocations;
        case 'feedback':
          return b.metrics.feedbackScore - a.metrics.feedbackScore;
        case 'updated':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

  return (
    <div className="h-full overflow-y-auto bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900 px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-2">Agents</h1>
            <p className="text-gray-400">Manage your Business Agents and Process Agents</p>
          </div>
          <Link
            to="/studio/agent-builder"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white transition-colors flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Build New Agent
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab('business')}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-colors',
              activeTab === 'business'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            )}
          >
            <div className="flex items-center gap-2">
              <BusinessAgentIcon className="w-4 h-4" />
              Business Agents
              <span className={cn(
                'px-1.5 py-0.5 rounded text-xs',
                activeTab === 'business' ? 'bg-blue-500/30' : 'bg-gray-700'
              )}>
                {businessAgents.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('process')}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-colors',
              activeTab === 'process'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            )}
          >
            <div className="flex items-center gap-2">
              <ProcessAgentIcon className="w-4 h-4" />
              Process Agents
              <span className={cn(
                'px-1.5 py-0.5 rounded text-xs',
                activeTab === 'process' ? 'bg-purple-500/30' : 'bg-gray-700'
              )}>
                {processAgents.length}
              </span>
            </div>
          </button>
        </div>
      </div>

      <div className="p-8">
        {/* Explanation Card */}
        <div className={cn(
          'mb-6 p-4 rounded-xl border',
          activeTab === 'business'
            ? 'bg-blue-950/30 border-blue-800/50'
            : 'bg-purple-950/30 border-purple-800/50'
        )}>
          <div className="flex items-start gap-3">
            <div className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
              activeTab === 'business' ? 'bg-blue-600' : 'bg-purple-600'
            )}>
              <InfoIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              {activeTab === 'business' ? (
                <>
                  <h3 className="font-medium text-white mb-1">Business Agents</h3>
                  <p className="text-sm text-gray-400">
                    High-level personas that users interact with (e.g., "Branch Banker Assistant").
                    Each Business Agent coordinates one or more Process Agents to fulfill requests.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="font-medium text-white mb-1">Process Agents</h3>
                  <p className="text-sm text-gray-400">
                    Task-specific agents that execute workflows (e.g., "Document Presence Check").
                    Each Process Agent has a workflow of skills and logic that accomplishes a specific task.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex items-center gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab} agents...`}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="deprecated">Deprecated</option>
          </select>

          {/* Health Filter */}
          <select
            value={healthFilter}
            onChange={(e) => setHealthFilter(e.target.value as FilterHealth)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Health</option>
            <option value="healthy">Healthy</option>
            <option value="degraded">Degraded</option>
            <option value="unhealthy">Unhealthy</option>
            <option value="offline">Offline</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="updated">Last Updated</option>
            <option value="name">Name</option>
            <option value="invocations">Most Used</option>
            <option value="feedback">Highest Rated</option>
          </select>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-400 mb-4">
          {filteredAgents.length} {activeTab} agent{filteredAgents.length !== 1 ? 's' : ''} found
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 gap-4">
          {filteredAgents.map((agent) => (
            <AgentRow key={agent.id} agent={agent} />
          ))}
        </div>

        {filteredAgents.length === 0 && (
          <div className="text-center py-12">
            <AgentIcon className="w-12 h-12 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 mb-4">No {activeTab} agents match your filters</p>
            <Link
              to="/studio/agent-builder"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              Build Your First Agent
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function AgentRow({ agent }: { agent: AgentSummary }) {
  const healthColors = {
    healthy: 'bg-green-500',
    degraded: 'bg-yellow-500',
    unhealthy: 'bg-red-500',
    offline: 'bg-gray-500',
  };

  const statusColors = {
    published: 'bg-green-600/20 text-green-400',
    draft: 'bg-gray-600/50 text-gray-400',
    deprecated: 'bg-red-600/20 text-red-400',
  };

  const typeConfig = {
    business: {
      color: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
      icon: <BusinessAgentIcon className="w-3 h-3" />,
      label: 'Business Agent',
    },
    process: {
      color: 'bg-purple-600/20 text-purple-400 border-purple-600/30',
      icon: <ProcessAgentIcon className="w-3 h-3" />,
      label: 'Process Agent',
    },
  };

  const config = typeConfig[agent.type];

  return (
    <Link
      to={`/studio/agents/${agent.id}`}
      className="bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 p-6 transition-colors"
    >
      <div className="flex items-start gap-6">
        {/* Left: Agent Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className={cn('w-2.5 h-2.5 rounded-full', healthColors[agent.health.status])} />
            <h3 className="text-lg font-medium text-white">{agent.name}</h3>
            <span className={cn('text-xs px-2 py-0.5 rounded', statusColors[agent.status])}>
              {agent.status}
            </span>
            <span className={cn('text-xs px-2 py-0.5 rounded border flex items-center gap-1', config.color)}>
              {config.icon}
              {config.label}
            </span>
          </div>
          <p className="text-sm text-gray-400 mb-3">{agent.description}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {agent.processAgentCount !== undefined && (
              <span className="flex items-center gap-1">
                <ProcessAgentIcon className="w-3 h-3" />
                {agent.processAgentCount} process agents
              </span>
            )}
            <span className="flex items-center gap-1">
              <SkillIcon className="w-3 h-3" />
              {agent.skillCount} skills
            </span>
            <span className="flex items-center gap-1">
              <ConnectorIcon className="w-3 h-3" />
              {agent.connectorCount} connectors
            </span>
            <span>v{agent.versions[0]?.version || '0.0.0'}</span>
          </div>
        </div>

        {/* Right: Metrics */}
        <div className="flex items-center gap-8">
          <MetricCell
            label="Invocations"
            value={formatNumber(agent.metrics.totalInvocations)}
            subValue="30d"
          />
          <MetricCell
            label="Success Rate"
            value={`${agent.metrics.successRate}%`}
            status={agent.metrics.successRate >= 98 ? 'good' : agent.metrics.successRate >= 95 ? 'warn' : 'bad'}
          />
          <MetricCell
            label="Avg Latency"
            value={`${(agent.metrics.avgLatency / 1000).toFixed(1)}s`}
            status={agent.metrics.avgLatency <= 2000 ? 'good' : agent.metrics.avgLatency <= 4000 ? 'warn' : 'bad'}
          />
          <MetricCell
            label="Feedback"
            value={agent.metrics.feedbackScore ? agent.metrics.feedbackScore.toFixed(1) : '-'}
            subValue={agent.metrics.feedbackCount > 0 ? `${agent.metrics.feedbackCount} reviews` : ''}
            status={agent.metrics.feedbackScore >= 4.5 ? 'good' : agent.metrics.feedbackScore >= 4.0 ? 'warn' : undefined}
          />
          <ChevronRightIcon className="w-5 h-5 text-gray-500" />
        </div>
      </div>

      {/* Health Issues */}
      {agent.health.issues.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="flex items-center gap-2 text-sm">
            <AlertIcon className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400">{agent.health.issues.length} issue{agent.health.issues.length > 1 ? 's' : ''}</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400">{agent.health.issues[0]}</span>
          </div>
        </div>
      )}
    </Link>
  );
}

function MetricCell({ label, value, subValue, status }: {
  label: string;
  value: string;
  subValue?: string;
  status?: 'good' | 'warn' | 'bad';
}) {
  const valueColors = {
    good: 'text-green-400',
    warn: 'text-yellow-400',
    bad: 'text-red-400',
  };

  return (
    <div className="text-center min-w-[80px]">
      <div className={cn(
        'text-lg font-semibold',
        status ? valueColors[status] : 'text-white'
      )}>
        {value}
      </div>
      <div className="text-xs text-gray-500">{label}</div>
      {subValue && <div className="text-xs text-gray-600">{subValue}</div>}
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

// Icons
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function AgentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  );
}

function BusinessAgentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21a8 8 0 0 0-16 0" />
      <path d="M12 14l-2 2h4l-2-2z" />
    </svg>
  );
}

function ProcessAgentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 9h6M9 12h6M9 15h4" />
    </svg>
  );
}

function SkillIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function ConnectorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}
