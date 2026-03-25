"use client";

import { startTransition, useState } from "react";
import type { ContractDocument, Finding } from "@/lib/types/legal-demo";
import { cn, pluralise } from "@/lib/utils";
import { FindingCard } from "./finding-card";
import { SuggestedEditCard } from "./suggested-edit-card";

type ReviewQueueFilter = "all" | "unreviewed" | "high_risk" | "needs_follow_up";

const queueFilters: Array<{ id: ReviewQueueFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "unreviewed", label: "Unreviewed" },
  { id: "high_risk", label: "High risk" },
  { id: "needs_follow_up", label: "Needs follow-up" },
];

function buildClauseLabels(document: ContractDocument): Map<string, string> {
  const labels = new Map<string, string>();
  for (const section of document.sections) {
    for (const clause of section.clauses) {
      labels.set(clause.id, `${section.order}.${clause.order} ${clause.title}`);
    }
  }
  return labels;
}

interface FindingsRailProps {
  className?: string;
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
  className,
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
  const clauseLabels = buildClauseLabels(document);
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
      className={cn("space-y-4 min-[1180px]:sticky min-[1180px]:top-5", className)}
    >
      <section className="glass-tile-strong rounded-2xl px-[var(--tile-inset)] py-5">
        <div className="mb-4">
          <p className="section-kicker">Findings rail</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-heading text-[1.9rem] leading-none tracking-[-0.05em]">
              Review queue
            </h2>
            <span className="rounded-full border border-[var(--glass-border-hover)] bg-[rgba(255,255,255,0.6)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              {pluralise(filteredFindings.length, "finding")}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
            Cited findings stay close to the document and the next decision.
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
                    startTransition(() => setActiveFilter(filter.id));
                  }}
                  className={`calm-transition rounded-full border px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-bronze)] ${
                    isActive
                      ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]"
                      : "border-[var(--glass-border)] bg-[rgba(255,255,255,0.56)] text-[var(--muted-foreground)] hover:bg-[var(--glass-2)]"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => {
                if (!jumpTargetFinding) return;
                onSelectFinding(jumpTargetFinding.id);
              }}
              disabled={!jumpTargetFinding}
              className="calm-transition rounded-full border border-[var(--tone-warning-border)] bg-[var(--tone-warning)] px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--tone-warning-text)] hover:bg-[rgba(201,149,106,0.2)] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-bronze)]"
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
                clauseLabel={clauseLabels.get(finding.clauseId) ?? finding.clauseId}
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
            <div className="rounded-[1.3rem] border border-dashed border-[var(--glass-border)] bg-[rgba(255,255,255,0.56)] px-4 py-4 text-sm leading-6 text-[var(--muted-foreground)]">
              No findings match this review slice yet.
            </div>
          )}
        </div>
      </section>

      <SuggestedEditCard
        finding={selectedFinding}
        clauseLabel={
          selectedFinding
            ? clauseLabels.get(selectedFinding.clauseId) ?? selectedFinding.clauseId
            : undefined
        }
        onAcceptSuggestion={onAcceptSuggestion}
        onRejectSuggestion={onRejectSuggestion}
        onMarkNeedsFollowUp={onMarkNeedsFollowUp}
      />
    </aside>
  );
}
