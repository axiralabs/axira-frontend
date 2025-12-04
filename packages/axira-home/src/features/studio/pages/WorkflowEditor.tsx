import { useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { cn } from '@axira/shared/utils';
import { WorkflowCanvas } from '../../build/components/WorkflowCanvas';
import { NodePalette } from '../../build/components/NodePalette';
import { PropertiesPanel } from '../../build/components/PropertiesPanel';
import { useWorkflowBuilder } from '../../build/hooks/useWorkflowBuilder';
import type { WorkflowNode, Workflow } from '../../build/types';

// Sample workflow for demo
const SAMPLE_WORKFLOW: Workflow = {
  id: 'sample-workflow',
  nodes: [
    { id: 'start', type: 'start', label: 'Start', position: { x: 100, y: 200 } },
    { id: 'fetch-docs', type: 'skill', label: 'Fetch Documents', description: 'SharePoint DMS', position: { x: 300, y: 200 } },
    { id: 'check-presence', type: 'skill', label: 'Check Presence', description: 'Document Validator', position: { x: 500, y: 200 } },
    { id: 'condition', type: 'condition', label: 'All Present?', condition: 'result.all_present == true', position: { x: 700, y: 200 } },
    { id: 'pass-output', type: 'end', label: 'Pass', description: 'All documents present', position: { x: 900, y: 120 }, data: { endType: 'success' } },
    { id: 'fail-output', type: 'end', label: 'Missing Docs', description: 'List missing documents', position: { x: 900, y: 280 }, data: { endType: 'failure' } },
  ],
  edges: [
    { id: 'e1', source: 'start', target: 'fetch-docs' },
    { id: 'e2', source: 'fetch-docs', target: 'check-presence' },
    { id: 'e3', source: 'check-presence', target: 'condition' },
    { id: 'e4', source: 'condition', target: 'pass-output', label: 'True', type: 'conditional' },
    { id: 'e5', source: 'condition', target: 'fail-output', label: 'False', type: 'conditional' },
  ],
};

// Empty workflow for new agents
const EMPTY_WORKFLOW: Workflow = {
  id: 'new-workflow',
  nodes: [
    { id: 'start', type: 'start', label: 'Start', position: { x: 100, y: 200 }, data: { triggerType: 'manual' } },
  ],
  edges: [],
};

// Mock process agent data
const MOCK_PROCESS_AGENTS: Record<string, { id: string; name: string; description: string; parentBA?: string; workflow: Workflow }> = {
  'pa-doc-check': {
    id: 'pa-doc-check',
    name: 'Document Presence Check',
    description: 'Verifies required documents are present and valid for customer accounts',
    parentBA: 'Branch Banker Assistant',
    workflow: SAMPLE_WORKFLOW,
  },
  'pa-kyc-verify': {
    id: 'pa-kyc-verify',
    name: 'KYC Verification',
    description: 'Performs Know Your Customer verification checks including sanctions screening',
    parentBA: 'Branch Banker Assistant',
    workflow: SAMPLE_WORKFLOW,
  },
  'new-draft': {
    id: 'new-draft',
    name: 'New Process Agent',
    description: 'Configure this new process agent',
    workflow: EMPTY_WORKFLOW,
  },
};

export function WorkflowEditor() {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();

  const processAgent = agentId ? MOCK_PROCESS_AGENTS[agentId] : null;
  const initialWorkflow = processAgent?.workflow || EMPTY_WORKFLOW;

  // Use the workflow builder hook for state management
  const {
    workflow,
    selectedNodeId,
    isDirty,
    addNode,
    updateNode,
    deleteNode,
    duplicateNode,
    selectNode,
    undo,
    redo,
    markClean,
    history,
    historyIndex,
  } = useWorkflowBuilder(initialWorkflow);

  // Get selected node from workflow
  const selectedNode = workflow.nodes.find(n => n.id === selectedNodeId);

  // State for agent metadata
  const [agentName, setAgentName] = useState(processAgent?.name || 'New Process Agent');
  const [agentDescription, setAgentDescription] = useState(processAgent?.description || '');

  const handleNodeSelect = useCallback((node: WorkflowNode | null) => {
    selectNode(node?.id || null);
  }, [selectNode]);

  const handleNodeUpdate = useCallback((node: WorkflowNode) => {
    updateNode(node.id, node);
  }, [updateNode]);

  const handleNodeDelete = useCallback((nodeId: string) => {
    deleteNode(nodeId);
  }, [deleteNode]);

  const handleNodeDuplicate = useCallback((nodeId: string) => {
    duplicateNode(nodeId);
  }, [duplicateNode]);

  const handleSave = useCallback(() => {
    // TODO: Save workflow to backend
    console.log('Saving workflow:', {
      name: agentName,
      description: agentDescription,
      workflow,
    });
    markClean();

    // Show success toast (in real app)
    alert('Workflow saved successfully!');
  }, [agentName, agentDescription, workflow, markClean]);

  const handlePublish = useCallback(() => {
    // TODO: Publish workflow
    console.log('Publishing workflow:', {
      name: agentName,
      description: agentDescription,
      workflow,
    });

    // Show success toast (in real app)
    alert('Workflow submitted for review!');
  }, [agentName, agentDescription, workflow]);

  const handleBack = useCallback(() => {
    if (isDirty) {
      if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate('/studio/agents');
      }
    } else {
      navigate('/studio/agents');
    }
  }, [isDirty, navigate]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  if (!processAgent && agentId !== 'new-draft') {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Process Agent Not Found</h2>
          <p className="text-gray-400 mb-4">The process agent you're looking for doesn't exist.</p>
          <Link
            to="/studio/agents"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white transition-colors"
          >
            Back to Agents
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-950">
      {/* Header */}
      <div className="h-14 border-b border-gray-800 flex items-center justify-between px-4 bg-gray-900">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            title="Back to Agents"
          >
            <BackIcon className="w-5 h-5 text-gray-400" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
              <WorkflowIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="bg-transparent font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 -ml-1"
                />
                {isDirty && (
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs">
                    Unsaved
                  </span>
                )}
              </div>
              {processAgent?.parentBA && (
                <span className="text-xs text-gray-500">Part of {processAgent.parentBA}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 text-sm text-gray-300 hover:text-white transition-colors">
            Test
          </button>

          <button className="px-3 py-1.5 text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-1">
            <HistoryIcon className="w-4 h-4" />
            History
          </button>

          <div className="h-6 w-px bg-gray-700" />

          <button
            onClick={handleSave}
            disabled={!isDirty}
            className={cn(
              'px-4 py-1.5 rounded-lg text-sm font-medium transition-colors',
              isDirty
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            )}
          >
            Save Draft
          </button>

          <button
            onClick={handlePublish}
            className="px-4 py-1.5 bg-white text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Publish
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Node Palette */}
        <div className="w-52 border-r border-gray-800 overflow-hidden">
          <NodePalette />
        </div>

        {/* Center - Workflow Canvas */}
        <div className="flex-1 relative">
          <WorkflowCanvas
            workflow={workflow}
            onNodeAdd={addNode}
            onNodeSelect={handleNodeSelect}
            selectedNodeId={selectedNodeId}
          />

          {/* Canvas Info */}
          <div className="absolute top-4 left-4 bg-gray-900/90 backdrop-blur rounded-lg px-3 py-2 border border-gray-800">
            <div className="text-xs text-gray-400">
              <span className="text-white font-medium">{workflow.nodes.length}</span> nodes
              <span className="mx-2">•</span>
              <span className="text-white font-medium">{workflow.edges.length}</span> connections
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-gray-800 rounded-full px-2 py-1 shadow-lg">
            <button className="p-2 hover:bg-gray-700 rounded-full transition-colors" title="Pan">
              <HandIcon className="w-5 h-5 text-gray-300" />
            </button>
            <button className="p-2 hover:bg-gray-700 rounded-full transition-colors" title="Select">
              <CursorIcon className="w-5 h-5 text-gray-300" />
            </button>
            <div className="h-5 w-px bg-gray-600" />
            <button
              onClick={undo}
              disabled={!canUndo}
              className={cn(
                'p-2 rounded-full transition-colors',
                canUndo ? 'hover:bg-gray-700' : 'opacity-50 cursor-not-allowed'
              )}
              title="Undo"
            >
              <UndoIcon className="w-5 h-5 text-gray-300" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className={cn(
                'p-2 rounded-full transition-colors',
                canRedo ? 'hover:bg-gray-700' : 'opacity-50 cursor-not-allowed'
              )}
              title="Redo"
            >
              <RedoIcon className="w-5 h-5 text-gray-300" />
            </button>
            <div className="h-5 w-px bg-gray-600" />
            <button className="p-2 hover:bg-gray-700 rounded-full transition-colors" title="Zoom to Fit">
              <ZoomFitIcon className="w-5 h-5 text-gray-300" />
            </button>
          </div>
        </div>

        {/* Right Sidebar - Properties Panel */}
        <div className="w-80 border-l border-gray-800 flex flex-col overflow-hidden">
          {selectedNode ? (
            <PropertiesPanel
              selectedNode={selectedNode}
              onNodeUpdate={handleNodeUpdate}
              onNodeDelete={handleNodeDelete}
              onNodeDuplicate={handleNodeDuplicate}
            />
          ) : (
            <AgentInfoPanel
              name={agentName}
              description={agentDescription}
              onDescriptionChange={setAgentDescription}
              parentBA={processAgent?.parentBA}
              workflow={workflow}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function AgentInfoPanel({
  name,
  description,
  onDescriptionChange,
  parentBA,
  workflow,
}: {
  name: string;
  description: string;
  onDescriptionChange: (desc: string) => void;
  parentBA?: string;
  workflow: Workflow;
}) {
  const skillNodes = workflow.nodes.filter((n) => n.type === 'skill');
  const conditionNodes = workflow.nodes.filter((n) => n.type === 'condition');
  const guardrailNodes = workflow.nodes.filter((n) => n.type === 'guardrails');

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-sm font-medium text-gray-400 mb-1">Process Agent</h2>
        <h3 className="text-lg font-semibold text-white">{name}</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Description */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Describe what this process agent does..."
            rows={3}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Parent BA */}
        {parentBA && (
          <div>
            <label className="block text-sm text-gray-400 mb-2">Parent Business Agent</label>
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg">
              <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
                <AgentIcon className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm text-white">{parentBA}</span>
            </div>
          </div>
        )}

        {/* Workflow Summary */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Workflow Summary</label>
          <div className="space-y-2">
            <div className="flex items-center justify-between px-3 py-2 bg-gray-800 rounded-lg">
              <span className="text-sm text-gray-300">Skills Used</span>
              <span className="text-sm font-medium text-white">{skillNodes.length}</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2 bg-gray-800 rounded-lg">
              <span className="text-sm text-gray-300">Decision Points</span>
              <span className="text-sm font-medium text-white">{conditionNodes.length}</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2 bg-gray-800 rounded-lg">
              <span className="text-sm text-gray-300">Guardrails</span>
              <span className="text-sm font-medium text-white">{guardrailNodes.length}</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2 bg-gray-800 rounded-lg">
              <span className="text-sm text-gray-300">Total Nodes</span>
              <span className="text-sm font-medium text-white">{workflow.nodes.length}</span>
            </div>
          </div>
        </div>

        {/* Skills */}
        {skillNodes.length > 0 && (
          <div>
            <label className="block text-sm text-gray-400 mb-2">Skills in Workflow</label>
            <div className="space-y-2">
              {skillNodes.map((node) => (
                <div key={node.id} className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg">
                  <div className="w-6 h-6 rounded bg-green-600 flex items-center justify-center">
                    <SkillIcon className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">{node.label}</div>
                    {node.description && (
                      <div className="text-xs text-gray-500 truncate">{node.description}</div>
                    )}
                  </div>
                  <span className="w-2 h-2 bg-green-500 rounded-full" title="Healthy" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Tips */}
        <div className="p-3 bg-blue-900/20 border border-blue-800/50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-400 mb-2">Quick Tips</h4>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Drag nodes from the left palette onto the canvas</li>
            <li>• Click a node to configure its properties</li>
            <li>• Connect nodes by dragging from output to input handles</li>
            <li>• Use Cmd+Z / Cmd+Shift+Z to undo/redo</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 space-y-2">
        <button className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium text-white transition-colors flex items-center justify-center gap-2">
          <TestIcon className="w-4 h-4" />
          Test Workflow
        </button>
        <button className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2">
          <CodeIcon className="w-4 h-4" />
          View as Code
        </button>
      </div>
    </div>
  );
}

// Icons
function BackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
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

function HistoryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function HandIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
      <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
      <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  );
}

function CursorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
    </svg>
  );
}

function UndoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 7v6h6" />
      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
    </svg>
  );
}

function RedoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 7v6h-6" />
      <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
    </svg>
  );
}

function ZoomFitIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
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

function SkillIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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

function CodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
