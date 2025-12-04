import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@axira/shared/components';

export function AgentDesignerPage() {
  const { agentId } = useParams();

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Agent Designer</h1>
      </div>
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>
            {agentId ? `Editing Agent: ${agentId}` : 'DAG Workflow Editor'}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[600px]">
          <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground">
            ReactFlow DAG canvas will be rendered here
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
