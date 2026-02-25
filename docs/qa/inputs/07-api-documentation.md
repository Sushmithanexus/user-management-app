# API Documentation
**Project:** User Management Application
**Version:** 2.0 (Advanced)
**Base URL:** `http://localhost:8080/api`
**Content-Type:** `application/json` (all requests and responses)
**Authentication:** `Authorization: Bearer <JWT_TOKEN>` (all protected endpoints)

---

## Global Headers

### Request Headers (Protected Endpoints)
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

### Response Headers (all responses)
```
Content-Type: application/json
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN   (H2 console frames allowed within same origin)
```

### CORS Policy
| Setting | Value |
|---------|-------|
| Allowed Origins | `http://localhost:5173`, `http://localhost:3000` |
| Allowed Methods | GET, POST, PUT, DELETE, OPTIONS |
| Allowed Headers | `*` (all) |
| Allow Credentials | `true` |

---

## Public Endpoints (No Token Required)

---

### POST /api/auth/signup

**Description:** Register a new user. No authentication required.

**Request:**
```
POST http://localhost:8080/api/auth/signup
Content-Type: application/json
```
```json
{
  "username": "adminuser",       // required | string | 3–50 chars | unique
  "email": "admin@testapp.com",  // required | string | valid email | unique
  "password": "Admin@123",       // required | string | min 6 chars
  "phoneNumber": "9876543210",   // optional | string | free text
  "dateOfBirth": "1990-01-15"    // optional | string | free text (no format enforced)
}
```

**Responses:**

`201 Created` — User registered successfully
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "adminuser",
    "email": "admin@testapp.com",
    "role": "ADMIN",
    "phoneNumber": "9876543210",
    "dateOfBirth": "1990-01-15",
    "createdAt": "2026-02-25T10:00:00.000000"
  }
}
```
> ⚠️ **Note:** `role` is auto-assigned — `"ADMIN"` if first user, `"USER"` otherwise. Never trust client-provided role.

`400 Bad Request` — Validation failure or duplicate
```json
{ "error": "Username already exists" }
{ "error": "Email already exists" }
{ "error": "Username is required" }
{ "error": "Username must be between 3 and 50 characters" }
{ "error": "Email should be valid" }
{ "error": "Password is required" }
{ "error": "Password must be at least 6 characters" }
```

**Test cases:** TC-001 to TC-008, TC-039, TC-040, TC-042, TC-045

---

### POST /api/auth/login

**Description:** Authenticate and receive a JWT token.

**Request:**
```
POST http://localhost:8080/api/auth/login
Content-Type: application/json
```
```json
{
  "username": "adminuser",  // required | string
  "password": "Admin@123"   // required | string
}
```

**Responses:**

`200 OK` — Authentication successful
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbnVzZXIiLCJpYXQiOjE3...",
  "username": "adminuser",
  "email": "admin@testapp.com",
  "role": "ADMIN",
  "userId": 1
}
```
> ⚠️ **Note:** No `password` field in response. Frontend must store `token` and `user` object separately.

`401 Unauthorized` — Invalid credentials
```json
{ "error": "Invalid username or password" }
```

**Test cases:** TC-009 to TC-012, TC-044

---

## Protected Endpoints (Bearer Token Required)

> All endpoints below require: `Authorization: Bearer <JWT_TOKEN>`
> Missing or invalid token → `401 Unauthorized`

---

### GET /api/users

**Description:** Retrieve all registered users. Available to any authenticated user.

**Request:**
```
GET http://localhost:8080/api/users
Authorization: Bearer <token>
```

**Responses:**

`200 OK`
```json
[
  {
    "id": 1,
    "username": "adminuser",
    "email": "admin@testapp.com",
    "role": "ADMIN",
    "phoneNumber": "9876543210",
    "dateOfBirth": "1990-01-15",
    "createdAt": "2026-02-25T10:00:00.000000"
  },
  {
    "id": 2,
    "username": "regularuser",
    "email": "user@testapp.com",
    "role": "USER",
    "phoneNumber": null,
    "dateOfBirth": null,
    "createdAt": "2026-02-25T10:05:00.000000"
  }
]
```
> Empty array `[]` if no users (should not happen post-signup).

`401 Unauthorized` — No or invalid token (no body from Spring Security).

**Test cases:** TC-025, TC-026, TC-034, TC-035

---

### GET /api/users/me

**Description:** Retrieve the currently authenticated user's profile.

**Request:**
```
GET http://localhost:8080/api/users/me
Authorization: Bearer <token>
```

**Responses:**

`200 OK` — Single `UserDTO` object (same shape as above)

`401 Unauthorized` — No/invalid token

`404 Not Found` — Token valid but user was deleted from DB
```json
{ "error": "User not found with username: adminuser" }
```

**Test cases:** TC-015, TC-035, TC-043

---

### GET /api/users/{id}

**Description:** Retrieve a specific user by numeric ID.

