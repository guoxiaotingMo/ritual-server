package com.ritual.modules.event.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateEventRequest {
    private String title;
    private LocalDate eventDate;
    private Integer calendarType;
    private Integer repeatType;
    private Integer category;
    private String relatedPerson;
    private Long relatedPersonId;
    private Integer isShared;
}
