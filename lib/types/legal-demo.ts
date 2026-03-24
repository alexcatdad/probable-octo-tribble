export type MatterStage =
  | "intake"
  | "review"
  | "partner_signoff"
  | "ready_for_signature";

export type CollaboratorRole = "partner" | "associate" | "reviewer";

export type CollaboratorStatus =
  | { kind: "active" }
  | { kind: "waiting"; waitingOn: string; since: string };

export interface Collaborator {
  id: string;
  name: string;
  role: CollaboratorRole;
  status: CollaboratorStatus;
  title: string;
  initials: string;
}

export interface ContractDocument {
  id: string;
  title: string;
  version: string;
  sections: ContractSection[];
}

export interface ContractSection {
  id: string;
  title: string;
  order: number;
  clauses: Clause[];
}

export interface Clause {
  id: string;
  sectionId: string;
  order: number;
  title: string;
  text: string;
}

export type FindingSeverity = "low" | "medium" | "high";

export type FindingDecisionKind =
  | "pending"
  | "accepted"
  | "rejected"
  | "needs_follow_up";

export type ReviewedFindingDecisionKind = Exclude<
  FindingDecisionKind,
  "pending"
>;

export type FindingDecision =
  | { kind: "pending" }
  | { kind: "accepted"; reviewedAt: string }
  | { kind: "rejected"; reviewedAt: string; reason: string }
  | { kind: "needs_follow_up"; reviewedAt: string; note: string };

export interface SuggestedEdit {
  id: string;
  clauseId: string;
  summary: string;
  beforeText: string;
  afterText: string;
  rationale: string;
}

export interface Finding {
  id: string;
  clauseId: string;
  sectionId: string;
  title: string;
  severity: FindingSeverity;
  citation: string;
  rationale: string;
  decision: FindingDecision;
  suggestedEdit: SuggestedEdit;
}

export type CommentStatus = "open" | "waiting_on_partner" | "resolved";

export interface Comment {
  id: string;
  clauseId: string;
  findingId?: string;
  authorId: string;
  body: string;
  status: CommentStatus;
  createdAt: string;
}

export type AgentRunStatus =
  | { kind: "completed"; completedAt: string; outputSummary: string }
  | {
      kind: "superseded";
      supersededAt: string;
      supersededByRunId: string;
      reason: string;
    }
  | {
      kind: "needs_human_review";
      requestedAt: string;
      requestedBy: string;
      note: string;
    };

export interface AgentRun {
  id: string;
  name: string;
  status: AgentRunStatus;
  startedAt: string;
}

export type ActivityEvent =
  | {
      kind: "matter_opened";
      id: string;
      occurredAt: string;
      message: string;
    }
  | {
      kind: "agent_run_superseded";
      id: string;
      occurredAt: string;
      message: string;
      runId: string;
      supersededByRunId: string;
    }
  | {
      kind: "finding_created";
      id: string;
      occurredAt: string;
      message: string;
      findingId: string;
      clauseId: string;
    }
  | {
      kind: "reviewer_waiting";
      id: string;
      occurredAt: string;
      message: string;
      collaboratorId: string;
    }
  | {
      kind: "comment_added";
      id: string;
      occurredAt: string;
      message: string;
      commentId: string;
      clauseId: string;
    }
  | {
      kind: "comment_status_changed";
      id: string;
      occurredAt: string;
      message: string;
      commentId: string;
      clauseId: string;
      status: CommentStatus;
    }
  | {
      kind: "finding_queued";
      id: string;
      occurredAt: string;
      message: string;
      findingId: string;
      clauseId: string;
    }
  | {
      kind: "finding_decision";
      id: string;
      occurredAt: string;
      message: string;
      findingId: string;
      decision: ReviewedFindingDecisionKind;
    };

export interface ReviewSummary {
  totalFindings: number;
  reviewedCount: number;
  acceptedCount: number;
  rejectedCount: number;
  needsFollowUpCount: number;
  unresolvedCommentCount: number;
}

export interface Matter {
  id: string;
  title: string;
  clientName: string;
  counterpartyName: string;
  stage: MatterStage;
  document: ContractDocument;
  collaborators: Collaborator[];
  agentRuns: AgentRun[];
  findings: Finding[];
  comments: Comment[];
  activity: ActivityEvent[];
}
