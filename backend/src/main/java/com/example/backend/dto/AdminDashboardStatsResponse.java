package com.example.backend.dto;

import java.util.List;
import java.util.Map;

public class AdminDashboardStatsResponse {
    private long totalUsers;
    private long totalCustomers;
    private long totalCollectors;
    private long activeCollectors;
    private long totalPickups;
    private long pendingPickups;
    private long activePickups;
    private long collectedPickups;
    private long recycledPickups;
    private long cancelledPickups;
    private long openComplaints;
    private long underReviewComplaints;
    private long resolvedComplaints;
    private double totalWasteRecycled;
    private double estimatedCo2Saved;
    private double estimatedTreesSaved;
    private double estimatedWaterSaved;
    private double estimatedEnergySaved;
    private Map<String, Long> statusCounts;
    private List<CategoryImpactDto> categoryBreakdown;

    public AdminDashboardStatsResponse() {}

    public AdminDashboardStatsResponse(
            long totalUsers, long totalCustomers, long totalCollectors, long activeCollectors,
            long totalPickups, long pendingPickups, long activePickups, long collectedPickups,
            long recycledPickups, long cancelledPickups, long openComplaints, long underReviewComplaints,
            long resolvedComplaints, double totalWasteRecycled, double estimatedCo2Saved,
            double estimatedTreesSaved, double estimatedWaterSaved, double estimatedEnergySaved,
            Map<String, Long> statusCounts, List<CategoryImpactDto> categoryBreakdown
    ) {
        this.totalUsers = totalUsers;
        this.totalCustomers = totalCustomers;
        this.totalCollectors = totalCollectors;
        this.activeCollectors = activeCollectors;
        this.totalPickups = totalPickups;
        this.pendingPickups = pendingPickups;
        this.activePickups = activePickups;
        this.collectedPickups = collectedPickups;
        this.recycledPickups = recycledPickups;
        this.cancelledPickups = cancelledPickups;
        this.openComplaints = openComplaints;
        this.underReviewComplaints = underReviewComplaints;
        this.resolvedComplaints = resolvedComplaints;
        this.totalWasteRecycled = totalWasteRecycled;
        this.estimatedCo2Saved = estimatedCo2Saved;
        this.estimatedTreesSaved = estimatedTreesSaved;
        this.estimatedWaterSaved = estimatedWaterSaved;
        this.estimatedEnergySaved = estimatedEnergySaved;
        this.statusCounts = statusCounts;
        this.categoryBreakdown = categoryBreakdown;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public long getTotalCollectors() {
        return totalCollectors;
    }

    public void setTotalCollectors(long totalCollectors) {
        this.totalCollectors = totalCollectors;
    }

    public long getActiveCollectors() {
        return activeCollectors;
    }

    public void setActiveCollectors(long activeCollectors) {
        this.activeCollectors = activeCollectors;
    }

    public long getTotalPickups() {
        return totalPickups;
    }

    public void setTotalPickups(long totalPickups) {
        this.totalPickups = totalPickups;
    }

    public long getPendingPickups() {
        return pendingPickups;
    }

    public void setPendingPickups(long pendingPickups) {
        this.pendingPickups = pendingPickups;
    }

    public long getActivePickups() {
        return activePickups;
    }

    public void setActivePickups(long activePickups) {
        this.activePickups = activePickups;
    }

    public long getCollectedPickups() {
        return collectedPickups;
    }

    public void setCollectedPickups(long collectedPickups) {
        this.collectedPickups = collectedPickups;
    }

    public long getRecycledPickups() {
        return recycledPickups;
    }

    public void setRecycledPickups(long recycledPickups) {
        this.recycledPickups = recycledPickups;
    }

    public long getCancelledPickups() {
        return cancelledPickups;
    }

    public void setCancelledPickups(long cancelledPickups) {
        this.cancelledPickups = cancelledPickups;
    }

    public long getOpenComplaints() {
        return openComplaints;
    }

    public void setOpenComplaints(long openComplaints) {
        this.openComplaints = openComplaints;
    }

    public long getUnderReviewComplaints() {
        return underReviewComplaints;
    }

    public void setUnderReviewComplaints(long underReviewComplaints) {
        this.underReviewComplaints = underReviewComplaints;
    }

    public long getResolvedComplaints() {
        return resolvedComplaints;
    }

    public void setResolvedComplaints(long resolvedComplaints) {
        this.resolvedComplaints = resolvedComplaints;
    }

    public double getTotalWasteRecycled() {
        return totalWasteRecycled;
    }

    public void setTotalWasteRecycled(double totalWasteRecycled) {
        this.totalWasteRecycled = totalWasteRecycled;
    }

    public double getEstimatedCo2Saved() {
        return estimatedCo2Saved;
    }

    public void setEstimatedCo2Saved(double estimatedCo2Saved) {
        this.estimatedCo2Saved = estimatedCo2Saved;
    }

    public double getEstimatedTreesSaved() {
        return estimatedTreesSaved;
    }

    public void setEstimatedTreesSaved(double estimatedTreesSaved) {
        this.estimatedTreesSaved = estimatedTreesSaved;
    }

    public double getEstimatedWaterSaved() {
        return estimatedWaterSaved;
    }

    public void setEstimatedWaterSaved(double estimatedWaterSaved) {
        this.estimatedWaterSaved = estimatedWaterSaved;
    }

    public double getEstimatedEnergySaved() {
        return estimatedEnergySaved;
    }

    public void setEstimatedEnergySaved(double estimatedEnergySaved) {
        this.estimatedEnergySaved = estimatedEnergySaved;
    }

    public Map<String, Long> getStatusCounts() {
        return statusCounts;
    }

    public void setStatusCounts(Map<String, Long> statusCounts) {
        this.statusCounts = statusCounts;
    }

    public List<CategoryImpactDto> getCategoryBreakdown() {
        return categoryBreakdown;
    }

    public void setCategoryBreakdown(List<CategoryImpactDto> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }
}
