import Link from "next/link";
import type { AgentRun, Matter, ReviewSummary } from "@/lib/types/legal-demo";
import { cn, formatTimestamp } from "@/lib/utils";

function describeActiveRun(run?: AgentRun) {
  if (!run) {
    return {
      label: "No active run",
      detail: "No automated pass is currently attached to this workspace.",
      tone: "border-[var(--tone-neutral-border)] bg-[var(--tone-neutral)] text-[var(--muted-foreground)]",
    };
  }

  switch (run.status.kind) {
    case "needs_human_review":
      return {
        label: "Needs human review",
        detail: run.status.note,
        tone: "border-[var(--tone-warning-border)] bg-[var(--tone-warning)] text-[var(--tone-warning-text)]",
      };
    case "superseded":
      return {
        label: "Superseded",
        detail: run.status.reason,
        tone: "border-[var(--tone-neutral-border)] bg-[var(--tone-neutral)] text-[var(--muted-foreground)]",
      };
    case "completed":
      return {
        label: "Completed",
        detail: run.status.outputSummary,
        tone: "border-[var(--tone-success-border)] bg-[var(--tone-success)] text-[var(--tone-success-text)]",
      };
  }
}

interface ReviewTopbarProps {
  className?: string;
  matter: Matter;
  activeRun?: AgentRun;
  summary: ReviewSummary;
  pendingDecisionCount: number;
  progressPercent: number;
  reviewProgressLabel: string;
}

export function ReviewTopbar({
  className,
  matter,
  activeRun,
  summary,
  pendingDecisionCount,
  progressPercent,
  reviewProgressLabel,
}: ReviewTopbarProps) {
  const runPresentation = describeActiveRun(activeRun);

  return (
    <section className={cn("glass-tile overflow-hidden rounded-2xl", className)}>
      <div className="grid gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:items-start">
        <div className="space-y-5">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
            <Link href={`/matters/${matter.id}`} className="hover:text-[var(--foreground)]">
              Matter
            </Link>
            <span aria-hidden="true" className="opacity-30">/</span>
            <span>{matter.title}</span>
            <span aria-hidden="true" className="opacity-30">/</span>
            <span className="text-[var(--foreground)]">Review workspace</span>
          </nav>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[var(--glass-border-hover)] bg-[var(--glass-3)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                Contract review
              </span>
              <span
                className={`rounded-full border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${runPresentation.tone}`}
              >
                {runPresentation.label}
              </span>
            </div>

            <div>
              <h1
                className="text-3xl font-semibold tracking-[-0.05em] sm:text-[2.55rem]"
                style={{ viewTransitionName: "document-title" }}
              >
                {matter.document.title}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted-foreground)] sm:text-[0.95rem]">
                Version {matter.document.version} is under clause-by-clause review
                for {matter.clientName}. All automated findings remain visible, cited,
                and fully reversible until partner sign-off.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Review progress", value: reviewProgressLabel },
              { label: "Pending findings", value: pendingDecisionCount },
              { label: "Open comments", value: summary.unresolvedCommentCount },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-1)] px-4 py-4">
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  {stat.label}
                </p>
                <p className="mt-2 text-lg font-semibold tracking-[-0.04em]">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-1)] px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  Active reviewers
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Partner, associate, and reviewer status remains visible throughout
                  the triage process.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {matter.collaborators.map((collaborator) => {
                  const waitingStatus =
                    collaborator.status.kind === "waiting"
                      ? collaborator.status
                      : null;
                  return (
                    <article
                      key={collaborator.id}
                      className="min-w-[180px] rounded-xl border border-[var(--glass-border)] bg-[var(--glass-2)] px-3 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--glass-3)] text-xs font-semibold">
                          {collaborator.initials}
                          <span
                            className={`absolute right-0 top-0 flex size-3.5 items-center justify-center rounded-full border-2 border-[#0c1017] text-[6px] font-bold ${
                              waitingStatus
                                ? "bg-amber-400 text-amber-950"
                                : "bg-emerald-400 text-emerald-950"
                            }`}
                            aria-label={waitingStatus ? `Waiting on ${waitingStatus.waitingOn}` : "Active"}
                            title={waitingStatus ? `Waiting on ${waitingStatus.waitingOn}` : "Active"}
                          >
                            {waitingStatus ? "!" : ""}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold">{collaborator.name}</p>
                          <p className="text-[0.68rem] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                            {collaborator.title}
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 text-xs leading-5 text-[var(--muted-foreground)]">
                        {waitingStatus
                          ? `Waiting on ${waitingStatus.waitingOn} since ${formatTimestamp(waitingStatus.since)}.`
                          : "Active in the current review window."}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <aside className="glass-tile-strong space-y-4 rounded-xl px-6 py-5">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              Current agent pass
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em]">
              {activeRun?.name ?? "No active run"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
              {runPresentation.detail}
            </p>
          </div>

          <div className="space-y-2 border-t border-[var(--glass-border)] pt-4 text-sm">
            {[
              { label: "Accepted", value: summary.acceptedCount },
              { label: "Needs follow-up", value: summary.needsFollowUpCount },
              { label: "Rejected", value: summary.rejectedCount },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-3">
                <span className="text-[var(--muted-foreground)]">{row.label}</span>
                <span className="font-medium">{row.value}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3 border-t border-[var(--glass-border)] pt-4">
            <div className="flex items-center justify-between gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              <span>Decision coverage</span>
              <span>{progressPercent}%</span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Decision coverage: ${progressPercent}%`}
              className="h-2.5 overflow-hidden rounded-full bg-[var(--glass-3)]"
            >
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,var(--tone-success-text),var(--accent-bronze))]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs leading-5 text-[var(--muted-foreground)]">
              Every decision preserves the source text, rationale, and clause citation,
              enabling reviewers to reverse course without losing context.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
