package com.example.backend.dto;

import java.util.List;

public class CustomerImpactResponse {

    private Double totalWasteRecycled;
    private Double totalCo2Saved;
    private List<CategoryImpactDto> categoryImpacts;
    private List<PickupResponse> recycledPickups;
    private String disclaimer;

    public CustomerImpactResponse() {}

    public CustomerImpactResponse(Double totalWasteRecycled, Double totalCo2Saved, List<CategoryImpactDto> categoryImpacts, List<PickupResponse> recycledPickups) {
        this.totalWasteRecycled = totalWasteRecycled;
        this.totalCo2Saved = totalCo2Saved;
        this.categoryImpacts = categoryImpacts;
        this.recycledPickups = recycledPickups;
        this.disclaimer = "Estimated environmental impact values based on standard conversion factors per waste category.";
    }

    public Double getTotalWasteRecycled() {
        return totalWasteRecycled;
    }

    public void setTotalWasteRecycled(Double totalWasteRecycled) {
        this.totalWasteRecycled = totalWasteRecycled;
    }

    public Double getTotalCo2Saved() {
        return totalCo2Saved;
    }

    public void setTotalCo2Saved(Double totalCo2Saved) {
        this.totalCo2Saved = totalCo2Saved;
    }

    public List<CategoryImpactDto> getCategoryImpacts() {
        return categoryImpacts;
    }

    public void setCategoryImpacts(List<CategoryImpactDto> categoryImpacts) {
        this.categoryImpacts = categoryImpacts;
    }

    public List<PickupResponse> getRecycledPickups() {
        return recycledPickups;
    }

    public void setRecycledPickups(List<PickupResponse> recycledPickups) {
        this.recycledPickups = recycledPickups;
    }

    public String getDisclaimer() {
        return disclaimer;
    }

    public void setDisclaimer(String disclaimer) {
        this.disclaimer = disclaimer;
    }
}
