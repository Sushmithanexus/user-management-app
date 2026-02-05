package com.usermanagement.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.usermanagement.dto.LoginRequest;
import com.usermanagement.entity.User;
import com.usermanagement.repository.UserRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration Tests for User Management Application
 * Tests the full application stack with real database
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@DisplayName("User Management Integration Tests")
class UserManagementIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    private static String adminToken;
    private static String userToken;
    private static Long adminUserId;
    private static Long regularUserId;

    @BeforeEach
    void setUp() {
        // Clean database before each test
        userRepository.deleteAll();
    }

    @Test
    @Order(1)
    @DisplayName("Integration Test 1: Register first user as ADMIN")
    void testRegisterFirstUserAsAdmin() throws Exception {
        // Arrange
        User user = new User();
        user.setUsername("admin");
        user.setEmail("admin@example.com");
        user.setPassword("Admin@123456");
        user.setPhoneNumber("1234567890");

        // Act & Assert
        MvcResult result = mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("User registered successfully"))
                .andExpect(jsonPath("$.user.username").value("admin"))
                .andExpect(jsonPath("$.user.role").value("ADMIN"))
                .andExpect(jsonPath("$.user.email").value("admin@example.com"))
                .andReturn();

        // Extract user ID for later tests
        String response = result.getResponse().getContentAsString();
        adminUserId = objectMapper.readTree(response).get("user").get("id").asLong();
    }

    @Test
    @Order(2)
    @DisplayName("Integration Test 2: Login as ADMIN and get JWT token")
    void testLoginAsAdmin() throws Exception {
        // First register admin
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@example.com");
        admin.setPassword("Admin@123456");
        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(admin)));

        // Arrange
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("admin");
        loginRequest.setPassword("Admin@123456");

        // Act & Assert
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.username").value("admin"))
                .andExpect(jsonPath("$.role").value("ADMIN"))
                .andReturn();

        // Extract token for later tests
        String response = result.getResponse().getContentAsString();
        adminToken = objectMapper.readTree(response).get("token").asText();
    }

    @Test
    @Order(3)
    @DisplayName("Integration Test 3: Register second user as USER")
    void testRegisterSecondUserAsRegularUser() throws Exception {
        // Register first user
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@example.com");
        admin.setPassword("Admin@123456");
        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(admin)));

        // Arrange - second user
        User user = new User();
        user.setUsername("regularuser");
        user.setEmail("user@example.com");
        user.setPassword("User@123456");

        // Act & Assert
        MvcResult result = mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.user.username").value("regularuser"))
                .andExpect(jsonPath("$.user.role").value("USER"))
                .andReturn();

        String response = result.getResponse().getContentAsString();
        regularUserId = objectMapper.readTree(response).get("user").get("id").asLong();
    }

    @Test
    @Order(4)
    @DisplayName("Integration Test 4: Prevent duplicate username registration")
    void testPreventDuplicateUsername() throws Exception {
        // Register first user
        User user1 = new User();
        user1.setUsername("testuser");
        user1.setEmail("test1@example.com");
        user1.setPassword("Password@123");

        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user1)))
                .andExpect(status().isCreated());

        // Try to register with same username
        User user2 = new User();
        user2.setUsername("testuser");
        user2.setEmail("test2@example.com");
        user2.setPassword("Password@123");

        // Act & Assert
        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user2)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Username already exists"));
    }

    @Test
    @Order(5)
    @DisplayName("Integration Test 5: Prevent duplicate email registration")
    void testPreventDuplicateEmail() throws Exception {
        // Register first user
        User user1 = new User();
        user1.setUsername("user1");
        user1.setEmail("duplicate@example.com");
        user1.setPassword("Password@123");

        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user1)))
                .andExpect(status().isCreated());

        // Try to register with same email
        User user2 = new User();
        user2.setUsername("user2");
        user2.setEmail("duplicate@example.com");
        user2.setPassword("Password@123");

        // Act & Assert
        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user2)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Email already exists"));
    }

    @Test
    @Order(6)
    @DisplayName("Integration Test 6: Login with invalid credentials fails")
    void testLoginWithInvalidCredentials() throws Exception {
        // Register user
        User user = new User();
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPassword("CorrectPassword@123");

        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)));

        // Try to login with wrong password
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("WrongPassword@123");

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Invalid username or password"));
    }

    @Test
    @Order(7)
    @DisplayName("Integration Test 7: Get all users with authentication")
    void testGetAllUsersWithAuth() throws Exception {
        // Register and login as admin
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@example.com");
        admin.setPassword("Admin@123456");
        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(admin)));

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("admin");
        loginRequest.setPassword("Admin@123456");

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andReturn();

        String token = objectMapper.readTree(loginResult.getResponse().getContentAsString())
                .get("token").asText();

        // Register another user
        User user = new User();
        user.setUsername("user1");
        user.setEmail("user1@example.com");
        user.setPassword("User@123456");
        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)));

        // Get all users
        mockMvc.perform(get("/api/users")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].username").value("admin"))
                .andExpect(jsonPath("$[1].username").value("user1"));
    }

    @Test
    @Order(8)
    @DisplayName("Integration Test 8: Get user by ID with authentication")
    void testGetUserByIdWithAuth() throws Exception {
        // Register and login
        User user = new User();
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPassword("Password@123");

        MvcResult signupResult = mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
                .andReturn();

        Long userId = objectMapper.readTree(signupResult.getResponse().getContentAsString())
                .get("user").get("id").asLong();

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("Password@123");

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andReturn();

        String token = objectMapper.readTree(loginResult.getResponse().getContentAsString())
                .get("token").asText();

        // Get user by ID
        mockMvc.perform(get("/api/users/" + userId)
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    @Order(9)
    @DisplayName("Integration Test 9: Update user profile")
    void testUpdateUserProfile() throws Exception {
        // Register and login
        User user = new User();
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPassword("Password@123");

        MvcResult signupResult = mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
                .andReturn();

        Long userId = objectMapper.readTree(signupResult.getResponse().getContentAsString())
                .get("user").get("id").asLong();

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("Password@123");

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andReturn();

        String token = objectMapper.readTree(loginResult.getResponse().getContentAsString())
                .get("token").asText();

        // Update user
        User updatedUser = new User();
        updatedUser.setPhoneNumber("9876543210");
        updatedUser.setDateOfBirth("1990-01-01");

        mockMvc.perform(put("/api/users/" + userId)
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User updated successfully"));
    }

    @Test
    @Order(10)
    @DisplayName("Integration Test 10: Complete user lifecycle")
    void testCompleteUserLifecycle() throws Exception {
        // 1. Register
        User user = new User();
        user.setUsername("lifecycle");
        user.setEmail("lifecycle@example.com");
        user.setPassword("Password@123");

        MvcResult signupResult = mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isCreated())
                .andReturn();

        Long userId = objectMapper.readTree(signupResult.getResponse().getContentAsString())
                .get("user").get("id").asLong();

        // 2. Login
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("lifecycle");
        loginRequest.setPassword("Password@123");

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String token = objectMapper.readTree(loginResult.getResponse().getContentAsString())
                .get("token").asText();

        // 3. Get current user
        mockMvc.perform(get("/api/users/me")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("lifecycle"));

        // 4. Update profile
        User updateData = new User();
        updateData.setPhoneNumber("1234567890");

        mockMvc.perform(put("/api/users/" + userId)
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateData)))
                .andExpect(status().isOk());

        // 5. Delete own account
        mockMvc.perform(delete("/api/users/" + userId)
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User deleted successfully"));
    }
}
