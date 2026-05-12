package com.ritual.modules.event.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateEventRequest {
    @NotBlank(message = "标题不能为空")
    private String title;
    @NotNull(message = "日期不能为空")
    private LocalDate eventDate;
    private Integer calendarType = 1;
    private Integer repeatType = 1;
    private Integer category = 4;
    private String relatedPerson;
    private Long relatedPersonId;
    private Integer isShared = 0;
}
