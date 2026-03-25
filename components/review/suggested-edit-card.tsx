import { CheckCheck, Clock3, X } from "lucide-react";
import type { Finding } from "@/lib/types/legal-demo";
import { cn } from "@/lib/utils";

interface SuggestedEditCardProps {
  className?: string;
  finding?: Finding;
  clauseLabel?: string;
  onAcceptSuggestion: (findingId: string) => void;
  onRejectSuggestion: (findingId: string) => void;
  onMarkNeedsFollowUp: (findingId: string) => void;
}

export function SuggestedEditCard({
  className,
  finding,
  clauseLabel,
  onAcceptSuggestion,
  onRejectSuggestion,
  onMarkNeedsFollowUp,
}: SuggestedEditCardProps) {
  const decisionPresentation =
    finding?.decision.kind === "accepted"
      ? { label: "Accepted", tone: "border-[var(--tone-success-border)] bg-[var(--tone-success)] text-[var(--tone-success-text)]" }
      : finding?.decision.kind === "rejected"
        ? { label: "Rejected", tone: "border-[var(--tone-danger-border)] bg-[var(--tone-danger)] text-[var(--tone-danger-text)]" }
        : finding?.decision.kind === "needs_follow_up"
          ? { label: "Needs follow-up", tone: "border-[var(--tone-neutral-border)] bg-[var(--tone-neutral)] text-[var(--muted-foreground)]" }
          : { label: "Pending decision", tone: "border-[var(--tone-warning-border)] bg-[var(--tone-warning)] text-[var(--tone-warning-text)]" };

  if (!finding) {
    return (
      <section className={cn("glass-tile rounded-2xl px-6 py-5 text-[var(--muted-foreground)]", className)}>
        Select a finding to inspect the current language and proposed text.
      </section>
    );
  }

  return (
    <section aria-label="Suggested edit" className={cn("glass-tile rounded-2xl px-6 py-5", className)}>
      <div className="mb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="section-kicker">Suggested edit</p>
          <span
            aria-live="polite"
            className={`calm-transition rounded-full border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${decisionPresentation.tone}`}
          >
            {decisionPresentation.label}
          </span>
        </div>
        <h2 className="mt-3 font-heading text-[1.85rem] leading-none tracking-[-0.05em]">
          {finding.suggestedEdit.summary}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
          {clauseLabel}. This recommendation remains reversible while the source
          and proposed language are presented side by side.
        </p>
      </div>

      <div className="grid gap-3">
        <article className="calm-transition rounded-xl border border-[var(--tone-danger-border)] bg-[var(--tone-danger)] px-4 py-4">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--tone-danger-text)]">
            Current text
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--tone-danger-text)]">
            {finding.suggestedEdit.beforeText}
          </p>
        </article>

        <article className="calm-transition rounded-xl border border-[var(--tone-success-border)] bg-[var(--tone-success)] px-4 py-4">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--tone-success-text)]">
            Proposed text
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--tone-success-text)]">
            {finding.suggestedEdit.afterText}
          </p>
        </article>
      </div>

      <div className="mt-4 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-1)] px-4 py-4">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
          Reviewer rationale
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
          {finding.suggestedEdit.rationale}
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => onAcceptSuggestion(finding.id)}
          className="calm-transition calm-hover-lift inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-[#0c1017] shadow-[0_0_24px_-8px_rgba(201,149,106,0.3)] hover:shadow-[0_0_32px_-6px_rgba(201,149,106,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-bronze)]"
        >
          <CheckCheck className="size-4" />
          Accept
        </button>
        <button
          type="button"
          onClick={() => onRejectSuggestion(finding.id)}
          className="calm-transition inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--tone-danger-border)] bg-[var(--tone-danger)] px-4 text-sm font-medium text-[var(--tone-danger-text)] hover:bg-[rgba(224,94,94,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--destructive)]"
        >
          <X className="size-4" />
          Reject
        </button>
        <button
          type="button"
          onClick={() => onMarkNeedsFollowUp(finding.id)}
          className="calm-transition inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--glass-border-hover)] bg-[var(--glass-3)] px-4 text-sm font-medium hover:bg-[var(--glass-3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-bronze)]"
        >
          <Clock3 className="size-4" />
          Follow-up
        </button>
      </div>
    </section>
  );
}
