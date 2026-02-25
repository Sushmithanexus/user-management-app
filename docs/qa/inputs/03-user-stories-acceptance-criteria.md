# User Stories with Acceptance Criteria
**Project:** User Management Application
**Version:** 2.0 (Advanced)
**Date:** 2026-02-25

> Each story includes: role, goal, business value, acceptance criteria with exact expected values, edge cases, and Definition of Done.

---

## US-01: User Registration (Signup)

**As a** guest visitor,
**I want to** register for an account by providing my details,
**So that** I can access the application's protected features.

**Business Value:** Enables user onboarding without admin intervention.

### Acceptance Criteria

| AC # | Given | When | Then | Exact Expected Value |
|------|-------|------|------|---------------------|
| AC-01-1 | I am on `/signup` | The page loads | All 6 form fields are visible | Username, Email, Phone (optional), Date of Birth (optional), Password, Confirm Password |
| AC-01-2 | Any required field is blank | I click Sign Up | An error message appears | `"All fields are required"` |
| AC-01-3 | Password ≠ Confirm Password | I click Sign Up | An error message appears | `"Passwords do not match"` |
| AC-01-4 | Password has < 6 characters | I click Sign Up | An error message appears | `"Password must be at least 6 characters"` |
| AC-01-5 | Username already exists in DB | I submit the form | API returns 400 and error is shown | `"Username already exists"` |
| AC-01-6 | Email already exists in DB | I submit the form | API returns 400 and error is shown | `"Email already exists"` |
| AC-01-7 | All fields are valid | I submit the form | I am redirected after an alert | Alert: `"Registration successful! Please login."` → redirect to `/login` |
| AC-01-8 | No users exist in DB | A new user registers | That user is assigned ADMIN role | `role = "ADMIN"` in DB and API response |
| AC-01-9 | At least 1 user exists | A new user registers | That user is assigned USER role | `role = "USER"` |
| AC-01-10 | Valid signup submitted | Response arrives | Password is NOT in the API response | `user` object in response has no `password` key |
| AC-01-11 | Username has < 3 characters | I submit the form | Validation error | Server returns 400 |
| AC-01-12 | Username has > 50 characters | I submit the form | Validation error | Server returns 400 |
| AC-01-13 | Email format is invalid (no @) | I submit the form | Validation error | `"Email should be valid"` |
| AC-01-14 | confirmPassword field | I submit | confirmPassword is NOT sent to API | Network request body has no `confirmPassword` key |
| AC-01-15 | Sign Up clicked | While waiting for response | Button is disabled and shows loading text | Button text: `"Signing up..."`, button `disabled=true` |

### Edge Cases
- **Simultaneous registration:** If two users register with the same username at the exact same time, the DB unique constraint ensures only one succeeds (400 for the other).
- **Optional fields:** Phone and DOB may be blank; they should be stored as `null`, not empty string.
- **Password whitespace:** A 6+ character password containing spaces is accepted.

### Definition of Done
- [ ] Signup form renders all fields
- [ ] All 15 ACs pass
- [ ] `UserServiceTest.testRegisterUser*` tests pass
- [ ] `UserControllerTest.testSignup*` tests pass
- [ ] `01-signup.spec.js` E2E passes on chromium + mobile

---

## US-02: User Login

**As a** registered user,
**I want to** log in with my username and password,
**So that** I can access my profile and the user directory.

**Business Value:** Enables authenticated access; JWT ensures stateless, scalable sessions.

### Acceptance Criteria

| AC # | Given | When | Then | Exact Expected Value |
|------|-------|------|------|---------------------|
| AC-02-1 | I am on `/login` | The page loads | Two fields are visible | Username and Password inputs |
| AC-02-2 | Both fields are blank | I click Login | Error appears, no API call | `"All fields are required"` |
| AC-02-3 | Username field is blank | I click Login | Error appears | `"All fields are required"` |
| AC-02-4 | Password field is blank | I click Login | Error appears | `"All fields are required"` |
| AC-02-5 | Credentials are wrong | I click Login | API returns 401 and error shown | `"Invalid username or password"` |
| AC-02-6 | Non-existent username | I click Login | API returns 401 and error shown | `"Invalid username or password"` |
| AC-02-7 | Credentials are correct | I click Login | JWT stored in localStorage | `localStorage.getItem("token")` is a JWT (starts with `eyJ`) |
| AC-02-8 | Login succeeds | After API response | User object stored in localStorage | `localStorage.getItem("user")` contains `{userId, username, email, role}` |
| AC-02-9 | Login succeeds | After API response | I am redirected | URL changes to `/profile` |
| AC-02-10 | Login API responds | Response body inspected | Password is NOT returned | Response JSON has no `password` key |
| AC-02-11 | Login succeeds | Navbar is observed | Navbar shows authenticated links | Profile, Users, Logout visible; Login, Signup hidden |
| AC-02-12 | Login clicked | While waiting | Button shows loading state | Button text: `"Logging in..."`, disabled |

