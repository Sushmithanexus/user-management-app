# Product Vision & Business Requirements
**Project:** User Management Application
**Version:** 1.0
**Date:** 2026-02-25

---

## 1. Product Vision

Build a secure, full-stack web application that allows organizations to manage user accounts with role-based access control. The system provides self-service registration, authentication, and profile management for end users, while giving administrators complete control over the user base.

---

## 2. Business Goals

| # | Goal |
|---|------|
| BG-01 | Allow any visitor to self-register for an account |
| BG-02 | Secure all user data behind JWT-based authentication |
| BG-03 | Automatically assign the first registered user as ADMIN |
| BG-04 | Enable admins to manage (view, update, delete) all users |
| BG-05 | Prevent unauthorized data access and account tampering |
| BG-06 | Provide a clean, responsive UI accessible from any modern browser |

---

## 3. Target Users

| Role | Description |
|------|-------------|
| **Guest** | Unauthenticated visitor; can only access Signup and Login pages |
| **User** | Registered and authenticated user; can view all users and manage own profile |
| **Admin** | First registered user; has full CRUD access to all user accounts; cannot delete own account |

---

## 4. Key Value Propositions

- Zero-configuration admin setup — first user auto-becomes ADMIN
- Stateless JWT authentication — no server-side session management required
- Password security — BCrypt hashing, never stored in plain text
- Data privacy — passwords never exposed in any API response (UserDTO pattern)
- Role-based protection — every sensitive endpoint enforced server-side

---

## 5. Scope

### In Scope
- User registration (signup)
- User authentication (login/logout)
- View own profile
- Update own profile (username, email, phone, DOB, password)
- View list of all users (authenticated only)
- Admin: update any user's profile
- Admin: delete any user (except own account)
- JWT token auto-refresh handling (redirect to login on 401)

### Out of Scope (v1.0)
- Password reset via email
- Multi-factor authentication (MFA)
- Social login (Google, GitHub)
- User search / filtering
- Audit logs / activity history
- Pagination of user list
- Email verification on signup

---

## 6. Technical Platform

| Component | Technology |
|-----------|-----------|
| Backend | Java 21, Spring Boot 3.2, Spring Security, JPA/Hibernate |
| Database | H2 In-Memory (dev/test) |
| Authentication | JWT (JJWT 0.11.5), BCrypt password encoding |
| Frontend | React 18, Vite, React Router v6, Axios |
| API Style | RESTful JSON over HTTP |
| CORS | Allowed origins: localhost:5173, localhost:3000 |
