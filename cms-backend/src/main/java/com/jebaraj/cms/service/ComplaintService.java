package com.jebaraj.cms.service;

import com.jebaraj.cms.dto.ComplaintCreateRequest;
import com.jebaraj.cms.dto.ComplaintResponse;
import com.jebaraj.cms.dto.ComplaintStatusUpdateRequest;
import com.jebaraj.cms.entity.Complaint;
import com.jebaraj.cms.enums.ComplaintCategory;
import com.jebaraj.cms.enums.ComplaintStatus;
import com.jebaraj.cms.repository.ComplaintRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ComplaintService {
    private final ComplaintRepository complaintRepository;

    public ComplaintService(ComplaintRepository complaintRepository){
        this.complaintRepository = complaintRepository;
    }

    public ComplaintResponse createComplaint(ComplaintCreateRequest request){
        Complaint complaint = new Complaint();

        complaint.setTitle(request.getTitle());
        complaint.setDescription(request.getDescription());
        complaint.setCategory(ComplaintCategory.valueOf(request.getCategory().toUpperCase()));
        complaint.setCreatedAt(LocalDateTime.now());
        complaint.setStatus(ComplaintStatus.SUBMITTED);
        complaint.setStudentId(request.getStudentId());

        Complaint savedComplaint = complaintRepository.save(complaint);
        return mapToComplaintResponse(savedComplaint);
    }

    public List<ComplaintResponse> getAllComplaints(){

        return complaintRepository.findAll().stream().map(this::mapToComplaintResponse).toList();
    }

    public List<ComplaintResponse> getComplaintByStudentId(Long studentId){
        return complaintRepository.findByStudentId(studentId).stream().map(this::mapToComplaintResponse).toList();
    }

    public ComplaintResponse updateComplaintStatus(Long complaintId,
                                           ComplaintStatusUpdateRequest request){
        Complaint complaint = complaintRepository.findById(complaintId).orElseThrow(() -> new RuntimeException("Complaint Not Found"));

        complaint.setStatus(ComplaintStatus.valueOf(request.getStatus().toUpperCase()));

        Complaint updatedComplaint = complaintRepository.save(complaint);

        return mapToComplaintResponse(updatedComplaint);
    }

    private ComplaintResponse mapToComplaintResponse(Complaint complaint){
        ComplaintResponse response = new ComplaintResponse();
        response.setId(complaint.getId());
        response.setTitle(complaint.getTitle());
        response.setDescription(complaint.getDescription());
        response.setCategory(complaint.getCategory());
        response.setStatus(complaint.getStatus());
        response.setCreatedAt(complaint.getCreatedAt());
        response.setStudentId(complaint.getStudentId());

        return response;
    }


}
