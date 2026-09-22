package com.jebaraj.cms.service;

import com.jebaraj.cms.dto.StudentLoginRequest;
import com.jebaraj.cms.dto.StudentRegistrationRequest;
import com.jebaraj.cms.dto.StudentResponse;
import com.jebaraj.cms.entity.Student;
import com.jebaraj.cms.exception.EmailAlreadyExistsException;
import com.jebaraj.cms.exception.InvalidCredentialException;
import com.jebaraj.cms.repository.StudentRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentService(StudentRepository studentRepository, PasswordEncoder passwordEncoder) {

        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Register Student
    public StudentResponse registerStudent(
            StudentRegistrationRequest request) {

        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(
                    "Email already exists!");
        }

        Student student = new Student();

        student.setName(request.getName());
        student.setEmail(request.getEmail());
        student.setPassword(passwordEncoder.encode(request.getPassword()));
        student.setDepartment(request.getDepartment());
        student.setCreatedAt(LocalDateTime.now());

        Student savedStudent =
                studentRepository.save(student);

        return mapToStudentResponse(savedStudent);
    }

    // Login Student
    public StudentResponse loginStudent(
            StudentLoginRequest request) {

        Student student =
                studentRepository.findByEmail(
                                request.getEmail())
                        .orElseThrow(() ->
                                new InvalidCredentialException(
                                        "Invalid Email or Password"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                student.getPassword())) {

            throw new InvalidCredentialException(
                    "Invalid Email or Password");
        }

        return mapToStudentResponse(student);
    }

    // Entity -> DTO Mapper
    private StudentResponse mapToStudentResponse(
            Student student) {

        StudentResponse response =
                new StudentResponse();

        response.setId(student.getId());
        response.setName(student.getName());
        response.setEmail(student.getEmail());
        response.setDepartment(student.getDepartment());
        response.setCreatedAt(student.getCreatedAt());

        return response;
    }
}