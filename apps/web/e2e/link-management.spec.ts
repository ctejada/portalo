import { test, expect } from "@playwright/test";

test.describe("Link management (requires auth)", () => {
  test.skip(true, "Requires authenticated session with existing page");

  test("page editor renders with link list and form", async ({ page }) => {
    await page.goto("/dashboard/pages/test-page-id");
    await expect(page.locator("text=Links")).toBeVisible();
    await expect(page.locator('input[placeholder="Link title"]')).toBeVisible();
    await expect(
      page.locator('input[placeholder="https://example.com"]')
    ).toBeVisible();
  });

  test("can add a new link", async ({ page }) => {
    await page.goto("/dashboard/pages/test-page-id");
    await page.fill('input[placeholder="Link title"]', "My Link");
    await page.fill(
      'input[placeholder="https://example.com"]',
      "https://example.com"
    );
    await page.click("text=Add");
    await expect(page.locator("text=Link added")).toBeVisible();
  });

  test("can edit a link inline", async ({ page }) => {
    await page.goto("/dashboard/pages/test-page-id");
    await page.locator("text=My Link").hover();
    await page.click('[title="Edit link"]');
    await expect(page.locator('input[value="My Link"]')).toBeVisible();
  });

  test("can delete a link", async ({ page }) => {
    await page.goto("/dashboard/pages/test-page-id");
    await page.locator("text=My Link").hover();
    page.on("dialog", (dialog) => dialog.accept());
    await page.click('[title="Delete link"]');
    await expect(page.locator("text=Link deleted")).toBeVisible();
  });
});
