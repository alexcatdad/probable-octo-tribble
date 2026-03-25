import type { Collaborator } from "@/lib/types/legal-demo";
import { cn, formatTimestamp } from "@/lib/utils";

interface CollaboratorStripProps {
  className?: string;
  collaborators: Collaborator[];
}

export function CollaboratorStrip({ className, collaborators }: CollaboratorStripProps) {
  return (
    <section className={cn("glass-tile-strong rounded-2xl px-6 py-5", className)}>
      <div className="mb-4">
        <p className="section-kicker">Matter coverage</p>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em]">
          Collaborators
        </h2>
      </div>

      <div className="space-y-3">
        {collaborators.map((collaborator) => {
          const waitingStatus =
            collaborator.status.kind === "waiting" ? collaborator.status : null;
          return (
            <article
              key={collaborator.id}
              className="flex items-start gap-3 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-1)] px-4 py-4"
            >
              <div className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--glass-3)] text-sm font-semibold">
                {collaborator.initials}
                <span
                  className={`absolute right-0 top-0 flex size-3.5 items-center justify-center rounded-full border-2 border-[#0c1017] text-[6px] font-bold ${
                    waitingStatus
                      ? "bg-amber-400 text-amber-950"
                      : "bg-emerald-400 text-emerald-950"
                  }`}
                  aria-label={waitingStatus ? `Waiting on ${waitingStatus.waitingOn}` : "Active"}
                  title={waitingStatus ? `Waiting on ${waitingStatus.waitingOn}` : "Active"}
                >
                  {waitingStatus ? "!" : ""}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <h3 className="text-sm font-semibold">{collaborator.name}</h3>
                  <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                    {collaborator.title}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  {waitingStatus
                    ? `Waiting on ${waitingStatus.waitingOn} since ${formatTimestamp(waitingStatus.since)}.`
                    : "Active in the current review window."}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
