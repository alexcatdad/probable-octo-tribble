import { cn } from "@/lib/utils";

interface OpenIssuesStripProps {
  className?: string;
  flaggedClauseCount: number;
  unresolvedCommentCount: number;
  pendingDecisionCount: number;
}

const issueItems = [
  {
    key: "flaggedClauseCount",
    label: "Flagged clauses",
    tone: "border-[var(--tone-danger-border)] bg-[var(--tone-danger)] text-[var(--tone-danger-text)]",
    note: "Passages identified by automated analysis requiring legal judgment.",
  },
  {
    key: "unresolvedCommentCount",
    label: "Unresolved comments",
    tone: "border-[var(--tone-warning-border)] bg-[var(--tone-warning)] text-[var(--tone-warning-text)]",
    note: "Open internal notes still waiting on response.",
  },
  {
    key: "pendingDecisionCount",
    label: "Pending decisions",
    tone: "border-[var(--tone-info-border)] bg-[var(--tone-info)] text-[var(--tone-info-text)]",
    note: "Findings that have not been accepted, rejected, or deferred.",
  },
] as const;

export function OpenIssuesStrip({
  className,
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
    <section className={cn("glass-tile overflow-hidden rounded-2xl px-6 py-5", className)}>
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <p className="section-kicker">
            Open issues
          </p>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            A quick read on what still blocks this matter from moving forward.
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {issueItems.map((item) => (
          <article
            key={item.key}
            className={`calm-transition rounded-xl border px-4 py-4 ${item.tone}`}
          >
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em]">
              {item.label}
            </p>
            <p className="mt-2 font-heading text-[2.4rem] leading-none tracking-[-0.05em] text-[var(--foreground)]">
              {values[item.key]}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{item.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
