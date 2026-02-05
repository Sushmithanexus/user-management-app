import { test, expect } from '@playwright/test';
import { signup, login, logout, clearAuth } from './helpers/auth-helpers.js';

test.describe('Complete E2E User Journey', () => {
  test('complete user journey: signup -> login -> view profile -> logout', async ({ page }) => {
    await clearAuth(page);

    const user = {
      username: 'e2euser_' + Date.now(),
      email: 'e2euser_' + Date.now() + '@test.com',
      password: 'E2ETest@123',
      phoneNumber: '5551234567',
      dateOfBirth: '1992-06-15'
    };

    // Step 1: Visit home page
    await page.goto('/');
    await expect(page.locator('h1:has-text("Welcome")')).toBeVisible();

    // Step 2: Navigate to signup
    await page.click('.cta-buttons a:has-text("Sign Up")');
    await expect(page).toHaveURL(/.*signup/);

    // Step 3: Complete signup
    await signup(page, user);
    await page.waitForTimeout(1000);

    // Handle alert if present
    page.on('dialog', async dialog => {
      await dialog.accept();
    });

    // Step 4: Should be redirected to login
    await expect(page).toHaveURL(/.*login/);

    // Step 5: Login with new credentials
    await login(page, user.username, user.password);
    await page.waitForTimeout(1000);

    // Step 6: Should be authenticated
    await expect(page.locator('button:has-text("Logout")')).toBeVisible();

    // Step 7: Navigate to profile
    await page.goto('/profile');
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/.*profile/);

    // Step 8: Verify profile page loaded
    await page.waitForSelector('h2:has-text("Profile")', { timeout: 10000 });

    // Step 9: Navigate to users list
    await page.goto('/users');
    await page.waitForTimeout(2000);
    await expect(page.locator('h2:has-text("Users")')).toBeVisible();

    // Step 10: Logout
    await logout(page);
    await page.waitForTimeout(500);

    // Step 11: Should not have access to protected routes
    await page.goto('/profile');
    await expect(page).toHaveURL(/.*login/);
  });

  test('multiple users workflow', async ({ page }) => {
    await clearAuth(page);

    // Create first user (admin)
    const admin = {
      username: 'multiuser_admin_' + Date.now(),
      email: 'multiuser_admin_' + Date.now() + '@test.com',
      password: 'Admin@123456'
    };

    await signup(page, admin);
    await page.waitForTimeout(1000);
    await login(page, admin.username, admin.password);
    await page.waitForTimeout(1000);

    // Verify admin role
    await page.goto('/users');
    await page.waitForTimeout(2000);
    await expect(page.locator('text=ADMIN').first()).toBeVisible();

    // Logout admin
    await logout(page);
    await page.waitForTimeout(500);

    // Create second user (regular user)
    const regularUser = {
      username: 'multiuser_regular_' + Date.now(),
      email: 'multiuser_regular_' + Date.now() + '@test.com',
      password: 'User@123456'
    };

    await signup(page, regularUser);
    await page.waitForTimeout(1000);
    await login(page, regularUser.username, regularUser.password);
    await page.waitForTimeout(1000);

    // Verify regular user can access profile
    await page.goto('/profile');
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/.*profile/);

    // Verify regular user can see users list
    await page.goto('/users');
    await page.waitForTimeout(2000);
    await expect(page.locator('h2:has-text("Users")')).toBeVisible();

    // Should see both users in the list
    const userRows = await page.locator('table tbody tr, .user-card, .user-item').count();
    expect(userRows).toBeGreaterThanOrEqual(2);
  });

  test('authentication persistence across page reloads', async ({ page }) => {
    await clearAuth(page);

    const user = {
      username: 'persistence_' + Date.now(),
      email: 'persistence_' + Date.now() + '@test.com',
      password: 'Persist@123'
    };

    // Signup and login
    await signup(page, user);
    await page.waitForTimeout(1000);
    await login(page, user.username, user.password);
    await page.waitForTimeout(1000);

    // Verify logged in
    await expect(page.locator('button:has-text("Logout")')).toBeVisible();

    // Reload page
    await page.reload();
    await page.waitForTimeout(1000);

    // Should still be logged in
    await expect(page.locator('button:has-text("Logout")')).toBeVisible();

    // Navigate to profile (should work without re-login)
    await page.goto('/profile');
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/.*profile/);
  });
});
