package com.example.backend.controller;

import com.example.backend.dto.ComplaintResponse;
import com.example.backend.dto.PickupResponse;
import com.example.backend.dto.RecyclePickupRequest;
import com.example.backend.dto.UpdateComplaintRequest;
import com.example.backend.service.ComplaintService;
import com.example.backend.service.PickupService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Management", description = "Admin-only endpoints for recycling confirmation and complaint management")
public class AdminController {

    private final PickupService pickupService;
    private final ComplaintService complaintService;

    public AdminController(PickupService pickupService, ComplaintService complaintService) {
        this.pickupService = pickupService;
        this.complaintService = complaintService;
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

    @GetMapping("/pickups")
    @Operation(summary = "Get all pickups in the system for admin overview")
    public ResponseEntity<List<PickupResponse>> getAllPickups() {
        List<PickupResponse> pickups = pickupService.getAllPickupsForAdmin();
        return ResponseEntity.ok(pickups);
    }

    @GetMapping("/complaints")
    @Operation(summary = "Get all customer complaints for admin overview")
    public ResponseEntity<List<ComplaintResponse>> getAllComplaints() {
        List<ComplaintResponse> complaints = complaintService.getAllComplaintsForAdmin();
        return ResponseEntity.ok(complaints);
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
