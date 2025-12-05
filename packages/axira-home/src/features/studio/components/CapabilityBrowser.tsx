import { useState, useMemo, useCallback } from 'react';
import { cn } from '@axira/shared/utils';

// ============================================================================
// Types
// ============================================================================

export type CapabilityType = 'ATOMIC' | 'COMPOSITE' | 'INTELLIGENT';
export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy' | 'offline';
export type CostBand = 'LOW' | 'MEDIUM' | 'HIGH';
export type RiskLevel = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH';

export interface SemanticCapability {
  key: string;
  name: string;
  description?: string;
  capabilityType: CapabilityType;
  domain: string;
  intent: string;
  boundSkillKey?: string;
  childCapabilities?: string[];
  healthStatus: HealthStatus;
  costBand: CostBand;
  riskLevel: RiskLevel;
  avgLatencyMs?: number;
  successRate?: number;
  lastUsed?: string;
  usageCount?: number;
  requiredFeatures?: string[];
  producedFeatures?: string[];
  matchScore?: number;
}

export interface CapabilityBrowserProps {
  capabilities: SemanticCapability[];
  onSelect?: (capability: SemanticCapability) => void;
  onBind?: (capability: SemanticCapability) => void;
  selectedCapabilityKey?: string;
  isLoading?: boolean;
  className?: string;
}

export interface CapabilityFilters {
  domain: string | null;
  capabilityType: CapabilityType | null;
  healthStatus: HealthStatus | null;
  maxRiskLevel: RiskLevel | null;
  maxCostBand: CostBand | null;
  searchQuery: string;
}

// Default available domains
const DOMAINS = [
  'compliance',
  'operations',
  'customer_service',
  'lending',
  'deposits',
  'wealth_management',
  'risk_management',
  'fraud_detection',
  'reporting',
  'general',
];

// ============================================================================
// Main Component
// ============================================================================

