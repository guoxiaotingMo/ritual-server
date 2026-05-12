package com.ritual.modules.event.controller;

import com.ritual.common.result.Result;
import com.ritual.modules.event.entity.ReminderSetting;
import com.ritual.modules.event.entity.RitualConfig;
import com.ritual.modules.event.service.RitualService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/events/{eventId}")
@RequiredArgsConstructor
public class RitualController {

    private final RitualService ritualService;

    @GetMapping("/ritual")
    public Result<RitualConfig> getRitualConfig(@PathVariable Long eventId) {
        return Result.success(ritualService.getRitualConfig(eventId));
    }

    @PutMapping("/ritual")
    public Result<RitualConfig> updateRitualConfig(@PathVariable Long eventId, @RequestBody RitualConfig config) {
        return Result.success(ritualService.updateRitualConfig(eventId, config));
    }

    @GetMapping("/reminder")
    public Result<ReminderSetting> getReminderSetting(@PathVariable Long eventId) {
        return Result.success(ritualService.getReminderSetting(eventId));
    }

    @PutMapping("/reminder")
    public Result<ReminderSetting> updateReminderSetting(@PathVariable Long eventId, @RequestBody ReminderSetting setting) {
        return Result.success(ritualService.updateReminderSetting(eventId, setting));
    }
}
