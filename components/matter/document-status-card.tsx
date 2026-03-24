import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import type { ContractDocument, ReviewSummary } from "@/lib/types/legal-demo";

interface DocumentStatusCardProps {
  document: ContractDocument;
  summary: ReviewSummary;
  reviewHref: string;
}

export function DocumentStatusCard({
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
    <section className="editorial-surface overflow-hidden rounded-[1.95rem] border border-[color:var(--surface-document-edge)]">
      <div className="grid gap-6 px-5 py-5 sm:px-7 sm:py-7 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-7">
        <div className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/[0.78] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-slate-600">
                <FileText className="size-3.5" />
                Primary document
              </div>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  <span className="rounded-full border border-slate-900/10 bg-white/[0.72] px-3 py-1">
                    Version {document.version}
                  </span>
                  <span>{document.sections.length} sections in scope</span>
                </div>
                <h2 className="font-heading text-[2.1rem] leading-none tracking-[-0.05em] text-slate-950 sm:text-[2.55rem]">
                  {document.title}
                </h2>
                <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-[0.96rem]">
                  Version {document.version} is ready for focused clause review.
                  The machine pass surfaced {summary.totalFindings} issues across{" "}
                  {document.sections.length} sections, with the queue still waiting
                  on human decisions.
                </p>
              </div>
            </div>

            <Link
              href={reviewHref}
              className="calm-transition calm-hover-lift inline-flex min-h-11 w-full items-center justify-center gap-2 self-start rounded-full bg-slate-950 px-5 text-sm font-medium text-white shadow-[0_18px_36px_-24px_rgba(23,32,51,0.78)] hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 sm:w-auto"
            >
              Open review workspace
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="space-y-3 rounded-[1.45rem] border border-white/70 bg-white/[0.48] px-4 py-4 backdrop-blur-[2px] sm:px-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="section-kicker">
                Review progress
              </p>
              <p className="text-sm font-medium text-slate-900">
                {summary.reviewedCount} of {summary.totalFindings} decisions recorded
              </p>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-900/8">
              <div
                className="calm-transition h-full rounded-full bg-[linear-gradient(90deg,rgba(61,95,124,0.94),rgba(157,115,74,0.92))]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-slate-500">
              {pendingCount === 0
                ? "All findings have been triaged."
                : `${pendingCount} findings are still waiting for a decision.`}
            </p>
          </div>

          <dl className="grid gap-3 sm:grid-cols-3">
            <div className="calm-transition rounded-[1.25rem] border border-slate-900/10 bg-white/[0.74] px-4 py-4 backdrop-blur-[2px]">
              <dt className="section-kicker">
                Sections mapped
              </dt>
              <dd className="mt-2 font-heading text-[2rem] leading-none tracking-[-0.05em] text-slate-950">
                {document.sections.length}
              </dd>
            </div>
            <div className="calm-transition rounded-[1.25rem] border border-slate-900/10 bg-white/[0.74] px-4 py-4 backdrop-blur-[2px]">
              <dt className="section-kicker">
                Clauses in scope
              </dt>
              <dd className="mt-2 font-heading text-[2rem] leading-none tracking-[-0.05em] text-slate-950">
                {clauseCount}
              </dd>
            </div>
            <div className="calm-transition rounded-[1.25rem] border border-slate-900/10 bg-white/[0.74] px-4 py-4 backdrop-blur-[2px]">
              <dt className="section-kicker">
                Open comments
              </dt>
              <dd className="mt-2 font-heading text-[2rem] leading-none tracking-[-0.05em] text-slate-950">
                {summary.unresolvedCommentCount}
              </dd>
            </div>
          </dl>
        </div>

        <div className="panel-surface-dark rounded-[1.55rem] border border-white/10 px-5 py-5 text-slate-100">
          <p className="section-kicker text-slate-400">
            Queue posture
          </p>
          <div className="mt-4 space-y-4">
            <div>
              <p className="font-heading text-[3rem] leading-none tracking-[-0.06em]">
                {pendingCount}
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-300">
                Clauses are still waiting on a final decision before the matter can
                move to partner sign-off.
              </p>
            </div>
            <div className="space-y-3 border-t border-white/10 pt-4 text-sm">
              <div className="flex items-center justify-between gap-4 rounded-full bg-white/[0.05] px-3 py-2">
                <span className="text-slate-400">Accepted</span>
                <span className="font-medium text-slate-100">
                  {summary.acceptedCount}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-full bg-white/[0.05] px-3 py-2">
                <span className="text-slate-400">Needs follow-up</span>
                <span className="font-medium text-slate-100">
                  {summary.needsFollowUpCount}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-full bg-white/[0.05] px-3 py-2">
                <span className="text-slate-400">Rejected</span>
                <span className="font-medium text-slate-100">
                  {summary.rejectedCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
