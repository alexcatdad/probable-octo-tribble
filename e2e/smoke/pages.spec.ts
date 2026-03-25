import { expect, test } from "@playwright/test";

test.describe("smoke", () => {
  test("landing page renders and links to the demo matter", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: /contract review/i }),
    ).toBeVisible();
    const matterLink = page.getByRole("link", { name: /open sample matter/i });
    await expect(matterLink).toBeVisible();
    await expect(matterLink).toHaveAttribute(
      "href",
      "/matters/matter-acme-v-omnicore",
    );
  });

  test("matter overview page renders with review context", async ({ page }) => {
    await page.goto("/matters/matter-acme-v-omnicore");
    await expect(
      page.getByRole("heading", { name: /acme co\. v\. omnicore/i }),
    ).toBeVisible();
    await expect(page.getByText("Decision coverage")).toBeVisible();
    await expect(
      page.getByRole("link", { name: /continue review/i }),
    ).toBeVisible();
  });

  test("review workspace page renders with document and findings", async ({
    page,
  }) => {
    await page.goto("/matters/matter-acme-v-omnicore/review");
    await expect(page.getByText("Contract text")).toBeVisible();
    await expect(page.getByText("Review queue")).toBeVisible();
    await expect(page.getByText("4 findings", { exact: true })).toBeVisible();
  });
});
