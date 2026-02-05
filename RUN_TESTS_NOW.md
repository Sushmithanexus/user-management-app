# 🚀 RUN TESTS NOW - Simple Step-by-Step Guide

## ✅ Option 1: Run Everything (Recommended)

**Single command to run all tests:**

```bash
cd /Users/ainexus/Task
./run-all-tests.sh
```

This will:
1. Run all backend tests (JUnit 5 + Spring Boot)
2. Start the backend server automatically
3. Run all Playwright E2E tests
4. Stop the backend server
5. Show summary

**Time:** ~6-8 minutes

---

## ✅ Option 2: Run Tests Separately

### Step 1: Run Backend Tests

```bash
cd /Users/ainexus/Task
./run-junit-tests.sh
```

**OR manually:**

```bash
cd /Users/ainexus/Task
mvn clean test
```

**Expected:** ✅ BUILD SUCCESS with 30+ tests passing

---

### Step 2: Run Frontend Tests

**Terminal 1 - Start Backend:**

```bash
cd /Users/ainexus/Task
mvn spring-boot:run
```

⏳ **Wait for:** "Started UserManagementApplication" message (~30 seconds)

**Terminal 2 - Run E2E Tests:**

```bash
cd /Users/ainexus/Task
./run-playwright-tests.sh
```

**OR manually:**

```bash
cd /Users/ainexus/Task/frontend
npm run test:e2e
```

**Expected:** ✅ All tests passed

---

## ✅ Option 3: Run Individual Test Categories

### Backend Tests Only

```bash
# Service tests
mvn test -Dtest=UserServiceTest

# Controller tests
mvn test -Dtest=UserControllerTest

# Integration tests
mvn test -Dtest=UserManagementIntegrationTest
```

### Frontend Tests by Type

**Make sure backend is running first!**

```bash
# Signup tests only
npx playwright test 01-signup

# Login tests only
npx playwright test 02-login

# End-to-end tests
npx playwright test 06-end-to-end

# All tests in UI mode (interactive)
npm run test:e2e:ui
```

---

## 🔧 First Time Setup

If this is your first time running tests, run these commands first:

```bash
# 1. Go to project directory
cd /Users/ainexus/Task

# 2. Install backend dependencies
mvn clean install

# 3. Install frontend dependencies
cd frontend
npm install

# 4. Install Playwright browsers
npx playwright install

# 5. Make scripts executable
cd ..
chmod +x *.sh
```

---

## 🐛 Troubleshooting

### Backend won't start?

```bash
# Kill any process on port 8080
lsof -ti:8080 | xargs kill -9

# Try starting again
mvn spring-boot:run
```

### Frontend tests fail immediately?

```bash
# Check if backend is running
curl http://localhost:8080/api/auth/signup

# Should return JSON with status 400
```

### Tests are flaky?

```bash
# Run tests in UI mode to debug
cd frontend
npm run test:e2e:ui
```

---

## 📊 View Test Reports

### After Backend Tests:

```bash
mvn surefire-report:report
open target/site/surefire-report.html
```

### After Frontend Tests:

```bash
cd frontend
npm run test:report
```

---

## ⚡ Quick Commands Cheat Sheet

| Task | Command |
|------|---------|
| All tests | `./run-all-tests.sh` |
| Backend only | `./run-junit-tests.sh` |
| Frontend only | `./run-playwright-tests.sh` |
| Start backend | `mvn spring-boot:run` |
| E2E UI mode | `cd frontend && npm run test:e2e:ui` |
| Clean build | `mvn clean install` |

---

## ✅ Success Indicators

**Backend Tests:**
- ✅ "BUILD SUCCESS" message at the end
- ✅ "Tests run: 30+, Failures: 0, Errors: 0"
- ✅ All test classes show green

**Frontend Tests:**
- ✅ "passed" in the test summary
- ✅ No red "FAILED" messages
- ✅ HTML report opens successfully

---

## 📝 Test Execution Order

For most reliable results:

1. **First:** Backend tests (fast, no dependencies)
   ```bash
   mvn clean test
   ```

2. **Second:** Start backend server
   ```bash
   mvn spring-boot:run
   ```

3. **Third:** Frontend E2E tests (requires backend)
   ```bash
   cd frontend && npm run test:e2e
   ```

---

## 🎯 Recommended Workflow

### For Quick Testing:
```bash
./run-all-tests.sh
```

### For Development:
```bash
# Terminal 1: Keep backend running
mvn spring-boot:run

# Terminal 2: Run tests as needed
cd frontend
npm run test:e2e:ui  # Interactive mode for debugging
```

---

## 📚 Additional Documentation

- **COMPLETE_TEST_GUIDE.md** - Comprehensive testing guide with detailed explanations
- **QUICK_TEST_COMMANDS.md** - Command reference for all test scenarios
- **E2E_TEST_GUIDE.md** - Playwright-specific testing guide
- **JUNIT_TEST_RESULTS.md** - Backend test details and results

---

## ⏱️ Estimated Times

- Backend Tests: ~30 seconds
- Backend Startup: ~30 seconds
- Frontend E2E Tests: ~2-5 minutes
- **Total (all tests):** ~6-8 minutes

---

## 💡 Tips

1. **Use UI mode** when debugging test failures:
   ```bash
   npm run test:e2e:ui
   ```

2. **Run specific tests** when developing:
   ```bash
   npx playwright test 01-signup
   ```

3. **Check backend logs** if tests fail:
   ```bash
   # Backend logs are in terminal where mvn spring-boot:run is running
   ```

4. **Always wait** for backend to fully start before running E2E tests

5. **Use parallel execution** for faster results:
   ```bash
   # This is already configured in playwright.config.js
   ```

---

## 🎉 You're Ready!

Choose your preferred option above and run the tests. If you encounter any issues, check the troubleshooting section or refer to the detailed guides.

**Recommended first command:**

```bash
cd /Users/ainexus/Task && ./run-all-tests.sh
```

This will give you a complete test run with automatic backend management!
