# Test Scenarios / Test Design Document
**Project:** User Management Application
**Version:** 2.0 (Advanced)
**Date:** 2026-02-25

> Each scenario includes: ID, description, type, priority, precondition, postcondition, and linked test cases.
> Priority: P1 = must pass for release, P2 = should pass, P3 = nice to have.

---

## TS-01: User Registration (Signup)

**Business flow:** Guest visits /signup → fills form → submits → account created → redirected to /login

| Scenario ID | Description | Type | Priority | Precondition | Postcondition | Manual TC | Automated |
|-------------|-------------|------|----------|-------------|--------------|-----------|-----------|
| TS-01-01 | Register with all required fields only | Positive | P1 | Fresh DB (no users) | User created, role=ADMIN, redirect to /login | TC-001 | UserServiceTest, 01-signup.spec.js |
| TS-01-02 | Register with all required + all optional fields (phone + DOB) | Positive | P1 | Fresh DB | User created with phone and DOB stored | TC-002 | UserServiceTest |
| TS-01-03 | First registered user auto-assigned ADMIN role | Positive | P1 | DB empty | role field = "ADMIN" in DB and response | TC-001 | UserServiceTest.testFirstUserIsAdmin |
| TS-01-04 | Second registered user auto-assigned USER role | Positive | P1 | Exactly 1 user already in DB | role field = "USER" | TC-002 | UserServiceTest.testSubsequentUserIsUser |
| TS-01-05 | Register with duplicate username (exact match) | Negative | P1 | Username "adminuser" exists | 400 response, error = "Username already exists", no new user created | TC-003 | UserControllerTest, UserServiceTest |
| TS-01-06 | Register with duplicate email (exact match) | Negative | P1 | Email "admin@testapp.com" exists | 400 response, error = "Email already exists" | TC-003 | UserControllerTest, UserServiceTest |
| TS-01-07 | Register with duplicate username (case-sensitive check) | Negative | P2 | Username "adminuser" exists | Verify "AdminUser" / "ADMINUSER" behavior — document result | TC-003b | Manual only |
| TS-01-08 | Register with mismatched password and confirm password | Negative | P1 | None | Frontend error: "Passwords do not match", no API call made | TC-004 | 01-signup.spec.js |
| TS-01-09 | Register with password exactly 5 characters (below min) | Negative | P1 | None | Error: "Password must be at least 6 characters" | TC-005 | UserControllerTest, 01-signup.spec.js |
| TS-01-10 | Register with password exactly 6 characters (at min) | Positive | P1 | None | Registration succeeds | TC-005b | UserControllerTest |
| TS-01-11 | Register with invalid email format (no @) | Negative | P1 | None | 400 error: "Email should be valid" | TC-005c | UserControllerTest |
| TS-01-12 | Register with username exactly 2 chars (below min) | Negative | P1 | None | Validation error: username too short | TC-005d | UserControllerTest |
| TS-01-13 | Register with username exactly 3 chars (at min) | Positive | P1 | None | Registration succeeds | TC-005e | UserControllerTest |
| TS-01-14 | Register with all required fields blank | Negative | P1 | None | Frontend error: "All fields are required", no API call | TC-006 | 01-signup.spec.js |
| TS-01-15 | Verify password is NOT returned in signup API response | Security | P1 | None | Response body has no `password` field | TC-007 | UserControllerTest |
| TS-01-16 | Verify confirmPassword is NOT sent to API | Security | P2 | None | Network tab shows no `confirmPassword` in request body | TC-007b | Manual |
| TS-01-17 | Register from mobile Chrome (Pixel 5 viewport) | Compatibility | P2 | None | Form renders and submits correctly on mobile | — | 01-signup.spec.js (mobile-chrome) |
| TS-01-18 | Register from Mobile Safari (iPhone 13 viewport) | Compatibility | P2 | None | Form renders and submits correctly | — | 01-signup.spec.js (mobile-safari) |

---

## TS-02: User Login

**Business flow:** Registered user visits /login → enters credentials → submits → JWT stored → redirected to /profile

