import { expect, test } from "@playwright/test";

test.describe("review workflow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/matters/matter-acme-v-omnicore/review");
    await page.evaluate(() => sessionStorage.clear());
    await page.reload();
    await expect(
      page.getByRole("heading", { name: "Review queue" }),
    ).toBeVisible();
  });

  test("selects a finding and shows its suggested edit", async ({ page }) => {
    const rail = page.getByRole("complementary", { name: "Findings rail" });
    const card = rail.getByRole("article").filter({
      hasText: "Liability carve-outs should be tighter",
    });
    await card.getByRole("button").click();

    const editSection = page.getByRole("region", { name: "Suggested edit" });
    await expect(editSection).toContainText("Tighten the liability carve-outs");
  });

  test("accepts a suggestion and updates progress", async ({ page }) => {
    const rail = page.getByRole("complementary", { name: "Findings rail" });
    const card = rail.getByRole("article").filter({
      hasText: "Indemnity is broader than the risk allocation supports",
    });
    await card.getByRole("button").first().click();

    const editSection = page.getByRole("region", { name: "Suggested edit" });
    await editSection.getByRole("button", { name: "Accept" }).click();

    const undoToast = page.locator("[role=status][aria-live=polite]").last();
    await expect(undoToast).toContainText("Accepted");
    await expect(page.getByText("1 of 4 findings reviewed")).toBeVisible();
  });

  test("rejects a suggestion and shows rejected state in the rail", async ({
    page,
  }) => {
    const rail = page.getByRole("complementary", { name: "Findings rail" });
    const card = rail.getByRole("article").filter({
      hasText: "Indemnity is broader than the risk allocation supports",
    });
    await card.getByRole("button").first().click();

    const editSection = page.getByRole("region", { name: "Suggested edit" });
    await editSection.getByRole("button", { name: "Reject" }).click();

    const undoToast = page.locator("[role=status][aria-live=polite]").last();
    await expect(undoToast).toContainText("Rejected");
    await expect(card).toContainText("Rejected");
  });

  test("marks a finding as needing follow-up", async ({ page }) => {
    const rail = page.getByRole("complementary", { name: "Findings rail" });
    const card = rail.getByRole("article").filter({
      hasText: "Indemnity is broader than the risk allocation supports",
    });
    await card.getByRole("button").first().click();

    const editSection = page.getByRole("region", { name: "Suggested edit" });
    await editSection.getByRole("button", { name: "Follow-up" }).click();

    const undoToast = page.locator("[role=status][aria-live=polite]").last();
    await expect(undoToast).toContainText("Marked for follow-up");
    await expect(card).toContainText("Needs follow-up");
  });

  test("adds a comment to the active clause", async ({ page }) => {
    await page
      .getByLabel("Comment for active clause")
      .fill("Need to confirm fallback position before partner review.");
    await page.getByRole("button", { name: "Add comment" }).click();

    const commentsList = page
      .locator("section")
      .filter({ hasText: "Clause discussion" })
      .locator("[aria-live=polite]");
    await expect(commentsList).toContainText("Need to confirm fallback");

    const activityPanel = page.getByRole("region", {
      name: "Clause activity",
    });
    await expect(activityPanel).toContainText("Need to confirm fallback");
  });

  test("filters the review queue to show only unreviewed findings", async ({
    page,
  }) => {
    const rail = page.getByRole("complementary", { name: "Findings rail" });
    const card = rail.getByRole("article").filter({
      hasText: "Indemnity is broader than the risk allocation supports",
    });
    await card.getByRole("button").first().click();

    const editSection = page.getByRole("region", { name: "Suggested edit" });
    await editSection.getByRole("button", { name: "Accept" }).click();

    const undoToast = page.locator("[role=status][aria-live=polite]").last();
    await expect(undoToast).toContainText("Accepted");

    await page.getByRole("button", { name: "Unreviewed", exact: true }).click();

    await expect(page.getByText("3 findings", { exact: true })).toBeVisible();
  });

  test("navigates from landing page through matter to review", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /open sample matter/i }).click();
    await expect(
      page.getByRole("heading", { name: /acme co\. v\. omnicore/i }),
    ).toBeVisible();

    await page.getByRole("link", { name: /continue review/i }).click();
    await expect(
      page.getByRole("heading", { name: "Review queue" }),
    ).toBeVisible();
  });
});
