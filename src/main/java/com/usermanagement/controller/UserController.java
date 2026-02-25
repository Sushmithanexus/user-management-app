package com.usermanagement.controller;

import com.usermanagement.config.JwtUtil;
import com.usermanagement.dto.LoginRequest;
import com.usermanagement.dto.LoginResponse;
import com.usermanagement.dto.UserDTO;
import com.usermanagement.entity.User;
import com.usermanagement.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * User Controller - REST API Endpoints
 * Handles HTTP requests for user management operations
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @Autowired
    public UserController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    /**
     * POST /api/auth/signup - Register a new user
     */
    @PostMapping("/auth/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody User user) {
        try {
            User registeredUser = userService.registerUser(user);
            UserDTO userDTO = userService.convertToDTO(registeredUser);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("user", userDTO);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * POST /api/auth/login - Authenticate user and return JWT token
     */
    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            User user = userService.authenticateUser(loginRequest.getUsername(), loginRequest.getPassword());
            String token = jwtUtil.generateToken(user.getUsername());

            LoginResponse response = new LoginResponse(
                    token,
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole(),
                    user.getId()
            );

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    /**
     * GET /api/users - Get all users (authenticated)
     */
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * GET /api/users/{id} - Get user by ID (authenticated)
     */
    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            UserDTO userDTO = userService.convertToDTO(user);
            return ResponseEntity.ok(userDTO);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    /**
     * GET /api/users/me - Get current authenticated user
     */
    @GetMapping("/users/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userService.getUserByUsername(username);
            UserDTO userDTO = userService.convertToDTO(user);
            return ResponseEntity.ok(userDTO);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    /**
     * PUT /api/users/{id} - Update user (authenticated)
     * ADMIN can update any user. Regular users can only update their own profile.
     */
    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User user) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUsername = authentication.getName();
            User currentUser = userService.getUserByUsername(currentUsername);

            // Regular users can only update their own profile
            if (!"ADMIN".equals(currentUser.getRole()) && !currentUser.getId().equals(id)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "You can only update your own profile");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
            }

            User updatedUser = userService.updateUser(id, user);
            UserDTO userDTO = userService.convertToDTO(updatedUser);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "User updated successfully");
            response.put("user", userDTO);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * DELETE /api/users/{id} - Delete user (authenticated)
     * Only ADMIN can delete users. ADMIN cannot delete their own account.
     * Regular users cannot delete any account.
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUsername = authentication.getName();
            User currentUser = userService.getUserByUsername(currentUsername);

            // Only ADMIN can delete users
            if (!"ADMIN".equals(currentUser.getRole())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Only admins can delete accounts");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
            }

            // ADMIN cannot delete their own account
            if (currentUser.getId().equals(id)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Admin cannot delete their own account");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
            }

            userService.deleteUser(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "User deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
}
