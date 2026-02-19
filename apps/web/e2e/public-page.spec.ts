import { test, expect } from "@playwright/test";

test.describe("Public page", () => {
  test("shows 404 for non-existent slug", async ({ page }) => {
    await page.goto("/nonexistent-slug-abc123");
    await expect(
      page.locator("text=404").or(page.locator("text=not found"))
    ).toBeVisible();
  });

  test("login page is accessible", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveTitle(/Portalo/);
  });

  test("home page renders", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Portalo/);
  });
});

test.describe("Public page with published content", () => {
  test.skip(true, "Requires seeded published page in database");

  test("renders creator page with links", async ({ page }) => {
    await page.goto("/test-creator");
    await expect(page.locator("h1")).toBeVisible();
    const links = page.locator('a[target="_blank"]');
    await expect(links).toHaveCount(3);
  });

  test("clicking a link fires tracking", async ({ page }) => {
    const trackRequest = page.waitForRequest(
      (req) =>
        req.url().includes("/api/v1/public/track") &&
        req.method() === "POST"
    );
    await page.goto("/test-creator");
    await page.locator('a[target="_blank"]').first().click();
    const req = await trackRequest;
    const body = req.postDataJSON();
    expect(body.event_type).toBe("click");
  });
});
