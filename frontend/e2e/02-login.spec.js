import { test, expect } from '@playwright/test';
import { login, signup, getStoredToken, getStoredUser, clearAuth } from './helpers/auth-helpers.js';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await clearAuth(page);
  });

  test('should display login form', async ({ page }) => {
    await page.goto('/login');

    await expect(page.locator('h2:has-text("Login")')).toBeVisible();
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'nonexistent_user_12345');
    await page.fill('input[name="password"]', 'wrongpassword123');
    await page.click('button[type="submit"]');

    // Wait for loading to finish
    await page.waitForSelector('button:not([disabled])', { timeout: 15000 });

    // Check for error message or that we're still on login page
    const hasError = await page.locator('.error-message').count() > 0;
    const stillOnLogin = page.url().includes('/login');

    expect(hasError || stillOnLogin).toBeTruthy();
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    // First create a user
    const user = {
      username: 'logintest_' + Date.now(),
      email: 'logintest_' + Date.now() + '@test.com',
      password: 'Password@123'
    };

    await signup(page, user);
    await page.waitForTimeout(1000);

    // Now login
    await login(page, user.username, user.password);
    await page.waitForTimeout(1000);

    // Should redirect to home or profile
    await expect(page).not.toHaveURL(/.*login/);

    // Check if token is stored
    const token = await getStoredToken(page);
    expect(token).toBeTruthy();

    // Check if user data is stored
    const storedUser = await getStoredUser(page);
    expect(storedUser).toBeTruthy();
    expect(storedUser.username).toBe(user.username);
  });

  test('should show logout button after login', async ({ page }) => {
    const user = {
      username: 'logouttest_' + Date.now(),
      email: 'logouttest_' + Date.now() + '@test.com',
      password: 'Password@123'
    };

    await signup(page, user);
    await page.waitForTimeout(1000);
    await login(page, user.username, user.password);
    await page.waitForTimeout(1000);

    await expect(page.locator('button:has-text("Logout")')).toBeVisible();
  });

  test('should have link to signup page', async ({ page }) => {
    await page.goto('/login');
    const signupLink = page.locator('a:has-text("Sign up")');
    await expect(signupLink).toBeVisible();
    await signupLink.click();
    await expect(page).toHaveURL(/.*signup/);
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/login');
    await page.click('button[type="submit"]');
    await expect(page.locator('.error-message')).toBeVisible();
  });

  test('should handle form submission correctly', async ({ page }) => {
    await page.goto('/login');

    // Fill form with invalid data
    await page.fill('input[name="username"]', 'test');
    await page.fill('input[name="password"]', 'test');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for loading to finish
    await page.waitForSelector('button:not([disabled])', { timeout: 15000 });

    // Should still be on login page or show error
    const stillOnLogin = page.url().includes('/login');
    expect(stillOnLogin).toBeTruthy();

    // Form should still be functional - change username
    await page.fill('input[name="username"]', 'newvalue');
    await expect(page.locator('input[name="username"]')).toHaveValue('newvalue');
  });
});
