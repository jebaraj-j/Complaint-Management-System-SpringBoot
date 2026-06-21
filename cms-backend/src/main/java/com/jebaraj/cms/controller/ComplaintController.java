package com.jebaraj.cms.controller;

import com.jebaraj.cms.dto.ComplaintCreateRequest;
import com.jebaraj.cms.dto.ComplaintResponse;
import com.jebaraj.cms.dto.ComplaintStatusUpdateRequest;
import com.jebaraj.cms.service.ComplaintService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(
            ComplaintService complaintService) {

        this.complaintService = complaintService;
    }

    @PostMapping
    public ResponseEntity<ComplaintResponse>
    createComplaint(
            @RequestBody
            ComplaintCreateRequest request) {

        ComplaintResponse complaint =
                complaintService.createComplaint(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(complaint);
    }

    @GetMapping
    public ResponseEntity<List<ComplaintResponse>>
    getAllComplaints() {

        List<ComplaintResponse> complaints =
                complaintService.getAllComplaints();

        return ResponseEntity.ok(complaints);
    }

    @PutMapping("/{complaintId}/status")
    public ResponseEntity<ComplaintResponse>
    updateComplaintStatus(

            @PathVariable Long complaintId,

            @RequestBody
            ComplaintStatusUpdateRequest request) {

        ComplaintResponse complaint =
                complaintService.updateComplaintStatus(
                        complaintId,
                        request);

        return ResponseEntity.ok(complaint);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<ComplaintResponse>> getComplaintByStudentId(@PathVariable Long studentId){
        List<ComplaintResponse> complaints = complaintService.getComplaintByStudentId(studentId);
        return ResponseEntity.ok(complaints);
    }
}