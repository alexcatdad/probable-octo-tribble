import { CheckCheck, Clock3, X } from "lucide-react";
import type { Finding } from "@/lib/types/legal-demo";

interface SuggestedEditCardProps {
  finding?: Finding;
  clauseLabel?: string;
  onAcceptSuggestion: (findingId: string) => void;
  onRejectSuggestion: (findingId: string) => void;
  onMarkNeedsFollowUp: (findingId: string) => void;
}

export function SuggestedEditCard({
  finding,
  clauseLabel,
  onAcceptSuggestion,
  onRejectSuggestion,
  onMarkNeedsFollowUp,
}: SuggestedEditCardProps) {
  const decisionPresentation =
    finding?.decision.kind === "accepted"
      ? {
          label: "Accepted",
          tone:
            "border-[rgba(86,114,94,0.24)] bg-[rgba(86,114,94,0.12)] text-emerald-950",
        }
      : finding?.decision.kind === "rejected"
        ? {
            label: "Rejected",
            tone:
              "border-[rgba(166,100,97,0.22)] bg-[rgba(166,100,97,0.12)] text-rose-950",
          }
        : finding?.decision.kind === "needs_follow_up"
          ? {
              label: "Needs follow-up",
              tone:
                "border-[rgba(63,83,115,0.18)] bg-[rgba(63,83,115,0.1)] text-slate-950",
            }
          : {
              label: "Pending decision",
              tone:
                "border-[rgba(157,115,74,0.22)] bg-[rgba(157,115,74,0.1)] text-amber-950",
            };

  if (!finding) {
    return (
      <section className="panel-surface rounded-[1.6rem] border border-slate-900/10 px-5 py-5 text-slate-600">
        Select a finding to inspect the current language and proposed text.
      </section>
    );
  }

  return (
    <section className="panel-surface rounded-[1.6rem] border border-slate-900/10 px-5 py-5">
      <div className="mb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="section-kicker">
            Suggested edit
          </p>
          <span
            className={`calm-transition rounded-full border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${decisionPresentation.tone}`}
          >
            {decisionPresentation.label}
          </span>
        </div>
        <h2 className="mt-3 font-heading text-[1.85rem] leading-none tracking-[-0.05em] text-slate-950">
          {finding.suggestedEdit.summary}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {clauseLabel}. The recommendation stays reversible while the source and
          proposed language remain side by side.
        </p>
      </div>

      <div className="grid gap-3">
        <article className="calm-transition rounded-[1.25rem] border border-[rgba(166,100,97,0.22)] bg-[rgba(166,100,97,0.08)] px-4 py-4">
          <p className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-rose-900">
            Current text
          </p>
          <p className="mt-3 text-sm leading-6 text-rose-950">
            {finding.suggestedEdit.beforeText}
          </p>
        </article>

        <article className="calm-transition rounded-[1.25rem] border border-[rgba(86,114,94,0.24)] bg-[rgba(86,114,94,0.1)] px-4 py-4">
          <p className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-emerald-900">
            Proposed text
          </p>
          <p className="mt-3 text-sm leading-6 text-emerald-950">
            {finding.suggestedEdit.afterText}
          </p>
        </article>
      </div>

      <div className="mt-4 rounded-[1.2rem] border border-slate-900/10 bg-[rgba(255,255,255,0.68)] px-4 py-4">
        <p className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-slate-500">
          Reviewer rationale
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          {finding.suggestedEdit.rationale}
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => onAcceptSuggestion(finding.id)}
          className="calm-transition calm-hover-lift inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-medium text-white shadow-[0_16px_34px_-24px_rgba(23,32,51,0.72)] hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
        >
          <CheckCheck className="size-4" />
          Accept suggestion
        </button>
        <button
          type="button"
          onClick={() => onRejectSuggestion(finding.id)}
          className="calm-transition inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[rgba(166,100,97,0.24)] bg-[rgba(166,100,97,0.08)] px-4 text-sm font-medium text-rose-950 hover:bg-[rgba(166,100,97,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
        >
          <X className="size-4" />
          Reject suggestion
        </button>
        <button
          type="button"
          onClick={() => onMarkNeedsFollowUp(finding.id)}
          className="calm-transition inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[rgba(63,83,115,0.16)] bg-white/80 px-4 text-sm font-medium text-slate-800 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          <Clock3 className="size-4" />
          Needs follow-up
        </button>
      </div>
    </section>
  );
}
