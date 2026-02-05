# E2E Testing Guide - User Management Application

## Quick Start

### 1. Install Playwright Browsers
```bash
cd frontend
npm run playwright:install
```

### 2. Start Backend
Make sure your Spring Boot backend is running on port 8080:
```bash
# From project root
mvn spring-boot:run
```

### 3. Run Tests
```bash
# From frontend directory
cd frontend

# Run all tests (headless)
npm run test:e2e

# Run with UI mode (recommended for first run)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed
```

## What Gets Tested

### ✅ User Registration
- Form validation
- Password matching
- Duplicate user detection
- Successful registration flow

### ✅ User Login
- Credential validation
- Token generation and storage
- Authentication persistence
- Error handling

### ✅ Navigation & Routing
- Public vs protected routes
- Authentication-based navigation
- Logout functionality
- Route guards

### ✅ Profile Management
- View profile information
- Edit profile (if implemented)
- Protected access

### ✅ User List (Admin)
- View all users
- Admin role verification
- User deletion
- Protected access

### ✅ Complete User Journeys
- Signup → Login → Profile → Logout
- Multiple user scenarios
- Cross-page navigation
- State persistence

## Test Reports

After running tests, view the detailed report:
```bash
npm run test:report
```

The report includes:
- Test results summary
- Screenshots of failures
- Videos of test execution (on failure)
- Execution timeline
- Detailed logs

## Continuous Integration

Tests are configured for CI/CD with:
- Automatic retries on failure
- Screenshot capture on errors
- Video recording of failures
- HTML and JSON reports

## File Structure

```
frontend/
├── e2e/
│   ├── helpers/
│   │   ├── auth-helpers.js
│   │   └── test-data.js
│   ├── 01-signup.spec.js
│   ├── 02-login.spec.js
│   ├── 03-navigation.spec.js
│   ├── 04-profile.spec.js
│   ├── 05-user-list.spec.js
│   ├── 06-end-to-end.spec.js
│   └── README.md
├── playwright.config.js
└── package.json
```

## Prerequisites Checklist

Before running tests, ensure:
- [ ] Node.js and npm installed
- [ ] Playwright browsers installed (`npm run playwright:install`)
- [ ] Backend running on http://localhost:8080
- [ ] Backend database is accessible (H2 in-memory)
- [ ] No other process using port 5173

## Common Commands

```bash
# Install dependencies
npm install

# Install Playwright browsers
npm run playwright:install

# Run all tests
npm run test:e2e

# Run tests with UI
npm run test:e2e:ui

# Run in headed mode
npm run test:e2e:headed

# Debug specific test
npm run test:e2e:debug

# View test report
npm run test:report
```

## Troubleshooting

### Backend Connection Errors
**Problem**: Tests fail with connection errors

**Solution**:
```bash
# Verify backend is running
curl http://localhost:8080/api/auth/signup

# If not, start backend
mvn spring-boot:run
```

### Port Already in Use
**Problem**: Frontend port 5173 is already in use

**Solution**:
```bash
# Find and kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Browser Not Installed
**Problem**: Error about missing browsers

**Solution**:
```bash
npm run playwright:install
```

### Test Timeouts
**Problem**: Tests timeout waiting for elements

**Solution**:
- Ensure backend is responding quickly
- Check network tab in headed mode
- Increase timeout in test if needed

## Best Practices

1. **Run backend first** before executing tests
2. **Use UI mode** for debugging failures
3. **Check screenshots** in test-results folder for visual debugging
4. **Clean database** between test runs (H2 resets automatically)
5. **Review HTML report** for detailed failure analysis

## Success Criteria

All tests should pass with:
- ✅ Green checkmarks for all test cases
- ✅ No timeout errors
- ✅ Successful API calls to backend
- ✅ Proper authentication flow
- ✅ Protected routes working correctly

## Next Steps

After successful test execution:
1. Review the HTML report
2. Check code coverage (if configured)
3. Integrate tests into CI/CD pipeline
4. Set up automated test runs
5. Add more test cases as features are added
