"use client";

import { useState } from "react";
import type { Clause, Comment } from "@/lib/types/legal-demo";
import { cn, formatTimestamp, pluralise } from "@/lib/utils";

interface CommentsPanelProps {
  className?: string;
  clause?: Clause;
  comments: Comment[];
  onAddComment: (clauseId: string, body: string) => void;
  onUpdateCommentStatus: (commentId: string, status: Comment["status"]) => void;
}

function commentStatusTone(status: Comment["status"]) {
  switch (status) {
    case "open":
      return "border-[var(--tone-warning-border)] bg-[var(--tone-warning)] text-[var(--tone-warning-text)]";
    case "waiting_on_partner":
      return "border-[var(--tone-info-border)] bg-[var(--tone-info)] text-[var(--tone-info-text)]";
    case "resolved":
      return "border-[var(--tone-success-border)] bg-[var(--tone-success)] text-[var(--tone-success-text)]";
  }
}

function commentStatusLabel(status: Comment["status"]) {
  switch (status) {
    case "open":
      return "Open";
    case "waiting_on_partner":
      return "Waiting on partner";
    case "resolved":
      return "Resolved";
  }
}

export function CommentsPanel({
  className,
  clause,
  comments,
  onAddComment,
  onUpdateCommentStatus,
}: CommentsPanelProps) {
  const [draft, setDraft] = useState("");

  if (!clause) {
    return null;
  }

  return (
    <section className={cn("glass-tile rounded-2xl px-[var(--tile-inset)] py-5", className)}>
      <div className="mb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="section-kicker">Comments</p>
          <span className="rounded-full border border-[var(--glass-border-hover)] bg-[var(--glass-3)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            {pluralise(comments.length, "note")}
          </span>
        </div>
        <h2 className="mt-3 font-heading text-[1.85rem] leading-none tracking-[-0.05em]">
          Clause discussion
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
          Keep reviewer notes specific to fallback position, partner guidance, or
          negotiation posture for {clause.title.toLowerCase()}.
        </p>
      </div>

      <form
        className="rounded-[1.3rem] border border-[var(--glass-border)] bg-[rgba(255,255,255,0.52)] px-4 py-4"
        onSubmit={(event) => {
          event.preventDefault();
          const nextComment = draft.trim();
          if (!nextComment) return;
          onAddComment(clause.id, nextComment);
          setDraft("");
        }}
      >
        <label
          htmlFor="active-clause-comment"
          className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]"
        >
          Comment for active clause
        </label>
        <textarea
          id="active-clause-comment"
          rows={4}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Request partner input, note fallback drafting, or record negotiation guidance."
          className="calm-transition mt-3 w-full rounded-[1rem] border border-[var(--glass-border)] bg-[rgba(255,255,255,0.68)] px-3 py-3 text-sm leading-6 shadow-[inset_0_1px_2px_rgba(74,54,33,0.08)] outline-none ring-0 placeholder:text-[var(--muted-foreground)]/50 focus-visible:border-[var(--glass-border-hover)]"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs leading-5 text-[var(--muted-foreground)]">
            Comments append to the clause activity trail immediately.
          </p>
          <button
            type="submit"
            className="calm-transition calm-hover-lift inline-flex min-h-10 w-full items-center justify-center rounded-full bg-[var(--foreground)] px-4 text-sm font-semibold text-[var(--background)] hover:shadow-[0_18px_40px_-24px_rgba(58,39,17,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-bronze)] sm:w-auto"
          >
            Add comment
          </button>
        </div>
      </form>

      <div aria-live="polite" className="mt-4 space-y-3">
        {comments.map((comment) => (
          <article
            key={comment.id}
            className="calm-transition rounded-[1.3rem] border border-[var(--glass-border)] bg-[rgba(255,255,255,0.52)] px-4 py-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className={`rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] ${commentStatusTone(comment.status)}`}>
                {commentStatusLabel(comment.status)}
              </span>
              <span className="text-xs text-[var(--muted-foreground)]">
                {formatTimestamp(comment.createdAt)}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">{comment.body}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {comment.status !== "waiting_on_partner" ? (
                <button
                  type="button"
                  onClick={() => onUpdateCommentStatus(comment.id, "waiting_on_partner")}
                  className="calm-transition rounded-full border border-[var(--tone-info-border)] bg-[var(--tone-info)] px-3 py-1.5 text-xs font-medium text-[var(--tone-info-text)] hover:bg-[rgba(90,143,191,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-bronze)]"
                >
                  Waiting on partner
                </button>
              ) : null}
              {comment.status !== "resolved" ? (
                <button
                  type="button"
                  onClick={() => onUpdateCommentStatus(comment.id, "resolved")}
                  className="calm-transition rounded-full border border-[var(--tone-success-border)] bg-[var(--tone-success)] px-3 py-1.5 text-xs font-medium text-[var(--tone-success-text)] hover:bg-[rgba(94,166,122,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-bronze)]"
                >
                  Resolve comment
                </button>
              ) : null}
              {comment.status !== "open" ? (
                <button
                  type="button"
                  onClick={() => onUpdateCommentStatus(comment.id, "open")}
                  className="calm-transition rounded-full border border-[var(--glass-border-hover)] bg-[var(--glass-3)] px-3 py-1.5 text-xs font-medium hover:bg-[var(--glass-3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-bronze)]"
                >
                  Reopen comment
                </button>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
