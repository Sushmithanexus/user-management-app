package com.usermanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Spring Boot Application class for User Management System
 * This class bootstraps the entire Spring Boot application
 */
@SpringBootApplication
public class UserManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserManagementApplication.class, args);
        System.out.println("\n========================================");
        System.out.println("User Management Application Started!");
        System.out.println("Backend API: http://localhost:8080");
        System.out.println("H2 Console: http://localhost:8080/h2-console");
        System.out.println("========================================\n");
    }
}
