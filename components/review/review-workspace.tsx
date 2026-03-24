"use client";

import { useState } from "react";
import { ActivityPanel } from "@/components/review/activity-panel";
import { ClauseOutline } from "@/components/review/clause-outline";
import { CommentsPanel } from "@/components/review/comments-panel";
import {
  DocumentPane,
  type DocumentReviewMode,
} from "@/components/review/document-pane";
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
  const [documentViewMode, setDocumentViewMode] =
    useState<DocumentReviewMode>("clean");
  const [preview, setPreview] = useState<{
    clauseId: string | null;
    findingId: string | null;
    source: "queue" | "document" | null;
  }>({
    clauseId: null,
    findingId: null,
    source: null,
  });

  const findingById = Object.fromEntries(
    review.findings.map((finding) => [finding.id, finding])
  );
  const firstFindingByClause = Object.fromEntries(
    review.findings.map((finding) => [finding.clauseId, finding.id])
  );

  function clearPreview(source?: "queue" | "document") {
    setPreview((currentPreview) => {
      if (source && currentPreview.source !== source) {
        return currentPreview;
      }

      return {
        clauseId: null,
        findingId: null,
        source: null,
      };
    });
  }

  function handlePreviewClause(clauseId: string | null) {
    if (!clauseId) {
      clearPreview("document");
      return;
    }

    setPreview({
      clauseId,
      findingId: firstFindingByClause[clauseId] ?? null,
      source: "document",
    });
  }

  function handlePreviewFinding(
    findingId: string | null,
    source: "queue" | "document"
  ) {
    if (!findingId) {
      clearPreview(source);
      return;
    }

    const finding = findingById[findingId];

    setPreview({
      clauseId: finding?.clauseId ?? null,
      findingId,
      source,
    });
  }

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

      <section className="grid gap-5 xl:grid-cols-[250px_minmax(0,1fr)] xl:items-start">
        <ClauseOutline
          document={review.state.document}
          selectedClauseId={review.state.selectedClauseId}
          clauseFindingCounts={review.clauseFindingCounts}
          clauseCommentCounts={review.clauseCommentCounts}
          onSelectClause={review.selectClause}
        />

        <div className="grid gap-5 min-[1180px]:grid-cols-[minmax(0,1fr)_360px] min-[1180px]:items-start">
          <div className="space-y-5">
            <DocumentPane
              document={review.state.document}
              findings={review.findings}
              selectedClauseId={review.state.selectedClauseId}
              selectedFindingId={review.state.selectedFindingId}
              previewClauseId={preview.clauseId}
              previewFindingId={preview.findingId}
              previewSource={preview.source}
              viewMode={documentViewMode}
              onSelectClause={(clauseId) => {
                clearPreview();
                review.selectClause(clauseId);
              }}
              onPreviewClause={handlePreviewClause}
              onViewModeChange={setDocumentViewMode}
            />

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.04fr)_minmax(290px,0.96fr)]">
              <CommentsPanel
                key={review.selectedClause?.id ?? "no-active-clause"}
                clause={review.selectedClause}
                comments={review.selectedClauseComments}
                onAddComment={review.addComment}
                onUpdateCommentStatus={review.updateCommentStatus}
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
            previewFindingId={preview.findingId}
            previewSource={preview.source}
            selectedFinding={review.selectedFinding}
            onSelectFinding={(findingId) => {
              clearPreview();
              review.selectFinding(findingId);
            }}
            onPreviewFinding={handlePreviewFinding}
            onAcceptSuggestion={review.acceptSuggestion}
            onRejectSuggestion={(findingId) =>
              review.rejectSuggestion(findingId, reviewActionCopy.rejectReason)
            }
            onMarkNeedsFollowUp={(findingId) =>
              review.markNeedsFollowUp(findingId, reviewActionCopy.followUpNote)
            }
          />
        </div>
      </section>
    </main>
  );
}
