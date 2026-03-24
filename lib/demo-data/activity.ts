import type { ActivityEvent } from "../types/legal-demo";

export const seedActivity: ActivityEvent[] = [
  {
    kind: "matter_opened",
    id: "activity-1",
    occurredAt: "2026-03-24T08:00:00.000Z",
    message: "Matter opened for the Vendor MSA v3 review.",
  },
  {
    kind: "finding_created",
    id: "activity-2",
    occurredAt: "2026-03-24T08:06:00.000Z",
    message: "AI flagged the indemnity clause for overbroad risk transfer.",
    findingId: "finding-indemnity-1",
    clauseId: "clause-indemnity-1",
  },
  {
    kind: "finding_created",
    id: "activity-3",
    occurredAt: "2026-03-24T08:08:00.000Z",
    message: "AI flagged the liability cap carve-outs for partner review.",
    findingId: "finding-liability-1",
    clauseId: "clause-liability-1",
  },
  {
    kind: "agent_run_superseded",
    id: "activity-4",
    occurredAt: "2026-03-24T08:11:00.000Z",
    message: "A narrower prompt replaced the first review pass.",
    runId: "agent-run-1",
    supersededByRunId: "agent-run-2",
  },
  {
    kind: "reviewer_waiting",
    id: "activity-5",
    occurredAt: "2026-03-24T08:18:00.000Z",
    message: "Partner review is waiting on a concise summary.",
    collaboratorId: "collaborator-reviewer-1",
  },
  {
    kind: "comment_added",
    id: "activity-6",
    occurredAt: "2026-03-24T08:22:00.000Z",
    message: "Associate asked for partner sign-off on the indemnity language.",
    commentId: "comment-1",
    clauseId: "clause-indemnity-1",
  },
  {
    kind: "finding_queued",
    id: "activity-7",
    occurredAt: "2026-03-24T08:30:00.000Z",
    message: "The review queue is ready for clause-by-clause decisions.",
    findingId: "finding-data-1",
    clauseId: "clause-data-1",
  },
];
