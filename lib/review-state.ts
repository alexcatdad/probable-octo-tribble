import type {
  ActivityEvent,
  Clause,
  Comment,
  ContractDocument,
  Finding,
  FindingDecision,
  Matter,
  ReviewSummary,
} from "./types/legal-demo";
import { seedMatter } from "./demo-data/matter";

export interface ReviewState {
  document: ContractDocument;
  findings: Record<string, Finding>;
  findingOrder: string[];
  comments: Comment[];
  activity: ActivityEvent[];
  selectedClauseId: string;
  selectedFindingId: string;
  summary: ReviewSummary;
}

export type ReviewAction =
  | { type: "select_clause"; clauseId: string }
  | { type: "select_finding"; findingId: string }
  | { type: "accept_finding"; findingId: string }
  | { type: "reject_finding"; findingId: string; reason: string }
  | { type: "mark_needs_follow_up"; findingId: string; note: string }
  | {
      type: "add_comment";
      clauseId: string;
      body: string;
      authorId?: string;
    };

const seedReviewStart = "2026-03-24T08:00:00.000Z";

function buildFindingsMap(findings: Finding[]): Record<string, Finding> {
  return Object.fromEntries(findings.map((finding) => [finding.id, finding]));
}

function buildReviewSummary(
  findings: Finding[],
  comments: Comment[]
): ReviewSummary {
  const reviewedFindings = findings.filter(
    (finding) => finding.decision.kind !== "pending"
  );

  return {
    totalFindings: findings.length,
    reviewedCount: reviewedFindings.length,
    acceptedCount: findings.filter((finding) => finding.decision.kind === "accepted").length,
    rejectedCount: findings.filter((finding) => finding.decision.kind === "rejected").length,
    needsFollowUpCount: findings.filter(
      (finding) => finding.decision.kind === "needs_follow_up"
    ).length,
    unresolvedCommentCount: comments.filter((comment) => comment.status === "open")
      .length,
  };
}

function findClause(document: ContractDocument, clauseId: string): Clause | undefined {
  for (const section of document.sections) {
    const clause = section.clauses.find((item) => item.id === clauseId);
    if (clause) {
      return clause;
    }
  }

  return undefined;
}

function findClauseIdForFinding(state: ReviewState, findingId: string): string | undefined {
  return state.findings[findingId]?.clauseId;
}

function firstFindingForClause(state: ReviewState, clauseId: string): string | undefined {
  return state.findingOrder.find(
    (findingId) => state.findings[findingId]?.clauseId === clauseId
  );
}

function updateFindingDecision(
  finding: Finding,
  decision: FindingDecision
): Finding {
  return {
    ...finding,
    decision,
  };
}

function nextActivityId(activity: ActivityEvent[]): string {
  return `activity-${activity.length + 1}`;
}

function latestActivityTimestamp(activity: ActivityEvent[]): string {
  return activity[activity.length - 1]?.occurredAt ?? seedReviewStart;
}

function nextTimestamp(activity: ActivityEvent[]): string {
  return new Date(Date.parse(latestActivityTimestamp(activity)) + 60_000).toISOString();
}

function addActivityEvent(
  state: ReviewState,
  event: Omit<ActivityEvent, "id" | "occurredAt">
): ActivityEvent[] {
  return [
    ...state.activity,
    {
      ...event,
      id: nextActivityId(state.activity),
      occurredAt: nextTimestamp(state.activity),
    } as ActivityEvent,
  ];
}

export function createReviewState(matter: Matter): ReviewState {
  const findings = buildFindingsMap(matter.findings);
  const findingOrder = matter.findings.map((finding) => finding.id);
  const selectedClauseId = matter.document.sections[0]?.clauses[0]?.id ?? "";
  const selectedFindingId =
    matter.findings.find((finding) => finding.clauseId === selectedClauseId)?.id ??
    matter.findings[0]?.id ??
    "";

  return {
    document: matter.document,
    findings,
    findingOrder,
    comments: [...matter.comments],
    activity: [...matter.activity],
    selectedClauseId,
    selectedFindingId,
    summary: buildReviewSummary(matter.findings, matter.comments),
  };
}

