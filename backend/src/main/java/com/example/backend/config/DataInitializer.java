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
    public CommandLineRunner initAdminUser(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String adminEmail = "admin@gmail.com";
            if (!userRepository.existsByEmail(adminEmail)) {
                User admin = new User(
                        "admin",
                        adminEmail,
                        passwordEncoder.encode("Admin@123"),
                        "+1234567890",
                        Role.ADMIN
                );
                userRepository.save(admin);
                System.out.println(">>> [WasteZero Initializer] Default Admin User Seeded: admin@gmail.com / Admin@123 <<<");
            }
        };
    }
}
