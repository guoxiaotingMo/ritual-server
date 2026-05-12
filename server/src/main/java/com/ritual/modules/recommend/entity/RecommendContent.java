package com.ritual.modules.recommend.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("recommend_content")
public class RecommendContent {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Integer category;
    private String title;
    private String content;
    private String tags;
    private Integer sortOrder;
    private Integer isActive;
    private LocalDateTime createdAt;
}
