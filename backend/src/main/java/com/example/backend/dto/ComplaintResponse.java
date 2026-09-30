package com.example.backend.dto;

import com.example.backend.entity.Complaint;
import com.example.backend.entity.ComplaintStatus;

import java.time.LocalDateTime;

public class ComplaintResponse {

    private Long id;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private Long pickupId;
    private String pickupCategory;
    private String subject;
    private String description;
    private ComplaintStatus status;
    private String adminResponse;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;

    public ComplaintResponse() {}

    public static ComplaintResponse fromEntity(Complaint complaint) {
        ComplaintResponse dto = new ComplaintResponse();
        dto.setId(complaint.getId());
        dto.setSubject(complaint.getSubject());
        dto.setDescription(complaint.getDescription());
        dto.setStatus(complaint.getStatus());
        dto.setAdminResponse(complaint.getAdminResponse());
        dto.setCreatedAt(complaint.getCreatedAt());
        dto.setUpdatedAt(complaint.getUpdatedAt());
        dto.setResolvedAt(complaint.getResolvedAt());

        if (complaint.getCustomer() != null) {
            dto.setCustomerId(complaint.getCustomer().getId());
            dto.setCustomerName(complaint.getCustomer().getName());
            dto.setCustomerEmail(complaint.getCustomer().getEmail());
        }

        if (complaint.getPickup() != null) {
            dto.setPickupId(complaint.getPickup().getId());
            if (complaint.getPickup().getWasteCategory() != null) {
                dto.setPickupCategory(complaint.getPickup().getWasteCategory().name());
            }
        }

        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Long getPickupId() {
        return pickupId;
    }

    public void setPickupId(Long pickupId) {
        this.pickupId = pickupId;
    }

    public String getPickupCategory() {
        return pickupCategory;
    }

    public void setPickupCategory(String pickupCategory) {
        this.pickupCategory = pickupCategory;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ComplaintStatus getStatus() {
        return status;
    }

    public void setStatus(ComplaintStatus status) {
        this.status = status;
    }

    public String getAdminResponse() {
        return adminResponse;
    }

    public void setAdminResponse(String adminResponse) {
        this.adminResponse = adminResponse;
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

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }
}
