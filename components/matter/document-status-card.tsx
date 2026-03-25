import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import type { ContractDocument, ReviewSummary } from "@/lib/types/legal-demo";
import { cn, pluralise } from "@/lib/utils";

interface DocumentStatusCardProps {
  className?: string;
  document: ContractDocument;
  summary: ReviewSummary;
  reviewHref: string;
}

export function DocumentStatusCard({
  className,
  document,
  summary,
  reviewHref,
}: DocumentStatusCardProps) {
  const clauseCount = document.sections.reduce(
    (total, section) => total + section.clauses.length,
    0
  );
  const progressPercent =
    summary.totalFindings === 0
      ? 0
      : Math.round((summary.reviewedCount / summary.totalFindings) * 100);
  const pendingCount = summary.totalFindings - summary.reviewedCount;

  return (
    <section className={cn("glass-tile overflow-hidden rounded-2xl", className)}>
      <div className="grid gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-7">
        <div className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--glass-border-hover)] bg-[var(--glass-3)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
                <FileText className="size-3.5" />
                Primary document
              </div>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  <span className="rounded-full border border-[var(--glass-border)] bg-[var(--glass-2)] px-3 py-1">
                    Version {document.version}
                  </span>
                  <span>{document.sections.length} sections in scope</span>
                </div>
                <h2
                  className="font-heading text-[2.1rem] leading-none tracking-[-0.05em] sm:text-[2.55rem]"
                  style={{ viewTransitionName: "document-title" }}
                >
                  {document.title}
                </h2>
                <p className="max-w-2xl text-sm leading-6 text-[var(--muted-foreground)] sm:text-[0.96rem]">
                  Version {document.version} is ready for focused clause review.
                  The automated analysis identified {summary.totalFindings} issues
                  across {document.sections.length} sections, with the queue awaiting
                  human decisions.
                </p>
              </div>
            </div>

            <Link
              href={reviewHref}
              className="calm-transition calm-hover-lift inline-flex min-h-11 w-full items-center justify-center gap-2 self-start rounded-full bg-white px-5 text-sm font-semibold text-[#0c1017] shadow-[0_0_30px_-8px_rgba(201,149,106,0.3)] hover:shadow-[0_0_40px_-6px_rgba(201,149,106,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-bronze)] sm:w-auto"
            >
              Open review workspace
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="space-y-3 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-1)] px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="section-kicker">
                Review progress
              </p>
              <p className="text-sm font-medium">
                {summary.reviewedCount} of {summary.totalFindings} decisions recorded
              </p>
            </div>
            <div
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Review progress: ${summary.reviewedCount} of ${summary.totalFindings} decisions recorded`}
              className="h-2.5 overflow-hidden rounded-full bg-[var(--glass-3)]"
            >
              <div
                className="calm-transition h-full rounded-full bg-[linear-gradient(90deg,var(--chart-2),var(--accent-bronze))]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">
              {pendingCount === 0
                ? "All findings have been triaged."
                : `${pluralise(pendingCount, "finding")} still waiting for a decision.`}
            </p>
          </div>

          <dl className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Sections mapped", value: document.sections.length },
              { label: "Clauses in scope", value: clauseCount },
              { label: "Open comments", value: summary.unresolvedCommentCount },
            ].map((stat) => (
              <div key={stat.label} className="calm-transition rounded-xl border border-[var(--glass-border)] bg-[var(--glass-1)] px-4 py-4">
                <dt className="section-kicker">{stat.label}</dt>
                <dd className="mt-2 font-heading text-[2rem] leading-none tracking-[-0.05em]">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="glass-tile-strong rounded-xl px-6 py-5">
          <p className="section-kicker">
            Queue posture
          </p>
          <div className="mt-4 space-y-4">
            <div>
              <p className="font-heading text-[3rem] leading-none tracking-[-0.06em]">
                {pendingCount}
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
                Clauses are still waiting on a final decision before the matter can
                move to partner sign-off.
              </p>
            </div>
            <div className="space-y-2 border-t border-[var(--glass-border)] pt-4 text-sm">
              {[
                { label: "Accepted", value: summary.acceptedCount },
                { label: "Needs follow-up", value: summary.needsFollowUpCount },
                { label: "Rejected", value: summary.rejectedCount },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4 rounded-lg bg-[var(--glass-1)] px-3 py-2">
                  <span className="text-[var(--muted-foreground)]">{row.label}</span>
                  <span className="font-medium">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
