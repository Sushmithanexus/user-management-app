# Mobile Testing Guide

## Overview

This guide covers mobile and responsive testing for the User Management Application using Playwright. Tests run on multiple mobile devices including iOS (Safari) and Android (Chrome) emulators.

## Supported Devices

### Mobile Devices
- **Pixel 5** (Android, Chrome) - 393x851 viewport
- **iPhone 13** (iOS, Safari) - 390x844 viewport

### Tablet
- **iPad Pro** - 1024x1366 viewport

### Desktop
- **Desktop Chrome** - 1280x720 viewport

## Installation

Install Playwright browsers including mobile browsers (WebKit for iOS):

```bash
cd frontend

# Install all browsers (recommended for mobile testing)
npm run playwright:install:all

# Or install specific browsers
npm run playwright:install  # Chromium and WebKit only
```

## Running Mobile Tests

### Run All Mobile Tests (iPhone + Android)
```bash
npm run test:e2e:mobile
```

### Run on Specific Mobile Device
```bash
# Android (Pixel 5)
npm run test:e2e:mobile-chrome

# iOS (iPhone 13)
npm run test:e2e:mobile-safari
```

### Run Tablet Tests
```bash
npm run test:e2e:tablet
```

### Run Desktop Only
```bash
npm run test:e2e:desktop
```

### Run All Devices (Desktop + Mobile + Tablet)
```bash
npm run test:e2e:all-devices
```

### Run Specific Test File on Mobile
```bash
# Run only mobile-specific tests
playwright test e2e/07-mobile-specific.spec.js --project=mobile-chrome

# Run signup tests on iPhone
playwright test e2e/01-signup.spec.js --project=mobile-safari

# Run all tests on Pixel 5
playwright test --project=mobile-chrome
```

### Run with UI Mode (Visual Testing)
```bash
# See tests running on different devices
npm run test:e2e:ui
```

## Mobile-Specific Test Features

The test suite includes mobile-specific scenarios in `e2e/07-mobile-specific.spec.js`:

### ✅ Responsive Layout Tests
- Navigation responsiveness
- Form element sizing
- Viewport-specific rendering
- Element overflow detection

### ✅ Touch Interaction Tests
- Tap gestures vs clicks
- Touch-based form interactions
- Scroll behavior on mobile
- Swipe gestures (if applicable)

### ✅ Mobile Input Tests
- Mobile keyboard triggers (email, number, password)
- Input field focus behavior
- Form validation on mobile
- Error message visibility

### ✅ Orientation Tests
- Portrait mode (default)
- Landscape mode simulation
- Layout adaptation

### ✅ Mobile Performance Tests
- Page load on mobile networks
- Render time on mobile devices
- Resource optimization

### ✅ Touch Gesture Tests
- Navigation via tap
- Back/forward gestures
- Form submission via tap

## Test Structure

All existing tests automatically run on mobile devices:
- `01-signup.spec.js` - Runs on all configured devices
- `02-login.spec.js` - Runs on all configured devices
- `03-navigation.spec.js` - Runs on all configured devices
- `04-profile.spec.js` - Runs on all configured devices
- `05-user-list.spec.js` - Runs on all configured devices
- `06-end-to-end.spec.js` - Runs on all configured devices
- `07-mobile-specific.spec.js` - Mobile-only tests (automatically skipped on desktop)

## Viewing Test Results

### HTML Report (Shows Results Per Device)
```bash
npm run test:report
```

The report shows separate results for each device:
- ✅ chromium (Desktop)
- ✅ mobile-chrome (Pixel 5)
- ✅ mobile-safari (iPhone 13)
- ✅ tablet (iPad Pro)

### Screenshots & Videos

Mobile test failures include:
- Device-specific screenshots
- Video recordings
- Viewport dimensions
- Touch interaction traces

Location: `test-results/` directory

## Mobile Testing Best Practices

### 1. **Use Touch Interactions**
```javascript
// Good for mobile
await page.tap('button');

// Also works (Playwright auto-converts)
await page.click('button');
```

### 2. **Check Viewport Size**
```javascript
test('mobile test', async ({ page, isMobile }) => {
  if (!isMobile) test.skip();

  const viewport = page.viewportSize();
  expect(viewport.width).toBeLessThan(768);
});
```

### 3. **Test Responsive Elements**
```javascript
// Verify elements are within viewport
const button = page.locator('button');
const box = await button.boundingBox();
const viewport = page.viewportSize();

expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
```

