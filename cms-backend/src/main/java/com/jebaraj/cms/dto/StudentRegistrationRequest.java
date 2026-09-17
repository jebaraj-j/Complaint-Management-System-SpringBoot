package com.jebaraj.cms.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentRegistrationRequest {

    @NotBlank(message="Name is required!")
    private String name;

    @NotBlank(message = "Email is required!")
    @Email(message = "Enter a valid Email")
    private String email;

    @NotBlank(message = "Password is required!")
    @Size(min = 6, message = "Password must contain minimum 6 characters")
    private String password;

    @NotBlank(message = "Department is required!")
    private String department;
}
