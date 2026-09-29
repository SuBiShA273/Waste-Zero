package com.example.backend.config;

import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository,
                                      PasswordEncoder passwordEncoder) {
        return args -> {
            // Seed default Admin only if no Admin exists
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
        };
    }
}
