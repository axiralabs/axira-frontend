import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@axira/shared/components';
import type { AgentOption } from '../types';

interface AgentSelectorProps {
  agents: AgentOption[];
  selectedAgent: AgentOption;
  onSelect: (agent: AgentOption) => void;
  disabled?: boolean;
}

export function AgentSelector({
  agents,
  selectedAgent,
  onSelect,
  disabled = false,
}: AgentSelectorProps) {
  const handleValueChange = (value: string) => {
    const agent = agents.find((a) => a.key === value);
    if (agent) {
      onSelect(agent);
    }
  };

  return (
    <Select value={selectedAgent.key} onValueChange={handleValueChange} disabled={disabled}>
      <SelectTrigger className="w-[240px]" aria-label="Select agent">
        <div className="flex items-center gap-2">
          <AgentIcon className="h-4 w-4 text-muted-foreground" />
          <SelectValue placeholder="Select agent" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {agents.map((agent) => (
          <SelectItem key={agent.key} value={agent.key}>
            <div className="flex flex-col">
              <span className="font-medium">{agent.name}</span>
              {agent.description && (
                <span className="text-xs text-muted-foreground">{agent.description}</span>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function AgentIcon({ className }: { className?: string }) {
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
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}
