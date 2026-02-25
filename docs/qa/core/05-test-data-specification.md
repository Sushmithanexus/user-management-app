# Test Data Specification
**Project:** User Management Application
**Version:** 2.0 (Advanced)
**Date:** 2026-02-25

> **Critical rule:** Register test users in the EXACT order below. User #1 must be first to get ADMIN role. Always restart backend before a new test cycle to reset the H2 DB.

---

## 1. Standard Test Users — Create in This Order

| Order | Username | Email | Password | Role (auto) | Phone | DOB | Used By |
|-------|----------|-------|----------|-------------|-------|-----|---------|
| 1st | `adminuser` | `admin@testapp.com` | `Admin@123` | **ADMIN** | `9876543210` | `1990-01-15` | TC-001, TC-009, TC-026–030, TC-054 |
| 2nd | `regularuser` | `user@testapp.com` | `User@123` | **USER** | `9876543210` | `1995-06-15` | TC-002, TC-015–025, TC-031, TC-055 |
| 3rd | `deleteuser` | `delete@testapp.com` | `Delete@123` | **USER** | _(blank)_ | _(blank)_ | TC-027, TC-028, TC-033 |

---

## 2. Test Cycle Setup Script (Run Before Every Cycle)

```bash
# === STEP 1: Reset environment ===
kill $(lsof -t -i:8080) 2>/dev/null && echo "Port 8080 freed"
sleep 2

# === STEP 2: Start backend ===
cd /Users/ainexus/Task
mvn spring-boot:run &
sleep 20   # Wait for startup

# === STEP 3: Verify backend alive ===
curl -s -o /dev/null -w "Backend status: %{http_code}\n" http://localhost:8080/api/users
# Expected: Backend status: 401

# === STEP 4: Create test users in order ===
echo "Creating adminuser (will be ADMIN)..."
curl -s -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"adminuser","email":"admin@testapp.com","password":"Admin@123","phoneNumber":"9876543210","dateOfBirth":"1990-01-15"}'

echo "Creating regularuser (will be USER)..."
curl -s -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"regularuser","email":"user@testapp.com","password":"User@123","phoneNumber":"9876543210","dateOfBirth":"1995-06-15"}'

echo "Creating deleteuser (will be USER)..."
curl -s -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"deleteuser","email":"delete@testapp.com","password":"Delete@123"}'

# === STEP 5: Verify 3 users created ===
ADMIN_TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"adminuser","password":"Admin@123"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

curl -s http://localhost:8080/api/users \
  -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool | grep username
# Expected: "adminuser", "regularuser", "deleteuser"

echo "Test data setup complete. Admin token: $ADMIN_TOKEN"
```

---

## 3. Username — Valid/Invalid Boundary Values

| Test Value | Length | Category | Expected Result | Used By |
|-----------|--------|----------|----------------|---------|
| `ab` | 2 | Too short (below min) | 400 — validation error | TC-039 |
| `abc` | 3 | At minimum (valid) | 201 — success | TC-039 |
| `john_doe` | 8 | Typical valid | 201 — success | TC-001 |
| `a` × 50 chars | 50 | At maximum (valid) | 201 — success | TC-039 |
| `a` × 51 chars | 51 | Above maximum (invalid) | 400 — validation error | TC-039 |
| `user name` | 9 | Contains space | Test and document behaviour | TC-039 |
| `user@name` | 9 | Contains special char | Test and document behaviour | TC-039 |
| _(blank)_ | 0 | Empty | 400 — "Username is required" | TC-007 |

---

## 4. Email — Valid/Invalid Values

| Test Value | Category | Expected Result | Used By |
|-----------|----------|----------------|---------|
| `user@example.com` | Standard valid | 201 | TC-001 |
| `user@mail.example.com` | Subdomain | 201 | TC-045 |
| `user+tag@example.com` | Plus addressing | 201 | TC-042 |
| `USER@EXAMPLE.COM` | Uppercase | Test and document | TC-042 |
| `notanemail` | No @ symbol | 400 | TC-042 |
| `user@` | No domain | 400 | TC-042 |
| `@domain.com` | No local part | 400 | TC-042 |
| `user space@example.com` | Space in email | 400 | TC-042 |
| _(blank)_ | Empty | 400 | TC-007 |

---

## 5. Password — Valid/Invalid Values

| Test Value | Length | Category | Expected Result | Used By |
|-----------|--------|----------|----------------|---------|
| `abcde` | 5 | Too short | 400 / frontend error | TC-006, TC-040 |
| `abcdef` | 6 | Minimum valid | 201 | TC-040 |
| `Admin@123` | 9 | Strong (recommended) | 201 | TC-001 |
| `pass word` | 9 | Contains space | 201 (accepted) | TC-040 |
| `a` × 100 | 100 | Very long | 201 | TC-040 |
| _(blank)_ | 0 | Empty | Frontend error | TC-007 |

