package com.example.backend.controller;

import com.example.backend.dto.*;
import com.example.backend.service.CollectorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/collector")
@PreAuthorize("hasRole('COLLECTOR')")
@Tag(name = "Collector System", description = "Endpoints for collector workflow, assigned pickups, status updates, and proof upload")
public class CollectorController {

    private final CollectorService collectorService;

    public CollectorController(CollectorService collectorService) {
        this.collectorService = collectorService;
    }

    @GetMapping("/stats")
    @Operation(summary = "Get dashboard statistics for the authenticated collector")
    public ResponseEntity<CollectorDashboardStatsResponse> getDashboardStats(Authentication authentication) {
        String email = authentication.getName();
        CollectorDashboardStatsResponse stats = collectorService.getDashboardStats(email);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/pickups")
    @Operation(summary = "Get list of pickups assigned to the authenticated collector")
    public ResponseEntity<List<PickupResponse>> getAssignedPickups(
            @RequestParam(required = false) String status,
            Authentication authentication
    ) {
        String email = authentication.getName();
        List<PickupResponse> pickups = collectorService.getAssignedPickups(email, status);
        return ResponseEntity.ok(pickups);
    }

    @GetMapping("/pickups/history")
    @Operation(summary = "Get completed and past pickup history for the authenticated collector")
    public ResponseEntity<List<PickupResponse>> getPickupHistory(Authentication authentication) {
        String email = authentication.getName();
        List<PickupResponse> history = collectorService.getPickupHistory(email);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/pickups/{id}")
    @Operation(summary = "Get details of a specific assigned pickup request")
    public ResponseEntity<PickupResponse> getPickupById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String email = authentication.getName();
        PickupResponse response = collectorService.getPickupById(id, email);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/pickups/{id}/accept")
    @Operation(summary = "Accept an assigned pickup request")
    public ResponseEntity<PickupResponse> acceptPickup(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String email = authentication.getName();
        PickupResponse response = collectorService.acceptPickup(id, email);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/pickups/{id}/reject")
    @Operation(summary = "Reject an assigned pickup request with an optional reason")
    public ResponseEntity<PickupResponse> rejectPickup(
            @PathVariable Long id,
            @RequestBody(required = false) RejectPickupRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();
        PickupResponse response = collectorService.rejectPickup(id, request, email);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/pickups/{id}/status")
    @Operation(summary = "Update pickup progress through valid collector stages (ACCEPTED -> ON_THE_WAY -> ARRIVED)")
    public ResponseEntity<PickupResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();
        PickupResponse response = collectorService.updateStatus(id, request, email);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/pickups/{id}/complete")
    @Operation(summary = "Finalize collection with actual collected weight and notes (Status moves to COLLECTED)")
    public ResponseEntity<PickupResponse> completeCollection(
            @PathVariable Long id,
            @Valid @RequestBody CompleteCollectionRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();
        PickupResponse response = collectorService.completeCollection(id, request, email);
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/pickups/{id}/proof", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload photo proof of collection for an assigned pickup")
    public ResponseEntity<PickupResponse> uploadCollectionProof(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) {
        String email = authentication.getName();
        PickupResponse response = collectorService.uploadCollectionProof(id, file, email);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/profile/availability")
    @Operation(summary = "Update collector availability (AVAILABLE, BUSY, OFFLINE)")
    public ResponseEntity<UserResponse> updateAvailability(
            @Valid @RequestBody UpdateAvailabilityRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();
        UserResponse response = collectorService.updateAvailability(request, email);
        return ResponseEntity.ok(response);
    }
}
