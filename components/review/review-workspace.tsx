"use client";

import { useCallback, useState } from "react";
import { ActivityPanel } from "@/components/review/activity-panel";
import { ClauseOutline } from "@/components/review/clause-outline";
import { CommentsPanel } from "@/components/review/comments-panel";
import {
  DocumentPane,
  type DocumentReviewMode,
} from "@/components/review/document-pane";
import { FindingsRail } from "@/components/review/findings-rail";
import { ReviewTopbar } from "@/components/review/review-topbar";
import { UndoToast } from "@/components/review/undo-toast";
import { useReviewDemoState } from "@/hooks/use-review-demo-state";
import type { Matter } from "@/lib/types/legal-demo";

interface ReviewWorkspaceProps {
  matter: Matter;
}

const reviewActionCopy = {
  rejectReason:
    "Fallback language should stay with the client negotiation team.",
  followUpNote: "Needs partner guidance before the redline is finalised.",
};

const decisionLabels: Record<string, string> = {
  accept_finding: "Accepted",
  reject_finding: "Rejected",
  mark_needs_follow_up: "Marked for follow-up",
};

function selectActiveRun(agentRuns: Matter["agentRuns"]) {
  const runNeedingHumanReview = agentRuns.find(
    (run) => run.status.kind === "needs_human_review",
  );

  if (runNeedingHumanReview) {
    return runNeedingHumanReview;
  }

  if (agentRuns.length === 0) return undefined;

  let latest = agentRuns[0];
  for (let i = 1; i < agentRuns.length; i++) {
    if (Date.parse(agentRuns[i].startedAt) > Date.parse(latest.startedAt)) {
      latest = agentRuns[i];
    }
  }
  return latest;
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
  const [undoState, setUndoState] = useState<{
    findingId: string | null;
    findingTitle: string;
    decisionLabel: string;
  }>({
    findingId: null,
    findingTitle: "",
    decisionLabel: "",
  });

  const findingById = Object.fromEntries(
    review.findings.map((finding) => [finding.id, finding]),
  );
  const firstFindingByClause = Object.fromEntries(
    review.findings.map((finding) => [finding.clauseId, finding.id]),
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
    source: "queue" | "document",
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

  function showUndoToast(findingId: string, actionType: string) {
    const finding = findingById[findingId];
    setUndoState({
      findingId,
      findingTitle: finding?.title ?? "Finding",
      decisionLabel: decisionLabels[actionType] ?? "Updated",
    });
  }

  const handleDismissUndo = useCallback(() => {
    setUndoState({ findingId: null, findingTitle: "", decisionLabel: "" });
  }, []);

  function handleAcceptSuggestion(findingId: string) {
    review.acceptSuggestion(findingId);
    showUndoToast(findingId, "accept_finding");
  }

  function handleRejectSuggestion(findingId: string) {
    review.rejectSuggestion(findingId, reviewActionCopy.rejectReason);
    showUndoToast(findingId, "reject_finding");
  }

  function handleMarkNeedsFollowUp(findingId: string) {
    review.markNeedsFollowUp(findingId, reviewActionCopy.followUpNote);
    showUndoToast(findingId, "mark_needs_follow_up");
  }

  function handleUndo(findingId: string) {
    review.revertDecision(findingId);
    setUndoState({ findingId: null, findingTitle: "", decisionLabel: "" });
  }

  return (
    <>
      {/* Topbar: full span */}
      <ReviewTopbar
        className="col-span-12"
        matter={matter}
        activeRun={activeRun}
        summary={review.summary}
        pendingDecisionCount={review.pendingDecisionCount}
        progressPercent={review.progressPercent}
        reviewProgressLabel={review.reviewProgressLabel}
      />

      {/* Clause outline: 3 cols on xl, full below */}
      <ClauseOutline
        className="col-span-12 xl:col-span-3 xl:sticky xl:top-5"
        document={review.state.document}
        selectedClauseId={review.state.selectedClauseId}
        clauseFindingCounts={review.clauseFindingCounts}
        clauseCommentCounts={review.clauseCommentCounts}
        onSelectClause={review.selectClause}
      />

      {/* Content zone: 9 cols on xl, uses subgrid to inherit page columns */}
      <div className="col-span-12 grid grid-cols-subgrid gap-5 xl:col-span-9">
        {/* Document pane: 5 of 9 cols at 1180px+, full below */}
        <DocumentPane
          className="col-span-full min-[1180px]:col-span-5"
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

        {/* Findings rail: 4 of 9 cols at 1180px+ */}
        <FindingsRail
          className="col-span-full min-[1180px]:col-span-4 min-[1180px]:sticky min-[1180px]:top-5"
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
          onAcceptSuggestion={handleAcceptSuggestion}
          onRejectSuggestion={handleRejectSuggestion}
          onMarkNeedsFollowUp={handleMarkNeedsFollowUp}
        />

        {/* Comments + Activity below document: share the 5-col space */}
        <CommentsPanel
          className="col-span-full min-[1180px]:col-span-3"
          key={review.selectedClause?.id ?? "no-active-clause"}
          clause={review.selectedClause}
          comments={review.selectedClauseComments}
          onAddComment={review.addComment}
          onUpdateCommentStatus={review.updateCommentStatus}
        />
        <ActivityPanel
          className="col-span-full min-[1180px]:col-span-2"
          clause={review.selectedClause}
          activity={review.selectedClauseActivity}
        />
      </div>

      <UndoToast
        findingId={undoState.findingId}
        findingTitle={undoState.findingTitle}
        decisionLabel={undoState.decisionLabel}
        onUndo={handleUndo}
        onDismiss={handleDismissUndo}
      />
    </>
  );
}