export const seedReviewState = createReviewState(seedMatter);

export function selectClauseById(
  state: ReviewState,
  clauseId: string
): Clause | undefined {
  return state.document.sections
    .flatMap((section) => section.clauses)
    .find((clause) => clause.id === clauseId);
}

export function selectSelectedClause(state: ReviewState): Clause | undefined {
  return selectClauseById(state, state.selectedClauseId);
}

export function selectFindingById(
  state: ReviewState,
  findingId: string
): Finding | undefined {
  return state.findings[findingId];
}

export function selectSelectedFinding(state: ReviewState): Finding | undefined {
  return selectFindingById(state, state.selectedFindingId);
}

export function selectFindingsForClause(
  state: ReviewState,
  clauseId: string
): Finding[] {
  return state.findingOrder.flatMap((findingId) => {
    const finding = state.findings[findingId];
    return finding && finding.clauseId === clauseId ? [finding] : [];
  });
}

export function reviewReducer(
  state: ReviewState,
  action: ReviewAction
): ReviewState {
  switch (action.type) {
    case "select_clause": {
      const nextSelectedFindingId =
        firstFindingForClause(state, action.clauseId) ?? state.selectedFindingId;

      return {
        ...state,
        selectedClauseId: action.clauseId,
        selectedFindingId: nextSelectedFindingId,
      };
    }
    case "select_finding": {
      const clauseId = findClauseIdForFinding(state, action.findingId);

      if (!clauseId) {
        return state;
      }

      return {
        ...state,
        selectedClauseId: clauseId,
        selectedFindingId: action.findingId,
      };
    }
    case "accept_finding":
    case "reject_finding":
    case "mark_needs_follow_up": {
      const finding = state.findings[action.findingId];

      if (!finding) {
        return state;
      }

      const reviewedAt = nextTimestamp(state.activity);
      const decision: FindingDecision =
        action.type === "accept_finding"
          ? { kind: "accepted", reviewedAt }
          : action.type === "reject_finding"
            ? {
                kind: "rejected",
                reviewedAt,
                reason: action.reason,
              }
            : {
                kind: "needs_follow_up",
                reviewedAt,
                note: action.note,
              };

      const updatedFinding = updateFindingDecision(finding, decision);
      const nextFindings = {
        ...state.findings,
        [finding.id]: updatedFinding,
      };
      const nextFindingOrder = [...state.findingOrder];
      const nextActivity = addActivityEvent(state, {
        kind: "finding_decision",
        findingId: finding.id,
        decision: decision.kind,
        message:
          decision.kind === "accepted"
            ? `Accepted ${finding.title.toLowerCase()}.`
            : decision.kind === "rejected"
              ? `Rejected ${finding.title.toLowerCase()}.`
              : `Marked ${finding.title.toLowerCase()} for follow-up.`,
      });
      return {
        ...state,
        findings: nextFindings,
        findingOrder: nextFindingOrder,
        activity: nextActivity,
        selectedClauseId: finding.clauseId,
        selectedFindingId: finding.id,
        summary: buildReviewSummary(Object.values(nextFindings), state.comments),
      };
    }
    case "add_comment": {
      const clause = findClause(state.document, action.clauseId);

      if (!clause) {
        return state;
      }

      const comment: Comment = {
        id: `comment-${state.comments.length + 1}`,
        clauseId: action.clauseId,
        findingId:
          state.selectedFindingId &&
          state.findings[state.selectedFindingId]?.clauseId === action.clauseId
            ? state.selectedFindingId
            : undefined,
        authorId: action.authorId ?? "collaborator-associate-1",
        body: action.body,
        status: "open",
        createdAt: nextTimestamp(state.activity),
      };
      const nextComments = [...state.comments, comment];
      const nextActivity = addActivityEvent(state, {
        kind: "comment_added",
        commentId: comment.id,
        clauseId: action.clauseId,
        message: action.body,
      });

      return {
        ...state,
        comments: nextComments,
        activity: nextActivity,
        summary: buildReviewSummary(Object.values(state.findings), nextComments),
      };
    }
    default:
      return state;
  }
}