| Scenario ID | Description | Type | Priority | Precondition | Postcondition | Manual TC | Automated |
|-------------|-------------|------|----------|-------------|--------------|-----------|-----------|
| TS-02-01 | Login with correct username and password | Positive | P1 | User exists | JWT in localStorage, user object stored, redirect to /profile | TC-008 | UserControllerTest, 02-login.spec.js |
| TS-02-02 | Verify JWT token format (Bearer token) | Positive | P1 | Login successful | localStorage `token` starts with "ey" (JWT format) | TC-008 | 02-login.spec.js |
| TS-02-03 | Verify user object stored in localStorage | Positive | P1 | Login successful | `user` in localStorage contains userId, username, email, role | TC-008 | 02-login.spec.js |
| TS-02-04 | Login as ADMIN — verify role in localStorage | Positive | P1 | ADMIN user exists | `user.role` = "ADMIN" in localStorage | TC-008 | — |
| TS-02-05 | Login as USER — verify role in localStorage | Positive | P1 | USER exists | `user.role` = "USER" in localStorage | TC-009 | — |
| TS-02-06 | Login with wrong password | Negative | P1 | User exists | 401, error: "Invalid username or password" | TC-010 | UserControllerTest, 02-login.spec.js |
| TS-02-07 | Login with non-existent username | Negative | P1 | Username does not exist | 401, error: "Invalid username or password" | TC-010 | UserControllerTest |
| TS-02-08 | Login with empty username field | Negative | P1 | None | Frontend error: "All fields are required", no API call | TC-011 | 02-login.spec.js |
| TS-02-09 | Login with empty password field | Negative | P1 | None | Frontend error: "All fields are required", no API call | TC-011 | 02-login.spec.js |
| TS-02-10 | Verify password not returned in login response | Security | P1 | None | Response body has no `password` field | TC-012 | UserControllerTest |
| TS-02-11 | Navbar switches to authenticated state after login | Positive | P1 | Login successful | Profile, Users, Logout links visible | TC-008 | 03-navigation.spec.js |
| TS-02-12 | Login from Mobile Safari | Compatibility | P2 | User exists | Login succeeds, token stored | — | 02-login.spec.js (mobile-safari) |

---

## TS-03: User Logout

**Business flow:** Authenticated user clicks Logout → localStorage cleared → redirected to /login → navbar reverts

| Scenario ID | Description | Type | Priority | Precondition | Postcondition | Manual TC | Automated |
|-------------|-------------|------|----------|-------------|--------------|-----------|-----------|
| TS-03-01 | Logout clears token from localStorage | Positive | P1 | Logged in | localStorage `token` key removed | TC-013 | 02-login.spec.js |
| TS-03-02 | Logout clears user object from localStorage | Positive | P1 | Logged in | localStorage `user` key removed | TC-013 | 02-login.spec.js |
| TS-03-03 | Logout redirects to /login | Positive | P1 | Logged in | URL = /login | TC-013 | 02-login.spec.js |
| TS-03-04 | Navbar reverts to guest state after logout | Positive | P1 | Logged in | Login and Signup links visible, Profile/Users/Logout gone | TC-013 | 03-navigation.spec.js |
| TS-03-05 | Access /profile after logout → redirect to /login | Security | P1 | Logged out | URL changes to /login | TC-014 | 03-navigation.spec.js |
| TS-03-06 | Access /users after logout → redirect to /login | Security | P1 | Logged out | URL changes to /login | TC-014 | 03-navigation.spec.js |
| TS-03-07 | Direct URL to /profile with no token → redirect | Security | P1 | No token in localStorage | Redirect to /login | TC-014 | — |

---

## TS-04: View Own Profile

**Business flow:** Authenticated user navigates to /profile → sees own data pre-filled → can edit

| Scenario ID | Description | Type | Priority | Precondition | Postcondition | Manual TC | Automated |
|-------------|-------------|------|----------|-------------|--------------|-----------|-----------|
| TS-04-01 | View profile — USER role account | Positive | P1 | Logged in as USER | Profile displays with role=USER badge | TC-015 | UserControllerTest, 04-profile.spec.js |
| TS-04-02 | View profile — ADMIN role account | Positive | P1 | Logged in as ADMIN | Profile displays with role=ADMIN badge | TC-015 | UserControllerTest, 04-profile.spec.js |
| TS-04-03 | All UserDTO fields displayed (ID, username, email, role, created date) | Positive | P1 | Logged in | All fields visible on page | TC-015 | 04-profile.spec.js |
| TS-04-04 | Optional fields (phone, DOB) shown only if set | Positive | P2 | Phone + DOB set | Both fields visible; if not set, not shown | TC-015 | — |
| TS-04-05 | Form pre-filled with current username and email | Positive | P1 | Logged in | Input fields show current values | TC-015 | 04-profile.spec.js |
| TS-04-06 | Password field is blank (not pre-filled) | Security | P1 | Logged in | Password input is empty | TC-015 | 04-profile.spec.js |
| TS-04-07 | Unauthenticated access to /profile → redirect | Security | P1 | Not logged in | Redirect to /login | TC-014 | 03-navigation.spec.js |
| TS-04-08 | GET /api/users/me without token → 401 | Security | P1 | No token | 401 Unauthorized | TC-035 | UserControllerTest |

