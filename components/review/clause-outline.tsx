import { memo } from "react";
import type { ContractDocument } from "@/lib/types/legal-demo";
import { cn, pluralise } from "@/lib/utils";

interface ClauseOutlineProps {
  className?: string;
  document: ContractDocument;
  selectedClauseId: string;
  clauseFindingCounts: Record<string, number>;
  clauseCommentCounts: Record<string, number>;
  onSelectClause: (clauseId: string) => void;
}

export const ClauseOutline = memo(function ClauseOutline({
  className,
  document,
  selectedClauseId,
  clauseFindingCounts,
  clauseCommentCounts,
  onSelectClause,
}: ClauseOutlineProps) {
  return (
    <aside
      aria-label="Clause outline"
      className={cn(
        "glass-tile rounded-2xl px-4 py-4 xl:sticky xl:top-5",
        className,
      )}
    >
      <div className="mb-4">
        <p className="section-kicker">Clause outline</p>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em]">
          Sections in scope
        </h2>
      </div>

      <div className="space-y-4">
        {document.sections.map((section) => (
          <section key={section.id} className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 px-1">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                {section.title}
              </h3>
              <span className="text-xs text-[var(--muted-foreground)]">
                {pluralise(section.clauses.length, "clause")}
              </span>
            </div>

            <div className="space-y-1.5">
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
                      "block w-full rounded-[1.1rem] border px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-bronze)]",
                      isSelected
                        ? "border-[var(--tone-warning-border)] bg-[var(--tone-warning)] shadow-[0_18px_40px_-28px_rgba(184,142,93,0.38)]"
                        : "border-[var(--glass-border)] bg-[rgba(255,255,255,0.54)] hover:border-[var(--glass-border-hover)] hover:bg-[var(--glass-2)]",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[0.8rem] font-semibold leading-tight">
                          {clause.title}
                        </p>
                        <p className="mt-0.5 text-[0.7rem] text-[var(--muted-foreground)]">
                          {section.order}.{clause.order}
                        </p>
                      </div>
                      {findingCount > 0 ? (
                        <span className="shrink-0 rounded-md border border-[var(--tone-warning-border)] bg-[var(--tone-warning)] px-1.5 py-0.5 text-[0.65rem] font-semibold tabular-nums text-[var(--tone-warning-text)]">
                          {findingCount}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-1.5 flex items-center gap-2 text-[0.7rem] text-[var(--muted-foreground)]">
                      <span>{pluralise(commentCount, "comment")}</span>
                      <span aria-hidden="true">&middot;</span>
                      <span>{pluralise(findingCount, "finding")}</span>
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
});
