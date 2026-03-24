import { cn } from "@/lib/utils";
import type { ContractDocument, Finding } from "@/lib/types/legal-demo";

interface DocumentPaneProps {
  document: ContractDocument;
  findings: Finding[];
  selectedClauseId: string;
  selectedFindingId: string | null;
  onSelectClause: (clauseId: string) => void;
}

function severityTone(
  severity: Finding["severity"],
  isSelected: boolean
) {
  if (isSelected) {
    return "border-amber-300/90 bg-[linear-gradient(135deg,rgba(255,248,235,0.98)_0%,rgba(248,238,215,0.95)_100%)]";
  }

  switch (severity) {
    case "high":
      return "border-rose-200/90 bg-rose-50/80";
    case "medium":
      return "border-amber-200/90 bg-amber-50/80";
    case "low":
      return "border-sky-200/90 bg-sky-50/75";
  }
}

export function DocumentPane({
  document,
  findings,
  selectedClauseId,
  selectedFindingId,
  onSelectClause,
}: DocumentPaneProps) {
  return (
    <section className="overflow-hidden rounded-[1.7rem] border border-slate-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,244,237,0.96)_100%)] shadow-[0_24px_70px_-58px_rgba(23,32,51,0.58)]">
      <div className="border-b border-slate-900/8 px-6 py-5 sm:px-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
              Document pane
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Contract text
            </h2>
          </div>
          <div className="rounded-full border border-slate-900/10 bg-white/90 px-3 py-1 text-xs font-medium text-slate-600">
            Clause highlights stay linked to the review queue
          </div>
        </div>
      </div>

      <div className="space-y-4 px-5 py-5 sm:px-7 sm:py-7">
        {document.sections.map((section) => (
          <section key={section.id} className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
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
              const selectedFinding = clauseFindings.find(
                (finding) => finding.id === selectedFindingId
              );
              const dominantFinding = selectedFinding ?? clauseFindings[0];
              const isSelected = clause.id === selectedClauseId;

              return (
                <article
                  key={clause.id}
                  id={clause.id}
                  className={cn(
                    "rounded-[1.45rem] border px-5 py-5 transition-colors",
                    dominantFinding
                      ? severityTone(dominantFinding.severity, isSelected)
                      : isSelected
                        ? "border-slate-300/90 bg-slate-50/90"
                        : "border-slate-900/8 bg-white/78",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onSelectClause(clause.id)}
                    aria-label={`Document clause ${section.order}.${clause.order}`}
                    className="w-full text-left focus-visible:outline-none"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-lg font-semibold tracking-[-0.03em] text-slate-950">
                            {clause.title}
                          </h4>
                          {isSelected ? (
                            <span className="rounded-full border border-amber-300/80 bg-white/70 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-amber-900">
                              Active clause
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                          Clause {section.order}.{clause.order}
                        </p>
                      </div>

                      {dominantFinding ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-slate-900/10 bg-white/80 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-slate-600">
                            {dominantFinding.severity} severity
                          </span>
                          <span className="rounded-full border border-slate-900/10 bg-white/80 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-slate-600">
                            {clauseFindings.length} linked finding
                            {clauseFindings.length === 1 ? "" : "s"}
                          </span>
                        </div>
                      ) : null}
                    </div>

                    <p
                      className="mt-4 text-[1.03rem] leading-8 text-slate-800"
                      style={{
                        fontFamily:
                          '"Iowan Old Style","Palatino Linotype","Book Antiqua",serif',
                      }}
                    >
                      {clause.text}
                    </p>
                  </button>

                  {dominantFinding ? (
                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-900/8 pt-4">
                      <span className="rounded-full border border-slate-900/10 bg-white/85 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-slate-600">
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
