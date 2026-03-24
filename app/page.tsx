import Link from "next/link";

const stats = [
  { value: "01", label: "Matter intake" },
  { value: "02", label: "Review traceability" },
  { value: "03", label: "Secure handoff" },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.08),_transparent_36%),linear-gradient(180deg,_rgba(248,250,252,1)_0%,_rgba(241,245,249,1)_100%)] px-6 py-8 text-slate-950 sm:px-10 lg:px-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center">
        <section className="grid w-full gap-8 rounded-[2rem] border border-slate-200/70 bg-white/80 p-8 shadow-[0_20px_80px_-40px_rgba(15,23,42,0.35)] backdrop-blur sm:p-12 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-slate-600">
              Legaltech demo
            </div>
            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl">
                Matter workflow control, without the noise.
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                A focused shell for reviewing matters, organizing intake, and
                setting up the future workspace flow. The demo starts at the
                overview route.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/matters/matter-acme-v-omnicore"
                className="inline-flex h-11 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                Open demo
              </Link>
              <span className="text-sm text-slate-500">
                Built for the future matter overview route.
              </span>
            </div>
          </div>

          <aside className="grid gap-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-4"
              >
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {stat.label}
                </p>
                {index < stats.length - 1 ? (
                  <div className="mt-4 h-px bg-slate-200" />
                ) : null}
              </div>
            ))}
          </aside>
        </section>
      </div>
    </main>
  );
}