### 4. **Test Mobile-Specific Inputs**
```javascript
// Email input should have type="email"
await expect(page.locator('input[name="email"]'))
  .toHaveAttribute('type', 'email');

// Triggers mobile keyboard
```

### 5. **Handle Different Screen Sizes**
```javascript
// Portrait
await page.setViewportSize({ width: 390, height: 844 });

// Landscape
await page.setViewportSize({ width: 844, height: 390 });
```

## Troubleshooting

### Mobile Tests Not Running
**Problem**: Tests skip mobile devices

**Solution**:
```bash
# Install WebKit for iOS testing
npx playwright install webkit

# Verify installation
npx playwright test --list --project=mobile-safari
```

### Touch Events Not Working
**Problem**: Tap/touch interactions fail

**Solution**:
```javascript
// Use tap for explicit touch
await page.tap('button');

// Or use click (auto-converts)
await page.click('button');
```

### Viewport Issues
**Problem**: Elements not visible on mobile

**Solution**:
```javascript
// Check if element is in viewport
const element = page.locator('button');
await element.scrollIntoViewIfNeeded();
await element.click();
```

### Slow Mobile Tests
**Problem**: Tests timeout on mobile

**Solution**:
```javascript
// Increase timeouts for mobile
test('slow mobile test', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds

  await page.goto('/login', { timeout: 30000 });
});
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Mobile E2E Tests

on: [push, pull_request]

jobs:
  mobile-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install dependencies
        run: |
          cd frontend
          npm install

      - name: Install Playwright browsers
        run: |
          cd frontend
          npx playwright install --with-deps

      - name: Start backend
        run: mvn spring-boot:run &

      - name: Wait for backend
        run: sleep 30

      - name: Run mobile tests
        run: |
          cd frontend
          npm run test:e2e:mobile

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: mobile-test-results
          path: frontend/playwright-report/
```

## Command Reference

| Command | Description |
|---------|-------------|
| `npm run test:e2e` | All tests on all devices |
| `npm run test:e2e:mobile` | Mobile devices only (iPhone + Pixel) |
| `npm run test:e2e:mobile-chrome` | Android Pixel 5 only |
| `npm run test:e2e:mobile-safari` | iOS iPhone 13 only |
| `npm run test:e2e:tablet` | iPad Pro only |
| `npm run test:e2e:desktop` | Desktop Chrome only |
| `npm run test:e2e:all-devices` | All configured devices |
| `npm run test:e2e:ui` | Interactive UI mode |
| `npm run test:report` | View HTML report |

## Mobile Test Coverage

| Feature | Desktop | Mobile | Tablet |
|---------|---------|--------|--------|
| Signup Form | ✅ | ✅ | ✅ |
| Login Flow | ✅ | ✅ | ✅ |
| Navigation | ✅ | ✅ | ✅ |
| Profile Management | ✅ | ✅ | ✅ |
| User List (Admin) | ✅ | ✅ | ✅ |
| Responsive Layout | ✅ | ✅ | ✅ |
| Touch Interactions | N/A | ✅ | ✅ |
| Mobile Keyboard | N/A | ✅ | ✅ |
| Orientation Change | N/A | ✅ | ✅ |

## Adding Custom Mobile Devices

Edit `playwright.config.js`:

```javascript
projects: [
  {
    name: 'custom-device',
    use: {
      ...devices['Galaxy S9+'],  // Use predefined device
    },
  },
  {
    name: 'custom-viewport',
    use: {
      viewport: { width: 375, height: 667 },  // Custom size
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    },
  },
],
```

Available devices: https://playwright.dev/docs/emulation#devices

## Quick Start

```bash
# 1. Install browsers
npm run playwright:install:all

# 2. Start backend (separate terminal)
cd /Users/ainexus/Task
mvn spring-boot:run

# 3. Run mobile tests
cd frontend
npm run test:e2e:mobile

# 4. View results
npm run test:report
```

## Summary

✅ **Mobile Testing Features**:
- iOS (iPhone) and Android (Pixel) device emulation
- Touch interaction testing
- Responsive layout verification
- Mobile keyboard testing
- Orientation change testing
- Separate test reports per device
- Screenshots and videos for debugging

Your E2E tests now run on **4 different viewports** (Desktop, Android, iOS, Tablet) ensuring a responsive user experience across all devices! 📱🖥️💯
