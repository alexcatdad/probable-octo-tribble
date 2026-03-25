import { memo } from "react";
import type { ContractDocument, Finding } from "@/lib/types/legal-demo";
import { cn, pluralise } from "@/lib/utils";

export type DocumentReviewMode = "clean" | "redline" | "ai_suggestions";

interface DocumentPaneProps {
  className?: string;
  document: ContractDocument;
  findings: Finding[];
  selectedClauseId: string;
  selectedFindingId: string | null;
  previewClauseId: string | null;
  previewFindingId: string | null;
  previewSource: "queue" | "document" | null;
  viewMode: DocumentReviewMode;
  onSelectClause: (clauseId: string) => void;
  onPreviewClause: (clauseId: string | null) => void;
  onViewModeChange: (mode: DocumentReviewMode) => void;
}

function severityTone(severity: Finding["severity"], isSelected: boolean) {
  if (isSelected) {
    return "border-[var(--tone-warning-border)] bg-[var(--tone-warning)] shadow-[0_0_30px_-10px_rgba(201,149,106,0.3)]";
  }
  switch (severity) {
    case "high":
      return "border-[var(--tone-danger-border)] bg-[var(--tone-danger)]";
    case "medium":
      return "border-[var(--tone-warning-border)] bg-[var(--tone-warning)]";
    case "low":
      return "border-[var(--tone-info-border)] bg-[var(--tone-info)]";
  }
}

