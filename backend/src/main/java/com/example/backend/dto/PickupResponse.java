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
    private LocalDate preferredDate;
    private String preferredTime;
    private PickupStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;

    public PickupResponse() {}

    public static PickupResponse fromEntity(Pickup pickup) {
        PickupResponse response = new PickupResponse();
        response.setId(pickup.getId());
        response.setWasteCategory(pickup.getWasteCategory());
        response.setDescription(pickup.getDescription());
        response.setPickupAddress(pickup.getPickupAddress());
        response.setPreferredDate(pickup.getPreferredDate());
        response.setPreferredTime(pickup.getPreferredTime());
        response.setStatus(pickup.getStatus());
        response.setCreatedAt(pickup.getCreatedAt());
        response.setUpdatedAt(pickup.getUpdatedAt());
        if (pickup.getCustomer() != null) {
            response.setCustomerId(pickup.getCustomer().getId());
            response.setCustomerName(pickup.getCustomer().getName());
            response.setCustomerEmail(pickup.getCustomer().getEmail());
            response.setCustomerPhone(pickup.getCustomer().getPhone());
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
}
