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

    expect(
      screen.getByText(/4 findings need final decisions before partner sign-off/i)
    ).toBeInTheDocument();

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
      screen.getByRole("button", { name: /^accept$/i })
    );

    expect(screen.getByText(/1 of 4 findings reviewed/i)).toBeInTheDocument();
  });

  it("switches document review modes so the active clause can show inline redlines", async () => {
    const user = userEvent.setup();

    render(<ReviewWorkspace matter={seedMatter} />);

    await user.click(
      screen.getByRole("button", {
        name: /security incident notice should be faster/i,
      })
    );

    expect(
      screen.queryByText(/proposed replacement/i)
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /redline/i }));

    expect(screen.getByText(/proposed replacement/i)).toBeInTheDocument();
    expect(
      within(
        screen
          .getByRole("button", { name: /document clause 3\.1/i })
          .closest("article") as HTMLElement
      ).getByText(/notify customer promptly and in any event within 48 hours/i)
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /clean/i }));

    expect(
      screen.queryByText(/proposed replacement/i)
    ).not.toBeInTheDocument();
  });

  it("previews the linked clause when a finding is hovered in the review queue", async () => {
    const user = userEvent.setup();

    render(<ReviewWorkspace matter={seedMatter} />);

    await user.hover(
      screen.getByRole("button", {
        name: /renewal notice period is too long/i,
      })
    );

    expect(
      within(
        screen
          .getByRole("button", { name: /document clause 4\.1/i })
          .closest("article") as HTMLElement
      ).getByText(/queue preview/i)
    ).toBeInTheDocument();
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
      screen.getByRole("button", { name: /^reject$/i })
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
    await user.click(
      within(
        screen.getByRole("heading", {
          name: /shorten the security incident notice period/i,
        }).closest("section") as HTMLElement
      ).getByRole("button", { name: /^follow-up$/i })
    );

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
      within(screen.getByRole("region", { name: /clause activity/i })).getByText(
        newComment
      )
    ).toBeInTheDocument();
  });

  it("supports waiting and resolved states for clause comments", async () => {
    const user = userEvent.setup();

    render(<ReviewWorkspace matter={seedMatter} />);

    await user.click(
      screen.getByRole("button", { name: /waiting on partner/i })
    );

    expect(screen.getByText(/^waiting on partner$/i)).toBeInTheDocument();
    expect(
      within(screen.getByText(/open comments/i).closest("div") as HTMLElement).getByText(
        /^1$/i
      )
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /resolve comment/i }));

    expect(screen.getByText(/^resolved$/i)).toBeInTheDocument();
    expect(
      within(screen.getByText(/open comments/i).closest("div") as HTMLElement).getByText(
        /^0$/i
      )
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole("region", { name: /clause activity/i })).getByText(
        /resolved comment/i
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

  it("shows live reviewer presence cues inside the workspace header", () => {
    render(<ReviewWorkspace matter={seedMatter} />);

    expect(screen.getByText(/active reviewers/i)).toBeInTheDocument();
    expect(screen.getByText(/jordan blake/i)).toBeInTheDocument();
    expect(screen.getByText(/maya chen/i)).toBeInTheDocument();
    expect(screen.getByText(/waiting on partner sign-off/i)).toBeInTheDocument();
  });

  it("filters the review queue and jumps to the next unreviewed finding in that slice", async () => {
    const user = userEvent.setup();

    render(<ReviewWorkspace matter={seedMatter} />);

    await user.click(screen.getByRole("button", { name: /^high risk$/i }));

    const queue = screen.getByRole("complementary", { name: /findings rail/i });
    expect(
      within(queue).getByRole("button", {
        name: /indemnity is broader than the risk allocation supports/i,
      })
    ).toBeInTheDocument();
    expect(
      within(queue).getByRole("button", {
        name: /security incident notice should be faster/i,
      })
    ).toBeInTheDocument();
    expect(
      within(queue).queryByRole("button", {
        name: /liability carve-outs should be tighter/i,
      })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /next unreviewed/i }));

    expect(
      screen.getByRole("heading", {
        name: /shorten the security incident notice period/i,
      })
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
      screen.getByText(/no automated pass is currently attached to this workspace/i)
    ).toBeInTheDocument();
  });
});
