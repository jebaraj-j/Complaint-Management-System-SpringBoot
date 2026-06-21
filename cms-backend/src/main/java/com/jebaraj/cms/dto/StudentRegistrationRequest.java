package com.jebaraj.cms.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentRegistrationRequest {
    private String name;
    private String email;
    private String password;
    private String department;
}
