# Run All Tests - Complete Guide

This guide shows you how to run all test cases in the User Management Application.

## Test Coverage Summary

| Test Type | Count | Technology | What It Tests |
|-----------|-------|------------|---------------|
| Backend Unit Tests | 29 | JUnit 5 + Mockito | Service & Controller logic |
| Backend Integration Tests | 10 | Spring Test | Full API workflows |
| Desktop E2E Tests | 35 | Playwright | Desktop browser flows |
| Mobile Android E2E Tests | 45 | Playwright | Pixel 5 device |
| Mobile iOS E2E Tests | 45 | Playwright | iPhone 13 device |
| Tablet E2E Tests | 35 | Playwright | iPad Pro |
| **TOTAL** | **199** | | **All layers** |

---

## Quick Start - Run Everything

### **Option 1: Automated Script (Recommended)**

Run all tests automatically with one command:

```bash
# From project root
./run-all-tests.sh
```

This will:
1. Run backend tests (JUnit5 + Spring)
2. Start backend server
3. Run E2E tests on all devices (Desktop, Mobile, Tablet)
4. Stop backend server
5. Show summary

**Execution Time**: ~5-7 minutes

---

### **Option 2: Manual Execution**

#### **Step 1: Run Backend Tests**

```bash
# Option A: Use helper script
./run-backend-tests.sh

# Option B: Use Maven directly
mvn test

# Option C: Run specific test types
mvn test -Dtest=**/*Test.java              # Unit tests only
mvn test -Dtest=**/*IntegrationTest.java   # Integration tests only
```

**Expected Output**: 39 tests passed

#### **Step 2: Start Backend Server**

```bash
# Terminal 1
mvn spring-boot:run

# Wait for: "Started UserManagementApplication in X seconds"
```

#### **Step 3: Run E2E Tests**

```bash
# Terminal 2
cd frontend

# Option A: All devices (Desktop + Mobile + Tablet)
npm run test:e2e:all-devices

# Option B: Mobile only
npm run test:e2e:mobile

# Option C: Desktop only
npm run test:e2e:desktop

# Option D: Specific device
npm run test:e2e:mobile-chrome    # Android
npm run test:e2e:mobile-safari    # iOS
npm run test:e2e:tablet           # iPad
```

**Expected Output**:
- All devices: 160 tests passed
- Mobile only: 90 tests passed
- Desktop only: 35 tests passed

---

## Test Scripts Reference

### **Main Scripts**

```bash
# Run ALL tests (Backend + E2E)
./run-all-tests.sh

# Run only Backend tests
./run-backend-tests.sh

# Run only E2E tests (requires backend running)
./run-e2e-tests.sh
```

### **Backend Test Commands**

```bash
# All backend tests
mvn test

# With detailed output
mvn test -X

# Specific test class
mvn test -Dtest=UserServiceTest
mvn test -Dtest=UserControllerTest
mvn test -Dtest=UserManagementIntegrationTest

# Specific test method
mvn test -Dtest=UserServiceTest#testRegisterUser_Success

# With coverage report
mvn clean test jacoco:report

# Run tests in parallel
mvn test -DforkCount=4

# Skip tests during build
mvn clean install -DskipTests
```

### **Frontend E2E Commands**

```bash
cd frontend

# All devices
npm run test:e2e:all-devices      # Desktop + Mobile + Tablet
npm run test:e2e                  # Desktop only (default)

# Mobile devices
npm run test:e2e:mobile           # iOS + Android
npm run test:e2e:mobile-chrome    # Android Pixel 5
npm run test:e2e:mobile-safari    # iOS iPhone 13

# Tablet
npm run test:e2e:tablet           # iPad Pro

# Desktop
npm run test:e2e:desktop          # Chrome Desktop

# Interactive modes
npm run test:e2e:ui               # UI mode (visual)
npm run test:e2e:headed           # Headed mode (see browser)
npm run test:e2e:debug            # Debug mode

# View report
npm run test:report
```

---

## Test Execution Matrix

### Backend Tests

| Command | Unit Tests | Integration Tests | Execution Time |
|---------|------------|-------------------|----------------|
| `mvn test` | ✅ 29 | ✅ 10 | ~15-20 seconds |
| `./run-backend-tests.sh` | ✅ 29 | ✅ 10 | ~15-20 seconds |

### Frontend E2E Tests

