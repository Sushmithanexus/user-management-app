# 📋 Test Commands Summary

## 🎯 RECOMMENDED: Run All Tests (Single Command)

```bash
cd /Users/ainexus/Task && ./run-all-tests.sh
```

This is the **easiest and most reliable** way to run all tests.

---

## 📝 All Available Commands

### 1️⃣ JUnit 5 + Spring Boot Backend Tests

```bash
# Using script (recommended)
./run-junit-tests.sh

# OR manually
mvn clean test

# OR specific test classes
mvn test -Dtest=UserServiceTest
mvn test -Dtest=UserControllerTest
mvn test -Dtest=UserManagementIntegrationTest
```

**Expected Output:** ✅ BUILD SUCCESS

---

### 2️⃣ Playwright E2E Frontend Tests

**IMPORTANT:** Backend must be running first!

**Step 1 - Start Backend (Terminal 1):**
```bash
cd /Users/ainexus/Task
mvn spring-boot:run
```

Wait for: "Started UserManagementApplication"

**Step 2 - Run E2E Tests (Terminal 2):**
```bash
# Using script (recommended)
cd /Users/ainexus/Task
./run-playwright-tests.sh

# OR manually
cd frontend
npm run test:e2e
```

**Expected Output:** ✅ passed (X passing)

---

### 3️⃣ Spring Boot Application Tests

These are your integration tests that test the full application:

```bash
mvn test -Dtest=UserManagementIntegrationTest
```

**OR run all Spring Boot tests:**
```bash
mvn spring-boot:test
```

---

## 🎨 Playwright Test Modes

### Standard Modes

```bash
cd /Users/ainexus/Task/frontend

# Headless (fast, no UI)
npm run test:e2e

# Interactive UI mode (best for debugging)
npm run test:e2e:ui

# Headed mode (see browser in action)
npm run test:e2e:headed

# Debug mode (step through tests)
npm run test:e2e:debug
```

### Device-Specific Tests

```bash
# Desktop browser only
npm run test:e2e:desktop

# Mobile Chrome only
npm run test:e2e:mobile-chrome

# Mobile Safari only
npm run test:e2e:mobile-safari

# Tablet only
npm run test:e2e:tablet

# Mobile devices (Chrome + Safari)
npm run test:e2e:mobile

# Desktop + Mobile
npm run test:e2e:desktop-mobile

# All devices (Desktop + Mobile + Tablet)
npm run test:e2e:all-devices
```

### Specific Test Files

```bash
# Run specific test file
npx playwright test 01-signup
npx playwright test 02-login
npx playwright test 06-end-to-end

# Run multiple files
npx playwright test 01-signup 02-login

# Run tests matching a pattern
npx playwright test -g "should successfully"
```

---

## 📊 View Test Reports

### Backend Test Reports

```bash
# Generate report
mvn surefire-report:report

# View report (Mac)
open target/site/surefire-report.html

# View report (Linux)
xdg-open target/site/surefire-report.html
```

### Frontend Test Reports

```bash
cd /Users/ainexus/Task/frontend
npm run test:report
```

---

## 🔄 Complete Test Workflow

### Option A: Automated (Easiest)

```bash
cd /Users/ainexus/Task
./run-all-tests.sh
```

### Option B: Manual Control

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
⏳ Wait for startup (~30 seconds)

**Terminal 3 - Frontend Tests:**
```bash
cd /Users/ainexus/Task/frontend
npm run test:e2e
```

---

## 🚑 Emergency Commands

### Kill Stuck Processes

```bash
# Kill backend (port 8080)
lsof -ti:8080 | xargs kill -9

# Kill frontend (port 5173)
lsof -ti:5173 | xargs kill -9
```

### Clean Everything

```bash
# Backend clean
cd /Users/ainexus/Task
mvn clean

# Frontend clean
cd frontend
rm -rf node_modules playwright-report test-results
npm install
```

### Reinstall Playwright

```bash
cd /Users/ainexus/Task/frontend
npx playwright install --with-deps
```

---

## ✅ Test Categories

| Category | Command | Time | Backend Required |
|----------|---------|------|------------------|
| Backend Unit Tests | `mvn test` | ~30s | No |
| Backend Integration | `mvn test -Dtest=*Integration*` | ~20s | No |
| E2E Signup/Login | `npx playwright test 01-signup 02-login` | ~1m | Yes |
| E2E Full Journey | `npx playwright test 06-end-to-end` | ~2m | Yes |
| All E2E Tests | `npm run test:e2e` | ~3-5m | Yes |
| Everything | `./run-all-tests.sh` | ~6-8m | Auto-managed |

---

## 🎯 Quick Decision Guide

**Want to test everything quickly?**
```bash
./run-all-tests.sh
```

**Just backend changes?**
```bash
mvn clean test
```

**Just frontend changes?**
```bash
# Terminal 1: mvn spring-boot:run
# Terminal 2:
cd frontend && npm run test:e2e
```

**Debugging a specific test?**
```bash
# Terminal 1: mvn spring-boot:run
# Terminal 2:
cd frontend && npm run test:e2e:ui
# Then click on the failing test
```

**CI/CD pipeline?**
```bash
mvn clean test && mvn spring-boot:run &
sleep 30
cd frontend && npm run test:e2e
kill $(lsof -ti:8080)
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **RUN_TESTS_NOW.md** | Quick start guide (START HERE) |
| **COMPLETE_TEST_GUIDE.md** | Comprehensive testing guide |
| **QUICK_TEST_COMMANDS.md** | Command reference |
| **TEST_COMMANDS_SUMMARY.md** | This file |
| **E2E_TEST_GUIDE.md** | Playwright details |
| **JUNIT_TEST_RESULTS.md** | Backend test details |

---

## 🏆 Success Criteria

### Backend Tests Success:
```
[INFO] Tests run: 30+, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

### Frontend Tests Success:
```
30 passed (5m)
```

### Combined Success:
All scripts should show ✅ and exit with code 0

---

## 💡 Pro Tips

1. **Always use UI mode when debugging:**
   ```bash
   npm run test:e2e:ui
   ```

2. **Run tests in watch mode during development:**
   ```bash
   mvn test -Dtest=UserServiceTest
   # Make changes, re-run
   ```

3. **Use grep to filter Playwright tests:**
   ```bash
   npx playwright test -g "signup"
   ```

4. **Check backend health before E2E tests:**
   ```bash
   curl http://localhost:8080/api/auth/signup
   ```

5. **Save time with targeted tests:**
   ```bash
   # Only test what you changed
   mvn test -Dtest=UserServiceTest#testRegisterUser_Success
   ```

---

## 🎉 Ready to Run!

**RECOMMENDED COMMAND FOR FIRST TIME:**

```bash
cd /Users/ainexus/Task && ./run-all-tests.sh
```

This will run everything automatically and show you a complete summary!

---

**Need help?** Check:
- `RUN_TESTS_NOW.md` - Step-by-step instructions
- `COMPLETE_TEST_GUIDE.md` - Full documentation
- Terminal output for specific error messages
