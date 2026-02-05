# Complete Testing Guide

This guide provides step-by-step commands to run all tests without failures.

## Prerequisites

Before running any tests, ensure you have:

1. **Java 17 or higher** installed
   ```bash
   java -version
   ```

2. **Maven 3.6+** installed
   ```bash
   mvn -version
   ```

3. **Node.js 16+** and npm installed
   ```bash
   node -version
   npm -version
   ```

4. **Playwright browsers** installed (for E2E tests)

---

## Part 1: Backend Tests (JUnit 5 + Spring Boot Test)

### Step 1: Navigate to Project Root
```bash
cd /Users/ainexus/Task
```

### Step 2: Clean Previous Build
```bash
mvn clean
```

### Step 3: Compile the Project
```bash
mvn compile
```

### Step 4: Run All Backend Tests
```bash
mvn test
```

**Alternative: Run with detailed output**
```bash
mvn test -X
```

### Step 5: Run Specific Test Classes

**Run only UserServiceTest:**
```bash
mvn test -Dtest=UserServiceTest
```

**Run only UserControllerTest:**
```bash
mvn test -Dtest=UserControllerTest
```

**Run only Integration Tests:**
```bash
mvn test -Dtest=UserManagementIntegrationTest
```

### Step 6: Generate Test Reports
```bash
mvn surefire-report:report
```

Reports will be in: `target/surefire-reports/`

### Step 7: Run Tests with Coverage (Optional)
```bash
mvn clean test jacoco:report
```

---

## Part 2: Frontend Tests (Playwright E2E)

### Step 1: Navigate to Frontend Directory
```bash
cd /Users/ainexus/Task/frontend
```

### Step 2: Install Dependencies (First Time Only)
```bash
npm install
```

### Step 3: Install Playwright Browsers (First Time Only)
```bash
npx playwright install
```

Or use the npm script:
```bash
npm run playwright:install:all
```

### Step 4: Start Backend Server (Required for E2E Tests)

**Open a NEW terminal window** and run:
```bash
cd /Users/ainexus/Task
mvn spring-boot:run
```

Wait for the message: "Started UserManagementApplication"

### Step 5: Run Playwright Tests

**Option A: Headless Mode (Recommended)**
```bash
npm run test:e2e
```

**Option B: UI Mode (Interactive - Best for debugging)**
```bash
npm run test:e2e:ui
```

**Option C: Headed Mode (See browser)**
```bash
npm run test:e2e:headed
```

**Option D: Debug Mode (Step through tests)**
```bash
npm run test:e2e:debug
```

### Step 6: Run Specific Test Files

**Run only signup tests:**
```bash
npx playwright test 01-signup
```

**Run only login tests:**
```bash
npx playwright test 02-login
```

**Run only E2E tests:**
```bash
npx playwright test 06-end-to-end
```

### Step 7: Run Tests by Device

**Desktop only:**
```bash
npm run test:e2e:desktop
```

**Mobile Chrome:**
```bash
npm run test:e2e:mobile-chrome
```

**Mobile Safari:**
```bash
npm run test:e2e:mobile-safari
```

**All devices:**
```bash
npm run test:e2e:all-devices
```

### Step 8: View Test Reports
```bash
npm run test:report
```

This will open the HTML report in your browser.

---

## Part 3: Complete Test Suite (All Tests)

### Method 1: Using the Automated Script

**From project root:**
```bash
chmod +x run-all-tests.sh
./run-all-tests.sh
```

### Method 2: Manual Step-by-Step

**Terminal 1 - Backend Tests:**
```bash
cd /Users/ainexus/Task
mvn clean test
```

**Terminal 2 - Start Backend:**
```bash
cd /Users/ainexus/Task
mvn spring-boot:run
```

**Terminal 3 - Frontend Tests (wait for backend to start):**
```bash
cd /Users/ainexus/Task/frontend
npm install
npx playwright install
npm run test:e2e
```

---

## Troubleshooting

### Backend Test Failures

**Issue: Port 8080 already in use**
```bash
# Find and kill the process
lsof -ti:8080 | xargs kill -9
```

**Issue: Maven dependencies not resolving**
```bash
# Force update
mvn clean install -U
```

**Issue: Tests fail with H2 database error**
```bash
# Clean and rebuild
mvn clean compile test
```

### Frontend Test Failures

**Issue: Backend not running**
- Ensure backend is running on http://localhost:8080
- Check: `curl http://localhost:8080/api/auth/signup`

**Issue: Playwright browsers not installed**
```bash
npx playwright install --with-deps
```

**Issue: Timeout errors**
- Increase timeout in `playwright.config.js`
- Or run tests individually

**Issue: Port 5173 already in use**
```bash
# Kill the process
lsof -ti:5173 | xargs kill -9
```

---

## Quick Reference Commands

### Backend Tests Only
```bash
cd /Users/ainexus/Task && mvn clean test
```

### Frontend Tests Only (Backend must be running!)
```bash
# Terminal 1:
cd /Users/ainexus/Task && mvn spring-boot:run

# Terminal 2 (wait for backend to start):
cd /Users/ainexus/Task/frontend && npm run test:e2e
```

### All Tests (Automated)
```bash
cd /Users/ainexus/Task && ./run-all-tests.sh
```

---

## Test Execution Order

For best results, run tests in this order:

1. **Backend Unit Tests** (fastest)
   ```bash
   mvn test -Dtest=UserServiceTest
   ```

2. **Backend Controller Tests**
   ```bash
   mvn test -Dtest=UserControllerTest
   ```

3. **Backend Integration Tests**
   ```bash
   mvn test -Dtest=UserManagementIntegrationTest
   ```

4. **Start Backend Server**
   ```bash
   mvn spring-boot:run
   ```

5. **Frontend E2E Tests**
   ```bash
   cd frontend && npm run test:e2e
   ```

---

## Expected Results

### Backend Tests (JUnit 5)
- **UserServiceTest**: 10+ tests should pass
- **UserControllerTest**: 13+ tests should pass
- **UserManagementIntegrationTest**: 8+ tests should pass
- **Total**: 30+ tests passing

### Frontend Tests (Playwright)
- **01-signup.spec.js**: 7 tests should pass
- **02-login.spec.js**: 7 tests should pass
- **03-navigation.spec.js**: Variable tests
- **04-profile.spec.js**: Variable tests
- **05-user-list.spec.js**: Variable tests
- **06-end-to-end.spec.js**: 3 major E2E tests should pass
- **07-mobile-specific.spec.js**: Mobile tests

---

## CI/CD Commands

For automated testing in CI/CD pipelines:

```bash
# Backend
mvn clean test -Dspring.profiles.active=test

# Frontend (with backend running)
cd frontend && npm ci && npx playwright install --with-deps && npm run test:e2e
```

---

## Notes

1. **Always start the backend** before running E2E tests
2. **Wait for backend startup** (look for "Started UserManagementApplication")
3. **Use UI mode** (`npm run test:e2e:ui`) when debugging test failures
4. **Run tests in isolation** if experiencing flaky tests
5. **Check logs** in `target/surefire-reports/` for backend test details
6. **Check reports** with `npm run test:report` for frontend test details

---

## Success Indicators

✅ Backend tests: "BUILD SUCCESS" message
✅ Frontend tests: "passed" in test summary
✅ All green checkmarks in Playwright UI
✅ No error messages in terminal output

---

## Support

If tests still fail after following this guide:
1. Check the `JUNIT_TEST_RESULTS.md` for backend test details
2. Check the `E2E_TEST_GUIDE.md` for frontend test details
3. Review error logs in terminal output
4. Verify all prerequisites are installed
