import { test, expect } from "@playwright/test";

test.describe("Auth flow", () => {
  test("login page renders with auth options", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("text=Sign in")).toBeVisible();
    await expect(page.locator("text=Google")).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test("signup page renders", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.locator("text=Sign up")).toBeVisible();
  });

  test("dashboard redirects to login when not authed", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL("**/login**");
    expect(page.url()).toContain("/login");
  });
});

test.describe("Page creation (requires auth)", () => {
  test.skip(true, "Requires authenticated session");

  test("can create a new page from dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await page.click("text=New page");
    await page.fill('input[placeholder*="slug"]', "test-page");
    await page.click("text=Create");
    await expect(page).toHaveURL(/\/dashboard\/pages\//);
  });
});
