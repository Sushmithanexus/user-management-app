# Functional Specification
**Project:** User Management Application
**Version:** 2.0 (Advanced)
**Date:** 2026-02-25

---

## 1. System Overview

The User Management Application is a stateless, JWT-secured full-stack system. The frontend (React SPA) communicates exclusively with the backend (Spring Boot REST API). There is no server-side session — authentication state is maintained entirely via JWT tokens stored in the browser's localStorage.

---

## 2. Authentication Architecture

### 2.1 JWT Flow

```
Browser                    React App               Spring Boot API
   |                           |                         |
   |--[1] Fill login form ---→ |                         |
   |                           |--[2] POST /auth/login →|
   |                           |                         |--[3] Validate credentials
   |                           |                         |--[4] Generate JWT (BCrypt match)
   |                           |←-[5] {token, user} ----|
   |                           |--[6] Store in localStorage
   |--[7] Navigate to /profile→|                         |
   |                           |--[8] GET /users/me -----→
   |                           |      Authorization: Bearer <token>
   |                           |                         |--[9] JwtAuthenticationFilter validates token
   |                           |                         |--[10] SecurityContext populated
   |                           |←-[11] UserDTO ----------|
   |←-[12] Render profile ---- |                         |
```

### 2.2 JWT Configuration
| Setting | Value |
|---------|-------|
| Secret key | `user-management-secret-key-2024` (override with `JWT_SECRET` env var) |
| Token format | `Authorization: Bearer <JWT>` |
| Storage | `localStorage` key: `token` |
| Session type | Stateless (`SessionCreationPolicy.STATELESS`) |
| Filter | `JwtAuthenticationFilter` runs before `UsernamePasswordAuthenticationFilter` |

### 2.3 Password Security
| Rule | Detail |
|------|--------|
| Minimum length | 6 characters (enforced frontend + `@Size` annotation + frontend confirm check) |
| Hashing algorithm | BCrypt (Spring Security `BCryptPasswordEncoder`) |
| Storage | Only BCrypt hash stored in DB — never plaintext |
| Exposure | `password` field is NEVER included in `UserDTO` or any API response |
| Update | Null/blank password in PUT request = no change to existing hash |

### 2.4 Role Assignment Logic
```
PRECONDITION: User submits valid signup
IF userRepository.count() == 0:
    user.setRole("ADMIN")
ELSE:
    user.setRole("USER")

NOTE: Role is set AFTER username/email uniqueness checks.
      User CANNOT self-assign role via signup request.
```

---

## 3. Signup Feature — Detailed Spec

### 3.1 Frontend Validations (before API call)
| Field | Rule | Error Message |
|-------|------|---------------|
| username | Must not be blank | "All fields are required" |
| email | Must not be blank | "All fields are required" |
| password | Must not be blank | "All fields are required" |
| confirmPassword | Must not be blank | "All fields are required" |
| password vs confirmPassword | Must be identical | "Passwords do not match" |
| password | Must be ≥ 6 characters | "Password must be at least 6 characters" |

### 3.2 Backend Validations (`@Valid` on User entity)
| Field | Annotation | Error |
|-------|-----------|-------|
| username | `@NotBlank` + `@Size(min=3, max=50)` | Validation exception → 400 |
| email | `@NotBlank` + `@Email` | Validation exception → 400 |
| password | `@NotBlank` + `@Size(min=6)` | Validation exception → 400 |

### 3.3 Business Rule Checks (UserService)
| Check | Condition | Exception |
|-------|-----------|-----------|
| Unique username | `userRepository.existsByUsername(username)` | `RuntimeException("Username already exists")` → 400 |
| Unique email | `userRepository.existsByEmail(email)` | `RuntimeException("Email already exists")` → 400 |

### 3.4 Signup State Machine
```
[Form Loaded]
     │
     ▼
[User Fills Form]
     │
     ▼
[Frontend Validates] ─── FAIL ──→ [Show inline error, stay on /signup]
     │
    PASS
     │
     ▼
[POST /api/auth/signup] ─── 400 ──→ [Show API error on page]
     │
    201
     │
     ▼
[Alert: "Registration successful!"] ─→ [Redirect to /login]
```

