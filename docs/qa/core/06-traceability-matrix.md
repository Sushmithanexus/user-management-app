# Requirements–Test Traceability Matrix
**Project:** User Management Application
**Version:** 2.0 (Advanced)
**Date:** 2026-02-25

> **Status column values:** Covered ✅ | Partial ⚠️ | Gap ❌ | N/A —
> **Execution column:** Pass ✓ | Fail ✗ | Blocked B | Not Run —

---

## Section 1: Business Goals Coverage

| BG ID | Business Goal | Test Scenarios | Manual TCs | Automated | Coverage | Exec Status |
|-------|--------------|----------------|-----------|-----------|----------|-------------|
| BG-01 | Allow self-registration | TS-01-01 to TS-01-18 | TC-001 to TC-008, TC-039, TC-040, TC-042 | UserServiceTest, UserControllerTest, 01-signup.spec.js | ✅ | |
| BG-02 | Secure all data with JWT auth | TS-09-01 to TS-09-07 | TC-034, TC-035, TC-036, TC-037 | UserControllerTest | ✅ | |
| BG-03 | First user auto-ADMIN | TS-01-03, TS-01-04 | TC-001, TC-002 | UserServiceTest.testFirstUserIsAdmin | ✅ | |
| BG-04 | Admin full CRUD on all users | TS-06-01 to TS-06-03, TS-08-01 | TC-024, TC-026, TC-028 | UserControllerTest | ✅ | |
| BG-05 | Prevent unauthorized access | TS-05-14, TS-08-05 to TS-08-09, TS-09-01 | TC-023, TC-030, TC-031, TC-035 | UserControllerTest | ✅ | |
| BG-06 | Responsive UI | TS-11-01 to TS-11-06 | TC-046 to TC-052 | Playwright all device projects | ✅ | |

---

## Section 2: User Story × Acceptance Criteria Full Mapping

### US-01: User Registration

| AC ID | Acceptance Criterion | Scenario | Manual TC | Java Test | E2E Playwright | Coverage | Exec |
|-------|---------------------|----------|-----------|-----------|----------------|----------|------|
| AC-01-1 | Form shows all 6 fields | TS-01-01 | TC-001 step 1 | — | 01-signup.spec.js | ✅ | |
| AC-01-2 | Empty required fields → error | TS-01-14 | TC-007 | — | 01-signup.spec.js | ✅ | |
| AC-01-3 | Password mismatch → error | TS-01-08 | TC-005 | — | 01-signup.spec.js | ✅ | |
| AC-01-4 | Password < 6 chars → error | TS-01-09 | TC-006 | UserControllerTest | 01-signup.spec.js | ✅ | |
| AC-01-5 | Duplicate username → 400 | TS-01-05 | TC-003 | UserServiceTest, UserControllerTest | 01-signup.spec.js | ✅ | |
| AC-01-6 | Duplicate email → 400 | TS-01-06 | TC-004 | UserServiceTest, UserControllerTest | 01-signup.spec.js | ✅ | |
| AC-01-7 | Success → alert + redirect /login | TS-01-01 | TC-001 steps 9–10 | — | 01-signup.spec.js | ✅ | |
| AC-01-8 | First user = ADMIN | TS-01-03 | TC-001 step 12 | UserServiceTest | IntegrationTest | ✅ | |
| AC-01-9 | Password BCrypt hashed | TS-01-15 | TC-008, TC-001 step 13 | UserServiceTest | — | ✅ | |
| AC-01-10 | Email format validated | TS-01-11 | TC-042 | UserControllerTest | 01-signup.spec.js | ✅ | |
| AC-01-11 | Username 3–50 chars | TS-01-12, TS-01-13 | TC-039 | UserControllerTest | — | ✅ | |

---

### US-02: User Login

| AC ID | Acceptance Criterion | Scenario | Manual TC | Java Test | E2E Playwright | Coverage | Exec |
|-------|---------------------|----------|-----------|-----------|----------------|----------|------|
| AC-02-1 | Login form shows 2 fields | TS-02-01 | TC-009 step 1 | — | 02-login.spec.js | ✅ | |
| AC-02-2 | Empty fields → error | TS-02-08, TS-02-09 | TC-011 | — | 02-login.spec.js | ✅ | |
| AC-02-3 | Wrong credentials → 401 | TS-02-06, TS-02-07 | TC-010 | UserControllerTest, UserServiceTest | 02-login.spec.js | ✅ | |
| AC-02-4 | Token stored in localStorage | TS-02-02 | TC-009 step 7 | — | 02-login.spec.js | ✅ | |
| AC-02-5 | User object stored | TS-02-03 | TC-009 step 8 | — | 02-login.spec.js | ✅ | |
| AC-02-6 | Redirect to /profile | TS-02-04 | TC-009 step 5 | — | 02-login.spec.js | ✅ | |
| AC-02-7 | Navbar switches state | TS-10-02 | TC-038 | — | 03-navigation.spec.js | ✅ | |

