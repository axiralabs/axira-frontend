import { Card, CardContent, CardHeader, CardTitle } from '@axira/shared/components';

export function WorkQueuePage() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold">Work Queue</h1>
      <Card>
        <CardHeader>
          <CardTitle>Pending Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            No items in queue
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
