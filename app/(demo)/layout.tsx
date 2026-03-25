import Link from "next/link";
import { ViewTransition } from "react";

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
        <header className="col-span-12 flex items-center justify-between border-b border-[var(--glass-border)] px-6 pb-4">
          <nav aria-label="Primary navigation" className="flex items-center gap-4">
            <Link
              href="/"
              className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[var(--foreground)] hover:text-[var(--accent-bronze)]"
            >
              Clause Review
            </Link>
            <span className="text-[var(--muted-foreground)]">/</span>
            <span className="text-[0.72rem] font-medium uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              Demo workspace
            </span>
          </nav>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-[var(--tone-warning-border)] bg-[var(--tone-warning)] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--tone-warning-text)]">
              Prototype
            </span>
          </div>
        </header>

        {/* Content inherits the same grid columns via display:contents */}
        <ViewTransition>
          <main id="main-content" className="col-span-12 grid grid-cols-subgrid gap-y-5 pb-10">
            {children}
          </main>
        </ViewTransition>
      </div>
    </div>
  );
}
