import { Link } from 'react-router-dom';
import { cn } from '@axira/shared/utils';
import { STUDIO_AGENTS, STUDIO_STATS } from '../data/agents';
import { STUDIO_CONNECTORS } from '../data/connectors';
import type { AgentSummary, ConnectorConfig } from '../types';

export function StudioOverview() {
  const recentAgents = STUDIO_AGENTS.slice(0, 4);
  const activeConnectors = STUDIO_CONNECTORS.filter((c) => c.status === 'active');
  const issueConnectors = STUDIO_CONNECTORS.filter((c) => c.status === 'error' || c.health.status !== 'healthy');

  return (
    <div className="h-full overflow-y-auto bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900 px-8 py-6">
        <h1 className="text-2xl font-semibold text-white mb-2">Studio Overview</h1>
        <p className="text-gray-400">Manage your agents, connectors, and workflows</p>
      </div>

      <div className="p-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            label="Total Agents"
            value={STUDIO_STATS.totalAgents}
            subValue={`${STUDIO_STATS.publishedAgents} published`}
            icon={<AgentIcon />}
            color="blue"
          />
          <StatCard
            label="Total Invocations"
            value={formatNumber(STUDIO_STATS.totalInvocations)}
            subValue="Last 30 days"
            icon={<InvocationIcon />}
            color="green"
          />
          <StatCard
            label="Avg Success Rate"
            value={`${STUDIO_STATS.avgSuccessRate}%`}
            subValue="Across all agents"
            icon={<SuccessIcon />}
            color="emerald"
          />
          <StatCard
            label="Avg Feedback Score"
            value={STUDIO_STATS.avgFeedbackScore.toFixed(1)}
            subValue="Out of 5.0"
            icon={<StarIcon />}
            color="amber"
          />
        </div>

        {/* Health Overview */}
        <div className="grid grid-cols-2 gap-6">
          {/* Agent Health */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Agent Health</h2>
              <Link to="/studio/agents" className="text-sm text-blue-400 hover:text-blue-300">
                View all
              </Link>
            </div>

            <div className="flex items-center gap-6 mb-6">
              <HealthIndicator count={STUDIO_STATS.healthyAgents} status="healthy" label="Healthy" />
              <HealthIndicator count={STUDIO_STATS.degradedAgents} status="degraded" label="Degraded" />
              <HealthIndicator count={STUDIO_STATS.unhealthyAgents} status="unhealthy" label="Unhealthy" />
              <HealthIndicator count={STUDIO_STATS.offlineAgents} status="offline" label="Offline" />
            </div>

            {/* Agent Issues */}
            <div className="space-y-2">
              {STUDIO_AGENTS.filter((a) => a.health.issues.length > 0).map((agent) => (
                <div key={agent.id} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                  <span className={cn(
                    'w-2 h-2 rounded-full mt-1.5',
                    agent.health.status === 'unhealthy' ? 'bg-red-500' : 'bg-yellow-500'
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white">{agent.name}</div>
                    <div className="text-xs text-gray-400 truncate">{agent.health.issues[0]}</div>
                  </div>
                  <Link
                    to={`/studio/agents/${agent.id}`}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    Fix
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Connector Health */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Connector Status</h2>
              <Link to="/studio/connectors" className="text-sm text-blue-400 hover:text-blue-300">
                View all
              </Link>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 bg-gray-800 rounded-lg p-3">
                <div className="text-2xl font-semibold text-white">{activeConnectors.length}</div>
                <div className="text-xs text-gray-400">Active</div>
              </div>
              <div className="flex-1 bg-gray-800 rounded-lg p-3">
                <div className="text-2xl font-semibold text-white">{STUDIO_CONNECTORS.filter(c => c.status === 'pending').length}</div>
                <div className="text-xs text-gray-400">Pending Setup</div>
              </div>
              <div className="flex-1 bg-gray-800 rounded-lg p-3">
                <div className="text-2xl font-semibold text-red-400">{issueConnectors.length}</div>
                <div className="text-xs text-gray-400">Issues</div>
              </div>
            </div>

            {/* Connector Issues */}
            <div className="space-y-2">
              {issueConnectors.slice(0, 3).map((connector) => (
                <div key={connector.id} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                  <span className={cn(
                    'w-2 h-2 rounded-full',
                    connector.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white">{connector.name}</div>
                    <div className="text-xs text-gray-400">
                      {connector.status === 'error' ? 'Connection error' : `Latency: ${connector.health.latency}ms`}
                    </div>
                  </div>
                  <Link
                    to={`/studio/connectors/${connector.id}`}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    Configure
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Agents */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Agents</h2>
            <Link
              to="/studio/workflows"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white transition-colors"
            >
              + New Agent
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {recentAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4">
          <QuickAction
            title="Build Agent"
            description="Create a new agent with conversational builder"
            icon={<BuildIcon />}
            to="/studio/workflows"
          />
          <QuickAction
            title="Configure Connector"
            description="Add or update connector settings"
            icon={<ConnectorIcon />}
            to="/studio/connectors"
          />
          <QuickAction
            title="Test Workflow"
            description="Run tests on your agents"
            icon={<TestIcon />}
            to="/studio/testing"
          />
          <QuickAction
            title="Manage Users"
            description="Add team members and set permissions"
            icon={<UsersIcon />}
            to="/studio/users"
          />
        </div>
      </div>
    </div>
  );
}

// Components
function StatCard({ label, value, subValue, icon, color }: {
  label: string;
  value: string | number;
  subValue: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'emerald' | 'amber';
}) {
  const colorClasses = {
    blue: 'bg-blue-600/20 text-blue-400',
    green: 'bg-green-600/20 text-green-400',
    emerald: 'bg-emerald-600/20 text-emerald-400',
    amber: 'bg-amber-600/20 text-amber-400',
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm text-gray-400">{label}</span>
        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', colorClasses[color])}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-semibold text-white mb-1">{value}</div>
      <div className="text-xs text-gray-500">{subValue}</div>
    </div>
  );
}

function HealthIndicator({ count, status, label }: {
  count: number;
  status: 'healthy' | 'degraded' | 'unhealthy' | 'offline';
  label: string;
}) {
  const statusColors = {
    healthy: 'bg-green-500',
    degraded: 'bg-yellow-500',
    unhealthy: 'bg-red-500',
    offline: 'bg-gray-500',
  };

  return (
    <div className="flex items-center gap-2">
      <span className={cn('w-3 h-3 rounded-full', statusColors[status])} />
      <span className="text-lg font-semibold text-white">{count}</span>
      <span className="text-sm text-gray-400">{label}</span>
    </div>
  );
}

function AgentCard({ agent }: { agent: AgentSummary }) {
  const healthColors = {
    healthy: 'bg-green-500',
    degraded: 'bg-yellow-500',
    unhealthy: 'bg-red-500',
    offline: 'bg-gray-500',
  };

  return (
    <Link
      to={`/studio/agents/${agent.id}`}
      className="bg-gray-800 rounded-lg p-4 hover:bg-gray-800/80 transition-colors border border-gray-700 hover:border-gray-600"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={cn('w-2 h-2 rounded-full', healthColors[agent.health.status])} />
          <span className="text-sm font-medium text-white">{agent.name}</span>
        </div>
        <span className={cn(
          'text-xs px-2 py-0.5 rounded',
          agent.status === 'published' ? 'bg-green-600/20 text-green-400' : 'bg-gray-600/50 text-gray-400'
        )}>
          {agent.status}
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-3 line-clamp-2">{agent.description}</p>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-sm font-medium text-white">{formatNumber(agent.metrics.totalInvocations)}</div>
          <div className="text-xs text-gray-500">Calls</div>
        </div>
        <div>
          <div className="text-sm font-medium text-white">{agent.metrics.successRate}%</div>
          <div className="text-xs text-gray-500">Success</div>
        </div>
        <div>
          <div className="text-sm font-medium text-amber-400">{agent.metrics.feedbackScore || '-'}</div>
          <div className="text-xs text-gray-500">Rating</div>
        </div>
      </div>
    </Link>
  );
}

function QuickAction({ title, description, icon, to }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="bg-gray-900 rounded-xl border border-gray-800 p-5 hover:border-gray-700 transition-colors group"
    >
      <div className="w-10 h-10 rounded-lg bg-gray-800 group-hover:bg-blue-600/20 flex items-center justify-center mb-3 transition-colors">
        <span className="w-5 h-5 text-gray-400 group-hover:text-blue-400">{icon}</span>
      </div>
      <h3 className="font-medium text-white mb-1">{title}</h3>
      <p className="text-xs text-gray-400">{description}</p>
    </Link>
  );
}

// Helpers
function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

// Icons
function AgentIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  );
}

function InvocationIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function BuildIcon() {
  return (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

function ConnectorIcon() {
  return (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="8" rx="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  );
}

function TestIcon() {
  return (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
