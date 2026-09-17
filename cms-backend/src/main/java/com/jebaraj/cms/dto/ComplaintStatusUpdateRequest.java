package com.jebaraj.cms.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintStatusUpdateRequest {

    @NotBlank(message = "Status is Required!")
    private String status;
}
