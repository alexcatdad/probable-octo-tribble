import { render, screen } from "@testing-library/react";
import DemoLayout from "@/app/(demo)/layout";
import MatterOverviewPage from "@/app/(demo)/matters/[id]/page";
import { getReviewDemoStateStorageKey } from "@/hooks/use-review-demo-state";
import { seedMatter } from "@/lib/demo-data/matter";
import { createReviewState, reviewReducer } from "@/lib/review-state";

afterEach(() => {
  window.sessionStorage.clear();
});

it("renders the matter overview route with the primary review context", async () => {
  const page = await MatterOverviewPage({
    params: Promise.resolve({ id: "matter-acme-v-omnicore" }),
  });

  render(page);

  expect(
    screen.getByRole("heading", { name: /acme co\. v\. omnicore/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: /vendor msa v3/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /open review workspace/i })
  ).toHaveAttribute("href", "/matters/matter-acme-v-omnicore/review");
  expect(screen.getByText(/human review underway/i)).toBeInTheDocument();
  expect(screen.getByText(/^completed$/i)).toBeInTheDocument();
  expect(screen.getByText(/^needs human review$/i)).toBeInTheDocument();
  expect(screen.getByText(/^superseded$/i)).toBeInTheDocument();
  expect(
    screen.getByText(/the review queue is ready for clause-by-clause decisions/i)
  ).toBeInTheDocument();
});

it("hydrates the overview from persisted review state for the current browser session", async () => {
  const persistedState = reviewReducer(createReviewState(seedMatter), {
    type: "accept_finding",
    findingId: "finding-indemnity-1",
  });

  window.sessionStorage.setItem(
    getReviewDemoStateStorageKey(seedMatter.id),
    JSON.stringify(persistedState)
  );

  const page = await MatterOverviewPage({
    params: Promise.resolve({ id: seedMatter.id }),
  });

  render(page);

  expect(
    await screen.findByText(/1 of 4 decisions recorded/i)
  ).toBeInTheDocument();
  expect(
    screen.getByText(/3 findings are still waiting for a decision/i)
  ).toBeInTheDocument();
  expect(
    screen.getByText(/accepted indemnity is broader than the risk allocation supports/i)
  ).toBeInTheDocument();
});

it("renders generic demo shell chrome for nested demo routes", () => {
  render(
    <DemoLayout>
      <div>Nested route content</div>
    </DemoLayout>
  );

  expect(screen.getByText(/demo workspace/i)).toBeInTheDocument();
  expect(screen.queryByText(/matter overview/i)).not.toBeInTheDocument();
});
