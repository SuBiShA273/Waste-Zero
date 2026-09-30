package com.example.backend.service;

import com.example.backend.dto.CategoryImpactDto;
import com.example.backend.dto.CustomerImpactResponse;
import com.example.backend.dto.PickupResponse;
import com.example.backend.entity.Pickup;
import com.example.backend.entity.PickupStatus;
import com.example.backend.entity.User;
import com.example.backend.entity.WasteCategory;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.PickupRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ImpactService {

    private final PickupRepository pickupRepository;
    private final UserRepository userRepository;

    // Conversion factors: kg CO₂e saved per 1 kg of recycled material
    private static final Map<WasteCategory, Double> CONVERSION_FACTORS = Map.of(
            WasteCategory.PLASTIC, 1.5,
            WasteCategory.PAPER, 0.9,
            WasteCategory.GLASS, 0.3,
            WasteCategory.METAL, 2.5,
            WasteCategory.ORGANIC, 0.5,
            WasteCategory.E_WASTE, 3.0,
            WasteCategory.MIXED, 0.7,
            WasteCategory.OTHER, 0.5
    );

    public ImpactService(PickupRepository pickupRepository, UserRepository userRepository) {
        this.pickupRepository = pickupRepository;
        this.userRepository = userRepository;
    }

    public static Double getConversionFactor(WasteCategory category) {
        return CONVERSION_FACTORS.getOrDefault(category, 0.5);
    }

    @Transactional(readOnly = true)
    public CustomerImpactResponse getCustomerImpact(String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated customer profile not found"));

        // Only count pickups that have reached RECYCLED status
        List<Pickup> recycledPickups = pickupRepository.findByCustomerIdAndStatusOrderByCreatedAtDesc(
                customer.getId(), PickupStatus.RECYCLED
        );

        Map<WasteCategory, Double> weightByCategory = new EnumMap<>(WasteCategory.class);
        Map<WasteCategory, Long> countByCategory = new EnumMap<>(WasteCategory.class);

        double totalWeight = 0.0;
        double totalCo2Saved = 0.0;

        for (Pickup p : recycledPickups) {
            double weight = p.getActualWeight() != null ? p.getActualWeight() : 0.0;
            WasteCategory cat = p.getWasteCategory();
            if (cat != null) {
                weightByCategory.put(cat, weightByCategory.getOrDefault(cat, 0.0) + weight);
                countByCategory.put(cat, countByCategory.getOrDefault(cat, 0L) + 1);
            }
            totalWeight += weight;
            double factor = getConversionFactor(cat);
            totalCo2Saved += weight * factor;
        }

        List<CategoryImpactDto> categoryImpacts = new ArrayList<>();
        for (WasteCategory cat : WasteCategory.values()) {
            double weight = weightByCategory.getOrDefault(cat, 0.0);
            long count = countByCategory.getOrDefault(cat, 0L);
            double factor = getConversionFactor(cat);
            double co2 = weight * factor;
            categoryImpacts.add(new CategoryImpactDto(
                    cat,
                    Math.round(weight * 100.0) / 100.0,
                    Math.round(co2 * 100.0) / 100.0,
                    factor,
                    count
            ));
        }

        List<PickupResponse> pickupResponses = recycledPickups.stream()
                .map(PickupResponse::fromEntity)
                .collect(Collectors.toList());

        return new CustomerImpactResponse(
                Math.round(totalWeight * 100.0) / 100.0,
                Math.round(totalCo2Saved * 100.0) / 100.0,
                categoryImpacts,
                pickupResponses
        );
    }
}
