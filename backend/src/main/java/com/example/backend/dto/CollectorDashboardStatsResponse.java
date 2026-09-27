package com.example.backend.dto;

import com.example.backend.entity.CollectorAvailability;

public class CollectorDashboardStatsResponse {

    private long assignedPickups;
    private long acceptedPickups;
    private long completedPickups;
    private CollectorAvailability availability;

    public CollectorDashboardStatsResponse() {}

    public CollectorDashboardStatsResponse(long assignedPickups, long acceptedPickups, long completedPickups, CollectorAvailability availability) {
        this.assignedPickups = assignedPickups;
        this.acceptedPickups = acceptedPickups;
        this.completedPickups = completedPickups;
        this.availability = availability;
    }

    public long getAssignedPickups() {
        return assignedPickups;
    }

    public void setAssignedPickups(long assignedPickups) {
        this.assignedPickups = assignedPickups;
    }

    public long getAcceptedPickups() {
        return acceptedPickups;
    }

    public void setAcceptedPickups(long acceptedPickups) {
        this.acceptedPickups = acceptedPickups;
    }

    public long getCompletedPickups() {
        return completedPickups;
    }

    public void setCompletedPickups(long completedPickups) {
        this.completedPickups = completedPickups;
    }

    public CollectorAvailability getAvailability() {
        return availability;
    }

    public void setAvailability(CollectorAvailability availability) {
        this.availability = availability;
    }
}
