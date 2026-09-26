package com.example.backend.dto;

public class CustomerDashboardStatsResponse {

    private long totalPickups;
    private long completedPickups;
    private long pendingPickups;
    private long cancelledPickups;

    public CustomerDashboardStatsResponse() {}

    public CustomerDashboardStatsResponse(long totalPickups, long completedPickups, long pendingPickups, long cancelledPickups) {
        this.totalPickups = totalPickups;
        this.completedPickups = completedPickups;
        this.pendingPickups = pendingPickups;
        this.cancelledPickups = cancelledPickups;
    }

    public long getTotalPickups() {
        return totalPickups;
    }

    public void setTotalPickups(long totalPickups) {
        this.totalPickups = totalPickups;
    }

    public long getCompletedPickups() {
        return completedPickups;
    }

    public void setCompletedPickups(long completedPickups) {
        this.completedPickups = completedPickups;
    }

    public long getPendingPickups() {
        return pendingPickups;
    }

    public void setPendingPickups(long pendingPickups) {
        this.pendingPickups = pendingPickups;
    }

    public long getCancelledPickups() {
        return cancelledPickups;
    }

    public void setCancelledPickups(long cancelledPickups) {
        this.cancelledPickups = cancelledPickups;
    }
}
