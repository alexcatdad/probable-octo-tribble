interface OpenIssuesStripProps {
  flaggedClauseCount: number;
  unresolvedCommentCount: number;
  pendingDecisionCount: number;
}

const issueItems = [
  {
    key: "flaggedClauseCount",
    label: "Flagged clauses",
    tone:
      "border-[rgba(166,100,97,0.22)] bg-[rgba(166,100,97,0.08)] text-rose-950",
    note: "Machine-flagged passages that need legal judgment.",
  },
  {
    key: "unresolvedCommentCount",
    label: "Unresolved comments",
    tone:
      "border-[rgba(157,115,74,0.24)] bg-[rgba(157,115,74,0.1)] text-amber-950",
    note: "Open internal notes still waiting on response.",
  },
  {
    key: "pendingDecisionCount",
    label: "Pending decisions",
    tone:
      "border-[rgba(63,83,115,0.18)] bg-[rgba(63,83,115,0.08)] text-slate-950",
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
    <section className="panel-surface overflow-hidden rounded-[1.6rem] border border-slate-900/10 px-4 py-4 sm:px-5">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <p className="section-kicker">
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
            className={`calm-transition rounded-[1.25rem] border px-4 py-4 ${item.tone}`}
          >
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em]">
              {item.label}
            </p>
            <p className="mt-2 font-heading text-[2.4rem] leading-none tracking-[-0.05em]">
              {values[item.key]}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
