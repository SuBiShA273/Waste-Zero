package com.example.backend.controller;

import com.example.backend.dto.*;
import com.example.backend.entity.ComplaintStatus;
import com.example.backend.entity.PickupStatus;
import com.example.backend.entity.Role;
import com.example.backend.entity.WasteCategory;
import com.example.backend.service.AdminService;
import com.example.backend.service.ComplaintService;
import com.example.backend.service.PickupService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Management", description = "Admin-only management endpoints for WasteZero platform")
public class AdminController {

    private final AdminService adminService;
    private final PickupService pickupService;
    private final ComplaintService complaintService;

    public AdminController(
            AdminService adminService,
            PickupService pickupService,
            ComplaintService complaintService
    ) {
        this.adminService = adminService;
        this.pickupService = pickupService;
        this.complaintService = complaintService;
    }

    @GetMapping("/dashboard/stats")
    @Operation(summary = "Get aggregated real-time system statistics for Admin Dashboard")
    public ResponseEntity<AdminDashboardStatsResponse> getDashboardStats() {
        AdminDashboardStatsResponse stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    @Operation(summary = "Get list of registered users with optional search and role/status filtering")
    public ResponseEntity<List<UserAdminResponse>> getUsers(
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) String search
    ) {
        List<UserAdminResponse> users = adminService.getAllUsers(role, active, search);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}")
    @Operation(summary = "Get details of a specific user by ID")
    public ResponseEntity<UserAdminResponse> getUserById(@PathVariable Long id) {
        UserAdminResponse user = adminService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PatchMapping("/users/{id}/status")
    @Operation(summary = "Enable or disable a user account")
    public ResponseEntity<UserAdminResponse> toggleUserStatus(
            @PathVariable Long id,
            @RequestBody UpdateUserStatusRequest request,
            Authentication authentication
    ) {
        String adminEmail = authentication.getName();
        UserAdminResponse updated = adminService.toggleUserStatus(id, request.getActive(), adminEmail);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/collectors")
    @Operation(summary = "Get detailed overview of all waste collectors")
    public ResponseEntity<List<UserAdminResponse>> getCollectors() {
        List<UserAdminResponse> collectors = adminService.getAllCollectors();
        return ResponseEntity.ok(collectors);
    }

    @GetMapping("/pickups")
    @Operation(summary = "Get all pickups with optional status and category filtering")
    public ResponseEntity<List<PickupResponse>> getAllPickups(
            @RequestParam(required = false) PickupStatus status,
            @RequestParam(required = false) WasteCategory category
    ) {
        List<PickupResponse> pickups = pickupService.getAllPickupsForAdmin();

        if (status != null) {
            pickups = pickups.stream()
                    .filter(p -> p.getStatus() == status)
                    .collect(Collectors.toList());
        }

        if (category != null) {
            pickups = pickups.stream()
                    .filter(p -> p.getWasteCategory() == category)
                    .collect(Collectors.toList());
        }

        return ResponseEntity.ok(pickups);
    }

    @GetMapping("/pickups/{id}")
    @Operation(summary = "Get single pickup request details for Admin")
    public ResponseEntity<PickupResponse> getPickupById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String adminEmail = authentication.getName();
        PickupResponse response = pickupService.getPickupById(id, adminEmail);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/pickups/{id}/recycle")
    @Operation(summary = "Admin recycling confirmation (COLLECTED -> RECYCLED)")
    public ResponseEntity<PickupResponse> recyclePickup(
            @PathVariable Long id,
            @RequestBody(required = false) RecyclePickupRequest request,
            Authentication authentication
    ) {
        String adminEmail = authentication.getName();
        PickupResponse response = pickupService.recyclePickup(id, request, adminEmail);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/complaints")
    @Operation(summary = "Get all customer complaints with optional status filter")
    public ResponseEntity<List<ComplaintResponse>> getAllComplaints(
            @RequestParam(required = false) ComplaintStatus status
    ) {
        List<ComplaintResponse> complaints = complaintService.getAllComplaintsForAdmin();

        if (status != null) {
            complaints = complaints.stream()
                    .filter(c -> c.getStatus() == status)
                    .collect(Collectors.toList());
        }

        return ResponseEntity.ok(complaints);
    }

    @GetMapping("/complaints/{id}")
    @Operation(summary = "Get detailed view of a single complaint")
    public ResponseEntity<ComplaintResponse> getComplaintById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String adminEmail = authentication.getName();
        ComplaintResponse complaint = complaintService.getComplaintById(id, adminEmail, true);
        return ResponseEntity.ok(complaint);
    }

    @PatchMapping("/complaints/{id}")
    @Operation(summary = "Admin update complaint status or add response")
    public ResponseEntity<ComplaintResponse> updateComplaint(
            @PathVariable Long id,
            @RequestBody UpdateComplaintRequest request,
            Authentication authentication
    ) {
        String adminEmail = authentication.getName();
        ComplaintResponse response = complaintService.updateComplaintByAdmin(id, request, adminEmail);
        return ResponseEntity.ok(response);
    }
}
