import { Link } from 'react-router-dom';

// User Management Page
export function UsersPage() {
  return (
    <PlaceholderPage
      title="User Management"
      description="Manage team members, roles, and permissions"
      features={['Add and remove team members', 'Assign roles (Admin, Builder, Viewer)', 'Configure permissions']}
    />
  );
}

// Domain Management Page
export function DomainsPage() {
  return (
    <PlaceholderPage
      title="Domain Configuration"
      description="Configure custom domains and SSL certificates"
      features={['Register custom domains', 'Manage SSL certificates', 'Configure DNS settings']}
    />
  );
}

// Settings Page
export function SettingsPage() {
  return (
    <PlaceholderPage
      title="Studio Settings"
      description="Configure your Axira Studio environment"
      features={['General settings', 'API keys and tokens', 'Notification preferences', 'Audit logging']}
    />
  );
}

// Testing Page
export function TestingPage() {
  return (
    <div className="h-full overflow-y-auto bg-gray-950">
      <div className="border-b border-gray-800 bg-gray-900 px-8 py-6">
        <h1 className="text-2xl font-semibold text-white mb-2">Testing</h1>
        <p className="text-gray-400">Test your agents and workflows before publishing</p>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-2 gap-6">
          {/* Quick Test */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-medium text-white mb-4">Quick Test</h2>
            <p className="text-sm text-gray-400 mb-4">
              Run a quick test against any agent with a custom input
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Select Agent</label>
                <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">
                  <option>Branch Banker Assistant</option>
                  <option>QA Reviewer Agent</option>
                  <option>Loan Processing Agent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Test Input</label>
                <textarea
                  rows={4}
                  placeholder="Enter your test message..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500"
                />
              </div>
              <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white transition-colors">
                Run Test
              </button>
            </div>
          </div>

          {/* Test Suites */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-medium text-white mb-4">Test Suites</h2>
            <p className="text-sm text-gray-400 mb-4">
              Create and run automated test suites
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-white">Document Check Tests</div>
                  <div className="text-xs text-gray-500">12 test cases</div>
                </div>
                <button className="px-3 py-1 bg-green-600/20 text-green-400 rounded text-xs font-medium">
                  Run
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-white">KYC Validation Tests</div>
                  <div className="text-xs text-gray-500">8 test cases</div>
                </div>
                <button className="px-3 py-1 bg-green-600/20 text-green-400 rounded text-xs font-medium">
                  Run
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-white">Loan Processing Tests</div>
                  <div className="text-xs text-gray-500">15 test cases</div>
                </div>
                <button className="px-3 py-1 bg-green-600/20 text-green-400 rounded text-xs font-medium">
                  Run
                </button>
              </div>
            </div>
            <button className="w-full mt-4 py-2 border border-dashed border-gray-600 rounded-lg text-sm text-gray-400 hover:text-white hover:border-gray-500 transition-colors">
              + Create Test Suite
            </button>
          </div>
        </div>

        {/* Recent Test Results */}
        <div className="mt-6 bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-medium text-white mb-4">Recent Test Results</h2>
          <div className="text-center py-8 text-gray-500">
            <TestIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No test results yet. Run a test to see results here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Placeholder
function PlaceholderPage({ title, description, features }: {
  title: string;
  description: string;
  features: string[];
}) {
  return (
    <div className="h-full overflow-y-auto bg-gray-950">
      <div className="border-b border-gray-800 bg-gray-900 px-8 py-6">
        <h1 className="text-2xl font-semibold text-white mb-2">{title}</h1>
        <p className="text-gray-400">{description}</p>
      </div>

      <div className="p-8">
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-6">
            <ComingSoonIcon className="w-8 h-8 text-gray-500" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-3">Coming Soon</h2>
          <p className="text-gray-400 mb-6">
            This feature is under development and will be available soon.
          </p>

          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 text-left">
            <h3 className="text-sm font-medium text-gray-400 mb-4">Planned Features</h3>
            <ul className="space-y-3">
              {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckIcon className="w-4 h-4 text-blue-400" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <Link
            to="/studio"
            className="inline-block mt-6 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium text-white transition-colors"
          >
            Back to Overview
          </Link>
        </div>
      </div>
    </div>
  );
}

// Icons
function ComingSoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function TestIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}
