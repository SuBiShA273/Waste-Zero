package com.example.backend.dto;

import com.example.backend.entity.PickupStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateStatusRequest {

    @NotNull(message = "Status is required")
    private PickupStatus status;

    public UpdateStatusRequest() {}

    public UpdateStatusRequest(PickupStatus status) {
        this.status = status;
    }

    public PickupStatus getStatus() {
        return status;
    }

    public void setStatus(PickupStatus status) {
        this.status = status;
    }
}
