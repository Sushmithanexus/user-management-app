# E2E Testing with Playwright

This directory contains end-to-end tests for the User Management Application using Playwright.

## Test Structure

```
e2e/
├── helpers/
│   ├── auth-helpers.js      # Authentication helper functions
│   └── test-data.js         # Test data and constants
├── 01-signup.spec.js        # Signup functionality tests
├── 02-login.spec.js         # Login functionality tests
├── 03-navigation.spec.js    # Navigation and routing tests
├── 04-profile.spec.js       # Profile management tests
├── 05-user-list.spec.js     # User list (admin) tests
└── 06-end-to-end.spec.js    # Complete user journey tests
```

## Prerequisites

1. **Backend must be running** on `http://localhost:8080`
2. **Frontend dev server** will be started automatically by Playwright
3. Playwright browsers installed (run `npm run playwright:install`)

## Running Tests

### Install Playwright browsers (first time only)
```bash
npm run playwright:install
```

### Run all tests (headless)
```bash
npm run test:e2e
```

### Run tests with UI mode (interactive)
```bash
npm run test:e2e:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:e2e:headed
```

### Debug tests
```bash
npm run test:e2e:debug
```

### View test report
```bash
npm run test:report
```

## Test Coverage

### 1. Signup Tests (`01-signup.spec.js`)
- Display signup form
- Validate password matching
- Validate password length
- Successful user registration
- Duplicate username detection
- Required field validation
- Navigation to login

### 2. Login Tests (`02-login.spec.js`)
- Display login form
- Invalid credentials handling
- Successful login
- Token storage
- User data persistence
- Required field validation

### 3. Navigation Tests (`03-navigation.spec.js`)
- Home page display
- Authenticated vs unauthenticated navigation
- Protected route access
- Logout functionality
- Route redirection

### 4. Profile Tests (`04-profile.spec.js`)
- Profile page display
- User information display
- Profile editing
- Authentication required

### 5. User List Tests (`05-user-list.spec.js`)
- Users page display
- User list rendering
- Admin role display
- User deletion (admin)
- Authentication required

### 6. End-to-End Tests (`06-end-to-end.spec.js`)
- Complete user journey
- Multiple users workflow
- Authentication persistence
- Cross-page navigation

## Test Data

Tests use dynamically generated data to avoid conflicts:
- Usernames: `{prefix}_test_{timestamp}`
- Emails: `{prefix}_{timestamp}@test.com`
- Passwords: Strong passwords with special characters

## Best Practices

1. **Isolation**: Each test is independent and doesn't rely on others
2. **Cleanup**: Tests clean up authentication state before running
3. **Waiting**: Appropriate waits are used for async operations
4. **Assertions**: Clear, meaningful assertions for better debugging
5. **Naming**: Descriptive test names that explain what's being tested

## Troubleshooting

### Backend not running
Ensure Spring Boot application is running on port 8080:
```bash
cd ..
mvn spring-boot:run
```

### Port already in use
If frontend port 5173 is in use, either:
- Stop the existing process
- Update `baseURL` in `playwright.config.js`

### Test failures
1. Check backend is running and accessible
2. Verify database is clean (H2 in-memory resets on restart)
3. Check browser console for errors using `--headed` mode
4. Review screenshots in `test-results/` directory

## CI/CD Integration

The tests are configured to work in CI environments:
- Retries: 2 attempts in CI
- Workers: 1 worker to avoid race conditions
- Screenshots: Captured on failure
- Videos: Recorded on failure

## Extending Tests

To add new tests:
1. Create a new spec file in `e2e/` directory
2. Follow naming convention: `NN-feature-name.spec.js`
3. Import helpers from `helpers/` directory
4. Use consistent test structure and naming
5. Add documentation to this README
