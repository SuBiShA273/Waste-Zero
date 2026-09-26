package com.example.backend.dto;

import com.example.backend.entity.WasteCategory;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class CreatePickupRequest {

    @NotNull(message = "Waste category is required")
    private WasteCategory wasteCategory;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Pickup address is required")
    private String pickupAddress;

    @NotNull(message = "Preferred date is required")
    @FutureOrPresent(message = "Preferred date cannot be in the past")
    private LocalDate preferredDate;

    @NotBlank(message = "Preferred time is required")
    private String preferredTime;

    public CreatePickupRequest() {}

    public CreatePickupRequest(WasteCategory wasteCategory, String description, String pickupAddress, LocalDate preferredDate, String preferredTime) {
        this.wasteCategory = wasteCategory;
        this.description = description;
        this.pickupAddress = pickupAddress;
        this.preferredDate = preferredDate;
        this.preferredTime = preferredTime;
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
}