**Path Parameter:** `id` — Long (positive integer)

**Request:**
```
GET http://localhost:8080/api/users/1
Authorization: Bearer <token>
```

**Responses:**

`200 OK` — UserDTO object

`401 Unauthorized` — No/invalid token

`404 Not Found`
```json
{ "error": "User not found with id: 999" }
```

**Test cases:** TC-035, TC-043

---

### PUT /api/users/{id}

**Description:** Update a user's profile. ADMIN can update any user. Regular USER can only update own profile.

**Path Parameter:** `id` — Long (target user's ID)

**Authorization:**
| Caller Role | Target id | Result |
|-------------|-----------|--------|
| USER | Own id | 200 |
| USER | Other id | 403 |
| ADMIN | Any id | 200 |

**Request:**
```
PUT http://localhost:8080/api/users/2
Authorization: Bearer <token>
Content-Type: application/json
```
```json
{
  "username": "newusername",       // optional — omit to keep current
  "email": "newemail@test.com",    // optional — omit to keep current
  "password": "NewPass@456",       // optional — omit to keep current password
  "phoneNumber": "1234567890",     // optional — omit to keep current
  "dateOfBirth": "1992-03-20"      // optional — omit to keep current
}
```
> **Partial update:** Only non-null fields are updated. Sending `{"phoneNumber": "1234567890"}` only changes the phone.

**Responses:**

`200 OK` — Update successful
```json
{
  "message": "User updated successfully",
  "user": {
    "id": 2,
    "username": "newusername",
    "email": "newemail@test.com",
    "role": "USER",
    "phoneNumber": "1234567890",
    "dateOfBirth": "1992-03-20",
    "createdAt": "2026-02-25T10:05:00.000000"
  }
}
```

`400 Bad Request` — Duplicate username or email
```json
{ "error": "Username already exists" }
{ "error": "Email already exists" }
```

`403 Forbidden` — Authorization failure
```json
{ "error": "You can only update your own profile" }
```

`401 Unauthorized` — No/invalid token

**Test cases:** TC-016 to TC-024, TC-035, TC-041

---

### DELETE /api/users/{id}

**Description:** Delete a user by ID. Only ADMIN can delete. ADMIN cannot delete own account.

**Path Parameter:** `id` — Long (target user's ID)

**Authorization Decision Tree:**
```
ADMIN token + id != self → 200 DELETE
ADMIN token + id == self → 403 "Admin cannot delete their own account"
USER token + any id     → 403 "Only admins can delete accounts"
No token                → 401
Non-existent id         → 404
```

**Request:**
```
DELETE http://localhost:8080/api/users/2
Authorization: Bearer <ADMIN_token>
```

**Responses:**

`200 OK`
```json
{ "message": "User deleted successfully" }
```

`403 Forbidden`
```json
{ "error": "Only admins can delete accounts" }
{ "error": "Admin cannot delete their own account" }
```

`404 Not Found`
```json
{ "error": "User not found with id: 999" }
```

`401 Unauthorized` — No/invalid token

**Test cases:** TC-028 to TC-035

---

## API Endpoint Summary

| Method | Endpoint | Auth | Role | Success | Error |
|--------|----------|------|------|---------|-------|
| POST | `/api/auth/signup` | No | Any | 201 | 400 |
| POST | `/api/auth/login` | No | Any | 200 | 401 |
| GET | `/api/users` | Yes | Any | 200 | 401 |
| GET | `/api/users/me` | Yes | Any | 200 | 401, 404 |
| GET | `/api/users/{id}` | Yes | Any | 200 | 401, 404 |
| PUT | `/api/users/{id}` | Yes | Own(USER)/Any(ADMIN) | 200 | 400, 401, 403 |
| DELETE | `/api/users/{id}` | Yes | ADMIN only (not self) | 200 | 401, 403, 404 |

---

## Postman / curl Quick Reference

### Get Admin Token
```bash
ADMIN_TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"adminuser","password":"Admin@123"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")
echo $ADMIN_TOKEN
```

### Create User
```bash
curl -s -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@testapp.com","password":"Test@123"}' \
  | python3 -m json.tool
```

### Get All Users (Authenticated)
```bash
curl -s http://localhost:8080/api/users \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  | python3 -m json.tool
```

### Update User Phone Only
```bash
curl -s -X PUT http://localhost:8080/api/users/2 \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"9990001111"}' \
  | python3 -m json.tool
```

### Delete User
```bash
curl -s -X DELETE http://localhost:8080/api/users/2 \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  | python3 -m json.tool
```

### Verify No Token → 401
```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080/api/users
# Expected: 401
```

---

## H2 Console Access (Dev/Test Only)
```
URL:      http://localhost:8080/h2-console
JDBC URL: jdbc:h2:mem:usermanagementdb
Username: sa
Password: (blank)
```
> ⚠️ The H2 console must be **disabled** in any non-local environment (NFR-S-07).
