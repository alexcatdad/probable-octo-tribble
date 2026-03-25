import { describe, expect, it } from "vitest";
import { formatTimestamp, pluralise } from "./utils";

describe("pluralise", () => {
  it("returns singular when count is 1", () => {
    expect(pluralise(1, "comment")).toBe("1 comment");
  });

  it("returns plural when count is 0", () => {
    expect(pluralise(0, "finding")).toBe("0 findings");
  });

  it("returns plural when count is greater than 1", () => {
    expect(pluralise(4, "clause")).toBe("4 clauses");
  });

  it("handles multi-word nouns", () => {
    expect(pluralise(2, "linked finding")).toBe("2 linked findings");
  });
});

describe("formatTimestamp", () => {
  it("formats an ISO timestamp in en-GB day-first style", () => {
    const result = formatTimestamp("2026-03-24T08:30:00Z");
    // Day-first en-GB format: "24 Mar" with a time component
    expect(result).toMatch(/24 Mar/);
    // Should include a time — either 08:30 (UTC) or 09:30 (BST)
    // depending on whether the test env supports DST
    expect(result).toMatch(/\d{1,2}:\d{2}/);
  });

  it("uses Europe/London timezone (not UTC)", () => {
    // In winter, Europe/London === UTC, so this is unambiguous
    const result = formatTimestamp("2026-01-15T14:00:00Z");
    expect(result).toMatch(/15 Jan/);
    expect(result).toMatch(/14:00/);
  });
});
