package com.example.backend.dto;

import com.example.backend.entity.CollectorAvailability;
import com.example.backend.entity.Role;
import com.example.backend.entity.User;

import java.time.LocalDateTime;

public class UserAdminResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private Role role;
    private CollectorAvailability availability;
    private String serviceArea;
    private boolean active;
    private LocalDateTime createdAt;
    private long totalPickupsCount;
    private long activeWorkload;
    private long completedPickupsCount;

    public UserAdminResponse() {}

    public UserAdminResponse(Long id, String name, String email, String phone, Role role,
                             CollectorAvailability availability, String serviceArea, boolean active,
                             LocalDateTime createdAt, long totalPickupsCount, long activeWorkload,
                             long completedPickupsCount) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.availability = availability;
        this.serviceArea = serviceArea;
        this.active = active;
        this.createdAt = createdAt;
        this.totalPickupsCount = totalPickupsCount;
        this.activeWorkload = activeWorkload;
        this.completedPickupsCount = completedPickupsCount;
    }

    public static UserAdminResponse fromEntity(User user, long totalPickupsCount, long activeWorkload, long completedPickupsCount) {
        return new UserAdminResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getAvailability(),
                user.getServiceArea(),
                user.isActive(),
                user.getCreatedAt(),
                totalPickupsCount,
                activeWorkload,
                completedPickupsCount
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public CollectorAvailability getAvailability() {
        return availability;
    }

    public void setAvailability(CollectorAvailability availability) {
        this.availability = availability;
    }

    public String getServiceArea() {
        return serviceArea;
    }

    public void setServiceArea(String serviceArea) {
        this.serviceArea = serviceArea;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public long getTotalPickupsCount() {
        return totalPickupsCount;
    }

    public void setTotalPickupsCount(long totalPickupsCount) {
        this.totalPickupsCount = totalPickupsCount;
    }

    public long getActiveWorkload() {
        return activeWorkload;
    }

    public void setActiveWorkload(long activeWorkload) {
        this.activeWorkload = activeWorkload;
    }

    public long getCompletedPickupsCount() {
        return completedPickupsCount;
    }

    public void setCompletedPickupsCount(long completedPickupsCount) {
        this.completedPickupsCount = completedPickupsCount;
    }
}
