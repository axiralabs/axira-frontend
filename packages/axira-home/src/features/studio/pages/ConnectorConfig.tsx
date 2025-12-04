import { useState } from 'react';
import { cn } from '@axira/shared/utils';
import { STUDIO_CONNECTORS } from '../data/connectors';
import type { ConnectorConfig } from '../types';

type FilterStatus = 'all' | 'active' | 'inactive' | 'pending' | 'error';
type FilterType = 'all' | 'core_banking' | 'document' | 'communication' | 'compliance' | 'mcp';

export function ConnectorConfigPage() {
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [selectedConnector, setSelectedConnector] = useState<ConnectorConfig | null>(null);

  const filteredConnectors = STUDIO_CONNECTORS.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (typeFilter !== 'all' && c.type !== typeFilter) return false;
    return true;
  });

  const activeCount = STUDIO_CONNECTORS.filter((c) => c.status === 'active').length;
  const errorCount = STUDIO_CONNECTORS.filter((c) => c.status === 'error').length;
  const pendingCount = STUDIO_CONNECTORS.filter((c) => c.status === 'pending').length;

  return (
    <div className="h-full flex bg-gray-950">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-800 bg-gray-900 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white mb-2">Connectors</h1>
              <p className="text-gray-400">Configure and manage your integration connectors</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white transition-colors flex items-center gap-2">
              <PlusIcon className="w-4 h-4" />
              Add Connector
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard label="Total Connectors" value={STUDIO_CONNECTORS.length} />
            <StatCard label="Active" value={activeCount} color="green" />
            <StatCard label="Issues" value={errorCount} color="red" />
            <StatCard label="Pending Setup" value={pendingCount} color="amber" />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
              <option value="error">Error</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as FilterType)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="core_banking">Core Banking</option>
              <option value="document">Document Management</option>
              <option value="communication">Communication</option>
              <option value="compliance">Compliance</option>
              <option value="mcp">MCP</option>
            </select>
          </div>

          {/* Connector Grid */}
          <div className="grid grid-cols-2 gap-4">
            {filteredConnectors.map((connector) => (
              <ConnectorCard
                key={connector.id}
                connector={connector}
                isSelected={selectedConnector?.id === connector.id}
                onSelect={() => setSelectedConnector(connector)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      {selectedConnector && (
        <ConnectorDetailPanel
          connector={selectedConnector}
          onClose={() => setSelectedConnector(null)}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color?: 'green' | 'red' | 'amber' }) {
  const colorClasses = {
    green: 'text-green-400',
    red: 'text-red-400',
    amber: 'text-amber-400',
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
      <div className="text-sm text-gray-400 mb-1">{label}</div>
      <div className={cn('text-2xl font-semibold', color ? colorClasses[color] : 'text-white')}>
        {value}
      </div>
    </div>
  );
}

function ConnectorCard({ connector, isSelected, onSelect }: {
  connector: ConnectorConfig;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const statusColors = {
    active: 'bg-green-500',
    inactive: 'bg-gray-500',
    pending: 'bg-amber-500',
    error: 'bg-red-500',
  };

  const statusLabels = {
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending Setup',
    error: 'Error',
  };

  const typeLabels: Record<string, string> = {
    core_banking: 'Core Banking',
    document: 'Document',
    communication: 'Communication',
    compliance: 'Compliance',
    mcp: 'MCP',
  };

  const healthColors = {
    healthy: 'text-green-400',
    degraded: 'text-yellow-400',
    unhealthy: 'text-red-400',
  };

  return (
    <button
      onClick={onSelect}
      className={cn(
        'text-left bg-gray-900 rounded-xl border p-5 transition-all',
        isSelected ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-800 hover:border-gray-700'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <ConnectorIcon type={connector.type} provider={connector.provider} />
          <div>
            <h3 className="font-medium text-white">{connector.name}</h3>
            <span className="text-xs text-gray-500">{connector.provider}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('w-2 h-2 rounded-full', statusColors[connector.status])} />
          <span className="text-xs text-gray-400">{statusLabels[connector.status]}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
        <span className="px-2 py-0.5 bg-gray-800 rounded">{typeLabels[connector.type]}</span>
        <span>{connector.enabledSkills.length} skills</span>
      </div>

      {connector.status === 'active' && (
        <div className="flex items-center gap-4 text-xs">
          <span className={healthColors[connector.health.status]}>
            {connector.health.status.charAt(0).toUpperCase() + connector.health.status.slice(1)}
          </span>
          <span className="text-gray-500">Latency: {connector.health.latency}ms</span>
          <span className="text-gray-500">Uptime: {connector.health.uptime}%</span>
        </div>
      )}

      {connector.status === 'pending' && (
        <div className="text-xs text-amber-400">
          Requires configuration
        </div>
      )}

      {connector.status === 'error' && (
        <div className="text-xs text-red-400">
          Connection failed - click to troubleshoot
        </div>
      )}
    </button>
  );
}

function ConnectorDetailPanel({ connector, onClose }: {
  connector: ConnectorConfig;
  onClose: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="w-96 border-l border-gray-800 bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Connector Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded">
            <CloseIcon className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <ConnectorIcon type={connector.type} provider={connector.provider} size="lg" />
          <div>
            <h3 className="font-medium text-white">{connector.name}</h3>
            <span className="text-sm text-gray-400">{connector.provider}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Status */}
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">Status</label>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={connector.status === 'active'}
                onChange={() => {}}
                className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-white">Enabled</span>
            </label>
          </div>
        </div>

        {/* Health */}
        {connector.status === 'active' && (
          <div className="mb-6 p-4 bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-400 mb-3">Health Status</div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className={cn(
                  'text-lg font-semibold',
                  connector.health.status === 'healthy' ? 'text-green-400' :
                  connector.health.status === 'degraded' ? 'text-yellow-400' : 'text-red-400'
                )}>
                  {connector.health.status}
                </div>
                <div className="text-xs text-gray-500">Status</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-white">{connector.health.latency}ms</div>
                <div className="text-xs text-gray-500">Latency</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-white">{connector.health.uptime}%</div>
                <div className="text-xs text-gray-500">Uptime</div>
              </div>
            </div>
          </div>
        )}

        {/* Credentials */}
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">Authentication</label>
          <div className="p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white capitalize">{connector.credentials?.type.replace('_', ' ')}</span>
              <span className={cn(
                'text-xs px-2 py-0.5 rounded',
                connector.credentials?.isConfigured ? 'bg-green-600/20 text-green-400' : 'bg-amber-600/20 text-amber-400'
              )}>
                {connector.credentials?.isConfigured ? 'Configured' : 'Not Configured'}
              </span>
            </div>
            <button className="text-xs text-blue-400 hover:text-blue-300">
              {connector.credentials?.isConfigured ? 'Update Credentials' : 'Configure Credentials'}
            </button>
          </div>
        </div>

        {/* Configuration */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-400">Configuration</label>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg font-mono text-xs text-gray-300">
            {Object.entries(connector.config).map(([key, value]) => (
              <div key={key} className="flex gap-2">
                <span className="text-gray-500">{key}:</span>
                <span>{String(value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Enabled Skills */}
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">
            Enabled Skills ({connector.enabledSkills.length})
          </label>
          {connector.enabledSkills.length > 0 ? (
            <div className="space-y-2">
              {connector.enabledSkills.map((skillId) => (
                <div key={skillId} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                  <span className="text-sm text-white">{skillId}</span>
                  <button className="text-xs text-red-400 hover:text-red-300">Disable</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No skills enabled</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 flex gap-3">
        <button className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium text-white transition-colors">
          Test Connection
        </button>
        <button className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg text-sm font-medium text-red-400 transition-colors">
          Delete
        </button>
      </div>
    </div>
  );
}

function ConnectorIcon({ type, provider, size = 'md' }: { type: string; provider: string; size?: 'md' | 'lg' }) {
  const sizeClasses = size === 'lg' ? 'w-12 h-12' : 'w-10 h-10';
  const textSize = size === 'lg' ? 'text-sm' : 'text-xs';

  const colorMap: Record<string, string> = {
    fis: 'bg-blue-600',
    'jack henry': 'bg-green-600',
    fiserv: 'bg-orange-600',
    microsoft: 'bg-blue-500',
    google: 'bg-red-500',
    salesforce: 'bg-blue-400',
    slack: 'bg-purple-600',
    servicenow: 'bg-green-500',
  };

  const bgColor = colorMap[provider.toLowerCase()] || 'bg-gray-600';
  const initials = provider.slice(0, 2).toUpperCase();

  return (
    <div className={cn(sizeClasses, bgColor, 'rounded-lg flex items-center justify-center')}>
      <span className={cn('font-bold text-white', textSize)}>{initials}</span>
    </div>
  );
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

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
