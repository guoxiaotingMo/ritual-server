package com.ritual.modules.event.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ritual.modules.event.entity.ReminderSetting;
import com.ritual.modules.event.entity.RitualConfig;
import com.ritual.modules.event.mapper.ReminderSettingMapper;
import com.ritual.modules.event.mapper.RitualConfigMapper;
import com.ritual.modules.event.service.RitualService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RitualServiceImpl implements RitualService {

    private final RitualConfigMapper ritualConfigMapper;
    private final ReminderSettingMapper reminderSettingMapper;

    @Override
    public RitualConfig getRitualConfig(Long eventId) {
        LambdaQueryWrapper<RitualConfig> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(RitualConfig::getEventId, eventId);
        return ritualConfigMapper.selectOne(wrapper);
    }

    @Override
    public RitualConfig updateRitualConfig(Long eventId, RitualConfig config) {
        config.setEventId(eventId);
        LambdaQueryWrapper<RitualConfig> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(RitualConfig::getEventId, eventId);
        RitualConfig existing = ritualConfigMapper.selectOne(wrapper);
        if (existing != null) {
            config.setId(existing.getId());
            ritualConfigMapper.updateById(config);
        } else {
            ritualConfigMapper.insert(config);
        }
        return config;
    }

    @Override
    public ReminderSetting getReminderSetting(Long eventId) {
        LambdaQueryWrapper<ReminderSetting> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ReminderSetting::getEventId, eventId);
        return reminderSettingMapper.selectOne(wrapper);
    }

    @Override
    public ReminderSetting updateReminderSetting(Long eventId, ReminderSetting setting) {
        setting.setEventId(eventId);
        LambdaQueryWrapper<ReminderSetting> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ReminderSetting::getEventId, eventId);
        ReminderSetting existing = reminderSettingMapper.selectOne(wrapper);
        if (existing != null) {
            setting.setId(existing.getId());
            reminderSettingMapper.updateById(setting);
        } else {
            reminderSettingMapper.insert(setting);
        }
        return setting;
    }
}
