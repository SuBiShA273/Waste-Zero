package com.example.backend.service;

import com.example.backend.dto.ComplaintResponse;
import com.example.backend.dto.CreateComplaintRequest;
import com.example.backend.dto.UpdateComplaintRequest;
import com.example.backend.entity.Complaint;
import com.example.backend.entity.ComplaintStatus;
import com.example.backend.entity.Pickup;
import com.example.backend.entity.User;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.ComplaintRepository;
import com.example.backend.repository.PickupRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final PickupRepository pickupRepository;

    public ComplaintService(ComplaintRepository complaintRepository, UserRepository userRepository, PickupRepository pickupRepository) {
        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
        this.pickupRepository = pickupRepository;
    }

    @Transactional
    public ComplaintResponse createComplaint(CreateComplaintRequest request, String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated customer profile not found"));

        Pickup pickup = null;
        if (request.getPickupId() != null) {
            pickup = pickupRepository.findById(request.getPickupId())
                    .orElseThrow(() -> new ResourceNotFoundException("Pickup request not found with ID: " + request.getPickupId()));

            // Verify customer owns the pickup if attached
            if (!pickup.getCustomer().getId().equals(customer.getId())) {
                throw new AccessDeniedException("Access denied: You can only file complaints for your own pickups.");
            }
        }

        Complaint complaint = new Complaint(
                customer,
                pickup,
                request.getSubject().trim(),
                request.getDescription().trim()
        );

        Complaint saved = complaintRepository.save(complaint);
        return ComplaintResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<ComplaintResponse> getMyComplaints(String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated customer profile not found"));

        List<Complaint> complaints = complaintRepository.findByCustomerIdOrderByCreatedAtDesc(customer.getId());
        return complaints.stream()
                .map(ComplaintResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ComplaintResponse getComplaintById(Long id, String userEmail, boolean isAdmin) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user profile not found"));

        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with ID: " + id));

        if (!isAdmin && !complaint.getCustomer().getId().equals(user.getId())) {
            throw new AccessDeniedException("Access denied: You are not authorized to view this complaint.");
        }

        return ComplaintResponse.fromEntity(complaint);
    }

    @Transactional
    public ComplaintResponse updateComplaintByAdmin(Long id, UpdateComplaintRequest request, String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated admin profile not found"));

        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with ID: " + id));

        if (request.getStatus() != null) {
            complaint.setStatus(request.getStatus());
            if (request.getStatus() == ComplaintStatus.RESOLVED) {
                complaint.setResolvedAt(LocalDateTime.now());
            }
        }

        if (StringUtils.hasText(request.getAdminResponse())) {
            complaint.setAdminResponse(request.getAdminResponse().trim());
        }

        Complaint updated = complaintRepository.save(complaint);
        return ComplaintResponse.fromEntity(updated);
    }

    @Transactional(readOnly = true)
    public List<ComplaintResponse> getAllComplaintsForAdmin() {
        return complaintRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(ComplaintResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
