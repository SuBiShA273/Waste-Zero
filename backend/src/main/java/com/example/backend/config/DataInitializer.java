package com.example.backend.config;

import com.example.backend.entity.*;
import com.example.backend.repository.PickupRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository,
                                      PickupRepository pickupRepository,
                                      PasswordEncoder passwordEncoder) {
        return args -> {
            // Seed Admin
            String adminEmail = "admin@gmail.com";
            if (!userRepository.existsByEmail(adminEmail)) {
                User admin = new User(
                        "Admin User",
                        adminEmail,
                        passwordEncoder.encode("Admin@123"),
                        "+1234567890",
                        Role.ADMIN
                );
                userRepository.save(admin);
                System.out.println(">>> [WasteZero Initializer] Seeded Admin: admin@gmail.com / Admin@123 <<<");
            }

            // Seed Collectors
            String collectorEmail = "collector@gmail.com";
            User collector = userRepository.findByEmail(collectorEmail).orElse(null);
            if (collector == null) {
                collector = new User(
                        "Green Collector",
                        collectorEmail,
                        passwordEncoder.encode("Collector@123"),
                        "+1987654321",
                        Role.COLLECTOR,
                        CollectorAvailability.AVAILABLE,
                        "Downtown Sector"
                );
                collector = userRepository.save(collector);
                System.out.println(">>> [WasteZero Initializer] Seeded Collector: collector@gmail.com / Collector@123 <<<");
            }

            String collector2Email = "collector2@gmail.com";
            if (!userRepository.existsByEmail(collector2Email)) {
                User collector2 = new User(
                        "Eco Collector",
                        collector2Email,
                        passwordEncoder.encode("Collector@123"),
                        "+1987654322",
                        Role.COLLECTOR,
                        CollectorAvailability.AVAILABLE,
                        "Suburbs Zone"
                );
                userRepository.save(collector2);
                System.out.println(">>> [WasteZero Initializer] Seeded Collector 2: collector2@gmail.com / Collector@123 <<<");
            }

            // Seed Test Customer
            String customerEmail = "customer@gmail.com";
            User customer = userRepository.findByEmail(customerEmail).orElse(null);
            if (customer == null) {
                customer = new User(
                        "John Customer",
                        customerEmail,
                        passwordEncoder.encode("Customer@123"),
                        "+1555666777",
                        Role.CUSTOMER
                );
                customer = userRepository.save(customer);
                System.out.println(">>> [WasteZero Initializer] Seeded Customer: customer@gmail.com / Customer@123 <<<");
            }

            // Seed sample pickups assigned to collector if none exist for collector
            if (pickupRepository.findByCollectorIdOrderByCreatedAtDesc(collector.getId()).isEmpty()) {
                // 1. Assigned Pickup
                Pickup p1 = new Pickup(
                        customer,
                        WasteCategory.PLASTIC,
                        "Bulk plastic bottles and packaging containers",
                        "124 Green Park Road, Sector 4",
                        LocalDate.now().plusDays(1),
                        "10:00 AM - 12:00 PM"
                );
                p1.setCollector(collector);
                p1.setStatus(PickupStatus.ASSIGNED);
                pickupRepository.save(p1);

                // 2. Accepted / Active Pickup
                Pickup p2 = new Pickup(
                        customer,
                        WasteCategory.E_WASTE,
                        "Old computer monitor and electronic parts",
                        "56 Tech Park Boulevard, Suite 12",
                        LocalDate.now(),
                        "02:00 PM - 04:00 PM"
                );
                p2.setCollector(collector);
                p2.setStatus(PickupStatus.ACCEPTED);
                pickupRepository.save(p2);

                // 3. Completed Pickup
                Pickup p3 = new Pickup(
                        customer,
                        WasteCategory.ORGANIC,
                        "Garden trimmings and compostable waste",
                        "88 Eco Gardens Avenue",
                        LocalDate.now().minusDays(2),
                        "09:00 AM - 11:00 AM"
                );
                p3.setCollector(collector);
                p3.setStatus(PickupStatus.COLLECTED);
                p3.setActualWeight(18.5);
                p3.setCollectionNotes("Successfully collected organic waste in sealed bio-bags.");
                p3.setCollectedAt(LocalDateTime.now().minusDays(2));
                pickupRepository.save(p3);

                System.out.println(">>> [WasteZero Initializer] Seeded Sample Assigned Pickups for Collector <<<");
            }
        };
    }
}
