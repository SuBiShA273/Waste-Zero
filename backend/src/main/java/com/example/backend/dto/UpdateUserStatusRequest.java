package com.example.backend.dto;

public class UpdateUserStatusRequest {

    private Boolean active;

    public UpdateUserStatusRequest() {}

    public UpdateUserStatusRequest(Boolean active) {
        this.active = active;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
