import { render, screen } from "@testing-library/react";
import HomePage from "./page";

it("renders a link into the demo workspace", () => {
  render(<HomePage />);
  expect(screen.getByRole("link", { name: /open demo/i })).toBeInTheDocument();
});
