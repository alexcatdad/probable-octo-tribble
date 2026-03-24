import { expect, it } from "vitest";
import {
  reviewReducer,
  seedReviewState,
  selectSelectedClause,
  selectSelectedFinding,
} from "./review-state";

it("defaults to the first clause and first finding in the seed matter", () => {
  expect(selectSelectedClause(seedReviewState)?.id).toBe("clause-indemnity-1");
  expect(selectSelectedFinding(seedReviewState)?.id).toBe(
    "finding-indemnity-1"
  );
  expect(seedReviewState.summary.reviewedCount).toBe(0);
  expect(seedReviewState.summary.unresolvedCommentCount).toBe(1);
});

it("updates the selected finding when a clause is selected", () => {
  const nextState = reviewReducer(seedReviewState, {
    type: "select_clause",
    clauseId: "clause-liability-1",
  });

  expect(nextState.selectedClauseId).toBe("clause-liability-1");
  expect(nextState.selectedFindingId).toBe("finding-liability-1");
});

it("updates the selected clause when a finding is selected", () => {
  const nextState = reviewReducer(seedReviewState, {
    type: "select_finding",
    findingId: "finding-data-1",
  });

  expect(nextState.selectedFindingId).toBe("finding-data-1");
  expect(nextState.selectedClauseId).toBe("clause-data-1");
});

it("marks a finding as accepted and updates reviewed counts", () => {
  const nextState = reviewReducer(seedReviewState, {
    type: "accept_finding",
    findingId: "finding-indemnity-1",
  });

  expect(nextState.findings["finding-indemnity-1"].decision.kind).toBe(
    "accepted"
  );
  expect(nextState.summary.reviewedCount).toBe(1);
  expect(nextState.summary.acceptedCount).toBe(1);
});

it("marks a finding as rejected and stores the rejection reason", () => {
  const nextState = reviewReducer(seedReviewState, {
    type: "reject_finding",
    findingId: "finding-liability-1",
    reason: "The cap should still exclude indirect damages.",
  });

  expect(nextState.findings["finding-liability-1"].decision).toMatchObject({
    kind: "rejected",
    reason: "The cap should still exclude indirect damages.",
  });
  expect(nextState.summary.reviewedCount).toBe(1);
  expect(nextState.summary.rejectedCount).toBe(1);
});

it("marks a finding as needing follow-up", () => {
  const nextState = reviewReducer(seedReviewState, {
    type: "mark_needs_follow_up",
    findingId: "finding-data-1",
    note: "Partner should confirm the subprocessor notice window.",
  });

  expect(nextState.findings["finding-data-1"].decision).toMatchObject({
    kind: "needs_follow_up",
    note: "Partner should confirm the subprocessor notice window.",
  });
  expect(nextState.summary.reviewedCount).toBe(1);
  expect(nextState.summary.needsFollowUpCount).toBe(1);
});

it("adds a comment, appends activity, and increments unresolved comment counts", () => {
  const nextState = reviewReducer(seedReviewState, {
    type: "add_comment",
    clauseId: "clause-indemnity-1",
    body: "Please get partner sign-off before we accept this language.",
  });

  expect(nextState.comments).toHaveLength(seedReviewState.comments.length + 1);
  expect(nextState.activity).toHaveLength(seedReviewState.activity.length + 1);
  expect(nextState.summary.unresolvedCommentCount).toBe(
    seedReviewState.summary.unresolvedCommentCount + 1
  );
});
