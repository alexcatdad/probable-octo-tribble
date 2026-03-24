import type {
  AgentRun,
  AgentRunStatus,
  Collaborator,
} from "@/lib/types/legal-demo";

function formatTimestamp(timestamp: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(new Date(timestamp));
}

function statusCopy(
  status: AgentRunStatus,
  collaborators: Collaborator[]
): {
  label: string;
  tone: string;
  detail: string;
} {
  switch (status.kind) {
    case "completed":
      return {
        label: "completed",
        tone: "bg-emerald-50 text-emerald-900 border-emerald-200/80",
        detail: status.outputSummary,
      };
    case "superseded":
      return {
        label: "superseded",
        tone: "bg-stone-100 text-stone-800 border-stone-200/80",
        detail: status.reason,
      };
    case "needs_human_review": {
      const requestedBy =
        collaborators.find((person) => person.id === status.requestedBy)?.name ??
        "Reviewer";

      return {
        label: "needs human review",
        tone: "bg-amber-50 text-amber-900 border-amber-200/80",
        detail: `${requestedBy}: ${status.note}`,
      };
    }
  }
}

interface AgentRunsListProps {
  agentRuns: AgentRun[];
  collaborators: Collaborator[];
}

export function AgentRunsList({
  agentRuns,
  collaborators,
}: AgentRunsListProps) {
  const orderedRuns = [...agentRuns].sort(
    (left, right) => Date.parse(right.startedAt) - Date.parse(left.startedAt)
  );

  return (
    <section className="rounded-[1.55rem] border border-slate-900/10 bg-white/88 px-5 py-5 shadow-[0_18px_60px_-50px_rgba(23,32,51,0.4)]">
      <div className="mb-4">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
          Agent runs
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-slate-950">
          Recent machine passes
        </h2>
      </div>

      <div className="space-y-3">
        {orderedRuns.map((run) => {
          const presentation = statusCopy(run.status, collaborators);

          return (
            <article
              key={run.id}
              className="rounded-[1.2rem] border border-slate-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(247,244,238,0.9)_100%)] px-4 py-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-950">{run.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Started {formatTimestamp(run.startedAt)} UTC
                  </p>
                </div>
                <span
                  className={`rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${presentation.tone}`}
                >
                  {presentation.label}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {presentation.detail}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