---

## TS-05: Update Own Profile

**Business flow:** Authenticated user edits fields on /profile → submits → success message → data updated in DB

| Scenario ID | Description | Type | Priority | Precondition | Postcondition | Manual TC | Automated |
|-------------|-------------|------|----------|-------------|--------------|-----------|-----------|
| TS-05-01 | Update username to a new unique value | Positive | P1 | Logged in | New username stored; localStorage updated | TC-016 | UserServiceTest, 04-profile.spec.js |
| TS-05-02 | Update email to a new unique value | Positive | P1 | Logged in | New email stored; localStorage updated | TC-016 | UserServiceTest |
| TS-05-03 | Update phone number | Positive | P1 | Logged in | Phone stored, visible on profile | TC-017 | UserServiceTest |
| TS-05-04 | Update date of birth | Positive | P1 | Logged in | DOB stored, visible on profile | TC-017 | UserServiceTest |
| TS-05-05 | Update all fields simultaneously | Positive | P2 | Logged in | All fields updated in one request | TC-017 | — |
| TS-05-06 | Update password → verify new password works for login | Positive | P1 | Logged in | New password accepted; old rejected | TC-018 | UserServiceTest |
| TS-05-07 | Leave password blank → verify existing password unchanged | Positive | P1 | Logged in | Old password still works after update | TC-019 | UserServiceTest |
| TS-05-08 | Update with same username (no change) | Positive | P2 | Logged in | Update succeeds (not flagged as duplicate of self) | TC-020 | UserServiceTest |
| TS-05-09 | Update username to one already taken by another user | Negative | P1 | Two users exist | 400, error: "Username already exists" | TC-021 | UserServiceTest, UserControllerTest |
| TS-05-10 | Update email to one already taken by another user | Negative | P1 | Two users exist | 400, error: "Email already exists" | TC-021 | UserServiceTest, UserControllerTest |
| TS-05-11 | Update with new password exactly 5 chars (too short) | Negative | P1 | Logged in | Frontend error: "Password must be at least 6 characters" | TC-022 | — |
| TS-05-12 | Submit update with blank username | Negative | P1 | Logged in | Frontend error: "Username and email are required" | TC-022 | — |
| TS-05-13 | Submit update with blank email | Negative | P1 | Logged in | Frontend error: "Username and email are required" | TC-022 | — |
| TS-05-14 | USER calls PUT /api/users/{other_id} directly via API | Security | P1 | USER logged in | 403, "You can only update your own profile" | TC-023 | UserControllerTest |
| TS-05-15 | PUT /api/users/{id} without token | Security | P1 | None | 401 | TC-035 | UserControllerTest |

---

## TS-06: Admin Updates Any Profile

| Scenario ID | Description | Type | Priority | Precondition | Postcondition | Manual TC | Automated |
|-------------|-------------|------|----------|-------------|--------------|-----------|-----------|
| TS-06-01 | ADMIN calls PUT /api/users/{user_id} for another user | Positive | P1 | ADMIN + USER exist | 200, user updated | TC-024 | UserControllerTest |
| TS-06-02 | ADMIN calls PUT /api/users/{admin_id} for own account | Positive | P1 | ADMIN logged in | 200, admin profile updated | TC-016 | UserControllerTest |
| TS-06-03 | ADMIN updates another user's password | Positive | P2 | ADMIN + USER exist | USER can login with new password | TC-024 | — |

---

## TS-07: View User List

**Business flow:** Authenticated user navigates to /users → table renders with all users

