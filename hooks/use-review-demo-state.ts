import { useCallback, useEffect, useMemo, useReducer } from "react";
import {
  createReviewState,
  type ReviewState,
  reviewReducer,
} from "@/lib/review-state";
import type {
  ActivityEvent,
  Clause,
  Comment,
  ContractDocument,
  ContractSection,
  Finding,
  FindingDecision,
  Matter,
  ReviewSummary,
  SuggestedEdit,
} from "@/lib/types/legal-demo";

const reviewDemoStateStoragePrefix = "legaltech-demo:review-state:";
const reviewDemoStateChangedEvent = "review-demo-state:changed";
const reviewDemoStateCache = new Map<
  string,
  { serializedState: string | null; state: ReviewState | null }
>();

export function clearReviewDemoStateCacheForTests() {
  reviewDemoStateCache.clear();
}

function getSafeSessionStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function safeGetSessionStorageItem(storageKey: string) {
  const storage = getSafeSessionStorage();

  if (!storage) {
    return { ok: false as const, value: null };
  }

  try {
    return {
      ok: true as const,
      value: storage.getItem(storageKey),
    };
  } catch {
    return { ok: false as const, value: null };
  }
}

function safeSetSessionStorageItem(storageKey: string, value: string) {
  const storage = getSafeSessionStorage();

  if (!storage) {
    return false;
  }

  try {
    storage.setItem(storageKey, value);
    return true;
  } catch {
    return false;
  }
}

function safeRemoveSessionStorageItem(storageKey: string) {
  const storage = getSafeSessionStorage();

  if (!storage) {
    return false;
  }

  try {
    storage.removeItem(storageKey);
    return true;
  } catch {
    return false;
  }
}

function eventMatchesClause(
  event: ActivityEvent,
  clauseId: string,
  findingsById: Record<string, { clauseId: string }>,
) {
  switch (event.kind) {
    case "finding_created":
    case "comment_added":
    case "comment_status_changed":
    case "finding_queued":
      return event.clauseId === clauseId;
    case "finding_decision":
      return findingsById[event.findingId]?.clauseId === clauseId;
    default:
      return false;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isNullableString(value: unknown): value is string | null {
  return value === null || isString(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

function isFindingSeverity(value: unknown): value is Finding["severity"] {
  return value === "low" || value === "medium" || value === "high";
}

function isCommentStatus(value: unknown): value is Comment["status"] {
  return (
    value === "open" || value === "waiting_on_partner" || value === "resolved"
  );
}

function isSuggestedEdit(value: unknown): value is SuggestedEdit {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.clauseId) &&
    isString(value.summary) &&
    isString(value.beforeText) &&
    isString(value.afterText) &&
    isString(value.rationale)
  );
}

function isFindingDecision(value: unknown): value is FindingDecision {
  if (!isRecord(value) || !isString(value.kind)) {
    return false;
  }

  switch (value.kind) {
    case "pending":
      return Object.keys(value).length === 1;
    case "accepted":
      return isString(value.reviewedAt) && Object.keys(value).length === 2;
    case "rejected":
      return (
        isString(value.reviewedAt) &&
        isString(value.reason) &&
        Object.keys(value).length === 3
      );
    case "needs_follow_up":
      return (
        isString(value.reviewedAt) &&
        isString(value.note) &&
        Object.keys(value).length === 3
      );
    default:
      return false;
  }
}

function isClause(value: unknown): value is Clause {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.sectionId) &&
    isFiniteNumber(value.order) &&
    isString(value.title) &&
    isString(value.text)
  );
}

function isContractSection(value: unknown): value is ContractSection {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.title) &&
    isFiniteNumber(value.order) &&
    Array.isArray(value.clauses) &&
    value.clauses.every(isClause)
  );
}

function isContractDocument(value: unknown): value is ContractDocument {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.title) &&
    isString(value.version) &&
    Array.isArray(value.sections) &&
    value.sections.every(isContractSection)
  );
}

function isFinding(value: unknown): value is Finding {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.clauseId) &&
    isString(value.sectionId) &&
    isString(value.title) &&
    isFindingSeverity(value.severity) &&
    isString(value.citation) &&
    isString(value.rationale) &&
    isFindingDecision(value.decision) &&
    isSuggestedEdit(value.suggestedEdit)
  );
}

function isComment(value: unknown): value is Comment {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.clauseId) &&
    (value.findingId === undefined || isString(value.findingId)) &&
    isString(value.authorId) &&
    isString(value.body) &&
    isCommentStatus(value.status) &&
    isString(value.createdAt)
  );
}

