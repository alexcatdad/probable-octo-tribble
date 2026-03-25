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
    <>
      <MatterHeader
        className="col-span-12"
        matter={matter}
        openedAt={openedAt}
        latestActivityAt={latestActivityAt}
      />

      <DocumentStatusCard
        className="col-span-12"
        document={matter.document}
        summary={reviewState.summary}
        reviewHref={`/matters/${matter.id}/review`}
      />

      <OpenIssuesStrip
        className="col-span-12"
        flaggedClauseCount={flaggedClauseCount}
        unresolvedCommentCount={reviewState.summary.unresolvedCommentCount}
        pendingDecisionCount={pendingDecisionCount}
      />

      <ActivityFeed
        className="col-span-12 lg:col-span-8"
        activity={reviewState.activity}
      />

      <div className="col-span-12 grid gap-5 lg:col-span-4">
        <AgentRunsList
          agentRuns={matter.agentRuns}
          collaborators={matter.collaborators}
        />
        <CollaboratorStrip collaborators={matter.collaborators} />
      </div>
    </>
  );
}
