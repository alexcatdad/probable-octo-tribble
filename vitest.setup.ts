import "@testing-library/jest-dom/vitest";
import { clearReviewDemoStateCacheForTests } from "@/hooks/use-review-demo-state";

// ViewTransition is a React canary API bundled by Next.js but absent
// from the stable react package used in tests.
vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return {
    ...actual,
    ViewTransition: actual.ViewTransition ?? (({ children }: { children: React.ReactNode }) => children),
  };
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/matters/matter-acme-v-omnicore",
  useSearchParams: () => new URLSearchParams(),
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

afterEach(() => {
  clearReviewDemoStateCacheForTests();
  try {
    window.sessionStorage.clear();
  } catch {
    // Some tests deliberately replace storage with a throwing shim.
  }
});
