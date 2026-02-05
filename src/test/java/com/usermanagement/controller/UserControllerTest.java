package com.usermanagement.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.usermanagement.config.JwtUtil;
import com.usermanagement.dto.LoginRequest;
import com.usermanagement.dto.UserDTO;
import com.usermanagement.entity.User;
import com.usermanagement.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Unit Tests for UserController
 * Tests REST API endpoints with mocked services
 */
@WebMvcTest(UserController.class)
@DisplayName("UserController Unit Tests")
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtUtil jwtUtil;

    private User testUser;
    private UserDTO testUserDTO;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("password123");
        testUser.setRole("USER");

        testUserDTO = new UserDTO(1L, "testuser", "test@example.com", "USER", null, null, null);
    }

    @Test
    @DisplayName("Should signup new user successfully")
    void testSignup_Success() throws Exception {
        // Arrange
        when(userService.registerUser(any(User.class))).thenReturn(testUser);
        when(userService.convertToDTO(any(User.class))).thenReturn(testUserDTO);

        // Act & Assert
        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testUser)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("User registered successfully"))
                .andExpect(jsonPath("$.user.username").value("testuser"))
                .andExpect(jsonPath("$.user.email").value("test@example.com"));

        verify(userService).registerUser(any(User.class));
        verify(userService).convertToDTO(any(User.class));
    }

    @Test
    @DisplayName("Should return error when signup with duplicate username")
    void testSignup_DuplicateUsername() throws Exception {
        // Arrange
        when(userService.registerUser(any(User.class)))
                .thenThrow(new RuntimeException("Username already exists"));

        // Act & Assert
        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testUser)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Username already exists"));
    }

    @Test
    @DisplayName("Should login successfully with valid credentials")
    void testLogin_Success() throws Exception {
        // Arrange
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password123");

        when(userService.authenticateUser(anyString(), anyString())).thenReturn(testUser);
        when(jwtUtil.generateToken(anyString())).thenReturn("mock-jwt-token");

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mock-jwt-token"))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.role").value("USER"));

        verify(userService).authenticateUser("testuser", "password123");
        verify(jwtUtil).generateToken("testuser");
    }

    @Test
    @DisplayName("Should return error when login with invalid credentials")
    void testLogin_InvalidCredentials() throws Exception {
        // Arrange
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("wrongpassword");

        when(userService.authenticateUser(anyString(), anyString()))
                .thenThrow(new RuntimeException("Invalid username or password"));

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Invalid username or password"));
    }

    @Test
    @WithMockUser(username = "testuser")
    @DisplayName("Should get all users when authenticated")
    void testGetAllUsers_Success() throws Exception {
        // Arrange
        UserDTO user2DTO = new UserDTO(2L, "user2", "user2@example.com", "USER", null, null, null);
        List<UserDTO> users = Arrays.asList(testUserDTO, user2DTO);

        when(userService.getAllUsers()).thenReturn(users);

        // Act & Assert
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].username").value("testuser"))
                .andExpect(jsonPath("$[1].username").value("user2"));

        verify(userService).getAllUsers();
    }

    @Test
    @WithMockUser(username = "testuser")
    @DisplayName("Should get user by ID successfully")
    void testGetUserById_Success() throws Exception {
        // Arrange
        when(userService.getUserById(1L)).thenReturn(testUser);
        when(userService.convertToDTO(any(User.class))).thenReturn(testUserDTO);

        // Act & Assert
        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"));

        verify(userService).getUserById(1L);
    }

    @Test
    @WithMockUser(username = "testuser")
    @DisplayName("Should return 404 when user not found")
    void testGetUserById_NotFound() throws Exception {
        // Arrange
        when(userService.getUserById(999L))
                .thenThrow(new RuntimeException("User not found with id: 999"));

        // Act & Assert
        mockMvc.perform(get("/api/users/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("User not found with id: 999"));
    }

    @Test
    @WithMockUser(username = "testuser")
    @DisplayName("Should get current user successfully")
    void testGetCurrentUser_Success() throws Exception {
        // Arrange
        when(userService.getUserByUsername("testuser")).thenReturn(testUser);
        when(userService.convertToDTO(any(User.class))).thenReturn(testUserDTO);

        // Act & Assert
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"));

        verify(userService).getUserByUsername("testuser");
    }

    @Test
    @WithMockUser(username = "testuser")
    @DisplayName("Should update user successfully")
    void testUpdateUser_Success() throws Exception {
        // Arrange
        User updatedUser = new User();
        updatedUser.setUsername("updateduser");
        updatedUser.setEmail("updated@example.com");

        when(userService.getUserByUsername("testuser")).thenReturn(testUser);
        when(userService.updateUser(eq(1L), any(User.class))).thenReturn(testUser);
        when(userService.convertToDTO(any(User.class))).thenReturn(testUserDTO);

        // Act & Assert
        mockMvc.perform(put("/api/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User updated successfully"));

        verify(userService).updateUser(eq(1L), any(User.class));
    }

    @Test
    @WithMockUser(username = "testuser", roles = "ADMIN")
    @DisplayName("Should delete user as admin successfully")
    void testDeleteUser_AsAdmin_Success() throws Exception {
        // Arrange
        User adminUser = new User();
        adminUser.setId(1L);
        adminUser.setUsername("testuser");
        adminUser.setRole("ADMIN");

        when(userService.getUserByUsername("testuser")).thenReturn(adminUser);
        doNothing().when(userService).deleteUser(2L);

        // Act & Assert
        mockMvc.perform(delete("/api/users/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User deleted successfully"));

        verify(userService).deleteUser(2L);
    }

    @Test
    @WithMockUser(username = "testuser")
    @DisplayName("Should delete own account as regular user")
    void testDeleteUser_OwnAccount_Success() throws Exception {
        // Arrange
        when(userService.getUserByUsername("testuser")).thenReturn(testUser);
        doNothing().when(userService).deleteUser(1L);

        // Act & Assert
        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User deleted successfully"));

        verify(userService).deleteUser(1L);
    }

    @Test
    @WithMockUser(username = "testuser")
    @DisplayName("Should not allow regular user to delete other users")
    void testDeleteUser_OtherUser_Forbidden() throws Exception {
        // Arrange
        when(userService.getUserByUsername("testuser")).thenReturn(testUser);

        // Act & Assert
        mockMvc.perform(delete("/api/users/2"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error").value("You can only delete your own account"));

        verify(userService, never()).deleteUser(2L);
    }
}
