import type { ActivityEvent, Clause } from "@/lib/types/legal-demo";
import { cn, formatTimestamp } from "@/lib/utils";

function activityLabel(event: ActivityEvent) {
  switch (event.kind) {
    case "finding_created":
      return "Flagged";
    case "comment_added":
      return "Comment";
    case "comment_status_changed":
      return "Status";
    case "finding_queued":
      return "Queued";
    default:
      return "Activity";
  }
}

interface ActivityPanelProps {
  className?: string;
  clause?: Clause;
  activity: ActivityEvent[];
}

export function ActivityPanel({ className, clause, activity }: ActivityPanelProps) {
  return (
    <section
      aria-label="Clause activity"
      className={cn("glass-tile rounded-2xl px-[var(--tile-inset)] py-5", className)}
    >
      <div className="mb-4">
        <p className="section-kicker">Activity</p>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em]">
          Clause activity
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
          {clause
            ? `Recent automated and reviewer updates tied to ${clause.title.toLowerCase()}.`
            : "Select a clause to inspect its activity."}
        </p>
      </div>

      <div aria-live="polite" className="space-y-3">
        {activity.length === 0 ? (
          <div className="rounded-[1.3rem] border border-dashed border-[var(--glass-border)] bg-[rgba(255,255,255,0.52)] px-4 py-4 text-sm text-[var(--muted-foreground)]">
            No clause-specific activity has been recorded yet.
          </div>
        ) : (
          activity.map((event) => (
            <article
              key={event.id}
              className="rounded-[1.3rem] border border-[var(--glass-border)] bg-[rgba(255,255,255,0.52)] px-4 py-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full border border-[var(--glass-border-hover)] bg-[rgba(255,255,255,0.6)] px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                  {activityLabel(event)}
                </span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  {formatTimestamp(event.occurredAt)}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">{event.message}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
