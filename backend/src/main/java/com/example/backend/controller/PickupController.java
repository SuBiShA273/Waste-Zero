package com.example.backend.controller;

import com.example.backend.dto.CreatePickupRequest;
import com.example.backend.dto.CustomerDashboardStatsResponse;
import com.example.backend.dto.PickupResponse;
import com.example.backend.service.PickupService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pickups")
@Tag(name = "Waste Pickups", description = "Endpoints for scheduling, retrieving, and cancelling customer waste pickup requests")
public class PickupController {

    private final PickupService pickupService;

    public PickupController(PickupService pickupService) {
        this.pickupService = pickupService;
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Request a new waste pickup (Customer only)")
    public ResponseEntity<PickupResponse> createPickup(
            @Valid @RequestBody CreatePickupRequest request,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        PickupResponse response = pickupService.createPickup(request, userEmail);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Get pickup history for the authenticated customer")
    public ResponseEntity<List<PickupResponse>> getMyPickups(Authentication authentication) {
        String userEmail = authentication.getName();
        List<PickupResponse> pickups = pickupService.getMyPickups(userEmail);
        return ResponseEntity.ok(pickups);
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Get customer pickup dashboard statistics")
    public ResponseEntity<CustomerDashboardStatsResponse> getDashboardStats(Authentication authentication) {
        String userEmail = authentication.getName();
        CustomerDashboardStatsResponse stats = pickupService.getDashboardStats(userEmail);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Get specific pickup details by ID")
    public ResponseEntity<PickupResponse> getPickupById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        PickupResponse response = pickupService.getPickupById(id, userEmail);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Cancel a pending pickup request (Customer only)")
    public ResponseEntity<PickupResponse> cancelPickup(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        PickupResponse response = pickupService.cancelPickup(id, userEmail);
        return ResponseEntity.ok(response);
    }
}
