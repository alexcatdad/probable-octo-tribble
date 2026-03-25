import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Clause Review — Legal Workflow",
    template: "%s — Clause Review",
  },
  description:
    "A reading-first contract review workflow for matter intake, clause triage, and partner-ready handoff.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[100] -translate-y-16 rounded-full border border-[rgba(107,84,57,0.14)] bg-[#fffaf4] px-4 py-2 text-sm font-medium text-[#241b14] shadow-[0_20px_45px_-24px_rgba(58,39,17,0.35)] transition-transform focus:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-bronze)]"
        >
          Skip to main content
        </a>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