| Command | Desktop | Mobile (iOS) | Mobile (Android) | Tablet | Total Tests | Execution Time |
|---------|---------|--------------|------------------|--------|-------------|----------------|
| `npm run test:e2e` | ✅ 35 | ❌ | ❌ | ❌ | 35 | ~1-2 min |
| `npm run test:e2e:mobile` | ❌ | ✅ 45 | ✅ 45 | ❌ | 90 | ~3-4 min |
| `npm run test:e2e:all-devices` | ✅ 35 | ✅ 45 | ✅ 45 | ✅ 35 | 160 | ~5-7 min |

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Run All Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up JDK 21
        uses: actions/setup-java@v3
        with:
          java-version: '21'
          distribution: 'temurin'

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Run Backend Tests
        run: mvn test

      - name: Start Backend
        run: mvn spring-boot:run &

      - name: Wait for Backend
        run: sleep 30

      - name: Install Frontend Dependencies
        run: |
          cd frontend
          npm install

      - name: Install Playwright Browsers
        run: |
          cd frontend
          npx playwright install --with-deps

      - name: Run E2E Tests
        run: |
          cd frontend
          npm run test:e2e:all-devices

      - name: Upload Test Report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: |
            target/surefire-reports/
            frontend/playwright-report/
```

---

## Viewing Test Reports

### Backend Test Reports

```bash
# Surefire report (basic)
open target/surefire-reports/index.html

# JaCoCo coverage report
mvn jacoco:report
open target/site/jacoco/index.html
```

### Frontend Test Reports

```bash
cd frontend

# Open HTML report in browser
npm run test:report

# Report location
open playwright-report/index.html
```

---

## Troubleshooting

### Backend Tests

**Problem**: Tests fail with "Port already in use"

**Solution**:
```bash
# Stop the running application
lsof -ti:8080 | xargs kill -9
```

**Problem**: Database connection errors

**Solution**: Tests use H2 in-memory, no external database needed

---

### E2E Tests

**Problem**: Tests fail with connection errors

**Solution**:
```bash
# Verify backend is running
curl http://localhost:8080/api/auth/signup

# If not, start it
mvn spring-boot:run
```

**Problem**: Mobile browsers not installed

**Solution**:
```bash
cd frontend
npm run playwright:install:all
```

**Problem**: Tests timeout

**Solution**:
- Ensure backend is responding quickly
- Check if port 5173 is available
- Increase timeout in test configuration

---

## Test Files Location

### Backend Tests
```
src/test/java/com/usermanagement/
├── controller/
│   └── UserControllerTest.java          # 12 tests
├── service/
│   └── UserServiceTest.java             # 17 tests
└── integration/
    └── UserManagementIntegrationTest.java  # 10 tests
```

### Frontend Tests
```
frontend/e2e/
├── 01-signup.spec.js           # Signup flow tests
├── 02-login.spec.js            # Login flow tests
├── 03-navigation.spec.js       # Navigation tests
├── 04-profile.spec.js          # Profile management tests
├── 05-user-list.spec.js        # Admin user list tests
├── 06-end-to-end.spec.js       # Complete user journeys
└── 07-mobile-specific.spec.js  # Mobile-specific tests
```

---

## Performance Benchmarks

| Test Suite | Tests | Avg Time | Max Time |
|------------|-------|----------|----------|
| Backend Unit Tests | 29 | 10s | 15s |
| Backend Integration Tests | 10 | 8s | 12s |
| Desktop E2E | 35 | 90s | 120s |
| Mobile iOS E2E | 45 | 120s | 180s |
| Mobile Android E2E | 45 | 120s | 180s |
| Tablet E2E | 35 | 90s | 120s |
| **Total (All Tests)** | **199** | **~5-7 min** | **~10 min** |

---

## Quick Command Reference

```bash
# ============================================
# RUN ALL TESTS (COMPLETE SUITE)
# ============================================
./run-all-tests.sh                        # Automated (recommended)

# ============================================
# BACKEND TESTS ONLY
# ============================================
mvn test                                  # All backend tests
./run-backend-tests.sh                    # Using helper script

# ============================================
# E2E TESTS ONLY (Backend must be running)
# ============================================
cd frontend
npm run test:e2e:all-devices             # All devices
npm run test:e2e:mobile                  # Mobile only
npm run test:e2e:desktop                 # Desktop only

# ============================================
# VIEW REPORTS
# ============================================
npm run test:report                      # E2E HTML report
open target/surefire-reports/index.html  # Backend report

# ============================================
# START BACKEND SERVER (for E2E tests)
# ============================================
mvn spring-boot:run
```

---

## Summary

✅ **Total Test Coverage**: 199 tests
✅ **Backend Tests**: 39 (JUnit 5 + Spring)
✅ **Frontend E2E Tests**: 160 (across 4 devices)
✅ **Test Automation**: Fully automated with scripts
✅ **CI/CD Ready**: GitHub Actions compatible

**Run everything with one command**: `./run-all-tests.sh` 🚀

For more details:
- Backend tests: `TEST_README.md`
- E2E tests: `E2E_TEST_GUIDE.md`
- Mobile tests: `frontend/MOBILE_TEST_GUIDE.md`
