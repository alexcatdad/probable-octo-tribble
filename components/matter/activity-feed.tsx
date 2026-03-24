import type { ActivityEvent } from "@/lib/types/legal-demo";

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

interface ActivityFeedProps {
  activity: ActivityEvent[];
}

export function ActivityFeed({ activity }: ActivityFeedProps) {
  const recentActivity = [...activity].reverse().slice(0, 4);

  return (
    <section className="rounded-[1.55rem] border border-slate-900/10 bg-white/88 px-5 py-5 shadow-[0_18px_60px_-50px_rgba(23,32,51,0.4)]">
      <div className="mb-4">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
          Recent activity
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-slate-950">
          Matter timeline
        </h2>
      </div>

      <ol className="space-y-4">
        {recentActivity.map((event, index) => (
          <li key={event.id} className="grid gap-3 sm:grid-cols-[96px_minmax(0,1fr)]">
            <div className="flex items-start gap-3 sm:block">
              <span className="inline-flex size-2.5 rounded-full bg-slate-950 sm:mt-2" />
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 sm:pt-1">
                {formatTimestamp(event.occurredAt)} UTC
              </p>
            </div>
            <div className="rounded-[1.1rem] border border-slate-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(247,244,238,0.9)_100%)] px-4 py-4">
              <p className="text-sm leading-6 text-slate-700">{event.message}</p>
              {index < recentActivity.length - 1 ? (
                <div className="mt-4 h-px bg-slate-900/8" />
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
