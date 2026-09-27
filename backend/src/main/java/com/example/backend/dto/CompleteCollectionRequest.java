package com.example.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class CompleteCollectionRequest {

    @NotNull(message = "Actual collected weight is required")
    @Positive(message = "Actual weight must be greater than 0 kg")
    private Double actualWeight;

    private String collectionNotes;

    public CompleteCollectionRequest() {}

    public CompleteCollectionRequest(Double actualWeight, String collectionNotes) {
        this.actualWeight = actualWeight;
        this.collectionNotes = collectionNotes;
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
}
