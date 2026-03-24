"use client";

import { useState } from "react";
import type { Clause, Comment } from "@/lib/types/legal-demo";

interface CommentsPanelProps {
  clause?: Clause;
  comments: Comment[];
  onAddComment: (clauseId: string, body: string) => void;
  onUpdateCommentStatus: (commentId: string, status: Comment["status"]) => void;
}

function formatTimestamp(timestamp: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(new Date(timestamp));
}

function commentStatusTone(status: Comment["status"]) {
  switch (status) {
    case "open":
      return "border-[rgba(157,115,74,0.24)] bg-[rgba(157,115,74,0.1)] text-amber-900";
    case "waiting_on_partner":
      return "border-[rgba(63,83,115,0.18)] bg-[rgba(63,83,115,0.1)] text-slate-900";
    case "resolved":
      return "border-[rgba(86,114,94,0.24)] bg-[rgba(86,114,94,0.12)] text-emerald-950";
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
    <section className="panel-surface rounded-[1.6rem] border border-slate-900/10 px-5 py-5">
      <div className="mb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="section-kicker">
            Comments
          </p>
          <span className="rounded-full border border-slate-900/10 bg-white/[0.74] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-600">
            {comments.length} note{comments.length === 1 ? "" : "s"}
          </span>
        </div>
        <h2 className="mt-3 font-heading text-[1.85rem] leading-none tracking-[-0.05em] text-slate-950">
          Clause discussion
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Keep reviewer notes specific to fallback position, partner guidance, or
          negotiation posture for {clause.title.toLowerCase()}.
        </p>
      </div>

      <form
        className="rounded-[1.3rem] border border-slate-900/10 bg-[rgba(255,255,255,0.62)] px-4 py-4"
        onSubmit={(event) => {
          event.preventDefault();

          const nextComment = draft.trim();
          if (!nextComment) {
            return;
          }

          onAddComment(clause.id, nextComment);
          setDraft("");
        }}
      >
        <label
          htmlFor="active-clause-comment"
          className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500"
        >
          Comment for active clause
        </label>
        <textarea
          id="active-clause-comment"
          rows={4}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Request partner input, note fallback drafting, or record negotiation guidance."
          className="calm-transition mt-3 w-full rounded-[1rem] border border-slate-900/10 bg-white px-3 py-3 text-sm leading-6 text-slate-800 shadow-[inset_0_1px_2px_rgba(23,32,51,0.05)] outline-none ring-0 focus-visible:border-slate-400"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs leading-5 text-slate-500">
            Comments append to the clause activity trail immediately.
          </p>
          <button
            type="submit"
            className="calm-transition calm-hover-lift inline-flex min-h-10 w-full items-center justify-center rounded-full bg-slate-950 px-4 text-sm font-medium text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 sm:w-auto"
          >
            Add comment
          </button>
        </div>
      </form>

      <div className="mt-4 space-y-3">
        {comments.map((comment) => (
          <article
            key={comment.id}
            className="calm-transition rounded-[1.25rem] border border-slate-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(246,243,237,0.92)_100%)] px-4 py-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span
                className={`rounded-full border px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] ${commentStatusTone(comment.status)}`}
              >
                {commentStatusLabel(comment.status)}
              </span>
              <span className="text-xs text-slate-500">
                {formatTimestamp(comment.createdAt)} UTC
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-700">{comment.body}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {comment.status !== "waiting_on_partner" ? (
                <button
                  type="button"
                  onClick={() =>
                    onUpdateCommentStatus(comment.id, "waiting_on_partner")
                  }
                  className="calm-transition rounded-full border border-[rgba(63,83,115,0.16)] bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                >
                  Waiting on partner
                </button>
              ) : null}
              {comment.status !== "resolved" ? (
                <button
                  type="button"
                  onClick={() => onUpdateCommentStatus(comment.id, "resolved")}
                  className="calm-transition rounded-full border border-[rgba(86,114,94,0.18)] bg-[rgba(86,114,94,0.08)] px-3 py-1.5 text-xs font-medium text-emerald-950 hover:bg-[rgba(86,114,94,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  Resolve comment
                </button>
              ) : null}
              {comment.status !== "open" ? (
                <button
                  type="button"
                  onClick={() => onUpdateCommentStatus(comment.id, "open")}
                  className="calm-transition rounded-full border border-slate-900/10 bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
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
