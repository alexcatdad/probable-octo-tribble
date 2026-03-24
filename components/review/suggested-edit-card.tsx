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
  if (!finding) {
    return (
      <section className="rounded-[1.55rem] border border-slate-900/10 bg-white/90 px-5 py-5 text-slate-600 shadow-[0_18px_60px_-50px_rgba(23,32,51,0.45)]">
        Select a finding to inspect the current language and proposed text.
      </section>
    );
  }

  return (
    <section className="rounded-[1.55rem] border border-slate-900/10 bg-white/92 px-5 py-5 shadow-[0_18px_60px_-50px_rgba(23,32,51,0.45)]">
      <div className="mb-4">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
          Suggested edit
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-slate-950">
          {finding.suggestedEdit.summary}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {clauseLabel}. The recommendation stays reversible while the source and
          proposed language remain side by side.
        </p>
      </div>

      <div className="grid gap-3">
        <article className="rounded-[1.2rem] border border-rose-200/80 bg-rose-50/75 px-4 py-4">
          <p className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-rose-900">
            Current text
          </p>
          <p className="mt-3 text-sm leading-6 text-rose-950">
            {finding.suggestedEdit.beforeText}
          </p>
        </article>

        <article className="rounded-[1.2rem] border border-emerald-200/80 bg-emerald-50/75 px-4 py-4">
          <p className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-emerald-900">
            Proposed text
          </p>
          <p className="mt-3 text-sm leading-6 text-emerald-950">
            {finding.suggestedEdit.afterText}
          </p>
        </article>
      </div>

      <div className="mt-4 rounded-[1.15rem] border border-slate-900/10 bg-slate-50 px-4 py-4">
        <p className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-slate-500">
          Reviewer rationale
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          {finding.suggestedEdit.rationale}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onAcceptSuggestion(finding.id)}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-emerald-700 px-4 text-sm font-medium text-white shadow-[0_12px_24px_-18px_rgba(4,120,87,0.65)] transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          Accept suggestion
        </button>
        <button
          type="button"
          onClick={() => onRejectSuggestion(finding.id)}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-4 text-sm font-medium text-rose-900 transition-colors hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
        >
          Reject suggestion
        </button>
        <button
          type="button"
          onClick={() => onMarkNeedsFollowUp(finding.id)}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          Needs follow-up
        </button>
      </div>
    </section>
  );
}
