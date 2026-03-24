import type { Matter, MatterStage } from "@/lib/types/legal-demo";

const stageLabelMap: Record<MatterStage, string> = {
  intake: "Intake",
  review: "Human review underway",
  partner_signoff: "Partner sign-off",
  ready_for_signature: "Ready for signature",
};

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

interface MatterHeaderProps {
  matter: Matter;
  openedAt: string;
  latestActivityAt: string;
}

export function MatterHeader({
  matter,
  openedAt,
  latestActivityAt,
}: MatterHeaderProps) {
  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-slate-900/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(247,243,235,0.94)_100%)] shadow-[0_20px_70px_-48px_rgba(23,32,51,0.45)]">
      <div className="grid gap-6 px-6 py-6 sm:px-7 sm:py-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-slate-900/10 bg-white/80 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-600">
              Matter overview
            </span>
            <span className="rounded-full border border-amber-900/20 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900">
              {stageLabelMap[matter.stage]}
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-[2.55rem]">
              {matter.title}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-[0.95rem]">
              {matter.clientName} negotiating against {matter.counterpartyName}. The
              overview keeps the document queue, live review activity, and
              partner-ready context in one calm surface while the team works
              toward sign-off.
            </p>
          </div>
        </div>

        <div className="grid min-w-[250px] gap-3 rounded-[1.35rem] border border-slate-900/10 bg-slate-950 px-4 py-4 text-slate-100 sm:grid-cols-3 lg:grid-cols-1">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-slate-400">
              Matter opened
            </p>
            <p className="mt-1 text-sm font-medium">{formatTimestamp(openedAt)} UTC</p>
          </div>
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-slate-400">
              Last activity
            </p>
            <p className="mt-1 text-sm font-medium">
              {formatTimestamp(latestActivityAt)} UTC
            </p>
          </div>
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-slate-400">
              Active reviewers
            </p>
            <p className="mt-1 text-sm font-medium">{matter.collaborators.length} people</p>
          </div>
        </div>
      </div>
    </section>
  );
}
