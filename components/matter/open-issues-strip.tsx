interface OpenIssuesStripProps {
  flaggedClauseCount: number;
  unresolvedCommentCount: number;
  pendingDecisionCount: number;
}

const issueItems = [
  {
    key: "flaggedClauseCount",
    label: "Flagged clauses",
    tone: "text-rose-900 bg-rose-50 border-rose-200/80",
    note: "Machine-flagged passages that need legal judgment.",
  },
  {
    key: "unresolvedCommentCount",
    label: "Unresolved comments",
    tone: "text-amber-900 bg-amber-50 border-amber-200/80",
    note: "Open internal notes still waiting on response.",
  },
  {
    key: "pendingDecisionCount",
    label: "Pending decisions",
    tone: "text-slate-900 bg-slate-100 border-slate-200/90",
    note: "Findings that have not been accepted, rejected, or deferred.",
  },
] as const;

export function OpenIssuesStrip({
  flaggedClauseCount,
  unresolvedCommentCount,
  pendingDecisionCount,
}: OpenIssuesStripProps) {
  const values = {
    flaggedClauseCount,
    unresolvedCommentCount,
    pendingDecisionCount,
  };

  return (
    <section className="rounded-[1.5rem] border border-slate-900/10 bg-white/85 px-4 py-4 shadow-[0_18px_60px_-50px_rgba(23,32,51,0.45)] sm:px-5">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
            Open issues
          </p>
          <p className="mt-1 text-sm text-slate-600">
            A quick read on what still blocks this matter from moving forward.
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {issueItems.map((item) => (
          <article
            key={item.key}
            className={`rounded-[1.2rem] border px-4 py-4 ${item.tone}`}
          >
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em]">
              {item.label}
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
              {values[item.key]}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
