import type { Matter, MatterStage } from "@/lib/types/legal-demo";
import { cn, formatTimestamp } from "@/lib/utils";

const stageLabelMap: Record<MatterStage, string> = {
  intake: "Intake",
  review: "Human review underway",
  partner_signoff: "Partner sign-off",
  ready_for_signature: "Ready for signature",
};

interface MatterHeaderProps {
  className?: string;
  matter: Matter;
  openedAt: string;
  latestActivityAt: string;
}

export function MatterHeader({
  className,
  matter,
  openedAt,
  latestActivityAt,
}: MatterHeaderProps) {
  return (
    <section
      aria-label="Matter header"
      className={cn("glass-tile overflow-hidden rounded-2xl", className)}
    >
      <div className="grid gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div className="space-y-4">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]"
          >
            <span>Matter</span>
            <span aria-hidden="true" className="opacity-30">/</span>
            <span className="text-[var(--foreground)]">{matter.title}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[var(--glass-border-hover)] bg-[var(--glass-3)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
              Matter overview
            </span>
            <span className="rounded-full border border-[var(--tone-warning-border)] bg-[var(--tone-warning)] px-3 py-1 text-xs font-medium text-[var(--tone-warning-text)]">
              {stageLabelMap[matter.stage]}
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="max-w-3xl text-3xl font-semibold tracking-[-0.04em] sm:text-[2.55rem]">
              {matter.title}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-[var(--muted-foreground)] sm:text-[0.95rem]">
              {matter.clientName} negotiating against {matter.counterpartyName}. This
              overview consolidates the document queue, live review activity, and
              partner-ready context in a single surface while the team progresses
              toward sign-off.
            </p>
          </div>
        </div>

        <div className="grid min-w-[250px] gap-3 rounded-xl border border-[var(--glass-border-hover)] bg-[var(--glass-3)] px-4 py-4 sm:grid-cols-3 lg:grid-cols-1">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              Matter opened
            </p>
            <p className="mt-1 text-sm font-medium">{formatTimestamp(openedAt)}</p>
          </div>
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              Last activity
            </p>
            <p className="mt-1 text-sm font-medium">
              {formatTimestamp(latestActivityAt)}
            </p>
          </div>
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              Active reviewers
            </p>
            <p className="mt-1 text-sm font-medium">{matter.collaborators.length} people</p>
          </div>
        </div>
      </div>
    </section>
  );
}
