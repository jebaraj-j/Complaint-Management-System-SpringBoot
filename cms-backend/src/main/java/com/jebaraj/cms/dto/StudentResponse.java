package com.jebaraj.cms.dto;

import com.jebaraj.cms.entity.Student;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentResponse {
    private Long id;
    private String name;
    private String email;
    private String department;
    private LocalDateTime createdAt;

    private StudentResponse mapToStudentResponse(Student student){
        StudentResponse response = new StudentResponse();
        response.setId(student.getId());
        response.setName(student.getName());
        response.setEmail(student.getEmail());
        response.setDepartment(response.getDepartment());
        response.setCreatedAt(response.getCreatedAt());

        return response;
    }
}
