# Quick Start Guide - User Management Application

## Prerequisites Check

Before starting, ensure you have:
- ✅ Java 17+ installed (Java 21 recommended)
- ✅ Maven 3.6+ installed
- ✅ Node.js 16+ and npm installed

## Quick Start Commands

### Option 1: Start Backend and Frontend Separately

#### Terminal 1 - Start Backend:
```bash
cd /Users/ainexus/Task
mvn spring-boot:run
```
Wait for: "User Management Application Started!" message
Backend will be available at: **http://localhost:8080**

#### Terminal 2 - Start Frontend:
```bash
cd /Users/ainexus/Task/frontend
npm run dev
```
Frontend will be available at: **http://localhost:5173**

### Option 2: Use the Start Scripts (Coming Soon)

We can create shell scripts to automate the startup process.

## Testing the Application

### 1. Open Frontend
Navigate to: http://localhost:5173

### 2. Create a User Account
- Click "Sign Up"
- Fill in the form:
  - Username: testuser
  - Email: test@example.com
  - Password: password123
  - Confirm Password: password123
- Click "Sign Up"

### 3. Login
- Click "Login"
- Enter your credentials
- Click "Login"

### 4. View Profile
- After login, you'll be redirected to your profile
- You can update your username, email, or password

### 5. View All Users
- Click "Users" in the navigation
- See all registered users
- Delete users (will delete your own account too!)

## API Testing with curl

### Signup:
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "password123"
  }'
```

### Get All Users (replace YOUR_TOKEN with the token from login):
```bash
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## H2 Database Console

Access the H2 database console at: **http://localhost:8080/h2-console**

Settings:
- JDBC URL: `jdbc:h2:mem:usermanagementdb`
- Username: `sa`
- Password: (leave blank)

## Project Structure

```
/Users/ainexus/Task/
├── backend (Spring Boot)
│   ├── src/main/java/com/usermanagement/
│   │   ├── config/          # Security, JWT
│   │   ├── controller/      # REST endpoints
│   │   ├── dto/            # Data transfer objects
│   │   ├── entity/         # JPA entities
│   │   ├── repository/     # Data access
│   │   └── service/        # Business logic
│   └── src/main/resources/
│       └── application.properties
│
└── frontend (React + Vite)
    ├── src/
    │   ├── components/     # React components
    │   ├── services/       # API calls
    │   ├── App.jsx         # Main app
    │   └── main.jsx        # Entry point
    └── package.json

```

## Common Issues & Solutions

### Backend won't start:
- **Port 8080 in use**: Kill the process using port 8080
  ```bash
  lsof -ti:8080 | xargs kill -9
  ```
- **Maven build fails**: Run `mvn clean install` first

### Frontend won't start:
- **Port 5173 in use**: Kill the process or change port in `vite.config.js`
- **Dependencies error**: Delete `node_modules` and run `npm install` again

### CORS errors:
- Make sure backend is running
- Check that backend CORS configuration allows `http://localhost:5173`

### 401 Unauthorized:
- JWT token expired - login again
- Token not sent - check localStorage for 'token'

## Features Implemented

✅ User Registration (Signup)
✅ User Authentication (Login) with JWT
✅ Profile View and Update
✅ List All Users
✅ Delete User
✅ Password Encryption (BCrypt)
✅ Protected Routes
✅ Responsive UI
✅ Form Validation
✅ Error Handling

## Next Steps

1. **Start both backend and frontend**
2. **Create a user account**
3. **Login and explore the features**
4. **Try the API endpoints with curl**
5. **Check the H2 database console**

## Support

For issues or questions:
- Check the README.md file
- Review the application.properties for backend config
- Check browser console for frontend errors
- Check terminal for backend errors

---

**Enjoy building with Spring Boot and React!** 🚀
