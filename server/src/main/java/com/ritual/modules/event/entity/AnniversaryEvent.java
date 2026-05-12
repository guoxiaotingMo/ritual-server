package com.ritual.modules.event.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("anniversary_event")
public class AnniversaryEvent {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private String title;
    private LocalDate eventDate;
    private Integer calendarType;
    private Integer repeatType;
    private Integer category;
    private String relatedPerson;
    private Long relatedPersonId;
    private Integer isShared;
    @TableLogic
    private Integer deleted;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
