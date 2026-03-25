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
      <div className="grid gap-6 px-[var(--tile-inset)] py-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.85fr)] lg:items-start">
        <div className="space-y-5">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]"
          >
            <span>Matter</span>
            <span aria-hidden="true" className="opacity-30">
              /
            </span>
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

          <div className="space-y-3">
            <h1 className="document-type max-w-3xl text-[2.7rem] leading-[0.96] tracking-[-0.05em] sm:text-[3.25rem]">
              {matter.title}
            </h1>
            <p className="max-w-2xl text-[1rem] leading-7 text-[var(--muted-foreground)]">
              The matter is in active clause review. {matter.clientName} is
              negotiating against {matter.counterpartyName}, with partner
              guidance still needed on the open indemnity and liability calls.
            </p>
          </div>
        </div>

        <div className="rounded-[1.6rem] border border-[var(--glass-border)] bg-[rgba(255,255,255,0.44)] p-5">
          <p className="section-kicker">Matter brief</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                Current state
              </p>
              <p className="mt-2 text-base font-semibold text-[var(--foreground)]">
                Active clause review
              </p>
            </div>
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                Matter opened
              </p>
              <p className="mt-2 text-base font-semibold text-[var(--foreground)]">
                {formatTimestamp(openedAt)}
              </p>
            </div>
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                Last activity
              </p>
              <p className="mt-2 text-base font-semibold text-[var(--foreground)]">
                {formatTimestamp(latestActivityAt)}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-[1.3rem] border border-[var(--glass-border)] bg-[rgba(255,255,255,0.5)] px-4 py-4">
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              Coverage note
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
              {matter.collaborators.length} reviewers are active on the file,
              with the current pass waiting on human judgment before sign-off.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
