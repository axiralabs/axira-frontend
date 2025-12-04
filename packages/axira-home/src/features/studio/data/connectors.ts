import type { ConnectorConfig } from '../types';

export const STUDIO_CONNECTORS: ConnectorConfig[] = [
  // Core Banking
  {
    id: 'conn-fis-horizon',
    name: 'FIS Horizon',
    type: 'core_banking',
    provider: 'FIS',
    status: 'active',
    health: {
      status: 'healthy',
      latency: 120,
      uptime: 99.8,
      lastChecked: new Date().toISOString(),
    },
    config: {
      endpoint: 'https://api.fis.com/horizon/v2',
      region: 'us-east-1',
      timeout: 30000,
    },
    credentials: {
      type: 'api_key',
      isConfigured: true,
    },
    enabledSkills: ['fis-account-lookup', 'fis-balance-inquiry', 'fis-transaction-history'],
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60000).toISOString(),
  },
  {
    id: 'conn-jack-henry',
    name: 'Jack Henry Symitar',
    type: 'core_banking',
    provider: 'Jack Henry',
    status: 'active',
    health: {
      status: 'healthy',
      latency: 95,
      uptime: 99.7,
      lastChecked: new Date().toISOString(),
    },
    config: {
      endpoint: 'https://api.jackhenry.com/symitar/v3',
      timeout: 25000,
    },
    credentials: {
      type: 'oauth',
      isConfigured: true,
    },
    enabledSkills: ['jh-customer-lookup', 'jh-transaction-history'],
    createdAt: new Date(Date.now() - 150 * 24 * 60 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60000).toISOString(),
  },

  // Compliance
  {
    id: 'conn-fiserv-aml',
    name: 'Fiserv AML',
    type: 'compliance',
    provider: 'Fiserv',
    status: 'error',
    health: {
      status: 'unhealthy',
      latency: 1200,
      uptime: 85.0,
      lastChecked: new Date().toISOString(),
    },
    config: {
      endpoint: 'https://aml.fiserv.com/api/v1',
      timeout: 60000,
    },
    credentials: {
      type: 'api_key',
      isConfigured: true,
    },
    enabledSkills: ['sanctions-screening', 'bsa-aml-check'],
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60000).toISOString(),
  },

  // Document Management
  {
    id: 'conn-sharepoint',
    name: 'SharePoint',
    type: 'document',
    provider: 'Microsoft',
    status: 'active',
    health: {
      status: 'healthy',
      latency: 180,
      uptime: 99.5,
      lastChecked: new Date().toISOString(),
    },
    config: {
      tenantId: 'lsnb-corp',
      siteUrl: 'https://lsnb.sharepoint.com',
    },
    credentials: {
      type: 'oauth',
      isConfigured: true,
    },
    enabledSkills: ['sharepoint-search', 'doc-retrieve'],
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60000).toISOString(),
  },

  // Communication
  {
    id: 'conn-outlook',
    name: 'Outlook Email',
    type: 'communication',
    provider: 'Microsoft',
    status: 'active',
    health: {
      status: 'healthy',
      latency: 200,
      uptime: 99.8,
      lastChecked: new Date().toISOString(),
    },
    config: {
      tenantId: 'lsnb-corp',
    },
    credentials: {
      type: 'oauth',
      isConfigured: true,
    },
    enabledSkills: ['email-send'],
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60000).toISOString(),
  },
  {
    id: 'conn-teams',
    name: 'Microsoft Teams',
    type: 'communication',
    provider: 'Microsoft',
    status: 'inactive',
    health: {
      status: 'healthy',
      latency: 0,
      uptime: 0,
      lastChecked: new Date().toISOString(),
    },
    config: {
      tenantId: 'lsnb-corp',
    },
    credentials: {
      type: 'oauth',
      isConfigured: false,
    },
    enabledSkills: [],
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 60 * 24 * 60 * 60000).toISOString(),
  },

  // MCP Servers
  {
    id: 'conn-google-calendar',
    name: 'Google Calendar',
    type: 'mcp',
    provider: 'Google',
    status: 'active',
    health: {
      status: 'healthy',
      latency: 150,
      uptime: 99.5,
      lastChecked: new Date().toISOString(),
    },
    config: {
      scopes: ['calendar.readonly', 'calendar.events'],
    },
    credentials: {
      type: 'oauth',
      isConfigured: true,
    },
    enabledSkills: ['calendar-check'],
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60000).toISOString(),
  },
  {
    id: 'conn-salesforce',
    name: 'Salesforce CRM',
    type: 'mcp',
    provider: 'Salesforce',
    status: 'active',
    health: {
      status: 'degraded',
      latency: 450,
      uptime: 96.2,
      lastChecked: new Date().toISOString(),
    },
    config: {
      instanceUrl: 'https://lsnb.my.salesforce.com',
      apiVersion: '58.0',
    },
    credentials: {
      type: 'oauth',
      isConfigured: true,
    },
    enabledSkills: ['crm-update'],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60000).toISOString(),
  },

  // Pending Setup
  {
    id: 'conn-slack',
    name: 'Slack',
    type: 'communication',
    provider: 'Slack',
    status: 'pending',
    health: {
      status: 'healthy',
      latency: 0,
      uptime: 0,
      lastChecked: new Date().toISOString(),
    },
    config: {},
    credentials: {
      type: 'oauth',
      isConfigured: false,
    },
    enabledSkills: [],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60000).toISOString(),
  },
  {
    id: 'conn-servicenow',
    name: 'ServiceNow',
    type: 'mcp',
    provider: 'ServiceNow',
    status: 'pending',
    health: {
      status: 'healthy',
      latency: 0,
      uptime: 0,
      lastChecked: new Date().toISOString(),
    },
    config: {},
    credentials: {
      type: 'basic',
      isConfigured: false,
    },
    enabledSkills: [],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(),
  },
];
