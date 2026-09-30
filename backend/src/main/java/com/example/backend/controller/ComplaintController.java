package com.example.backend.controller;

import com.example.backend.dto.ComplaintResponse;
import com.example.backend.dto.CreateComplaintRequest;
import com.example.backend.service.ComplaintService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@Tag(name = "Customer Complaints", description = "Endpoints for submitting and viewing customer complaints")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @PostMapping
    @Operation(summary = "Submit a new complaint or support ticket")
    public ResponseEntity<ComplaintResponse> createComplaint(
            @Valid @RequestBody CreateComplaintRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();
        ComplaintResponse response = complaintService.createComplaint(request, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/my")
    @Operation(summary = "Get all complaints for the authenticated customer")
    public ResponseEntity<List<ComplaintResponse>> getMyComplaints(Authentication authentication) {
        String email = authentication.getName();
        List<ComplaintResponse> response = complaintService.getMyComplaints(email);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get complaint details by ID")
    public ResponseEntity<ComplaintResponse> getComplaintById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String email = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        ComplaintResponse response = complaintService.getComplaintById(id, email, isAdmin);
        return ResponseEntity.ok(response);
    }
}
