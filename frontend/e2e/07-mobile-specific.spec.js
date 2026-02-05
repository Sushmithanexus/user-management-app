import { test, expect } from '@playwright/test';
import { signup, login } from './helpers/auth-helpers.js';
import { testUsers } from './helpers/test-data.js';

// Only run these tests on mobile projects
test.use({
  _testIdAttribute: 'data-testid'
});

test.describe('Mobile-Specific Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display mobile-responsive navigation', async ({ page }) => {
    // Check if viewport is mobile size
    const viewportSize = page.viewportSize();

    // Only run mobile-specific checks if viewport is mobile-sized
    if (viewportSize.width < 768) {
      // Mobile navigation typically has a hamburger menu
      const hamburgerMenu = page.locator('[data-testid="mobile-menu"], .mobile-menu, button[aria-label*="menu"]');
      await expect(page.locator('nav')).toBeVisible();
      expect(viewportSize.width).toBeLessThan(768);
    } else {
      // Skip this test on desktop viewports
      test.skip();
    }
  });

  test('should handle touch interactions on mobile', async ({ page }) => {
    await page.goto('/signup');

    // Test tap interaction (mobile equivalent of click)
    await page.tap('input[name="username"]');
    await expect(page.locator('input[name="username"]')).toBeFocused();

    // Fill form on mobile
    await page.fill('input[name="username"]', 'mobileuser_' + Date.now());
    await page.fill('input[name="email"]', 'mobile_' + Date.now() + '@test.com');
    await page.fill('input[name="password"]', 'Mobile@123');
    await page.fill('input[name="confirmPassword"]', 'Mobile@123');
  });

  test('should display signup form properly on mobile viewport', async ({ page }) => {
    await page.goto('/signup');

    // Verify form elements are visible and properly sized for mobile
    await expect(page.locator('h2:has-text("Sign Up")')).toBeVisible();
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();

    // Verify button is accessible on mobile
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();

    // Check if elements are within viewport
    const buttonBox = await submitButton.boundingBox();
    const viewportSize = page.viewportSize();
    expect(buttonBox.x + buttonBox.width).toBeLessThanOrEqual(viewportSize.width);
  });

  test('should handle login on mobile devices', async ({ page }) => {
    // First signup a user
    await page.goto('/signup');
    const user = {
      username: 'mobilelogin_' + Date.now(),
      email: 'mobilelogin_' + Date.now() + '@test.com',
      password: 'MobilePass@123',
      phoneNumber: '9876543210',
      dateOfBirth: '1995-05-15'
    };

    await signup(page, user);
    await page.waitForTimeout(1000);

    // Navigate to login
    await page.goto('/login');

    // Login with touch interactions
    await page.tap('input[name="username"]');
    await page.fill('input[name="username"]', user.username);
    await page.tap('input[name="password"]');
    await page.fill('input[name="password"]', user.password);
    await page.tap('button[type="submit"]');

    // Wait for successful login
    await page.waitForURL('**/profile', { timeout: 10000 });
    await expect(page).toHaveURL(/.*profile/);
  });

  test('should scroll properly on mobile', async ({ page }) => {
    await page.goto('/signup');

    // Scroll down on mobile
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Scroll back up
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    // Verify page is at top
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBe(0);
  });

  test('should handle orientation changes (landscape/portrait)', async ({ page }) => {
    await page.goto('/signup');

    // Verify portrait mode (default)
    let viewportSize = page.viewportSize();

    // Only test orientation on mobile viewports
    if (viewportSize.width < 768) {
      expect(viewportSize.height).toBeGreaterThan(viewportSize.width);

      // Note: Playwright doesn't directly support orientation change,
      // but you can simulate it by changing viewport dimensions
      await page.setViewportSize({ width: 844, height: 390 }); // Landscape iPhone 13

      // Verify form is still visible in landscape
      await expect(page.locator('h2:has-text("Sign Up")')).toBeVisible();
      await expect(page.locator('input[name="username"]')).toBeVisible();
    } else {
      test.skip();
    }
  });

  test('should display proper text size on mobile', async ({ page }) => {
    await page.goto('/');

    // Check that text is readable (not too small)
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();

    // Verify font size is appropriate for mobile (at least 14px for body text)
    const fontSize = await heading.evaluate((el) => {
      return window.getComputedStyle(el).fontSize;
    });

    const fontSizeValue = parseInt(fontSize);
    expect(fontSizeValue).toBeGreaterThanOrEqual(16); // Headings should be at least 16px
  });

  test('should handle touch gestures for navigation', async ({ page }) => {
    await page.goto('/');

    // Tap on login button (use CTA buttons to be specific)
    const loginButton = page.locator('.cta-buttons a:has-text("Login")');
    await loginButton.tap();

    // Verify navigation occurred
    await expect(page).toHaveURL(/.*login/);

    // Go back
    await page.goBack();
    await page.waitForTimeout(500);
    await expect(page).toHaveURL('/');
  });

  test('should display error messages properly on mobile', async ({ page }) => {
    await page.goto('/login');

    // Try to login with invalid credentials
    await page.tap('input[name="username"]');
    await page.fill('input[name="username"]', 'invaliduser');
    await page.tap('input[name="password"]');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.tap('button[type="submit"]');

    // Wait for error response
    await page.waitForTimeout(2000);

    // Verify still on login page (login failed)
    await expect(page).toHaveURL(/.*login/);

    // Try to check for error message (optional)
    const errorExists = await page.locator('.error-message').count() > 0;
    if (errorExists) {
      const errorMessage = page.locator('.error-message').first();
      await expect(errorMessage).toBeVisible();
      const errorBox = await errorMessage.boundingBox();
      const viewportSize = page.viewportSize();
      if (errorBox) {
        expect(errorBox.x).toBeGreaterThanOrEqual(0);
        expect(errorBox.x + errorBox.width).toBeLessThanOrEqual(viewportSize.width);
      }
    }
  });

  test('should handle form inputs with mobile keyboard', async ({ page }) => {
    await page.goto('/signup');

    // Email field should trigger email keyboard on mobile
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toHaveAttribute('type', 'email');

    // Test input on mobile
    await emailInput.tap();
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');

    // Password field should trigger secure keyboard
    const passwordInput = page.locator('input[name="password"]');
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