| Scenario ID | Description | Type | Priority | Precondition | Postcondition | Manual TC | Automated |
|-------------|-------------|------|----------|-------------|--------------|-----------|-----------|
| TS-07-01 | Regular USER views user list | Positive | P1 | Logged in as USER | All users shown, no Delete buttons | TC-025 | UserControllerTest, 05-user-list.spec.js |
| TS-07-02 | ADMIN views user list | Positive | P1 | Logged in as ADMIN | Blue admin banner visible, Delete buttons present | TC-026 | 05-user-list.spec.js |
| TS-07-03 | Table shows correct columns: ID, Username, Email, Role, Created At, Actions | Positive | P1 | Any authenticated | All 6 columns present | TC-025 | 05-user-list.spec.js |
| TS-07-04 | Role displayed as styled badge (not plain text) | Positive | P2 | Any authenticated | Role badge element present (CSS class applied) | TC-025 | 05-user-list.spec.js |
| TS-07-05 | USER sees "No access" in every Actions cell | Positive | P1 | Logged in as USER | All Action cells show "No access" | TC-025 | 05-user-list.spec.js |
| TS-07-06 | ADMIN sees Delete buttons for all rows except own | Positive | P1 | Logged in as ADMIN | Own row: no Delete; others: Delete visible | TC-026 | 05-user-list.spec.js |
| TS-07-07 | GET /api/users without token → 401 | Security | P1 | No token | 401 Unauthorized | TC-035 | UserControllerTest |
| TS-07-08 | User list refreshes correctly after navigating away and back | Positive | P2 | Multiple users | List shows correct data on return | TC-027 | — |

---

## TS-08: Admin Delete User

**Business flow:** ADMIN clicks Delete → confirmation → user removed → list refreshes

| Scenario ID | Description | Type | Priority | Precondition | Postcondition | Manual TC | Automated |
|-------------|-------------|------|----------|-------------|--------------|-----------|-----------|
| TS-08-01 | ADMIN successfully deletes a USER account | Positive | P1 | ADMIN + USER exist | User removed from DB; list updated | TC-028 | UserControllerTest, 05-user-list.spec.js |
| TS-08-02 | Confirmation dialog appears before deletion | Positive | P1 | ADMIN on /users | Dialog shows username in message | TC-028 | 05-user-list.spec.js |
| TS-08-03 | User list refreshes automatically after deletion | Positive | P1 | After deletion | Deleted user no longer in list | TC-028 | 05-user-list.spec.js |
| TS-08-04 | Cancel deletion — user is NOT deleted | Negative | P1 | ADMIN, dialog open | Dialog dismissed; user remains in DB | TC-029 | 05-user-list.spec.js |
| TS-08-05 | ADMIN cannot delete own account via API | Negative | P1 | Logged in as ADMIN | 403, "Admin cannot delete their own account" | TC-030 | UserControllerTest |
| TS-08-06 | USER cannot delete own account via API | Negative | P1 | Logged in as USER | 403, "Only admins can delete accounts" | TC-031 | UserControllerTest |
| TS-08-07 | USER cannot delete another user via API | Negative | P1 | Logged in as USER | 403, "Only admins can delete accounts" | TC-031 | UserControllerTest |
| TS-08-08 | Delete non-existent user ID via API | Negative | P2 | ADMIN logged in | 404, "User not found with id: 999" | TC-032 | UserControllerTest |
| TS-08-09 | DELETE /api/users/{id} without token → 401 | Security | P1 | No token | 401 | TC-035 | UserControllerTest |
| TS-08-10 | ADMIN deletes one of multiple users — others unaffected | Positive | P2 | 3+ users exist | Only target user removed | TC-033 | UserManagementIntegrationTest |

---

## TS-09: JWT Token & Security

| Scenario ID | Description | Type | Priority | Precondition | Postcondition | Manual TC | Automated |
|-------------|-------------|------|----------|-------------|--------------|-----------|-----------|
| TS-09-01 | API call with no Authorization header → 401 | Security | P1 | None | 401 on all 4 protected endpoints | TC-035 | UserControllerTest |
| TS-09-02 | API call with malformed JWT → 401 | Security | P1 | None | 401 | TC-035 | UserControllerTest |
| TS-09-03 | API call with wrong token (different secret) → 401 | Security | P1 | None | 401 | TC-035 | Manual (Postman) |
| TS-09-04 | 401 response auto-clears localStorage and redirects to /login | Security | P1 | Logged in | localStorage empty, URL = /login | TC-036 | — |
| TS-09-05 | Verify no password field in any API response (signup, login, GET users, GET me) | Security | P1 | — | `password` key absent in all responses | TC-037 | UserControllerTest |
| TS-09-06 | Signup endpoint accessible without token (public route) | Positive | P1 | None | 201 returned without Authorization header | TC-001 | UserControllerTest |
| TS-09-07 | Login endpoint accessible without token (public route) | Positive | P1 | None | 200 returned without Authorization header | TC-008 | UserControllerTest |

