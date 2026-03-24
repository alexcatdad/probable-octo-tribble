import Link from "next/link";

export default function DemoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,rgba(247,244,239,0.94)_0%,rgba(243,238,229,0.9)_100%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-5 sm:px-8 sm:py-6 lg:px-10">
        <header className="mb-6 flex items-center justify-between border-b border-slate-900/10 pb-4">
          <Link
            href="/"
            className="text-[0.72rem] font-medium uppercase tracking-[0.26em] text-slate-600 hover:text-slate-900"
          >
            Legaltech demo
          </Link>
          <p className="text-xs text-slate-500">
            Matter overview
          </p>
        </header>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
