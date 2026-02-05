# 🔄 Simple Request-Response Flow

## 🎯 Basic Flow: Frontend → Backend → Database → Backend → Frontend

```
User → Browser → React → Backend API → Database → Response
```

---

## 1️⃣ SIGNUP (Register New User)

### Simple Flow:
```
1. User fills signup form (username, email, password)
2. Click "Sign Up"
3. React sends to: POST /api/auth/signup
4. Backend checks: username/email already exists?
5. Backend saves to database with encrypted password
6. First user = ADMIN, others = USER
7. Response: "User registered successfully"
8. Redirect to login page
```

### Request:
```javascript
POST http://localhost:8080/api/auth/signup
{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}
```

### Response:
```javascript
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "john",
    "email": "john@example.com",
    "role": "ADMIN"  // First user is ADMIN
  }
}
```

---

## 2️⃣ LOGIN (Get Access Token)

### Simple Flow:
```
1. User enters username & password
2. Click "Login"
3. React sends to: POST /api/auth/login
4. Backend checks password
5. Backend creates JWT token (like a digital key)
6. Response: token + user info
7. React saves token to browser storage
8. Redirect to profile page
```

### Request:
```javascript
POST http://localhost:8080/api/auth/login
{
  "username": "john",
  "password": "password123"
}
```

### Response:
```javascript
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",  // JWT token (digital key)
  "username": "john",
  "email": "john@example.com",
  "role": "ADMIN",
  "userId": 1
}
```

### What happens with token:
```
Token saved in browser → Used for all future requests → Proves "I'm logged in"
```

---

## 3️⃣ VIEW USERS (Protected - Need Login)

### Simple Flow:
```
1. User clicks "Users" menu
2. React sends request with token (proof of login)
3. Backend checks: Is token valid?
4. Backend gets all users from database
5. Response: List of all users
6. React displays table
7. If ADMIN: Show delete buttons
   If USER: Hide delete buttons
```

### Request:
```javascript
GET http://localhost:8080/api/users
Headers: 
  Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...  // Token = proof of login
```

### Response:
```javascript
[
  {
    "id": 1,
    "username": "john",
    "email": "john@example.com",
    "role": "ADMIN"
  },
  {
    "id": 2,
    "username": "jane",
    "email": "jane@example.com",
    "role": "USER"
  }
]
```

---

## 4️⃣ UPDATE PROFILE

### Simple Flow:
```
1. User edits profile (username, email, or password)
2. Click "Update Profile"
3. React sends to: PUT /api/users/{id} with token
4. Backend checks: Is this your own profile?
5. Backend updates database
6. Response: "Updated successfully"
```

### Request:
```javascript
PUT http://localhost:8080/api/users/1
Headers: 
  Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
Body:
{
  "username": "john_updated",
  "email": "newemail@example.com",
  "password": "newpassword123"  // Optional
}
```

### Response:
```javascript
{
  "message": "User updated successfully",
  "user": {
    "id": 1,
    "username": "john_updated",
    "email": "newemail@example.com",
    "role": "ADMIN"
  }
}
```

---

## 5️⃣ DELETE USER (ADMIN Only)

### Simple Flow - ADMIN:
```
1. ADMIN clicks delete button
2. Confirm: "Are you sure?"
3. React sends: DELETE /api/users/{id} with token
4. Backend checks: Is user ADMIN?
5. If YES: Delete user from database
6. Response: "User deleted successfully"
```

### Simple Flow - Regular USER:
```
1. USER doesn't see delete button (hidden in UI)
2. If USER tries via API:
3. Backend checks: Is user ADMIN?
4. If NO: Reject with error
5. Response: "Access Denied - 403 Forbidden"
```

### ADMIN Request (Works ✓):
```javascript
DELETE http://localhost:8080/api/users/5
Headers: 
  Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...  // ADMIN token
```

### Response:
```javascript
{
  "message": "User deleted successfully"
}
```

### USER Request (Fails ✗):
```javascript
DELETE http://localhost:8080/api/users/5
Headers: 
  Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...  // USER token
```

