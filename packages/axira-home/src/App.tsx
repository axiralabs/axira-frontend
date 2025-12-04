import { Routes, Route } from 'react-router-dom';
import { TopNavLayout } from './components/layout/TopNavLayout';
import { HomePageWithPersonaSwitcher } from './features/home/RoleBasedHome';
import { BranchManagerHomePage } from './features/home/BranchManagerHomePage';
import { QAReviewerHomePage } from './features/home/QAReviewerHomePage';
import { GuardianPage } from './features/guardian';
import { WorkPage } from './features/work/WorkPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { ChatProvider } from './features/chat/context';
import { ChatSlideOver, ChatBubble } from './features/chat/components';

// Studio imports
import {
  StudioLayout,
  StudioOverview,
  AgentCatalog,
  AgentDetail,
  AgentBuilder,
  ConnectorConfigPage,
  WorkflowEditor,
  UsersPage,
  DomainsPage,
  SettingsPage,
  TestingPage,
} from './features/studio';

export function App() {
  return (
    <ChatProvider>
      <Routes>
        {/* Main App Routes */}
        <Route path="/" element={<TopNavLayout />}>
          {/* Home page with role-based switching and persona selector */}
          <Route index element={<HomePageWithPersonaSwitcher />} />

          {/* Direct access to specific home pages for testing */}
          <Route path="qa" element={<QAReviewerHomePage />} />
          <Route path="manager" element={<BranchManagerHomePage />} />

          {/* Other routes */}
          <Route path="pulse" element={<GuardianPage />} />
          <Route path="work" element={<WorkPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>

        {/* Studio Routes */}
        <Route path="/studio" element={<StudioLayout />}>
          <Route index element={<StudioOverview />} />
          <Route path="agents" element={<AgentCatalog />} />
          <Route path="agents/:agentId" element={<AgentDetail />} />
          <Route path="agent-builder" element={<AgentBuilder />} />
          <Route path="connectors" element={<ConnectorConfigPage />} />
          <Route path="connectors/:connectorId" element={<ConnectorConfigPage />} />
          <Route path="testing" element={<TestingPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="domains" element={<DomainsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Workflow Editor has its own full-screen layout - opens for editing Process Agent workflows */}
        <Route path="/studio/workflow-editor/:agentId" element={<WorkflowEditor />} />
      </Routes>

      {/* Global Chat Components */}
      <ChatBubble />
      <ChatSlideOver />
    </ChatProvider>
  );
}
