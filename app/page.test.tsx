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
