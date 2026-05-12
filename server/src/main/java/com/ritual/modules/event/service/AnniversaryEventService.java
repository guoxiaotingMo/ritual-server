package com.ritual.modules.event.service;

import com.ritual.modules.event.dto.CreateEventRequest;
import com.ritual.modules.event.dto.UpdateEventRequest;
import com.ritual.modules.event.vo.CalendarVO;
import com.ritual.modules.event.vo.EventVO;

import java.util.List;

public interface AnniversaryEventService {
    EventVO createEvent(Long userId, CreateEventRequest request);
    EventVO updateEvent(Long userId, Long eventId, UpdateEventRequest request);
    void deleteEvent(Long userId, Long eventId);
    EventVO getEvent(Long userId, Long eventId);
    List<EventVO> listEvents(Long userId, Integer category);
    List<CalendarVO> getCalendar(Long userId, Integer year, Integer month);
}
