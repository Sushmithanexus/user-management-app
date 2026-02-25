# Detailed Test Cases (Manual)
**Project:** User Management Application
**Version:** 2.0 (Advanced — 60 Test Cases)
**Date:** 2026-02-25

> **Execution columns:** Result = Pass / Fail / Blocked / Skip. Fill Date and Tester for each cycle.

---

## TC-000: Test Environment Setup (Precondition for ALL tests)

| Field | Detail |
|-------|--------|
| **TC ID** | TC-000 |
| **Type** | Setup |
| **Priority** | Critical |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Kill any process on port 8080: `kill $(lsof -t -i:8080)` | No output = port free |
| 2 | Run `mvn spring-boot:run` from `/Users/ainexus/Task` | Console shows "User Management Application Started!" |
| 3 | Open browser → `http://localhost:8080/h2-console` | H2 login page loads |
| 4 | Connect with JDBC URL `jdbc:h2:mem:usermanagementdb`, user `sa`, blank password | H2 console opens, USERS table visible but empty |
| 5 | Run `cd frontend && npm run dev` in a new terminal | "Local: http://localhost:5173/" shown in terminal |
| 6 | Open browser → `http://localhost:5173` | Application loads, shows navbar with Login + Signup |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-001: Successful Signup — First User Becomes ADMIN

| Field | Detail |
|-------|--------|
| **TC ID** | TC-001 |
| **Scenario** | TS-01-01, TS-01-03 |
| **Priority** | P1 Critical |
| **Precondition** | TC-000 done; DB empty (zero users) |
| **Test Data** | Username: `adminuser` / Email: `admin@testapp.com` / Password: `Admin@123` / Confirm: `Admin@123` |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `http://localhost:5173/signup` | Signup form loads with 6 fields |
| 2 | Enter Username: `adminuser` | Field accepts input |
| 3 | Enter Email: `admin@testapp.com` | Field accepts input |
| 4 | Leave Phone Number blank | Field empty |
| 5 | Leave Date of Birth blank | Field empty |
| 6 | Enter Password: `Admin@123` | Masked input shown |
| 7 | Enter Confirm Password: `Admin@123` | Masked input shown |
| 8 | Click "Sign Up" button | Button text changes to "Signing up...", button disabled |
| 9 | Wait for response | Alert box: "Registration successful! Please login." |
| 10 | Click OK on alert | URL changes to `/login` |
| 11 | Log in with `adminuser` / `Admin@123` | Login succeeds, redirected to /profile |
| 12 | Check Role field on profile page | Badge displays "ADMIN" |
| 13 | Open H2 console → `SELECT * FROM USERS` | 1 row: role = 'ADMIN', password is BCrypt hash (starts with `$2a$`) |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-002: Signup — Subsequent User Gets USER Role

| Field | Detail |
|-------|--------|
| **TC ID** | TC-002 |
| **Scenario** | TS-01-02, TS-01-04 |
| **Priority** | P1 Critical |
| **Precondition** | TC-001 done; DB has 1 user (adminuser) |
| **Test Data** | Username: `regularuser` / Email: `user@testapp.com` / Password: `User@123` / Phone: `9876543210` / DOB: `1995-06-15` |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/signup` | Form loads |
| 2 | Enter Username: `regularuser` | — |
| 3 | Enter Email: `user@testapp.com` | — |
| 4 | Enter Phone: `9876543210` | — |
| 5 | Enter DOB: `1995-06-15` (via date picker) | Date selected |
| 6 | Enter Password: `User@123`, Confirm: `User@123` | — |
| 7 | Click "Sign Up" | Success alert shown |
| 8 | Login with `regularuser` / `User@123` | Redirected to /profile |
| 9 | Check Role on profile | Badge shows "USER" (NOT ADMIN) |
| 10 | Check Phone and DOB sections on profile | Phone: 9876543210 and DOB shown |
| 11 | H2 console → `SELECT * FROM USERS WHERE username='regularuser'` | phone_number = '9876543210', date_of_birth = '1995-06-15', role = 'USER' |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-003: Signup — Duplicate Username

| Field | Detail |
|-------|--------|
| **TC ID** | TC-003 |
| **Scenario** | TS-01-05 |
| **Priority** | P1 |
| **Precondition** | `adminuser` already registered |
| **Test Data** | Username: `adminuser` (duplicate) / Email: `new@testapp.com` / Password: `New@123` |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/signup` | Form loads |
| 2 | Enter Username: `adminuser`, Email: `new@testapp.com`, Password + Confirm: `New@123` | Fields filled |
| 3 | Click "Sign Up" | Request sent to API |
| 4 | Observe error message on page | Red error box shows: **"Username already exists"** |
| 5 | Verify URL | Still `/signup` (no redirect) |
| 6 | H2 console → `SELECT COUNT(*) FROM USERS` | Count unchanged (still 1 or 2) |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-004: Signup — Duplicate Email

