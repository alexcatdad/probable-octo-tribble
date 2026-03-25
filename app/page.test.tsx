import { render, screen } from "@testing-library/react";
import HomePage from "./page";

it("renders a link into the demo workspace", () => {
  render(<HomePage />);
  expect(
    screen.getByRole("heading", {
      name: /contract review, prepared for human judgment/i,
    })
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /open sample matter/i })).toHaveAttribute(
    "href",
    "/matters/matter-acme-v-omnicore"
  );
});

it("uses dark editorial text inside light landing-page cards", () => {
  render(<HomePage />);

  expect(screen.getByText(/^Legal workflow demo$/i)).toHaveClass(
    "text-[var(--muted-foreground)]"
  );
  expect(screen.getByText(/^Sample workspace$/i)).toHaveClass(
    "text-[var(--tone-warning-text)]"
  );
  expect(screen.getByText(/^Boutique legal product direction$/i)).toHaveClass(
    "text-[var(--muted-foreground)]"
  );
  expect(screen.getByText(/^Active clause review$/i)).toHaveClass(
    "text-[var(--foreground)]"
  );
  expect(
    screen.getByRole("heading", { name: /reading-led review/i })
  ).toHaveClass("text-[var(--foreground)]");
  expect(
    screen.getByText(/A reading-first workflow for matter posture/i)
  ).toHaveClass("text-[var(--muted-foreground)]");
  expect(screen.getByText(/acme co\. v\. omnicore ltd\./i)).toHaveClass(
    "text-[var(--foreground)]"
  );
});
