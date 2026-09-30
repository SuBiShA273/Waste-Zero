package com.example.backend.repository;

import com.example.backend.entity.Pickup;
import com.example.backend.entity.PickupStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PickupRepository extends JpaRepository<Pickup, Long> {

    List<Pickup> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    List<Pickup> findByCustomerIdAndStatusOrderByCreatedAtDesc(Long customerId, PickupStatus status);

    List<Pickup> findAllByOrderByCreatedAtDesc();

    Optional<Pickup> findByIdAndCustomerId(Long id, Long customerId);

    long countByCustomerId(Long customerId);

    long countByCustomerIdAndStatus(Long customerId, PickupStatus status);

    // Collector query methods
    List<Pickup> findByCollectorIdOrderByCreatedAtDesc(Long collectorId);

    List<Pickup> findByCollectorIdAndStatusOrderByCreatedAtDesc(Long collectorId, PickupStatus status);

    List<Pickup> findByCollectorIdAndStatusInOrderByCreatedAtDesc(Long collectorId, List<PickupStatus> statuses);

    Optional<Pickup> findByIdAndCollectorId(Long id, Long collectorId);

    // Query for collector assigned pickups + pending unassigned pickups in database (excluding pickups rejected by this collector)
    @Query("SELECT p FROM Pickup p WHERE (p.collector.id = :collectorId OR (p.collector IS NULL AND NOT EXISTS (SELECT rc FROM p.rejectedCollectors rc WHERE rc.id = :collectorId) AND (p.rejectedByCollector.id IS NULL OR p.rejectedByCollector.id <> :collectorId))) AND p.status <> com.example.backend.entity.PickupStatus.CANCELLED AND p.status <> com.example.backend.entity.PickupStatus.REJECTED ORDER BY p.createdAt DESC")
    List<Pickup> findCollectorAvailableAndAssignedPickups(@Param("collectorId") Long collectorId);

    @Query("SELECT p FROM Pickup p WHERE (p.collector.id = :collectorId OR (p.collector IS NULL AND NOT EXISTS (SELECT rc FROM p.rejectedCollectors rc WHERE rc.id = :collectorId) AND (p.rejectedByCollector.id IS NULL OR p.rejectedByCollector.id <> :collectorId))) AND p.status = :status ORDER BY p.createdAt DESC")
    List<Pickup> findCollectorAvailableAndAssignedPickupsByStatus(@Param("collectorId") Long collectorId, @Param("status") PickupStatus status);

    long countByCollectorIdAndStatus(Long collectorId, PickupStatus status);

    long countByCollectorIdAndStatusIn(Long collectorId, List<PickupStatus> statuses);

    // Day 4 Smart Collector Assignment Queries
    @Query("SELECT COUNT(p) FROM Pickup p WHERE p.collector.id = :collectorId AND p.status IN (:statuses)")
    long countActiveWorkloadByCollectorId(@Param("collectorId") Long collectorId, @Param("statuses") List<PickupStatus> statuses);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Pickup p WHERE p.id = :id")
    Optional<Pickup> findByIdWithPessimisticLock(@Param("id") Long id);

    List<Pickup> findByStatusIn(List<PickupStatus> statuses);
}