### Edge Cases
- **Case sensitivity of username:** `AdminUser` vs `adminuser` — document whether login is case-sensitive (Spring Security default: case-sensitive).
- **Role in localStorage:** Must exactly match DB role (`"ADMIN"` or `"USER"` — uppercase).

### Definition of Done
- [ ] All 12 ACs pass
- [ ] `UserControllerTest.testLogin*` and `UserServiceTest.testAuthenticate*` pass
- [ ] `02-login.spec.js` E2E passes on all devices

---

## US-03: User Logout

**As an** authenticated user,
**I want to** log out of my session,
**So that** my account is protected when I leave the application.

**Business Value:** Prevents unauthorized access on shared/public devices.

### Acceptance Criteria

| AC # | Given | When | Then | Exact Expected Value |
|------|-------|------|------|---------------------|
| AC-03-1 | I am logged in | I click Logout | `token` removed from localStorage | `localStorage.getItem("token")` returns `null` |
| AC-03-2 | I am logged in | I click Logout | `user` removed from localStorage | `localStorage.getItem("user")` returns `null` |
| AC-03-3 | I am logged in | I click Logout | I am redirected | URL = `/login` |
| AC-03-4 | I just logged out | Navbar is observed | Guest links visible | Login and Signup present; Profile/Users/Logout absent |
| AC-03-5 | I am logged out | I navigate to `/profile` | I am redirected | URL = `/login` |
| AC-03-6 | I am logged out | I navigate to `/users` | I am redirected | URL = `/login` |
| AC-03-7 | No token in localStorage | I type `/profile` in URL bar | App redirects | URL = `/login` |

### Definition of Done
- [ ] All 7 ACs pass
- [ ] `02-login.spec.js` (logout section) passes
- [ ] `03-navigation.spec.js` (protected routes) passes

---

## US-04: View Own Profile

**As an** authenticated user,
**I want to** view my account details on the profile page,
**So that** I can verify my current information.

### Acceptance Criteria

| AC # | Given | When | Then | Exact Expected Value |
|------|-------|------|------|---------------------|
| AC-04-1 | I am logged in | I navigate to `/profile` | My User ID is displayed | Numeric ID shown (e.g., `User ID: 2`) |
| AC-04-2 | I am logged in | I navigate to `/profile` | My role is displayed as a badge | Badge text: `"ADMIN"` or `"USER"` with CSS class `role-admin` or `role-user` |
| AC-04-3 | My phone is set | I view my profile | Phone number is displayed | Phone shown in info section |
| AC-04-4 | My phone is not set | I view my profile | Phone is not shown | Phone section absent from page |
| AC-04-5 | My DOB is set | I view my profile | DOB is shown in human-readable format | Formatted date (locale-specific, e.g., "6/15/1995") |
| AC-04-6 | I am on `/profile` | Form loads | Username and email inputs are pre-filled | Input values = current username and email |
| AC-04-7 | I am on `/profile` | Password input renders | Password field is EMPTY | `input[type=password]` value is blank |
| AC-04-8 | Not logged in | I access `/profile` | I am redirected | URL = `/login` |
| AC-04-9 | GET /api/users/me called | No token | API returns 401 | HTTP 401 Unauthorized |

### Definition of Done
- [ ] All 9 ACs pass
- [ ] `UserControllerTest.testGetCurrentUser*` passes
- [ ] `04-profile.spec.js` passes

---

## US-05: Update Own Profile

**As an** authenticated user,
**I want to** update my profile fields,
**So that** I can keep my account information current.

### Acceptance Criteria

| AC # | Given | When | Then | Exact Expected Value |
|------|-------|------|------|---------------------|
| AC-05-1 | I am on `/profile` | I change the username and submit | Username is updated | New username visible on refresh; stored in DB |
| AC-05-2 | I am on `/profile` | I change the email and submit | Email is updated | New email visible on refresh |
| AC-05-3 | I am on `/profile` | I change phone and submit | Phone is updated | New phone visible in info section |
| AC-05-4 | I am on `/profile` | I change DOB and submit | DOB is updated | New DOB shown in info section |
| AC-05-5 | I enter a new password (≥ 6 chars) | I submit | New password works for login | Old password rejected; new password accepted on login |
| AC-05-6 | I leave the password field blank | I submit | Current password is NOT changed | Login with original password still works |
| AC-05-7 | Username or email is blank | I submit | Error appears | `"Username and email are required"` |
| AC-05-8 | New username is taken | I submit | Error appears | `"Username already exists"` |
| AC-05-9 | New email is taken | I submit | Error appears | `"Email already exists"` |
| AC-05-10 | New password has < 6 chars | I submit | Frontend error appears | `"Password must be at least 6 characters"` |
| AC-05-11 | Update succeeds | API returns 200 | Success message shown | `"Profile updated successfully!"` green message |
| AC-05-12 | Update succeeds | localStorage is checked | Username and email updated in localStorage | `localStorage.getItem("user")` reflects new values |
| AC-05-13 | I am a USER | I call PUT /api/users/{other_id} | API returns 403 | `{ "error": "You can only update your own profile" }` |
| AC-05-14 | Update clicked | While waiting | Button shows loading state | `"Updating..."`, disabled |

