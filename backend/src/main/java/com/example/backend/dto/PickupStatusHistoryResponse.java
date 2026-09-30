package com.example.backend.dto;

import com.example.backend.entity.PickupStatus;
import com.example.backend.entity.PickupStatusHistory;

import java.time.LocalDateTime;

public class PickupStatusHistoryResponse {

    private Long id;
    private PickupStatus status;
    private LocalDateTime changedAt;
    private Long changedById;
    private String changedByName;
    private String notes;

    public PickupStatusHistoryResponse() {}

    public static PickupStatusHistoryResponse fromEntity(PickupStatusHistory history) {
        PickupStatusHistoryResponse dto = new PickupStatusHistoryResponse();
        dto.setId(history.getId());
        dto.setStatus(history.getStatus());
        dto.setChangedAt(history.getChangedAt());
        dto.setNotes(history.getNotes());
        if (history.getChangedBy() != null) {
            dto.setChangedById(history.getChangedBy().getId());
            dto.setChangedByName(history.getChangedBy().getName());
        }
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PickupStatus getStatus() {
        return status;
    }

    public void setStatus(PickupStatus status) {
        this.status = status;
    }

    public LocalDateTime getChangedAt() {
        return changedAt;
    }

    public void setChangedAt(LocalDateTime changedAt) {
        this.changedAt = changedAt;
    }

    public Long getChangedById() {
        return changedById;
    }

    public void setChangedById(Long changedById) {
        this.changedById = changedById;
    }

    public String getChangedByName() {
        return changedByName;
    }

    public void setChangedByName(String changedByName) {
        this.changedByName = changedByName;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
