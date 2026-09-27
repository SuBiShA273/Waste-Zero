package com.example.backend.repository;

import com.example.backend.entity.Pickup;
import com.example.backend.entity.PickupStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PickupRepository extends JpaRepository<Pickup, Long> {

    List<Pickup> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    Optional<Pickup> findByIdAndCustomerId(Long id, Long customerId);

    long countByCustomerId(Long customerId);

    long countByCustomerIdAndStatus(Long customerId, PickupStatus status);

    // Collector query methods
    List<Pickup> findByCollectorIdOrderByCreatedAtDesc(Long collectorId);

    List<Pickup> findByCollectorIdAndStatusOrderByCreatedAtDesc(Long collectorId, PickupStatus status);

    List<Pickup> findByCollectorIdAndStatusInOrderByCreatedAtDesc(Long collectorId, List<PickupStatus> statuses);

    Optional<Pickup> findByIdAndCollectorId(Long id, Long collectorId);

    // Query for collector assigned pickups + pending unassigned pickups in database
    @Query("SELECT p FROM Pickup p WHERE p.collector.id = :collectorId OR (p.collector IS NULL AND p.status <> com.example.backend.entity.PickupStatus.CANCELLED AND p.status <> com.example.backend.entity.PickupStatus.REJECTED) ORDER BY p.createdAt DESC")
    List<Pickup> findCollectorAvailableAndAssignedPickups(@Param("collectorId") Long collectorId);

    @Query("SELECT p FROM Pickup p WHERE (p.collector.id = :collectorId OR (p.collector IS NULL AND p.status <> com.example.backend.entity.PickupStatus.CANCELLED AND p.status <> com.example.backend.entity.PickupStatus.REJECTED)) AND p.status = :status ORDER BY p.createdAt DESC")
    List<Pickup> findCollectorAvailableAndAssignedPickupsByStatus(@Param("collectorId") Long collectorId, @Param("status") PickupStatus status);

    long countByCollectorIdAndStatus(Long collectorId, PickupStatus status);

    long countByCollectorIdAndStatusIn(Long collectorId, List<PickupStatus> statuses);
}
