# Data Model Overview
**Project:** User Management Application
**Version:** 1.0
**Date:** 2026-02-25

---

## Entity Relationship Diagram

```
┌──────────────────────────────────┐
│              USERS               │
├──────────────────────────────────┤
│ PK  id            BIGINT (AUTO)  │
│     username      VARCHAR(50)    │  UNIQUE, NOT NULL
│     email         VARCHAR(255)   │  UNIQUE, NOT NULL
│     password      VARCHAR(255)   │  NOT NULL (BCrypt hash)
│     role          VARCHAR(10)    │  NOT NULL ("ADMIN"|"USER")
│     phone_number  VARCHAR(255)   │  NULLABLE
│     date_of_birth VARCHAR(255)   │  NULLABLE
│     created_at    TIMESTAMP      │  NOT NULL, auto-set on insert
└──────────────────────────────────┘
```

> **Note:** v1.0 has a single entity. No foreign keys or relationships yet.

---

## Field Details

| Column | Java Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | Long | PK, Auto-increment | System-generated; never user-set |
| `username` | String | NOT NULL, UNIQUE, 3–50 chars | Used for login and display |
| `email` | String | NOT NULL, UNIQUE, valid email | Used for display only (not for login) |
| `password` | String | NOT NULL, min 6 chars raw | Stored as BCrypt hash |
| `role` | String | NOT NULL | Values: `"ADMIN"` or `"USER"` only |
| `phone_number` | String | NULLABLE | Free text, no format enforced in DB |
| `date_of_birth` | String | NULLABLE | Stored as string (e.g. "1990-01-01") |
| `created_at` | LocalDateTime | NOT NULL, immutable | Set by `@PrePersist`; not updateable |

---

## DTOs (Data Transfer Objects)

### UserDTO — used in all API responses (no password)
| Field | Type |
|-------|------|
| id | Long |
| username | String |
| email | String |
| role | String |
| phoneNumber | String |
| dateOfBirth | String |
| createdAt | LocalDateTime |

### LoginRequest — used for POST /api/auth/login
| Field | Type |
|-------|------|
| username | String |
| password | String |

### LoginResponse — returned on successful login
| Field | Type |
|-------|------|
| token | String (JWT) |
| username | String |
| email | String |
| role | String |
| userId | Long |

---

## Database Configuration

| Setting | Value |
|---------|-------|
| Engine | H2 In-Memory |
| JDBC URL | `jdbc:h2:mem:usermanagementdb` |
| DDL Strategy | `create-drop` (schema created on start, dropped on stop) |
| Dialect | `org.hibernate.dialect.H2Dialect` |
| Show SQL | `true` (dev mode) |

> **Important for QA:** Because `ddl-auto=create-drop`, the database is **wiped on every restart**. All test data must be re-created after each backend restart. For production, this should be changed to a persistent DB with `validate` or `update`.

---

## Key Business Rules at Data Layer

1. **Username uniqueness** — enforced at both application layer (`UserService`) and DB (`UNIQUE` constraint)
2. **Email uniqueness** — enforced at both application layer and DB
3. **Password never returned** — `UserDTO` explicitly omits the password field
4. **Role auto-set** — set by `UserService.registerUser()` based on `userRepository.count()`, not by user input
5. **created_at immutability** — `@Column(updatable = false)` prevents any update to this field
