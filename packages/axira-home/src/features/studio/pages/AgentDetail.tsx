import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { cn } from '@axira/shared/utils';
import { STUDIO_AGENTS } from '../data/agents';
import { BANK_SKILLS } from '../../build/data/skills';
import type { AgentSummary } from '../types';

type TabKey = 'overview' | 'workflow' | 'prompts' | 'skills' | 'versions' | 'testing';

export function AgentDetail() {
  const { agentId } = useParams<{ agentId: string }>();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const agent = STUDIO_AGENTS.find((a) => a.id === agentId);

  if (!agent) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Agent not found</p>
          <Link to="/studio/agents" className="text-blue-400 hover:text-blue-300">
            Back to Agents
          </Link>
        </div>
      </div>
    );
  }

  const healthColors = {
    healthy: 'bg-green-500',
    degraded: 'bg-yellow-500',
    unhealthy: 'bg-red-500',
    offline: 'bg-gray-500',
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'workflow', label: 'Workflow' },
    { key: 'prompts', label: 'Prompts' },
    { key: 'skills', label: 'Skills' },
    { key: 'versions', label: 'Versions' },
    { key: 'testing', label: 'Testing' },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="px-8 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link to="/studio/agents" className="hover:text-white">Agents</Link>
            <span>/</span>
            <span className="text-white">{agent.name}</span>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center',
                agent.type === 'business' ? 'bg-blue-600' : 'bg-purple-600'
              )}>
                <AgentIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold text-white">{agent.name}</h1>
                  <span className={cn('w-2.5 h-2.5 rounded-full', healthColors[agent.health.status])} />
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded',
                    agent.status === 'published' ? 'bg-green-600/20 text-green-400' : 'bg-gray-600/50 text-gray-400'
                  )}>
                    {agent.status}
                  </span>
                </div>
                <p className="text-gray-400 mt-1">{agent.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium text-white transition-colors">
                Edit
              </button>
              <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium text-white transition-colors">
                Test
              </button>
              {agent.status === 'draft' ? (
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white transition-colors">
                  Publish
                </button>
              ) : (
                <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium text-white transition-colors">
                  Unpublish
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-8 flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'pb-3 text-sm font-medium border-b-2 transition-colors',
                activeTab === tab.key
                  ? 'text-white border-blue-500'
                  : 'text-gray-400 border-transparent hover:text-white'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {activeTab === 'overview' && <OverviewTab agent={agent} />}
        {activeTab === 'workflow' && <WorkflowTab agent={agent} />}
        {activeTab === 'prompts' && <PromptsTab agent={agent} />}
        {activeTab === 'skills' && <SkillsTab agent={agent} />}
        {activeTab === 'versions' && <VersionsTab agent={agent} />}
        {activeTab === 'testing' && <TestingTab agent={agent} />}
      </div>
    </div>
  );
}

function OverviewTab({ agent }: { agent: AgentSummary }) {
  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          label="Total Invocations"
          value={formatNumber(agent.metrics.totalInvocations)}
          subValue="Last 30 days"
          trend="+12%"
          trendUp
        />
        <MetricCard
          label="Success Rate"
          value={`${agent.metrics.successRate}%`}
          status={agent.metrics.successRate >= 98 ? 'good' : agent.metrics.successRate >= 95 ? 'warn' : 'bad'}
        />
        <MetricCard
          label="Avg Latency"
          value={`${(agent.metrics.avgLatency / 1000).toFixed(2)}s`}
          subValue={`${agent.metrics.avgTokensUsed} tokens avg`}
        />
        <MetricCard
          label="Feedback Score"
          value={agent.metrics.feedbackScore?.toFixed(1) || '-'}
          subValue={`${agent.metrics.feedbackCount} reviews`}
          status={agent.metrics.feedbackScore >= 4.5 ? 'good' : agent.metrics.feedbackScore >= 4.0 ? 'warn' : undefined}
        />
      </div>

      {/* Health Issues */}
      {agent.health.issues.length > 0 && (
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-4">
          <h3 className="text-sm font-medium text-red-400 mb-3">Health Issues</h3>
          <ul className="space-y-2">
            {agent.health.issues.map((issue, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-red-300">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Agent Map */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-medium text-white mb-4">Agent Architecture</h3>
        <div className="flex items-center gap-4">
          {/* Business Agent */}
          <div className="bg-blue-600/20 border border-blue-600/50 rounded-lg p-4 min-w-[200px]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
                <AgentIcon className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-white">{agent.name}</span>
            </div>
            <div className="text-xs text-gray-400">Business Agent</div>
          </div>

          <ArrowIcon className="w-6 h-6 text-gray-600" />

          {/* Process Agents */}
          <div className="flex-1">
            <div className="grid grid-cols-3 gap-3">
              {[...Array(agent.processAgentCount || 0)].map((_, i) => (
                <div key={i} className="bg-purple-600/20 border border-purple-600/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded bg-purple-600 flex items-center justify-center">
                      <ProcessIcon className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-medium text-white">Process Agent {i + 1}</span>
                  </div>
                  <div className="text-xs text-gray-400">{Math.ceil(agent.skillCount / (agent.processAgentCount || 1))} skills</div>
                </div>
              ))}
            </div>
          </div>

          <ArrowIcon className="w-6 h-6 text-gray-600" />

          {/* Skills */}
          <div className="bg-green-600/20 border border-green-600/50 rounded-lg p-4 min-w-[120px] text-center">
            <div className="text-2xl font-semibold text-white mb-1">{agent.skillCount}</div>
            <div className="text-xs text-gray-400">Skills</div>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-medium text-white mb-4">Details</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-400">Type</dt>
              <dd className="text-white capitalize">{agent.type}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-400">Version</dt>
              <dd className="text-white">{agent.versions[0]?.version || 'N/A'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-400">Created</dt>
              <dd className="text-white">{new Date(agent.createdAt).toLocaleDateString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-400">Last Updated</dt>
              <dd className="text-white">{new Date(agent.updatedAt).toLocaleDateString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-400">Created By</dt>
              <dd className="text-white">{agent.createdBy}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-medium text-white mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {agent.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkflowTab({ agent }: { agent: AgentSummary }) {
  const isProcessAgent = agent.type === 'process';

  return (
    <div className="space-y-6">
      {isProcessAgent ? (
        // Process Agent - show workflow details and edit button
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-white">Workflow</h3>
            <Link
              to={`/studio/workflow-editor/${agent.id}`}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white transition-colors inline-flex items-center gap-2"
            >
              <EditIcon className="w-4 h-4" />
              Edit Workflow
            </Link>
          </div>

          {/* Mini workflow preview */}
          <div className="bg-gray-800 rounded-lg p-6 h-64 flex items-center justify-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center">
                <StartIcon className="w-6 h-6 text-white" />
              </div>
              <ArrowIcon className="w-6 h-6 text-gray-600" />
              <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center">
                <SkillIcon className="w-6 h-6 text-white" />
              </div>
              <ArrowIcon className="w-6 h-6 text-gray-600" />
              <div className="w-12 h-12 rounded-lg bg-amber-600 flex items-center justify-center">
                <ConditionIcon className="w-6 h-6 text-white" />
              </div>
              <ArrowIcon className="w-6 h-6 text-gray-600" />
              <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
                <OutputIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
            <span>{agent.skillCount} skills</span>
            <span>•</span>
            <span>Last edited {new Date(agent.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      ) : (
        // Business Agent - show process agents list
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Process Agents</h3>
            <Link
              to="/studio/agent-builder"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium text-white transition-colors"
            >
              + Add Process Agent
            </Link>
          </div>
          <div className="space-y-3">
            {[...Array(agent.processAgentCount || 0)].map((_, i) => (
              <div key={i} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                      <ProcessIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Process Agent {i + 1}</h4>
                      <p className="text-sm text-gray-400">
                        {Math.ceil(agent.skillCount / (agent.processAgentCount || 1))} skills configured
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/studio/workflow-editor/pa-${i}`}
                    className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-white transition-colors"
                  >
                    Edit Workflow
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PromptsTab({ agent }: { agent: AgentSummary }) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">System Prompt</h3>
          <button className="text-sm text-blue-400 hover:text-blue-300">Edit</button>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm text-gray-300">
          <p>You are {agent.name}, a specialized assistant for community banking operations.</p>
          <p className="mt-2">Your primary responsibilities include:</p>
          <ul className="list-disc list-inside mt-1 text-gray-400">
            <li>Helping bankers with customer inquiries</li>
            <li>Verifying document compliance</li>
            <li>Providing account information</li>
          </ul>
          <p className="mt-2 text-gray-500">... (truncated for display)</p>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Response Templates</h3>
          <button className="text-sm text-blue-400 hover:text-blue-300">+ Add Template</button>
        </div>
        <div className="space-y-3">
          {['Document Check Complete', 'Account Summary', 'Error Response'].map((template) => (
            <div key={template} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <span className="text-sm text-white">{template}</span>
              <button className="text-xs text-gray-400 hover:text-white">Edit</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SkillsTab({ agent }: { agent: AgentSummary }) {
  const skills = BANK_SKILLS.slice(0, agent.skillCount);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">{agent.skillCount} Skills Configured</h3>
        <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium text-white transition-colors">
          + Add Skill
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {skills.map((skill) => (
          <div key={skill.id} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={cn(
                  'w-2 h-2 rounded-full',
                  skill.health.status === 'healthy' ? 'bg-green-500' :
                  skill.health.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                )} />
                <h4 className="font-medium text-white">{skill.name}</h4>
              </div>
              <span className="text-xs px-2 py-0.5 bg-gray-800 rounded text-gray-400">
                {skill.connectorName}
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-3">{skill.description}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Uptime: {skill.health.uptime}%</span>
              <span>Latency: {skill.health.avgLatency}ms</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VersionsTab({ agent }: { agent: AgentSummary }) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Version</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Published</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">By</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Changes</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {agent.versions.map((version) => (
            <tr key={version.version}>
              <td className="px-6 py-4 text-sm font-medium text-white">{version.version}</td>
              <td className="px-6 py-4">
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded',
                  version.status === 'published' ? 'bg-green-600/20 text-green-400' :
                  version.status === 'draft' ? 'bg-gray-600/50 text-gray-400' : 'bg-red-600/20 text-red-400'
                )}>
                  {version.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-400">
                {version.publishedAt ? new Date(version.publishedAt).toLocaleDateString() : '-'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-400">{version.publishedBy}</td>
              <td className="px-6 py-4 text-sm text-gray-400">{version.changeLog}</td>
              <td className="px-6 py-4 text-right">
                <button className="text-xs text-blue-400 hover:text-blue-300">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TestingTab({ agent }: { agent: AgentSummary }) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-medium text-white mb-4">Run Test</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Test Input</label>
            <textarea
              rows={4}
              placeholder="Enter a test message for the agent..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white transition-colors">
            Run Test
          </button>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-medium text-white mb-4">Recent Test Runs</h3>
        <p className="text-gray-400 text-sm">No test runs yet. Run a test above to see results.</p>
      </div>
    </div>
  );
}

// Components
function MetricCard({ label, value, subValue, trend, trendUp, status }: {
  label: string;
  value: string;
  subValue?: string;
  trend?: string;
  trendUp?: boolean;
  status?: 'good' | 'warn' | 'bad';
}) {
  const statusColors = {
    good: 'text-green-400',
    warn: 'text-yellow-400',
    bad: 'text-red-400',
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
      <div className="text-sm text-gray-400 mb-2">{label}</div>
      <div className="flex items-end gap-2">
        <span className={cn(
          'text-2xl font-semibold',
          status ? statusColors[status] : 'text-white'
        )}>
          {value}
        </span>
        {trend && (
          <span className={cn(
            'text-xs font-medium',
            trendUp ? 'text-green-400' : 'text-red-400'
          )}>
            {trend}
          </span>
        )}
      </div>
      {subValue && <div className="text-xs text-gray-500 mt-1">{subValue}</div>}
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

// Icons
function AgentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  );
}

function ProcessIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function WorkflowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="5" r="2" />
      <circle cx="12" cy="19" r="2" />
      <circle cx="19" cy="12" r="2" />
      <path d="M7 12h3M12 7v3m0 4v3m5-5h-3" />
    </svg>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function StartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="5 3 19 12 5 21 5 3" />
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

function ConditionIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3l9 9-9 9-9-9 9-9z" />
    </svg>
  );
}

function OutputIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 8 12 12 14 14" />
    </svg>
  );
}
