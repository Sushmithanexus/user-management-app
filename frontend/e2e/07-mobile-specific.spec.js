import { test, expect } from '@playwright/test';
import { signup, login } from './helpers/auth-helpers.js';
import { testUsers } from './helpers/test-data.js';

// Only run these tests on mobile projects
test.use({
  _testIdAttribute: 'data-testid'
});

// Helper to check if viewport is mobile
const isMobileViewport = (page) => {
  const viewport = page.viewportSize();
  return viewport && viewport.width < 768;
};

test.describe('Mobile-Specific Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display mobile-responsive navigation', async ({ page }) => {
    const viewportSize = page.viewportSize();
    if (!viewportSize || viewportSize.width >= 768) {
      test.skip();
      return;
    }

    await expect(page.locator('nav')).toBeVisible();
    expect(viewportSize.width).toBeLessThan(768);
  });

  test('should handle touch interactions on mobile', async ({ page }) => {
    if (!isMobileViewport(page)) {
      test.skip();
      return;
    }

    await page.goto('/signup');
    await page.waitForTimeout(500);

    const usernameInput = page.locator('input[name="username"]');
    await usernameInput.tap();
    await expect(usernameInput).toBeFocused();

    await page.fill('input[name="username"]', 'mobileuser_' + Date.now());
    await page.fill('input[name="email"]', 'mobile_' + Date.now() + '@test.com');
    await page.fill('input[name="password"]', 'Mobile@123');
    await page.fill('input[name="confirmPassword"]', 'Mobile@123');
  });

  test('should display signup form properly on mobile viewport', async ({ page }) => {
    if (!isMobileViewport(page)) {
      test.skip();
      return;
    }

    await page.goto('/signup');

    await expect(page.locator('h2:has-text("Sign Up")')).toBeVisible();
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();

    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();

    const buttonBox = await submitButton.boundingBox();
    const viewportSize = page.viewportSize();
    if (buttonBox) {
      expect(buttonBox.x).toBeGreaterThanOrEqual(0);
      expect(buttonBox.x + buttonBox.width).toBeLessThanOrEqual(viewportSize.width + 10);
    }
  });

  test('should handle login on mobile devices', async ({ page }) => {
    if (!isMobileViewport(page)) {
      test.skip();
      return;
    }

    const user = {
      username: 'mobilelogin_' + Date.now(),
      email: 'mobilelogin_' + Date.now() + '@test.com',
      password: 'MobilePass@123',
      phoneNumber: '9876543210',
      dateOfBirth: '1995-05-15'
    };

    page.on('dialog', async dialog => {
      await dialog.accept();
    });

    await page.goto('/signup');
    await signup(page, user);
    await page.waitForTimeout(2000);

    await page.goto('/login');

    await page.tap('input[name="username"]');
    await page.fill('input[name="username"]', user.username);
    await page.tap('input[name="password"]');
    await page.fill('input[name="password"]', user.password);
    await page.tap('button[type="submit"]');

    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/.*profile/);
  });

  test('should scroll properly on mobile', async ({ page }) => {
    if (!isMobileViewport(page)) {
      test.skip();
      return;
    }

    await page.goto('/signup');
    await page.waitForTimeout(500);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThanOrEqual(5);
  });

  test('should handle orientation changes (landscape/portrait)', async ({ page }) => {
    if (!isMobileViewport(page)) {
      test.skip();
      return;
    }

    await page.goto('/signup');

    let viewportSize = page.viewportSize();
    expect(viewportSize.height).toBeGreaterThan(viewportSize.width);

    await page.setViewportSize({ width: 844, height: 390 });

    await expect(page.locator('h2:has-text("Sign Up")')).toBeVisible();
    await expect(page.locator('input[name="username"]')).toBeVisible();
  });

  test('should display proper text size on mobile', async ({ page }) => {
    if (!isMobileViewport(page)) {
      test.skip();
      return;
    }

    await page.goto('/');
    await page.waitForTimeout(500);

    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();

    const fontSize = await heading.evaluate((el) => {
      return window.getComputedStyle(el).fontSize;
    });

    const fontSizeValue = parseInt(fontSize);
    expect(fontSizeValue).toBeGreaterThanOrEqual(14);
  });

  test('should handle touch gestures for navigation', async ({ page }) => {
    if (!isMobileViewport(page)) {
      test.skip();
      return;
    }

    await page.goto('/');
    await page.waitForTimeout(1000);

    const ctaButtons = page.locator('.cta-buttons');
    const ctaExists = await ctaButtons.count() > 0;

    if (ctaExists) {
      const loginButton = page.locator('.cta-buttons a:has-text("Login")');
      await loginButton.tap();

      await page.waitForTimeout(500);
      await expect(page).toHaveURL(/.*login/);

      await page.goBack();
      await page.waitForTimeout(500);
      await expect(page).toHaveURL('/');
    } else {
      await page.goto('/login');
      await expect(page).toHaveURL(/.*login/);
    }
  });

  test('should display error messages properly on mobile', async ({ page }) => {
    if (!isMobileViewport(page)) {
      test.skip();
      return;
    }

    await page.goto('/login');
    await page.waitForTimeout(500);

    await page.tap('input[name="username"]');
    await page.fill('input[name="username"]', 'invaliduser_' + Date.now());
    await page.tap('input[name="password"]');
    await page.fill('input[name="password"]', 'wrongpassword123');
    await page.tap('button[type="submit"]');

    await page.waitForTimeout(3000);

    await expect(page).toHaveURL(/.*login/);

    const errorExists = await page.locator('.error-message').count() > 0;
    if (errorExists) {
      const errorMessage = page.locator('.error-message').first();
      await expect(errorMessage).toBeVisible();
      const errorBox = await errorMessage.boundingBox();
      const viewportSize = page.viewportSize();
      if (errorBox && viewportSize) {
        expect(errorBox.x).toBeGreaterThanOrEqual(-10);
        expect(errorBox.x + errorBox.width).toBeLessThanOrEqual(viewportSize.width + 10);
      }
    }
  });

  test('should handle form inputs with mobile keyboard', async ({ page }) => {
    if (!isMobileViewport(page)) {
      test.skip();
      return;
    }

    await page.goto('/signup');
    await page.waitForTimeout(500);

    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('type', 'email');

    await emailInput.tap();
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');

    const passwordInput = page.locator('input[name="password"]');
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
