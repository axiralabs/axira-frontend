import { useEffect } from 'react';
import {
  SlideOver,
  SlideOverContent,
  SlideOverHeader,
  SlideOverTitle,
  SlideOverDescription,
  SlideOverClose,
  SlideOverBody,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Button,
  Skeleton,
  Badge,
} from '@axira/shared/components';
import { cn } from '@axira/shared/utils';
import { useEvidencePack } from '../hooks/useEvidencePack';
import type { EvidenceNode, EvidenceEdge, HashChainEntry } from '../types';

interface EvidenceSlideOverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evidencePackId: string | null;
}

export function EvidenceSlideOver({
  open,
  onOpenChange,
  evidencePackId,
}: EvidenceSlideOverProps) {
  const {
    evidencePack,
    hashChain,
    verification,
    isLoading,
    isLoadingHashChain,
    isVerifying,
    error,
    loadHashChain,
    verifyChain,
    reset,
  } = useEvidencePack({
    packId: open ? evidencePackId : null,
    autoLoad: true,
  });

  // Reset when closed
  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <SlideOver open={open} onOpenChange={onOpenChange}>
      <SlideOverContent side="right" size="xl">
        <SlideOverHeader>
          <div className="flex items-center justify-between">
            <div>
              <SlideOverTitle>Evidence Pack</SlideOverTitle>
              <SlideOverDescription>
                {evidencePackId ? `ID: ${evidencePackId.slice(0, 8)}...` : 'No evidence selected'}
              </SlideOverDescription>
            </div>
            <SlideOverClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <XIcon className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </SlideOverClose>
          </div>
        </SlideOverHeader>

        <SlideOverBody className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : error ? (
            <div className="p-4">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-sm text-destructive">{error.message}</p>
              </div>
            </div>
          ) : evidencePack ? (
            <Tabs defaultValue="summary" className="h-full flex flex-col">
              <TabsList className="w-full justify-start rounded-none border-b px-4 h-12">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="inputs">Inputs</TabsTrigger>
                <TabsTrigger value="decisions">Decisions</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="audit">Audit Trail</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto">
                <TabsContent value="summary" className="p-4 mt-0">
                  <EvidenceSummaryTab pack={evidencePack} />
                </TabsContent>

                <TabsContent value="inputs" className="p-4 mt-0">
                  <EvidenceInputsTab nodes={evidencePack.nodes} />
                </TabsContent>

                <TabsContent value="decisions" className="p-4 mt-0">
                  <EvidenceDecisionsTab nodes={evidencePack.nodes} edges={evidencePack.edges} />
                </TabsContent>

                <TabsContent value="timeline" className="p-4 mt-0">
                  <EvidenceTimelineTab nodes={evidencePack.nodes} />
                </TabsContent>

                <TabsContent value="audit" className="p-4 mt-0">
                  <HashChainTab
                    hashChain={hashChain}
                    verification={verification}
                    isLoading={isLoadingHashChain}
                    isVerifying={isVerifying}
                    onLoadChain={loadHashChain}
                    onVerify={verifyChain}
                  />
                </TabsContent>
              </div>
            </Tabs>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              <p>No evidence pack loaded</p>
            </div>
          )}
        </SlideOverBody>
      </SlideOverContent>
    </SlideOver>
  );
}

