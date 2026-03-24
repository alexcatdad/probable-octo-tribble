"use client";

import { useState } from "react";
import type { Clause, Comment } from "@/lib/types/legal-demo";

interface CommentsPanelProps {
  clause?: Clause;
  comments: Comment[];
  onAddComment: (clauseId: string, body: string) => void;
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

export function CommentsPanel({
  clause,
  comments,
  onAddComment,
}: CommentsPanelProps) {
  const [draft, setDraft] = useState("");

  if (!clause) {
    return null;
  }

  return (
    <section className="rounded-[1.55rem] border border-slate-900/10 bg-white/88 px-5 py-5 shadow-[0_18px_60px_-50px_rgba(23,32,51,0.45)]">
      <div className="mb-4">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
          Comments
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-slate-950">
          Clause discussion
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Keep reviewer notes specific to fallback position, partner guidance, or
          negotiation posture for {clause.title.toLowerCase()}.
        </p>
      </div>

      <form
        className="rounded-[1.25rem] border border-slate-900/10 bg-slate-50 px-4 py-4"
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
          className="mt-3 w-full rounded-[1rem] border border-slate-900/10 bg-white px-3 py-3 text-sm leading-6 text-slate-800 shadow-inner outline-none ring-0 placeholder:text-slate-400 focus-visible:border-slate-400"
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs leading-5 text-slate-500">
            Comments append to the clause activity trail immediately.
          </p>
          <button
            type="submit"
            className="inline-flex min-h-10 items-center justify-center rounded-full bg-slate-950 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
          >
            Add comment
          </button>
        </div>
      </form>

      <div className="mt-4 space-y-3">
        {comments.map((comment) => (
          <article
            key={comment.id}
            className="rounded-[1.2rem] border border-slate-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(246,243,237,0.92)_100%)] px-4 py-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-amber-900">
                {comment.status}
              </span>
              <span className="text-xs text-slate-500">
                {formatTimestamp(comment.createdAt)} UTC
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-700">{comment.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