| Field | Detail |
|-------|--------|
| **TC ID** | TC-004 |
| **Priority** | P1 |
| **Precondition** | `admin@testapp.com` already registered |
| **Test Data** | Username: `newuser2` / Email: `admin@testapp.com` (duplicate) / Password: `New@123` |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/signup`, fill form with a unique username but existing email | Fields filled |
| 2 | Click "Sign Up" | API call made |
| 3 | Observe error | Red box: **"Email already exists"** |
| 4 | Confirm no redirect | Still on /signup |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-005: Signup — Mismatched Passwords

| Field | Detail |
|-------|--------|
| **TC ID** | TC-005 |
| **Scenario** | TS-01-08 |
| **Priority** | P1 |
| **Precondition** | None |
| **Test Data** | Password: `Test@123` / Confirm: `Different@123` |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/signup`, fill valid username and email | — |
| 2 | Enter Password: `Test@123` | — |
| 3 | Enter Confirm Password: `Different@123` | — |
| 4 | Click "Sign Up" | **No API call made** (open DevTools → Network — verify no request sent) |
| 5 | Observe error | Red box: **"Passwords do not match"** |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-006: Signup — Password Too Short (5 chars)

| Field | Detail |
|-------|--------|
| **TC ID** | TC-006 |
| **Scenario** | TS-01-09 |
| **Priority** | P1 |
| **Test Data** | Password: `Ab@12` (5 chars) / Confirm: `Ab@12` |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Fill signup form with valid username, email | — |
| 2 | Enter Password: `Ab@12` and Confirm: `Ab@12` | — |
| 3 | Click "Sign Up" | No API call. Error: **"Password must be at least 6 characters"** |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-007: Signup — All Required Fields Blank

| Field | Detail |
|-------|--------|
| **TC ID** | TC-007 |
| **Scenario** | TS-01-14 |
| **Priority** | P1 |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/signup`, leave ALL fields blank | — |
| 2 | Click "Sign Up" | No API call. Error: **"All fields are required"** |
| 3 | Verify button returns to "Sign Up" (not loading) | Button re-enabled |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-008: Signup — Password Not in API Response

| Field | Detail |
|-------|--------|
| **TC ID** | TC-008 |
| **Scenario** | TS-01-15 |
| **Priority** | P1 Security |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open DevTools → Network tab | Network monitor open |
| 2 | Register a new valid user | Signup request sent |
| 3 | Click the POST /api/auth/signup request in Network tab | Response body visible |
| 4 | Inspect response JSON | **No `password` key present** in user object or anywhere in response |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-009: Successful Login — JWT and localStorage

| Field | Detail |
|-------|--------|
| **TC ID** | TC-009 |
| **Scenario** | TS-02-01, TS-02-02, TS-02-03 |
| **Priority** | P1 Critical |
| **Precondition** | `adminuser` / `Admin@123` registered |
| **Test Data** | Username: `adminuser` / Password: `Admin@123` |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/login` | Login form shown with Username and Password fields |
| 2 | Enter Username: `adminuser` | — |
| 3 | Enter Password: `Admin@123` | Masked |
| 4 | Click "Login" | Button shows "Logging in...", disabled |
| 5 | Wait for response | URL changes to `/profile` |
| 6 | Open DevTools → Application → Local Storage → localhost:5173 | localStorage visible |
| 7 | Check key `token` | Value exists, starts with `eyJ` (JWT format) |
| 8 | Check key `user` | JSON object with `userId`, `username`, `email`, `role` keys |
| 9 | Verify `role` value in localStorage `user` | "ADMIN" |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-010: Login — Wrong Password

| Field | Detail |
|-------|--------|
| **TC ID** | TC-010 |
| **Scenario** | TS-02-06 |
| **Priority** | P1 |
| **Precondition** | `adminuser` registered |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/login` | — |
| 2 | Enter Username: `adminuser`, Password: `WrongPass999` | — |
| 3 | Click "Login" | API call made |
| 4 | Observe response | Red error box: **"Invalid username or password"** |
| 5 | Verify URL | Still `/login` |
| 6 | Check localStorage | No `token` key added |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-011: Login — Empty Fields

| Field | Detail |
|-------|--------|
| **TC ID** | TC-011 |
| **Scenario** | TS-02-08, TS-02-09 |
| **Priority** | P1 |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/login`, leave both fields blank, click Login | Error: **"All fields are required"**. No API call. |
| 2 | Fill Username only, leave Password blank, click Login | Error: **"All fields are required"** |
| 3 | Fill Password only, leave Username blank, click Login | Error: **"All fields are required"** |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-012: Login — Password Not in Response