### Edge Cases
- **Same username submitted:** Updating with the same username as current should succeed (not flagged as duplicate).
- **Partial update:** Sending only `phoneNumber` should update only that field — username, email, password unchanged.

### Definition of Done
- [ ] All 14 ACs pass
- [ ] `UserServiceTest.testUpdateUser*` passes
- [ ] `UserControllerTest.testUpdateUser*` passes
- [ ] `04-profile.spec.js` passes

---

## US-06: View User List

**As an** authenticated user,
**I want to** see a list of all registered users,
**So that** I can view the user directory.

### Acceptance Criteria

| AC # | Given | When | Then | Exact Expected Value |
|------|-------|------|------|---------------------|
| AC-06-1 | I am authenticated | I navigate to `/users` | Table renders with all 6 columns | ID, Username, Email, Role, Created At, Actions |
| AC-06-2 | Multiple users registered | I view the list | All users appear | Every user in DB is shown as a row |
| AC-06-3 | I view a row | Role column renders | Role is shown as a badge | `<span class="role-badge role-admin">ADMIN</span>` or `role-user` |
| AC-06-4 | I am a USER role | I view Actions column | Every cell shows "No access" | Text `"No access"` in grey, no button |
| AC-06-5 | I am an ADMIN | I view the list | Blue info banner shown | Text: `"Admin Access: You can delete any user account."` |
| AC-06-6 | I am unauthenticated | I access `/users` | Redirected to login | URL = `/login` |
| AC-06-7 | GET /api/users | No Authorization header | 401 returned | HTTP 401 |

### Definition of Done
- [ ] All 7 ACs pass
- [ ] `UserControllerTest.testGetAllUsers*` passes
- [ ] `05-user-list.spec.js` passes

---

## US-07: Admin Deletes a User

**As an** admin,
**I want to** delete user accounts,
**So that** I can manage the user base.

### Acceptance Criteria

| AC # | Given | When | Then | Exact Expected Value |
|------|-------|------|------|---------------------|
| AC-07-1 | I am ADMIN on `/users` | I see other users | Delete button visible per row | Red button with text `"Delete"` |
| AC-07-2 | I am ADMIN, viewing own row | Own row in table | No Delete button shown | Actions cell has no button for own account |
| AC-07-3 | I click Delete on a user | Before API call | Confirmation dialog shown | Text: `"Are you sure you want to delete user "[username]"?"` |
| AC-07-4 | I click Cancel in dialog | Dialog dismissed | User is NOT deleted | Row still present; DB count unchanged |
| AC-07-5 | I confirm deletion | API call succeeds | Alert shown | `"User deleted successfully"` |
| AC-07-6 | Deletion confirmed | After alert | List refreshes automatically | Deleted user no longer in table |
| AC-07-7 | DELETE /api/users/{admin_id} called with admin token | API processes | 403 returned | `{ "error": "Admin cannot delete their own account" }` |
| AC-07-8 | DELETE /api/users/{id} called with USER token | API processes | 403 returned | `{ "error": "Only admins can delete accounts" }` |
| AC-07-9 | DELETE /api/users/9999 (non-existent) with admin token | API processes | 404 returned | `{ "error": "User not found with id: 9999" }` |

### Edge Cases
- **Admin UI row for own account:** The Delete button should be absent (not just disabled). This prevents accidental self-deletion.
- **User deleted mid-session:** If User B is deleted while User A is viewing the list, the next list refresh should reflect the deletion.

### Definition of Done
- [ ] All 9 ACs pass
- [ ] `UserControllerTest.testDeleteUser*` passes (all 4 variants)
- [ ] `UserManagementIntegrationTest` passes
- [ ] `05-user-list.spec.js` delete scenarios pass

---

## US-08: Session Expiry / Unauthorized Token Handling

**As a** user with an expired or invalid JWT token,
**I want to** be automatically redirected to login,
**So that** my session is securely terminated without leaving me on a broken page.

### Acceptance Criteria

| AC # | Given | When | Then | Exact Expected Value |
|------|-------|------|------|---------------------|
| AC-08-1 | I have an invalid token in localStorage | Any protected API call is made | `token` removed from localStorage | `localStorage.getItem("token")` = `null` |
| AC-08-2 | API returns 401 | Axios interceptor handles it | `user` removed from localStorage | `localStorage.getItem("user")` = `null` |
| AC-08-3 | API returns 401 | After localStorage clear | Browser navigates to login | `window.location.href` = `/login` |
| AC-08-4 | No token at all | I access `/profile` or `/users` | App redirects | URL = `/login` (handled by frontend route guard) |

### Definition of Done
- [ ] All 4 ACs pass
- [ ] Manual TC-036 passes
- [ ] `03-navigation.spec.js` protected route tests pass
