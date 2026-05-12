package com.ritual.modules.relation.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("user_relation")
public class UserRelation {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private Long partnerId;
    private Integer relationType;
    private Integer status;
    private String inviteCode;
    @TableLogic
    private Integer deleted;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