| Field | Detail |
|-------|--------|
| **TC ID** | TC-012 |
| **Scenario** | TS-02-10 |
| **Priority** | P1 Security |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open DevTools → Network | — |
| 2 | Login with valid credentials | POST /api/auth/login request made |
| 3 | Click the request → Response body | **No `password` key** in response JSON |
| 4 | Also verify localStorage `user` key | **No `password` field** in stored user object |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-013: Logout — Full Flow

| Field | Detail |
|-------|--------|
| **TC ID** | TC-013 |
| **Scenario** | TS-03-01 through TS-03-04 |
| **Priority** | P1 |
| **Precondition** | Logged in as `adminuser` |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Verify localStorage has `token` and `user` keys | Both present |
| 2 | Click "Logout" in navbar | — |
| 3 | Verify URL | Changes to `/login` |
| 4 | Check localStorage | `token` key: **removed** |
| 5 | Check localStorage | `user` key: **removed** |
| 6 | Check navbar | Shows **Login** and **Signup** links only |
| 7 | Verify Profile, Users, Logout links absent | Not visible in navbar |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-014: Protected Routes Blocked After Logout

| Field | Detail |
|-------|--------|
| **TC ID** | TC-014 |
| **Scenario** | TS-03-05, TS-03-06, TS-04-07 |
| **Priority** | P1 Security |
| **Precondition** | Logged out (no token in localStorage) |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Manually type `http://localhost:5173/profile` in address bar | Redirected to `/login` |
| 2 | Manually type `http://localhost:5173/users` in address bar | Redirected to `/login` |
| 3 | Clear localStorage manually (DevTools → Application → Clear All) | — |
| 4 | Refresh `/profile` | Redirected to `/login` |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-015: View Own Profile — All Fields Displayed

