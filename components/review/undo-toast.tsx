"use client";

import { useEffect, useState } from "react";
import { Undo2 } from "lucide-react";

const UNDO_TIMEOUT_MS = 6000;

interface UndoToastProps {
  findingId: string | null;
  findingTitle: string;
  decisionLabel: string;
  onUndo: (findingId: string) => void;
  onDismiss: () => void;
}

export function UndoToast({
  findingId,
  findingTitle,
  decisionLabel,
  onUndo,
  onDismiss,
}: UndoToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!findingId) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const timeout = setTimeout(() => {
      setVisible(false);
      onDismiss();
    }, UNDO_TIMEOUT_MS);

    return () => clearTimeout(timeout);
  }, [findingId, onDismiss]);

  if (!findingId || !visible) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-4"
    >
      <div className="glass-tile-strong flex items-center gap-4 rounded-full px-5 py-3 text-sm shadow-[0_18px_40px_-24px_rgba(58,39,17,0.28)]">
        <span className="max-w-[280px] truncate">
          <span className="font-semibold">{decisionLabel}</span>
          {" \u2014 "}
          {findingTitle}
        </span>
        <button
          type="button"
          onClick={() => {
            onUndo(findingId);
            setVisible(false);
          }}
          className="calm-transition inline-flex items-center gap-1.5 rounded-full bg-[var(--foreground)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--background)] hover:shadow-[0_12px_24px_-16px_rgba(58,39,17,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-bronze)]"
        >
          <Undo2 className="size-3.5" aria-hidden="true" />
          Undo
        </button>
      </div>
    </div>
  );
}
