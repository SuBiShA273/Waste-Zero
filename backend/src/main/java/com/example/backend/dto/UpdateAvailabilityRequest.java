package com.example.backend.dto;

import com.example.backend.entity.CollectorAvailability;
import jakarta.validation.constraints.NotNull;

public class UpdateAvailabilityRequest {

    @NotNull(message = "Availability status is required")
    private CollectorAvailability availability;

    public UpdateAvailabilityRequest() {}

    public UpdateAvailabilityRequest(CollectorAvailability availability) {
        this.availability = availability;
    }

    public CollectorAvailability getAvailability() {
        return availability;
    }

    public void setAvailability(CollectorAvailability availability) {
        this.availability = availability;
    }
}