| Field | Detail |
|-------|--------|
| **TC ID** | TC-015 |
| **Scenario** | TS-04-01 through TS-04-06 |
| **Priority** | P1 |
| **Precondition** | Logged in as `regularuser` (has phone + DOB set) |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/profile` | Profile page loads, no error |
| 2 | Verify User ID shown | Numeric value (e.g. 2) displayed |
| 3 | Verify Role badge | Shows **"USER"** with badge styling |
| 4 | Verify Phone displayed | `9876543210` shown |
| 5 | Verify DOB displayed | Date formatted (e.g. "6/15/1995") |
| 6 | Verify Created date shown | ISO-format or locale date |
| 7 | Verify Username input | Pre-filled with `regularuser` |
| 8 | Verify Email input | Pre-filled with `user@testapp.com` |
| 9 | Verify Password input | **Empty** (not pre-filled) |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-016: Update Own Username

| Field | Detail |
|-------|--------|
| **TC ID** | TC-016 |
| **Scenario** | TS-05-01 |
| **Priority** | P1 |
| **Precondition** | Logged in as `regularuser` |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | On `/profile`, clear Username field | Field empty |
| 2 | Type `regularuser_v2` | New value entered |
| 3 | Click "Update Profile" | Button shows "Updating..." |
| 4 | Wait for response | Green message: **"Profile updated successfully!"** |
| 5 | Refresh `/profile` | Username field shows `regularuser_v2` |
| 6 | Check localStorage `user` key | `username` field = `regularuser_v2` |
| 7 | H2 console: `SELECT username FROM USERS WHERE id=2` | Returns `regularuser_v2` |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-017: Update Phone Number and DOB

| Field | Detail |
|-------|--------|
| **TC ID** | TC-017 |
| **Scenario** | TS-05-03, TS-05-04 |
| **Priority** | P1 |
| **Precondition** | Logged in |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | On `/profile`, update Phone to `1234567890` | — |
| 2 | Update DOB to `1992-03-20` | — |
| 3 | Click "Update Profile" | Success message shown |
| 4 | Refresh page | Phone: `1234567890`, DOB: `3/20/1992` |
| 5 | H2 console: verify phone_number and date_of_birth columns | Updated values stored |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-018: Change Password and Verify Login

| Field | Detail |
|-------|--------|
| **TC ID** | TC-018 |
| **Scenario** | TS-05-06 |
| **Priority** | P1 |
| **Precondition** | Logged in as `regularuser` / `User@123` |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | On `/profile`, enter New Password: `NewPass@456` | — |
| 2 | Click "Update Profile" | Success message |
| 3 | Click Logout | Redirected to /login |
| 4 | Login with `regularuser` + old password `User@123` | **Login fails** — error shown |
| 5 | Login with `regularuser` + new password `NewPass@456` | **Login succeeds** — redirected to /profile |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-019: Leave Password Blank — Existing Password Unchanged

| Field | Detail |
|-------|--------|
| **TC ID** | TC-019 |
| **Scenario** | TS-05-07 |
| **Priority** | P1 |
| **Precondition** | Logged in as `regularuser` / `User@123` (or NewPass@456 if TC-018 ran) |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | On `/profile`, update only Phone to `5551234567`, leave Password blank | — |
| 2 | Click "Update Profile" | Success message |
| 3 | Logout | — |
| 4 | Login with current password | **Login succeeds** — password was not changed |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-020: Update With Same Username (No Change)

| Field | Detail |
|-------|--------|
| **TC ID** | TC-020 |
| **Scenario** | TS-05-08 |
| **Priority** | P2 |
| **Precondition** | Logged in |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | On `/profile`, keep username as-is (don't change it) | — |
| 2 | Click "Update Profile" | Success message — not flagged as duplicate of self |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-021: Update — Duplicate Username (Another User)

| Field | Detail |
|-------|--------|
| **TC ID** | TC-021 |
| **Scenario** | TS-05-09 |
| **Priority** | P1 |
| **Precondition** | `adminuser` and `regularuser` both exist; logged in as `regularuser` |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | On `/profile`, change Username to `adminuser` (taken by another user) | — |
| 2 | Click "Update Profile" | Red error: **"Username already exists"** |
| 3 | Verify username not changed | Refresh — still `regularuser` (or `regularuser_v2`) |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-022: Update — Validation Errors

| Field | Detail |
|-------|--------|
| **TC ID** | TC-022 |
| **Scenario** | TS-05-11, TS-05-12, TS-05-13 |
| **Priority** | P1 |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Clear Username, keep Email, click "Update Profile" | Error: **"Username and email are required"** |
| 2 | Fill Username, clear Email, click "Update Profile" | Error: **"Username and email are required"** |
| 3 | Fill both, enter New Password: `abc12` (5 chars), click Update | Error: **"Password must be at least 6 characters"** |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-023: Regular User Cannot Update Another User via API

| Field | Detail |
|-------|--------|
| **TC ID** | TC-023 |
| **Scenario** | TS-05-14 |
| **Priority** | P1 Security |
| **Precondition** | `regularuser` (id=2) logged in; `adminuser` has id=1 |
| **Tool** | Postman or curl |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Login as `regularuser`, copy JWT token from localStorage | Token obtained |
| 2 | In Postman: `PUT http://localhost:8080/api/users/1` with `Authorization: Bearer <token>` and body `{"username":"hacked"}` | — |
| 3 | Check response status | **HTTP 403** |
| 4 | Check response body | `{ "error": "You can only update your own profile" }` |
| 5 | H2 console: verify adminuser's username unchanged | Still `adminuser` |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-024: Admin Can Update Another User via API

| Field | Detail |
|-------|--------|
| **TC ID** | TC-024 |
| **Scenario** | TS-06-01 |
| **Priority** | P1 |
| **Precondition** | `adminuser` (ADMIN, id=1), `regularuser` (USER, id=2) exist |
| **Tool** | Postman or curl |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Login as `adminuser`, copy JWT token | Token obtained |
| 2 | In Postman: `PUT http://localhost:8080/api/users/2` with admin token and body `{"phoneNumber":"9990001111"}` | — |
| 3 | Check response status | **HTTP 200** |
| 4 | Check response body | `{ "message": "User updated successfully", "user": {...} }` |
| 5 | H2 console: `SELECT phone_number FROM USERS WHERE id=2` | Returns `9990001111` |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-025: Regular User Views User List

| Field | Detail |
|-------|--------|
| **TC ID** | TC-025 |
| **Scenario** | TS-07-01, TS-07-03, TS-07-05 |
| **Priority** | P1 |
| **Precondition** | Logged in as `regularuser`; multiple users in DB |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/users` | Page loads, table visible |
| 2 | Verify table headers | ID, Username, Email, Role, Created At, Actions — all 6 present |
| 3 | Verify all registered users appear | All rows in DB visible in table |
| 4 | Check Actions column for every row | All show **"No access"** (no Delete button) |
| 5 | Verify no Admin info banner | Blue banner NOT visible |
| 6 | Check role column for adminuser row | Shows styled badge with "ADMIN" |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-026: Admin Views User List — Banner and Delete Buttons

| Field | Detail |
|-------|--------|
| **TC ID** | TC-026 |
| **Scenario** | TS-07-02, TS-07-06 |
| **Priority** | P1 |
| **Precondition** | Logged in as `adminuser`; at least one other user in DB |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/users` | Page loads |
| 2 | Verify blue "Admin Access" banner | Banner text: **"Admin Access: You can delete any user account."** |
| 3 | Check Actions column for `regularuser` row | **Red Delete button** visible |
| 4 | Check Actions column for own (`adminuser`) row | **No Delete button** — no action or "No access" shown |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-027: Create Third User (deleteuser) for Delete Tests

