import type { Finding } from "@/lib/types/legal-demo";
import { cn } from "@/lib/utils";

function severityTone(severity: Finding["severity"]) {
  switch (severity) {
    case "high":
      return "border-[var(--tone-danger-border)] bg-[var(--tone-danger)] text-[var(--tone-danger-text)]";
    case "medium":
      return "border-[var(--tone-warning-border)] bg-[var(--tone-warning)] text-[var(--tone-warning-text)]";
    case "low":
      return "border-[var(--tone-info-border)] bg-[var(--tone-info)] text-[var(--tone-info-text)]";
  }
}

function decisionTone(decision: Finding["decision"]["kind"]) {
  switch (decision) {
    case "accepted":
      return "border-[var(--tone-success-border)] bg-[var(--tone-success)] text-[var(--tone-success-text)]";
    case "rejected":
      return "border-[var(--tone-danger-border)] bg-[var(--tone-danger)] text-[var(--tone-danger-text)]";
    case "needs_follow_up":
      return "border-[var(--tone-neutral-border)] bg-[var(--tone-neutral)] text-[var(--muted-foreground)]";
    case "pending":
      return "border-[var(--tone-warning-border)] bg-[var(--tone-warning)] text-[var(--tone-warning-text)]";
  }
}

function decisionLabel(decision: Finding["decision"]["kind"]) {
  switch (decision) {
    case "accepted":
      return "Accepted";
    case "rejected":
      return "Rejected";
    case "needs_follow_up":
      return "Needs follow-up";
    case "pending":
      return "Pending";
  }
}

interface FindingCardProps {
  finding: Finding;
  clauseLabel: string;
  isSelected: boolean;
  isPreviewed: boolean;
  previewLabel?: string;
  onSelect: () => void;
  onPreviewChange: (isPreviewed: boolean) => void;
}

export function FindingCard({
  finding,
  clauseLabel,
  isSelected,
  isPreviewed,
  previewLabel,
  onSelect,
  onPreviewChange,
}: FindingCardProps) {
  return (
    <article
      className={cn(
        "rounded-[1.3rem] border transition-colors",
        isSelected
          ? "border-[var(--tone-warning-border)] bg-[var(--tone-warning)] shadow-[0_18px_40px_-26px_rgba(184,142,93,0.38)]"
          : isPreviewed
            ? "border-[var(--glass-border-hover)] bg-[var(--glass-3)]"
            : "border-[var(--glass-border)] bg-[rgba(255,255,255,0.54)] hover:border-[var(--glass-border-hover)] hover:bg-[var(--glass-2)]",
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        onMouseEnter={() => onPreviewChange(true)}
        onMouseLeave={() => onPreviewChange(false)}
        onFocus={() => onPreviewChange(true)}
        onBlur={() => onPreviewChange(false)}
        className="block w-full rounded-[1.3rem] px-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-bronze)]"
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <span
            className={`rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] ${severityTone(finding.severity)}`}
          >
            {finding.severity}
          </span>
          <span
            className={`rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] ${decisionTone(finding.decision.kind)}`}
          >
            {decisionLabel(finding.decision.kind)}
          </span>
        </div>
        {isPreviewed && previewLabel ? (
          <p className="mt-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
            {previewLabel}
          </p>
        ) : null}

        <h3 className="mt-3 text-sm font-semibold leading-6">
          {finding.title}
        </h3>
        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
          {clauseLabel}
        </p>
        <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
          {finding.rationale}
        </p>
        <div className="mt-4 rounded-[1rem] border border-[var(--glass-border)] bg-[rgba(255,255,255,0.52)] px-3 py-3 text-xs leading-5 text-[var(--muted-foreground)]">
          <p className="font-semibold uppercase tracking-[0.16em]">Citation</p>
          <p className="mt-1">{finding.citation}</p>
        </div>
      </button>
    </article>
  );
}
