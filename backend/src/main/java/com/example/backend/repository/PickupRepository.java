package com.example.backend.repository;

import com.example.backend.entity.Pickup;
import com.example.backend.entity.PickupStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PickupRepository extends JpaRepository<Pickup, Long> {

    List<Pickup> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    Optional<Pickup> findByIdAndCustomerId(Long id, Long customerId);

    long countByCustomerId(Long customerId);

    long countByCustomerIdAndStatus(Long customerId, PickupStatus status);
}
