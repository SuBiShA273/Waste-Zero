package com.example.backend.repository;

import com.example.backend.entity.CollectorAvailability;
import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRoleAndActiveTrueAndAvailability(Role role, CollectorAvailability availability);
    List<User> findByRoleAndActiveTrue(Role role);
    List<User> findByRole(Role role);
}

