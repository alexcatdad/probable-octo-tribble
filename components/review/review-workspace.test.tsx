import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MatterOverviewPage from "@/app/(demo)/matters/[id]/page";
import {
  clearReviewDemoStateCacheForTests,
  getReviewDemoStateStorageKey,
} from "@/hooks/use-review-demo-state";
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

  it("synchronizes the active clause, document highlight, citation, and suggested edit when a finding is selected", async () => {
    const user = userEvent.setup();

    render(<ReviewWorkspace matter={seedMatter} />);

    await user.click(
      screen.getByRole("button", {
        name: /security incident notice should be faster/i,
      })
    );

    expect(
      within(
        screen.getByRole("complementary", { name: /clause outline/i })
      ).getByRole("button", { name: /security incident notice/i })
    ).toHaveAttribute("aria-current", "true");
    expect(
      within(
        screen
          .getByRole("button", { name: /document clause 3\.1/i })
          .closest("article") as HTMLElement
      ).getByText(/active clause/i)
    ).toBeInTheDocument();
    expect(
      within(
        screen
          .getByRole("button", {
            name: /security incident notice should be faster/i,
          })
          .closest("article") as HTMLElement
      ).getByText(
        /see clause 21\.4: security incident notice is due within 72 hours after confirmation/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /shorten the security incident notice period/i,
      })
    ).toBeInTheDocument();
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

  it("persists a new comment so the overview route hydrates from serialized state", async () => {
    const user = userEvent.setup();

    render(<ReviewWorkspace matter={seedMatter} />);

    const newComment =
      "Please confirm the indemnity carve-out before we close this.";

    await user.type(
      screen.getByRole("textbox", { name: /comment for active clause/i }),
      newComment
    );
    await user.click(screen.getByRole("button", { name: /add comment/i }));

    await waitFor(() => {
      expect(
        window.sessionStorage.getItem(
          getReviewDemoStateStorageKey(seedMatter.id)
        )
      ).toContain('"kind":"comment_added"');
    });

    clearReviewDemoStateCacheForTests();
    cleanup();

    const page = await MatterOverviewPage({
      params: Promise.resolve({ id: seedMatter.id }),
    });

    render(page);

    expect(
      screen.getByText(/0 of 4 decisions recorded/i)
    ).toBeInTheDocument();
    expect(
      within(
        screen.getByText(/unresolved comments/i).closest("article") as HTMLElement
      ).getByText(/^2$/i)
    ).toBeInTheDocument();
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

  it("marks a finding as needing follow-up and reflects that state in the rail", async () => {
    const user = userEvent.setup();

    render(<ReviewWorkspace matter={seedMatter} />);

    await user.click(
      screen.getByRole("button", {
        name: /security incident notice should be faster/i,
      })
    );
    await user.click(screen.getByRole("button", { name: /needs follow-up/i }));

    const dataCard = screen
      .getByRole("button", {
        name: /security incident notice should be faster/i,
      })
      .closest("article");

    expect(screen.getByText(/1 of 4 findings reviewed/i)).toBeInTheDocument();
    expect(dataCard).not.toBeNull();
    expect(
      within(dataCard as HTMLElement).getByText(/^needs follow-up$/i)
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

  it("clears any unsaved comment draft when the active clause changes", async () => {
    const user = userEvent.setup();

    render(<ReviewWorkspace matter={seedMatter} />);

    await user.type(
      screen.getByRole("textbox", { name: /comment for active clause/i }),
      "Hold this draft for indemnity only."
    );
    await user.click(
      within(
        screen.getByRole("complementary", { name: /clause outline/i })
      ).getByRole("button", { name: /liability cap/i })
    );

    expect(
      screen.getByRole("textbox", { name: /comment for active clause/i })
    ).toHaveValue("");
  });

  it("prefers the needs-human-review run even when agent runs are reordered", () => {
    render(
      <ReviewWorkspace
        matter={{
          ...seedMatter,
          agentRuns: [...seedMatter.agentRuns].reverse(),
        }}
      />
    );

    expect(screen.getByText(/needs human review/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /partner should confirm the indemnity and liability positions/i
      )
    ).toBeInTheDocument();
  });

  it("renders a safe fallback when the matter has no agent runs", () => {
    render(
      <ReviewWorkspace
        matter={{
          ...seedMatter,
          agentRuns: [],
        }}
      />
    );

    expect(
      screen.getByRole("heading", { name: /no active run/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/no machine pass is currently attached to this workspace/i)
    ).toBeInTheDocument();
  });
});
