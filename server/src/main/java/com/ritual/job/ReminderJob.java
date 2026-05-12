package com.ritual.job;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ritual.modules.event.entity.AnniversaryEvent;
import com.ritual.modules.event.entity.ReminderSetting;
import com.ritual.modules.event.mapper.AnniversaryEventMapper;
import com.ritual.modules.event.mapper.ReminderSettingMapper;
import com.ritual.modules.notification.entity.NotificationRecord;
import com.ritual.modules.notification.mapper.NotificationRecordMapper;
import com.ritual.modules.notification.service.PushService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class ReminderJob {

    private final AnniversaryEventMapper eventMapper;
    private final ReminderSettingMapper reminderSettingMapper;
    private final NotificationRecordMapper notificationRecordMapper;
    private final PushService pushService;

    @Scheduled(cron = "0 0 9 * * ?")
    public void execute() {
        log.info("开始执行每日提醒任务");
        LocalDate today = LocalDate.now();

        LambdaQueryWrapper<ReminderSetting> settingWrapper = new LambdaQueryWrapper<>();
        settingWrapper.eq(ReminderSetting::getPushEnabled, 1);
        List<ReminderSetting> settings = reminderSettingMapper.selectList(settingWrapper);

        for (ReminderSetting setting : settings) {
            LocalDate reminderDate = today.plusDays(setting.getAdvanceDays());

            LambdaQueryWrapper<AnniversaryEvent> eventWrapper = new LambdaQueryWrapper<>();
            eventWrapper.eq(AnniversaryEvent::getId, setting.getEventId())
                       .eq(AnniversaryEvent::getEventDate, reminderDate);
            AnniversaryEvent event = eventMapper.selectOne(eventWrapper);

            if (event != null) {
                sendReminder(event);
            }
        }
        log.info("每日提醒任务执行完成");
    }

    private void sendReminder(AnniversaryEvent event) {
        String title = "纪念日提醒";
        String content = String.format("%s 即将到来（%s），记得提前准备哦！",
                event.getTitle(), event.getEventDate());

        NotificationRecord notification = new NotificationRecord();
        notification.setUserId(event.getUserId());
        notification.setEventId(event.getId());
        notification.setTitle(title);
        notification.setContent(content);
        notification.setType(1);
        notificationRecordMapper.insert(notification);

        pushService.sendPush(event.getUserId(), title, content);
    }
}
