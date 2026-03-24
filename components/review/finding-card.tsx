import { cn } from "@/lib/utils";
import type { Finding } from "@/lib/types/legal-demo";

function severityTone(severity: Finding["severity"]) {
  switch (severity) {
    case "high":
      return "border-rose-200/80 bg-rose-50 text-rose-950";
    case "medium":
      return "border-amber-200/80 bg-amber-50 text-amber-950";
    case "low":
      return "border-sky-200/80 bg-sky-50 text-sky-950";
  }
}

function decisionTone(decision: Finding["decision"]["kind"]) {
  switch (decision) {
    case "accepted":
      return "border-emerald-200/80 bg-emerald-50 text-emerald-950";
    case "rejected":
      return "border-rose-200/80 bg-rose-50 text-rose-950";
    case "needs_follow_up":
      return "border-slate-200/90 bg-slate-100 text-slate-900";
    case "pending":
      return "border-slate-700/60 bg-slate-900/40 text-slate-200";
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
  onSelect: () => void;
}

export function FindingCard({
  finding,
  clauseLabel,
  isSelected,
  onSelect,
}: FindingCardProps) {
  return (
    <article
      className={cn(
        "rounded-[1.2rem] border transition-colors",
        isSelected
          ? "border-amber-300/60 bg-white text-slate-950 shadow-[0_16px_40px_-30px_rgba(209,153,74,0.48)]"
          : "border-white/10 bg-white/5 text-slate-100 hover:border-white/20 hover:bg-white/8",
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        className="block w-full rounded-[1.2rem] px-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <span
            className={`rounded-full border px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] ${isSelected ? severityTone(finding.severity) : "border-white/10 bg-white/10 text-slate-200"}`}
          >
            {finding.severity}
          </span>
          <span
            className={`rounded-full border px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] ${isSelected ? decisionTone(finding.decision.kind) : "border-white/10 bg-white/10 text-slate-200"}`}
          >
            {decisionLabel(finding.decision.kind)}
          </span>
        </div>

        <h3 className="mt-3 text-sm font-semibold leading-6">{finding.title}</h3>
        <p
          className={cn(
            "mt-2 text-xs uppercase tracking-[0.16em]",
            isSelected ? "text-slate-500" : "text-slate-400",
          )}
        >
          {clauseLabel}
        </p>
        <p
          className={cn(
            "mt-3 text-sm leading-6",
            isSelected ? "text-slate-600" : "text-slate-300",
          )}
        >
          {finding.rationale}
        </p>
        <div
          className={cn(
            "mt-4 rounded-[1rem] border px-3 py-3 text-xs leading-5",
            isSelected
              ? "border-slate-900/10 bg-slate-50 text-slate-600"
              : "border-white/10 bg-white/5 text-slate-300",
          )}
        >
          <p className="font-semibold uppercase tracking-[0.16em]">Citation</p>
          <p className="mt-1">{finding.citation}</p>
        </div>
      </button>
    </article>
  );
}
