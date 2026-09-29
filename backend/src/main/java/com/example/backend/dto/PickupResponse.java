package com.example.backend.dto;

import com.example.backend.entity.Pickup;
import com.example.backend.entity.PickupStatus;
import com.example.backend.entity.WasteCategory;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class PickupResponse {

    private Long id;
    private WasteCategory wasteCategory;
    private String description;
    private String pickupAddress;
    private String serviceArea;
    private LocalDate preferredDate;
    private String preferredTime;
    private PickupStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Customer details
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;

    // Collector details
    private Long collectorId;
    private String collectorName;
    private String collectorEmail;
    private String collectorPhone;
    private String collectorServiceArea;

    // Collection completion details
    private Double actualWeight;
    private String collectionNotes;
    private LocalDateTime collectedAt;
    private String rejectionReason;
    private String proofImageUrl;

    public PickupResponse() {}

    public static PickupResponse fromEntity(Pickup pickup) {
        PickupResponse response = new PickupResponse();
        response.setId(pickup.getId());
        response.setWasteCategory(pickup.getWasteCategory());
        response.setDescription(pickup.getDescription());
        response.setPickupAddress(pickup.getPickupAddress());
        response.setServiceArea(pickup.getServiceArea());
        response.setPreferredDate(pickup.getPreferredDate());
        response.setPreferredTime(pickup.getPreferredTime());
        response.setStatus(pickup.getStatus());
        response.setCreatedAt(pickup.getCreatedAt());
        response.setUpdatedAt(pickup.getUpdatedAt());

        response.setActualWeight(pickup.getActualWeight());
        response.setCollectionNotes(pickup.getCollectionNotes());
        response.setCollectedAt(pickup.getCollectedAt());
        response.setRejectionReason(pickup.getRejectionReason());
        response.setProofImageUrl(pickup.getProofImageUrl());

        if (pickup.getCustomer() != null) {
            response.setCustomerId(pickup.getCustomer().getId());
            response.setCustomerName(pickup.getCustomer().getName());
            response.setCustomerEmail(pickup.getCustomer().getEmail());
            response.setCustomerPhone(pickup.getCustomer().getPhone());
        }

        if (pickup.getCollector() != null) {
            response.setCollectorId(pickup.getCollector().getId());
            response.setCollectorName(pickup.getCollector().getName());
            response.setCollectorEmail(pickup.getCollector().getEmail());
            response.setCollectorPhone(pickup.getCollector().getPhone());
            response.setCollectorServiceArea(pickup.getCollector().getServiceArea());
        }

        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public Long getCollectorId() {
        return collectorId;
    }

    public void setCollectorId(Long collectorId) {
        this.collectorId = collectorId;
    }

    public String getCollectorName() {
        return collectorName;
    }

    public void setCollectorName(String collectorName) {
        this.collectorName = collectorName;
    }

    public String getCollectorEmail() {
        return collectorEmail;
    }

    public void setCollectorEmail(String collectorEmail) {
        this.collectorEmail = collectorEmail;
    }

    public String getCollectorPhone() {
        return collectorPhone;
    }

    public void setCollectorPhone(String collectorPhone) {
        this.collectorPhone = collectorPhone;
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

    public String getServiceArea() {
        return serviceArea;
    }

    public void setServiceArea(String serviceArea) {
        this.serviceArea = serviceArea;
    }

    public String getCollectorServiceArea() {
        return collectorServiceArea;
    }

    public void setCollectorServiceArea(String collectorServiceArea) {
        this.collectorServiceArea = collectorServiceArea;
    }
}
