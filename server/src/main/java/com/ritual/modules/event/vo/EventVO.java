package com.ritual.modules.event.vo;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class EventVO {
    private Long id;
    private Long userId;
    private String title;
    private LocalDate eventDate;
    private Integer calendarType;
    private Integer repeatType;
    private Integer category;
    private String relatedPerson;
    private Long relatedPersonId;
    private Integer isShared;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
