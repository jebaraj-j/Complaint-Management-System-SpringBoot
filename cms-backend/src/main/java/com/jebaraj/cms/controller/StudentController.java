package com.jebaraj.cms.controller;

import com.jebaraj.cms.dto.StudentLoginRequest;
import com.jebaraj.cms.dto.StudentRegistrationRequest;
import com.jebaraj.cms.dto.StudentResponse;
import com.jebaraj.cms.entity.Student;
import com.jebaraj.cms.service.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping("/register")
    public ResponseEntity<StudentResponse> registerStudent(
            @RequestBody StudentRegistrationRequest request) {

        StudentResponse savedStudent = studentService.registerStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedStudent);
    }
    @PostMapping("/login")
    public ResponseEntity<StudentResponse> loginStudent(@RequestBody StudentLoginRequest request){
        StudentResponse student = studentService.loginStudent(request);
        return ResponseEntity.ok(student);
    }
}