# 🔄 Request & Response Flow Documentation

## Table of Contents
1. [User Registration Flow](#1-user-registration-signup-flow)
2. [User Login Flow](#2-user-login-authentication-flow)
3. [View All Users Flow](#3-view-all-users-flow)
4. [Update Profile Flow](#4-update-profile-flow)
5. [Delete User Flow (Admin Only)](#5-delete-user-flow-admin-only)
6. [JWT Token Validation Flow](#6-jwt-token-validation-flow)
7. [Error Handling Flow](#7-error-handling-flow)

---

## 1. User Registration (Signup) Flow

### 📝 Step-by-Step Flow

```
┌─────────────┐         ┌──────────────┐         ┌────────────────┐
│   Browser   │         │   Frontend   │         │    Backend     │
│  (User UI)  │         │  (React App) │         │  (Spring Boot) │
└──────┬──────┘         └──────┬───────┘         └────────┬───────┘
       │                       │                          │
       │ 1. Click Signup       │                          │
       │───────────────────────>                          │
       │                       │                          │
       │ 2. Fill Form          │                          │
       │   (username, email,   │                          │
       │    password)          │                          │
       │───────────────────────>                          │
       │                       │                          │
       │ 3. Click Submit       │                          │
       │───────────────────────>                          │
       │                       │                          │
       │                  4. Validate Form                │
       │                  (client-side)                   │
       │                       │                          │
       │              5. POST /api/auth/signup            │
       │              Request Body:                       │
       │              {                                   │
       │                "username": "john",               │
       │                "email": "john@example.com",      │
       │                "password": "password123"         │
       │              }                                   │
       │                       │──────────────────────────>
       │                       │                          │
       │                       │        6. SecurityFilterChain
       │                       │           (No Auth Required)
       │                       │                          │
       │                       │        7. UserController.signup()
       │                       │           @PostMapping("/auth/signup")
       │                       │                          │
       │                       │        8. Validate Input
       │                       │           @Valid annotations
       │                       │                          │
       │                       │        9. UserService.registerUser()
       │                       │           - Check username exists?
       │                       │           - Check email exists?
       │                       │           - Check user count
       │                       │           - If count = 0: role = ADMIN
       │                       │           - Else: role = USER
       │                       │                          │
       │                       │        10. Encode Password
       │                       │            BCrypt.encode(password)
       │                       │                          │
       │                       │        11. Save to Database
       │                       │            UserRepository.save()
       │                       │                          │
       │                       │        12. H2 Database
       │                       │            INSERT INTO users
       │                       │            (username, email, password,
       │                       │             role, created_at)
       │                       │                          │
       │              13. Response (201 Created)          │
       │              {                                   │
       │                "message": "User registered...",  │
       │                "user": {                         │
       │                  "id": 1,                        │
       │                  "username": "john",             │
       │                  "email": "john@example.com",    │
       │                  "role": "ADMIN",                │
       │                  "createdAt": "2026-02-03..."    │
       │                }                                 │
       │              }                                   │
       │                       <──────────────────────────│
       │                       │                          │
       │ 14. Show Success      │                          │
       │     Alert & Redirect  │                          │
       │     to Login          │                          │
       <───────────────────────│                          │
       │                       │                          │
```

### 🔍 Detailed Breakdown

**Frontend (Signup.jsx)**
```javascript
1. User fills form
2. Client-side validation:
   - All fields required
   - Email format check
   - Password length ≥ 6
   - Password match confirmation
3. Axios POST request to /api/auth/signup
4. On success: alert + redirect to login
5. On error: display error message
```

**Backend Flow**
```java
UserController.signup()
    ↓
@Valid User validation (Jakarta Validation)
    ↓
UserService.registerUser()
    ↓
Check username exists (UserRepository.existsByUsername)
    ↓
Check email exists (UserRepository.existsByEmail)
    ↓
Check user count (userRepository.count())
    ↓
If count == 0 → role = "ADMIN"
If count > 0  → role = "USER"
    ↓
BCryptPasswordEncoder.encode(password)
    ↓
UserRepository.save(user)
    ↓
H2 Database INSERT
    ↓
Return UserDTO (without password)
```

---

## 2. User Login (Authentication) Flow

### 📝 Step-by-Step Flow

```
┌─────────────┐         ┌──────────────┐         ┌────────────────┐
│   Browser   │         │   Frontend   │         │    Backend     │
└──────┬──────┘         └──────┬───────┘         └────────┬───────┘
       │                       │                          │
       │ 1. Click Login        │                          │
       │───────────────────────>                          │
       │                       │                          │
       │ 2. Enter Credentials  │                          │
       │    (username, pass)   │                          │
       │───────────────────────>                          │
       │                       │                          │
       │              3. POST /api/auth/login             │
       │              Request Body:                       │
       │              {                                   │
       │                "username": "john",               │
       │                "password": "password123"         │
       │              }                                   │
       │                       │──────────────────────────>
       │                       │                          │
       │                       │     4. UserController.login()
       │                       │                          │
       │                       │     5. UserService.authenticateUser()
       │                       │        - Find user by username
       │                       │        - Compare passwords
       │                       │          BCrypt.matches(raw, hashed)
       │                       │                          │
       │                       │     6. JwtUtil.generateToken()
       │                       │        - Create JWT with username
       │                       │        - Sign with secret key
       │                       │        - Set expiration (24h)
       │                       │                          │
       │              7. Response (200 OK)                │
       │              {                                   │
       │                "token": "eyJhbGciOi...",         │
       │                "username": "john",               │
       │                "email": "john@example.com",      │
       │                "role": "ADMIN",                  │
       │                "userId": 1                       │
       │              }                                   │
       │                       <──────────────────────────│
       │                       │                          │
       │ 8. Store in localStorage                         │
       │    - token                                       │
       │    - user: {userId, username, email, role}       │
       │                       │                          │
       │ 9. Redirect to Profile                           │
       <───────────────────────│                          │
       │                       │                          │
```

### 🔑 JWT Token Structure

```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "sub": "john",              // Username
  "iat": 1738562267,          // Issued at
  "exp": 1738648667           // Expires at (24h later)
}

Signature:
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret_key
)
```

---

## 3. View All Users Flow

### 📝 Step-by-Step Flow

```
┌─────────────┐         ┌──────────────┐         ┌────────────────┐
│   Browser   │         │   Frontend   │         │    Backend     │
└──────┬──────┘         └──────┬───────┘         └────────┬───────┘
       │                       │                          │
       │ 1. Click "Users"      │                          │
       │───────────────────────>                          │
       │                       │                          │
       │              2. GET /api/users                   │
       │              Headers:                            │
       │              Authorization: Bearer eyJhbGc...    │
       │                       │──────────────────────────>
       │                       │                          │
       │                       │     3. JwtAuthenticationFilter
       │                       │        - Extract token from header
       │                       │        - Validate token
       │                       │        - Extract username
       │                       │                          │
       │                       │     4. UserDetailsService.loadUserByUsername()
       │                       │        - Load user from database
       │                       │        - Load authorities (roles)
       │                       │                          │
       │                       │     5. Set Authentication Context
       │                       │        SecurityContextHolder.setAuthentication()
       │                       │                          │
       │                       │     6. SecurityFilterChain
       │                       │        - Check /api/users/** requires auth ✓
       │                       │                          │
       │                       │     7. UserController.getAllUsers()
       │                       │        @GetMapping("/users")
       │                       │                          │
       │                       │     8. UserService.getAllUsers()
       │                       │        - Query database
       │                       │        - Convert to DTOs
       │                       │                          │
       │              9. Response (200 OK)                │
       │              [                                   │
       │                {                                 │
       │                  "id": 1,                        │
       │                  "username": "john",             │
       │                  "email": "john@example.com",    │
       │                  "role": "ADMIN",                │
       │                  "createdAt": "2026-02-03..."    │
       │                },                                │
       │                { ... }                           │
       │              ]                                   │
       │                       <──────────────────────────│
       │                       │                          │
       │ 10. Check isAdmin()   │                          │
       │     from localStorage │                          │
       │                       │                          │
       │ 11. Render Table      │                          │
       │     - Show all users  │                          │
       │     - If admin: show delete buttons              │
       │     - If user: hide delete buttons               │
       <───────────────────────│                          │
       │                       │                          │
```

### 🔐 Security Flow Detail

```
Request with JWT Token
    ↓
JwtAuthenticationFilter.doFilterInternal()
    ↓
Extract "Authorization" header
    ↓
Get token (remove "Bearer " prefix)
    ↓
JwtUtil.extractUsername(token)
    ↓
UserDetailsService.loadUserByUsername(username)
    ↓
JwtUtil.validateToken(token, username)
    ↓
Create UsernamePasswordAuthenticationToken
    ↓
Set in SecurityContextHolder
    ↓
Continue filter chain
    ↓
Controller method executed with authenticated user
```

---

## 4. Update Profile Flow

### 📝 Step-by-Step Flow

```
┌─────────────┐         ┌──────────────┐         ┌────────────────┐
│   Browser   │         │   Frontend   │         │    Backend     │
└──────┬──────┘         └──────┬───────┘         └────────┬───────┘
       │                       │                          │
       │ 1. Navigate to Profile│                          │
       │───────────────────────>                          │
       │                       │                          │
       │              2. GET /api/users/me                │
       │              Headers: Authorization: Bearer ...  │
       │                       │──────────────────────────>
       │                       │                          │
       │                       │     3. JWT Validation    │
       │                       │     4. Get current user  │
       │                       │                          │
       │              5. Response (200 OK)                │
       │              {                                   │
       │                "id": 1,                          │
       │                "username": "john",               │
       │                "email": "john@example.com",      │
       │                "role": "ADMIN",                  │
       │                "createdAt": "..."                │
       │              }                                   │
       │                       <──────────────────────────│
       │                       │                          │
       │ 6. Display Profile    │                          │
       │    Pre-fill form      │                          │
       <───────────────────────│                          │
       │                       │                          │
       │ 7. User edits fields  │                          │
       │    (username, email,  │                          │
       │     new password)     │                          │
       │───────────────────────>                          │
       │                       │                          │
       │ 8. Click Update       │                          │
       │───────────────────────>                          │
       │                       │                          │
       │              9. PUT /api/users/{id}              │
       │              Headers: Authorization: Bearer ...  │
       │              Request Body:                       │
       │              {                                   │
       │                "username": "john_updated",       │
       │                "email": "new@example.com",       │
       │                "password": "newpass123"          │
       │              }                                   │
       │                       │──────────────────────────>
       │                       │                          │
       │                       │     10. JWT Validation   │
       │                       │     11. Get current user │
       │                       │     12. Check authorization
       │                       │         - User can only update self
       │                       │         - Compare IDs    │
       │                       │                          │
       │                       │     13. UserService.updateUser()
       │                       │         - Check new username unique
       │                       │         - Check new email unique
       │                       │         - Encode new password
       │                       │         - Update database
       │                       │                          │
       │              14. Response (200 OK)               │
       │              {                                   │
       │                "message": "User updated...",     │
       │                "user": { ... }                   │
       │              }                                   │
       │                       <──────────────────────────│
       │                       │                          │
       │ 15. Update localStorage                          │
       │     Show success message                         │
       <───────────────────────│                          │
       │                       │                          │
```

---

## 5. Delete User Flow (Admin Only)

### 📝 Step-by-Step Flow

```
┌─────────────┐         ┌──────────────┐         ┌────────────────┐
│   Browser   │         │   Frontend   │         │    Backend     │
│  (Admin UI) │         │  (React App) │         │  (Spring Boot) │
└──────┬──────┘         └──────┬───────┘         └────────┬───────┘
       │                       │                          │
       │ 1. Navigate to Users  │                          │
       │    Check isAdmin()    │                          │
       │───────────────────────>                          │
       │                       │                          │
       │ 2. Admin sees         │                          │
       │    DELETE buttons     │                          │
       │    (Regular user doesn't)                        │
       │                       │                          │
       │ 3. Click Delete       │                          │
       │    on user (ID: 5)    │                          │
       │───────────────────────>                          │
       │                       │                          │
       │ 4. Confirm Dialog     │                          │
       │    "Are you sure?"    │                          │
       <───────────────────────│                          │
       │                       │                          │
       │ 5. Click OK           │                          │
       │───────────────────────>                          │
       │                       │                          │
       │              6. DELETE /api/users/5              │
       │              Headers: Authorization: Bearer ...  │
       │                       │──────────────────────────>
       │                       │                          │
       │                       │     7. JwtAuthenticationFilter
       │                       │        - Extract & validate token
       │                       │        - Load user & roles
       │                       │                          │
       │                       │     8. SecurityFilterChain
       │                       │        - Requires authentication ✓
       │                       │                          │
       │                       │     9. @PreAuthorize("hasRole('ADMIN')")
       │                       │        - Check user has ADMIN role
       │                       │        - If USER → 403 Forbidden ✗
       │                       │        - If ADMIN → Continue ✓
       │                       │                          │
       │                       │     10. UserController.deleteUser(5)
       │                       │         @DeleteMapping("/users/{id}")
       │                       │                          │
       │                       │     11. UserService.deleteUser(5)
       │                       │         - Find user by ID
       │                       │         - Delete from database
       │                       │                          │
       │              12. Response (200 OK)               │
       │              {                                   │
       │                "message": "User deleted..."      │
       │              }                                   │
       │                       <──────────────────────────│
       │                       │                          │
       │ 13. Show success alert                           │
       │     Refresh user list │                          │
       <───────────────────────│                          │
       │                       │                          │
```

### 🚫 What if Regular USER tries to delete?

```
Regular USER clicks Delete (via API directly)
    ↓
Frontend: isAdmin() = false → Button hidden
    ↓
If user bypasses frontend:
    ↓
DELETE /api/users/5 with USER token
    ↓
JwtAuthenticationFilter validates token ✓
    ↓
SecurityFilterChain: authenticated ✓
    ↓
@PreAuthorize("hasRole('ADMIN')") checks role
    ↓
Role = "USER" → NOT "ADMIN"
    ↓
Spring Security denies access
    ↓
Return 403 Forbidden
    ↓
{
  "timestamp": "2026-02-03...",
  "status": 403,
  "error": "Forbidden",
  "message": "Access Denied"
}
```

---

## 6. JWT Token Validation Flow

### 📝 Every Protected Request Flow

```
┌──────────────────────────────────────────────────┐
│  Request to Protected Endpoint                   │
│  GET/POST/PUT/DELETE /api/users/**               │
│  Header: Authorization: Bearer eyJhbGc...        │
└───────────────────┬──────────────────────────────┘
                    │
                    ▼
    ┌───────────────────────────────────┐
    │  JwtAuthenticationFilter          │
    │  (OncePerRequestFilter)           │
    └───────────────┬───────────────────┘
                    │
                    ▼
    ┌───────────────────────────────────┐
    │  1. Extract Authorization Header  │
    └───────────────┬───────────────────┘
                    │
                    ▼
    ┌───────────────────────────────────┐
    │  2. Check format:                 │
    │     Starts with "Bearer "?        │
    └───────────────┬───────────────────┘
                    │
            ┌───────┴───────┐
            │               │
           YES             NO
            │               │
            │               ▼
            │      ┌────────────────┐
            │      │  Continue      │
            │      │  without auth  │
            │      └────────────────┘
            │
            ▼
    ┌───────────────────────────────────┐
    │  3. Extract token (remove Bearer) │
    └───────────────┬───────────────────┘
                    │
                    ▼
    ┌───────────────────────────────────┐
    │  4. JwtUtil.extractUsername()     │
    │     - Parse JWT                   │
    │     - Get subject (username)      │
    └───────────────┬───────────────────┘
                    │
            ┌───────┴───────┐
            │               │
        SUCCESS         FAILURE
            │               │
            │               ▼
            │      ┌────────────────┐
            │      │  Invalid token │
            │      │  Continue      │
            │      └────────────────┘
            │
            ▼
    ┌───────────────────────────────────┐
    │  5. Check if already authenticated│
    │     SecurityContext has auth?     │
    └───────────────┬───────────────────┘
                    │
            ┌───────┴───────┐
            │               │
           NO              YES
            │               │
            │               ▼
            │      ┌────────────────┐
            │      │  Already auth  │
            │      │  Continue      │
            │      └────────────────┘
            │
            ▼
    ┌───────────────────────────────────┐
    │  6. Load UserDetails              │
    │     UserDetailsService            │
    │     .loadUserByUsername()         │
    └───────────────┬───────────────────┘
                    │
                    ▼
    ┌───────────────────────────────────┐
    │  7. Validate Token                │
    │     JwtUtil.validateToken()       │
    │     - Check expiration            │
    │     - Verify signature            │
    │     - Match username              │
    └───────────────┬───────────────────┘
                    │
            ┌───────┴───────┐
            │               │
         VALID          INVALID
            │               │
            │               ▼
            │      ┌────────────────┐
            │      │  Token invalid │
            │      │  Continue      │
            │      │  (no auth)     │
            │      └────────────────┘
            │
            ▼
    ┌───────────────────────────────────┐
    │  8. Create Authentication         │
    │     UsernamePasswordAuth...Token  │
    │     - principal: UserDetails      │
    │     - credentials: null           │
    │     - authorities: [ROLE_ADMIN]   │
    └───────────────┬───────────────────┘
                    │
                    ▼
    ┌───────────────────────────────────┐
    │  9. Set in Security Context       │
    │     SecurityContextHolder         │
    │     .setAuthentication()          │
    └───────────────┬───────────────────┘
                    │
                    ▼
    ┌───────────────────────────────────┐
    │  10. Continue Filter Chain        │
    │      filterChain.doFilter()       │
    └───────────────┬───────────────────┘
                    │
                    ▼
    ┌───────────────────────────────────┐
    │  11. SecurityFilterChain          │
    │      Check authorization rules    │
    │      - /api/auth/** → permitAll   │
    │      - /api/users/** → authenticated │
    └───────────────┬───────────────────┘
                    │
            ┌───────┴───────┐
            │               │
      AUTHORIZED      UNAUTHORIZED
            │               │
            │               ▼
            │      ┌────────────────┐
            │      │  Return 401    │
            │      │  Unauthorized  │
            │      └────────────────┘
            │
            ▼
    ┌───────────────────────────────────┐
    │  12. Method Security Check        │
    │      @PreAuthorize if present     │
    │      Example: hasRole('ADMIN')    │
    └───────────────┬───────────────────┘
                    │
            ┌───────┴───────┐
            │               │
      HAS ROLE         NO ROLE
            │               │
            │               ▼
            │      ┌────────────────┐
            │      │  Return 403    │
            │      │  Forbidden     │
            │      └────────────────┘
            │
            ▼
    ┌───────────────────────────────────┐
    │  13. Execute Controller Method    │
    │      Process request              │
    │      Return response              │
    └───────────────────────────────────┘
```

---

## 7. Error Handling Flow

### 📝 Common Error Scenarios

#### Scenario A: Invalid Login Credentials

```
Frontend: POST /api/auth/login
    ↓
Backend: UserService.authenticateUser()
    ↓
Find user by username
    ↓
User NOT found OR password mismatch
    ↓
throw new RuntimeException("Invalid username or password")
    ↓
UserController catch block
    ↓
Response 401 Unauthorized
{
  "error": "Invalid username or password"
}
    ↓
Frontend: Display error message
```

#### Scenario B: Expired JWT Token

```
Frontend: GET /api/users (with old token)
    ↓
JwtAuthenticationFilter
    ↓
Extract & parse token
    ↓
JwtUtil.isTokenExpired() → true
    ↓
Token validation fails
    ↓
Continue without authentication
    ↓
SecurityFilterChain
    ↓
Endpoint requires authentication
    ↓
Response 401 Unauthorized
    ↓
Axios interceptor catches 401
    ↓
Clear localStorage
    ↓
Redirect to /login
```

#### Scenario C: Non-Admin Tries to Delete

```
Frontend: DELETE /api/users/5 (USER token)
    ↓
JwtAuthenticationFilter
    ↓
Token valid, role = USER
    ↓
Set authentication with authorities: [ROLE_USER]
    ↓
@PreAuthorize("hasRole('ADMIN')")
    ↓
Check authorities: ROLE_USER ≠ ROLE_ADMIN
    ↓
Access Denied
    ↓
Response 403 Forbidden
{
  "status": 403,
  "error": "Forbidden",
  "message": "Access Denied"
}
    ↓
Frontend: Display error alert
```

#### Scenario D: Validation Error

```
Frontend: POST /api/auth/signup
Body: {
  "username": "ab",      // Too short
  "email": "invalid",    // Invalid format
  "password": "123"      // Too short
}
    ↓
Backend: @Valid User validation
    ↓
Validation fails:
- Username: min 3 characters
- Email: invalid format
- Password: min 6 characters
    ↓
MethodArgumentNotValidException
    ↓
Response 400 Bad Request
{
  "errors": {
    "username": "Username must be between 3 and 50 characters",
    "email": "Email should be valid",
    "password": "Password must be at least 6 characters"
  }
}
    ↓
Frontend: Display validation errors
```

---

## 📊 Complete Request Lifecycle

### Every Request Goes Through:

```
1. Browser (User Action)
   ↓
2. React Component (Event Handler)
   ↓
3. API Service (Axios)
   ↓
4. HTTP Request with Headers
   ↓
5. Spring Boot Server (Tomcat)
   ↓
6. JwtAuthenticationFilter (if auth required)
   ↓
7. SecurityFilterChain (authorization)
   ↓
8. Method Security (@PreAuthorize if present)
   ↓
9. Controller Method (endpoint)
   ↓
10. Service Layer (business logic)
   ↓
11. Repository Layer (data access)
   ↓
12. Database (H2)
   ↓
13. Repository returns data
   ↓
14. Service processes & returns DTO
   ↓
15. Controller returns ResponseEntity
   ↓
16. Spring converts to JSON
   ↓
17. HTTP Response
   ↓
18. Axios receives response
   ↓
19. React Component updates state
   ↓
20. Browser renders UI
```

---

## 🔐 Security Layers

```
┌─────────────────────────────────────────┐
│  Layer 1: Frontend Validation           │
│  - Form validation                      │
│  - Role-based UI (hide buttons)         │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Layer 2: CORS (Cross-Origin)           │
│  - Only allow localhost:5173            │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Layer 3: JWT Authentication            │
│  - Token validation                     │
│  - User identification                  │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Layer 4: Spring Security Filter        │
│  - Path-based authorization             │
│  - Authentication requirement           │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Layer 5: Method Security                │
│  - @PreAuthorize role checks            │
│  - hasRole('ADMIN')                     │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Layer 6: Business Logic                │
│  - Additional validation                │
│  - Authorization checks                 │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  Layer 7: Database Constraints          │
│  - Unique constraints                   │
│  - NOT NULL constraints                 │
└─────────────────────────────────────────┘
```

---

## 📈 Performance Optimizations

1. **JWT Tokens**: Stateless authentication (no DB lookup on every request)
2. **Connection Pooling**: HikariCP for efficient DB connections
3. **DTO Pattern**: Only transfer necessary data
4. **Lazy Loading**: Load data only when needed
5. **React Optimization**: Component-based rendering

---

## 🎯 Summary

This application follows a **modern, secure, layered architecture** with:

- ✅ Clear separation of concerns
- ✅ Multiple security layers
- ✅ Proper error handling
- ✅ Efficient data flow
- ✅ JWT-based stateless authentication
- ✅ Role-based access control

**Every request is validated, authenticated, and authorized before reaching business logic!**

