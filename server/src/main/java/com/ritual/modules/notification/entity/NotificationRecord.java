package com.ritual.modules.notification.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("notification_record")
public class NotificationRecord {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private Long eventId;
    private String title;
    private String content;
    private Integer type;
    private Integer isRead;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
