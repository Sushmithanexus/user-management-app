# Test Strategy
**Project:** User Management Application
**Version:** 2.0 (Advanced)
**Date:** 2026-02-25
**Author:** QA Team
**Status:** Approved

---

## 1. Purpose & Scope

This document defines the complete quality assurance strategy for the User Management Application. It is the authoritative reference for all testing decisions, tool choices, automation levels, suite definitions, and reporting standards. Every test artifact (plan, cases, data, traceability) derives from this strategy.

**Application under test:** Full-stack CRUD app with JWT auth, RBAC (ADMIN/USER roles), React 18 frontend, Spring Boot 3.2 backend, H2 in-memory database.

---

## 2. Testing Objectives

| Objective | Measurable Success Criterion |
|-----------|------------------------------|
| Validate all functional requirements | 100% of ACs from US-01–US-08 have a passing test case |
| Validate RBAC enforcement | All 4 delete + 2 update authorization rules tested at API level |
| Verify password security | No password appears in any API response, log, or localStorage — verified by test |
| Confirm cross-device UI | All 21 manual TCs pass on Desktop Chrome, Mobile Chrome, Mobile Safari |
| Regression safety | Zero regressions across all 38 Java tests after any code change |
| API contract integrity | Every endpoint returns documented HTTP status + body shape |

---

## 3. Test Pyramid

```
        ▲
       /E2E\          Playwright UI (7 spec files, ~80 scenarios)
      /──────\         Slow, high confidence, full stack
     /  API   \       Postman / curl (all 7 endpoints, 40+ cases)
    /──────────\       Medium speed, contract validation
   / Integration\     Spring Boot Test + MockMvc (10 tests)
  /──────────────\     Real H2 DB, full HTTP stack
 /   Controller   \   MockMvc + Mockito (13 tests)
/──────────────────\   Isolated controller layer
      Unit           JUnit + Mockito (15 tests)
────────────────────   Fast, isolated, business logic
```

**Rule:** Never replace lower-level tests with higher-level ones. Each layer tests what only that layer can test efficiently.

---

## 4. Test Types & Levels

### 4.1 Unit Tests
| Attribute | Detail |
|-----------|--------|
| **Scope** | `UserService` methods in full isolation |
| **Mocked** | `UserRepository`, `PasswordEncoder` |
| **Tool** | JUnit 5 + Mockito 5 |
| **Location** | `src/test/java/.../service/UserServiceTest.java` |
| **Count** | 15 tests |
| **Execution time** | < 1 second |
| **Run** | `mvn test -Dtest=UserServiceTest` |
| **What it proves** | Business logic: role assignment, password hashing, uniqueness checks, update logic, auth failure messages |

### 4.2 Controller / Slice Tests
| Attribute | Detail |
|-----------|--------|
| **Scope** | `UserController` endpoints with mocked service layer |
| **Mocked** | `UserService` via `@MockBean` |
| **Tool** | Spring MVC Test (`MockMvc`) + `@WebMvcTest` |
| **Location** | `src/test/java/.../controller/UserControllerTest.java` |
| **Count** | 13 tests |
| **Execution time** | < 2 seconds |
| **Run** | `mvn test -Dtest=UserControllerTest` |
| **What it proves** | HTTP status codes, response bodies, authorization (403/401), request validation, JSON serialization |

### 4.3 Integration Tests (Java)
| Attribute | Detail |
|-----------|--------|
| **Scope** | Full application stack: HTTP → Controller → Service → Repository → H2 DB |
| **Tool** | `@SpringBootTest` + `MockMvc` (no mocks — real beans) |
| **Location** | `src/test/java/.../integration/UserManagementIntegrationTest.java` |
| **Count** | 10 tests |
| **Execution time** | < 5 seconds |
| **Run** | `mvn test -Dtest=UserManagementIntegrationTest` |
| **What it proves** | End-to-end flows with real data persistence, JWT generation/validation, BCrypt round-trip |

### 4.4 API Tests (Postman / curl)
| Attribute | Detail |
|-----------|--------|
| **Scope** | All 7 REST endpoints — positive, negative, boundary, auth |
| **Tool** | Postman (collection: `Postman_Collection.json`) or curl |
| **Execution** | Manual or Newman CLI |
| **Run** | `newman run Postman_Collection.json` (if Newman installed) |
| **What it proves** | API contract, headers, status codes, error shapes — independent of frontend |

