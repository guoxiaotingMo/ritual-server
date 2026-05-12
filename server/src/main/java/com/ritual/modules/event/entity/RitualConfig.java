package com.ritual.modules.event.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("ritual_config")
public class RitualConfig {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long eventId;
    private Integer needGift;
    private Integer needBlessing;
    private Integer needMoment;
    private Integer needCake;
    private Integer needFlower;
    private Integer needDinner;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