### 3.5 Success Response (201 Created)
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "adminuser",
    "email": "admin@testapp.com",
    "role": "ADMIN",
    "phoneNumber": null,
    "dateOfBirth": null,
    "createdAt": "2026-02-25T10:00:00"
  }
}
```
**Critical:** No `password` field in response.

---

## 4. Login Feature — Detailed Spec

### 4.1 Frontend Validations
| Check | Error |
|-------|-------|
| Both fields blank | "All fields are required" |
| Either field blank | "All fields are required" |

### 4.2 Backend Authentication Flow
```
POST /api/auth/login { username, password }
    │
    ▼
UserService.authenticateUser(username, password)
    │
    ├─ userRepository.findByUsername(username)
    │       └─ Not found → RuntimeException("Invalid username or password") → 401
    │
    ├─ passwordEncoder.matches(rawPassword, storedHash)
    │       └─ No match → RuntimeException("Invalid username or password") → 401
    │
    └─ Match → JwtUtil.generateToken(username) → LoginResponse(token, username, email, role, userId) → 200
```

### 4.3 Login State Machine
```
[Form Loaded] → [User Fills] → [Frontend Validates]
       ─── FAIL ──→ [Show error, stay on /login]
       ─── PASS ──→ [POST /api/auth/login]
                         ─── 401 ──→ [Show error, stay on /login]
                         ─── 200 ──→ [Store token + user in localStorage]
                                   → [Navigate to /profile]
```

---

## 5. Profile Feature — Detailed Spec

### 5.1 GET /api/users/me — View Profile
- Frontend calls this on component mount (`useEffect`)
- Uses JWT token from localStorage
- On success: populates display fields and pre-fills edit form
- On failure (401/network error): clears localStorage and redirects to /login

### 5.2 PUT /api/users/{id} — Update Profile

#### Authorization Matrix
| Who is calling | Target id | Result |
|---------------|-----------|--------|
| USER (id=2) | 2 (own) | 200 — allowed |
| USER (id=2) | 1 (other) | 403 — "You can only update your own profile" |
| ADMIN (id=1) | 1 (own) | 200 — allowed |
| ADMIN (id=1) | 2 (other) | 200 — allowed |

#### Partial Update Behaviour
The backend only updates fields that are non-null in the request:

| Field in request | Null/absent | Non-null | Password specifically |
|-----------------|------------|---------|----------------------|
| username | No change | Updated (uniqueness checked) | N/A |
| email | No change | Updated (uniqueness checked) | N/A |
| password | No change | Re-hashed + updated | Blank string = no change |
| phoneNumber | No change | Updated (empty string clears it) | N/A |
| dateOfBirth | No change | Updated | N/A |

#### Update State Machine
```
[Profile Page] → [User Edits Fields] → [Frontend Validates]
     ─── FAIL ──→ [Show inline error, stay on /profile]
     ─── PASS ──→ [PUT /api/users/{id}]
                       ─── 400 (duplicate) ──→ [Show API error on page]
                       ─── 403 (forbidden)  ──→ [Show API error on page]
                       ─── 200 ──→ [Show "Profile updated successfully!"]
                                 → [Update localStorage user object]
