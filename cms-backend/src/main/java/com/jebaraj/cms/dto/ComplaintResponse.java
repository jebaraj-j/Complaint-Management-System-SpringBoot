package com.jebaraj.cms.dto;

import com.jebaraj.cms.enums.ComplaintCategory;
import com.jebaraj.cms.enums.ComplaintStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintResponse {
    private Long id;

    private String title;

    private String description;

    private ComplaintCategory category;

    private ComplaintStatus status;

    private LocalDateTime createdAt;

    private Long studentId;


}
