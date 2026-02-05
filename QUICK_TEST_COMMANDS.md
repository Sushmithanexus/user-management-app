# Quick Test Commands Reference

## 🚀 Quick Start - Run Everything

```bash
# From project root
./run-all-tests.sh
```

---

## Backend Tests (JUnit 5 + Spring Boot)

### Run All Backend Tests
```bash
cd /Users/ainexus/Task
mvn clean test
```

### Run Individual Test Classes
```bash
# Service tests
mvn test -Dtest=UserServiceTest

# Controller tests
mvn test -Dtest=UserControllerTest

# Integration tests
mvn test -Dtest=UserManagementIntegrationTest
```

### Run Specific Test Method
```bash
mvn test -Dtest=UserServiceTest#testRegisterUser_Success
```

---

## Frontend Tests (Playwright E2E)

### Prerequisites
```bash
cd /Users/ainexus/Task/frontend
npm install
npx playwright install
```

### Start Backend (Required!)
```bash
# Terminal 1 - Keep this running
cd /Users/ainexus/Task
mvn spring-boot:run
```

### Run E2E Tests
```bash
# Terminal 2 - Wait for backend to start first
cd /Users/ainexus/Task/frontend

# Headless mode (fast)
npm run test:e2e

# UI mode (best for debugging)
npm run test:e2e:ui

# Headed mode (see browser)
npm run test:e2e:headed

# Debug mode
npm run test:e2e:debug
```

### Run Specific Tests
```bash
# Single test file
npx playwright test 01-signup

# Multiple test files
npx playwright test 01-signup 02-login

# By test name
npx playwright test -g "should successfully register"
```

### Device-Specific Tests
```bash
# Desktop only
npm run test:e2e:desktop

# Mobile Chrome
npm run test:e2e:mobile-chrome

# Mobile Safari
npm run test:e2e:mobile-safari

# Tablet
npm run test:e2e:tablet

# All devices
npm run test:e2e:all-devices
```

---

## View Reports

### Backend Test Reports
```bash
# Generate report
mvn surefire-report:report

# Open report (Mac)
open target/site/surefire-report.html
```

### Frontend Test Reports
```bash
# View last test report
cd /Users/ainexus/Task/frontend
npm run test:report
```

---

## Troubleshooting Commands

### Kill Process on Port
```bash
# Kill backend (port 8080)
lsof -ti:8080 | xargs kill -9

# Kill frontend (port 5173)
lsof -ti:5173 | xargs kill -9
```

### Clean Build
```bash
# Backend
mvn clean install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Verify Backend is Running
```bash
curl http://localhost:8080/api/auth/signup
# Should return: {"timestamp":..., "status":400, ...}
```

---

## One-Liner Commands

### Backend Only
```bash
cd /Users/ainexus/Task && mvn clean test
```

### Frontend Only (with backend check)
```bash
cd /Users/ainexus/Task/frontend && (curl -s http://localhost:8080/api/auth/signup > /dev/null && npm run test:e2e || echo "❌ Backend not running! Start it with: mvn spring-boot:run")
```

### All Tests Sequential
```bash
cd /Users/ainexus/Task && mvn clean test && mvn spring-boot:run > /tmp/backend.log 2>&1 & sleep 30 && cd frontend && npm run test:e2e; kill $(lsof -ti:8080)
```

---

## Common Issues & Fixes

### Backend won't start
```bash
# Check if port is in use
lsof -i:8080

# Kill and restart
lsof -ti:8080 | xargs kill -9
mvn spring-boot:run
```

### Frontend tests timeout
```bash
# Verify backend is up
curl http://localhost:8080/api/auth/signup

# Run with longer timeout
cd frontend
npx playwright test --timeout=60000
```

### Maven dependencies issue
```bash
mvn clean install -U
```

### Playwright browsers not found
```bash
cd frontend
npx playwright install --with-deps
```

---

## CI/CD Commands

```bash
# Backend
mvn clean test -Dspring.profiles.active=test

# Frontend (headless, CI optimized)
cd frontend
npm ci
npx playwright install --with-deps
npm run test:e2e
```

---

## Test Execution Time

- **Backend Tests**: ~30 seconds
- **Frontend E2E Tests**: ~2-5 minutes (depends on device selection)
- **All Tests**: ~6-8 minutes

---

## Success Criteria

✅ Backend: "BUILD SUCCESS" + all tests green
✅ Frontend: "passed" in summary + no failures
✅ No red error messages in console

---

## Get Help

For detailed instructions, see:
- `COMPLETE_TEST_GUIDE.md` - Full step-by-step guide
- `E2E_TEST_GUIDE.md` - Playwright test details
- `JUNIT_TEST_RESULTS.md` - Backend test details
