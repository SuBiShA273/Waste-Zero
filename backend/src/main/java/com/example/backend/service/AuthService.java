package com.example.backend.service;

import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.dto.UserResponse;
import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.exception.DuplicateResourceException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            CustomUserDetailsService userDetailsService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email is already registered: " + request.getEmail());
        }

        Role requestedRole = request.getRoleAsEnum();
        Role assignedRole = requestedRole != null ? requestedRole : Role.CUSTOMER;

        User user;
        if (assignedRole == Role.COLLECTOR) {
            String serviceArea = org.springframework.util.StringUtils.hasText(request.getServiceArea())
                    ? request.getServiceArea().trim()
                    : "Zone 1";
            user = new User(
                    request.getName(),
                    request.getEmail(),
                    passwordEncoder.encode(request.getPassword()),
                    request.getPhone(),
                    Role.COLLECTOR,
                    com.example.backend.entity.CollectorAvailability.AVAILABLE,
                    serviceArea
            );
        } else if (assignedRole == Role.ADMIN) {
            user = new User(
                    request.getName(),
                    request.getEmail(),
                    passwordEncoder.encode(request.getPassword()),
                    request.getPhone(),
                    Role.ADMIN
            );
        } else {
            user = new User(
                    request.getName(),
                    request.getEmail(),
                    passwordEncoder.encode(request.getPassword()),
                    request.getPhone(),
                    Role.CUSTOMER
            );
        }

        User savedUser = userRepository.save(user);
        var userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(token, UserResponse.fromEntity(savedUser));
    }

    public AuthResponse login(LoginRequest request) {
        // Guarantee default Admin account exists in database
        if ("admin@gmail.com".equalsIgnoreCase(request.getEmail()) && !userRepository.existsByEmail("admin@gmail.com")) {
            User admin = new User(
                    "admin",
                    "admin@gmail.com",
                    passwordEncoder.encode("Admin@123"),
                    "+1234567890",
                    Role.ADMIN
            );
            userRepository.save(admin);
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        if (!user.isActive()) {
            throw new IllegalStateException("Account is disabled");
        }

        var userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(token, UserResponse.fromEntity(user));
    }

    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return UserResponse.fromEntity(user);
    }
}