function isActivityEvent(value: unknown): value is ActivityEvent {
  if (
    !isRecord(value) ||
    !isString(value.kind) ||
    !isString(value.id) ||
    !isString(value.occurredAt) ||
    !isString(value.message)
  ) {
    return false;
  }

  switch (value.kind) {
    case "matter_opened":
      return Object.keys(value).length === 4;
    case "agent_run_superseded":
      return (
        isString(value.runId) &&
        isString(value.supersededByRunId) &&
        Object.keys(value).length === 6
      );
    case "finding_created":
    case "finding_queued":
      return isString(value.findingId) && isString(value.clauseId);
    case "comment_added":
      return isString(value.commentId) && isString(value.clauseId);
    case "comment_status_changed":
      return (
        isString(value.commentId) &&
        isString(value.clauseId) &&
        isCommentStatus(value.status)
      );
    case "reviewer_waiting":
      return isString(value.collaboratorId);
    case "finding_decision":
      return (
        isString(value.findingId) &&
        (value.decision === "accepted" ||
          value.decision === "rejected" ||
          value.decision === "needs_follow_up")
      );
    default:
      return false;
  }
}

function isReviewSummary(value: unknown): value is ReviewSummary {
  return (
    isRecord(value) &&
    isFiniteNumber(value.totalFindings) &&
    isFiniteNumber(value.reviewedCount) &&
    isFiniteNumber(value.acceptedCount) &&
    isFiniteNumber(value.rejectedCount) &&
    isFiniteNumber(value.needsFollowUpCount) &&
    isFiniteNumber(value.unresolvedCommentCount)
  );
}

function isReviewState(value: unknown): value is ReviewState {
  if (!isRecord(value)) {
    return false;
  }

  if (
    !isContractDocument(value.document) ||
    !isRecord(value.findings) ||
    !isStringArray(value.findingOrder) ||
    !Array.isArray(value.comments) ||
    !Array.isArray(value.activity) ||
    !isString(value.selectedClauseId) ||
    !isNullableString(value.selectedFindingId) ||
    !isReviewSummary(value.summary)
  ) {
    return false;
  }

  const findings = value.findings as Record<string, unknown>;
  const findingOrder = value.findingOrder as string[];
  const comments = value.comments as unknown[];
  const activity = value.activity as unknown[];

  return (
    Object.entries(findings).every(
      ([findingId, finding]) =>
        isFinding(finding) &&
        finding.id === findingId &&
        findingOrderHasFinding(findingOrder, findingId),
    ) &&
    findingOrder.every((findingId) => Object.hasOwn(findings, findingId)) &&
    comments.every(isComment) &&
    activity.every(isActivityEvent)
  );
}

function findingOrderHasFinding(findingOrder: string[], findingId: string) {
  return findingOrder.includes(findingId);
}

export function getReviewDemoStateStorageKey(matterId: string) {
  return `${reviewDemoStateStoragePrefix}${matterId}`;
}

export function readPersistedReviewDemoState(
  matterId: string,
): ReviewState | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storageKey = getReviewDemoStateStorageKey(matterId);
  const cachedState = reviewDemoStateCache.get(storageKey);
  const storageRead = safeGetSessionStorageItem(storageKey);

  if (!storageRead.ok) {
    return cachedState?.state ?? null;
  }

  const serializedState = storageRead.value;

  if (cachedState?.serializedState === serializedState) {
    return cachedState.state;
  }

  if (serializedState === null) {
    reviewDemoStateCache.set(storageKey, {
      serializedState: null,
      state: null,
    });
    return null;
  }

  try {
    const parsedState = JSON.parse(serializedState);

    if (isReviewState(parsedState)) {
      reviewDemoStateCache.set(storageKey, {
        serializedState,
        state: parsedState,
      });
      return parsedState;
    }
  } catch {
    safeRemoveSessionStorageItem(storageKey);
    reviewDemoStateCache.set(storageKey, {
      serializedState: null,
      state: null,
    });
    return null;
  }

  safeRemoveSessionStorageItem(storageKey);
  reviewDemoStateCache.set(storageKey, {
    serializedState: null,
    state: null,
  });

  return null;
}

export function resolveReviewDemoState(matter: Matter): ReviewState {
  return readPersistedReviewDemoState(matter.id) ?? createReviewState(matter);
}

export function subscribeToReviewDemoState(
  matterId: string,
  onStoreChange: () => void,
) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const storageKey = getReviewDemoStateStorageKey(matterId);
  const sessionStorage = getSafeSessionStorage();

  const handleStorage = (event: StorageEvent) => {
    if (!sessionStorage || event.storageArea !== sessionStorage) {
      return;
    }

    if (event.key !== null && event.key !== storageKey) {
      return;
    }

    onStoreChange();
  };

  const handleStateChanged = (event: Event) => {
    const reviewEvent = event as CustomEvent<{ matterId?: string }>;

    if (reviewEvent.detail?.matterId !== matterId) {
      return;
    }

    onStoreChange();
  };

  if (sessionStorage) {
    window.addEventListener("storage", handleStorage);
  }
  window.addEventListener(
    reviewDemoStateChangedEvent,
    handleStateChanged as EventListener,
  );

  return () => {
    if (sessionStorage) {
      window.removeEventListener("storage", handleStorage);
    }
    window.removeEventListener(
      reviewDemoStateChangedEvent,
      handleStateChanged as EventListener,
    );
  };
}