---

## 6. Confirm Password — Mismatch Scenarios

| Password | Confirm Password | Expected Result | Used By |
|---------|-----------------|----------------|---------|
| `Admin@123` | `Admin@123` | Match — no error | TC-001 |
| `Admin@123` | `admin@123` | Mismatch (case diff) — error | TC-005 |
| `Admin@123` | `Admin@124` | Mismatch — error | TC-005 |
| `Admin@123` | _(blank)_ | Mismatch — error | TC-007 |

---

## 7. Phone Number — Values

| Test Value | Category | Expected Result |
|-----------|----------|----------------|
| `9876543210` | Standard 10-digit | Stored as-is |
| `+91-9876543210` | With country code | Stored as-is (free text) |
| `(555) 123-4567` | US format with symbols | Stored as-is |
| `ABCDEFGHIJ` | Non-numeric | Stored as-is (no format enforcement) |
| _(blank)_ | Empty | Stored as null — valid (optional) |

---

## 8. Date of Birth — Values

| Test Value | Category | Expected Result |
|-----------|----------|----------------|
| `1990-01-15` | Valid past date | Stored as string |
| `1995-06-15` | Valid past date | Stored as string |
| `2030-12-31` | Future date | Stored (no backend validation in v1.0) — document behaviour |
| `not-a-date` | Invalid format | Stored as string (no format enforcement in v1.0) |
| _(blank)_ | Empty | Stored as null — valid (optional) |

---

## 9. JWT Token Test Values

| Scenario | Token to Use | Expected API Result |
|----------|-------------|-------------------|
| Valid ADMIN token | From `adminuser` login | 200 on all endpoints |
| Valid USER token | From `regularuser` login | 200 read; 403 on delete; 403 on update others |
| No token | Omit Authorization header | 401 |
| Malformed token | `Bearer notavalidtoken` | 401 |
| Wrong secret | Manually crafted token with different secret | 401 |
| Expired token | Token after natural expiry | 401 (test after waiting or mock) |

---

## 10. API Request Body Samples

### 10.1 POST /api/auth/signup — Minimum
```json
{
  "username": "testmin",
  "email": "testmin@testapp.com",
  "password": "Test@123"
}
```

### 10.2 POST /api/auth/signup — Full with Optional Fields
```json
{
  "username": "testfull",
  "email": "testfull@testapp.com",
  "password": "Full@123",
  "phoneNumber": "9876543210",
  "dateOfBirth": "1992-08-20"
}
```

### 10.3 POST /api/auth/login
```json
{
  "username": "adminuser",
  "password": "Admin@123"
}
```

### 10.4 PUT /api/users/{id} — Update All Fields
```json
{
  "username": "adminuser_updated",
  "email": "admin_updated@testapp.com",
  "password": "NewAdmin@456",
  "phoneNumber": "1234567890",
  "dateOfBirth": "1992-03-20"
}
```

### 10.5 PUT /api/users/{id} — Partial Update (Phone Only)
```json
{
  "phoneNumber": "0001112222"
}
```

### 10.6 PUT /api/users/{id} — Change Password Only
```json
{
  "password": "ChangedPass@789"
}
```

---

## 11. H2 Verification Queries

Use these SQL queries in `http://localhost:8080/h2-console` to verify test outcomes:

```sql
-- Count all users
SELECT COUNT(*) FROM USERS;

-- View all users (no passwords shown in app, but visible in DB)
SELECT id, username, email, role, phone_number, date_of_birth, created_at FROM USERS;

-- Verify BCrypt hash stored (should start with $2a$)
SELECT username, SUBSTR(password, 1, 7) AS hash_prefix FROM USERS;

-- Check first user is ADMIN
SELECT username, role FROM USERS ORDER BY id ASC LIMIT 1;

-- Check created_at is set
SELECT username, created_at FROM USERS;

-- Verify user deleted
SELECT * FROM USERS WHERE username = 'deleteuser';

-- Verify partial update (phone only)
SELECT username, phone_number, email FROM USERS WHERE username = 'regularuser';
```

---

## 12. Test Data Isolation Rules

| Rule | Detail |
|------|--------|
| Always reset DB before a new cycle | `kill $(lsof -t -i:8080)` then restart |
| Never share users across parallel test runs | Use unique username/email suffixes if running concurrently |
| Create users in strict order | `adminuser` MUST be registered first |
| Never use production data | All test data uses `@testapp.com` email domain |
| Delete `deleteuser` only in TC-028/TC-033 | Other tests depend on its existence |
| After TC-018 (password change), update data table | Use `NewPass@456` for subsequent regularuser login |
