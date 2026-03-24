import { expect, it } from "vitest";
import { seedActivity } from "./demo-data/activity";
import { seedDocument } from "./demo-data/document";
import { seedMatter, seedReviewState } from "./demo-data/matter";
import { createReviewState, reviewReducer, selectSelectedFinding } from "./review-state";
import type { Matter } from "./types/legal-demo";

it("defaults to the first clause and first finding in the seed matter", () => {
  expect(seedReviewState.selectedClauseId).toBe("clause-indemnity-1");
  expect(selectSelectedFinding(seedReviewState)?.id).toBe(
    "finding-indemnity-1"
  );
  expect(seedReviewState.summary.reviewedCount).toBe(0);
  expect(seedReviewState.summary.unresolvedCommentCount).toBe(1);
});

it("rejects an unknown clause selection without changing the current state", () => {
  const nextState = reviewReducer(seedReviewState, {
    type: "select_clause",
    clauseId: "clause-does-not-exist",
  });

  expect(nextState.selectedClauseId).toBe(seedReviewState.selectedClauseId);
  expect(nextState.selectedFindingId).toBe(seedReviewState.selectedFindingId);
});

it("clears the selected finding when a valid clause has no findings", () => {
  const matterWithoutClauseFindings: Matter = {
    ...seedMatter,
    document: {
      ...seedDocument,
      sections: [
        {
          id: "section-indemnity",
          title: "Indemnity",
          order: 1,
          clauses: [
            {
              id: "clause-indemnity-1",
              sectionId: "section-indemnity",
              order: 1,
              title: "Vendor indemnity",
              text: seedDocument.sections[0].clauses[0].text,
            },
            {
              id: "clause-no-findings",
              sectionId: "section-indemnity",
              order: 2,
              title: "Unflagged clause",
              text: "This clause has no findings attached.",
            },
          ],
        },
      ],
    },
    findings: [
      {
        ...seedMatter.findings[0],
        clauseId: "clause-indemnity-1",
      },
    ],
    comments: [],
    activity: [...seedActivity],
  };
  const matterState = createReviewState(matterWithoutClauseFindings);
  const nextState = reviewReducer(matterState, {
    type: "select_clause",
    clauseId: "clause-no-findings",
  });

  expect(nextState.selectedClauseId).toBe("clause-no-findings");
  expect(nextState.selectedFindingId).toBeNull();
  expect(selectSelectedFinding(nextState)).toBeUndefined();
});

it("updates the selected finding when a finding is selected", () => {
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

it("records queued findings as queued activity instead of a pending decision", () => {
  const queuedEvent = seedReviewState.activity.find(
    (event) => event.kind === "finding_queued"
  );

  expect(queuedEvent).toMatchObject({
    kind: "finding_queued",
    findingId: "finding-data-1",
    clauseId: "clause-data-1",
  });
  expect(
    seedReviewState.activity.some(
      (event) => event.kind === "finding_decision" && event.decision === "pending"
    )
  ).toBe(false);
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

it("marks a comment as waiting on partner without reducing unresolved counts", () => {
  const nextState = reviewReducer(seedReviewState, {
    type: "update_comment_status",
    commentId: "comment-1",
    status: "waiting_on_partner",
  });

  expect(nextState.comments[0]).toMatchObject({
    id: "comment-1",
    status: "waiting_on_partner",
  });
  expect(nextState.summary.unresolvedCommentCount).toBe(
    seedReviewState.summary.unresolvedCommentCount
  );
  expect(nextState.activity.at(-1)).toMatchObject({
    kind: "comment_status_changed",
    commentId: "comment-1",
    status: "waiting_on_partner",
  });
});

it("resolving a comment removes it from unresolved counts", () => {
  const nextState = reviewReducer(seedReviewState, {
    type: "update_comment_status",
    commentId: "comment-1",
    status: "resolved",
  });

  expect(nextState.comments[0]).toMatchObject({
    id: "comment-1",
    status: "resolved",
  });
  expect(nextState.summary.unresolvedCommentCount).toBe(0);
  expect(nextState.activity.at(-1)).toMatchObject({
    kind: "comment_status_changed",
    commentId: "comment-1",
    status: "resolved",
  });
});
