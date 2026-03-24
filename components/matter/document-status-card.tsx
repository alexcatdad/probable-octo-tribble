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
    <section className="overflow-hidden rounded-[1.8rem] border border-slate-900/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(248,244,236,0.96)_56%,rgba(238,232,222,0.96)_100%)] shadow-[0_30px_90px_-58px_rgba(23,32,51,0.52)]">
      <div className="grid gap-6 px-6 py-6 sm:px-7 sm:py-7 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/80 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-slate-600">
                <FileText className="size-3.5" />
                Primary document
              </div>
              <div>
                <h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-[2rem]">
                  {document.title}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Version {document.version} is ready for focused clause review.
                  The machine pass surfaced {summary.totalFindings} issues across{" "}
                  {document.sections.length} sections, with the queue still waiting
                  on human decisions.
                </p>
              </div>
            </div>

            <Link
              href={reviewHref}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-medium text-white shadow-[0_10px_25px_-18px_rgba(23,32,51,0.8)] transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
            >
              Open review workspace
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Review progress
              </p>
              <p className="text-sm font-medium text-slate-900">
                {summary.reviewedCount} of {summary.totalFindings} decisions recorded
              </p>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-900/8">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,rgba(55,92,122,0.95),rgba(156,111,63,0.85))]"
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
            <div className="rounded-[1.2rem] border border-slate-900/10 bg-white/75 px-4 py-4">
              <dt className="text-[0.68rem] uppercase tracking-[0.2em] text-slate-500">
                Sections mapped
              </dt>
              <dd className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                {document.sections.length}
              </dd>
            </div>
            <div className="rounded-[1.2rem] border border-slate-900/10 bg-white/75 px-4 py-4">
              <dt className="text-[0.68rem] uppercase tracking-[0.2em] text-slate-500">
                Clauses in scope
              </dt>
              <dd className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                {clauseCount}
              </dd>
            </div>
            <div className="rounded-[1.2rem] border border-slate-900/10 bg-white/75 px-4 py-4">
              <dt className="text-[0.68rem] uppercase tracking-[0.2em] text-slate-500">
                Open comments
              </dt>
              <dd className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                {summary.unresolvedCommentCount}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-[1.4rem] border border-slate-900/10 bg-slate-950 px-5 py-5 text-slate-100">
          <p className="text-[0.68rem] uppercase tracking-[0.2em] text-slate-400">
            Queue posture
          </p>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-3xl font-semibold tracking-[-0.04em]">
                {pendingCount}
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-300">
                Clauses are still waiting on a final decision before the matter can
                move to partner sign-off.
              </p>
            </div>
            <div className="space-y-3 border-t border-white/10 pt-4 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">Accepted</span>
                <span className="font-medium text-slate-100">
                  {summary.acceptedCount}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">Needs follow-up</span>
                <span className="font-medium text-slate-100">
                  {summary.needsFollowUpCount}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
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
