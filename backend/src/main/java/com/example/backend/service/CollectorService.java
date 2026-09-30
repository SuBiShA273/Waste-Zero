package com.example.backend.service;

import com.example.backend.dto.*;
import com.example.backend.entity.CollectorAvailability;
import com.example.backend.entity.Pickup;
import com.example.backend.entity.PickupStatus;
import com.example.backend.entity.User;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.PickupRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CollectorService {

    private final PickupRepository pickupRepository;
    private final UserRepository userRepository;
    private final AssignmentService assignmentService;
    private final com.example.backend.repository.PickupStatusHistoryRepository pickupStatusHistoryRepository;
    private static final String UPLOAD_DIR = "uploads/proofs/";

    public CollectorService(
            PickupRepository pickupRepository,
            UserRepository userRepository,
            AssignmentService assignmentService,
            com.example.backend.repository.PickupStatusHistoryRepository pickupStatusHistoryRepository
    ) {
        this.pickupRepository = pickupRepository;
        this.userRepository = userRepository;
        this.assignmentService = assignmentService;
        this.pickupStatusHistoryRepository = pickupStatusHistoryRepository;
    }

    @Transactional(readOnly = true)
    public CollectorDashboardStatsResponse getDashboardStats(String collectorEmail) {
        User collector = getCollectorUser(collectorEmail);

        List<Pickup> availableAndAssigned = pickupRepository.findCollectorAvailableAndAssignedPickups(collector.getId());
        long assigned = availableAndAssigned.stream()
                .filter(p -> !p.isRejectedByCollector(collector))
                .filter(p -> p.getStatus() == PickupStatus.ASSIGNED || p.getStatus() == PickupStatus.REQUESTED || p.getStatus() == PickupStatus.REASSIGNABLE)
                .count();

        long accepted = pickupRepository.countByCollectorIdAndStatusIn(
                collector.getId(),
                List.of(PickupStatus.ACCEPTED, PickupStatus.ON_THE_WAY, PickupStatus.ARRIVED)
        );
        long completed = pickupRepository.countByCollectorIdAndStatusIn(
                collector.getId(),
                List.of(PickupStatus.COLLECTED, PickupStatus.RECYCLED)
        );

        return new CollectorDashboardStatsResponse(assigned, accepted, completed, collector.getAvailability());
    }

    @Transactional(readOnly = true)
    public List<PickupResponse> getAssignedPickups(String collectorEmail, String statusFilter) {
        User collector = getCollectorUser(collectorEmail);

        List<Pickup> pickups;
        if (StringUtils.hasText(statusFilter)) {
            String filterUpper = statusFilter.toUpperCase();
            switch (filterUpper) {
                case "ASSIGNED":
                case "REQUESTED":
                case "PENDING":
                    pickups = pickupRepository.findCollectorAvailableAndAssignedPickupsByStatus(collector.getId(), PickupStatus.ASSIGNED);
                    List<Pickup> req = pickupRepository.findCollectorAvailableAndAssignedPickupsByStatus(collector.getId(), PickupStatus.REQUESTED);
                    pickups.addAll(req);
                    break;
                case "ACCEPTED":
                    pickups = pickupRepository.findByCollectorIdAndStatusOrderByCreatedAtDesc(collector.getId(), PickupStatus.ACCEPTED);
                    break;
                case "ACTIVE":
                    pickups = pickupRepository.findByCollectorIdAndStatusInOrderByCreatedAtDesc(
                            collector.getId(),
                            List.of(PickupStatus.ACCEPTED, PickupStatus.ON_THE_WAY, PickupStatus.ARRIVED)
                    );
                    break;
                case "COMPLETED":
                    pickups = pickupRepository.findByCollectorIdAndStatusInOrderByCreatedAtDesc(
                            collector.getId(),
                            List.of(PickupStatus.COLLECTED, PickupStatus.RECYCLED)
                    );
                    break;
                case "ALL":
                default:
                    pickups = pickupRepository.findCollectorAvailableAndAssignedPickups(collector.getId());
                    break;
            }
        } else {
            // Default: return assigned & pending pickups available in database
            pickups = pickupRepository.findCollectorAvailableAndAssignedPickups(collector.getId());
        }

        return pickups.stream()
                .filter(p -> !p.isRejectedByCollector(collector))
                .distinct()
                .map(PickupResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PickupResponse> getPickupHistory(String collectorEmail) {
        User collector = getCollectorUser(collectorEmail);

        List<Pickup> pickups = pickupRepository.findByCollectorIdAndStatusInOrderByCreatedAtDesc(
                collector.getId(),
                List.of(PickupStatus.COLLECTED, PickupStatus.RECYCLED, PickupStatus.REJECTED, PickupStatus.CANCELLED)
        );

        return pickups.stream()
                .map(PickupResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PickupResponse getPickupById(Long pickupId, String collectorEmail) {
        User collector = getCollectorUser(collectorEmail);
        Pickup pickup = getAuthorizedPickup(pickupId, collector.getId());
        List<com.example.backend.entity.PickupStatusHistory> histories = pickupStatusHistoryRepository.findByPickupIdOrderByChangedAtAsc(pickupId);
        return PickupResponse.fromEntity(pickup, histories);
    }

    @Transactional
    public PickupResponse acceptPickup(Long pickupId, String collectorEmail) {
        User collector = getCollectorUser(collectorEmail);
        Pickup pickup = pickupRepository.findByIdWithPessimisticLock(pickupId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup not found with ID: " + pickupId));

        if (pickup.getStatus() != PickupStatus.ASSIGNED && pickup.getStatus() != PickupStatus.REQUESTED && pickup.getStatus() != PickupStatus.REASSIGNABLE) {
            throw new IllegalStateException("Only pickups in ASSIGNED, REQUESTED, or REASSIGNABLE status can be accepted. Current status is: " + pickup.getStatus());
        }

        if (pickup.getCollector() != null && !pickup.getCollector().getId().equals(collector.getId())) {
            throw new AccessDeniedException("Access denied: This pickup has already been claimed by or assigned to another collector");
        }

        pickup.setCollector(collector);
        pickup.setStatus(PickupStatus.ACCEPTED);
        
        // Automatically set collector operational status to BUSY on accepting a pickup
        collector.setAvailability(CollectorAvailability.BUSY);
        userRepository.save(collector);

        Pickup updated = pickupRepository.save(pickup);
        pickupStatusHistoryRepository.save(new com.example.backend.entity.PickupStatusHistory(
                updated, PickupStatus.ACCEPTED, collector, "Accepted by collector " + collector.getName()
        ));

        List<com.example.backend.entity.PickupStatusHistory> histories = pickupStatusHistoryRepository.findByPickupIdOrderByChangedAtAsc(pickupId);
        return PickupResponse.fromEntity(updated, histories);
    }

    @Transactional
    public PickupResponse rejectPickup(Long pickupId, RejectPickupRequest request, String collectorEmail) {
        User collector = getCollectorUser(collectorEmail);
        Pickup pickup = pickupRepository.findByIdWithPessimisticLock(pickupId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup not found with ID: " + pickupId));

        if (pickup.getStatus() != PickupStatus.ASSIGNED && pickup.getStatus() != PickupStatus.REQUESTED && pickup.getStatus() != PickupStatus.REASSIGNABLE) {
            throw new IllegalStateException("Only pickups in ASSIGNED, REQUESTED, or REASSIGNABLE status can be rejected. Current status is: " + pickup.getStatus());
        }

        if (pickup.getCollector() != null && !pickup.getCollector().getId().equals(collector.getId())) {
            throw new AccessDeniedException("Access denied: You are not assigned to this pickup request");
        }

        // Move status to REASSIGNABLE and clear assigned collector
        pickup.addRejectedCollector(collector);
        pickup.setCollector(null);
        pickup.setStatus(PickupStatus.REASSIGNABLE);
        if (request != null && StringUtils.hasText(request.getReason())) {
            pickup.setRejectionReason(request.getReason().trim());
        }
        pickupRepository.saveAndFlush(pickup);
        pickupStatusHistoryRepository.save(new com.example.backend.entity.PickupStatusHistory(
                pickup, PickupStatus.REASSIGNABLE, collector, "Rejected by collector: " + (pickup.getRejectionReason() != null ? pickup.getRejectionReason() : "No reason provided")
        ));

        // Attempt Smart Reassignment with another eligible collector
        assignmentService.assignCollectorToPickup(pickup);

        // Update collector availability status based on remaining active workload
        updateCollectorAvailabilityStatus(collector);

        List<com.example.backend.entity.PickupStatusHistory> histories = pickupStatusHistoryRepository.findByPickupIdOrderByChangedAtAsc(pickupId);
        return PickupResponse.fromEntity(pickup, histories);
    }

    @Transactional
    public PickupResponse updateStatus(Long pickupId, UpdateStatusRequest request, String collectorEmail) {
        User collector = getCollectorUser(collectorEmail);
        Pickup pickup = getAuthorizedPickup(pickupId, collector.getId());

        PickupStatus current = pickup.getStatus();
        PickupStatus target = request.getStatus();

        if (target == null) {
            throw new IllegalArgumentException("Target status cannot be null");
        }

        if (target == PickupStatus.COLLECTED) {
            throw new IllegalStateException("Use the complete collection endpoint (/complete) to finalize collection with actual weight and notes.");
        }

        // Validate state transitions
        boolean isValidTransition = false;
        if (current == PickupStatus.ASSIGNED && target == PickupStatus.ACCEPTED) {
            isValidTransition = true;
        } else if (current == PickupStatus.ACCEPTED && target == PickupStatus.ON_THE_WAY) {
            isValidTransition = true;
        } else if (current == PickupStatus.ON_THE_WAY && target == PickupStatus.ARRIVED) {
            isValidTransition = true;
        } else if (current == PickupStatus.ARRIVED && target == PickupStatus.ON_THE_WAY) {
            // Re-en route if needed
            isValidTransition = true;
        }

        if (!isValidTransition) {
            throw new IllegalStateException("Invalid status transition from " + current + " to " + target);
        }

        pickup.setStatus(target);
        Pickup updated = pickupRepository.save(pickup);
        pickupStatusHistoryRepository.save(new com.example.backend.entity.PickupStatusHistory(
                updated, target, collector, "Status updated to " + target + " by collector"
        ));

        List<com.example.backend.entity.PickupStatusHistory> histories = pickupStatusHistoryRepository.findByPickupIdOrderByChangedAtAsc(pickupId);
        return PickupResponse.fromEntity(updated, histories);
    }

    @Transactional
    public PickupResponse completeCollection(Long pickupId, CompleteCollectionRequest request, String collectorEmail) {
        User collector = getCollectorUser(collectorEmail);
        Pickup pickup = getAuthorizedPickup(pickupId, collector.getId());

        if (pickup.getStatus() != PickupStatus.ARRIVED && pickup.getStatus() != PickupStatus.ON_THE_WAY && pickup.getStatus() != PickupStatus.ACCEPTED) {
            throw new IllegalStateException("Pickup must be in ARRIVED status before completing collection. Current status is: " + pickup.getStatus());
        }

        if (!StringUtils.hasText(pickup.getProofImageUrl())) {
            throw new IllegalStateException("Collection proof photo upload is mandatory before completing collection.");
        }

        if (request.getActualWeight() == null || request.getActualWeight() <= 0) {
            throw new IllegalArgumentException("Actual weight must be provided and greater than 0 kg");
        }

        pickup.setActualWeight(request.getActualWeight());
        if (StringUtils.hasText(request.getCollectionNotes())) {
            pickup.setCollectionNotes(request.getCollectionNotes().trim());
        }
        pickup.setCollectedAt(LocalDateTime.now());
        pickup.setStatus(PickupStatus.COLLECTED);

        Pickup updated = pickupRepository.save(pickup);
        pickupStatusHistoryRepository.save(new com.example.backend.entity.PickupStatusHistory(
                updated, PickupStatus.COLLECTED, collector, "Collection completed. Actual weight: " + request.getActualWeight() + " kg"
        ));

        // Check if collector has remaining active pickups to update availability
        updateCollectorAvailabilityStatus(collector);

        List<com.example.backend.entity.PickupStatusHistory> histories = pickupStatusHistoryRepository.findByPickupIdOrderByChangedAtAsc(pickupId);
        return PickupResponse.fromEntity(updated, histories);
    }

    private void updateCollectorAvailabilityStatus(User collector) {
        long activeCount = assignmentService.countActiveWorkload(collector.getId());
        // Automatically revert to AVAILABLE when active workload drops to 0, but preserve manual OFFLINE state
        if (activeCount == 0 && collector.getAvailability() == CollectorAvailability.BUSY) {
            collector.setAvailability(CollectorAvailability.AVAILABLE);
            userRepository.save(collector);
        }
    }

    @Transactional
    public PickupResponse uploadCollectionProof(Long pickupId, MultipartFile file, String collectorEmail) {
        User collector = getCollectorUser(collectorEmail);
        Pickup pickup = getAuthorizedPickup(pickupId, collector.getId());

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Collection proof image file is required");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files (JPEG, PNG, WEBP) are allowed as collection proof");
        }

        if (file.getSize() > 5 * 1024 * 1024) { // 5MB limit
            throw new IllegalArgumentException("Proof image file size must not exceed 5MB");
        }

        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
            String extension = "";
            int extIndex = originalFilename.lastIndexOf(".");
            if (extIndex > 0) {
                extension = originalFilename.substring(extIndex);
            }

            String filename = "proof_" + pickupId + "_" + UUID.randomUUID().toString().substring(0, 8) + extension;
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "/uploads/proofs/" + filename;
            pickup.setProofImageUrl(fileUrl);
            Pickup updated = pickupRepository.save(pickup);
            return PickupResponse.fromEntity(updated);

        } catch (IOException e) {
            throw new RuntimeException("Failed to store collection proof image: " + e.getMessage(), e);
        }
    }

    @Transactional
    public UserResponse updateAvailability(UpdateAvailabilityRequest request, String collectorEmail) {
        User collector = getCollectorUser(collectorEmail);
        if (request.getAvailability() == null) {
            throw new IllegalArgumentException("Availability status cannot be null");
        }
        collector.setAvailability(request.getAvailability());
        User updated = userRepository.save(collector);
        return UserResponse.fromEntity(updated);
    }

    // Helper methods
    private User getCollectorUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated collector profile not found with email: " + email));
    }

    private Pickup getAuthorizedPickup(Long pickupId, Long collectorId) {
        Pickup pickup = pickupRepository.findById(pickupId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup not found with ID: " + pickupId));

        if (pickup.getCollector() != null && !pickup.getCollector().getId().equals(collectorId)) {
            throw new AccessDeniedException("Access denied: You are not assigned to this pickup request");
        }

        if (pickup.getCollector() == null && pickup.getStatus() != PickupStatus.REQUESTED && pickup.getStatus() != PickupStatus.ASSIGNED && pickup.getStatus() != PickupStatus.REASSIGNABLE) {
            throw new AccessDeniedException("Access denied: You are not assigned to this pickup request");
        }

        return pickup;
    }
}
