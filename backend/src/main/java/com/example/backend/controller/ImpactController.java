package com.example.backend.controller;

import com.example.backend.dto.CustomerImpactResponse;
import com.example.backend.service.ImpactService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/impact")
@Tag(name = "Environmental Impact", description = "Endpoints for environmental impact reporting")
public class ImpactController {

    private final ImpactService impactService;

    public ImpactController(ImpactService impactService) {
        this.impactService = impactService;
    }

    @GetMapping("/my")
    @Operation(summary = "Get environmental impact data for the authenticated customer")
    public ResponseEntity<CustomerImpactResponse> getMyImpact(Authentication authentication) {
        String email = authentication.getName();
        CustomerImpactResponse response = impactService.getCustomerImpact(email);
        return ResponseEntity.ok(response);
    }
}
