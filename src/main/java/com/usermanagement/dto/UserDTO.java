package com.usermanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * User Data Transfer Object
 * Used to transfer user data without exposing sensitive information like password
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String role;
    private String phoneNumber;
    private String dateOfBirth;
    private LocalDateTime createdAt;
}