| Field | Detail |
|-------|--------|
| **TC ID** | TC-027 |
| **Priority** | P1 Setup |
| **Test Data** | Username: `deleteuser` / Email: `delete@testapp.com` / Password: `Delete@123` |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Logout if logged in | — |
| 2 | Navigate to `/signup`, register `deleteuser` with `delete@testapp.com` / `Delete@123` | Registration successful |
| 3 | H2 console: verify 3 users in DB | COUNT(*) = 3 |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-028: Admin Deletes a User — Full Flow

| Field | Detail |
|-------|--------|
| **TC ID** | TC-028 |
| **Scenario** | TS-08-01, TS-08-02, TS-08-03 |
| **Priority** | P1 |
| **Precondition** | TC-027 done; logged in as `adminuser` |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/users` | `deleteuser` visible in list |
| 2 | Click Delete button next to `deleteuser` | Browser confirmation dialog appears |
| 3 | Read dialog text | Contains **"deleteuser"** in message |
| 4 | Click OK to confirm | Alert: **"User deleted successfully"** |
| 5 | Click OK on alert | User list reloads automatically |
| 6 | Verify `deleteuser` not in list | Row absent from table |
| 7 | H2 console: `SELECT COUNT(*) FROM USERS` | Count reduced by 1 |
| 8 | H2 console: `SELECT * FROM USERS WHERE username='deleteuser'` | No rows returned |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-029: Cancel Deletion — User Not Deleted

| Field | Detail |
|-------|--------|
| **TC ID** | TC-029 |
| **Scenario** | TS-08-04 |
| **Priority** | P1 |
| **Precondition** | At least one USER exists; logged in as ADMIN |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/users` | List visible |
| 2 | Click Delete next to any user | Confirmation dialog shown |
| 3 | Click **Cancel** on dialog | Dialog dismissed |
| 4 | Verify user still in list | Row still present |
| 5 | H2 console: user count unchanged | No rows deleted |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-030: Admin Cannot Delete Own Account (API)

| Field | Detail |
|-------|--------|
| **TC ID** | TC-030 |
| **Scenario** | TS-08-05 |
| **Priority** | P1 Critical Security |
| **Precondition** | Logged in as `adminuser` (id=1) |
| **Tool** | Postman or curl |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Copy adminuser's JWT token from localStorage | Token available |
| 2 | In Postman: `DELETE http://localhost:8080/api/users/1` with `Authorization: Bearer <admin_token>` | — |
| 3 | Check response status | **HTTP 403** |
| 4 | Check response body | `{ "error": "Admin cannot delete their own account" }` |
| 5 | H2 console: `SELECT * FROM USERS WHERE username='adminuser'` | ADMIN still exists |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-031: Regular User Cannot Delete Any Account (API)

| Field | Detail |
|-------|--------|
| **TC ID** | TC-031 |
| **Scenario** | TS-08-06, TS-08-07 |
| **Priority** | P1 Critical Security |
| **Precondition** | Logged in as `regularuser` (id=2); adminuser (id=1) exists |
| **Tool** | Postman or curl |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Login as `regularuser`, copy JWT token | Token obtained |
| 2 | `DELETE /api/users/1` (adminuser) with regularuser token | **HTTP 403**, `{ "error": "Only admins can delete accounts" }` |
| 3 | `DELETE /api/users/2` (own account) with regularuser token | **HTTP 403**, `{ "error": "Only admins can delete accounts" }` |
| 4 | H2 console: both users still exist | COUNT(*) unchanged |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-032: Delete Non-Existent User (API)

| Field | Detail |
|-------|--------|
| **TC ID** | TC-032 |
| **Scenario** | TS-08-08 |
| **Priority** | P2 |
| **Precondition** | Logged in as ADMIN |
| **Tool** | Postman |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | `DELETE /api/users/9999` with admin token | **HTTP 404** |
| 2 | Check response body | `{ "error": "User not found with id: 9999" }` |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-033: Admin Deletes One User — Others Unaffected