---

### US-03: User Logout

| AC ID | Acceptance Criterion | Scenario | Manual TC | Java Test | E2E Playwright | Coverage | Exec |
|-------|---------------------|----------|-----------|-----------|----------------|----------|------|
| AC-03-1 | Token removed from localStorage | TS-03-01 | TC-013 step 4 | — | 02-login.spec.js | ✅ | |
| AC-03-2 | User object removed | TS-03-02 | TC-013 step 5 | — | — | ✅ | |
| AC-03-3 | Redirect to /login | TS-03-03 | TC-013 step 3 | — | 02-login.spec.js | ✅ | |
| AC-03-4 | Navbar reverts to guest | TS-03-04 | TC-013 step 6 | — | 03-navigation.spec.js | ✅ | |
| AC-03-5 | Protected routes blocked post-logout | TS-03-05, TS-03-06 | TC-014 | — | 03-navigation.spec.js | ✅ | |

---

### US-04: View Own Profile

| AC ID | Acceptance Criterion | Scenario | Manual TC | Java Test | E2E Playwright | Coverage | Exec |
|-------|---------------------|----------|-----------|-----------|----------------|----------|------|
| AC-04-1 | Profile shows all UserDTO fields | TS-04-03 | TC-015 steps 2–6 | UserControllerTest | 04-profile.spec.js | ✅ | |
| AC-04-2 | Form pre-filled with current values | TS-04-05 | TC-015 steps 7–8 | — | 04-profile.spec.js | ✅ | |
| AC-04-3 | Password field blank | TS-04-06 | TC-015 step 9 | — | 04-profile.spec.js | ✅ | |
| AC-04-4 | Load fail → redirect to /login | TS-04-07, TS-04-08 | TC-014, TC-035 | UserControllerTest | 03-navigation.spec.js | ✅ | |

---

### US-05: Update Own Profile

| AC ID | Acceptance Criterion | Scenario | Manual TC | Java Test | E2E Playwright | Coverage | Exec |
|-------|---------------------|----------|-----------|-----------|----------------|----------|------|
| AC-05-1 | Update all editable fields | TS-05-01 to TS-05-05 | TC-016, TC-017 | UserServiceTest, UserControllerTest | 04-profile.spec.js | ✅ | |
| AC-05-2 | Blank required fields → error | TS-05-12, TS-05-13 | TC-022 | — | — | ✅ | |
| AC-05-3 | Duplicate username → error | TS-05-09 | TC-021 | UserServiceTest | — | ✅ | |
| AC-05-4 | Duplicate email → error | TS-05-10 | TC-021 | UserServiceTest | — | ✅ | |
| AC-05-5 | Blank password = no change | TS-05-07 | TC-019 | UserServiceTest | — | ✅ | |
| AC-05-6 | Short new password → error | TS-05-11 | TC-022 step 3 | — | — | ✅ | |
| AC-05-7 | Success message shown | TS-05-01 | TC-016 step 4 | — | 04-profile.spec.js | ✅ | |
| AC-05-8 | localStorage updated | TS-05-01 | TC-016 step 6 | — | — | ✅ | |
| AC-05-9 | USER cannot update others | TS-05-14 | TC-023 | UserControllerTest | — | ✅ | |

---

### US-06: View User List

| AC ID | Acceptance Criterion | Scenario | Manual TC | Java Test | E2E Playwright | Coverage | Exec |
|-------|---------------------|----------|-----------|-----------|----------------|----------|------|
| AC-06-1 | Table shows 6 columns | TS-07-03 | TC-025 step 2 | UserControllerTest | 05-user-list.spec.js | ✅ | |
| AC-06-2 | All registered users shown | TS-07-01 | TC-025 step 3 | UserControllerTest | 05-user-list.spec.js | ✅ | |
| AC-06-3 | Role shown as styled badge | TS-07-04 | TC-025 step 6 | — | 05-user-list.spec.js | ✅ | |
| AC-06-4 | USER sees "No access" in Actions | TS-07-05 | TC-025 step 4 | UserControllerTest | 05-user-list.spec.js | ✅ | |
| AC-06-5 | Admin banner shown to ADMIN | TS-07-02 | TC-026 step 2 | — | 05-user-list.spec.js | ✅ | |
| AC-06-6 | Unauthenticated → redirect /login | TS-07-07 | TC-034 | UserControllerTest | 03-navigation.spec.js | ✅ | |

---

### US-07: Admin Deletes a User

