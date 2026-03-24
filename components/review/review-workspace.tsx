"use client";

import { ActivityPanel } from "@/components/review/activity-panel";
import { ClauseOutline } from "@/components/review/clause-outline";
import { CommentsPanel } from "@/components/review/comments-panel";
import { DocumentPane } from "@/components/review/document-pane";
import { FindingsRail } from "@/components/review/findings-rail";
import { ReviewTopbar } from "@/components/review/review-topbar";
import { useReviewDemoState } from "@/hooks/use-review-demo-state";
import type { Matter } from "@/lib/types/legal-demo";

interface ReviewWorkspaceProps {
  matter: Matter;
}

const reviewActionCopy = {
  rejectReason:
    "Fallback language should stay with the client negotiation team.",
  followUpNote: "Needs partner guidance before the redline is finalized.",
};

function selectActiveRun(agentRuns: Matter["agentRuns"]) {
  const runNeedingHumanReview = agentRuns.find(
    (run) => run.status.kind === "needs_human_review"
  );

  if (runNeedingHumanReview) {
    return runNeedingHumanReview;
  }

  return [...agentRuns].sort(
    (left, right) => Date.parse(right.startedAt) - Date.parse(left.startedAt)
  )[0];
}

export function ReviewWorkspace({ matter }: ReviewWorkspaceProps) {
  const review = useReviewDemoState(matter);
  const activeRun = selectActiveRun(matter.agentRuns);

  return (
    <main className="space-y-5 pb-10">
      <ReviewTopbar
        matter={matter}
        activeRun={activeRun}
        summary={review.summary}
        pendingDecisionCount={review.pendingDecisionCount}
        progressPercent={review.progressPercent}
        reviewProgressLabel={review.reviewProgressLabel}
      />

      <section className="grid gap-5 xl:grid-cols-[260px_minmax(0,1.15fr)_390px] xl:items-start">
        <ClauseOutline
          document={review.state.document}
          selectedClauseId={review.state.selectedClauseId}
          clauseFindingCounts={review.clauseFindingCounts}
          clauseCommentCounts={review.clauseCommentCounts}
          onSelectClause={review.selectClause}
        />

        <div className="space-y-5">
          <DocumentPane
            document={review.state.document}
            findings={review.findings}
            selectedClauseId={review.state.selectedClauseId}
            selectedFindingId={review.state.selectedFindingId}
            onSelectClause={review.selectClause}
          />

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.02fr)_minmax(300px,0.98fr)]">
            <CommentsPanel
              key={review.selectedClause?.id ?? "no-active-clause"}
              clause={review.selectedClause}
              comments={review.selectedClauseComments}
              onAddComment={review.addComment}
            />
            <ActivityPanel
              clause={review.selectedClause}
              activity={review.selectedClauseActivity}
            />
          </div>
        </div>

        <FindingsRail
          findings={review.findings}
          document={review.state.document}
          selectedFindingId={review.state.selectedFindingId}
          selectedFinding={review.selectedFinding}
          onSelectFinding={review.selectFinding}
          onAcceptSuggestion={review.acceptSuggestion}
          onRejectSuggestion={(findingId) =>
            review.rejectSuggestion(findingId, reviewActionCopy.rejectReason)
          }
          onMarkNeedsFollowUp={(findingId) =>
            review.markNeedsFollowUp(findingId, reviewActionCopy.followUpNote)
          }
        />
      </section>
    </main>
  );
}
