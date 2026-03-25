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
      <div className="grid gap-6 px-[var(--tile-inset)] py-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)] lg:gap-7">
        <div className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--glass-border-hover)] bg-[rgba(255,255,255,0.54)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
                <FileText className="size-3.5" />
                Primary document
              </div>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  <span className="rounded-full border border-[var(--glass-border)] bg-[rgba(255,255,255,0.56)] px-3 py-1">
                    Version {document.version}
                  </span>
                  <span>{document.sections.length} sections in scope</span>
                </div>
                <h2
                  className="document-type text-[2.45rem] leading-[0.98] tracking-[-0.05em] sm:text-[2.9rem]"
                  style={{ viewTransitionName: "document-title" }}
                >
                  {document.title}
                </h2>
                <p className="max-w-2xl text-[1rem] leading-7 text-[var(--muted-foreground)]">
                  The matter is in active clause review. {summary.totalFindings} cited
                  findings remain visible while the team records final decisions and
                  prepares the file for partner sign-off.
                </p>
              </div>
            </div>

            <Link
              href={reviewHref}
              className="calm-transition calm-hover-lift inline-flex min-h-11 w-full items-center justify-center gap-2 self-start rounded-full bg-[var(--foreground)] px-5 text-sm font-semibold text-[var(--background)] shadow-[0_20px_45px_-26px_rgba(58,39,17,0.45)] hover:shadow-[0_24px_52px_-24px_rgba(58,39,17,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-bronze)] sm:w-auto"
            >
              Continue review
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="space-y-3 rounded-[1.5rem] border border-[var(--glass-border)] bg-[rgba(255,255,255,0.52)] px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="section-kicker">Decision coverage</p>
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
              className="h-2.5 overflow-hidden rounded-full bg-[rgba(123,101,72,0.08)]"
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
              <div key={stat.label} className="calm-transition rounded-[1.4rem] border border-[var(--glass-border)] bg-[rgba(255,255,255,0.52)] px-4 py-4">
                <dt className="section-kicker">{stat.label}</dt>
                <dd className="mt-2 font-heading text-[2rem] leading-none tracking-[-0.05em]">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="glass-tile-strong rounded-[1.6rem] px-6 py-5">
          <p className="section-kicker">Review posture</p>
          <div className="mt-4 space-y-4">
            <div>
              <p className="font-heading text-[3rem] leading-none tracking-[-0.06em]">
                {pendingCount}
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
                Findings still need a final call before the matter can move to
                partner sign-off.
              </p>
            </div>
            <div className="space-y-2 border-t border-[var(--glass-border)] pt-4 text-sm">
              {[
                { label: "Accepted", value: summary.acceptedCount },
                { label: "Needs follow-up", value: summary.needsFollowUpCount },
                { label: "Rejected", value: summary.rejectedCount },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4 rounded-xl bg-[rgba(255,255,255,0.54)] px-3 py-2">
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
