# Feature List / Module List
**Project:** User Management Application
**Version:** 1.0
**Date:** 2026-02-25

---

## Module Map

```
User Management App
├── AUTH Module
│   ├── Signup (Registration)
│   └── Login / Logout
├── PROFILE Module
│   └── View & Edit Own Profile
├── USER LIST Module
│   └── View All Users (Admin: + Delete)
└── NAVIGATION Module
    └── Navbar (dynamic based on auth state)
```

---

## Feature List

### Module 1: AUTH — Authentication & Registration

| Feature ID | Feature Name | Description | Access |
|-----------|-------------|-------------|--------|
| F-01 | User Registration (Signup) | New user creates an account with username, email, password, optional phone and DOB | Public |
| F-02 | Auto Admin Assignment | First registered user is automatically assigned ADMIN role; all subsequent users get USER role | System |
| F-03 | User Login | Authenticated with username + password; returns JWT token | Public |
| F-04 | JWT Token Storage | Token and user info stored in localStorage on login | System |
| F-05 | User Logout | Clears token and user from localStorage; redirects to login | Authenticated |
| F-06 | Auto Redirect on 401 | Any API call returning 401 clears localStorage and redirects to /login | System |

---

### Module 2: PROFILE — User Profile Management

| Feature ID | Feature Name | Description | Access |
|-----------|-------------|-------------|--------|
| F-07 | View Own Profile | Displays user ID, username, email, role, phone, DOB, created date | Authenticated |
| F-08 | Edit Username | Update own username (unique constraint enforced) | Authenticated |
| F-09 | Edit Email | Update own email (unique constraint enforced) | Authenticated |
| F-10 | Edit Phone Number | Update own phone number (optional field) | Authenticated |
| F-11 | Edit Date of Birth | Update own date of birth (optional field) | Authenticated |
| F-12 | Change Password | Update password; minimum 6 characters; BCrypt re-hashed | Authenticated |
| F-13 | Admin Edit Any Profile | Admin can update any user's profile fields | Admin only |

---

### Module 3: USER LIST — User Directory

| Feature ID | Feature Name | Description | Access |
|-----------|-------------|-------------|--------|
| F-14 | List All Users | Displays table with ID, username, email, role, created date | Authenticated |
| F-15 | Delete User (Admin) | Admin can delete any user except own account; confirmation dialog shown | Admin only |
| F-16 | Admin Info Banner | Shows "Admin Access" banner at top of user list for admin users | Admin only |
| F-17 | No Access Label | Regular users see "No access" instead of Delete button | User role |

---

### Module 4: NAVIGATION — Navbar

| Feature ID | Feature Name | Description | Access |
|-----------|-------------|-------------|--------|
| F-18 | Public Navbar | Shows Login and Signup links | Guest |
| F-19 | Authenticated Navbar | Shows Profile, Users, and Logout links | Authenticated |

---

## Screens / Routes

| Route | Screen | Auth Required |
|-------|--------|--------------|
| `/signup` | Signup Form | No |
| `/login` | Login Form | No |
| `/profile` | My Profile | Yes |
| `/users` | User List | Yes |
| `/` | Redirects to /login or /profile | — |
