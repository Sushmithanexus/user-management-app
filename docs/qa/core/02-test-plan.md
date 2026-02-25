# Test Plan
**Project:** User Management Application
**Version:** 2.0 (Advanced)
**Release:** v1.0
**Date:** 2026-02-25
**Prepared by:** QA Team
**Approved by:** _________________ (PM / Tech Lead)

---

## 1. Introduction

This test plan governs all testing activities for the User Management Application v1.0 release. It defines what will be tested, who tests it, how it will be tested, when, and what constitutes a passed release. All team members must follow this plan.

---

## 2. Scope

### 2.1 In Scope

| Module | Features | Test Types Applied |
|--------|---------|-------------------|
| AUTH — Signup | Registration form, validation, duplicate handling, auto role assignment | Unit, Controller, Integration, E2E, Manual |
| AUTH — Login | Credential validation, JWT generation, localStorage storage, redirect | Unit, Controller, Integration, E2E, Manual |
| AUTH — Logout | localStorage clear, redirect, navbar update | E2E, Manual |
| PROFILE — View | UserDTO fields rendered, pre-fill form, role badge | Controller, E2E, Manual |
| PROFILE — Edit | Update username/email/phone/DOB/password, partial update, uniqueness | Unit, Controller, Integration, E2E, Manual |
| USER LIST — View | All users table, role badges, No access label, Admin banner | Controller, E2E, Manual |
| USER LIST — Delete | Admin delete, confirmation dialog, RBAC enforcement (4 rules) | Unit, Controller, Integration, E2E, Manual |
| SECURITY | JWT required on all protected endpoints, 401 auto-logout, RBAC | Controller, Integration, API (Postman), Manual |
| NAVIGATION | Dynamic navbar, route protection, redirect logic | E2E, Manual |
| CROSS-DEVICE | Desktop Chrome, Mobile Chrome, Mobile Safari | Playwright (all devices) |
| API CONTRACT | All 7 endpoints, request/response shapes, error bodies | API (Postman), Controller tests |

### 2.2 Out of Scope

| Item | Reason |
|------|--------|
| Password reset via email | Not implemented in v1.0 |
| Email verification on signup | Not implemented in v1.0 |
| OAuth / social login | Not implemented in v1.0 |
| Load / stress testing | Deferred to v1.1 (H2 not suitable) |
| Penetration / security audit | Deferred — formal pentest planned for v2.0 |
| Production DB (PostgreSQL) | Using H2 in-memory in this release |
| WCAG accessibility audit | Deferred to v1.2 |
| User search / pagination | Not implemented in v1.0 |
| Internet Explorer / Firefox | Not listed in supported browsers for v1.0 |

---

## 3. Test Approach

### Phase-by-Phase Plan

| Phase | Activity | Owner | Dependency |
|-------|---------|-------|-----------|
| 1 | Review all input documents (BRD, user stories, API docs, data model) | QA | Docs finalized |
| 2 | Review and sign off test cases (TC-001–TC-060) | QA + Dev | Phase 1 done |
| 3 | Set up test environment (backend + frontend running, test data ready) | QA + Dev | Code merged |
| 4 | **Smoke test** — run SMOKE-01–07 to confirm build is alive | QA | Phase 3 done |
| 5 | **Functional testing** — execute TC-001–TC-060 (manual) | QA | Phase 4 pass |
| 6 | **API testing** — run Postman collection against all 7 endpoints | QA | Phase 4 pass |
| 7 | **Automated regression** — `mvn test` + `npm run test:e2e` | Dev / QA | Phase 5 started |
| 8 | **Defect logging** — raise all found bugs with full detail | QA | Ongoing from Phase 4 |
| 9 | **Defect re-test** — retest all fixed defects | QA | Dev fixes merged |
| 10 | **Regression** — re-run regression suite after all fixes | QA | Phase 9 done |
| 11 | **Sign-off** — QA lead signs off, PM approves release | QA Lead + PM | All exit criteria met |

---

## 4. Test Environment

### 4.1 Setup Instructions

```bash
# Step 1: Ensure Java 21 is active
java -version   # Should show openjdk 21.x

# Step 2: Start backend (fresh DB)
cd /Users/ainexus/Task
mvn spring-boot:run
# Wait for: "User Management Application Started!"
# Backend available at: http://localhost:8080

# Step 3: Start frontend (new terminal)
cd /Users/ainexus/Task/frontend
npm install     # Only needed first time
npm run dev
# Frontend available at: http://localhost:5173

# Step 4: Verify both are running
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/users
# Expected: 401 (backend up, auth working)

curl -s -o /dev/null -w "%{http_code}" http://localhost:5173
# Expected: 200 (frontend up)
```

### 4.2 Database Access (H2 Console)
| Field | Value |
|-------|-------|
| URL | http://localhost:8080/h2-console |
| JDBC URL | `jdbc:h2:mem:usermanagementdb` |
| Username | `sa` |
| Password | _(blank)_ |

Use H2 console to: verify data after tests, inspect BCrypt hashes, check created_at timestamps.

### 4.3 Reset Test Data
```bash
# Kill backend (resets H2 DB completely)
kill $(lsof -t -i:8080)

# Restart fresh
mvn spring-boot:run
```

