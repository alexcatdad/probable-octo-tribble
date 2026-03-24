import type { Collaborator } from "@/lib/types/legal-demo";

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

interface CollaboratorStripProps {
  collaborators: Collaborator[];
}

export function CollaboratorStrip({
  collaborators,
}: CollaboratorStripProps) {
  return (
    <section className="rounded-[1.55rem] border border-slate-900/10 bg-slate-950 px-5 py-5 text-slate-100 shadow-[0_18px_60px_-50px_rgba(23,32,51,0.55)]">
      <div className="mb-4">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-slate-400">
          Matter coverage
        </p>
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
              className="flex items-start gap-3 rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-4"
            >
              <div className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
                {collaborator.initials}
                <span
                  className={`absolute right-0 top-0 size-3 rounded-full border-2 border-slate-950 ${
                    waitingStatus ? "bg-amber-400" : "bg-emerald-400"
                  }`}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <h3 className="text-sm font-semibold text-white">
                    {collaborator.name}
                  </h3>
                  <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    {collaborator.title}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {waitingStatus
                    ? `Waiting on ${waitingStatus.waitingOn} since ${formatTimestamp(waitingStatus.since)} UTC.`
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
