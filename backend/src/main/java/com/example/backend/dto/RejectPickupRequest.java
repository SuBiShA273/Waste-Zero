package com.example.backend.dto;

public class RejectPickupRequest {

    private String reason;

    public RejectPickupRequest() {}

    public RejectPickupRequest(String reason) {
        this.reason = reason;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