### 4.5 E2E UI Tests (Playwright)
| Attribute | Detail |
|-----------|--------|
| **Scope** | Full user journeys through the browser |
| **Tool** | Playwright |
| **Spec files** | `frontend/e2e/01-signup.spec.js` through `07-mobile-specific.spec.js` |
| **Devices** | Desktop Chrome, Mobile Chrome (Pixel 5), Mobile Safari (iPhone 13), Tablet (iPad Pro) |
| **Prerequisites** | Backend on :8080, Frontend on :5173 |
| **Run all** | `cd frontend && npm run test:e2e` |
| **Run desktop only** | `npm run test:e2e:desktop` |
| **Run mobile only** | `npm run test:e2e:mobile` |
| **Run headed** | `npm run test:e2e:headed` |
| **Run with UI** | `npm run test:e2e:ui` |

### 4.6 Manual / Exploratory Tests
| Attribute | Detail |
|-----------|--------|
| **Scope** | Edge cases, usability, visual, scenarios not feasible to automate |
| **Documented in** | `core/04-detailed-test-cases.md` (TC-001 to TC-060) |
| **When** | Every sprint / before each release |
| **Performed by** | QA Engineer |

---

## 5. Test Suite Definitions

### 5.1 Smoke Test Suite
> **Purpose:** Run in < 5 minutes to verify the build is alive. Run after every backend or frontend change.

| Suite ID | Test | Tool | Pass Criterion |
|----------|------|------|---------------|
| SMOKE-01 | POST /api/auth/signup → 201 | curl / Postman | Status 201, `message` field present |
| SMOKE-02 | POST /api/auth/login → 200 | curl / Postman | Status 200, `token` field present |
| SMOKE-03 | GET /api/users (with token) → 200 | curl / Postman | Status 200, array response |
| SMOKE-04 | GET /api/users (no token) → 401 | curl / Postman | Status 401 |
| SMOKE-05 | Frontend loads at localhost:5173 | Browser / curl | HTTP 200, `<div id="root">` present |
| SMOKE-06 | Signup form submits successfully | Playwright (TC-001) | User registered, redirected to /login |
| SMOKE-07 | Login form works | Playwright (TC-006) | Token in localStorage, /profile loaded |

```bash
# Smoke test commands
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/auth/signup \
  -X POST -H "Content-Type: application/json" \
  -d '{"username":"smoketest","email":"smoke@test.com","password":"Smoke@1"}'
# Expected: 201

curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/users
# Expected: 401
```

### 5.2 Regression Test Suite
> **Purpose:** Full verification after any code change. Must pass before any merge or release.

| Layer | Suite | Count | Run Command |
|-------|-------|-------|-------------|
| Unit | All UserServiceTest | 15 | `mvn test -Dtest=UserServiceTest` |
| Controller | All UserControllerTest | 13 | `mvn test -Dtest=UserControllerTest` |
| Integration | All UserManagementIntegrationTest | 10 | `mvn test -Dtest=UserManagementIntegrationTest` |
| E2E Desktop | Chromium Playwright | ~40 | `npm run test:e2e:desktop` |
| E2E Mobile | Mobile Chrome + Safari | ~40 | `npm run test:e2e:mobile` |
| **Total** | | **~118** | `mvn test && cd frontend && npm run test:e2e` |

### 5.3 Sanity Test Suite
> **Purpose:** Quick per-feature check after a targeted fix. Subset of regression.

| Fix Area | Sanity Cases |
|----------|-------------|
| Auth fix | TC-001, TC-006, TC-007, SMOKE-01–04 |
| Profile fix | TC-010, TC-011, TC-012, TC-013 |
| Delete/RBAC fix | TC-017, TC-018, TC-019 |
| Frontend routing fix | TC-009, SMOKE-05–07 |

---

## 6. Automation Strategy

