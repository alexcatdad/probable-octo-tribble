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
      className="space-y-5 xl:sticky xl:top-5"
    >
      <section className="rounded-[1.55rem] border border-slate-900/10 bg-slate-950 px-5 py-5 text-slate-100 shadow-[0_20px_70px_-55px_rgba(23,32,51,0.8)]">
        <div className="mb-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-400">
            Findings rail
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em]">
            Review queue
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Every machine suggestion keeps the underlying clause citation and
            reviewer action in view.
          </p>
        </div>

        <div className="space-y-3">
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
