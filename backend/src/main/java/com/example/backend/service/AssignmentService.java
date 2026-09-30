package com.example.backend.service;

import com.example.backend.entity.CollectorAvailability;
import com.example.backend.entity.Pickup;
import com.example.backend.entity.PickupStatus;
import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.repository.PickupRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AssignmentService {

    private final UserRepository userRepository;
    private final PickupRepository pickupRepository;
    private final com.example.backend.repository.PickupStatusHistoryRepository pickupStatusHistoryRepository;

    private static final List<PickupStatus> ACTIVE_WORKLOAD_STATUSES = List.of(
            PickupStatus.ASSIGNED,
            PickupStatus.ACCEPTED,
            PickupStatus.ON_THE_WAY,
            PickupStatus.ARRIVED
    );

    public AssignmentService(
            UserRepository userRepository,
            PickupRepository pickupRepository,
            com.example.backend.repository.PickupStatusHistoryRepository pickupStatusHistoryRepository
    ) {
        this.userRepository = userRepository;
        this.pickupRepository = pickupRepository;
        this.pickupStatusHistoryRepository = pickupStatusHistoryRepository;
    }

    /**
     * Evaluates all active, available collectors and selects the most suitable candidate
     * based on role, active account, availability status, service area matching, and lowest active workload.
     */
    @Transactional(readOnly = true)
    public Optional<User> findBestEligibleCollector(Pickup pickup) {
        if (pickup == null) {
            return Optional.empty();
        }

        // 1. Fetch active collectors with AVAILABLE status
        List<User> availableCollectors = userRepository.findByRoleAndActiveTrueAndAvailability(
                Role.COLLECTOR,
                CollectorAvailability.AVAILABLE
        );

        if (availableCollectors.isEmpty()) {
            return Optional.empty();
        }

        // 2. Exclude all collectors who previously rejected this pickup
        List<User> candidateCollectors = availableCollectors.stream()
                .filter(collector -> !pickup.isRejectedByCollector(collector))
                .collect(Collectors.toList());

        if (candidateCollectors.isEmpty()) {
            return Optional.empty();
        }

        // 3. Service Area Matching (Soft preference: prefer area match, fall back to all available candidate collectors if no area match)
        String targetArea = StringUtils.hasText(pickup.getServiceArea()) ? pickup.getServiceArea().trim() : null;
        String pickupAddress = StringUtils.hasText(pickup.getPickupAddress()) ? pickup.getPickupAddress().trim() : "";

        List<User> matchingCollectors = candidateCollectors.stream()
                .filter(collector -> isServiceAreaMatch(collector, targetArea, pickupAddress))
                .collect(Collectors.toList());

        List<User> finalCandidates = matchingCollectors.isEmpty() ? candidateCollectors : matchingCollectors;

        // 4. Score and select collector with lowest active workload (with stable ID tie-breaker)
        return finalCandidates.stream()
                .min(Comparator
                        .comparingLong((User collector) -> countActiveWorkload(collector.getId()))
                        .thenComparing(User::getId)
                );
    }

    /**
     * Attempts to assign an eligible collector to the pickup within a transactional boundary.
     * If an eligible collector is found, updates status to ASSIGNED and sets collector.
     * If no collector is available, pickup remains in REQUESTED or pending status with collector = null.
     */
    @Transactional
    public Optional<User> assignCollectorToPickup(Pickup pickup) {
        if (pickup == null) {
            return Optional.empty();
        }

        // Verify pickup is in an assignable state
        if (pickup.getStatus() != PickupStatus.REQUESTED &&
            pickup.getStatus() != PickupStatus.REASSIGNABLE &&
            pickup.getStatus() != PickupStatus.ASSIGNED) {
            return Optional.ofNullable(pickup.getCollector());
        }

        Optional<User> eligibleCollectorOpt = findBestEligibleCollector(pickup);

        if (eligibleCollectorOpt.isPresent()) {
            User assignedCollector = eligibleCollectorOpt.get();
            pickup.setCollector(assignedCollector);
            pickup.setStatus(PickupStatus.ASSIGNED);
            pickupRepository.save(pickup);
            pickupStatusHistoryRepository.save(new com.example.backend.entity.PickupStatusHistory(
                    pickup, PickupStatus.ASSIGNED, assignedCollector, "Assigned to collector " + assignedCollector.getName()
            ));
            return Optional.of(assignedCollector);
        } else {
            // Keep pending status and clear collector reference
            pickup.setCollector(null);
            if (pickup.getStatus() == PickupStatus.REASSIGNABLE) {
                pickup.setStatus(PickupStatus.REASSIGNABLE);
            } else {
                pickup.setStatus(PickupStatus.REQUESTED);
            }
            pickupRepository.save(pickup);
            return Optional.empty();
        }
    }

    /**
     * Re-evaluates assignment for a given pickup ID.
     */
    @Transactional
    public Optional<User> triggerReassignment(Long pickupId) {
        Pickup pickup = pickupRepository.findByIdWithPessimisticLock(pickupId)
                .orElse(null);
        if (pickup == null) {
            return Optional.empty();
        }
        return assignCollectorToPickup(pickup);
    }

    /**
     * Calculates current active workload from database.
     * Active statuses counted: ASSIGNED, ACCEPTED, ON_THE_WAY, ARRIVED.
     */
    @Transactional(readOnly = true)
    public long countActiveWorkload(Long collectorId) {
        return pickupRepository.countActiveWorkloadByCollectorId(collectorId, ACTIVE_WORKLOAD_STATUSES);
    }

    /**
     * Practical service-area matching helper.
     */
    private boolean isServiceAreaMatch(User collector, String targetArea, String pickupAddress) {
        String collectorArea = collector.getServiceArea();

        // If collector has no service area configured or set to All, accept any
        if (!StringUtils.hasText(collectorArea) || "ALL".equalsIgnoreCase(collectorArea.trim()) || "ANY".equalsIgnoreCase(collectorArea.trim())) {
            return true;
        }

        String normCollectorArea = collectorArea.trim().toLowerCase();

        // Case A: Explicit serviceArea passed in request
        if (StringUtils.hasText(targetArea)) {
            String normTarget = targetArea.toLowerCase();
            return normCollectorArea.contains(normTarget) || normTarget.contains(normCollectorArea);
        }

        // Case B: Substring match within pickup address
        if (StringUtils.hasText(pickupAddress)) {
            return pickupAddress.toLowerCase().contains(normCollectorArea);
        }

        return true;
    }
}
