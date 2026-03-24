import "@testing-library/jest-dom/vitest";
import { clearReviewDemoStateCacheForTests } from "@/hooks/use-review-demo-state";

afterEach(() => {
  clearReviewDemoStateCacheForTests();
  try {
    window.sessionStorage.clear();
  } catch {
    // Some tests deliberately replace storage with a throwing shim.
  }
});