export const DocumentPane = memo(function DocumentPane({
  className,
  document,
  findings,
  selectedClauseId,
  selectedFindingId,
  previewClauseId,
  previewFindingId,
  previewSource,
  viewMode,
  onSelectClause,
  onPreviewClause,
  onViewModeChange,
}: DocumentPaneProps) {
  const activeClauseId = previewClauseId ?? selectedClauseId;
  const activeFindingId = previewFindingId ?? selectedFindingId;

  return (
    <section
      className={cn("glass-tile overflow-hidden rounded-2xl", className)}
    >
      <div className="border-b border-[var(--glass-border)] px-[var(--tile-inset)] py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="section-kicker">Document pane</p>
            <h2 className="document-type mt-2 text-[2.1rem] leading-none tracking-[-0.05em]">
              Contract text
            </h2>
          </div>
          <div className="rounded-full border border-[var(--glass-border)] bg-[rgba(255,255,255,0.56)] px-3 py-1 text-xs font-medium text-[var(--muted-foreground)]">
            Reading-first review surface
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {(
            [
              { id: "clean", label: "Clean" },
              { id: "redline", label: "Redline" },
              { id: "ai_suggestions", label: "AI suggestions" },
            ] as const
          ).map((modeOption) => {
            const isActive = viewMode === modeOption.id;
            return (
              <button
                key={modeOption.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => onViewModeChange(modeOption.id)}
                className={cn(
                  "calm-transition rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-bronze)]",
                  isActive
                    ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]"
                    : "border-[var(--glass-border)] bg-[rgba(255,255,255,0.56)] text-[var(--muted-foreground)] hover:bg-[var(--glass-3)]",
                )}
              >
                {modeOption.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4 px-[var(--tile-inset)] py-6">
        {document.sections.map((section) => (
          <section key={section.id} className="space-y-3">
            <div className="flex items-center justify-between gap-3 border-b border-[var(--glass-border)] px-2 pb-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                {section.order}. {section.title}
              </h3>
              <span className="text-xs text-[var(--muted-foreground)]">
                {pluralise(section.clauses.length, "clause")}
              </span>
            </div>

            {section.clauses.map((clause) => {
              const clauseFindings = findings.filter(
                (finding) => finding.clauseId === clause.id,
              );
              const activeFinding = clauseFindings.find(
                (finding) => finding.id === activeFindingId,
              );
              const dominantFinding = activeFinding ?? clauseFindings[0];
              const isSelected = clause.id === selectedClauseId;
              const isPreviewed =
                previewSource === "queue" && clause.id === previewClauseId;
              const isActiveClause = clause.id === activeClauseId;

              return (
                <article
                  key={clause.id}
                  id={clause.id}
                  className={cn(
                    "calm-transition scroll-mt-24 rounded-xl border px-4 py-4",
                    dominantFinding
                      ? severityTone(dominantFinding.severity, isSelected)
                      : isSelected
                        ? "border-[var(--glass-border-hover)] bg-[var(--glass-3)] shadow-[0_0_24px_-10px_rgba(255,255,255,0.06)]"
                        : "border-[var(--glass-border)] bg-[var(--glass-1)]",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onSelectClause(clause.id)}
                    onMouseEnter={() => onPreviewClause(clause.id)}
                    onMouseLeave={() => onPreviewClause(null)}
                    onFocus={() => onPreviewClause(clause.id)}
                    onBlur={() => onPreviewClause(null)}
                    aria-label={`Document clause ${section.order}.${clause.order}`}
                    className="w-full rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-bronze)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="document-type text-[1.45rem] leading-none tracking-[-0.04em] sm:text-[1.55rem]">
                            {clause.title}
                          </h4>
                          {isSelected ? (
                            <span className="calm-transition rounded-full border border-[var(--tone-warning-border)] bg-[var(--tone-warning)] px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--tone-warning-text)]">
                              Active clause
                            </span>
                          ) : null}
                          {isPreviewed ? (
                            <span className="calm-transition rounded-full border border-[var(--tone-info-border)] bg-[var(--tone-info)] px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--tone-info-text)]">
                              Queue preview
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                          Clause {section.order}.{clause.order}
                        </p>
                      </div>

                      {dominantFinding ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-[var(--glass-border)] bg-[var(--glass-2)] px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                            {dominantFinding.severity} severity
                          </span>
                          <span className="rounded-full border border-[var(--glass-border)] bg-[var(--glass-2)] px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                            {pluralise(clauseFindings.length, "linked finding")}
                          </span>
                        </div>
                      ) : null}
                    </div>

                    <p className="document-type mt-5 max-w-[48rem] text-[1.1rem] leading-8 tracking-[0.002em] text-[rgba(52,39,29,0.82)] sm:text-[1.14rem] sm:leading-9">
                      {clause.text}
                    </p>
                  </button>

                  {dominantFinding &&
                  isActiveClause &&
                  viewMode === "redline" ? (
                    <div className="mt-4 grid gap-3 border-t border-[var(--glass-border)] pt-4">
                      <article className="rounded-[1.3rem] border border-[var(--tone-danger-border)] bg-[var(--tone-danger)] px-4 py-4">
                        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--tone-danger-text)]">
                          Current text
                        </p>
                        <p className="mt-3 text-sm leading-6 text-[var(--tone-danger-text)] line-through decoration-[var(--destructive)]/50 decoration-2">
                          {dominantFinding.suggestedEdit.beforeText}
                        </p>
                      </article>
                      <article className="rounded-[1.3rem] border border-[var(--tone-success-border)] bg-[var(--tone-success)] px-4 py-4">
                        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--tone-success-text)]">
                          Proposed replacement
                        </p>
                        <p className="mt-3 text-sm leading-6 text-[var(--tone-success-text)]">
                          {dominantFinding.suggestedEdit.afterText}
                        </p>
                      </article>
                    </div>
                  ) : null}

                  {dominantFinding &&
                  isActiveClause &&
                  viewMode === "ai_suggestions" ? (
                    <div className="mt-4 rounded-[1.3rem] border border-[var(--tone-warning-border)] bg-[var(--tone-warning)] px-4 py-4">
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--tone-warning-text)]">
                        AI-assisted recommendation
                      </p>
                      <p className="mt-2 text-sm font-semibold">
                        {dominantFinding.suggestedEdit.summary}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                        {dominantFinding.suggestedEdit.rationale}
                      </p>
                    </div>
                  ) : null}

                  {dominantFinding ? (
                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--glass-border)] pt-4">
                      <span className="rounded-full border border-[var(--glass-border)] bg-[var(--glass-2)] px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                        Citation anchor
                      </span>
                      <span className="text-xs leading-5 text-[var(--muted-foreground)]">
                        {dominantFinding.citation}
                      </span>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </section>
        ))}
      </div>
    </section>
  );
});
