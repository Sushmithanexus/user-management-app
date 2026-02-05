# Testing Guide: Running Playwright Without Interfering with Manual Testing

## The Problem

When you run Playwright tests while manually testing your application, you may experience issues because:

1. **Shared Database**: Both tests and manual usage share the same H2 in-memory database
2. **Test Data Pollution**: Playwright creates many test users (35 tests create multiple users)
3. **Conflicting State**: Tests may modify data you're working with

## Solutions

### ✅ Solution 1: Isolated Testing (Recommended)

Run tests on a **separate port** that doesn't interfere with your development:

```bash
# Terminal 1: Backend
cd /Users/ainexus/Task
mvn spring-boot:run

# Terminal 2: Your App (for manual testing)
cd /Users/ainexus/Task/frontend
npm run dev
# Your app runs on http://localhost:5173

# Terminal 3: Run Playwright Tests (isolated)
cd /Users/ainexus/Task/frontend
npm run test:e2e:isolated
# Tests run on http://localhost:5174 (different port!)
```

**Benefits:**
- ✅ Your app and tests run simultaneously
- ✅ No interference between them
- ✅ Different frontend instances
- ⚠️ Both still share the H2 database

### ✅ Solution 2: Restart Backend Between Sessions

Clear the database by restarting the backend:

**For Manual Testing:**
```bash
# 1. Stop backend (Ctrl+C)
# 2. Restart backend
cd /Users/ainexus/Task
mvn spring-boot:run

# 3. Use your app
cd /Users/ainexus/Task/frontend
npm run dev
# Fresh database, no test users!
```

**For Running Tests:**
```bash
# 1. Stop backend (Ctrl+C)
# 2. Restart backend
cd /Users/ainexus/Task
mvn spring-boot:run

# 3. Run tests
cd /Users/ainexus/Task/frontend
npm run test:e2e
# Clean database for tests!
```

**Benefits:**
- ✅ Clean database every time
- ✅ No test data pollution
- ⚠️ Need to restart between manual and automated testing

### ✅ Solution 3: Use Unique Credentials

When manually testing, use credentials that don't conflict with tests:

**Test User Pattern:** `testuser_1234567890` (tests use timestamps)
**Your Manual Users:** `john`, `admin`, `myuser` (simple names)

**Benefits:**
- ✅ Can coexist in same database
- ✅ Easy to identify which users are yours
- ⚠️ Database still gets cluttered

### ✅ Solution 4: Run Tests Without Dev Server

If your app is already running, use the existing server:

```bash
# Terminal 1: Backend running
# Terminal 2: Your app running on localhost:5173

# Terminal 3: Run tests (uses your existing frontend)
cd /Users/ainexus/Task/frontend
npm run test:e2e
```

The config already has `reuseExistingServer: true` so it won't start a new frontend.

---

## Comparison Table

| Solution | Manual & Tests Simultaneously | Clean Database | Setup Complexity |
|----------|------------------------------|----------------|------------------|
| **Isolated Testing** (port 5174) | ✅ Yes | ⚠️ Shared | Easy |
| **Restart Backend** | ❌ No | ✅ Yes | Very Easy |
| **Unique Credentials** | ✅ Yes | ❌ No | Easy |
| **Reuse Server** | ⚠️ Conflicts | ❌ No | Easy |

---

## Recommended Workflow

### During Development (Manual Testing)
```bash
# Terminal 1: Backend
mvn spring-boot:run

# Terminal 2: Frontend
cd frontend && npm run dev

# Do your manual testing at http://localhost:5173
# Create users: john, admin, testuser, etc.
```

### When Running Automated Tests

**Option A: Isolated (No Interference)**
```bash
# Keep your app running!
# In new terminal:
cd frontend
npm run test:e2e:isolated
```

**Option B: Clean Database**
```bash
# Stop backend (Ctrl+C in Terminal 1)
# Restart backend
mvn spring-boot:run

# Run tests
cd frontend
npm run test:e2e
```

---

## Understanding the Configs

### Default Config (`playwright.config.js`)
- Uses port **5173** (your development port)
- Reuses existing server if running
- Best for quick tests when not manually testing

### Isolated Config (`playwright.isolated.config.js`)
- Uses port **5174** (separate test port)
- Starts its own frontend server
- Best for running tests while manually testing

---

## Quick Reference

```bash
# Run tests in isolation (port 5174)
npm run test:e2e:isolated

# Run tests normally (port 5173)
npm run test:e2e

# Run tests with UI
npm run test:e2e:ui

# View reports
npm run test:report
```

---

## FAQ

**Q: Why can't I signup when tests are running?**
A: Tests create many users in the H2 database. Use unique usernames or restart the backend.

**Q: Can I run tests while developing?**
A: Yes! Use `npm run test:e2e:isolated` to run on a separate port (5174).

**Q: How do I clear test data?**
A: Restart the backend (Ctrl+C then `mvn spring-boot:run`). H2 is in-memory so it resets.

**Q: Can I use a real database instead of H2?**
A: Yes, but you'd need to configure PostgreSQL/MySQL and handle test data cleanup.

**Q: Tests are interfering with my app!**
A: Use isolated mode: `npm run test:e2e:isolated`

---

## Best Practices

1. **Use isolated mode** when running tests during development
2. **Restart backend** before important manual testing sessions
3. **Use simple usernames** for manual testing (not timestamps)
4. **Run full test suite** before committing code
5. **Check test reports** to understand failures

---

## Summary

**For simultaneous manual testing and automated testing:**
```bash
npm run test:e2e:isolated
```

**For clean database before manual testing:**
```bash
# Restart backend, then use your app
```

**For running tests only:**
```bash
npm run test:e2e
```

Choose the approach that fits your workflow! 🚀