```

---

## 6. User List Feature — Detailed Spec

### 6.1 GET /api/users — View All Users
- Available to all authenticated users (both ADMIN and USER)
- Returns array of `UserDTO` (no passwords)
- Frontend renders as HTML table

### 6.2 Actions Column Rendering Logic (Frontend)
```javascript
// UserList.jsx logic
const canDelete = userIsAdmin || (currentUser && currentUser.userId === user.id);
// Note: This was the OLD logic. After the recent change:
// canDelete = userIsAdmin AND (user.id !== currentUser.userId)
// i.e., Admin can delete others but NOT self; USER cannot delete anyone
```

**Current correct business rule:**
```
showDeleteButton = (currentUser.role === "ADMIN") AND (user.id !== currentUser.userId)
```

---

## 7. Delete Feature — Detailed Spec

### 7.1 DELETE /api/users/{id} — Authorization Decision Tree
```
DELETE /api/users/{id} with Bearer token
          │
          ▼
    currentUser = getUserByUsername(tokenUsername)
          │
          ├─ currentUser.role != "ADMIN"
          │         └─→ 403: "Only admins can delete accounts"
          │
          ├─ currentUser.role == "ADMIN" AND currentUser.id == id
          │         └─→ 403: "Admin cannot delete their own account"
          │
          └─ currentUser.role == "ADMIN" AND currentUser.id != id
                    │
                    ▼
              userService.deleteUser(id)
                    │
                    ├─ User not found → 404: "User not found with id: N"
                    └─ Success → 200: "User deleted successfully"
```

### 7.2 Frontend Delete Flow
```
[Delete button clicked]
        │
        ▼
[window.confirm("Are you sure you want to delete user 'X'?")]
        │
        ├─ Cancel → [No action, dialog dismissed]
        │
        └─ OK → [DELETE /api/users/{id}]
                    │
                    ├─ Success → alert("User deleted successfully") → fetchUsers()
                    └─ Error  → alert(error.response.data.error || "Failed to delete user")
```

---

## 8. Navigation & Route Protection

### 8.1 Navbar Rendering Logic
```javascript
// Navbar.jsx
const authenticated = isAuthenticated();
// isAuthenticated() = localStorage.getItem('token') !== null

if (!authenticated):
    show: [Login, Signup]
else:
    show: [Profile, Users, Logout]
```

### 8.2 Route Guard Logic (App.jsx)
```
/login, /signup  → Public (always accessible)
/profile, /users → Protected: if no token → redirect to /login
/               → if token exists → /profile; else → /login
```

---

## 9. Error Handling Reference

| Scenario | HTTP Status | Response Body | Where Shown |
|----------|------------|---------------|-------------|
| Blank required fields (frontend) | n/a (no API call) | n/a | Inline error div on form |
| Password mismatch (frontend) | n/a | n/a | Inline error div on form |
| Short password (frontend) | n/a | n/a | Inline error div on form |
| Duplicate username | 400 | `{"error": "Username already exists"}` | Inline error div |
| Duplicate email | 400 | `{"error": "Email already exists"}` | Inline error div |
| Invalid email format | 400 | `{"error": "Email should be valid"}` | Inline error div |
| Wrong credentials | 401 | `{"error": "Invalid username or password"}` | Inline error div |
| Missing/invalid JWT | 401 | Spring Security default | Auto-redirect to /login |
| Update another user (USER) | 403 | `{"error": "You can only update your own profile"}` | Inline error div |
| USER attempts delete | 403 | `{"error": "Only admins can delete accounts"}` | alert() |
| Admin deletes self | 403 | `{"error": "Admin cannot delete their own account"}` | alert() |
| User not found | 404 | `{"error": "User not found with id: N"}` | alert() or error div |
| Success — created | 201 | `{"message": "...", "user": UserDTO}` | alert() → redirect |
| Success — updated | 200 | `{"message": "User updated successfully", "user": UserDTO}` | Green success div |
| Success — deleted | 200 | `{"message": "User deleted successfully"}` | alert() → refresh |

---

## 10. Known Constraints & Limitations (v1.0)

| Constraint | Detail | Impact on Testing |
|-----------|--------|------------------|
| H2 in-memory DB | Data lost on backend restart | Must restart + re-create test data each cycle |
| `ddl-auto=create-drop` | Schema dropped on shutdown | No data persistence between sessions |
| No token expiry set | JWT does not expire in test env | Tokens remain valid for full test session |
| No email verification | Signup completes without email confirmation | Any email format that passes `@Email` is accepted |
| No pagination | GET /api/users returns all users | Performance may degrade with large datasets |
| CORS fixed in code | Origins hardcoded: localhost:5173, localhost:3000 | Changing ports requires code change |