| AC ID | Acceptance Criterion | Scenario | Manual TC | Java Test | E2E Playwright | Coverage | Exec |
|-------|---------------------|----------|-----------|-----------|----------------|----------|------|
| AC-07-1 | Admin sees Delete button | TS-07-06 | TC-026 step 3 | — | 05-user-list.spec.js | ✅ | |
| AC-07-2 | Confirmation dialog shown | TS-08-02 | TC-028 step 2–3 | — | 05-user-list.spec.js | ✅ | |
| AC-07-3 | User removed, list refreshes | TS-08-03 | TC-028 step 5–8 | UserManagementIntegrationTest | 05-user-list.spec.js | ✅ | |
| AC-07-4 | Success alert shown | TS-08-01 | TC-028 step 4 | UserControllerTest | 05-user-list.spec.js | ✅ | |
| AC-07-5 | Admin cannot delete self | TS-08-05 | TC-030 | UserControllerTest | — | ✅ | |
| AC-07-6 | USER cannot delete (API 403) | TS-08-06, TS-08-07 | TC-031 | UserControllerTest | — | ✅ | |

---

### US-08: Session Expiry / Unauthorized

| AC ID | Acceptance Criterion | Scenario | Manual TC | Java Test | E2E Playwright | Coverage | Exec |
|-------|---------------------|----------|-----------|-----------|----------------|----------|------|
| AC-08-1 | 401 clears localStorage | TS-09-04 | TC-036 | — | — | ⚠️ Manual only | |
| AC-08-2 | 401 redirects to /login | TS-09-04 | TC-036 | — | — | ⚠️ Manual only | |
| AC-08-3 | No token = 401 on protected routes | TS-09-01 | TC-035 | UserControllerTest | — | ✅ | |

---

## Section 3: Feature Coverage Matrix

| Feature ID | Feature Name | Test Scenarios | Manual TCs | Java Tests | E2E Tests | Coverage | Exec Status |
|-----------|-------------|----------------|-----------|-----------|----------|----------|-------------|
| F-01 | User Registration | TS-01-01 to 18 | TC-001 to 008, 039, 040, 042 | UserServiceTest, UserControllerTest | 01-signup.spec.js | ✅ | |
| F-02 | Auto Admin Assignment | TS-01-03, 01-04 | TC-001, TC-002 | UserServiceTest | IntegrationTest | ✅ | |
| F-03 | User Login | TS-02-01 to 12 | TC-009 to 012, TC-044 | UserControllerTest, UserServiceTest | 02-login.spec.js | ✅ | |
| F-04 | JWT Token Storage | TS-02-02, 02-03 | TC-009 steps 7–8 | — | 02-login.spec.js | ✅ | |
| F-05 | User Logout | TS-03-01 to 07 | TC-013 | — | 02-login.spec.js | ✅ | |
| F-06 | Auto Redirect on 401 | TS-09-04 | TC-036 | — | — | ⚠️ Manual only | |
| F-07 | View Own Profile | TS-04-01 to 08 | TC-015, TC-043 | UserControllerTest | 04-profile.spec.js | ✅ | |
| F-08 | Edit Username | TS-05-01, 05-08, 05-09 | TC-016, TC-020, TC-021 | UserServiceTest | 04-profile.spec.js | ✅ | |
| F-09 | Edit Email | TS-05-02, 05-10 | TC-016, TC-021 | UserServiceTest | 04-profile.spec.js | ✅ | |
| F-10 | Edit Phone Number | TS-05-03 | TC-017, TC-041 | UserServiceTest | 04-profile.spec.js | ✅ | |
| F-11 | Edit Date of Birth | TS-05-04 | TC-017 | UserServiceTest | 04-profile.spec.js | ✅ | |
| F-12 | Change Password | TS-05-06, 05-07 | TC-018, TC-019 | UserServiceTest | — | ✅ | |
| F-13 | Admin Edit Any Profile | TS-06-01 to 06-03 | TC-024 | UserControllerTest | — | ✅ | |
| F-14 | List All Users | TS-07-01 to 08 | TC-025, TC-026, TC-027 | UserControllerTest | 05-user-list.spec.js | ✅ | |
| F-15 | Delete User (Admin) | TS-08-01 to 10 | TC-028 to 033 | UserControllerTest, IntegrationTest | 05-user-list.spec.js | ✅ | |
| F-16 | Admin Info Banner | TS-07-02 | TC-026 step 2 | — | 05-user-list.spec.js | ✅ | |
| F-17 | No Access Label (USER) | TS-07-05 | TC-025 step 4 | — | 05-user-list.spec.js | ✅ | |
| F-18 | Public Navbar (Guest) | TS-10-01 | TC-038 step 1 | — | 03-navigation.spec.js | ✅ | |
| F-19 | Authenticated Navbar | TS-10-02 | TC-038 step 3 | — | 03-navigation.spec.js | ✅ | |

