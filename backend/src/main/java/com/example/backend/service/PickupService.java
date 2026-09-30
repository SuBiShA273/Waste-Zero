package com.example.backend.service;

import com.example.backend.dto.CreatePickupRequest;
import com.example.backend.dto.CustomerDashboardStatsResponse;
import com.example.backend.dto.PickupResponse;
import com.example.backend.dto.RecyclePickupRequest;
import com.example.backend.entity.Pickup;
import com.example.backend.entity.PickupStatus;
import com.example.backend.entity.PickupStatusHistory;
import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.PickupRepository;
import com.example.backend.repository.PickupStatusHistoryRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PickupService {

    private final PickupRepository pickupRepository;
    private final UserRepository userRepository;
    private final AssignmentService assignmentService;
    private final PickupStatusHistoryRepository pickupStatusHistoryRepository;

    public PickupService(
            PickupRepository pickupRepository,
            UserRepository userRepository,
            AssignmentService assignmentService,
            PickupStatusHistoryRepository pickupStatusHistoryRepository
    ) {
        this.pickupRepository = pickupRepository;
        this.userRepository = userRepository;
        this.assignmentService = assignmentService;
        this.pickupStatusHistoryRepository = pickupStatusHistoryRepository;
    }

    public void recordStatusHistory(Pickup pickup, PickupStatus status, User changedBy, String notes) {
        PickupStatusHistory history = new PickupStatusHistory(pickup, status, changedBy, notes);
        pickupStatusHistoryRepository.save(history);
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

        recordStatusHistory(saved, PickupStatus.REQUESTED, customer, "Pickup requested by customer");

        // Smart Collector Assignment Service call
        assignmentService.assignCollectorToPickup(saved);

        List<PickupStatusHistory> histories = pickupStatusHistoryRepository.findByPickupIdOrderByChangedAtAsc(saved.getId());
        return PickupResponse.fromEntity(saved, histories);
    }

    @Transactional(readOnly = true)
    public List<PickupResponse> getMyPickups(String userEmail) {
        User customer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated customer profile not found"));

        List<Pickup> pickups = pickupRepository.findByCustomerIdOrderByCreatedAtDesc(customer.getId());
        return pickups.stream()
                .map(p -> {
                    List<PickupStatusHistory> histories = pickupStatusHistoryRepository.findByPickupIdOrderByChangedAtAsc(p.getId());
                    return PickupResponse.fromEntity(p, histories);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PickupResponse getPickupById(Long pickupId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user profile not found"));

        Pickup pickup = pickupRepository.findById(pickupId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup request not found with ID: " + pickupId));

        // Authorization check: Customer can only view own pickup, Collector/Admin can view assigned/all
        if (user.getRole() == Role.CUSTOMER && !pickup.getCustomer().getId().equals(user.getId())) {
            throw new AccessDeniedException("Access denied: You are not authorized to view another customer's pickup request");
        }

        List<PickupStatusHistory> histories = pickupStatusHistoryRepository.findByPickupIdOrderByChangedAtAsc(pickupId);
        return PickupResponse.fromEntity(pickup, histories);
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

        recordStatusHistory(updated, PickupStatus.CANCELLED, customer, "Cancelled by customer");

        List<PickupStatusHistory> histories = pickupStatusHistoryRepository.findByPickupIdOrderByChangedAtAsc(pickupId);
        return PickupResponse.fromEntity(updated, histories);
    }

    @Transactional
    public PickupResponse recyclePickup(Long pickupId, RecyclePickupRequest request, String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated admin profile not found"));

        if (admin.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Only authenticated ADMIN users can mark pickups as RECYCLED.");
        }

        Pickup pickup = pickupRepository.findById(pickupId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup request not found with ID: " + pickupId));

        if (pickup.getStatus() != PickupStatus.COLLECTED) {
            throw new IllegalStateException("Invalid status transition: Only pickups in COLLECTED status can be confirmed as RECYCLED. Current status is " + pickup.getStatus());
        }

        pickup.setStatus(PickupStatus.RECYCLED);
        pickup.setRecycledAt(LocalDateTime.now());
        pickup.setRecycledBy(admin);
        if (request != null && StringUtils.hasText(request.getRecyclingNotes())) {
            pickup.setRecyclingNotes(request.getRecyclingNotes().trim());
        }

        Pickup updated = pickupRepository.save(pickup);

        recordStatusHistory(updated, PickupStatus.RECYCLED, admin, pickup.getRecyclingNotes() != null ? pickup.getRecyclingNotes() : "Recycling confirmed by Admin");

        List<PickupStatusHistory> histories = pickupStatusHistoryRepository.findByPickupIdOrderByChangedAtAsc(pickupId);
        return PickupResponse.fromEntity(updated, histories);
    }

    @Transactional(readOnly = true)
    public List<PickupResponse> getAllPickupsForAdmin() {
        return pickupRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(p -> {
                    List<PickupStatusHistory> histories = pickupStatusHistoryRepository.findByPickupIdOrderByChangedAtAsc(p.getId());
                    return PickupResponse.fromEntity(p, histories);
                })
                .collect(Collectors.toList());
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
