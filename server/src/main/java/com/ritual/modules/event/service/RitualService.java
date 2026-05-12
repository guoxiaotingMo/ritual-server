package com.ritual.modules.event.service;

import com.ritual.modules.event.entity.ReminderSetting;
import com.ritual.modules.event.entity.RitualConfig;

public interface RitualService {
    RitualConfig getRitualConfig(Long eventId);
    RitualConfig updateRitualConfig(Long eventId, RitualConfig config);
    ReminderSetting getReminderSetting(Long eventId);
    ReminderSetting updateReminderSetting(Long eventId, ReminderSetting setting);
}
