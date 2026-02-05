import { test, expect } from '@playwright/test';
import { signup } from './helpers/auth-helpers.js';
import { testUsers } from './helpers/test-data.js';

test.describe('Signup Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');
  });

  test('should display signup form', async ({ page }) => {
    await expect(page.locator('h2:has-text("Sign Up")')).toBeVisible();
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show error when passwords do not match', async ({ page }) => {
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'different123');
    await page.click('button[type="submit"]');

    await expect(page.locator('.error-message:has-text("Passwords do not match")')).toBeVisible();
  });

  test('should show error when password is too short', async ({ page }) => {
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', '12345');
    await page.fill('input[name="confirmPassword"]', '12345');
    await page.click('button[type="submit"]');

    await expect(page.locator('.error-message:has-text("at least 6 characters")')).toBeVisible();
  });

  test('should successfully register a new user', async ({ page }) => {
    const user = {
      username: 'newuser_' + Date.now(),
      email: 'newuser_' + Date.now() + '@test.com',
      password: 'Password@123',
      phoneNumber: '1234567890',
      dateOfBirth: '1990-01-01'
    };

    // Set up dialog handler BEFORE signup
    page.on('dialog', async dialog => {
      await dialog.accept();
    });

    await signup(page, user);

    // Wait for redirect to login page
    await page.waitForURL(/.*login/, { timeout: 5000 });
    await expect(page).toHaveURL(/.*login/);
  });

  test('should show error for duplicate username', async ({ page }) => {
    const user = {
      username: 'duplicate_' + Date.now(),
      email: 'unique1_' + Date.now() + '@test.com',
      password: 'Password@123'
    };

    // Set up dialog handler for first signup
    page.on('dialog', async dialog => {
      await dialog.accept();
    });

    // First registration
    await signup(page, user);
    await page.waitForTimeout(2000);

    // Try to register again with same username
    await page.goto('/signup');
    await page.fill('input[name="username"]', user.username);
    await page.fill('input[name="email"]', 'different_' + Date.now() + '@test.com');
    await page.fill('input[name="password"]', user.password);
    await page.fill('input[name="confirmPassword"]', user.password);
    await page.click('button[type="submit"]');

    await page.waitForTimeout(1000);
    await expect(page.locator('.error-message')).toBeVisible();
  });

  test('should have link to login page', async ({ page }) => {
    const loginLink = page.locator('a:has-text("Login")');
    await expect(loginLink).toBeVisible();
    await loginLink.click();
    await expect(page).toHaveURL(/.*login/);
  });

  test('should validate required fields', async ({ page }) => {
    await page.click('button[type="submit"]');
    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page.locator('.error-message')).toContainText('required');
  });
});
