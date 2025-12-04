export interface PromptPlaceholder {
  key: string;
  label: string;
  defaultValue?: string;
}

export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  template: string;
  placeholders: PromptPlaceholder[];
  icon: 'document' | 'search' | 'check' | 'alert' | 'user' | 'money' | 'chart' | 'users' | 'trending';
  iconColor: string;
  category: string; // Flexible category for different contexts (compliance, customer, operations, reporting, risk, performance, strategy)
}

export interface TemplateCategory {
  key: string;
  label: string;
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'doc-check',
    title: 'Check documents for customer',
    description: 'Verify document presence and completeness for a specific customer account',
    template: 'Check all required documents for {customer_name} with account ending in {account_number}. List any missing or expired documents.',
    placeholders: [
      { key: 'customer_name', label: 'Customer Name', defaultValue: 'Garcia household' },
      { key: 'account_number', label: 'Account Number (last 4)', defaultValue: '1234' },
    ],
    icon: 'document',
    iconColor: 'bg-blue-100 text-blue-600',
    category: 'compliance',
  },
  {
    id: 'kyc-status',
    title: 'KYC/CIP status review',
    description: 'Get the current KYC and CIP verification status for a customer',
    template: 'What is the current KYC/CIP status for {customer_name}? Are there any pending verifications or exceptions?',
    placeholders: [
      { key: 'customer_name', label: 'Customer Name', defaultValue: 'Martinez LLC' },
    ],
    icon: 'check',
    iconColor: 'bg-green-100 text-green-600',
    category: 'compliance',
  },
  {
    id: 'account-summary',
    title: 'Account summary for customer',
    description: 'Get a comprehensive summary of all accounts for a customer',
    template: 'Provide a summary of all accounts for {customer_name}. Include balances, account types, and any flags or alerts.',
    placeholders: [
      { key: 'customer_name', label: 'Customer Name', defaultValue: 'Smith family' },
    ],
    icon: 'user',
    iconColor: 'bg-purple-100 text-purple-600',
    category: 'customer',
  },
  {
    id: 'pending-qa',
    title: 'Show pending QA cases',
    description: 'List all QA review cases that need attention',
    template: 'Show all pending QA cases for {branch_name} branch that are {status}. Sort by SLA deadline.',
    placeholders: [
      { key: 'branch_name', label: 'Branch Name', defaultValue: 'North Austin' },
      { key: 'status', label: 'Status', defaultValue: 'due today' },
    ],
    icon: 'alert',
    iconColor: 'bg-orange-100 text-orange-600',
    category: 'operations',
  },
  {
    id: 'loan-eligibility',
    title: 'Check loan eligibility',
    description: 'Assess customer eligibility for loan products',
    template: 'Check if {customer_name} is eligible for a {loan_type}. Include credit factors and any concerns.',
    placeholders: [
      { key: 'customer_name', label: 'Customer Name', defaultValue: 'Johnson household' },
      { key: 'loan_type', label: 'Loan Type', defaultValue: 'home equity loan' },
    ],
    icon: 'money',
    iconColor: 'bg-emerald-100 text-emerald-600',
    category: 'customer',
  },
  {
    id: 'compliance-report',
    title: 'Generate compliance report',
    description: 'Create a compliance summary report for a specific period',
    template: 'Generate a compliance report for {report_type} covering the {time_period}. Highlight any exceptions or issues.',
    placeholders: [
      { key: 'report_type', label: 'Report Type', defaultValue: 'BSA/AML' },
      { key: 'time_period', label: 'Time Period', defaultValue: 'last 30 days' },
    ],
    icon: 'document',
    iconColor: 'bg-indigo-100 text-indigo-600',
    category: 'reporting',
  },
];

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  { key: 'all', label: 'All' },
  { key: 'compliance', label: 'Compliance' },
  { key: 'customer', label: 'Customer' },
  { key: 'operations', label: 'Operations' },
  { key: 'reporting', label: 'Reporting' },
];
