package com.example.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "pickups")
public class Pickup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collector_id")
    private User collector;

    @Enumerated(EnumType.STRING)
    @Column(name = "waste_category", nullable = false)
    private WasteCategory wasteCategory;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "pickup_address", nullable = false)
    private String pickupAddress;

    @Column(name = "service_area")
    private String serviceArea;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rejected_by_collector_id")
    private User rejectedByCollector;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "pickup_rejected_collectors",
        joinColumns = @JoinColumn(name = "pickup_id"),
        inverseJoinColumns = @JoinColumn(name = "collector_id")
    )
    private Set<User> rejectedCollectors = new HashSet<>();

    @Version
    private Long version;

    @Column(name = "preferred_date", nullable = false)
    private LocalDate preferredDate;

    @Column(name = "preferred_time", nullable = false)
    private String preferredTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PickupStatus status;

    @Column(name = "actual_weight")
    private Double actualWeight;

    @Column(name = "collection_notes", columnDefinition = "TEXT")
    private String collectionNotes;

    @Column(name = "collected_at")
    private LocalDateTime collectedAt;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "proof_image_url")
    private String proofImageUrl;

    @Column(name = "recycled_at")
    private LocalDateTime recycledAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recycled_by_id")
    private User recycledBy;

    @Column(name = "recycling_notes", columnDefinition = "TEXT")
    private String recyclingNotes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = PickupStatus.REQUESTED;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Pickup() {}

    public Pickup(User customer, WasteCategory wasteCategory, String description,
                  String pickupAddress, LocalDate preferredDate, String preferredTime) {
        this.customer = customer;
        this.wasteCategory = wasteCategory;
        this.description = description;
        this.pickupAddress = pickupAddress;
        this.preferredDate = preferredDate;
        this.preferredTime = preferredTime;
        this.status = PickupStatus.REQUESTED;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getCustomer() {
        return customer;
    }

    public void setCustomer(User customer) {
        this.customer = customer;
    }

    public WasteCategory getWasteCategory() {
        return wasteCategory;
    }

    public void setWasteCategory(WasteCategory wasteCategory) {
        this.wasteCategory = wasteCategory;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPickupAddress() {
        return pickupAddress;
    }

    public void setPickupAddress(String pickupAddress) {
        this.pickupAddress = pickupAddress;
    }

    public LocalDate getPreferredDate() {
        return preferredDate;
    }

    public void setPreferredDate(LocalDate preferredDate) {
        this.preferredDate = preferredDate;
    }

    public String getPreferredTime() {
        return preferredTime;
    }

    public void setPreferredTime(String preferredTime) {
        this.preferredTime = preferredTime;
    }

    public PickupStatus getStatus() {
        return status;
    }

    public void setStatus(PickupStatus status) {
        this.status = status;
    }

    public User getCollector() {
        return collector;
    }

    public void setCollector(User collector) {
        this.collector = collector;
    }

    public Double getActualWeight() {
        return actualWeight;
    }

    public void setActualWeight(Double actualWeight) {
        this.actualWeight = actualWeight;
    }

    public String getCollectionNotes() {
        return collectionNotes;
    }

    public void setCollectionNotes(String collectionNotes) {
        this.collectionNotes = collectionNotes;
    }

    public LocalDateTime getCollectedAt() {
        return collectedAt;
    }

    public void setCollectedAt(LocalDateTime collectedAt) {
        this.collectedAt = collectedAt;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public String getProofImageUrl() {
        return proofImageUrl;
    }

    public void setProofImageUrl(String proofImageUrl) {
        this.proofImageUrl = proofImageUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getServiceArea() {
        return serviceArea;
    }

    public void setServiceArea(String serviceArea) {
        this.serviceArea = serviceArea;
    }

    public User getRejectedByCollector() {
        return rejectedByCollector;
    }

    public void setRejectedByCollector(User rejectedByCollector) {
        this.rejectedByCollector = rejectedByCollector;
    }

    public Set<User> getRejectedCollectors() {
        if (rejectedCollectors == null) {
            rejectedCollectors = new HashSet<>();
        }
        return rejectedCollectors;
    }

    public void setRejectedCollectors(Set<User> rejectedCollectors) {
        this.rejectedCollectors = rejectedCollectors;
    }

    public void addRejectedCollector(User collector) {
        if (collector != null) {
            getRejectedCollectors().add(collector);
            this.rejectedByCollector = collector;
        }
    }

    public boolean isRejectedByCollector(User collector) {
        if (collector == null || collector.getId() == null) {
            return false;
        }
        return getRejectedCollectors().stream()
                .anyMatch(rc -> rc.getId() != null && rc.getId().equals(collector.getId()));
    }

    public LocalDateTime getRecycledAt() {
        return recycledAt;
    }

    public void setRecycledAt(LocalDateTime recycledAt) {
        this.recycledAt = recycledAt;
    }

    public User getRecycledBy() {
        return recycledBy;
    }

    public void setRecycledBy(User recycledBy) {
        this.recycledBy = recycledBy;
    }

    public String getRecyclingNotes() {
        return recyclingNotes;
    }

    public void setRecyclingNotes(String recyclingNotes) {
        this.recyclingNotes = recyclingNotes;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }
}
