import type { ContractDocument, Finding } from "@/lib/types/legal-demo";
import { FindingCard } from "./finding-card";
import { SuggestedEditCard } from "./suggested-edit-card";

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
  selectedFinding?: Finding;
  onSelectFinding: (findingId: string) => void;
  onAcceptSuggestion: (findingId: string) => void;
  onRejectSuggestion: (findingId: string) => void;
  onMarkNeedsFollowUp: (findingId: string) => void;
}

export function FindingsRail({
  document,
  findings,
  selectedFindingId,
  selectedFinding,
  onSelectFinding,
  onAcceptSuggestion,
  onRejectSuggestion,
  onMarkNeedsFollowUp,
}: FindingsRailProps) {
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
              {findings.length} findings
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Every machine suggestion keeps the underlying clause citation and
            reviewer action in view.
          </p>
        </div>

        <div className="soft-scroll space-y-3 min-[1180px]:max-h-[calc(100vh-17rem)] min-[1180px]:overflow-y-auto min-[1180px]:pr-1">
          {findings.map((finding) => (
            <FindingCard
              key={finding.id}
              finding={finding}
              clauseLabel={clauseTitleForFinding(document, finding)}
              isSelected={finding.id === selectedFindingId}
              onSelect={() => onSelectFinding(finding.id)}
            />
          ))}
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
