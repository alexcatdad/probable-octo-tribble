import type { ActivityEvent } from "@/lib/types/legal-demo";
import { cn, formatTimestamp } from "@/lib/utils";

interface ActivityFeedProps {
  className?: string;
  activity: ActivityEvent[];
}

export function ActivityFeed({ className, activity }: ActivityFeedProps) {
  const recentActivity = [...activity].reverse().slice(0, 4);

  return (
    <section className={cn("glass-tile rounded-2xl px-[var(--tile-inset)] py-5", className)}>
      <div className="mb-4">
        <p className="section-kicker">Recent movement</p>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em]">Matter timeline</h2>
      </div>

      <ol className="space-y-3">
        {recentActivity.map((event) => (
          <li key={event.id} className="grid gap-3 sm:grid-cols-[88px_minmax(0,1fr)]">
            <div className="flex items-start gap-3 sm:block">
              <span className="inline-flex size-2 rounded-full bg-[var(--accent-bronze)]" aria-hidden="true" />
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted-foreground)] sm:pt-1">
                {formatTimestamp(event.occurredAt)}
              </p>
            </div>
            <div className="rounded-[1.3rem] border border-[var(--glass-border)] bg-[rgba(255,255,255,0.5)] px-4 py-3">
              <p className="text-sm leading-6 text-[var(--muted-foreground)]">{event.message}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
