package com.example.backend.service;

import com.example.backend.dto.AdminDashboardStatsResponse;
import com.example.backend.dto.CategoryImpactDto;
import com.example.backend.dto.UserAdminResponse;
import com.example.backend.entity.CollectorAvailability;
import com.example.backend.entity.Pickup;
import com.example.backend.entity.PickupStatus;
import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.entity.WasteCategory;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.ComplaintRepository;
import com.example.backend.repository.PickupRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final PickupRepository pickupRepository;
    private final ComplaintRepository complaintRepository;
    private final AssignmentService assignmentService;

    public AdminService(
            UserRepository userRepository,
            PickupRepository pickupRepository,
            ComplaintRepository complaintRepository,
            AssignmentService assignmentService
    ) {
        this.userRepository = userRepository;
        this.pickupRepository = pickupRepository;
        this.complaintRepository = complaintRepository;
        this.assignmentService = assignmentService;
    }

    @Transactional(readOnly = true)
    public AdminDashboardStatsResponse getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalCustomers = userRepository.countByRole(Role.CUSTOMER);
        long totalCollectors = userRepository.countByRole(Role.COLLECTOR);
        long activeCollectors = userRepository.countByRoleAndActiveTrueAndAvailabilityNot(
                Role.COLLECTOR, CollectorAvailability.OFFLINE
        );

        long totalPickups = pickupRepository.count();
        long pendingPickups = pickupRepository.countByStatusIn(
                List.of(PickupStatus.REQUESTED, PickupStatus.ASSIGNED, PickupStatus.REASSIGNABLE)
        );
        long activePickups = pickupRepository.countByStatusIn(
                List.of(PickupStatus.ACCEPTED, PickupStatus.ON_THE_WAY, PickupStatus.ARRIVED)
        );
        long collectedPickups = pickupRepository.countByStatus(PickupStatus.COLLECTED);
        long recycledPickups = pickupRepository.countByStatus(PickupStatus.RECYCLED);
        long cancelledPickups = pickupRepository.countByStatus(PickupStatus.CANCELLED);

        long openComplaints = complaintRepository.countByStatus(com.example.backend.entity.ComplaintStatus.OPEN);
        long underReviewComplaints = complaintRepository.countByStatus(com.example.backend.entity.ComplaintStatus.UNDER_REVIEW);
        long resolvedComplaints = complaintRepository.countByStatus(com.example.backend.entity.ComplaintStatus.RESOLVED);

        // Environmental Impact calculations on RECYCLED pickups
        List<Pickup> recycledList = pickupRepository.findByStatusOrderByCreatedAtDesc(PickupStatus.RECYCLED);

        Map<WasteCategory, Double> weightByCategory = new EnumMap<>(WasteCategory.class);
        Map<WasteCategory, Long> countByCategory = new EnumMap<>(WasteCategory.class);

        double totalWeight = 0.0;
        double totalCo2Saved = 0.0;

        for (Pickup p : recycledList) {
            double weight = p.getActualWeight() != null ? p.getActualWeight() : 0.0;
            WasteCategory cat = p.getWasteCategory();
            if (cat != null) {
                weightByCategory.put(cat, weightByCategory.getOrDefault(cat, 0.0) + weight);
                countByCategory.put(cat, countByCategory.getOrDefault(cat, 0L) + 1);
                totalWeight += weight;
                double factor = ImpactService.getConversionFactor(cat);
                totalCo2Saved += weight * factor;
            }
        }

        List<CategoryImpactDto> categoryBreakdown = new ArrayList<>();
        for (WasteCategory cat : WasteCategory.values()) {
            double weight = weightByCategory.getOrDefault(cat, 0.0);
            long count = countByCategory.getOrDefault(cat, 0L);
            double factor = ImpactService.getConversionFactor(cat);
            double co2 = weight * factor;
            categoryBreakdown.add(new CategoryImpactDto(
                    cat,
                    Math.round(weight * 100.0) / 100.0,
                    Math.round(co2 * 100.0) / 100.0,
                    factor,
                    count
            ));
        }

        double treesSaved = totalCo2Saved / 21.0; // ~21kg CO2 per tree/year
        double waterSaved = totalWeight * 12.5; // ~12.5L water saved per kg recycled
        double energySaved = totalWeight * 2.5; // ~2.5 kWh saved per kg recycled

        // Pickup status breakdown map
        Map<String, Long> statusCounts = new HashMap<>();
        for (PickupStatus status : PickupStatus.values()) {
            statusCounts.put(status.name(), pickupRepository.countByStatus(status));
        }

        return new AdminDashboardStatsResponse(
                totalUsers,
                totalCustomers,
                totalCollectors,
                activeCollectors,
                totalPickups,
                pendingPickups,
                activePickups,
                collectedPickups,
                recycledPickups,
                cancelledPickups,
                openComplaints,
                underReviewComplaints,
                resolvedComplaints,
                Math.round(totalWeight * 100.0) / 100.0,
                Math.round(totalCo2Saved * 100.0) / 100.0,
                Math.round(treesSaved * 100.0) / 100.0,
                Math.round(waterSaved * 100.0) / 100.0,
                Math.round(energySaved * 100.0) / 100.0,
                statusCounts,
                categoryBreakdown
        );
    }

    @Transactional(readOnly = true)
    public List<UserAdminResponse> getAllUsers(Role roleFilter, Boolean activeFilter, String searchQuery) {
        List<User> users = userRepository.findAll();

        return users.stream()
                .filter(u -> roleFilter == null || u.getRole() == roleFilter)
                .filter(u -> activeFilter == null || u.isActive() == activeFilter)
                .filter(u -> {
                    if (!StringUtils.hasText(searchQuery)) return true;
                    String q = searchQuery.toLowerCase().trim();
                    return u.getName().toLowerCase().contains(q) || u.getEmail().toLowerCase().contains(q) ||
                           (u.getPhone() != null && u.getPhone().toLowerCase().contains(q));
                })
                .map(this::mapToUserAdminResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserAdminResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        return mapToUserAdminResponse(user);
    }

    @Transactional
    public UserAdminResponse toggleUserStatus(Long userId, Boolean active, String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        if (admin.getId().equals(userId) && Boolean.FALSE.equals(active)) {
            throw new IllegalArgumentException("Admin users cannot disable their own account.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        user.setActive(active != null ? active : !user.isActive());
        User updated = userRepository.save(user);

        return mapToUserAdminResponse(updated);
    }

    @Transactional(readOnly = true)
    public List<UserAdminResponse> getAllCollectors() {
        List<User> collectors = userRepository.findByRole(Role.COLLECTOR);
        return collectors.stream()
                .map(this::mapToUserAdminResponse)
                .collect(Collectors.toList());
    }

    private UserAdminResponse mapToUserAdminResponse(User u) {
        long totalPickups = 0;
        long activeWorkload = 0;
        long completedPickups = 0;

        if (u.getRole() == Role.CUSTOMER) {
            totalPickups = pickupRepository.countByCustomerId(u.getId());
            completedPickups = pickupRepository.countByCustomerIdAndStatus(u.getId(), PickupStatus.RECYCLED) +
                               pickupRepository.countByCustomerIdAndStatus(u.getId(), PickupStatus.COLLECTED);
        } else if (u.getRole() == Role.COLLECTOR) {
            totalPickups = pickupRepository.countByCollectorIdAndStatusIn(
                    u.getId(),
                    List.of(PickupStatus.ACCEPTED, PickupStatus.ON_THE_WAY, PickupStatus.ARRIVED, PickupStatus.COLLECTED, PickupStatus.RECYCLED)
            );
            activeWorkload = assignmentService.countActiveWorkload(u.getId());
            completedPickups = pickupRepository.countByCollectorIdAndStatusIn(
                    u.getId(),
                    List.of(PickupStatus.COLLECTED, PickupStatus.RECYCLED)
            );
        }

        return UserAdminResponse.fromEntity(u, totalPickups, activeWorkload, completedPickups);
    }
}
