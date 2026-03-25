import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  FileSearch,
  ShieldCheck,
} from "lucide-react";

const proofPoints = [
  {
    title: "Reading-led review",
    description:
      "Clause text stays primary while findings, citations, and decisions remain easy to inspect.",
  },
  {
    title: "Deliberate AI support",
    description:
      "Recommendations stay visible and reviewable without turning the workspace into an AI dashboard.",
  },
  {
    title: "Partner-ready handoff",
    description:
      "Matter state, decision coverage, and unresolved issues stay legible from overview to final review.",
  },
];

const workflowSteps = [
  {
    icon: FileSearch,
    label: "Matter intake",
    summary: "Open the matter, confirm posture, and inspect the active document.",
  },
  {
    icon: BrainCircuit,
    label: "Clause triage",
    summary: "Review cited findings, compare edits, and keep each decision explicit.",
  },
  {
    icon: ShieldCheck,
    label: "Partner handoff",
    summary: "Leave the review with clearer status, open questions, and documented reasoning.",
  },
];

const matterHighlights = [
  { label: "Stage", value: "Active clause review" },
  { label: "Findings", value: "4 cited issues" },
  { label: "Comments", value: "1 open note" },
];

export default function Home() {
  return (
    <main
      id="main-content"
      className="page-grid mx-auto min-h-screen max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14"
    >
      <section className="col-span-12 grid gap-5 lg:grid-cols-12">
        <div className="col-span-12 rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(246,239,229,0.14),rgba(255,255,255,0.05))] px-[var(--tile-inset)] py-8 shadow-[0_30px_120px_-50px_rgba(0,0,0,0.8)] lg:col-span-7 lg:py-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[rgba(232,220,204,0.18)] bg-[rgba(248,241,231,0.1)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[rgba(242,229,213,0.78)]">
              Legal workflow demo
            </span>
            <span className="rounded-full border border-[rgba(201,149,106,0.28)] bg-[rgba(201,149,106,0.12)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgba(231,197,163,0.9)]">
              Sample workspace
            </span>
          </div>

          <div className="mt-8 max-w-3xl">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[rgba(242,229,213,0.62)]">
              Boutique legal product direction
            </p>
            <h1 className="document-type mt-4 text-[3.15rem] leading-[0.95] tracking-[-0.06em] text-[#f7f0e7] sm:text-[4.2rem]">
              Contract review, prepared for human judgment.
            </h1>
            <p className="mt-6 max-w-2xl text-[1rem] leading-8 text-[rgba(238,229,218,0.74)] sm:text-[1.05rem]">
              A reading-first workflow for matter posture, cited clause findings,
              and partner-ready decisions. The product feels intentional from the
              first overview through the final review pass.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/matters/matter-acme-v-omnicore"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f6eee4] px-6 text-sm font-semibold text-[#19140f] shadow-[0_20px_45px_-20px_rgba(0,0,0,0.6)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f3ddbf] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c1017]"
            >
              Open sample matter
              <ArrowRight className="size-4" />
            </Link>
            <div className="text-sm leading-6 text-[rgba(238,229,218,0.68)]">
              <p className="font-medium text-[#f4ebdf]">Acme Co. v. OmniCore Ltd.</p>
              <p>Vendor MSA v3 ready for human review.</p>
            </div>
          </div>
        </div>

        <aside className="col-span-12 overflow-hidden rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.04)] px-[var(--tile-inset)] py-7 shadow-[0_24px_80px_-46px_rgba(0,0,0,0.8)] lg:col-span-5 lg:py-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[rgba(242,229,213,0.6)]">
                Sample matter
              </p>
              <h2 className="document-type mt-3 text-[2rem] leading-none tracking-[-0.05em] text-[#f7f0e7]">
                Acme Co. v. OmniCore
              </h2>
            </div>
              <div className="rounded-full border border-[rgba(201,149,106,0.25)] bg-[rgba(201,149,106,0.1)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgba(231,197,163,0.88)]">
                Review
              </div>
          </div>

          <p className="mt-4 text-sm leading-7 text-[rgba(238,229,218,0.7)]">
            A cleaner matter brief that leads with current status, review load, and
            the fastest path back into the contract.
          </p>

          <dl className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {matterHighlights.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-[rgba(248,241,231,0.08)] px-4 py-4"
              >
                <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[rgba(242,229,213,0.56)]">
                  {item.label}
                </dt>
                <dd className="mt-2 text-base font-semibold text-[#f7f0e7]">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[rgba(242,229,213,0.56)]">
                  Decision coverage
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.06em] text-[#f7f0e7]">
                  0 of 4
                </p>
              </div>
              <div className="rounded-full border border-[rgba(233,218,195,0.14)] bg-[rgba(248,241,231,0.08)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgba(242,229,213,0.72)]">
                Awaiting review
              </div>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
              <div className="h-full w-[28%] rounded-full bg-[linear-gradient(90deg,#b98d64,#f6e7d2)]" />
            </div>
            <p className="mt-4 text-sm leading-6 text-[rgba(238,229,218,0.68)]">
              Open the matter overview, scan what still needs judgment, then move
              into the document with a cleaner review queue.
            </p>
          </div>
        </aside>
      </section>

      <section className="col-span-12 grid gap-5 lg:grid-cols-12">
        <div className="col-span-12 rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.04)] px-[var(--tile-inset)] py-7 lg:col-span-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[rgba(242,229,213,0.56)]">
            Why it reads differently
          </p>
          <h2 className="document-type mt-4 text-[2rem] leading-none tracking-[-0.05em] text-[#f7f0e7]">
            Fewer surfaces, clearer judgment.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-[rgba(238,229,218,0.68)]">
            The interface is shaped so the contract and the decision path lead,
            while the AI context stays visible without crowding the screen.
          </p>
        </div>

        {proofPoints.map((point) => (
          <article
            key={point.title}
            className="col-span-12 rounded-[2rem] border border-white/10 bg-[rgba(248,241,231,0.06)] px-[var(--tile-inset)] py-7 lg:col-span-4"
          >
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[rgba(242,229,213,0.52)]">
              Product principle
            </p>
            <h3 className="mt-4 text-[1.2rem] font-semibold tracking-[-0.03em] text-[#f4ebdf]">
              {point.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-[rgba(238,229,218,0.68)]">
              {point.description}
            </p>
          </article>
        ))}
      </section>

      <section className="col-span-12 rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.03))] px-[var(--tile-inset)] py-7">
        <div className="max-w-2xl">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[rgba(242,229,213,0.56)]">
            End-to-end flow
          </p>
          <h2 className="document-type mt-4 text-[2.35rem] leading-none tracking-[-0.05em] text-[#f7f0e7]">
            A tighter path from matter posture to clause decision.
          </h2>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {workflowSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article
                key={step.label}
                className="rounded-[1.7rem] border border-white/10 bg-[rgba(248,241,231,0.06)] px-5 py-5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-[rgba(248,241,231,0.08)]">
                    <Icon className="size-4 text-[#e8c697]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[rgba(242,229,213,0.5)]">
                      Step {index + 1}
                    </p>
                    <h3 className="mt-1 text-base font-semibold text-[#f4ebdf]">
                      {step.label}
                    </h3>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-[rgba(238,229,218,0.68)]">
                  {step.summary}
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
