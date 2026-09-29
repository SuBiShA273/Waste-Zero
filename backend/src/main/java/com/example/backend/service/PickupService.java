package com.example.backend.service;

import com.example.backend.dto.CreatePickupRequest;
import com.example.backend.dto.CustomerDashboardStatsResponse;
import com.example.backend.dto.PickupResponse;
import com.example.backend.entity.Pickup;
import com.example.backend.entity.PickupStatus;
import com.example.backend.entity.User;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.PickupRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PickupService {

    private final PickupRepository pickupRepository;
    private final UserRepository userRepository;
    private final AssignmentService assignmentService;

    public PickupService(PickupRepository pickupRepository, UserRepository userRepository, AssignmentService assignmentService) {
        this.pickupRepository = pickupRepository;
        this.userRepository = userRepository;
        this.assignmentService = assignmentService;
    }

    @Transactional
    public PickupResponse createPickup(CreatePickupRequest request, String userEmail) {
        User customer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated customer profile not found"));

        Pickup pickup = new Pickup(
                customer,
                request.getWasteCategory(),
                request.getDescription(),
                request.getPickupAddress(),
                request.getPreferredDate(),
                request.getPreferredTime()
        );
        pickup.setServiceArea(request.getServiceArea());
        pickup.setStatus(PickupStatus.REQUESTED);

        Pickup saved = pickupRepository.save(pickup);

        // Smart Collector Assignment Service call
        assignmentService.assignCollectorToPickup(saved);

        return PickupResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<PickupResponse> getMyPickups(String userEmail) {
        User customer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated customer profile not found"));

        List<Pickup> pickups = pickupRepository.findByCustomerIdOrderByCreatedAtDesc(customer.getId());
        return pickups.stream()
                .map(PickupResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PickupResponse getPickupById(Long pickupId, String userEmail) {
        User customer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated customer profile not found"));

        Pickup pickup = pickupRepository.findById(pickupId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup request not found with ID: " + pickupId));

        if (!pickup.getCustomer().getId().equals(customer.getId())) {
            throw new AccessDeniedException("Access denied: You are not authorized to view another customer's pickup request");
        }

        return PickupResponse.fromEntity(pickup);
    }

    @Transactional
    public PickupResponse cancelPickup(Long pickupId, String userEmail) {
        User customer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated customer profile not found"));

        Pickup pickup = pickupRepository.findById(pickupId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup request not found with ID: " + pickupId));

        if (!pickup.getCustomer().getId().equals(customer.getId())) {
            throw new AccessDeniedException("Access denied: You are not authorized to cancel another customer's pickup request");
        }

        if (pickup.getStatus() != PickupStatus.REQUESTED && pickup.getStatus() != PickupStatus.ASSIGNED && pickup.getStatus() != PickupStatus.REASSIGNABLE) {
            throw new IllegalStateException("Only pending/assigned pickup requests prior to acceptance can be cancelled. Current status is " + pickup.getStatus());
        }

        pickup.setStatus(PickupStatus.CANCELLED);
        Pickup updated = pickupRepository.save(pickup);
        return PickupResponse.fromEntity(updated);
    }

    @Transactional(readOnly = true)
    public CustomerDashboardStatsResponse getDashboardStats(String userEmail) {
        User customer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated customer profile not found"));

        long total = pickupRepository.countByCustomerId(customer.getId());
        long completed = pickupRepository.countByCustomerIdAndStatus(customer.getId(), PickupStatus.RECYCLED)
                + pickupRepository.countByCustomerIdAndStatus(customer.getId(), PickupStatus.COLLECTED);
        long cancelled = pickupRepository.countByCustomerIdAndStatus(customer.getId(), PickupStatus.CANCELLED);
        long pending = Math.max(0, total - completed - cancelled);

        return new CustomerDashboardStatsResponse(total, completed, pending, cancelled);
    }
}
