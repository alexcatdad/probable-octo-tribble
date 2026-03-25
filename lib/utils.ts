import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format an ISO timestamp into a UK-friendly short date/time string.
 * Uses day-first ordering ("25 Mar, 14:30") as expected by
 * UK legal professionals.
 *
 * Timezone is Europe/London so BST/GMT switch is handled automatically.
 */
export function formatTimestamp(timestamp: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/London",
  }).format(new Date(timestamp));
}

/**
 * Naïve English pluralisation: appends "s" when `count !== 1`.
 *
 * @example pluralise(1, "comment")  // "1 comment"
 * @example pluralise(3, "finding")  // "3 findings"
 * @example pluralise(0, "clause")   // "0 clauses"
 */
export function pluralise(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}
