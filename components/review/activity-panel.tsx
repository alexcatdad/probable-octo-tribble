import type { ActivityEvent, Clause } from "@/lib/types/legal-demo";

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

function activityLabel(event: ActivityEvent) {
  switch (event.kind) {
    case "finding_created":
      return "Flagged";
    case "comment_added":
      return "Comment";
    case "finding_queued":
      return "Queued";
    default:
      return "Activity";
  }
}

interface ActivityPanelProps {
  clause?: Clause;
  activity: ActivityEvent[];
}

export function ActivityPanel({ clause, activity }: ActivityPanelProps) {
  return (
    <section
      aria-label="Activity panel"
      className="rounded-[1.55rem] border border-slate-900/10 bg-white/88 px-5 py-5 shadow-[0_18px_60px_-50px_rgba(23,32,51,0.45)]"
    >
      <div className="mb-4">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
          Activity
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-slate-950">
          Clause activity
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {clause
            ? `Recent machine and reviewer updates tied to ${clause.title.toLowerCase()}.`
            : "Select a clause to inspect its activity."}
        </p>
      </div>

      <div className="space-y-3">
        {activity.length === 0 ? (
          <div className="rounded-[1.2rem] border border-dashed border-slate-900/15 bg-slate-50 px-4 py-4 text-sm text-slate-500">
            No clause-specific activity has been recorded yet.
          </div>
        ) : (
          activity.map((event) => (
            <article
              key={event.id}
              className="rounded-[1.2rem] border border-slate-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(246,243,237,0.9)_100%)] px-4 py-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full border border-slate-900/10 bg-slate-100 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-slate-700">
                  {activityLabel(event)}
                </span>
                <span className="text-xs text-slate-500">
                  {formatTimestamp(event.occurredAt)} UTC
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-700">{event.message}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