// Summary Tab
function EvidenceSummaryTab({ pack }: { pack: NonNullable<ReturnType<typeof useEvidencePack>['evidencePack']> }) {
  const outcome = pack.pack.outcome;

  return (
    <div className="space-y-6">
      {/* Outcome */}
      {outcome && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Outcome</h3>
          <div className={cn(
            'p-4 rounded-lg border',
            outcome.status === 'PASS' && 'bg-green-50 border-green-200',
            outcome.status === 'WARNING' && 'bg-yellow-50 border-yellow-200',
            outcome.status === 'FAIL' && 'bg-red-50 border-red-200',
          )}>
            <div className="flex items-center gap-2">
              <StatusIcon status={outcome.status} />
              <span className="font-medium">{outcome.status}</span>
            </div>
            {outcome.summaryMessage && (
              <p className="mt-2 text-sm">{outcome.summaryMessage}</p>
            )}
            <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
              {outcome.exceptionCount !== undefined && (
                <span>Exceptions: {outcome.exceptionCount}</span>
              )}
              {outcome.warningCount !== undefined && (
                <span>Warnings: {outcome.warningCount}</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Subject */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Subject</h3>
        <div className="bg-muted/50 p-3 rounded-lg">
          <p className="text-sm">
            <span className="text-muted-foreground">Type:</span> {pack.pack.subject.subjectType}
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">ID:</span> {pack.pack.subject.subjectId}
          </p>
        </div>
      </div>

      {/* Metadata */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Details</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Created:</span>{' '}
            {new Date(pack.pack.createdAt).toLocaleString()}
          </div>
          <div>
            <span className="text-muted-foreground">Finalized:</span>{' '}
            {pack.pack.finalized ? 'Yes' : 'No'}
          </div>
          <div>
            <span className="text-muted-foreground">Total Nodes:</span> {pack.totalNodes}
          </div>
          <div>
            <span className="text-muted-foreground">Total Edges:</span> {pack.totalEdges}
          </div>
        </div>
      </div>
    </div>
  );
}

// Inputs Tab
function EvidenceInputsTab({ nodes }: { nodes: EvidenceNode[] }) {
  const inputNodes = nodes.filter(
    (n) => n.evidenceType === 'SEARCH_RESULT' || n.evidenceType === 'SYSTEM_EVENT'
  );

  if (!inputNodes.length) {
    return <EmptyState message="No input evidence found" />;
  }

  return (
    <div className="space-y-3">
      {inputNodes.map((node) => (
        <EvidenceNodeCard key={node.id} node={node} />
      ))}
    </div>
  );
}

// Decisions Tab
function EvidenceDecisionsTab({ nodes, edges }: { nodes: EvidenceNode[]; edges: EvidenceEdge[] }) {
  const decisionNodes = nodes.filter(
    (n) => n.evidenceType === 'POLICY_DECISION' || n.evidenceType === 'SKILL_EXECUTION'
  );

  if (!decisionNodes.length) {
    return <EmptyState message="No decision evidence found" />;
  }

  return (
    <div className="space-y-3">
      {decisionNodes.map((node) => (
        <EvidenceNodeCard key={node.id} node={node} showAttributes />
      ))}
    </div>
  );
}

// Timeline Tab
function EvidenceTimelineTab({ nodes }: { nodes: EvidenceNode[] }) {
  const sortedNodes = [...nodes].sort((a, b) => {
    const dateA = new Date(a.occurredAt || a.recordedAt).getTime();
    const dateB = new Date(b.occurredAt || b.recordedAt).getTime();
    return dateA - dateB;
  });

  if (!sortedNodes.length) {
    return <EmptyState message="No timeline events found" />;
  }

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
      <div className="space-y-4">
        {sortedNodes.map((node, index) => (
          <div key={node.id} className="relative pl-10">
            <div className="absolute left-2.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs">
                  {node.evidenceType}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(node.occurredAt || node.recordedAt).toLocaleTimeString()}
                </span>
              </div>
              {node.description && (
                <p className="text-sm">{node.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Hash Chain Tab
function HashChainTab({
  hashChain,
  verification,
  isLoading,
  isVerifying,
  onLoadChain,
  onVerify,
}: {
  hashChain: HashChainEntry[];
  verification: ReturnType<typeof useEvidencePack>['verification'];
  isLoading: boolean;
  isVerifying: boolean;
  onLoadChain: () => void;
  onVerify: () => void;
}) {
  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onLoadChain}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Load Hash Chain'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onVerify}
          disabled={isVerifying || !hashChain.length}
        >
          {isVerifying ? 'Verifying...' : 'Verify Integrity'}
        </Button>
      </div>

      {/* Verification Result */}
      {verification && (
        <div className={cn(
          'p-4 rounded-lg border',
          verification.valid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        )}>
          <div className="flex items-center gap-2">
            {verification.valid ? (
              <CheckIcon className="h-5 w-5 text-green-600" />
            ) : (
              <XIcon className="h-5 w-5 text-red-600" />
            )}
            <span className="font-medium">
              {verification.valid ? 'Chain Verified' : 'Verification Failed'}
            </span>
          </div>
          <p className="text-sm mt-1">
            Chain length: {verification.chainLength}
          </p>
          {verification.errorMessage && (
            <p className="text-sm text-red-600 mt-1">{verification.errorMessage}</p>
          )}
        </div>
      )}

      {/* Hash Chain Entries */}
      {hashChain.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Hash Chain Entries</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {hashChain.map((entry) => (
              <div key={entry.sequenceNumber} className="bg-muted/50 p-3 rounded-lg text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seq #{entry.sequenceNumber}</span>
                  <span className="text-muted-foreground">
                    {new Date(entry.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="mt-2 space-y-1">
                  <p className="truncate">
                    <span className="text-muted-foreground">Hash:</span> {entry.hash}
                  </p>
                  <p className="truncate">
                    <span className="text-muted-foreground">Prev:</span> {entry.previousHash}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!hashChain.length && !isLoading && (
        <EmptyState message="Click 'Load Hash Chain' to view audit entries" />
      )}
    </div>
  );
}

// Helper Components
function EvidenceNodeCard({ node, showAttributes }: { node: EvidenceNode; showAttributes?: boolean }) {
  return (
    <div className="bg-muted/50 p-3 rounded-lg">
      <div className="flex items-center gap-2 mb-1">
        <Badge variant="outline" className="text-xs">
          {node.evidenceType}
        </Badge>
        {node.sourceSystem && (
          <span className="text-xs text-muted-foreground">{node.sourceSystem}</span>
        )}
      </div>
      {node.description && (
        <p className="text-sm">{node.description}</p>
      )}
      {showAttributes && node.attributes && Object.keys(node.attributes).length > 0 && (
        <div className="mt-2 text-xs bg-background/50 p-2 rounded">
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(node.attributes, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center text-muted-foreground py-8">
      <p>{message}</p>
    </div>
  );
}

function StatusIcon({ status }: { status: 'PASS' | 'WARNING' | 'FAIL' }) {
  const className = 'h-5 w-5';
  switch (status) {
    case 'PASS':
      return <CheckIcon className={cn(className, 'text-green-600')} />;
    case 'WARNING':
      return <AlertIcon className={cn(className, 'text-yellow-600')} />;
    case 'FAIL':
      return <XIcon className={cn(className, 'text-red-600')} />;
  }
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 9v4M12 17h.01" />
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
