import { render, screen } from "@testing-library/react";
import DemoLayout from "@/app/(demo)/layout";
import MatterOverviewPage from "@/app/(demo)/matters/[id]/page";
import {
  clearReviewDemoStateCacheForTests,
  getReviewDemoStateStorageKey,
} from "@/hooks/use-review-demo-state";
import { seedMatter } from "@/lib/demo-data/matter";
import { createReviewState } from "@/lib/review-state";

afterEach(() => {
  window.sessionStorage.clear();
});

it("renders the matter overview route with the primary review context", async () => {
  const page = await MatterOverviewPage({
    params: Promise.resolve({ id: "matter-acme-v-omnicore" }),
  });

  render(page);

  expect(
    screen.getByRole("heading", { name: /acme co\. v\. omnicore/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: /vendor msa v3/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /continue review/i }),
  ).toHaveAttribute("href", "/matters/matter-acme-v-omnicore/review");
  expect(screen.getByText(/human review underway/i)).toBeInTheDocument();
  expect(screen.getByText(/^completed$/i)).toBeInTheDocument();
  expect(screen.getByText(/^needs human review$/i)).toBeInTheDocument();
  expect(screen.getByText(/^superseded$/i)).toBeInTheDocument();
  expect(
    screen.getByText(
      /partner guidance still needed on the open indemnity and liability calls/i,
    ),
  ).toBeInTheDocument();
});

it("falls back to the seeded review state when the persisted snapshot is malformed", async () => {
  clearReviewDemoStateCacheForTests();

  const baseState = createReviewState(seedMatter);
  const malformedState = {
    ...baseState,
    summary: {
      ...baseState.summary,
      reviewedCount: "1" as unknown as number,
    },
  };

  window.sessionStorage.setItem(
    getReviewDemoStateStorageKey(seedMatter.id),
    JSON.stringify(malformedState),
  );

  const page = await MatterOverviewPage({
    params: Promise.resolve({ id: seedMatter.id }),
  });

  render(page);

  expect(
    await screen.findByText(/0 of 4 decisions recorded/i),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/4 findings still waiting for a decision/i),
  ).toBeInTheDocument();
});

it("renders the overview even when sessionStorage access throws", async () => {
  clearReviewDemoStateCacheForTests();

  const throwingStorage = {
    getItem() {
      throw new Error("sessionStorage is unavailable");
    },
    setItem() {
      throw new Error("sessionStorage is unavailable");
    },
    removeItem() {
      throw new Error("sessionStorage is unavailable");
    },
    clear() {
      throw new Error("sessionStorage is unavailable");
    },
    key() {
      return null;
    },
    get length() {
      return 0;
    },
  } as Storage;

  const sessionStorageSpy = vi
    .spyOn(window, "sessionStorage", "get")
    .mockReturnValue(throwingStorage);

  try {
    const page = await MatterOverviewPage({
      params: Promise.resolve({ id: seedMatter.id }),
    });

    render(page);

    expect(screen.getByText(/0 of 4 decisions recorded/i)).toBeInTheDocument();
  } finally {
    sessionStorageSpy.mockRestore();
  }
});

it("renders generic demo shell chrome for nested demo routes", () => {
  render(
    <DemoLayout>
      <div>Nested route content</div>
    </DemoLayout>,
  );

  expect(screen.getByText(/sample workspace/i)).toBeInTheDocument();
  expect(screen.queryByText(/matter overview/i)).not.toBeInTheDocument();
});
