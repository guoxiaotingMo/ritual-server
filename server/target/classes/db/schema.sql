CREATE DATABASE IF NOT EXISTS ritual_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE ritual_db;

CREATE TABLE IF NOT EXISTS user_info (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    phone VARCHAR(20) NOT NULL UNIQUE COMMENT '手机号',
    password VARCHAR(255) NOT NULL COMMENT '加密密码',
    nick_name VARCHAR(50) COMMENT '昵称',
    avatar VARCHAR(500) COMMENT '头像URL',
    gender TINYINT DEFAULT 0 COMMENT '性别 0未知 1男 2女',
    birthday DATE COMMENT '生日',
    status TINYINT DEFAULT 1 COMMENT '状态 0禁用 1正常',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除 0未删除 1已删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_phone (phone),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户信息表';

CREATE TABLE IF NOT EXISTS anniversary_event (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '事件ID',
    user_id BIGINT NOT NULL COMMENT '创建者ID',
    title VARCHAR(100) NOT NULL COMMENT '标题',
    event_date DATE NOT NULL COMMENT '纪念日期',
    calendar_type TINYINT DEFAULT 1 COMMENT '历法 1公历 2农历',
    repeat_type TINYINT DEFAULT 1 COMMENT '重复 0不重复 1每年 2每月',
    category TINYINT DEFAULT 4 COMMENT '分类 1生日 2纪念日 3节日 4自定义',
    related_person VARCHAR(50) COMMENT '关联人名称',
    related_person_id BIGINT COMMENT '关联用户ID',
    is_shared TINYINT DEFAULT 0 COMMENT '是否共享 0否 1是',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_user_id (user_id),
    INDEX idx_event_date (event_date),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='纪念日表';

CREATE TABLE IF NOT EXISTS ritual_config (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '配置ID',
    event_id BIGINT NOT NULL UNIQUE COMMENT '关联纪念日',
    need_gift TINYINT DEFAULT 0 COMMENT '是否需要礼物',
    need_blessing TINYINT DEFAULT 0 COMMENT '是否需要祝福语',
    need_moment TINYINT DEFAULT 0 COMMENT '是否需要发朋友圈',
    need_cake TINYINT DEFAULT 0 COMMENT '是否需要蛋糕',
    need_flower TINYINT DEFAULT 0 COMMENT '是否需要鲜花',
    need_dinner TINYINT DEFAULT 0 COMMENT '是否需要订餐',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_event_id (event_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='仪式感配置表';

CREATE TABLE IF NOT EXISTS reminder_setting (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '设置ID',
    event_id BIGINT NOT NULL UNIQUE COMMENT '关联纪念日',
    advance_days INT DEFAULT 1 COMMENT '提前天数',
    reminder_time TIME DEFAULT '09:00:00' COMMENT '提醒时间',
    push_enabled TINYINT DEFAULT 1 COMMENT '是否启用推送',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_event_id (event_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='提醒设置表';

CREATE TABLE IF NOT EXISTS user_relation (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '关系ID',
    user_id BIGINT NOT NULL COMMENT '用户A',
    partner_id BIGINT COMMENT '用户B',
    relation_type TINYINT DEFAULT 1 COMMENT '关系类型 1情侣 2夫妻 3家庭',
    status TINYINT DEFAULT 0 COMMENT '状态 0邀请中 1已绑定 2已解除',
    invite_code VARCHAR(20) UNIQUE COMMENT '邀请码',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_user_id (user_id),
    INDEX idx_partner_id (partner_id),
    INDEX idx_invite_code (invite_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户关系表';

CREATE TABLE IF NOT EXISTS recommend_content (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '内容ID',
    category TINYINT NOT NULL COMMENT '分类 1礼物 2祝福语 3文案 4蛋糕 5鲜花 6美食',
    title VARCHAR(200) NOT NULL COMMENT '标题',
    content TEXT COMMENT '内容',
    tags VARCHAR(500) COMMENT '标签 JSON格式',
    sort_order INT DEFAULT 0 COMMENT '排序',
    is_active TINYINT DEFAULT 1 COMMENT '是否启用',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_category (category),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='推荐内容表';

CREATE TABLE IF NOT EXISTS notification_record (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '通知ID',
    user_id BIGINT NOT NULL COMMENT '接收用户',
    event_id BIGINT COMMENT '关联纪念日',
    title VARCHAR(200) NOT NULL COMMENT '通知标题',
    content VARCHAR(500) COMMENT '通知内容',
    type TINYINT DEFAULT 1 COMMENT '类型 1提醒 2系统',
    is_read TINYINT DEFAULT 0 COMMENT '是否已读',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='通知记录表';
