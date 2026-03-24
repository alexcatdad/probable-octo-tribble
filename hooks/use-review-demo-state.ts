"use client";

import { useEffect, useReducer } from "react";
import {
  createReviewState,
  reviewReducer,
  selectFindingsForClause,
  selectSelectedClause,
  selectSelectedFinding,
  type ReviewState,
} from "@/lib/review-state";
import type { ActivityEvent, Matter } from "@/lib/types/legal-demo";

const reviewDemoStateStoragePrefix = "legaltech-demo:review-state:";
const reviewDemoStateChangedEvent = "review-demo-state:changed";
const reviewDemoStateCache = new Map<
  string,
  { serializedState: string | null; state: ReviewState | null }
>();

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

function isReviewState(value: unknown): value is ReviewState {
  if (!value || typeof value !== "object") {
    return false;
  }

  const state = value as Partial<ReviewState>;

  return (
    Array.isArray(state.activity) &&
    Array.isArray(state.comments) &&
    Array.isArray(state.findingOrder) &&
    typeof state.document === "object" &&
    state.document !== null &&
    typeof state.findings === "object" &&
    state.findings !== null &&
    typeof state.selectedClauseId === "string" &&
    typeof state.summary === "object" &&
    state.summary !== null
  );
}

export function getReviewDemoStateStorageKey(matterId: string) {
  return `${reviewDemoStateStoragePrefix}${matterId}`;
}

export function readPersistedReviewDemoState(matterId: string): ReviewState | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storageKey = getReviewDemoStateStorageKey(matterId);
  const serializedState = window.sessionStorage.getItem(storageKey);
  const cachedState = reviewDemoStateCache.get(storageKey);

  if (cachedState?.serializedState === serializedState) {
    return cachedState.state;
  }

  if (!serializedState) {
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
    window.sessionStorage.removeItem(storageKey);
    reviewDemoStateCache.set(storageKey, {
      serializedState: null,
      state: null,
    });
    return null;
  }

  window.sessionStorage.removeItem(storageKey);
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
  onStoreChange: () => void
) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const storageKey = getReviewDemoStateStorageKey(matterId);

  const handleStorage = (event: StorageEvent) => {
    if (event.storageArea !== window.sessionStorage) {
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

  window.addEventListener("storage", handleStorage);
  window.addEventListener(
    reviewDemoStateChangedEvent,
    handleStateChanged as EventListener
  );

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(
      reviewDemoStateChangedEvent,
      handleStateChanged as EventListener
    );
  };
}

export function persistReviewDemoState(matterId: string, state: ReviewState) {
  if (typeof window === "undefined") {
    return;
  }

  const storageKey = getReviewDemoStateStorageKey(matterId);
  const serializedState = JSON.stringify(state);

  window.sessionStorage.setItem(storageKey, serializedState);
  reviewDemoStateCache.set(storageKey, {
    serializedState,
    state,
  });
  window.dispatchEvent(
    new CustomEvent(reviewDemoStateChangedEvent, {
      detail: { matterId },
    })
  );
}

export function useReviewDemoState(matter: Matter) {
  const [state, dispatch] = useReducer(reviewReducer, matter, resolveReviewDemoState);

  useEffect(() => {
    persistReviewDemoState(matter.id, state);
  }, [matter.id, state]);

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
