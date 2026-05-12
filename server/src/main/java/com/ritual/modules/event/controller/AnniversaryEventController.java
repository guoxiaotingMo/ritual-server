package com.ritual.modules.event.controller;

import com.ritual.common.result.Result;
import com.ritual.modules.event.dto.CreateEventRequest;
import com.ritual.modules.event.dto.UpdateEventRequest;
import com.ritual.modules.event.service.AnniversaryEventService;
import com.ritual.modules.event.vo.CalendarVO;
import com.ritual.modules.event.vo.EventVO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class AnniversaryEventController {

    private final AnniversaryEventService eventService;

    @PostMapping
    public Result<EventVO> createEvent(HttpServletRequest request, @Valid @RequestBody CreateEventRequest createRequest) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.success(eventService.createEvent(userId, createRequest));
    }

    @GetMapping("/{id}")
    public Result<EventVO> getEvent(HttpServletRequest request, @PathVariable Long id) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.success(eventService.getEvent(userId, id));
    }

    @PutMapping("/{id}")
    public Result<EventVO> updateEvent(HttpServletRequest request, @PathVariable Long id, @RequestBody UpdateEventRequest updateRequest) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.success(eventService.updateEvent(userId, id, updateRequest));
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteEvent(HttpServletRequest request, @PathVariable Long id) {
        Long userId = (Long) request.getAttribute("userId");
        eventService.deleteEvent(userId, id);
        return Result.success();
    }

    @GetMapping
    public Result<List<EventVO>> listEvents(HttpServletRequest request, @RequestParam(required = false) Integer category) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.success(eventService.listEvents(userId, category));
    }

    @GetMapping("/calendar/{year}/{month}")
    public Result<List<CalendarVO>> getCalendar(HttpServletRequest request, @PathVariable Integer year, @PathVariable Integer month) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.success(eventService.getCalendar(userId, year, month));
    }
}
