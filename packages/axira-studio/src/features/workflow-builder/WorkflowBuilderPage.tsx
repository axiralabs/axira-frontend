import { Card, CardContent, CardHeader, CardTitle } from '@axira/shared/components';

export function WorkflowBuilderPage() {
  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Workflow Builder</h1>
        <p className="text-muted-foreground">
          Describe your workflow in natural language
        </p>
      </div>
      <div className="grid flex-1 gap-6 lg:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Conversation</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Conversational interface for building workflows
            </div>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Workflow preview will appear here
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