| Field | Detail |
|-------|--------|
| **TC ID** | TC-033 |
| **Scenario** | TS-08-10 |
| **Priority** | P2 |
| **Precondition** | 3 users in DB: adminuser, regularuser, deleteuser; logged in as ADMIN |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Note current user count | 3 users |
| 2 | Delete `deleteuser` via UI | Confirmed deletion |
| 3 | Verify list | 2 rows: adminuser + regularuser remain |
| 4 | Login as `regularuser` | Login succeeds — account unaffected |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-034: GET All Users Without Token (API)

| Field | Detail |
|-------|--------|
| **TC ID** | TC-034 |
| **Scenario** | TS-07-07 |
| **Priority** | P1 Security |
| **Tool** | Postman or curl |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | `GET http://localhost:8080/api/users` with NO Authorization header | **HTTP 401** |
| 2 | `GET http://localhost:8080/api/users/me` with NO Authorization header | **HTTP 401** |
| 3 | `GET http://localhost:8080/api/users/1` with NO Authorization header | **HTTP 401** |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-035: All Protected Endpoints Require Bearer Token

| Field | Detail |
|-------|--------|
| **TC ID** | TC-035 |
| **Scenario** | TS-09-01, TS-09-02 |
| **Priority** | P1 Security |
| **Tool** | Postman |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | `GET /api/users` — no header | 401 |
| 2 | `GET /api/users` — `Authorization: Bearer invalid.token.here` | 401 |
| 3 | `GET /api/users/me` — no header | 401 |
| 4 | `PUT /api/users/1` — no header | 401 |
| 5 | `DELETE /api/users/1` — no header | 401 |
| 6 | `POST /api/auth/signup` — no header | **201** (public endpoint, no token needed) |
| 7 | `POST /api/auth/login` — no header | **200** (public endpoint, no token needed) |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-036: 401 Response Clears localStorage and Redirects

| Field | Detail |
|-------|--------|
| **TC ID** | TC-036 |
| **Scenario** | TS-09-04 |
| **Priority** | P1 Security |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Login to set token in localStorage | Token present |
| 2 | Manually edit localStorage `token` to an invalid value in DevTools | Token is now invalid |
| 3 | Navigate to `/users` (triggers GET /api/users with bad token) | API returns 401 |
| 4 | Observe app behaviour | **localStorage cleared** (`token` and `user` removed) |
| 5 | Observe URL | Redirected to `/login` |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-037: No Password Field in ANY API Response

| Field | Detail |
|-------|--------|
| **TC ID** | TC-037 |
| **Scenario** | TS-09-05 |
| **Priority** | P1 Critical Security |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open DevTools → Network | — |
| 2 | Signup a new user, inspect POST /api/auth/signup response | No `password` field in `user` object |
| 3 | Login, inspect POST /api/auth/login response | No `password` field in response |
| 4 | With valid token: `GET /api/users` — inspect each user object in array | No `password` field in any user object |
| 5 | `GET /api/users/me` — inspect response | No `password` field |
| 6 | `GET /api/users/1` — inspect response | No `password` field |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-038: Navbar State — Guest vs Authenticated

| Field | Detail |
|-------|--------|
| **TC ID** | TC-038 |
| **Scenario** | TS-10-01, TS-10-02 |
| **Priority** | P1 |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Clear localStorage (DevTools), navigate to `/login` | Navbar shows: **Login** and **Signup** only |
| 2 | Login with valid credentials | — |
| 3 | Observe navbar | Shows: **Profile**, **Users**, **Logout** only |
| 4 | Profile, Users, Logout links work | Each navigates/acts correctly |
| 5 | Logout | Navbar reverts to Login + Signup |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-039: Username Boundary — Min 3, Max 50 Characters

| Field | Detail |
|-------|--------|
| **TC ID** | TC-039 |
| **Scenario** | TS-12-01, TS-12-02 |
| **Priority** | P1 |
| **Tool** | Postman (direct API test) |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | POST /api/auth/signup with `username`: `"ab"` (2 chars) | **400** — validation error |
| 2 | POST /api/auth/signup with `username`: `"abc"` (3 chars, unique) | **201** — success |
| 3 | POST /api/auth/signup with `username`: 50-char string (unique) | **201** — success |
| 4 | POST /api/auth/signup with `username`: 51-char string (unique) | **400** — validation error |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-040: Password Boundary — Exactly 6 Characters

| Field | Detail |
|-------|--------|
| **TC ID** | TC-040 |
| **Scenario** | TS-12-03 |
| **Priority** | P1 |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Signup with Password: `abcde` (5 chars) | **Error** — password too short |
| 2 | Signup with Password: `abcdef` (6 chars) | **201** — success |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-041: Partial Update — Only One Field Changed

