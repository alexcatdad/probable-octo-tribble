import { cn } from "@/lib/utils";
import type { ContractDocument, Finding } from "@/lib/types/legal-demo";

export type DocumentReviewMode = "clean" | "redline" | "ai_suggestions";

interface DocumentPaneProps {
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

function severityTone(
  severity: Finding["severity"],
  isSelected: boolean
) {
  if (isSelected) {
    return "border-[rgba(184,145,93,0.55)] bg-[linear-gradient(135deg,rgba(255,248,237,0.98)_0%,rgba(249,241,223,0.94)_100%)] shadow-[0_18px_48px_-34px_rgba(159,118,73,0.42)]";
  }

  switch (severity) {
    case "high":
      return "border-[rgba(166,100,97,0.22)] bg-[rgba(166,100,97,0.08)]";
    case "medium":
      return "border-[rgba(157,115,74,0.24)] bg-[rgba(157,115,74,0.08)]";
    case "low":
      return "border-[rgba(87,114,144,0.2)] bg-[rgba(87,114,144,0.08)]";
  }
}

export function DocumentPane({
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
    <section className="editorial-surface overflow-hidden rounded-[1.9rem] border border-[color:var(--surface-document-edge)]">
      <div className="border-b border-[rgba(93,100,113,0.12)] px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="section-kicker">
              Document pane
            </p>
            <h2 className="mt-2 text-[2rem] leading-none tracking-[-0.05em] text-slate-950">
              Contract text
            </h2>
          </div>
          <div className="rounded-full border border-slate-900/10 bg-white/[0.88] px-3 py-1 text-xs font-medium text-slate-600">
            Clause highlights stay linked to the review queue
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
                  "calm-transition rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
                  isActive
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "border-slate-900/10 bg-white/[0.82] text-slate-600 hover:bg-white",
                )}
              >
                {modeOption.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-5 px-4 py-5 sm:px-7 sm:py-7">
        {document.sections.map((section) => (
          <section key={section.id} className="space-y-3">
            <div className="flex items-center justify-between gap-3 border-b border-[rgba(93,100,113,0.1)] px-2 pb-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                {section.order}. {section.title}
              </h3>
              <span className="text-xs text-slate-400">
                {section.clauses.length} clause
                {section.clauses.length === 1 ? "" : "s"}
              </span>
            </div>

            {section.clauses.map((clause) => {
              const clauseFindings = findings.filter(
                (finding) => finding.clauseId === clause.id
              );
              const activeFinding = clauseFindings.find(
                (finding) => finding.id === activeFindingId
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
                    "calm-transition calm-hover-lift scroll-mt-24 rounded-[1.55rem] border px-4 py-5 sm:px-5",
                    dominantFinding
                      ? severityTone(dominantFinding.severity, isSelected)
                      : isSelected
                        ? "border-slate-300/90 bg-[rgba(250,247,241,0.96)] shadow-[0_16px_44px_-34px_rgba(66,77,95,0.22)]"
                        : "border-[rgba(93,100,113,0.12)] bg-[rgba(255,255,255,0.72)]",
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
                    className="w-full text-left focus-visible:outline-none"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="document-type text-[1.45rem] leading-none tracking-[-0.04em] text-slate-950 sm:text-[1.55rem]">
                            {clause.title}
                          </h4>
                          {isSelected ? (
                            <span className="calm-transition rounded-full border border-[rgba(184,145,93,0.5)] bg-white/[0.76] px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-amber-900">
                              Active clause
                            </span>
                          ) : null}
                          {isPreviewed ? (
                            <span className="calm-transition rounded-full border border-[rgba(63,83,115,0.18)] bg-[rgba(63,83,115,0.08)] px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-slate-900">
                              Queue preview
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                          Clause {section.order}.{clause.order}
                        </p>
                      </div>

                      {dominantFinding ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-slate-900/10 bg-white/[0.84] px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-slate-600">
                            {dominantFinding.severity} severity
                          </span>
                          <span className="rounded-full border border-slate-900/10 bg-white/[0.84] px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-slate-600">
                            {clauseFindings.length} linked finding
                            {clauseFindings.length === 1 ? "" : "s"}
                          </span>
                        </div>
                      ) : null}
                    </div>

                    <p
                      className="document-type document-muted mt-5 max-w-[48rem] text-[1.08rem] leading-8 tracking-[0.002em] sm:text-[1.12rem] sm:leading-9"
                    >
                      {clause.text}
                    </p>
                  </button>

                  {dominantFinding && isActiveClause && viewMode === "redline" ? (
                    <div className="mt-4 grid gap-3 border-t border-[rgba(93,100,113,0.12)] pt-4">
                      <article className="rounded-[1.15rem] border border-[rgba(166,100,97,0.18)] bg-[rgba(166,100,97,0.08)] px-4 py-4">
                        <p className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-rose-900">
                          Current text
                        </p>
                        <p className="mt-3 text-sm leading-6 text-rose-950 line-through decoration-rose-700/70 decoration-2">
                          {dominantFinding.suggestedEdit.beforeText}
                        </p>
                      </article>
                      <article className="rounded-[1.15rem] border border-[rgba(86,114,94,0.22)] bg-[rgba(86,114,94,0.08)] px-4 py-4">
                        <p className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-emerald-900">
                          Proposed replacement
                        </p>
                        <p className="mt-3 text-sm leading-6 text-emerald-950">
                          {dominantFinding.suggestedEdit.afterText}
                        </p>
                      </article>
                    </div>
                  ) : null}

                  {dominantFinding &&
                  isActiveClause &&
                  viewMode === "ai_suggestions" ? (
                    <div className="mt-4 rounded-[1.15rem] border border-[rgba(184,145,93,0.24)] bg-[rgba(255,248,237,0.9)] px-4 py-4">
                      <p className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-amber-900">
                        Machine suggestion
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {dominantFinding.suggestedEdit.summary}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        {dominantFinding.suggestedEdit.rationale}
                      </p>
                    </div>
                  ) : null}

                  {dominantFinding ? (
                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[rgba(93,100,113,0.12)] pt-4">
                      <span className="rounded-full border border-slate-900/10 bg-white/[0.85] px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-slate-600">
                        Citation anchor
                      </span>
                      <span className="text-xs leading-5 text-slate-600">
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
}
