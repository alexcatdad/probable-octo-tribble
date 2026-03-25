import Link from "next/link";
import {
  ArrowRight,
  Brain,
  FileSearch,
  GitCompare,
  Scale,
  ShieldCheck,
  Users,
} from "lucide-react";

const capabilities = [
  {
    icon: FileSearch,
    title: "Clause extraction",
    description: "Automated identification and structuring of contractual provisions.",
  },
  {
    icon: Brain,
    title: "AI-assisted findings",
    description: "Each finding carries its source citation and remains fully reversible.",
  },
  {
    icon: GitCompare,
    title: "Redline comparison",
    description: "Side-by-side current text and proposed replacement with rationale.",
  },
  {
    icon: Users,
    title: "Multi-reviewer triage",
    description: "Partner, associate, and reviewer roles with real-time status tracking.",
  },
];

const stages = [
  { number: "01", label: "Intake", icon: FileSearch },
  { number: "02", label: "Review", icon: Scale },
  { number: "03", label: "Handoff", icon: ShieldCheck },
];

export default function Home() {
  return (
    <main
      id="main-content"
      className="page-grid mx-auto min-h-screen max-w-7xl content-center px-5 py-12 sm:px-8 lg:px-10"
    >
      {/* Hero tile: 9 cols on lg */}
      <div className="glass-tile col-span-12 flex flex-col justify-between rounded-2xl px-6 py-6 lg:col-span-9">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[var(--glass-border-hover)] bg-[var(--glass-3)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
              Product demo
            </span>
            <span className="rounded-full border border-[var(--tone-warning-border)] bg-[var(--tone-warning)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--tone-warning-text)]">
              Prototype
            </span>
          </div>

          <h1 className="document-type max-w-lg text-[2.6rem] font-medium leading-[1.08] tracking-[-0.04em] sm:text-[3.2rem]">
            Matter workflow control, built for precision.
          </h1>
          <p className="max-w-md text-[0.95rem] leading-7 text-[var(--muted-foreground)]">
            A focused contract review interface for matter intake, clause triage,
            and partner-ready handoff. AI-assisted findings remain visible, cited,
            and reversible at every stage.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/matters/matter-acme-v-omnicore"
            className="calm-transition calm-hover-lift inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#0c1017] shadow-[0_0_30px_-8px_rgba(201,149,106,0.3)] hover:shadow-[0_0_40px_-6px_rgba(201,149,106,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-bronze)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c1017]"
          >
            Open live demo
            <ArrowRight className="size-4" />
          </Link>
          <span className="text-sm text-[var(--muted-foreground)]">
            Acme Corp v. OmniCore Ltd
          </span>
        </div>
      </div>

      {/* Stages tile: 3 cols on lg */}
      <div className="glass-tile-strong col-span-12 flex flex-col rounded-2xl px-6 py-6 lg:col-span-3">
        <p className="section-kicker mb-4">Workflow</p>
        <div className="flex flex-1 flex-col justify-between gap-3">
          {stages.map((stage) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.number}
                className="glass-tile flex items-center gap-4 rounded-xl px-4 py-4"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[var(--glass-border)] bg-[var(--glass-2)]">
                  <Icon className="size-4 text-[var(--accent-bronze)]" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                    {stage.number}
                  </span>
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {stage.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Capabilities: 3 cols each on lg, 6 on sm */}
      {capabilities.map((cap) => {
        const Icon = cap.icon;
        return (
          <div
            key={cap.title}
            className="glass-tile-subtle calm-transition col-span-12 rounded-2xl px-6 py-5 hover:border-[var(--glass-border-hover)] hover:bg-[var(--glass-2)] sm:col-span-6 lg:col-span-3"
          >
            <div className="mb-3 flex size-9 items-center justify-center rounded-lg border border-[var(--glass-border)] bg-[var(--glass-2)]">
              <Icon className="size-4 text-[var(--accent-bronze)]" aria-hidden="true" />
            </div>
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              {cap.title}
            </h2>
            <p className="mt-1.5 text-xs leading-5 text-[var(--muted-foreground)]">
              {cap.description}
            </p>
          </div>
        );
      })}

      {/* Attribution */}
      <p className="col-span-12 pt-2 text-center text-xs text-[var(--muted-foreground)]">
        Built by{" "}
        <span className="font-semibold text-[var(--foreground)]">
          Alex Alexandrescu
        </span>{" "}
        &mdash; frontend product engineering demonstration
      </p>
    </main>
  );
}
