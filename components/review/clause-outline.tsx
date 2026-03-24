import { cn } from "@/lib/utils";
import type { ContractDocument } from "@/lib/types/legal-demo";

interface ClauseOutlineProps {
  document: ContractDocument;
  selectedClauseId: string;
  clauseFindingCounts: Record<string, number>;
  clauseCommentCounts: Record<string, number>;
  onSelectClause: (clauseId: string) => void;
}

export function ClauseOutline({
  document,
  selectedClauseId,
  clauseFindingCounts,
  clauseCommentCounts,
  onSelectClause,
}: ClauseOutlineProps) {
  return (
    <aside
      aria-label="Clause outline"
      className="rounded-[1.55rem] border border-slate-900/10 bg-white/88 px-4 py-4 shadow-[0_18px_60px_-50px_rgba(23,32,51,0.45)] xl:sticky xl:top-5"
    >
      <div className="mb-4">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
          Clause outline
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-slate-950">
          Sections in scope
        </h2>
      </div>

      <div className="space-y-4">
        {document.sections.map((section) => (
          <section key={section.id} className="space-y-2">
            <div className="flex items-center justify-between gap-3 px-1">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {section.title}
              </h3>
              <span className="text-xs text-slate-400">
                {section.clauses.length} clause
                {section.clauses.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="space-y-2">
              {section.clauses.map((clause) => {
                const isSelected = clause.id === selectedClauseId;
                const findingCount = clauseFindingCounts[clause.id] ?? 0;
                const commentCount = clauseCommentCounts[clause.id] ?? 0;

                return (
                  <button
                    key={clause.id}
                    type="button"
                    aria-current={isSelected ? "true" : undefined}
                    onClick={() => onSelectClause(clause.id)}
                    className={cn(
                      "block w-full rounded-[1.15rem] border px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500",
                      isSelected
                        ? "border-amber-300/80 bg-[linear-gradient(135deg,rgba(253,246,232,0.98)_0%,rgba(249,239,218,0.94)_100%)] shadow-[0_14px_32px_-24px_rgba(145,102,46,0.45)]"
                        : "border-slate-900/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(246,243,237,0.9)_100%)] hover:border-slate-900/16 hover:bg-white",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">
                          {clause.title}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Clause {section.order}.{clause.order}
                        </p>
                      </div>
                      {findingCount > 0 ? (
                        <span className="rounded-full border border-amber-200/90 bg-amber-50 px-2 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-amber-900">
                          {findingCount} flagged
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                      <span>{commentCount} comments</span>
                      <span className="text-slate-300">•</span>
                      <span>{findingCount} findings</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
}
