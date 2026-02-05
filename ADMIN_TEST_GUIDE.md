# 🧪 Admin vs Regular User - Testing Guide

## Test Accounts Available

### 👑 ADMIN Account (First User)
```
Username: admin
Password: admin123
Role: ADMIN
```

### 👤 Regular USER Account
```
Username: regularuser
Password: user123
Role: USER
```

---

## 🔍 Test Scenario 1: Login as ADMIN

### Step 1: Open Application
1. Navigate to: http://localhost:5173
2. Click **"Login"** button

### Step 2: Login as Admin
1. Enter credentials:
   - Username: `admin`
   - Password: `admin123`
2. Click **"Login"**

### Step 3: View Profile
1. You'll be redirected to Profile page
2. **What you should see:**
   ```
   User ID: 1
   Role: ADMIN (orange badge)
   Created: [timestamp]
   ```

### Step 4: View Users List
1. Click **"Users"** in the navigation bar
2. **What you should see:**
   - Table with all users (admin, regularuser, testdelete2, Harshitha)
   - Each user shows: ID, Username, Email, Role badge, Created At
   - **Actions column with RED DELETE BUTTONS** ✅
   - Delete button visible for ALL users

### Step 5: Test Delete Functionality
1. Find a user to delete (e.g., "testdelete2")
2. Click the **red "Delete"** button
3. **Confirmation dialog** appears: "Are you sure you want to delete user testdelete2?"
4. Click **OK**
5. **Result:**
   - Alert: "User deleted successfully"
   - User list refreshes automatically
   - Deleted user is removed from the list

### ✅ Expected ADMIN Behavior:
- ✅ Can see all users
- ✅ DELETE buttons visible
- ✅ Can successfully delete any user
- ✅ Role badge shows "ADMIN" (orange)

---

## 🔍 Test Scenario 2: Login as Regular USER

### Step 1: Logout from Admin
1. Click **"Logout"** button in navigation

### Step 2: Login as Regular User
1. Click **"Login"**
2. Enter credentials:
   - Username: `regularuser`
   - Password: `user123`
3. Click **"Login"**

### Step 3: View Profile
1. You'll be redirected to Profile page
2. **What you should see:**
   ```
   User ID: 2
   Role: USER (green badge)
   Created: [timestamp]
   ```

### Step 4: View Users List
1. Click **"Users"** in the navigation bar
2. **What you should see:**
   - **Blue info box at top**: "Note: Only administrators can delete users."
   - Table with all users
   - Each user shows: ID, Username, Email, Role badge, Created At
   - **NO Actions column** ❌
   - **NO DELETE BUTTONS** ❌

### Step 5: Try to Delete via API (Security Test)
Even if user tries to bypass frontend and call API directly:

```bash
# This will FAIL with 403 Forbidden
curl -X DELETE http://localhost:8080/api/users/4 \
  -H "Authorization: Bearer <USER_TOKEN>"
```

**Result:** HTTP 403 Forbidden - Backend enforces security

### ✅ Expected USER Behavior:
- ✅ Can see all users
- ✅ Info message displayed
- ❌ NO DELETE buttons visible
- ❌ Cannot delete via API (403 Forbidden)
- ✅ Role badge shows "USER" (green)

---

## 📊 Visual Comparison

### ADMIN View - Users Page:
```
┌─────────────────────────────────────────────────────────────────┐
│ All Users                                                       │
├─────────────────────────────────────────────────────────────────┤
│ ID │ Username    │ Email              │ Role  │ Created  │ Actions│
├────┼─────────────┼────────────────────┼───────┼──────────┼────────┤
│ 1  │ admin       │ admin@example.com  │ ADMIN │ 10:18:30 │ Delete │
│ 2  │ regularuser │ user@example.com   │ USER  │ 10:18:31 │ Delete │
│ 3  │ testdelete2 │ test2@delete.com   │ USER  │ 10:19:45 │ Delete │
│ 4  │ Harshitha   │ harsh@example.com  │ USER  │ 10:20:12 │ Delete │
└────┴─────────────┴────────────────────┴───────┴──────────┴────────┘
            DELETE BUTTONS VISIBLE FOR ALL USERS ✅
```

### USER View - Users Page:
```
┌─────────────────────────────────────────────────────────────────┐
│ All Users                                                       │
├─────────────────────────────────────────────────────────────────┤
│ ℹ️  Note: Only administrators can delete users.                │
├─────────────────────────────────────────────────────────────────┤
│ ID │ Username    │ Email              │ Role  │ Created         │
├────┼─────────────┼────────────────────┼───────┼─────────────────┤
│ 1  │ admin       │ admin@example.com  │ ADMIN │ 10:18:30        │
│ 2  │ regularuser │ user@example.com   │ USER  │ 10:18:31        │
│ 3  │ testdelete2 │ test2@delete.com   │ USER  │ 10:19:45        │
│ 4  │ Harshitha   │ harsh@example.com  │ USER  │ 10:20:12        │
└────┴─────────────┴────────────────────┴───────┴─────────────────┘
            NO DELETE BUTTONS - NO ACTIONS COLUMN ❌
```

---

## 🔐 Security Features Demonstrated

### Frontend Security:
1. ✅ Delete buttons hidden from regular users
2. ✅ Info message displayed to non-admins
3. ✅ Role badges show user privilege level

### Backend Security:
1. ✅ `@PreAuthorize("hasRole('ADMIN')")` on DELETE endpoint
2. ✅ Regular users get **403 Forbidden** if they try API directly
3. ✅ JWT token includes role information
4. ✅ Spring Security enforces role-based access

### Database Security:
1. ✅ First registered user = ADMIN
2. ✅ All subsequent users = USER
3. ✅ Role field in database

---

## 🎯 Quick Test Checklist

### Test as ADMIN:
- [ ] Login successful
- [ ] Profile shows ADMIN role (orange badge)
- [ ] Users page shows DELETE buttons
- [ ] Can successfully delete a user
- [ ] Deleted user removed from list

### Test as Regular USER:
- [ ] Login successful
- [ ] Profile shows USER role (green badge)
- [ ] Users page shows info message
- [ ] NO DELETE buttons visible
- [ ] NO Actions column in table

### Test Security:
- [ ] Non-admin API call returns 403
- [ ] Admin can delete any user
- [ ] Regular user cannot delete anyone
- [ ] First user becomes ADMIN automatically

---

## 🚀 Start Testing Now!

1. **Open**: http://localhost:5173
2. **Login as ADMIN**: admin / admin123
3. **Check Users page**: See delete buttons
4. **Logout and login as USER**: regularuser / user123
5. **Check Users page**: No delete buttons!

---

## 📝 Notes

- **Current Users**: admin (ADMIN), regularuser (USER), testdelete2 (USER), Harshitha (USER)
- **Backend**: Running on http://localhost:8080
- **Frontend**: Running on http://localhost:5173
- **First User Rule**: The first user registered is always ADMIN
- **Subsequent Users**: All other users are USER by default

---

**All role-based access control is working perfectly!** ✅
