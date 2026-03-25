import Link from "next/link";

export default function DemoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen px-5 py-5 sm:px-8 sm:py-6 lg:px-10">
      {/* Single grid: header + content share the same 12 columns */}
      <div className="page-grid mx-auto w-full max-w-7xl">
        {/* Header spans the full grid row */}
        <header className="col-span-12 flex flex-wrap items-center justify-between gap-4 rounded-[1.8rem] border border-[var(--glass-border)] bg-[rgba(255,252,248,0.78)] px-[var(--tile-inset)] py-4 shadow-[0_16px_46px_-34px_rgba(58,39,17,0.26)]">
          <nav
            aria-label="Primary navigation"
            className="flex items-center gap-4"
          >
            <Link
              href="/"
              className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[var(--foreground)] hover:text-[var(--accent-bronze)]"
            >
              Clause Review
            </Link>
            <span className="text-[var(--muted-foreground)]">/</span>
            <span className="text-[0.72rem] font-medium uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              Sample workspace
            </span>
          </nav>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-[var(--glass-border)] bg-[rgba(184,142,93,0.08)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--tone-warning-text)]">
              Editorial sample
            </span>
          </div>
        </header>

        {/* Content inherits the same grid columns via display:contents */}
        <main
          id="main-content"
          className="col-span-12 grid grid-cols-subgrid gap-y-5 pb-10 pt-1"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
