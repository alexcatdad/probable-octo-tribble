"use client";

import { useReducer } from "react";
import {
  createReviewState,
  reviewReducer,
  selectFindingsForClause,
  selectSelectedClause,
  selectSelectedFinding,
} from "@/lib/review-state";
import type { ActivityEvent, Matter } from "@/lib/types/legal-demo";

function eventMatchesClause(
  event: ActivityEvent,
  clauseId: string,
  findingsById: Record<string, { clauseId: string }>
) {
  switch (event.kind) {
    case "finding_created":
    case "comment_added":
    case "finding_queued":
      return event.clauseId === clauseId;
    case "finding_decision":
      return findingsById[event.findingId]?.clauseId === clauseId;
    default:
      return false;
  }
}

export function useReviewDemoState(matter: Matter) {
  const [state, dispatch] = useReducer(reviewReducer, matter, createReviewState);

  const findings = state.findingOrder
    .map((findingId) => state.findings[findingId])
    .filter(Boolean);
  const selectedClause = selectSelectedClause(state);
  const selectedFinding = selectSelectedFinding(state);
  const selectedClauseFindings = selectedClause
    ? selectFindingsForClause(state, selectedClause.id)
    : [];
  const selectedClauseComments = selectedClause
    ? state.comments
        .filter((comment) => comment.clauseId === selectedClause.id)
        .slice()
        .reverse()
    : [];
  const selectedClauseActivity = selectedClause
    ? state.activity
        .filter((event) =>
          eventMatchesClause(event, selectedClause.id, state.findings)
        )
        .slice()
        .reverse()
    : [];
  const clauseFindingCounts = findings.reduce<Record<string, number>>(
    (counts, finding) => {
      counts[finding.clauseId] = (counts[finding.clauseId] ?? 0) + 1;
      return counts;
    },
    {}
  );
  const clauseCommentCounts = state.comments.reduce<Record<string, number>>(
    (counts, comment) => {
      counts[comment.clauseId] = (counts[comment.clauseId] ?? 0) + 1;
      return counts;
    },
    {}
  );
  const pendingDecisionCount =
    state.summary.totalFindings - state.summary.reviewedCount;
  const progressPercent =
    state.summary.totalFindings === 0
      ? 0
      : Math.round(
          (state.summary.reviewedCount / state.summary.totalFindings) * 100
        );

  return {
    state,
    findings,
    summary: state.summary,
    selectedClause,
    selectedFinding,
    selectedClauseFindings,
    selectedClauseComments,
    selectedClauseActivity,
    clauseFindingCounts,
    clauseCommentCounts,
    pendingDecisionCount,
    progressPercent,
    reviewProgressLabel: `${state.summary.reviewedCount} of ${state.summary.totalFindings} findings reviewed`,
    overviewCounts: {
      reviewedCount: state.summary.reviewedCount,
      totalFindings: state.summary.totalFindings,
      pendingDecisionCount,
      unresolvedCommentCount: state.summary.unresolvedCommentCount,
    },
    selectClause(clauseId: string) {
      dispatch({ type: "select_clause", clauseId });
    },
    selectFinding(findingId: string) {
      dispatch({ type: "select_finding", findingId });
    },
    acceptSuggestion(findingId: string) {
      dispatch({ type: "accept_finding", findingId });
    },
    rejectSuggestion(findingId: string, reason: string) {
      dispatch({
        type: "reject_finding",
        findingId,
        reason,
      });
    },
    markNeedsFollowUp(findingId: string, note: string) {
      dispatch({
        type: "mark_needs_follow_up",
        findingId,
        note,
      });
    },
    addComment(clauseId: string, body: string) {
      dispatch({ type: "add_comment", clauseId, body });
    },
  };
}