### Response:
```javascript
{
  "status": 403,
  "error": "Forbidden",
  "message": "Access Denied"
}
```

---

## 🔐 How Security Works (Simple)

### 1. JWT Token = Digital Key
```
Login → Get Token → Token = Proof of Identity
Use Token for all requests → Backend verifies token → Access granted
```

### 2. Token Contains:
```
- Who you are (username)
- What role you have (ADMIN or USER)
- Expiration time (24 hours)
```

### 3. Every Request:
```
Frontend sends:  Request + Token
Backend checks:  Is token valid? → YES or NO
If YES:         Process request
If NO:          Reject (401 Unauthorized)
```

### 4. Role Check (for Delete):
```
Backend checks:  What role in token?
If ADMIN:       Allow delete
If USER:        Reject (403 Forbidden)
```

---

## 📊 Complete Flow Diagram (Simplified)

### Any Request Flow:
```
┌─────────────────────────────────────────────────────────┐
│  1. User Action (Click button, fill form, etc.)        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  2. React Component (Button click handler)              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  3. API Service (Axios - sends HTTP request)            │
│     - Adds token if logged in                           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  4. Backend (Spring Boot)                               │
│     - Check token valid?                                │
│     - Check user has permission?                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  5. Database (H2)                                       │
│     - Read or write data                                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  6. Response sent back                                  │
│     - Success: Data or message                          │
│     - Error: Error message                              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  7. React Updates UI                                    │
│     - Show data or error message                        │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Points to Remember

### 1. Protected vs Unprotected:
```
Unprotected (No token needed):
  ✓ Signup
  ✓ Login

Protected (Token required):
  ✓ View users
  ✓ Update profile
  ✓ Delete user (ADMIN only)
```

### 2. Roles:
```
ADMIN:
  ✓ Can do everything
  ✓ Can delete users
  
USER:
  ✓ Can view users
  ✓ Can update own profile
  ✗ Cannot delete users
```

### 3. Security Layers:
```
Layer 1: Frontend hides buttons for regular users
Layer 2: Backend checks token on every request
Layer 3: Backend checks role for admin operations
```

### 4. Token Lifecycle:
```
Login → Get Token → Save in Browser → 
Use for 24 hours → Expires → Login again
```

---

## 🔄 Example: Complete User Journey

```
1. Register:
   User → Signup Form → Backend → Database
   "User registered successfully"

2. Login:
   User → Login Form → Backend → Get Token
   Save token in browser

3. View Profile:
   User → Click Profile → Send token → Backend checks token
   Backend gets user data → Show profile

4. View Users:
   User → Click Users → Send token → Backend checks token
   Backend gets all users → Show table
   If ADMIN: Show delete buttons
   If USER: Hide delete buttons

5. Update Profile:
   User → Edit form → Click Update → Send token
   Backend checks: Is this your profile?
   Update database → "Updated successfully"

6. Delete User (ADMIN only):
   ADMIN → Click delete → Confirm → Send token
   Backend checks: Is user ADMIN?
   Delete from database → "Deleted successfully"

7. Logout:
   User → Click Logout → Remove token from browser
   Redirect to login page
```

---

## 🎨 Visual Summary

```
┌──────────────────┐
│   BROWSER/UI     │
└────────┬─────────┘
         │ HTTP Request + Token
         ▼
┌──────────────────┐
│  SPRING BOOT     │  ← Check Token
│  (Backend API)   │  ← Check Role (if needed)
└────────┬─────────┘
         │ SQL Query
         ▼
┌──────────────────┐
│   H2 DATABASE    │  ← Store/Get Data
└────────┬─────────┘
         │ Return Data
         ▼
┌──────────────────┐
│  RESPONSE (JSON) │  → Back to Browser
└──────────────────┘
```

---

## ✅ That's It!

**Simple Rule**: 
- Every request goes: Frontend → Backend → Database → Backend → Frontend
- Token = Your ID card (proves who you are)
- Role = Your permission level (USER or ADMIN)

