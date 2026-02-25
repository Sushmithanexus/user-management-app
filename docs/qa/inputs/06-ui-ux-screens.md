# UI/UX Screens & Wireframes
**Project:** User Management Application
**Version:** 1.0
**Date:** 2026-02-25

---

## Screen 1: Signup Page (`/signup`)

```
┌─────────────────────────────────────────────┐
│  NAVBAR: [User Management]  [Login] [Signup] │
├─────────────────────────────────────────────┤
│                                             │
│              ┌───────────────┐              │
│              │   Sign Up     │              │
│              │               │              │
│              │ [Error msg]   │  ← red box   │
│              │               │              │
│              │ Username*     │              │
│              │ [____________]│              │
│              │               │              │
│              │ Email*        │              │
│              │ [____________]│              │
│              │               │              │
│              │ Phone (Opt)   │              │
│              │ [____________]│              │
│              │               │              │
│              │ Date of Birth │              │
│              │ [Date Picker] │              │
│              │               │              │
│              │ Password*     │              │
│              │ [············]│              │
│              │               │              │
│              │ Confirm Pwd*  │              │
│              │ [············]│              │
│              │               │              │
│              │ [  Sign Up  ] │  ← primary   │
│              │               │              │
│              │ Already have  │              │
│              │ an account?   │              │
│              │    [Login]    │              │
│              └───────────────┘              │
└─────────────────────────────────────────────┘
```
**Fields:** Username*, Email*, Phone (optional), Date of Birth (optional), Password*, Confirm Password*
**Buttons:** Sign Up (primary, shows "Signing up..." when loading)
**Error States:** Inline red error message above the form
**Links:** "Login" link at bottom

---

## Screen 2: Login Page (`/login`)

```
┌─────────────────────────────────────────────┐
│  NAVBAR: [User Management]  [Login] [Signup] │
├─────────────────────────────────────────────┤
│                                             │
│              ┌───────────────┐              │
│              │    Login      │              │
│              │               │              │
│              │ [Error msg]   │  ← red box   │
│              │               │              │
│              │ Username*     │              │
│              │ [____________]│              │
│              │               │              │
│              │ Password*     │              │
│              │ [············]│              │
│              │               │              │
│              │ [   Login   ] │  ← primary   │
│              │               │              │
│              │ Don't have an │              │
│              │ account?      │              │
│              │  [Sign Up]    │              │
│              └───────────────┘              │
└─────────────────────────────────────────────┘
```
**Fields:** Username*, Password*
**Buttons:** Login (primary, shows "Logging in..." when loading)
**Links:** "Sign Up" link at bottom

---

## Screen 3: My Profile (`/profile`)

```
┌─────────────────────────────────────────────────┐
│  NAVBAR: [User Management] [Profile][Users][Logout]│
├─────────────────────────────────────────────────┤
│                                                 │
│         ┌─────────────────────────┐             │
│         │      My Profile         │             │
│         │                         │             │
│         │ User ID: 1              │             │
│         │ Role: [ADMIN badge]     │ ← green/blue│
│         │ Phone: 9876543210       │             │
│         │ DOB: 01/01/1990         │             │
│         │ Created: Feb 25, 2026   │             │
│         │─────────────────────────│             │
│         │ [Error msg]  ← red      │             │
│         │ [Success msg] ← green   │             │
│         │                         │             │
│         │ Username*               │             │
│         │ [john_doe_______________]│             │
│         │                         │             │
│         │ Email*                  │             │
│         │ [john@example.com______]│             │
│         │                         │             │
│         │ Phone Number            │             │
│         │ [9876543210_____________]│             │
│         │                         │             │
│         │ Date of Birth           │             │
│         │ [1990-01-01_____________]│             │
│         │                         │             │
│         │ New Password (optional) │             │
│         │ [························]│            │
│         │                         │             │
│         │ [ Update Profile ]      │ ← primary   │
│         └─────────────────────────┘             │
└─────────────────────────────────────────────────┘
```
**Info section:** User ID, Role badge, Phone, DOB, Created date
**Form:** Username*, Email*, Phone, DOB, New Password (blank = no change)
**Buttons:** Update Profile (shows "Updating..." when loading)
**Messages:** Error (red), Success (green) — shown above form

---

## Screen 4: User List (`/users`) — Regular User View

```
┌─────────────────────────────────────────────────┐
│  NAVBAR: [User Management] [Profile][Users][Logout]│
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  All Users                                │  │
│  │                                           │  │
│  │  ID │ Username │ Email     │ Role│Created │Actions│
│  │  ───┼──────────┼───────────┼─────┼────────┼──────│
│  │  1  │ alice    │ a@x.com   │ADMIN│Feb 25  │No access│
│  │  2  │ bob      │ b@x.com   │USER │Feb 25  │No access│
│  │  3  │ carol    │ c@x.com   │USER │Feb 25  │No access│
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## Screen 5: User List (`/users`) — Admin View

```
┌─────────────────────────────────────────────────┐
│  NAVBAR: [User Management] [Profile][Users][Logout]│
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  All Users                                │  │
│  │                                           │  │
│  │  ℹ Admin Access: You can delete any       │  │
│  │    user account.              ← blue box  │  │
│  │                                           │  │
│  │  ID │ Username │ Email     │ Role│Created │Actions│
│  │  ───┼──────────┼───────────┼─────┼────────┼──────│
│  │  1  │ alice    │ a@x.com   │ADMIN│Feb 25  │ —    │  ← own account, no button
│  │  2  │ bob      │ b@x.com   │USER │Feb 25  │[Del] │
│  │  3  │ carol    │ c@x.com   │USER │Feb 25  │[Del] │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## UI Components & Styles

| Component | Style Notes |
|-----------|------------|
| Error message | Red background box, shown above form |
| Success message | Green background box |
| ADMIN role badge | Blue/teal badge |
| USER role badge | Grey badge |
| Admin info banner | Blue border, light blue background |
| Delete button | Red danger button (`btn-danger`) |
| Primary button | Blue primary button (`btn-primary`) |
| Loading state | Button text changes + disabled state |
