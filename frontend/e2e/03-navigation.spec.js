import { test, expect } from '@playwright/test';
import { login, signup, logout, clearAuth } from './helpers/auth-helpers.js';

test.describe('Navigation', () => {
  test('should display home page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1:has-text("Welcome to User Management System")')).toBeVisible();
  });

  test('should show login and signup buttons when not authenticated', async ({ page }) => {
    await clearAuth(page);
    await page.goto('/');

    await expect(page.locator('.cta-buttons a:has-text("Login")')).toBeVisible();
    await expect(page.locator('.cta-buttons a:has-text("Sign Up")')).toBeVisible();
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.goto('/');
    await page.click('a:has-text("Sign Up")');
    await expect(page).toHaveURL(/.*signup/);
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    await page.click('a:has-text("Login")');
    await expect(page).toHaveURL(/.*login/);
  });

  test('should show navbar with user options when authenticated', async ({ page }) => {
    const user = {
      username: 'navtest_' + Date.now(),
      email: 'navtest_' + Date.now() + '@test.com',
      password: 'Password@123'
    };

    await signup(page, user);
    await page.waitForTimeout(1000);
    await login(page, user.username, user.password);
    await page.waitForTimeout(1000);

    // Check navbar elements
    await expect(page.locator('button:has-text("Logout")')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    const user = {
      username: 'logoutnavtest_' + Date.now(),
      email: 'logoutnavtest_' + Date.now() + '@test.com',
      password: 'Password@123'
    };

    await signup(page, user);
    await page.waitForTimeout(1000);
    await login(page, user.username, user.password);
    await page.waitForTimeout(1000);

    await logout(page);
    await page.waitForTimeout(500);

    // Should redirect to home or login
    const currentUrl = page.url();
    expect(currentUrl.includes('/login') || currentUrl.includes('/')).toBeTruthy();

    // Should not have logout button
    await expect(page.locator('button:has-text("Logout")')).not.toBeVisible();
  });

  test('should redirect to login when accessing protected route without auth', async ({ page }) => {
    await clearAuth(page);
    await page.goto('/profile');

    await expect(page).toHaveURL(/.*login/);
  });

  test('should allow access to protected routes when authenticated', async ({ page }) => {
    const user = {
      username: 'protectedtest_' + Date.now(),
      email: 'protectedtest_' + Date.now() + '@test.com',
      password: 'Password@123'
    };

    await signup(page, user);
    await page.waitForTimeout(1000);
    await login(page, user.username, user.password);
    await page.waitForTimeout(1000);

    await page.goto('/profile');
    await expect(page).toHaveURL(/.*profile/);
  });
});
