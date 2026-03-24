import { notFound } from "next/navigation";
import { seedMatter, seedReviewState } from "@/lib/demo-data/matter";
import { ActivityFeed } from "@/components/matter/activity-feed";
import { AgentRunsList } from "@/components/matter/agent-runs-list";
import { CollaboratorStrip } from "@/components/matter/collaborator-strip";
import { DocumentStatusCard } from "@/components/matter/document-status-card";
import { MatterHeader } from "@/components/matter/matter-header";
import { OpenIssuesStrip } from "@/components/matter/open-issues-strip";

interface MatterOverviewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MatterOverviewPage({
  params,
}: MatterOverviewPageProps) {
  const { id } = await params;

  if (id !== seedMatter.id) {
    notFound();
  }

  const flaggedClauseCount = new Set(
    seedMatter.findings.map((finding) => finding.clauseId)
  ).size;
  const pendingDecisionCount =
    seedReviewState.summary.totalFindings - seedReviewState.summary.reviewedCount;
  const openedAt = seedMatter.activity[0]?.occurredAt ?? seedMatter.agentRuns[0]?.startedAt;
  const latestActivityAt =
    seedReviewState.activity[seedReviewState.activity.length - 1]?.occurredAt ??
    openedAt;

  return (
    <main className="space-y-6 pb-10">
      <MatterHeader
        matter={seedMatter}
        openedAt={openedAt}
        latestActivityAt={latestActivityAt}
      />

      <OpenIssuesStrip
        flaggedClauseCount={flaggedClauseCount}
        unresolvedCommentCount={seedReviewState.summary.unresolvedCommentCount}
        pendingDecisionCount={pendingDecisionCount}
      />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.9fr)]">
        <div className="space-y-5">
          <DocumentStatusCard
            document={seedMatter.document}
            summary={seedReviewState.summary}
            reviewHref={`/matters/${seedMatter.id}/review`}
          />
          <ActivityFeed activity={seedReviewState.activity} />
        </div>

        <aside className="space-y-5">
          <AgentRunsList
            agentRuns={seedMatter.agentRuns}
            collaborators={seedMatter.collaborators}
          />
          <CollaboratorStrip collaborators={seedMatter.collaborators} />
        </aside>
      </section>
    </main>
  );
}
