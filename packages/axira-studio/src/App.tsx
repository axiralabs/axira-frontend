import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { AgentDesignerPage } from './features/agent-designer/AgentDesignerPage';
import { WorkflowBuilderPage } from './features/workflow-builder/WorkflowBuilderPage';
import { SkillCatalogPage } from './features/skill-catalog/SkillCatalogPage';
import { GovernancePage } from './features/governance/GovernancePage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/agents" replace />} />
        <Route path="agents" element={<AgentDesignerPage />} />
        <Route path="agents/:agentId" element={<AgentDesignerPage />} />
        <Route path="workflow-builder" element={<WorkflowBuilderPage />} />
        <Route path="skills" element={<SkillCatalogPage />} />
        <Route path="governance" element={<GovernancePage />} />
      </Route>
    </Routes>
  );
}
