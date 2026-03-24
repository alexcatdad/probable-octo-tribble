import { render, screen } from "@testing-library/react";
import DemoLayout from "@/app/(demo)/layout";
import MatterOverviewPage from "@/app/(demo)/matters/[id]/page";

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
  expect(screen.getByText(/^completed$/i)).toBeInTheDocument();
  expect(screen.getByText(/^needs review$/i)).toBeInTheDocument();
  expect(screen.getByText(/^superseded$/i)).toBeInTheDocument();
  expect(
    screen.getByText(/the review queue is ready for clause-by-clause decisions/i)
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
