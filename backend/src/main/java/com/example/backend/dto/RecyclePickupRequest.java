package com.example.backend.dto;

public class RecyclePickupRequest {

    private String recyclingNotes;

    public RecyclePickupRequest() {}

    public RecyclePickupRequest(String recyclingNotes) {
        this.recyclingNotes = recyclingNotes;
    }

    public String getRecyclingNotes() {
        return recyclingNotes;
    }

    public void setRecyclingNotes(String recyclingNotes) {
        this.recyclingNotes = recyclingNotes;
    }
}