export function CapabilityBrowser({
  capabilities,
  onSelect,
  onBind,
  selectedCapabilityKey,
  isLoading = false,
  className,
}: CapabilityBrowserProps) {
  const [filters, setFilters] = useState<CapabilityFilters>({
    domain: null,
    capabilityType: null,
    healthStatus: null,
    maxRiskLevel: null,
    maxCostBand: null,
    searchQuery: '',
  });
  const [sortBy, setSortBy] = useState<'name' | 'usage' | 'health' | 'latency'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const updateFilter = useCallback(<K extends keyof CapabilityFilters>(
    key: K,
    value: CapabilityFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      domain: null,
      capabilityType: null,
      healthStatus: null,
      maxRiskLevel: null,
      maxCostBand: null,
      searchQuery: '',
    });
  }, []);

  // Filter capabilities
  const filteredCapabilities = useMemo(() => {
    return capabilities.filter((cap) => {
      // Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        if (
          !cap.name.toLowerCase().includes(query) &&
          !cap.key.toLowerCase().includes(query) &&
          !(cap.description?.toLowerCase().includes(query)) &&
          !cap.intent.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Domain filter
      if (filters.domain && cap.domain !== filters.domain) {
        return false;
      }

      // Capability type filter
      if (filters.capabilityType && cap.capabilityType !== filters.capabilityType) {
        return false;
      }

      // Health status filter
      if (filters.healthStatus && cap.healthStatus !== filters.healthStatus) {
        return false;
      }

      // Max risk level filter
      if (filters.maxRiskLevel) {
        const riskOrder = ['INFO', 'LOW', 'MEDIUM', 'HIGH'];
        const maxIndex = riskOrder.indexOf(filters.maxRiskLevel);
        const capIndex = riskOrder.indexOf(cap.riskLevel);
        if (capIndex > maxIndex) {
          return false;
        }
      }

      // Max cost band filter
      if (filters.maxCostBand) {
        const costOrder = ['LOW', 'MEDIUM', 'HIGH'];
        const maxIndex = costOrder.indexOf(filters.maxCostBand);
        const capIndex = costOrder.indexOf(cap.costBand);
        if (capIndex > maxIndex) {
          return false;
        }
      }

      return true;
    });
  }, [capabilities, filters]);

  // Sort capabilities
  const sortedCapabilities = useMemo(() => {
    const sorted = [...filteredCapabilities].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'usage':
          comparison = (b.usageCount || 0) - (a.usageCount || 0);
          break;
        case 'health':
          const healthOrder = ['healthy', 'degraded', 'unhealthy', 'offline'];
          comparison = healthOrder.indexOf(a.healthStatus) - healthOrder.indexOf(b.healthStatus);
          break;
        case 'latency':
          comparison = (a.avgLatencyMs || 0) - (b.avgLatencyMs || 0);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    return sorted;
  }, [filteredCapabilities, sortBy, sortOrder]);

  // Count by domain for filter chips
  const domainCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    capabilities.forEach((cap) => {
      counts[cap.domain] = (counts[cap.domain] || 0) + 1;
    });
    return counts;
  }, [capabilities]);

  const hasActiveFilters = Object.values(filters).some((v) => v !== null && v !== '');

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="h-10 bg-gray-800 rounded-lg animate-pulse" />
        <div className="h-12 bg-gray-800 rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search Bar */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => updateFilter('searchQuery', e.target.value)}
          placeholder="Search capabilities by name, key, or intent..."
          className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {filters.searchQuery && (
          <button
            type="button"
            onClick={() => updateFilter('searchQuery', '')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
          >
            <XIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Domain Filter Chips */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => updateFilter('domain', null)}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
            filters.domain === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          )}
        >
          All ({capabilities.length})
        </button>
        {DOMAINS.filter((d) => domainCounts[d]).map((domain) => (
          <button
            key={domain}
            type="button"
            onClick={() => updateFilter('domain', filters.domain === domain ? null : domain)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
              filters.domain === domain
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            )}
          >
            {formatDomainLabel(domain)} ({domainCounts[domain]})
          </button>
        ))}
      </div>

      {/* Advanced Filters Row */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Type Filter */}
        <select
          value={filters.capabilityType || ''}
          onChange={(e) => updateFilter('capabilityType', (e.target.value || null) as CapabilityType | null)}
          className="px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          <option value="ATOMIC">Atomic</option>
          <option value="COMPOSITE">Composite</option>
          <option value="INTELLIGENT">Intelligent</option>
        </select>

        {/* Health Filter */}
        <select
          value={filters.healthStatus || ''}
          onChange={(e) => updateFilter('healthStatus', (e.target.value || null) as HealthStatus | null)}
          className="px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Any Health</option>
          <option value="healthy">Healthy Only</option>
          <option value="degraded">Degraded</option>
          <option value="unhealthy">Unhealthy</option>
        </select>

        {/* Risk Level Filter */}
        <select
          value={filters.maxRiskLevel || ''}
          onChange={(e) => updateFilter('maxRiskLevel', (e.target.value || null) as RiskLevel | null)}
          className="px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Any Risk</option>
          <option value="INFO">Up to Info</option>
          <option value="LOW">Up to Low</option>
          <option value="MEDIUM">Up to Medium</option>
        </select>

        {/* Cost Band Filter */}
        <select
          value={filters.maxCostBand || ''}
          onChange={(e) => updateFilter('maxCostBand', (e.target.value || null) as CostBand | null)}
          className="px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Any Cost</option>
          <option value="LOW">Low Cost</option>
          <option value="MEDIUM">Up to Medium</option>
        </select>

        {/* Sort */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-gray-500">Sort:</span>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [by, order] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
              setSortBy(by);
              setSortOrder(order);
            }}
            className="px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="usage-desc">Most Used</option>
            <option value="usage-asc">Least Used</option>
            <option value="health-asc">Health (Best First)</option>
            <option value="latency-asc">Fastest</option>
            <option value="latency-desc">Slowest</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs text-gray-400 hover:text-white"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">
          Showing {sortedCapabilities.length} of {capabilities.length} capabilities
        </span>
      </div>

      {/* Capability Cards Grid */}
      {sortedCapabilities.length === 0 ? (
        <div className="py-12 text-center">
          <SearchIcon className="w-12 h-12 mx-auto text-gray-700 mb-3" />
          <h3 className="text-lg font-medium text-gray-300 mb-1">No capabilities found</h3>
          <p className="text-sm text-gray-500">
            Try adjusting your filters or search query
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 text-sm text-blue-400 hover:text-blue-300"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedCapabilities.map((capability) => (
            <CapabilityCard
              key={capability.key}
              capability={capability}
              isSelected={selectedCapabilityKey === capability.key}
              onSelect={onSelect}
              onBind={onBind}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Capability Card Component
// ============================================================================

interface CapabilityCardProps {
  capability: SemanticCapability;
  isSelected: boolean;
  onSelect?: (capability: SemanticCapability) => void;
  onBind?: (capability: SemanticCapability) => void;
}

function CapabilityCard({ capability, isSelected, onSelect, onBind }: CapabilityCardProps) {
  const healthColors: Record<HealthStatus, string> = {
    healthy: 'bg-green-500',
    degraded: 'bg-yellow-500',
    unhealthy: 'bg-red-500',
    offline: 'bg-gray-500',
  };

  const typeColors: Record<CapabilityType, { bg: string; text: string }> = {
    ATOMIC: { bg: 'bg-blue-600/20', text: 'text-blue-400' },
    COMPOSITE: { bg: 'bg-purple-600/20', text: 'text-purple-400' },
    INTELLIGENT: { bg: 'bg-amber-600/20', text: 'text-amber-400' },
  };

  const riskColors: Record<RiskLevel, string> = {
    INFO: 'text-gray-400',
    LOW: 'text-green-400',
    MEDIUM: 'text-yellow-400',
    HIGH: 'text-red-400',
  };

  const costColors: Record<CostBand, string> = {
    LOW: 'text-green-400',
    MEDIUM: 'text-yellow-400',
    HIGH: 'text-red-400',
  };

  return (
    <div
      className={cn(
        'bg-gray-900 rounded-xl border p-4 transition-all cursor-pointer',
        isSelected
          ? 'border-blue-500 ring-1 ring-blue-500/50'
          : 'border-gray-800 hover:border-gray-700'
      )}
      onClick={() => onSelect?.(capability)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.(capability);
        }
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={cn('w-2 h-2 rounded-full', healthColors[capability.healthStatus])} />
          <h4 className="font-medium text-white truncate">{capability.name}</h4>
        </div>
        <span
          className={cn(
            'text-[10px] px-2 py-0.5 rounded font-medium',
            typeColors[capability.capabilityType].bg,
            typeColors[capability.capabilityType].text
          )}
        >
          {capability.capabilityType}
        </span>
      </div>

      {/* Description */}
      {capability.description && (
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{capability.description}</p>
      )}

      {/* Domain & Intent */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="text-xs px-2 py-0.5 bg-gray-800 rounded text-gray-400">
          {formatDomainLabel(capability.domain)}
        </span>
        <span className="text-xs px-2 py-0.5 bg-gray-800 rounded text-gray-400">
          {capability.intent}
        </span>
      </div>

      {/* Metrics Row */}
      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
        {capability.avgLatencyMs !== undefined && (
          <span className="flex items-center gap-1">
            <ClockIcon className="w-3 h-3" />
            {capability.avgLatencyMs}ms
          </span>
        )}
        {capability.successRate !== undefined && (
          <span className="flex items-center gap-1">
            <CheckIcon className="w-3 h-3" />
            {capability.successRate}%
          </span>
        )}
        {capability.usageCount !== undefined && (
          <span className="flex items-center gap-1">
            <UsageIcon className="w-3 h-3" />
            {formatNumber(capability.usageCount)}
          </span>
        )}
      </div>

      {/* Risk & Cost Badges */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={cn('text-xs', riskColors[capability.riskLevel])}>
            Risk: {capability.riskLevel}
          </span>
          <span className={cn('text-xs', costColors[capability.costBand])}>
            Cost: {capability.costBand}
          </span>
        </div>

        {onBind && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBind(capability);
            }}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs font-medium text-white transition-colors"
          >
            Bind
          </button>
        )}
      </div>

      {/* Match Score (if available) */}
      {capability.matchScore !== undefined && (
        <div className="mt-3 pt-3 border-t border-gray-800">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Match Score</span>
            <span className="text-blue-400 font-medium">
              {Math.round(capability.matchScore * 100)}%
            </span>
          </div>
          <div className="mt-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${capability.matchScore * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Skill Key (for ATOMIC) */}
      {capability.capabilityType === 'ATOMIC' && capability.boundSkillKey && (
        <div className="mt-3 pt-3 border-t border-gray-800 text-xs text-gray-500">
          <span className="text-gray-600">Skill:</span>{' '}
          <code className="font-mono">{capability.boundSkillKey}</code>
        </div>
      )}

      {/* Child Capabilities (for COMPOSITE) */}
      {capability.capabilityType === 'COMPOSITE' && capability.childCapabilities && capability.childCapabilities.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-800 text-xs text-gray-500">
          <span className="text-gray-600">Children:</span>{' '}
          {capability.childCapabilities.slice(0, 3).join(', ')}
          {capability.childCapabilities.length > 3 && ` +${capability.childCapabilities.length - 3} more`}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Helper Functions
// ============================================================================

function formatDomainLabel(domain: string): string {
  return domain
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

// ============================================================================
// Icons
// ============================================================================

function SearchIcon({ className }: { className?: string }) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
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
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
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
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function UsageIcon({ className }: { className?: string }) {
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
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  );
}