| Field | Detail |
|-------|--------|
| **TC ID** | TC-041 |
| **Scenario** | TS-12-05 |
| **Priority** | P1 |
| **Precondition** | Logged in; username, email, phone all set |
| **Tool** | Postman (to send a body with only `phoneNumber`) |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Note current username, email, phone | All recorded |
| 2 | `PUT /api/users/{id}` with body: `{"phoneNumber": "0001112222"}` only | **200** success |
| 3 | `GET /api/users/me` | `phoneNumber` = `"0001112222"`, username and email **unchanged** |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-042: Invalid Email Format on Signup (API)

| Field | Detail |
|-------|--------|
| **TC ID** | TC-042 |
| **Scenario** | TS-01-11 |
| **Priority** | P1 |
| **Tool** | Postman |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | POST /api/auth/signup with `email`: `"notanemail"` | **400** — "Email should be valid" |
| 2 | POST /api/auth/signup with `email`: `"user@"` | **400** |
| 3 | POST /api/auth/signup with `email`: `"@domain.com"` | **400** |
| 4 | POST /api/auth/signup with `email`: `"user@domain.com"` | **201** |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-043: GET User by ID (API)

| Field | Detail |
|-------|--------|
| **TC ID** | TC-043 |
| **Priority** | P2 |
| **Precondition** | 2 users exist; ADMIN token available |
| **Tool** | Postman |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | `GET /api/users/1` with valid token | **200**, UserDTO for id=1 returned |
| 2 | `GET /api/users/9999` with valid token | **404**, `{ "error": "User not found with id: 9999" }` |
| 3 | Verify response has no `password` field | No `password` in body |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-044: Login Response Contains All Required Fields

| Field | Detail |
|-------|--------|
| **TC ID** | TC-044 |
| **Priority** | P1 |
| **Tool** | Postman |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | POST /api/auth/login with valid credentials | 200 response |
| 2 | Verify response has `token` field | Present, starts with `eyJ` |
| 3 | Verify `username` field | Matches logged-in user |
| 4 | Verify `email` field | Correct email |
| 5 | Verify `role` field | "ADMIN" or "USER" |
| 6 | Verify `userId` field | Numeric ID |
| 7 | Verify NO `password` field | Absent |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-045: Signup Response Contains All Required Fields

| Field | Detail |
|-------|--------|
| **TC ID** | TC-045 |
| **Priority** | P1 |
| **Tool** | Postman |

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | POST /api/auth/signup with valid data | 201 response |
| 2 | Verify `message` = `"User registered successfully"` | — |
| 3 | Verify `user.id` present | Numeric |
| 4 | Verify `user.username` | Matches sent username |
| 5 | Verify `user.email` | Matches sent email |
| 6 | Verify `user.role` | "ADMIN" or "USER" |
| 7 | Verify `user.createdAt` | ISO datetime present |
| 8 | Verify NO `user.password` | Absent |

**Result:** ☐ Pass ☐ Fail &nbsp; Date: ________ &nbsp; Tester: ________

---

## TC-046 – TC-060: Mobile / Cross-Device Cases

| TC ID | Device | Scenario | Step Summary | Scenario Ref |
|-------|--------|----------|-------------|-------------|
| TC-046 | Desktop Chrome | Signup end-to-end | Navigate, fill, submit, verify redirect | TS-11-01 |
| TC-047 | Mobile Chrome (Pixel 5) | Login end-to-end | Verify form tappable, login works | TS-11-02 |
| TC-048 | Mobile Safari (iPhone 13) | Profile view and update | Form scrollable, update succeeds | TS-11-03 |
| TC-049 | Mobile Chrome | User list scroll | Table scrolls horizontally | TS-11-04 |
| TC-050 | iPad Pro (Tablet) | Full signup→login→profile→users flow | All screens render correctly | TS-11-05 |
| TC-051 | Mobile Chrome | Signup error messages visible | Error not clipped/hidden | TS-11-06 |
| TC-052 | Mobile Safari | Logout clears session | Token cleared, redirect to /login | TS-03-01 |
| TC-053 | Desktop Chrome | Regression: full flow after any bug fix | TC-001→TC-009→TC-013→TC-028 | All |
| TC-054 | Desktop Chrome | Admin flow: login → view list → delete → verify | TC-026→TC-028 | TS-07/08 |
| TC-055 | Desktop Chrome | User flow: signup → login → view profile → update → logout | TC-002→TC-009→TC-015→TC-016→TC-013 | TS-01/02/04/05/03 |
| TC-056 | API (Postman) | All error status codes verified (400,401,403,404) | Run full negative API suite | TS-09 |
| TC-057 | API (Postman) | Smoke suite SMOKE-01 through SMOKE-07 | Quick build verification | All |
| TC-058 | Desktop Chrome | H2 console: verify BCrypt hash stored | Check DB after signup | TS-01-15 |
| TC-059 | Desktop Chrome | H2 console: verify created_at set on signup | Check DB after signup | — |
| TC-060 | Desktop Chrome | H2 console: verify user deleted from DB after admin delete | Check DB after TC-028 | TS-08-01 |