---

## TS-10: Navigation & Routing

| Scenario ID | Description | Type | Priority | Precondition | Postcondition | Manual TC | Automated |
|-------------|-------------|------|----------|-------------|--------------|-----------|-----------|
| TS-10-01 | Guest (no token) sees Login + Signup in navbar | Positive | P1 | Not logged in | Login and Signup links present | TC-038 | 03-navigation.spec.js |
| TS-10-02 | Authenticated user sees Profile + Users + Logout in navbar | Positive | P1 | Logged in | 3 auth links visible | TC-038 | 03-navigation.spec.js |
| TS-10-03 | Navigate to / when not logged in → redirected | Positive | P1 | Not logged in | Redirect to /login | TC-038 | 03-navigation.spec.js |
| TS-10-04 | Navigate to / when logged in → profile or home | Positive | P1 | Logged in | Redirect to /profile | TC-038 | 03-navigation.spec.js |
| TS-10-05 | Click logo / app name in navbar — confirm behaviour | Positive | P3 | Any state | Navigates to / | TC-038 | 03-navigation.spec.js |

---

## TS-11: Cross-Device / Responsive UI

| Scenario ID | Description | Type | Priority | Precondition | Postcondition | Manual TC | Automated |
|-------------|-------------|------|----------|-------------|--------------|-----------|-----------|
| TS-11-01 | Signup page renders correctly on Desktop Chrome (1280×720) | Compatibility | P1 | None | All fields visible, no overflow | — | 01-signup.spec.js (chromium) |
| TS-11-02 | Login page on Mobile Chrome Pixel 5 (393×851) | Compatibility | P1 | None | Form usable, buttons tappable | — | 02-login.spec.js (mobile-chrome) |
| TS-11-03 | Profile page on Mobile Safari iPhone 13 (390×844) | Compatibility | P1 | Logged in | Form scrollable, submit works | — | 04-profile.spec.js (mobile-safari) |
| TS-11-04 | User list table scrolls horizontally on mobile | Compatibility | P2 | Logged in | Table accessible on small screen | — | 05-user-list.spec.js (mobile-chrome) |
| TS-11-05 | All E2E flows on Tablet (iPad Pro 1024×1366) | Compatibility | P2 | None | Full flows work | — | 07-mobile-specific.spec.js |
| TS-11-06 | Signup form error messages visible on mobile | Compatibility | P2 | None | Error text not clipped | — | 01-signup.spec.js (mobile) |

---

## TS-12: Edge Cases & Boundary Conditions

| Scenario ID | Description | Type | Priority | Precondition | Postcondition | Manual TC | Automated |
|-------------|-------------|------|----------|-------------|--------------|-----------|-----------|
| TS-12-01 | Username exactly at minimum length (3 chars) | Boundary | P1 | None | Registration succeeds | TC-039 | UserControllerTest |
| TS-12-02 | Username exactly at maximum length (50 chars) | Boundary | P1 | None | Registration succeeds | TC-039 | UserControllerTest |
| TS-12-03 | Password exactly 6 characters (minimum) | Boundary | P1 | None | Registration succeeds | TC-040 | UserControllerTest |
| TS-12-04 | Register when DB has exactly 1 existing user | Boundary | P1 | 1 user in DB | New user gets USER role (not ADMIN) | TC-002 | UserServiceTest |
| TS-12-05 | Update profile sending only one field (partial update) | Boundary | P1 | Logged in | Only that field changes; others unchanged | TC-041 | UserServiceTest |
| TS-12-06 | Delete the only USER when ADMIN exists | Boundary | P2 | ADMIN + 1 USER | User deleted; ADMIN remains; list shows 1 user | TC-033 | — |
| TS-12-07 | Concurrent registration with same username (race condition) | Boundary | P3 | Two clients | Only one succeeds; other gets 400 | Manual | — |
