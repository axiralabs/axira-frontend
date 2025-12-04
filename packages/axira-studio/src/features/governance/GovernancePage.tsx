import { Card, CardContent, CardHeader, CardTitle } from '@axira/shared/components';
import { Badge } from '@axira/shared/components';

const mockPendingApprovals = [
  { id: '1', name: 'QA Reviewer Agent v2.0', type: 'Process Agent', submittedBy: 'maya-chen', status: 'pending' },
  { id: '2', name: 'Doc Presence Check v1.1', type: 'Skill', submittedBy: 'carlos-m', status: 'pending' },
];

export function GovernancePage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Governance Queue</h1>
        <p className="text-muted-foreground">
          Review and approve workflow changes
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          {mockPendingApprovals.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No pending approvals
            </p>
          ) : (
            <div className="space-y-4">
              {mockPendingApprovals.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.type} - Submitted by {item.submittedBy}
                    </p>
                  </div>
                  <Badge variant="warning">Pending Review</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