### 4.4 Environment Checklist
- [ ] Java 21 installed and active
- [ ] Maven dependencies downloaded (`mvn dependency:resolve`)
- [ ] Node modules installed (`cd frontend && npm install`)
- [ ] Playwright browsers installed (`cd frontend && npm run playwright:install`)
- [ ] Port 8080 free
- [ ] Port 5173 free
- [ ] H2 console accessible

---

## 5. Test Deliverables

| Deliverable | Location | Status |
|-------------|----------|--------|
| Test Strategy | `docs/qa/core/01-test-strategy.md` | Done |
| Test Plan (this doc) | `docs/qa/core/02-test-plan.md` | Done |
| Test Scenarios | `docs/qa/core/03-test-scenarios.md` | Done |
| Detailed Test Cases (60) | `docs/qa/core/04-detailed-test-cases.md` | Done |
| Test Data Specification | `docs/qa/core/05-test-data-specification.md` | Done |
| Traceability Matrix | `docs/qa/core/06-traceability-matrix.md` | Done |
| Java Automated Tests (38) | `src/test/java/com/usermanagement/` | Done |
| Playwright E2E Specs (7 files) | `frontend/e2e/*.spec.js` | Done |
| Postman Collection | `Postman_Collection.json` | Done |
| Test Summary Report | To be produced after each cycle | Pending |

---

## 6. Roles & Responsibilities

| Role | Person | Responsibilities |
|------|--------|-----------------|
| QA Engineer | TBD | Write + execute all manual TCs; raise defects; run automation; produce reports |
| Developer | TBD | Write + maintain unit/controller/integration tests; fix defects; support env setup |
| Tech Lead | TBD | Review test strategy; triage Critical/High defects; approve sign-off |
| Product Manager | TBD | Define ACs; approve out-of-scope decisions; final release sign-off |

---

## 7. Entry & Exit Criteria

### Entry Criteria
| # | Criterion | Verified By |
|---|-----------|------------|
| 1 | Feature branch merged to main | Git log |
| 2 | Backend starts: `mvn spring-boot:run` no errors | QA |
| 3 | All 38 Java tests pass: `mvn test` → BUILD SUCCESS | CI / QA |
| 4 | Frontend starts: `npm run dev` no errors | QA |
| 5 | Smoke test suite (SMOKE-01–07) all pass | QA |
| 6 | Test cases reviewed and signed off | QA Lead |

### Exit Criteria
| # | Criterion | Verified By |
|---|-----------|------------|
| 1 | All 60 manual test cases executed | QA test report |
| 2 | All 38 Java automated tests pass | `mvn test` output |
| 3 | All Playwright specs pass on chromium + mobile-chrome + mobile-safari | `npm run test:e2e` output |
| 4 | Zero Critical defects open | Defect tracker |
| 5 | Zero High defects open (or PM-approved exceptions) | Defect tracker |
| 6 | Traceability matrix shows 100% coverage | RTM doc |
| 7 | Test Summary Report produced and signed | QA Lead |

---

## 8. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| H2 DB resets on restart, losing test data | High | Medium | Follow test cycle setup in TC-000; document exact user creation order |
| First-user-ADMIN logic is fragile (order-dependent) | High | High | Always restart backend before signup tests; verify TC-001 runs first |
| JWT token expires mid-test session (long sessions) | Medium | Medium | Re-login between unrelated test blocks; keep test sessions < 1 hour |
| Port 8080 already in use (previous process) | Medium | High | Run `kill $(lsof -t -i:8080)` before restart; add to setup checklist |
| Playwright mobile tests flaky on slow machines | Medium | Medium | Add explicit waits; use `retries: 2` in playwright.config.js for CI |
| BCrypt hashing makes password verification non-trivial | Low | Medium | Use H2 console to verify hash exists (not plaintext); test via login round-trip |
| Test data collides across parallel test runs | Low | High | Each suite uses distinct usernames/emails per data spec; never share state |

---

## 9. Test Summary Report Template

> Fill this out after every test cycle.

```
═══════════════════════════════════════════════════
  TEST SUMMARY REPORT — User Management App v1.0
═══════════════════════════════════════════════════
  Cycle #:         ____
  Dates:           ____ to ____
  Tester(s):       ____________________
  Build / Commit:  ____________________

  MANUAL TEST EXECUTION
  ─────────────────────
  Total Cases:           60
  Executed:              __ / 60
  Passed:                __
  Failed:                __
  Blocked:               __
  Skipped (with reason): __
  Pass Rate:             ___%

  AUTOMATED TESTS
  ───────────────
  Java (mvn test):       38 / 38   BUILD: [ SUCCESS / FAIL ]
  Playwright Desktop:    __ / __   [ PASS / FAIL ]
  Playwright Mobile:     __ / __   [ PASS / FAIL ]

  DEFECTS
  ───────
  Critical (open):       __
  High (open):           __
  Medium (open):         __
  Low (open):            __
  Total raised:          __
  Total resolved:        __

  COVERAGE
  ────────
  Requirements covered:  __ / 19 features (target: 100%)
  NFRs verified:         __ / 11

  SIGN-OFF
  ────────
  QA Lead:       _________________ Date: ________
  Tech Lead:     _________________ Date: ________
  PM:            _________________ Date: ________
  Release Go/No-Go: [ GO / NO-GO ]
═══════════════════════════════════════════════════
```
