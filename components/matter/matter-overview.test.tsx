import { render, screen } from "@testing-library/react";
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
  expect(
    screen.getByText(/the review queue is ready for clause-by-clause decisions/i)
  ).toBeInTheDocument();
});
