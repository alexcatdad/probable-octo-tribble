import type {
  AgentRun,
  AgentRunStatus,
  Collaborator,
} from "@/lib/types/legal-demo";
import { cn, formatTimestamp } from "@/lib/utils";

function statusCopy(
  status: AgentRunStatus,
  collaborators: Collaborator[],
): { label: string; tone: string; detail: string } {
  switch (status.kind) {
    case "completed":
      return {
        label: "completed",
        tone: "border-[var(--tone-success-border)] bg-[var(--tone-success)] text-[var(--tone-success-text)]",
        detail: status.outputSummary,
      };
    case "superseded":
      return {
        label: "superseded",
        tone: "border-[var(--tone-neutral-border)] bg-[var(--tone-neutral)] text-[var(--muted-foreground)]",
        detail: status.reason,
      };
    case "needs_human_review": {
      const requestedBy =
        collaborators.find((person) => person.id === status.requestedBy)
          ?.name ?? "Reviewer";
      return {
        label: "needs human review",
        tone: "border-[var(--tone-warning-border)] bg-[var(--tone-warning)] text-[var(--tone-warning-text)]",
        detail: `${requestedBy}: ${status.note}`,
      };
    }
  }
}

interface AgentRunsListProps {
  className?: string;
  agentRuns: AgentRun[];
  collaborators: Collaborator[];
}

export function AgentRunsList({
  className,
  agentRuns,
  collaborators,
}: AgentRunsListProps) {
  const orderedRuns = [...agentRuns].sort(
    (left, right) => Date.parse(right.startedAt) - Date.parse(left.startedAt),
  );

  return (
    <section
      className={cn(
        "glass-tile rounded-2xl px-[var(--tile-inset)] py-5",
        className,
      )}
    >
      <div className="mb-4">
        <p className="section-kicker">Agent runs</p>
        <h2 className="mt-2 font-heading text-[1.85rem] leading-none tracking-[-0.05em]">
          Recent automated passes
        </h2>
      </div>

      <div className="space-y-3">
        {orderedRuns.map((run) => {
          const presentation = statusCopy(run.status, collaborators);
          return (
            <article
              key={run.id}
              className="calm-transition rounded-[1.3rem] border border-[var(--glass-border)] bg-[rgba(255,255,255,0.5)] px-4 py-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-heading text-[1.2rem] leading-none tracking-[-0.04em]">
                    {run.name}
                  </h3>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    Started {formatTimestamp(run.startedAt)}
                  </p>
                </div>
                <span
                  className={`rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${presentation.tone}`}
                >
                  {presentation.label}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                {presentation.detail}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