| Test Type | Automated? | Tool | Priority |
|-----------|-----------|------|----------|
| Unit (service layer) | Yes — 100% | JUnit 5 + Mockito | P1 |
| Controller (API layer) | Yes — 100% | MockMvc | P1 |
| Integration (full stack) | Yes — 100% | Spring Boot Test | P1 |
| API contract | Partial — key scenarios | Postman / curl | P2 |
| E2E happy paths | Yes | Playwright | P1 |
| E2E error paths | Yes | Playwright | P2 |
| E2E mobile | Yes | Playwright | P2 |
| Exploratory | No | Manual | P1 |
| Accessibility | No | Manual review | P3 |
| Performance | No (v1) | Manual / future JMeter | P3 |

---

## 7. Test Environments

| Environment | Backend URL | Frontend URL | DB | Purpose | Owner |
|-------------|------------|-------------|-----|---------|-------|
| Local Dev | localhost:8080 | localhost:5173 | H2 in-memory | Dev + QA manual | Dev / QA |
| CI Pipeline (future) | Docker container | Built assets | H2 in-memory | Automated regression on PR | DevOps |
| Staging (future) | TBD | TBD | PostgreSQL | Pre-release UAT | QA |

**Important:** H2 `create-drop` means the DB resets on every backend restart. Always restart backend before a test cycle to guarantee a clean state.

---

## 8. Entry & Exit Criteria

### Entry Criteria (before testing begins)
- [ ] `mvn spring-boot:run` starts without errors
- [ ] All 38 Java tests pass: `mvn test` → `BUILD SUCCESS`
- [ ] `npm run dev` starts frontend without errors
- [ ] Test data from `core/05-test-data-specification.md` is ready
- [ ] Test cases reviewed and assigned

### Exit Criteria (release sign-off)
- [ ] All 38 Java automated tests pass
- [ ] All Playwright specs pass on chromium + mobile-chrome + mobile-safari
- [ ] All 60 manual test cases executed with result recorded
- [ ] Zero Critical defects open
- [ ] Zero High defects open (or written-off with PM approval)
- [ ] Traceability matrix shows 100% requirement coverage
- [ ] Test summary report completed and signed

---

## 9. Defect Management

### Severity Levels
| Severity | Definition | SLA to Fix | Examples |
|----------|-----------|-----------|---------|
| **Critical** | Security breach, data loss, app crash, auth bypass | Same day | Password in API response, login bypass, admin can delete self |
| **High** | Core feature completely broken | Next sprint | Signup fails entirely, JWT not returned on login |
| **Medium** | Feature partially broken, workaround exists | Current sprint | Error message not shown, wrong redirect |
| **Low** | Cosmetic, minor UX, non-blocking | Backlog | Typo, misaligned button, wrong placeholder text |

### Defect Lifecycle
```
New → Assigned → In Progress → Fixed → Re-Test → [Pass → Closed] / [Fail → Reopened]
```

### Defect Report Minimum Fields
- Title (concise, describes what fails)
- Severity + Priority
- Environment (browser, OS, backend version)
- Steps to reproduce (numbered, exact test data used)
- Expected result
- Actual result
- Screenshot / console error log
- Test case ID that failed (e.g., TC-018)

---

## 10. Test Metrics & Reporting

### Metrics Tracked Per Cycle
| Metric | Formula | Target |
|--------|---------|--------|
| Test Execution Rate | Cases executed / Total cases | 100% |
| Pass Rate | Passed / Executed | ≥ 95% |
| Defect Detection Rate | Bugs found in QA / Bugs found in prod | > 90% |
| Automation Coverage | Automated scenarios / Total scenarios | ≥ 70% |
| Regression Pass Rate | `mvn test` + Playwright pass | 100% |

### Report Template
After each test cycle, QA produces a one-page report:
```
Cycle: [name/sprint]    Date: [date]    Tester: [name]

Test Execution Summary:
  Total Cases:     60
  Passed:          __
  Failed:          __
  Blocked:         __
  Skipped:         __

Defects:
  Critical Open:   __
  High Open:       __
  Total Raised:    __
  Total Resolved:  __

Automated Tests:
  Java (mvn test): 38/__  BUILD [SUCCESS/FAIL]
  Playwright E2E:  __/__  [PASS/FAIL]

Sign-off: [YES/PENDING]   Approved by: __________
```
