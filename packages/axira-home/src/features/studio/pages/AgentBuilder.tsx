import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@axira/shared/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  choices?: Choice[];
  workflowPreview?: WorkflowPreview;
}

interface Choice {
  id: string;
  label: string;
  description?: string;
}

interface WorkflowPreview {
  name: string;
  type: 'simple' | 'complex';
  description: string;
  skills: string[];
  connectors: string[];
}

const INITIAL_MESSAGE: Message = {
  id: '1',
  role: 'assistant',
  content: "Hi! I'm here to help you build a new agent. Tell me what you'd like your agent to do, and I'll help you set it up.\n\nFor example:\n- \"Check if all required documents are present for a customer account\"\n- \"Verify KYC compliance for new account openings\"\n- \"Process loan applications and gather required information\"",
};

export function AgentBuilder() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    // Simulate AI response based on conversation stage
    setTimeout(() => {
      const stage = messages.length;
      let response: Message;

      if (stage === 1) {
        // First user message - ask about complexity
        response = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Great! I understand you want to create an agent for: "${userMessage.content}"\n\nWhat type of agent would you like to create?`,
          choices: [
            {
              id: 'simple',
              label: 'Simple Agent',
              description: 'A single Process Agent with a straightforward workflow. Best for single-purpose tasks.',
            },
            {
              id: 'complex',
              label: 'Business Agent with Workflows',
              description: 'A Business Agent that coordinates multiple Process Agents. Best for complex, multi-step operations.',
            },
          ],
        };
      } else if (stage === 3) {
        // After choosing complexity - ask about skills
        response = {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Which data sources and systems should this agent connect to?',
          choices: [
            { id: 'fis', label: 'FIS Horizon', description: 'Core banking data' },
            { id: 'sharepoint', label: 'SharePoint DMS', description: 'Document management' },
            { id: 'salesforce', label: 'Salesforce CRM', description: 'Customer records' },
            { id: 'fiserv-aml', label: 'Fiserv AML', description: 'Compliance checks' },
          ],
        };
      } else if (stage === 5) {
        // After choosing connectors - show preview
        response = {
          id: Date.now().toString(),
          role: 'assistant',
          content: "Based on your requirements, here's what I'll create:",
          workflowPreview: {
            name: 'Document Verification Agent',
            type: 'simple',
            description: 'Verifies required documents are present and valid for customer accounts',
            skills: ['doc-presence-check', 'document-validator', 'compliance-check'],
            connectors: ['FIS Horizon', 'SharePoint DMS'],
          },
        };
      } else {
        response = {
          id: Date.now().toString(),
          role: 'assistant',
          content: "I've noted that. Let me know if you'd like to adjust anything, or we can proceed with creating the agent.",
        };
      }

      setMessages((prev) => [...prev, response]);
      setIsProcessing(false);
    }, 1000);
  };

  const handleChoiceSelect = (choice: Choice) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: choice.label,
    };
    setMessages((prev) => [...prev, userMessage]);

    // Trigger next response
    setIsProcessing(true);
    setTimeout(() => {
      const stage = messages.length;
      let response: Message;

      if (stage === 2) {
        // After complexity choice
        response = {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Which data sources and systems should this agent connect to? (Select all that apply)',
          choices: [
            { id: 'fis', label: 'FIS Horizon', description: 'Core banking data' },
            { id: 'sharepoint', label: 'SharePoint DMS', description: 'Document management' },
            { id: 'salesforce', label: 'Salesforce CRM', description: 'Customer records' },
            { id: 'fiserv-aml', label: 'Fiserv AML', description: 'Compliance checks' },
          ],
        };
      } else if (stage === 4) {
        // After connector choice - show preview
        response = {
          id: Date.now().toString(),
          role: 'assistant',
          content: "Based on your requirements, here's what I'll create:",
          workflowPreview: {
            name: 'Document Verification Agent',
            type: choice.id === 'complex' ? 'complex' : 'simple',
            description: 'Verifies required documents are present and valid for customer accounts',
            skills: ['doc-presence-check', 'document-validator', 'compliance-check'],
            connectors: ['FIS Horizon', 'SharePoint DMS'],
          },
        };
      } else {
        response = {
          id: Date.now().toString(),
          role: 'assistant',
          content: "Great choice! What would you like to do next?",
        };
      }

      setMessages((prev) => [...prev, response]);
      setIsProcessing(false);
    }, 800);
  };

  const handleCreateDraft = () => {
    // Navigate to the workflow editor with the new agent
    navigate('/studio/agents/new-draft?mode=edit');
  };

  const handleOpenInEditor = () => {
    navigate('/studio/workflow-editor/new-draft');
  };

  return (
    <div className="h-full flex flex-col bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900 px-8 py-6">
        <h1 className="text-2xl font-semibold text-white mb-2">Agent Builder</h1>
        <p className="text-gray-400">
          Describe what you want your agent to do, and I'll help you build it
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onChoiceSelect={handleChoiceSelect}
              onCreateDraft={handleCreateDraft}
              onOpenInEditor={handleOpenInEditor}
            />
          ))}

          {isProcessing && (
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <BotIcon className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-800 bg-gray-900 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Describe what you want your agent to do..."
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isProcessing}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isProcessing}
              className={cn(
                'px-6 py-3 rounded-lg font-medium transition-colors',
                input.trim() && !isProcessing
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              )}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  onChoiceSelect,
  onCreateDraft,
  onOpenInEditor,
}: {
  message: Message;
  onChoiceSelect: (choice: Choice) => void;
  onCreateDraft: () => void;
  onOpenInEditor: () => void;
}) {
  if (message.role === 'user') {
    return (
      <div className="flex items-start gap-4 justify-end">
        <div className="max-w-lg bg-blue-600 rounded-2xl rounded-tr-sm px-4 py-3">
          <p className="text-white whitespace-pre-wrap">{message.content}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
          <UserIcon className="w-4 h-4 text-gray-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
        <BotIcon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 space-y-4">
        <div className="bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 max-w-lg">
          <p className="text-gray-200 whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Choices */}
        {message.choices && (
          <div className="grid grid-cols-2 gap-3 max-w-lg">
            {message.choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => onChoiceSelect(choice)}
                className="text-left p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500 rounded-xl transition-all"
              >
                <div className="font-medium text-white mb-1">{choice.label}</div>
                {choice.description && (
                  <div className="text-sm text-gray-400">{choice.description}</div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Workflow Preview */}
        {message.workflowPreview && (
          <div className="max-w-lg">
            <WorkflowPreviewCard
              preview={message.workflowPreview}
              onCreateDraft={onCreateDraft}
              onOpenInEditor={onOpenInEditor}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function WorkflowPreviewCard({
  preview,
  onCreateDraft,
  onOpenInEditor,
}: {
  preview: WorkflowPreview;
  onCreateDraft: () => void;
  onOpenInEditor: () => void;
}) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700 bg-gray-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center',
              preview.type === 'complex' ? 'bg-purple-600' : 'bg-blue-600'
            )}>
              {preview.type === 'complex' ? (
                <WorkflowIcon className="w-5 h-5 text-white" />
              ) : (
                <AgentIcon className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-white">{preview.name}</h3>
              <span className="text-xs text-gray-400 capitalize">{preview.type} Agent</span>
            </div>
          </div>
          <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded">
            Preview
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        <p className="text-sm text-gray-300">{preview.description}</p>

        {/* Skills */}
        <div>
          <div className="text-xs text-gray-500 mb-2">Skills</div>
          <div className="flex flex-wrap gap-2">
            {preview.skills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Connectors */}
        <div>
          <div className="text-xs text-gray-500 mb-2">Connectors</div>
          <div className="flex flex-wrap gap-2">
            {preview.connectors.map((connector) => (
              <span
                key={connector}
                className="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded flex items-center gap-1"
              >
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                {connector}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-700 bg-gray-900/50 flex items-center gap-3">
        <button
          onClick={onCreateDraft}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Create as Draft
        </button>
        <button
          onClick={onOpenInEditor}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <EditIcon className="w-4 h-4" />
          Open in Editor
        </button>
      </div>
    </div>
  );
}

// Icons
function BotIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" y1="16" x2="8" y2="16" />
      <line x1="16" y1="16" x2="16" y2="16" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21a8 8 0 0 0-16 0" />
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
