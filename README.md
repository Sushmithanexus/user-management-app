# User Management Web Application

A full-stack User Management application with CRUD operations using Spring Boot (backend) and React (frontend).

## Features

- **User Registration (Signup)** - Create new user accounts
- **User Authentication (Login)** - JWT-based authentication
- **User Profile Management** - View and update profile information
- **User List** - Display all registered users
- **User Delete** - Remove user accounts
- **Secure API** - Spring Security with JWT tokens
- **Modern UI** - Responsive React interface

## Technology Stack

### Backend
- Spring Boot 3.2.0
- Spring Data JPA
- Spring Security
- H2 Database (in-memory)
- JWT (JSON Web Tokens)
- BCrypt password encryption
- Lombok
- Maven

### Frontend
- React 18
- React Router
- Axios
- Vite
- HTML5 & CSS3

## Project Structure

```
Task/
├── backend/
│   ├── src/main/java/com/usermanagement/
│   │   ├── UserManagementApplication.java
│   │   ├── config/
│   │   ├── entity/
│   │   ├── repository/
│   │   ├── service/
│   │   ├── controller/
│   │   └── dto/
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── services/
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- Node.js 16+ and npm
- Git

## Installation & Setup

### Backend Setup

1. Navigate to the project directory:
```bash
cd /Users/ainexus/Task
```

2. Install Maven dependencies:
```bash
mvn clean install
```

3. Run the Spring Boot application:
```bash
mvn spring-boot:run
```

The backend will start on **http://localhost:8080**

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd /Users/ainexus/Task/frontend
```

2. Install npm dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will start on **http://localhost:5173**

## Usage

### Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **H2 Console**: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:usermanagementdb`
  - Username: `sa`
  - Password: (leave blank)

### API Endpoints

#### Authentication (Public)
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login and get JWT token

#### User Management (Protected - requires JWT token)
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users/me` - Get current authenticated user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Testing the Application

1. **Sign Up**: Navigate to http://localhost:5173/signup and create a new account
2. **Login**: Use your credentials to login at http://localhost:5173/login
3. **View Profile**: After login, view and update your profile
4. **View Users**: See all registered users in the system
5. **Update Profile**: Modify your username, email, or password
6. **Delete User**: Remove a user account

### Sample curl Commands

**Signup:**
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

**Get All Users (with token):**
```bash
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Configuration

### Backend Configuration (application.properties)

- Server port: 8080
- Database: H2 in-memory (data is reset on restart)
- JWT token validity: 24 hours
- Password encryption: BCrypt

### Frontend Configuration

- Development server: Vite
- API base URL: http://localhost:8080/api
- CORS enabled for localhost:5173

## Security Features

- **Password Hashing**: BCrypt with salt
- **JWT Authentication**: Stateless token-based auth
- **CORS Protection**: Configured for frontend origin
- **Input Validation**: Server-side validation
- **Protected Routes**: Authentication required for sensitive operations

## Database

The application uses H2 in-memory database. Data is stored in memory and will be lost when the application stops.

To switch to a persistent database (e.g., MySQL, PostgreSQL):
1. Update `pom.xml` with the database driver
2. Modify `application.properties` with database connection details
3. Change `spring.jpa.hibernate.ddl-auto` to `update`

## Development

### Building for Production

**Backend:**
```bash
mvn clean package
java -jar target/user-management-app-1.0.0.jar
```

**Frontend:**
```bash
npm run build
```

The production build will be in the `dist/` folder.

## Troubleshooting

### Backend Issues

- **Port 8080 already in use**: Stop other applications using port 8080 or change the port in `application.properties`
- **Maven dependencies not downloading**: Check your internet connection and Maven settings

### Frontend Issues

- **Port 5173 already in use**: Stop other Vite applications or change the port in `vite.config.js`
- **CORS errors**: Ensure backend is running and CORS is properly configured
- **API connection failed**: Verify backend is running on http://localhost:8080

### Common Issues

- **401 Unauthorized**: JWT token expired or invalid, please login again
- **User already exists**: Try a different username or email
- **Invalid credentials**: Check username and password

## Future Enhancements

- Role-based access control (Admin, User)
- Email verification
- Password reset functionality
- User profile pictures
- Pagination for user list
- Search and filter users
- Activity logs
- Persistent database (MySQL/PostgreSQL)

## License

This project is for educational purposes.

## Author

Built with Spring Boot and React
