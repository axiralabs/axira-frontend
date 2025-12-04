import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@axira/shared/components';
import { Badge } from '@axira/shared/components';

const mockSkills = [
  { id: '1', name: 'Document Presence Check', category: 'Validation', version: '1.0.0' },
  { id: '2', name: 'KYC Verification', category: 'Compliance', version: '2.1.0' },
  { id: '3', name: 'Account Balance Lookup', category: 'Banking', version: '1.2.0' },
  { id: '4', name: 'Transaction History', category: 'Banking', version: '1.0.0' },
];

export function SkillCatalogPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Skill Catalog</h1>
        <p className="text-muted-foreground">
          Browse and manage available skills
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockSkills.map((skill) => (
          <Card key={skill.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{skill.name}</CardTitle>
                <Badge variant="secondary">{skill.version}</Badge>
              </div>
              <CardDescription>{skill.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Click to view skill details and configuration
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
