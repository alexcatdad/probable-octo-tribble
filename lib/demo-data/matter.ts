import type {
  AgentRun,
  Collaborator,
  Comment,
  Finding,
  Matter,
} from "../types/legal-demo";
import { createReviewState } from "../review-state";
import { seedActivity } from "./activity";
import { seedDocument } from "./document";

export const seedCollaborators: Collaborator[] = [
  {
    id: "collaborator-partner-1",
    name: "Jordan Blake",
    role: "partner",
    title: "Partner",
    initials: "JB",
    status: { kind: "active" },
  },
  {
    id: "collaborator-associate-1",
    name: "Maya Chen",
    role: "associate",
    title: "Senior Associate",
    initials: "MC",
    status: { kind: "active" },
  },
  {
    id: "collaborator-reviewer-1",
    name: "Priya Nair",
    role: "reviewer",
    title: "Reviewer",
    initials: "PN",
    status: {
      kind: "waiting",
      waitingOn: "partner sign-off",
      since: "2026-03-24T08:18:00.000Z",
    },
  },
];

export const seedAgentRuns: AgentRun[] = [
  {
    id: "agent-run-1",
    name: "Vendor MSA sweep v2",
    startedAt: "2026-03-24T08:02:00.000Z",
    status: {
      kind: "superseded",
      supersededAt: "2026-03-24T08:11:00.000Z",
      supersededByRunId: "agent-run-2",
      reason: "A tighter clause map was generated after the first pass.",
    },
  },
  {
    id: "agent-run-2",
    name: "Vendor MSA review v3",
    startedAt: "2026-03-24T08:12:00.000Z",
    status: {
      kind: "needs_human_review",
      requestedAt: "2026-03-24T08:20:00.000Z",
      requestedBy: "collaborator-reviewer-1",
      note: "Partner should confirm the indemnity and liability positions.",
    },
  },
];

export const seedFindings: Finding[] = [
  {
    id: "finding-indemnity-1",
    clauseId: "clause-indemnity-1",
    sectionId: "section-indemnity",
    title: "Indemnity is broader than the risk allocation supports",
    severity: "high",
    citation:
      "See clause 14.1: the indemnity extends to all claims tied to the Services, Data, or any breach.",
    rationale:
      "The clause shifts customer-side operational risk back to the vendor and only carves out customer materials and instructions. The indemnity should be narrowed to third-party claims caused by the vendor's breach, negligence, or IP infringement.",
    decision: { kind: "pending" },
    suggestedEdit: {
      id: "suggested-edit-indemnity-1",
      clauseId: "clause-indemnity-1",
      summary: "Narrow the indemnity to vendor-caused third-party claims.",
      beforeText:
        "Vendor will defend, indemnify, and hold harmless Customer...",
      afterText:
        "Vendor will defend, indemnify, and hold harmless Customer from third-party claims arising from Vendor's breach, negligence, or infringement...",
      rationale:
        "This keeps the allocation commercially standard while removing the catch-all risk transfer.",
    },
  },
  {
    id: "finding-liability-1",
    clauseId: "clause-liability-1",
    sectionId: "section-liability",
    title: "Liability carve-outs should be tighter",
    severity: "medium",
    citation:
      "See clause 17.2: confidentiality breaches and indemnity obligations are carved out, but the cap is otherwise broad.",
    rationale:
      "The cap is workable, but the carve-outs should stay limited to fraud, willful misconduct, and payment obligations so the clause remains balanced.",
    decision: { kind: "pending" },
    suggestedEdit: {
      id: "suggested-edit-liability-1",
      clauseId: "clause-liability-1",
      summary: "Tighten the liability carve-outs.",
      beforeText:
        "Except for confidentiality breaches and indemnity obligations, liability is capped...",
      afterText:
        "Except for fraud, willful misconduct, and payment obligations, liability is capped...",
      rationale:
        "This avoids an outsized exception set while preserving a realistic cap structure.",
    },
  },
  {
    id: "finding-data-1",
    clauseId: "clause-data-1",
    sectionId: "section-data-protection",
    title: "Security incident notice should be faster",
    severity: "high",
    citation:
      "See clause 21.4: Security Incident notice is due within 72 hours after confirmation.",
    rationale:
      "A 72 hour notice window is slower than the business expects for customer-facing incidents. The language should ask for prompt notice and a shorter outside window.",
    decision: { kind: "pending" },
    suggestedEdit: {
      id: "suggested-edit-data-1",
      clauseId: "clause-data-1",
      summary: "Shorten the Security Incident notice period.",
      beforeText: "notify Customer ... within 72 hours after confirmation",
      afterText: "notify Customer promptly and in any event within 48 hours",
      rationale:
        "The revised wording preserves operational flexibility but improves responsiveness.",
    },
  },
  {
    id: "finding-renewal-1",
    clauseId: "clause-renewal-1",
    sectionId: "section-termination",
    title: "Renewal notice period is too long",
    severity: "low",
    citation:
      "See clause 3.2: the agreement auto-renews unless notice is given 90 days before term end.",
    rationale:
      "The notice window is longer than the team usually accepts for vendor MSAs and increases the risk of accidental renewal.",
    decision: { kind: "pending" },
    suggestedEdit: {
      id: "suggested-edit-renewal-1",
      clauseId: "clause-renewal-1",
      summary: "Reduce the auto-renewal notice period.",
      beforeText: "at least 90 days' written notice",
      afterText: "at least 30 days' written notice",
      rationale:
        "This makes the termination mechanics easier to manage without changing the renewal structure.",
    },
  },
];

export const seedComments: Comment[] = [
  {
    id: "comment-1",
    clauseId: "clause-indemnity-1",
    findingId: "finding-indemnity-1",
    authorId: "collaborator-associate-1",
    body: "Please get partner sign-off before we accept this language.",
    status: "open",
    createdAt: "2026-03-24T08:22:00.000Z",
  },
];

export const seedMatter: Matter = {
  id: "matter-acme-v-omnicore",
  title: "Acme Co. v. OmniCore",
  clientName: "Acme Co.",
  counterpartyName: "OmniCore Ltd.",
  stage: "review",
  document: seedDocument,
  collaborators: seedCollaborators,
  agentRuns: seedAgentRuns,
  findings: seedFindings,
  comments: seedComments,
  activity: seedActivity,
};

export const seedReviewState = createReviewState(seedMatter);

export const demoMatter = seedMatter;
