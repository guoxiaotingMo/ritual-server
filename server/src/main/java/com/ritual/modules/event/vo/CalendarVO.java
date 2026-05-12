package com.ritual.modules.event.vo;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class CalendarVO {
    private LocalDate date;
    private List<EventVO> events;
}
