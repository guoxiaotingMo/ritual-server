package com.ritual.modules.event.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@TableName("reminder_setting")
public class ReminderSetting {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long eventId;
    private Integer advanceDays;
    private LocalTime reminderTime;
    private Integer pushEnabled;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
