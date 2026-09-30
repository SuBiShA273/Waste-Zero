package com.example.backend.dto;

import com.example.backend.entity.ComplaintStatus;

public class UpdateComplaintRequest {

    private ComplaintStatus status;
    private String adminResponse;

    public UpdateComplaintRequest() {}

    public UpdateComplaintRequest(ComplaintStatus status, String adminResponse) {
        this.status = status;
        this.adminResponse = adminResponse;
    }

    public ComplaintStatus getStatus() {
        return status;
    }

    public void setStatus(ComplaintStatus status) {
        this.status = status;
    }

    public String getAdminResponse() {
        return adminResponse;
    }

    public void setAdminResponse(String adminResponse) {
        this.adminResponse = adminResponse;
    }
}
