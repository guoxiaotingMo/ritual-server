package com.ritual.modules.event.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ritual.common.exception.BusinessException;
import com.ritual.common.result.ResultCode;
import com.ritual.modules.event.dto.CreateEventRequest;
import com.ritual.modules.event.dto.UpdateEventRequest;
import com.ritual.modules.event.entity.AnniversaryEvent;
import com.ritual.modules.event.mapper.AnniversaryEventMapper;
import com.ritual.modules.event.service.AnniversaryEventService;
import com.ritual.modules.event.vo.CalendarVO;
import com.ritual.modules.event.vo.EventVO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnniversaryEventServiceImpl implements AnniversaryEventService {

    private final AnniversaryEventMapper eventMapper;

    @Override
    public EventVO createEvent(Long userId, CreateEventRequest request) {
        AnniversaryEvent event = new AnniversaryEvent();
        BeanUtils.copyProperties(request, event);
        event.setUserId(userId);
        eventMapper.insert(event);
        return convertToVO(event);
    }

    @Override
    public EventVO updateEvent(Long userId, Long eventId, UpdateEventRequest request) {
        AnniversaryEvent event = eventMapper.selectById(eventId);
        if (event == null || !event.getUserId().equals(userId)) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        BeanUtils.copyProperties(request, event);
        eventMapper.updateById(event);
        return convertToVO(event);
    }

    @Override
    public void deleteEvent(Long userId, Long eventId) {
        AnniversaryEvent event = eventMapper.selectById(eventId);
        if (event == null || !event.getUserId().equals(userId)) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        eventMapper.deleteById(eventId);
    }

    @Override
    public EventVO getEvent(Long userId, Long eventId) {
        AnniversaryEvent event = eventMapper.selectById(eventId);
        if (event == null || (!event.getUserId().equals(userId) && event.getIsShared() != 1)) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        return convertToVO(event);
    }

    @Override
    public List<EventVO> listEvents(Long userId, Integer category) {
        LambdaQueryWrapper<AnniversaryEvent> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(AnniversaryEvent::getUserId, userId)
               .eq(category != null, AnniversaryEvent::getCategory, category)
               .orderByAsc(AnniversaryEvent::getEventDate);
        return eventMapper.selectList(wrapper).stream()
                .map(this::convertToVO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CalendarVO> getCalendar(Long userId, Integer year, Integer month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate start = yearMonth.atDay(1);
        LocalDate end = yearMonth.atEndOfMonth();

        List<AnniversaryEvent> events = eventMapper.selectByDateRange(userId, start, end);

        List<CalendarVO> calendar = new ArrayList<>();
        for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
            LocalDate currentDate = date;
            List<EventVO> dayEvents = events.stream()
                    .filter(e -> e.getEventDate().equals(currentDate))
                    .map(this::convertToVO)
                    .collect(Collectors.toList());
            if (!dayEvents.isEmpty()) {
                CalendarVO vo = new CalendarVO();
                vo.setDate(currentDate);
                vo.setEvents(dayEvents);
                calendar.add(vo);
            }
        }
        return calendar;
    }

    private EventVO convertToVO(AnniversaryEvent event) {
        EventVO vo = new EventVO();
        BeanUtils.copyProperties(event, vo);
        return vo;
    }
}