export function persistReviewDemoState(matterId: string, state: ReviewState) {
  if (typeof window === "undefined") {
    return;
  }

  const storageKey = getReviewDemoStateStorageKey(matterId);
  const serializedState = JSON.stringify(state);

  if (!safeSetSessionStorageItem(storageKey, serializedState)) {
    return;
  }

  reviewDemoStateCache.set(storageKey, {
    serializedState,
    state,
  });
  window.dispatchEvent(
    new CustomEvent(reviewDemoStateChangedEvent, {
      detail: { matterId },
    }),
  );
}

export function useReviewDemoState(matter: Matter) {
  const [state, dispatch] = useReducer(
    reviewReducer,
    matter,
    resolveReviewDemoState,
  );

  useEffect(() => {
    persistReviewDemoState(matter.id, state);
  }, [matter.id, state]);

  const findings = useMemo(
    () =>
      state.findingOrder
        .map((findingId) => state.findings[findingId])
        .filter(Boolean),
    [state.findingOrder, state.findings],
  );

  const selectedClause = useMemo(
    () =>
      state.document.sections
        .flatMap((section) => section.clauses)
        .find((clause) => clause.id === state.selectedClauseId),
    [state.document, state.selectedClauseId],
  );

  const selectedFinding = useMemo(
    () =>
      state.selectedFindingId
        ? state.findings[state.selectedFindingId]
        : undefined,
    [state.findings, state.selectedFindingId],
  );

  const selectedClauseFindings = useMemo(
    () =>
      selectedClause
        ? state.findingOrder.flatMap((findingId) => {
            const finding = state.findings[findingId];
            return finding && finding.clauseId === selectedClause.id
              ? [finding]
              : [];
          })
        : [],
    [state.findingOrder, state.findings, selectedClause],
  );

  const selectedClauseComments = useMemo(
    () =>
      selectedClause
        ? state.comments
            .filter((comment) => comment.clauseId === selectedClause.id)
            .slice()
            .reverse()
        : [],
    [state.comments, selectedClause],
  );

  const selectedClauseActivity = useMemo(
    () =>
      selectedClause
        ? state.activity
            .filter((event) =>
              eventMatchesClause(event, selectedClause.id, state.findings),
            )
            .slice()
            .reverse()
        : [],
    [state.activity, state.findings, selectedClause],
  );

  const clauseFindingCounts = useMemo(
    () =>
      findings.reduce<Record<string, number>>((counts, finding) => {
        counts[finding.clauseId] = (counts[finding.clauseId] ?? 0) + 1;
        return counts;
      }, {}),
    [findings],
  );

  const clauseCommentCounts = useMemo(
    () =>
      state.comments.reduce<Record<string, number>>((counts, comment) => {
        counts[comment.clauseId] = (counts[comment.clauseId] ?? 0) + 1;
        return counts;
      }, {}),
    [state.comments],
  );

  const pendingDecisionCount =
    state.summary.totalFindings - state.summary.reviewedCount;
  const progressPercent =
    state.summary.totalFindings === 0
      ? 0
      : Math.round(
          (state.summary.reviewedCount / state.summary.totalFindings) * 100,
        );

  const selectClause = useCallback(
    (clauseId: string) => dispatch({ type: "select_clause", clauseId }),
    [],
  );

  const selectFinding = useCallback(
    (findingId: string) => dispatch({ type: "select_finding", findingId }),
    [],
  );

  const acceptSuggestion = useCallback(
    (findingId: string) => dispatch({ type: "accept_finding", findingId }),
    [],
  );

  const rejectSuggestion = useCallback(
    (findingId: string, reason: string) =>
      dispatch({ type: "reject_finding", findingId, reason }),
    [],
  );

  const markNeedsFollowUp = useCallback(
    (findingId: string, note: string) =>
      dispatch({ type: "mark_needs_follow_up", findingId, note }),
    [],
  );

  const revertDecision = useCallback(
    (findingId: string) =>
      dispatch({ type: "revert_finding_decision", findingId }),
    [],
  );

  const addComment = useCallback(
    (clauseId: string, body: string) =>
      dispatch({ type: "add_comment", clauseId, body }),
    [],
  );

  const updateCommentStatus = useCallback(
    (commentId: string, status: Comment["status"]) =>
      dispatch({ type: "update_comment_status", commentId, status }),
    [],
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
    selectClause,
    selectFinding,
    acceptSuggestion,
    rejectSuggestion,
    markNeedsFollowUp,
    revertDecision,
    addComment,
    updateCommentStatus,
  };
}