> **For TC-046–TC-060:** Execute same steps as reference TC, on the specified device/tool. Record Pass/Fail per device.

---

## Test Execution Summary Table

| TC ID | Title | Priority | Result | Date | Tester | Defect Ref |
|-------|-------|---------|--------|------|--------|-----------|
| TC-000 | Environment Setup | Critical | | | | |
| TC-001 | Signup — First User ADMIN | P1 | | | | |
| TC-002 | Signup — Subsequent USER | P1 | | | | |
| TC-003 | Signup — Duplicate Username | P1 | | | | |
| TC-004 | Signup — Duplicate Email | P1 | | | | |
| TC-005 | Signup — Password Mismatch | P1 | | | | |
| TC-006 | Signup — Password Too Short | P1 | | | | |
| TC-007 | Signup — All Fields Blank | P1 | | | | |
| TC-008 | Signup — No Password in Response | P1 | | | | |
| TC-009 | Login — Success + localStorage | P1 | | | | |
| TC-010 | Login — Wrong Password | P1 | | | | |
| TC-011 | Login — Empty Fields | P1 | | | | |
| TC-012 | Login — No Password in Response | P1 | | | | |
| TC-013 | Logout — Full Flow | P1 | | | | |
| TC-014 | Protected Routes Blocked | P1 | | | | |
| TC-015 | View Profile — All Fields | P1 | | | | |
| TC-016 | Update Username | P1 | | | | |
| TC-017 | Update Phone + DOB | P1 | | | | |
| TC-018 | Change Password | P1 | | | | |
| TC-019 | Blank Password = No Change | P1 | | | | |
| TC-020 | Update — Same Username | P2 | | | | |
| TC-021 | Update — Duplicate Username | P1 | | | | |
| TC-022 | Update — Validation Errors | P1 | | | | |
| TC-023 | User Cannot Update Others (API) | P1 | | | | |
| TC-024 | Admin Can Update Others (API) | P1 | | | | |
| TC-025 | User Views List | P1 | | | | |
| TC-026 | Admin Views List | P1 | | | | |
| TC-027 | Create deleteuser | P1 | | | | |
| TC-028 | Admin Deletes User | P1 | | | | |
| TC-029 | Cancel Deletion | P1 | | | | |
| TC-030 | Admin Cannot Delete Self (API) | P1 | | | | |
| TC-031 | User Cannot Delete Any (API) | P1 | | | | |
| TC-032 | Delete Non-Existent User | P2 | | | | |
| TC-033 | Delete One — Others Unaffected | P2 | | | | |
| TC-034 | GET Users — No Token | P1 | | | | |
| TC-035 | All Endpoints Need Token | P1 | | | | |
| TC-036 | 401 Clears LocalStorage | P1 | | | | |
| TC-037 | No Password in ANY Response | P1 | | | | |
| TC-038 | Navbar State | P1 | | | | |
| TC-039 | Username Boundary 3–50 | P1 | | | | |
| TC-040 | Password Boundary 6 chars | P1 | | | | |
| TC-041 | Partial Update (One Field) | P1 | | | | |
| TC-042 | Invalid Email Format (API) | P1 | | | | |
| TC-043 | GET User by ID (API) | P2 | | | | |
| TC-044 | Login Response Fields | P1 | | | | |
| TC-045 | Signup Response Fields | P1 | | | | |
| TC-046 | Desktop Chrome — Signup E2E | P1 | | | | |
| TC-047 | Mobile Chrome — Login E2E | P1 | | | | |
| TC-048 | Mobile Safari — Profile | P1 | | | | |
| TC-049 | Mobile Chrome — User List | P2 | | | | |
| TC-050 | Tablet — Full Flow | P2 | | | | |
| TC-051 | Mobile — Error Messages | P2 | | | | |
| TC-052 | Mobile Safari — Logout | P2 | | | | |
| TC-053 | Regression Full Flow | P1 | | | | |
| TC-054 | Admin Full Flow | P1 | | | | |
| TC-055 | User Full Flow | P1 | | | | |
| TC-056 | API Error Status Codes | P1 | | | | |
| TC-057 | Smoke Suite | P1 | | | | |
| TC-058 | H2 BCrypt Hash Check | P1 | | | | |
| TC-059 | H2 created_at Check | P2 | | | | |
| TC-060 | H2 Delete Verified in DB | P1 | | | | |
