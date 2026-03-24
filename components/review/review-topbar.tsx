import Link from "next/link";
import type { AgentRun, Matter, ReviewSummary } from "@/lib/types/legal-demo";

function describeActiveRun(run?: AgentRun) {
  if (!run) {
    return {
      label: "No active run",
      detail: "No machine pass is currently attached to this workspace.",
      tone: "border-slate-700/70 bg-slate-900/50 text-slate-100",
    };
  }

  switch (run.status.kind) {
    case "needs_human_review":
      return {
        label: "Needs human review",
        detail: run.status.note,
        tone: "border-amber-200/80 bg-amber-50 text-amber-950",
      };
    case "superseded":
      return {
        label: "Superseded",
        detail: run.status.reason,
        tone: "border-stone-200/80 bg-stone-100 text-stone-900",
      };
    case "completed":
      return {
        label: "Completed",
        detail: run.status.outputSummary,
        tone: "border-emerald-200/80 bg-emerald-50 text-emerald-950",
      };
  }
}

interface ReviewTopbarProps {
  matter: Matter;
  activeRun?: AgentRun;
  summary: ReviewSummary;
  pendingDecisionCount: number;
  progressPercent: number;
  reviewProgressLabel: string;
}

export function ReviewTopbar({
  matter,
  activeRun,
  summary,
  pendingDecisionCount,
  progressPercent,
  reviewProgressLabel,
}: ReviewTopbarProps) {
  const runPresentation = describeActiveRun(activeRun);

  return (
    <section className="overflow-hidden rounded-[1.8rem] border border-slate-900/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.97)_0%,rgba(247,243,235,0.96)_58%,rgba(235,229,219,0.98)_100%)] shadow-[0_28px_80px_-58px_rgba(23,32,51,0.6)]">
      <div className="grid gap-6 px-6 py-6 sm:px-7 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:items-start">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
            <Link href={`/matters/${matter.id}`} className="hover:text-slate-950">
              Matter
            </Link>
            <span className="text-slate-300">/</span>
            <span>{matter.title}</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900">Review workspace</span>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-slate-900/10 bg-white/85 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-600">
                Contract review
              </span>
              <span
                className={`rounded-full border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${runPresentation.tone}`}
              >
                {runPresentation.label}
              </span>
            </div>

            <div>
              <h1 className="text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-[2.55rem]">
                {matter.document.title}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-[0.95rem]">
                Version {matter.document.version} is under clause-by-clause review
                for {matter.clientName}. Machine findings stay visible, cited, and
                reversible until partner sign-off.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.2rem] border border-slate-900/10 bg-white/80 px-4 py-4">
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-slate-500">
                Review progress
              </p>
              <p className="mt-2 text-lg font-semibold tracking-[-0.04em] text-slate-950">
                {reviewProgressLabel}
              </p>
            </div>
            <div className="rounded-[1.2rem] border border-slate-900/10 bg-white/80 px-4 py-4">
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-slate-500">
                Pending findings
              </p>
              <p className="mt-2 text-lg font-semibold tracking-[-0.04em] text-slate-950">
                {pendingDecisionCount}
              </p>
            </div>
            <div className="rounded-[1.2rem] border border-slate-900/10 bg-white/80 px-4 py-4">
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-slate-500">
                Open comments
              </p>
              <p className="mt-2 text-lg font-semibold tracking-[-0.04em] text-slate-950">
                {summary.unresolvedCommentCount}
              </p>
            </div>
          </div>
        </div>

        <aside className="space-y-4 rounded-[1.45rem] border border-slate-900/10 bg-slate-950 px-5 py-5 text-slate-100">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-slate-400">
              Current agent pass
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em]">
              {activeRun?.name ?? "No active run"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {runPresentation.detail}
            </p>
          </div>

          <div className="space-y-3 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-slate-400">Accepted</span>
              <span className="font-medium text-slate-100">
                {summary.acceptedCount}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-slate-400">Needs follow-up</span>
              <span className="font-medium text-slate-100">
                {summary.needsFollowUpCount}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-slate-400">Rejected</span>
              <span className="font-medium text-slate-100">
                {summary.rejectedCount}
              </span>
            </div>
          </div>

          <div className="space-y-3 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
              <span>Decision coverage</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,rgba(142,182,144,0.95),rgba(194,150,106,0.95))]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs leading-5 text-slate-400">
              Each action keeps the source text, rationale, and clause citation in
              view so reviewers can reverse course without losing context.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
