# Backend Testing Documentation

## Overview

This project includes comprehensive **Unit Tests** (JUnit 5) and **Integration Tests** (Spring Test) for the User Management Application.

## Test Structure

```
src/test/java/
├── com/usermanagement/
│   ├── controller/
│   │   └── UserControllerTest.java          # Controller Unit Tests
│   ├── service/
│   │   └── UserServiceTest.java             # Service Unit Tests
│   └── integration/
│       └── UserManagementIntegrationTest.java  # Integration Tests
```

## Test Coverage

### Unit Tests (JUnit 5 + Mockito)

#### UserServiceTest.java
- ✅ User registration (success, duplicate username, duplicate email)
- ✅ Role assignment (ADMIN for first user, USER for subsequent)
- ✅ User authentication (valid/invalid credentials)
- ✅ Get user by ID and username
- ✅ Get all users
- ✅ Update user information
- ✅ Delete user
- ✅ Convert user to DTO

**Total: 17 unit tests**

#### UserControllerTest.java
- ✅ Signup endpoint (success, duplicate user)
- ✅ Login endpoint (success, invalid credentials)
- ✅ Get all users (authenticated)
- ✅ Get user by ID (success, not found)
- ✅ Get current user
- ✅ Update user profile
- ✅ Delete user (as admin, own account, forbidden)

**Total: 12 controller tests**

### Integration Tests (Spring Test)

#### UserManagementIntegrationTest.java
- ✅ Complete user lifecycle (register → login → update → delete)
- ✅ First user becomes ADMIN
- ✅ Second user becomes USER
- ✅ Duplicate username/email prevention
- ✅ Authentication and JWT tokens
- ✅ Protected endpoints with authorization
- ✅ Role-based access control

**Total: 10 integration tests**

## Running Tests

### Run All Tests
```bash
cd /Users/ainexus/Task
mvn test
```

### Run Only Unit Tests
```bash
mvn test -Dtest=**/*Test.java
```

### Run Only Integration Tests
```bash
mvn test -Dtest=**/*IntegrationTest.java
```

### Run Specific Test Class
```bash
mvn test -Dtest=UserServiceTest
mvn test -Dtest=UserControllerTest
mvn test -Dtest=UserManagementIntegrationTest
```

### Run Tests with Coverage Report
```bash
mvn clean test jacoco:report
```

### Run Tests in Specific Profile
```bash
mvn test -Dspring.profiles.active=test
```

## Test Technologies

- **JUnit 5** - Testing framework
- **Mockito** - Mocking framework for unit tests
- **Spring Test** - Integration testing support
- **MockMvc** - Testing REST controllers
- **H2 Database** - In-memory database for tests
- **AssertJ** - Fluent assertions (optional)

## Test Best Practices

### Unit Tests
- ✅ Fast execution (no database, no context)
- ✅ Isolated (using mocks)
- ✅ Focused on single units
- ✅ Independent of external resources

### Integration Tests
- ✅ Test full application stack
- ✅ Use real database (H2 in-memory)
- ✅ Test complete workflows
- ✅ Verify component interactions

## Expected Test Results

### Successful Run
```
[INFO] Tests run: 39, Failures: 0, Errors: 0, Skipped: 0

[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
```

### Test Metrics
- **Total Tests**: 39
- **Unit Tests**: 29
- **Integration Tests**: 10
- **Execution Time**: ~10-15 seconds

## Test Reports

After running tests, view reports:

### Surefire Report
```bash
open target/surefire-reports/index.html
```

### JaCoCo Coverage Report
```bash
mvn jacoco:report
open target/site/jacoco/index.html
```

## Continuous Integration

Tests are designed for CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run Tests
  run: mvn test

- name: Generate Coverage
  run: mvn jacoco:report

- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

## Troubleshooting

### Problem: Tests fail with "Port already in use"
**Solution**: Stop the running application before tests
```bash
lsof -ti:8080 | xargs kill -9
```

### Problem: Database connection errors
**Solution**: Tests use H2 in-memory, no external database needed

### Problem: Authentication failures in tests
**Solution**: Check `application-test.properties` for correct JWT secret

### Problem: Slow test execution
**Solution**: Unit tests should be fast. Integration tests may take longer.

## Test Data

Tests use:
- **Dynamic data**: Timestamps for unique usernames/emails
- **Clean state**: Database reset between tests
- **Predictable data**: Fixed test values for verification

## Adding New Tests

### 1. Unit Test Template
```java
@Test
@DisplayName("Should do something successfully")
void testSomething_Success() {
    // Arrange
    // ... setup mocks and test data

    // Act
    // ... call the method being tested

    // Assert
    // ... verify the results
}
```

### 2. Integration Test Template
```java
@Test
@Order(1)
@DisplayName("Integration Test: Complete workflow")
void testCompleteWorkflow() throws Exception {
    // Arrange
    // ... prepare test data

    // Act & Assert
    mockMvc.perform(post("/api/endpoint")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(data)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.field").value("expected"));
}
```

## Test Naming Conventions

- **Class**: `[ClassName]Test.java` or `[Feature]IntegrationTest.java`
- **Method**: `test[MethodName]_[Scenario]`
- **Display**: `@DisplayName("Should [expected behavior] when [condition]")`

## Coverage Goals

- **Line Coverage**: > 80%
- **Branch Coverage**: > 70%
- **Class Coverage**: 100%

## Quick Reference

```bash
# Run all tests
mvn test

# Run with detailed output
mvn test -X

# Run specific test
mvn test -Dtest=UserServiceTest#testRegisterUser_Success

# Skip tests during build
mvn clean install -DskipTests

# Run tests in parallel
mvn test -DforkCount=4

# Generate coverage report
mvn clean test jacoco:report
```

## Summary

✅ **39 comprehensive tests** covering:
- User registration and authentication
- Role-based access control
- CRUD operations
- Data validation
- Error handling
- Complete user workflows

All tests are **automated**, **fast**, and **reliable** for continuous integration! 🚀
