"use client";

import { startTransition, useState } from "react";
import type { ContractDocument, Finding } from "@/lib/types/legal-demo";
import { FindingCard } from "./finding-card";
import { SuggestedEditCard } from "./suggested-edit-card";

type ReviewQueueFilter = "all" | "unreviewed" | "high_risk" | "needs_follow_up";

const queueFilters: Array<{ id: ReviewQueueFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "unreviewed", label: "Unreviewed" },
  { id: "high_risk", label: "High risk" },
  { id: "needs_follow_up", label: "Needs follow-up" },
];

function clauseTitleForFinding(document: ContractDocument, finding: Finding) {
  for (const section of document.sections) {
    const clause = section.clauses.find((item) => item.id === finding.clauseId);
    if (clause) {
      return `${section.order}.${clause.order} ${clause.title}`;
    }
  }

  return finding.clauseId;
}

interface FindingsRailProps {
  document: ContractDocument;
  findings: Finding[];
  selectedFindingId: string | null;
  previewFindingId: string | null;
  previewSource: "queue" | "document" | null;
  selectedFinding?: Finding;
  onSelectFinding: (findingId: string) => void;
  onPreviewFinding: (findingId: string | null, source: "queue" | "document") => void;
  onAcceptSuggestion: (findingId: string) => void;
  onRejectSuggestion: (findingId: string) => void;
  onMarkNeedsFollowUp: (findingId: string) => void;
}

export function FindingsRail({
  document,
  findings,
  selectedFindingId,
  previewFindingId,
  previewSource,
  selectedFinding,
  onSelectFinding,
  onPreviewFinding,
  onAcceptSuggestion,
  onRejectSuggestion,
  onMarkNeedsFollowUp,
}: FindingsRailProps) {
  const [activeFilter, setActiveFilter] = useState<ReviewQueueFilter>("all");
  const filteredFindings = findings.filter((finding) => {
    switch (activeFilter) {
      case "unreviewed":
        return finding.decision.kind === "pending";
      case "high_risk":
        return finding.severity === "high";
      case "needs_follow_up":
        return finding.decision.kind === "needs_follow_up";
      case "all":
      default:
        return true;
    }
  });
  const nextUnreviewed = filteredFindings.find(
    (finding) =>
      finding.decision.kind === "pending" && finding.id !== selectedFindingId
  );
  const fallbackUnreviewed = filteredFindings.find(
    (finding) => finding.decision.kind === "pending"
  );
  const jumpTargetFinding = nextUnreviewed ?? fallbackUnreviewed;

  return (
    <aside
      aria-label="Findings rail"
      className="space-y-5 min-[1180px]:sticky min-[1180px]:top-5"
    >
      <section className="panel-surface-dark rounded-[1.6rem] border border-white/10 px-5 py-5 text-slate-100">
        <div className="mb-4">
          <p className="section-kicker text-slate-400">
            Findings rail
          </p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-heading text-[1.9rem] leading-none tracking-[-0.05em]">
              Review queue
            </h2>
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-300">
              {filteredFindings.length} findings
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Every machine suggestion keeps the underlying clause citation and
            reviewer action in view.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {queueFilters.map((filter) => {
              const isActive = activeFilter === filter.id;

              return (
                <button
                  key={filter.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => {
                    startTransition(() => {
                      setActiveFilter(filter.id);
                    });
                  }}
                  className={`calm-transition rounded-full border px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
                    isActive
                      ? "border-white/30 bg-white text-slate-950"
                      : "border-white/10 bg-white/[0.05] text-slate-300 hover:bg-white/[0.12]"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => {
                if (!jumpTargetFinding) {
                  return;
                }

                onSelectFinding(jumpTargetFinding.id);
              }}
              disabled={!jumpTargetFinding}
              className="calm-transition rounded-full border border-[rgba(194,150,106,0.28)] bg-[rgba(194,150,106,0.14)] px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-amber-100 hover:bg-[rgba(194,150,106,0.2)] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              Next unreviewed
            </button>
          </div>
        </div>

        <div className="soft-scroll space-y-3 min-[1180px]:max-h-[calc(100vh-17rem)] min-[1180px]:overflow-y-auto min-[1180px]:pr-1">
          {filteredFindings.length > 0 ? (
            filteredFindings.map((finding) => (
              <FindingCard
                key={finding.id}
                finding={finding}
                clauseLabel={clauseTitleForFinding(document, finding)}
                isSelected={finding.id === selectedFindingId}
                isPreviewed={previewFindingId === finding.id}
                previewLabel={
                  previewFindingId === finding.id && previewSource === "document"
                    ? "Clause focus"
                    : undefined
                }
                onSelect={() => onSelectFinding(finding.id)}
                onPreviewChange={(isPreviewed) =>
                  onPreviewFinding(isPreviewed ? finding.id : null, "queue")
                }
              />
            ))
          ) : (
            <div className="rounded-[1.2rem] border border-dashed border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-6 text-slate-400">
              No findings match this review slice yet.
            </div>
          )}
        </div>
      </section>

      <SuggestedEditCard
        finding={selectedFinding}
        clauseLabel={
          selectedFinding
            ? clauseTitleForFinding(document, selectedFinding)
            : undefined
        }
        onAcceptSuggestion={onAcceptSuggestion}
        onRejectSuggestion={onRejectSuggestion}
        onMarkNeedsFollowUp={onMarkNeedsFollowUp}
      />
    </aside>
  );
}