---

## Section 4: NFR Verification

| NFR ID | Requirement | Verification Method | Manual TC | Automated | Coverage | Exec |
|--------|------------|---------------------|-----------|-----------|----------|------|
| NFR-S-01 | BCrypt hashing | H2 console: hash starts with `$2a$` | TC-001 step 13, TC-058 | UserServiceTest | ✅ | |
| NFR-S-02 | Password never in response | Inspect all API responses in DevTools/Postman | TC-008, TC-012, TC-037 | UserControllerTest | ✅ | |
| NFR-S-03 | JWT required for /api/users/** | Call without token → 401 | TC-034, TC-035 | UserControllerTest | ✅ | |
| NFR-S-04 | CORS restricts origins | Call from non-allowed origin → blocked | Manual Postman | — | ⚠️ Manual only | |
| NFR-S-05 | Server-side RBAC enforced | API tests for 403 on unauthorized ops | TC-023, TC-030, TC-031 | UserControllerTest | ✅ | |
| NFR-U-01 | Inline validation errors | Verify error box renders inside form | TC-005, TC-006, TC-007 | 01-signup.spec.js | ✅ | |
| NFR-U-02 | Loading states on buttons | Observe "Signing up...", "Logging in..." text | TC-001 step 8, TC-009 step 4 | 01-signup.spec.js | ✅ | |
| NFR-U-03 | Confirm dialog before delete | Verify dialog appears before API call | TC-028 step 2, TC-029 | 05-user-list.spec.js | ✅ | |
| NFR-U-04 | Success/error visual distinction | Verify green/red styling on messages | TC-015, TC-016 | — | ⚠️ Manual only | |
| NFR-C-01 | Desktop Chrome | Full E2E suite on chromium | TC-046, TC-053 | Playwright chromium | ✅ | |
| NFR-C-02 | Mobile Chrome (Pixel 5) | E2E suite on mobile-chrome | TC-047, TC-049, TC-051 | Playwright mobile-chrome | ✅ | |
| NFR-C-03 | Mobile Safari (iPhone 13) | E2E suite on mobile-safari | TC-048, TC-052 | Playwright mobile-safari | ✅ | |
| NFR-C-04 | Tablet (iPad Pro) | E2E suite on tablet | TC-050 | Playwright tablet | ✅ | |
| NFR-T-01 | Unit test coverage (service) | `mvn test -Dtest=UserServiceTest` | — | 15 JUnit tests | ✅ | |
| NFR-T-02 | Controller test coverage | `mvn test -Dtest=UserControllerTest` | — | 13 MockMvc tests | ✅ | |
| NFR-T-03 | Integration test coverage | `mvn test -Dtest=UserManagementIntegrationTest` | — | 10 Spring Boot tests | ✅ | |
| NFR-T-04 | E2E Playwright coverage | `npm run test:e2e` | — | 7 spec files | ✅ | |

---

## Section 5: Gap Analysis

| Gap ID | Area | Description | Risk | Recommended Action |
|--------|------|-------------|------|-------------------|
| GAP-01 | AC-08-1/2 (401 auto-logout) | No automated test for auto-localStorage-clear on 401 | Medium | Add Playwright test: corrupt token → verify localStorage cleared + redirect |
| GAP-02 | NFR-S-04 (CORS) | CORS enforcement only tested manually | Medium | Add curl test from disallowed origin in Postman collection |
| GAP-03 | NFR-U-04 (visual distinction) | Success/error colour only verified manually | Low | Add CSS class assertion in Playwright (check `.error-message` / `.success-message`) |
| GAP-04 | TS-01-07 (case sensitivity) | Username case-sensitivity not explicitly tested | Low | Add TC-039 variant: attempt `AdminUser` when `adminuser` exists |
| GAP-05 | TS-12-07 (race condition) | Concurrent registration not tested | Low | P3 — defer to v1.1 with load testing |
| GAP-06 | F-06 (auto 401 redirect) | No E2E automation for 401 redirect flow | Medium | See GAP-01 |

---

## Section 6: Coverage Summary

| Category | Total Items | Fully Covered | Partially Covered | Gaps |
|----------|------------|--------------|-----------------|------|
| Business Goals | 6 | 6 | 0 | 0 |
| User Stories | 8 | 8 | 0 | 0 |
| Acceptance Criteria | 51 | 49 | 2 | 0 |
| Features (F-01–F-19) | 19 | 17 | 2 | 0 |
| NFRs | 14 | 11 | 3 | 0 |
| **Overall** | **98** | **91 (93%)** | **7 (7%)** | **0** |
