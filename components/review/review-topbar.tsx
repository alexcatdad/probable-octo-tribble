import Link from "next/link";
import { memo } from "react";
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

export const ReviewTopbar = memo(function ReviewTopbar({
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
    <section
      className={cn("glass-tile overflow-hidden rounded-2xl", className)}
    >
      <div className="grid gap-6 px-[var(--tile-inset)] py-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)] lg:items-start">
        <div className="space-y-5">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]"
          >
            <Link
              href={`/matters/${matter.id}`}
              className="hover:text-[var(--foreground)]"
            >
              Matter
            </Link>
            <span aria-hidden="true" className="opacity-30">
              /
            </span>
            <span>{matter.title}</span>
            <span aria-hidden="true" className="opacity-30">
              /
            </span>
            <span className="text-[var(--foreground)]">Review workspace</span>
          </nav>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[var(--glass-border-hover)] bg-[rgba(255,255,255,0.56)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                Document review
              </span>
              <span
                className={`rounded-full border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${runPresentation.tone}`}
              >
                {runPresentation.label}
              </span>
            </div>

            <div>
              <h1 className="document-type text-[2.7rem] leading-[0.96] tracking-[-0.06em] sm:text-[3.2rem]">
                {matter.document.title}
              </h1>
              <p className="mt-3 max-w-3xl text-[1rem] leading-7 text-[var(--muted-foreground)]">
                {pendingDecisionCount} findings need final decisions before
                partner sign-off. Review the cited clause language, compare the
                edit, and record the right call without losing context.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Review progress", value: reviewProgressLabel },
              { label: "Pending findings", value: pendingDecisionCount },
              { label: "Open comments", value: summary.unresolvedCommentCount },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-[1.4rem] border border-[var(--glass-border)] bg-[rgba(255,255,255,0.52)] px-4 py-4"
              >
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  {stat.label}
                </p>
                <p className="mt-2 text-lg font-semibold tracking-[-0.04em]">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-[1.5rem] border border-[var(--glass-border)] bg-[rgba(255,255,255,0.5)] px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  Active reviewers
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Human ownership stays visible while the queue moves toward a
                  final call.
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
                      className="min-w-[180px] rounded-[1.2rem] border border-[var(--glass-border)] bg-[rgba(255,255,255,0.6)] px-3 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-[rgba(255,255,255,0.82)] text-xs font-semibold">
                          {collaborator.initials}
                          <span
                            role="status"
                            className={`absolute right-0 top-0 flex size-3.5 items-center justify-center rounded-full border-2 border-[#fffaf4] text-[6px] font-bold ${
                              waitingStatus
                                ? "bg-amber-400 text-amber-950"
                                : "bg-emerald-400 text-emerald-950"
                            }`}
                            aria-label={
                              waitingStatus
                                ? `Waiting on ${waitingStatus.waitingOn}`
                                : "Active"
                            }
                            title={
                              waitingStatus
                                ? `Waiting on ${waitingStatus.waitingOn}`
                                : "Active"
                            }
                          >
                            {waitingStatus ? "!" : ""}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold">
                            {collaborator.name}
                          </p>
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

        <aside className="glass-tile-strong space-y-4 rounded-[1.6rem] px-6 py-5">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              Current pass
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
              <div
                key={row.label}
                className="flex items-center justify-between gap-3"
              >
                <span className="text-[var(--muted-foreground)]">
                  {row.label}
                </span>
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
              className="h-2.5 overflow-hidden rounded-full bg-[rgba(123,101,72,0.08)]"
            >
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,var(--tone-success-text),var(--accent-bronze))]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs leading-5 text-[var(--muted-foreground)]">
              The queue stays readable because the citation, edit, and decision
              all live close to the clause they affect.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
});
