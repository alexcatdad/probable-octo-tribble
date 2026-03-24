"use client";

import { useSyncExternalStore } from "react";
import {
  readPersistedReviewDemoState,
  subscribeToReviewDemoState,
} from "@/hooks/use-review-demo-state";
import type { ReviewState } from "@/lib/review-state";
import type { Matter } from "@/lib/types/legal-demo";
import { ActivityFeed } from "@/components/matter/activity-feed";
import { AgentRunsList } from "@/components/matter/agent-runs-list";
import { CollaboratorStrip } from "@/components/matter/collaborator-strip";
import { DocumentStatusCard } from "@/components/matter/document-status-card";
import { MatterHeader } from "@/components/matter/matter-header";
import { OpenIssuesStrip } from "@/components/matter/open-issues-strip";

interface MatterOverviewShellProps {
  matter: Matter;
  initialReviewState: ReviewState;
}

export function MatterOverviewShell({
  matter,
  initialReviewState,
}: MatterOverviewShellProps) {
  const reviewState = useSyncExternalStore(
    (onStoreChange) => subscribeToReviewDemoState(matter.id, onStoreChange),
    () => readPersistedReviewDemoState(matter.id) ?? initialReviewState,
    () => initialReviewState
  );

  const flaggedClauseCount = new Set(
    matter.findings.map((finding) => finding.clauseId)
  ).size;
  const pendingDecisionCount =
    reviewState.summary.totalFindings - reviewState.summary.reviewedCount;
  const openedAt =
    matter.activity[0]?.occurredAt ?? matter.agentRuns[0]?.startedAt;
  const latestActivityAt =
    reviewState.activity[reviewState.activity.length - 1]?.occurredAt ?? openedAt;

  return (
    <main className="space-y-6 pb-10">
      <MatterHeader
        matter={matter}
        openedAt={openedAt}
        latestActivityAt={latestActivityAt}
      />

      <OpenIssuesStrip
        flaggedClauseCount={flaggedClauseCount}
        unresolvedCommentCount={reviewState.summary.unresolvedCommentCount}
        pendingDecisionCount={pendingDecisionCount}
      />

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(295px,0.92fr)] lg:items-start">
        <div className="lg:col-span-2">
          <DocumentStatusCard
            document={matter.document}
            summary={reviewState.summary}
            reviewHref={`/matters/${matter.id}/review`}
          />
        </div>

        <div className="space-y-5">
          <ActivityFeed activity={reviewState.activity} />
        </div>

        <aside className="space-y-5">
          <AgentRunsList
            agentRuns={matter.agentRuns}
            collaborators={matter.collaborators}
          />
          <CollaboratorStrip collaborators={matter.collaborators} />
        </aside>
      </section>
    </main>
  );
}
