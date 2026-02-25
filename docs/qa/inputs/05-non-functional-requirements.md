# Non-Functional Requirements (NFRs)
**Project:** User Management Application
**Version:** 1.0
**Date:** 2026-02-25

---

## 1. Security

| NFR-ID | Requirement | Priority |
|--------|-------------|----------|
| NFR-S-01 | All passwords must be hashed with BCrypt before storage | Critical |
| NFR-S-02 | Passwords must never appear in any API response, log, or localStorage | Critical |
| NFR-S-03 | All endpoints under `/api/users/**` require a valid JWT token | Critical |
| NFR-S-04 | CSRF protection is disabled (stateless JWT app); CORS restricts origins to localhost:5173 and localhost:3000 | High |
| NFR-S-05 | Role-based authorization must be enforced server-side for all mutating operations | Critical |
| NFR-S-06 | JWT token must not be stored in cookies (stored in localStorage) | Medium |
| NFR-S-07 | H2 console (`/h2-console`) should be disabled or restricted in production | High |

---

## 2. Performance

| NFR-ID | Requirement | Priority |
|--------|-------------|----------|
| NFR-P-01 | Login and Signup API responses should return within 500ms under normal load | High |
| NFR-P-02 | User list should load within 1 second for up to 1,000 users | Medium |
| NFR-P-03 | JWT validation overhead should not exceed 10ms per request | Medium |

---

## 3. Reliability

| NFR-ID | Requirement | Priority |
|--------|-------------|----------|
| NFR-R-01 | Application must start cleanly with no errors on `mvn spring-boot:run` | Critical |
| NFR-R-02 | H2 in-memory database resets on each restart (by design for dev; prod would use persistent DB) | Medium |
| NFR-R-03 | All 38 unit, controller, and integration tests must pass on every build | Critical |

---

## 4. Usability

| NFR-ID | Requirement | Priority |
|--------|-------------|----------|
| NFR-U-01 | All form validation errors must be displayed inline within the form | High |
| NFR-U-02 | Buttons must show loading state ("Signing up…", "Logging in…", "Updating…") during API calls | High |
| NFR-U-03 | Confirmation dialog must appear before any delete action | High |
| NFR-U-04 | Success and error messages must be visually distinct (green vs red) | Medium |

---

## 5. Browser / Device Compatibility

| NFR-ID | Requirement | Priority |
|--------|-------------|----------|
| NFR-C-01 | Application must work on Chrome (latest) | Critical |
| NFR-C-02 | Application must work on Mobile Chrome (Pixel 5 viewport) | High |
| NFR-C-03 | Application must work on Mobile Safari (iPhone 13 viewport) | High |
| NFR-C-04 | Application must work on tablet (iPad Pro viewport) | Medium |
| NFR-C-05 | Application must be responsive across screen widths from 375px to 1440px | High |

---

## 6. Maintainability

| NFR-ID | Requirement | Priority |
|--------|-------------|----------|
| NFR-M-01 | Backend code must follow layered architecture: Controller → Service → Repository | High |
| NFR-M-02 | Sensitive data (passwords) must be excluded via DTO pattern | Critical |
| NFR-M-03 | All secrets (JWT key) must be configurable via environment variables | High |

---

## 7. Test Coverage

| NFR-ID | Requirement | Priority |
|--------|-------------|----------|
| NFR-T-01 | Unit tests must cover all service-layer business logic (UserServiceTest: 15 tests) | High |
| NFR-T-02 | Controller tests must cover all REST endpoints including auth, success, and error cases (UserControllerTest: 13 tests) | High |
| NFR-T-03 | Integration tests must cover end-to-end user flows (UserManagementIntegrationTest: 10 tests) | High |
| NFR-T-04 | E2E Playwright tests must cover all major user journeys across desktop and mobile | High |
