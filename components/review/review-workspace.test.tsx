import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { seedMatter } from "@/lib/demo-data/matter";
import { ReviewWorkspace } from "./review-workspace";

describe("ReviewWorkspace", () => {
  it("selects the related clause when a finding is clicked", async () => {
    const user = userEvent.setup();

    render(<ReviewWorkspace matter={seedMatter} />);

    await user.click(
      screen.getByRole("button", {
        name: /liability carve-outs should be tighter/i,
      })
    );

    expect(
      within(
        screen.getByRole("complementary", { name: /clause outline/i })
      ).getByRole("button", { name: /liability cap/i })
    ).toHaveAttribute("aria-current", "true");
  });

  it("updates reviewed progress when a suggestion is accepted", async () => {
    const user = userEvent.setup();

    render(<ReviewWorkspace matter={seedMatter} />);

    await user.click(
      screen.getByRole("button", {
        name: /indemnity is broader than the risk allocation supports/i,
      })
    );
    await user.click(
      screen.getByRole("button", { name: /accept suggestion/i })
    );

    expect(screen.getByText(/1 of 4 findings reviewed/i)).toBeInTheDocument();
  });

  it("reveals rejected state in the findings rail after a rejection", async () => {
    const user = userEvent.setup();

    render(<ReviewWorkspace matter={seedMatter} />);

    await user.click(
      screen.getByRole("button", {
        name: /liability carve-outs should be tighter/i,
      })
    );
    await user.click(
      screen.getByRole("button", { name: /reject suggestion/i })
    );

    const liabilityCard = screen
      .getByRole("button", {
        name: /liability carve-outs should be tighter/i,
      })
      .closest("article");

    expect(liabilityCard).not.toBeNull();
    expect(
      within(liabilityCard as HTMLElement).getByText(/^rejected$/i)
    ).toBeInTheDocument();
  });

  it("adds a comment and appends it to the activity panel", async () => {
    const user = userEvent.setup();
    const newComment =
      "Please get partner input on the indemnity carve-out before we close this.";

    render(<ReviewWorkspace matter={seedMatter} />);

    await user.type(
      screen.getByRole("textbox", { name: /comment for active clause/i }),
      newComment
    );
    await user.click(screen.getByRole("button", { name: /add comment/i }));

    expect(
      within(screen.getByRole("region", { name: /activity panel/i })).getByText(
        newComment
      )
    ).toBeInTheDocument();
  });
});
