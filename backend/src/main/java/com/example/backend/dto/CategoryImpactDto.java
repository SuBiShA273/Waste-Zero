package com.example.backend.dto;

import com.example.backend.entity.WasteCategory;

public class CategoryImpactDto {

    private WasteCategory category;
    private Double totalWeight;
    private Double co2Saved;
    private Double conversionFactor;
    private long recycledCount;

    public CategoryImpactDto() {}

    public CategoryImpactDto(WasteCategory category, Double totalWeight, Double co2Saved, Double conversionFactor, long recycledCount) {
        this.category = category;
        this.totalWeight = totalWeight;
        this.co2Saved = co2Saved;
        this.conversionFactor = conversionFactor;
        this.recycledCount = recycledCount;
    }

    public WasteCategory getCategory() {
        return category;
    }

    public void setCategory(WasteCategory category) {
        this.category = category;
    }

    public Double getTotalWeight() {
        return totalWeight;
    }

    public void setTotalWeight(Double totalWeight) {
        this.totalWeight = totalWeight;
    }

    public Double getCo2Saved() {
        return co2Saved;
    }

    public void setCo2Saved(Double co2Saved) {
        this.co2Saved = co2Saved;
    }

    public Double getConversionFactor() {
        return conversionFactor;
    }

    public void setConversionFactor(Double conversionFactor) {
        this.conversionFactor = conversionFactor;
    }

    public long getRecycledCount() {
        return recycledCount;
    }

    public void setRecycledCount(long recycledCount) {
        this.recycledCount = recycledCount;
    }
}
