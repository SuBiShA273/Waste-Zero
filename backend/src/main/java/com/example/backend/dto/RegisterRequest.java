package com.example.backend.dto;

import com.example.backend.entity.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
    private String name;

    @NotBlank(message = "Email address is required")
    @Pattern(
        regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
        message = "Must be a valid email address (e.g. user@example.com)"
    )
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(
        regexp = "^\\+?[0-9]{10,15}$",
        message = "Phone number must contain 10 to 15 digits (e.g. 9876543210 or +1234567890)"
    )
    private String phone;

    @NotBlank(message = "Password is required")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&._\\-#])[A-Za-z\\d@$!%*?&._\\-#]{8,}$",
        message = "Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character (@$!%*?&._-#)"
    )
    private String password;

    private String role;

    private String serviceArea;

    public RegisterRequest() {}

    public RegisterRequest(String name, String email, String password, String phone, String role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.role = role;
    }

    public RegisterRequest(String name, String email, String password, String phone, String role, String serviceArea) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.role = role;
        this.serviceArea = serviceArea;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getServiceArea() {
        return serviceArea;
    }

    public void setServiceArea(String serviceArea) {
        this.serviceArea = serviceArea;
    }

    public Role getRoleAsEnum() {
        if (role == null || role.trim().isEmpty()) {
            return Role.CUSTOMER;
        }
        String cleanRole = role.trim().toUpperCase();
        if ("COLLECTOR".equals(cleanRole)) {
            return Role.COLLECTOR;
        }
        if ("ADMIN".equals(cleanRole)) {
            return Role.ADMIN;
        }
        return Role.CUSTOMER;
    }
}
