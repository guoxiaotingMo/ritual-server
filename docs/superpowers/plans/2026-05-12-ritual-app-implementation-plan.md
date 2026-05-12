# 仪式感APP 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 从零搭建仪式感APP的完整前后端项目，包含用户系统、纪念日管理、仪式感定制、智能提醒、情侣关联、内容推荐等核心功能。

**Architecture:** 模块化单体后端（Spring Boot）+ React Native跨平台前端，本地WatermelonDB离线存储+云端MySQL同步，Redis缓存，XXL-Job定时推送。

**Tech Stack:** Java 17 + Spring Boot 3.x + MyBatis-Plus + MySQL 8 + Redis + React Native + TypeScript + Zustand + WatermelonDB

---

## 阶段划分

| 阶段 | 名称 | 目标 | 预估工期 |
|------|------|------|----------|
| Phase 1 | 基础设施搭建 | 项目骨架、数据库、公共组件 | 2-3天 |
| Phase 2 | 用户认证模块 | 注册/登录/JWT/个人信息 | 2-3天 |
| Phase 3 | 纪念日管理模块 | CRUD/日历/农历 | 3-4天 |
| Phase 4 | 仪式感定制模块 | 配置/提醒设置 | 2-3天 |
| Phase 5 | 内容推荐模块 | 静态推荐库/发现页 | 2-3天 |
| Phase 6 | 智能提醒模块 | 推送/通知中心/XXL-Job | 3-4天 |
| Phase 7 | 情侣关联模块 | 邀请/绑定/共享 | 2-3天 |
| Phase 8 | 前端APP开发 | React Native页面/交互 | 5-7天 |
| Phase 9 | 联调测试 | 端到端测试/修复 | 3-4天 |
| Phase 10 | 部署上线 | Docker/服务器配置 | 2-3天 |

---

## Phase 1: 基础设施搭建

### Task 1.1: 创建后端项目骨架

**Files:**
- Create: `server/pom.xml`
- Create: `server/src/main/java/com/ritual/RitualApplication.java`
- Create: `server/src/main/resources/application.yml`
- Create: `server/src/main/resources/application-dev.yml`
- Create: `server/src/main/resources/application-prod.yml`

- [ ] **Step 1: 创建 Maven 多模块项目 POM**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>
    <groupId>com.ritual</groupId>
    <artifactId>ritual-server</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>
    <name>ritual-server</name>
    <description>仪式感APP后端服务</description>
    <properties>
        <java.version>17</java.version>
        <mybatis-plus.version>3.5.5</mybatis-plus.version>
    </properties>
    <dependencies>
        <!-- Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <!-- Validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <!-- MySQL -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
        <!-- MyBatis Plus -->
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-boot-starter</artifactId>
            <version>${mybatis-plus.version}</version>
        </dependency>
        <!-- Redis -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>
        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.12.3</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.12.3</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.12.3</version>
            <scope>runtime</scope>
        </dependency>
        <!-- BCrypt -->
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-crypto</artifactId>
        </dependency>
        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <!-- Test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

- [ ] **Step 2: 创建 Spring Boot 启动类**

```java
package com.ritual;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.ritual.modules.**.mapper")
public class RitualApplication {
    public static void main(String[] args) {
        SpringApplication.run(RitualApplication.class, args);
    }
}
```

- [ ] **Step 3: 创建主配置文件**

```yaml
# application.yml
spring:
  profiles:
    active: dev
  application:
    name: ritual-server

server:
  port: 8080
  servlet:
    context-path: /api/v1

mybatis-plus:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
    map-underscore-to-camel-case: true
  global-config:
    db-config:
      id-type: auto
      logic-delete-field: deleted
      logic-delete-value: 1
      logic-not-delete-value: 0
  mapper-locations: classpath*:/mapper/**/*.xml

jwt:
  secret: ${JWT_SECRET:ritual-app-secret-key-change-in-production}
  access-token-expiration: 86400000
  refresh-token-expiration: 604800000
```

- [ ] **Step 4: 创建开发环境配置**

```yaml
# application-dev.yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ritual_db?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai
    username: ${DB_USERNAME:root}
    password: ${DB_PASSWORD:root}
    driver-class-name: com.mysql.cj.jdbc.Driver
  redis:
    host: localhost
    port: 6379
    password: ${REDIS_PASSWORD:}
    database: 0
    timeout: 5000ms
    lettuce:
      pool:
        max-active: 8
        max-idle: 8
        min-idle: 0

logging:
  level:
    com.ritual: debug
```

- [ ] **Step 5: 验证项目能启动**

Run: `cd server && mvn spring-boot:run`
Expected: 应用启动成功，监听 8080 端口

- [ ] **Step 6: Commit**

```bash
git add server/
git commit -m "feat: init Spring Boot project skeleton"
```

---

### Task 1.2: 创建数据库表结构

**Files:**
- Create: `server/src/main/resources/db/schema.sql`
- Create: `server/src/main/resources/db/data.sql`

- [ ] **Step 1: 编写数据库初始化脚本**

```sql
-- schema.sql
CREATE DATABASE IF NOT EXISTS ritual_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE ritual_db;

-- 用户表
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

-- 纪念日表
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

-- 仪式感配置表
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

-- 提醒设置表
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

-- 用户关系表
CREATE TABLE IF NOT EXISTS user_relation (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '关系ID',
    user_id BIGINT NOT NULL COMMENT '用户A',
    partner_id BIGINT NOT NULL COMMENT '用户B',
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

-- 推荐内容表
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

-- 通知记录表
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
```

- [ ] **Step 2: 编写初始数据脚本**

```sql
-- data.sql
-- 插入推荐内容示例数据
INSERT INTO recommend_content (category, title, content, tags, sort_order) VALUES
(1, '口红礼盒', 'YSL/迪奥/香奈儿经典色号礼盒，永不出错的选择', '["美妆","经典","礼盒"]', 1),
(1, '定制相册', '将你们的照片制作成精美相册，记录美好回忆', '["定制","回忆","照片"]', 2),
(1, '情侣对戒', '简约设计的情侣对戒，象征永恒的承诺', '["首饰","情侣","承诺"]', 3),
(1, '香薰蜡烛', '高级香薰蜡烛，营造浪漫氛围', '["居家","浪漫","氛围"]', 4),
(2, '生日快乐', '亲爱的，生日快乐！愿你每一天都充满阳光和欢笑，我会一直陪在你身边。', '["生日","温馨","简短"]', 1),
(2, '纪念日祝福', '又是一年，感谢你一直在我身边。未来的日子，我们继续携手前行。', '["纪念日","感恩","携手"]', 2),
(2, '情人节', '遇见你，是我这辈子最美好的事情。情人节快乐，我的爱人。', '["情人节","浪漫","爱情"]', 3),
(3, '领证纪念日', 'X年前的今天，我们成为了法律上的夫妻。感谢你，让我的生命完整。❤️', '["领证","夫妻","感恩"]', 1),
(3, '生日朋友圈', '祝全世界最好的你生日快乐！愿你永远十八岁，永远被爱包围。', '["生日","祝福","朋友"]', 2),
(3, '结婚纪念日', '结婚X周年快乐！从两个人到一家人，感谢有你，未来可期。', '["结婚","周年","家庭"]', 3),
(4, '草莓奶油蛋糕', '经典草莓奶油蛋糕，新鲜草莓搭配绵密奶油', '["经典","水果","奶油"]', 1),
(4, '慕斯蛋糕', '芒果慕斯蛋糕，入口即化的丝滑口感', '["慕斯","芒果","丝滑"]', 2),
(5, '红玫瑰花束', '11朵红玫瑰，代表一心一意的爱', '["玫瑰","经典","爱情"]', 1),
(5, '满天星花束', '满天星搭配向日葵，清新自然的搭配', '["满天星","清新","自然"]', 2),
(6, '日式料理', '精致的日式料理，适合浪漫的约会晚餐', '["日料","精致","约会"]', 1),
(6, '法式西餐', '浪漫的法式西餐，红酒配牛排的经典组合', '["西餐","浪漫","经典"]', 2);
```

- [ ] **Step 3: 在 application-dev.yml 中配置 SQL 初始化**

```yaml
spring:
  sql:
    init:
      mode: always
      schema-locations: classpath:db/schema.sql
      data-locations: classpath:db/data.sql
```

- [ ] **Step 4: Commit**

```bash
git add server/src/main/resources/db/
git commit -m "feat: add database schema and initial data"
```

---

### Task 1.3: 搭建公共基础设施

**Files:**
- Create: `server/src/main/java/com/ritual/common/result/Result.java`
- Create: `server/src/main/java/com/ritual/common/result/ResultCode.java`
- Create: `server/src/main/java/com/ritual/common/exception/BusinessException.java`
- Create: `server/src/main/java/com/ritual/common/exception/GlobalExceptionHandler.java`
- Create: `server/src/main/java/com/ritual/common/config/WebConfig.java`
- Create: `server/src/main/java/com/ritual/common/interceptor/JwtInterceptor.java`
- Create: `server/src/main/java/com/ritual/common/util/JwtUtil.java`
- Create: `server/src/main/java/com/ritual/common/util/PasswordUtil.java`

- [ ] **Step 1: 创建统一返回结果类**

```java
package com.ritual.common.result;

import lombok.Data;

import java.time.Instant;

@Data
public class Result<T> {
    private Integer code;
    private String message;
    private T data;
    private Long timestamp;

    public Result() {
        this.timestamp = Instant.now().toEpochMilli();
    }

    public static <T> Result<T> success() {
        return success(null);
    }

    public static <T> Result<T> success(T data) {
        Result<T> result = new Result<>();
        result.setCode(ResultCode.SUCCESS.getCode());
        result.setMessage(ResultCode.SUCCESS.getMessage());
        result.setData(data);
        return result;
    }

    public static <T> Result<T> error(String message) {
        return error(ResultCode.ERROR.getCode(), message);
    }

    public static <T> Result<T> error(Integer code, String message) {
        Result<T> result = new Result<>();
        result.setCode(code);
        result.setMessage(message);
        return result;
    }

    public static <T> Result<T> error(ResultCode resultCode) {
        Result<T> result = new Result<>();
        result.setCode(resultCode.getCode());
        result.setMessage(resultCode.getMessage());
        return result;
    }
}
```

- [ ] **Step 2: 创建结果状态码枚举**

```java
package com.ritual.common.result;

import lombok.Getter;

@Getter
public enum ResultCode {
    SUCCESS(200, "success"),
    ERROR(500, "系统错误"),
    PARAM_ERROR(40001, "参数校验失败"),
    UNAUTHORIZED(40101, "未登录或token已过期"),
    FORBIDDEN(40301, "无权限访问"),
    NOT_FOUND(40401, "资源不存在"),
    USER_EXISTS(40002, "用户已存在"),
    USER_NOT_FOUND(40003, "用户不存在"),
    PASSWORD_ERROR(40004, "密码错误"),
    INVALID_INVITE_CODE(40005, "邀请码无效或已过期"),
    RELATION_EXISTS(40006, "已存在绑定关系");

    private final Integer code;
    private final String message;

    ResultCode(Integer code, String message) {
        this.code = code;
        this.message = message;
    }
}
```

- [ ] **Step 3: 创建业务异常类**

```java
package com.ritual.common.exception;

import com.ritual.common.result.ResultCode;
import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException {
    private final Integer code;

    public BusinessException(String message) {
        super(message);
        this.code = ResultCode.ERROR.getCode();
    }

    public BusinessException(ResultCode resultCode) {
        super(resultCode.getMessage());
        this.code = resultCode.getCode();
    }

    public BusinessException(Integer code, String message) {
        super(message);
        this.code = code;
    }
}
```

- [ ] **Step 4: 创建全局异常处理器**

```java
package com.ritual.common.exception;

import com.ritual.common.result.Result;
import com.ritual.common.result.ResultCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.BindException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public Result<Void> handleBusinessException(BusinessException e) {
        log.warn("业务异常: {}", e.getMessage());
        return Result.error(e.getCode(), e.getMessage());
    }

    @ExceptionHandler(BindException.class)
    public Result<Void> handleBindException(BindException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .findFirst()
                .orElse("参数校验失败");
        return Result.error(ResultCode.PARAM_ERROR.getCode(), message);
    }

    @ExceptionHandler(Exception.class)
    public Result<Void> handleException(Exception e) {
        log.error("系统异常", e);
        return Result.error(ResultCode.ERROR);
    }
}
```

- [ ] **Step 5: 创建 JWT 工具类**

```java
package com.ritual.common.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Slf4j
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-token-expiration}")
    private Long accessTokenExpiration;

    @Value("${jwt.refresh-token-expiration}")
    private Long refreshTokenExpiration;

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(Long userId) {
        return generateToken(userId, accessTokenExpiration);
    }

    public String generateRefreshToken(Long userId) {
        return generateToken(userId, refreshTokenExpiration);
    }

    private String generateToken(Long userId, Long expiration) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getKey())
                .compact();
    }

    public Long getUserIdFromToken(String token) {
        Claims claims = parseToken(token);
        return Long.valueOf(claims.getSubject());
    }

    public boolean validateToken(String token) {
        try {
            parseToken(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.warn("Token已过期");
        } catch (JwtException | IllegalArgumentException e) {
            log.warn("Token无效");
        }
        return false;
    }

    private Claims parseToken(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
```

- [ ] **Step 6: 创建密码工具类**

```java
package com.ritual.common.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class PasswordUtil {
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public String encode(String rawPassword) {
        return encoder.encode(rawPassword);
    }

    public boolean matches(String rawPassword, String encodedPassword) {
        return encoder.matches(rawPassword, encodedPassword);
    }
}
```

- [ ] **Step 7: 创建 JWT 拦截器**

```java
package com.ritual.common.interceptor;

import com.ritual.common.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtInterceptor implements HandlerInterceptor {

    private final JwtUtil jwtUtil;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            if (jwtUtil.validateToken(token)) {
                Long userId = jwtUtil.getUserIdFromToken(token);
                request.setAttribute("userId", userId);
                return true;
            }
        }
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        return false;
    }
}
```

- [ ] **Step 8: 创建 Web 配置类**

```java
package com.ritual.common.config;

import com.ritual.common.interceptor.JwtInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final JwtInterceptor jwtInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(jwtInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns(
                        "/auth/**",
                        "/error",
                        "/swagger-ui/**",
                        "/v3/api-docs/**"
                );
    }
}
```

- [ ] **Step 9: Commit**

```bash
git add server/src/main/java/com/ritual/common/
git commit -m "feat: add common infrastructure (result, exception, jwt, password)"
```

---

### Task 1.4: 创建前端 React Native 项目骨架

**Files:**
- Create: `app/package.json`
- Create: `app/tsconfig.json`
- Create: `app/App.tsx`
- Create: `app/src/api/client.ts`
- Create: `app/src/store/useAuthStore.ts`
- Create: `app/src/types/index.ts`

- [ ] **Step 1: 初始化 React Native 项目**

Run:
```bash
cd app
npx react-native@latest init RitualApp --template react-native-template-typescript
cd RitualApp
```

- [ ] **Step 2: 安装依赖**

Run:
```bash
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
npm install @react-native-async-storage/async-storage
npm install zustand axios
npm install @nozbe/watermelondb react-native-sqlite-storage
npm install react-native-calendars
npm install @react-native-community/datetimepicker
npm install react-native-vector-icons
npm install react-native-image-picker
npm install @react-native-firebase/app @react-native-firebase/messaging
```

- [ ] **Step 3: 创建 tsconfig.json**

```json
{
  "extends": "@react-native/typescript-config/tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

- [ ] **Step 4: 创建 API 客户端**

```typescript
// src/api/client.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
    }
    return Promise.reject(error);
  }
);
```

- [ ] **Step 5: 创建 Zustand 认证状态管理**

```typescript
// src/store/useAuthStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: number;
  phone: string;
  nickName: string;
  avatar: string;
  gender: number;
  birthday: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User) => void;
  logout: () => void;
  init: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  setUser: (user) => set({ user, isLoggedIn: true }),
  logout: async () => {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
    set({ user: null, isLoggedIn: false });
  },
  init: async () => {
    const userStr = await AsyncStorage.getItem('user');
    const token = await AsyncStorage.getItem('accessToken');
    if (userStr && token) {
      set({ user: JSON.parse(userStr), isLoggedIn: true });
    }
  },
}));
```

- [ ] **Step 6: 创建类型定义**

```typescript
// src/types/index.ts

export interface User {
  id: number;
  phone: string;
  nickName: string;
  avatar: string;
  gender: number;
  birthday: string;
}

export interface AnniversaryEvent {
  id: number;
  userId: number;
  title: string;
  eventDate: string;
  calendarType: number;
  repeatType: number;
  category: number;
  relatedPerson: string;
  relatedPersonId: number;
  isShared: number;
  createdAt: string;
  updatedAt: string;
}

export interface RitualConfig {
  id: number;
  eventId: number;
  needGift: number;
  needBlessing: number;
  needMoment: number;
  needCake: number;
  needFlower: number;
  needDinner: number;
}

export interface ReminderSetting {
  id: number;
  eventId: number;
  advanceDays: number;
  reminderTime: string;
  pushEnabled: number;
}

export interface RecommendContent {
  id: number;
  category: number;
  title: string;
  content: string;
  tags: string;
}

export interface NotificationRecord {
  id: number;
  userId: number;
  eventId: number;
  title: string;
  content: string;
  type: number;
  isRead: number;
  createdAt: string;
}

export interface UserRelation {
  id: number;
  userId: number;
  partnerId: number;
  relationType: number;
  status: number;
  inviteCode: string;
}
```

- [ ] **Step 7: Commit**

```bash
git add app/
git commit -m "feat: init React Native project with dependencies and base structure"
```

---

## Phase 2: 用户认证模块

### Task 2.1: 后端用户认证实现

**Files:**
- Create: `server/src/main/java/com/ritual/modules/user/entity/UserInfo.java`
- Create: `server/src/main/java/com/ritual/modules/user/mapper/UserInfoMapper.java`
- Create: `server/src/main/java/com/ritual/modules/user/service/UserService.java`
- Create: `server/src/main/java/com/ritual/modules/user/service/impl/UserServiceImpl.java`
- Create: `server/src/main/java/com/ritual/modules/user/controller/AuthController.java`
- Create: `server/src/main/java/com/ritual/modules/user/controller/UserController.java`
- Create: `server/src/main/java/com/ritual/modules/user/dto/RegisterRequest.java`
- Create: `server/src/main/java/com/ritual/modules/user/dto/LoginRequest.java`
- Create: `server/src/main/java/com/ritual/modules/user/dto/UpdateProfileRequest.java`
- Create: `server/src/main/java/com/ritual/modules/user/vo/UserVO.java`
- Create: `server/src/main/java/com/ritual/modules/user/vo/TokenVO.java`

- [ ] **Step 1: 创建用户实体类**

```java
package com.ritual.modules.user.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("user_info")
public class UserInfo {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String phone;
    private String password;
    private String nickName;
    private String avatar;
    private Integer gender;
    private LocalDate birthday;
    private Integer status;
    @TableLogic
    private Integer deleted;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
```

- [ ] **Step 2: 创建 Mapper 接口**

```java
package com.ritual.modules.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ritual.modules.user.entity.UserInfo;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserInfoMapper extends BaseMapper<UserInfo> {
}
```

- [ ] **Step 3: 创建 DTO 和 VO**

```java
// RegisterRequest.java
package com.ritual.modules.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "手机号不能为空")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phone;

    @NotBlank(message = "密码不能为空")
    @Pattern(regexp = "^.{6,20}$", message = "密码长度6-20位")
    private String password;
}
```

```java
// LoginRequest.java
package com.ritual.modules.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "手机号不能为空")
    private String phone;
    @NotBlank(message = "密码不能为空")
    private String password;
}
```

```java
// UpdateProfileRequest.java
package com.ritual.modules.user.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateProfileRequest {
    private String nickName;
    private Integer gender;
    private LocalDate birthday;
}
```

```java
// UserVO.java
package com.ritual.modules.user.vo;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UserVO {
    private Long id;
    private String phone;
    private String nickName;
    private String avatar;
    private Integer gender;
    private LocalDate birthday;
}
```

```java
// TokenVO.java
package com.ritual.modules.user.vo;

import lombok.Data;

@Data
public class TokenVO {
    private String accessToken;
    private String refreshToken;
    private Long expiresIn;
}
```

- [ ] **Step 4: 创建 Service 接口和实现**

```java
// UserService.java
package com.ritual.modules.user.service;

import com.ritual.modules.user.dto.LoginRequest;
import com.ritual.modules.user.dto.RegisterRequest;
import com.ritual.modules.user.dto.UpdateProfileRequest;
import com.ritual.modules.user.vo.TokenVO;
import com.ritual.modules.user.vo.UserVO;

public interface UserService {
    TokenVO register(RegisterRequest request);
    TokenVO login(LoginRequest request);
    TokenVO refreshToken(String refreshToken);
    UserVO getProfile(Long userId);
    UserVO updateProfile(Long userId, UpdateProfileRequest request);
    String uploadAvatar(Long userId, String avatarUrl);
}
```

```java
// UserServiceImpl.java
package com.ritual.modules.user.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ritual.common.exception.BusinessException;
import com.ritual.common.result.ResultCode;
import com.ritual.common.util.JwtUtil;
import com.ritual.common.util.PasswordUtil;
import com.ritual.modules.user.dto.LoginRequest;
import com.ritual.modules.user.dto.RegisterRequest;
import com.ritual.modules.user.dto.UpdateProfileRequest;
import com.ritual.modules.user.entity.UserInfo;
import com.ritual.modules.user.mapper.UserInfoMapper;
import com.ritual.modules.user.service.UserService;
import com.ritual.modules.user.vo.TokenVO;
import com.ritual.modules.user.vo.UserVO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserInfoMapper userInfoMapper;
    private final PasswordUtil passwordUtil;
    private final JwtUtil jwtUtil;
    private final StringRedisTemplate redisTemplate;

    @Override
    public TokenVO register(RegisterRequest request) {
        LambdaQueryWrapper<UserInfo> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserInfo::getPhone, request.getPhone());
        if (userInfoMapper.selectCount(wrapper) > 0) {
            throw new BusinessException(ResultCode.USER_EXISTS);
        }

        UserInfo user = new UserInfo();
        user.setPhone(request.getPhone());
        user.setPassword(passwordUtil.encode(request.getPassword()));
        user.setNickName("用户" + request.getPhone().substring(7));
        userInfoMapper.insert(user);

        return generateTokens(user.getId());
    }

    @Override
    public TokenVO login(LoginRequest request) {
        LambdaQueryWrapper<UserInfo> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserInfo::getPhone, request.getPhone());
        UserInfo user = userInfoMapper.selectOne(wrapper);

        if (user == null) {
            throw new BusinessException(ResultCode.USER_NOT_FOUND);
        }
        if (!passwordUtil.matches(request.getPassword(), user.getPassword())) {
            throw new BusinessException(ResultCode.PASSWORD_ERROR);
        }

        return generateTokens(user.getId());
    }

    @Override
    public TokenVO refreshToken(String refreshToken) {
        if (!jwtUtil.validateToken(refreshToken)) {
            throw new BusinessException(ResultCode.UNAUTHORIZED);
        }
        Long userId = jwtUtil.getUserIdFromToken(refreshToken);
        String cachedToken = redisTemplate.opsForValue().get("refresh:" + userId);
        if (cachedToken == null || !cachedToken.equals(refreshToken)) {
            throw new BusinessException(ResultCode.UNAUTHORIZED);
        }
        return generateTokens(userId);
    }

    @Override
    public UserVO getProfile(Long userId) {
        UserInfo user = userInfoMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException(ResultCode.USER_NOT_FOUND);
        }
        UserVO vo = new UserVO();
        BeanUtils.copyProperties(user, vo);
        return vo;
    }

    @Override
    public UserVO updateProfile(Long userId, UpdateProfileRequest request) {
        UserInfo user = userInfoMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException(ResultCode.USER_NOT_FOUND);
        }
        if (request.getNickName() != null) {
            user.setNickName(request.getNickName());
        }
        if (request.getGender() != null) {
            user.setGender(request.getGender());
        }
        if (request.getBirthday() != null) {
            user.setBirthday(request.getBirthday());
        }
        userInfoMapper.updateById(user);
        return getProfile(userId);
    }

    @Override
    public String uploadAvatar(Long userId, String avatarUrl) {
        UserInfo user = new UserInfo();
        user.setId(userId);
        user.setAvatar(avatarUrl);
        userInfoMapper.updateById(user);
        return avatarUrl;
    }

    private TokenVO generateTokens(Long userId) {
        String accessToken = jwtUtil.generateAccessToken(userId);
        String refreshToken = jwtUtil.generateRefreshToken(userId);
        redisTemplate.opsForValue().set("refresh:" + userId, refreshToken, 7, TimeUnit.DAYS);

        TokenVO tokenVO = new TokenVO();
        tokenVO.setAccessToken(accessToken);
        tokenVO.setRefreshToken(refreshToken);
        tokenVO.setExpiresIn(86400L);
        return tokenVO;
    }
}
```

- [ ] **Step 5: 创建 Controller**

```java
// AuthController.java
package com.ritual.modules.user.controller;

import com.ritual.common.result.Result;
import com.ritual.modules.user.dto.LoginRequest;
import com.ritual.modules.user.dto.RegisterRequest;
import com.ritual.modules.user.service.UserService;
import com.ritual.modules.user.vo.TokenVO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public Result<TokenVO> register(@Valid @RequestBody RegisterRequest request) {
        return Result.success(userService.register(request));
    }

    @PostMapping("/login")
    public Result<TokenVO> login(@Valid @RequestBody LoginRequest request) {
        return Result.success(userService.login(request));
    }

    @PostMapping("/refresh")
    public Result<TokenVO> refreshToken(@RequestHeader("X-Refresh-Token") String refreshToken) {
        return Result.success(userService.refreshToken(refreshToken));
    }

    @DeleteMapping("/logout")
    public Result<Void> logout() {
        return Result.success();
    }
}
```

```java
// UserController.java
package com.ritual.modules.user.controller;

import com.ritual.common.result.Result;
import com.ritual.modules.user.dto.UpdateProfileRequest;
import com.ritual.modules.user.service.UserService;
import com.ritual.modules.user.vo.UserVO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public Result<UserVO> getProfile(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.success(userService.getProfile(userId));
    }

    @PutMapping("/profile")
    public Result<UserVO> updateProfile(
            HttpServletRequest request,
            @RequestBody UpdateProfileRequest updateRequest) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.success(userService.updateProfile(userId, updateRequest));
    }

    @PostMapping("/avatar")
    public Result<String> uploadAvatar(
            HttpServletRequest request,
            @RequestParam("avatarUrl") String avatarUrl) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.success(userService.uploadAvatar(userId, avatarUrl));
    }
}
```

- [ ] **Step 6: 配置 MyBatis-Plus 自动填充**

```java
// server/src/main/java/com/ritual/common/config/MyMetaObjectHandler.java
package com.ritual.common.config;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class MyMetaObjectHandler implements MetaObjectHandler {
    @Override
    public void insertFill(MetaObject metaObject) {
        this.strictInsertFill(metaObject, "createdAt", LocalDateTime.class, LocalDateTime.now());
        this.strictInsertFill(metaObject, "updatedAt", LocalDateTime.class, LocalDateTime.now());
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        this.strictUpdateFill(metaObject, "updatedAt", LocalDateTime.class, LocalDateTime.now());
    }
}
```

- [ ] **Step 7: 测试注册登录接口**

Run: `mvn test` 或 Postman 测试
Expected: 注册/登录接口返回正确 Token

- [ ] **Step 8: Commit**

```bash
git add server/src/main/java/com/ritual/modules/user/
git commit -m "feat: implement user authentication module"
```

---

### Task 2.2: 前端认证页面

**Files:**
- Create: `app/src/screens/Auth/LoginScreen.tsx`
- Create: `app/src/screens/Auth/RegisterScreen.tsx`
- Create: `app/src/api/auth.ts`
- Create: `app/src/navigation/AppNavigator.tsx`

- [ ] **Step 1: 创建认证 API**

```typescript
// src/api/auth.ts
import { apiClient } from './client';

export interface RegisterParams {
  phone: string;
  password: string;
}

export interface LoginParams {
  phone: string;
  password: string;
}

export interface TokenResponse {
  code: number;
  data: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

export const authApi = {
  register: (params: RegisterParams) =>
    apiClient.post<TokenResponse>('/auth/register', params),
  login: (params: LoginParams) =>
    apiClient.post<TokenResponse>('/auth/login', params),
};
```

- [ ] **Step 2: 创建登录页面**

```tsx
// src/screens/Auth/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../../api/auth';
import { useAuthStore } from '../../store/useAuthStore';

export default function LoginScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert('提示', '请填写手机号和密码');
      return;
    }
    setLoading(true);
    try {
      const res: any = await authApi.login({ phone, password });
      if (res.code === 200) {
        await AsyncStorage.setItem('accessToken', res.data.accessToken);
        await AsyncStorage.setItem('refreshToken', res.data.refreshToken);
        setUser({ id: 0, phone, nickName: '', avatar: '', gender: 0, birthday: '' });
      }
    } catch (error: any) {
      Alert.alert('登录失败', error.response?.data?.message || '网络错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>仪式感</Text>
      <Text style={styles.subtitle}>记住每一个重要日子</Text>
      <TextInput
        style={styles.input}
        placeholder="手机号"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="密码"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? '登录中...' : '登录'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>还没有账号？去注册</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', color: '#E91E63' },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#666', marginBottom: 32 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  button: { backgroundColor: '#E91E63', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  link: { textAlign: 'center', color: '#E91E63', marginTop: 16 },
});
```

- [ ] **Step 3: 创建注册页面**

```tsx
// src/screens/Auth/RegisterScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../../api/auth';
import { useAuthStore } from '../../store/useAuthStore';

export default function RegisterScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  const handleRegister = async () => {
    if (!phone || !password) {
      Alert.alert('提示', '请填写完整信息');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('提示', '两次密码不一致');
      return;
    }
    setLoading(true);
    try {
      const res: any = await authApi.register({ phone, password });
      if (res.code === 200) {
        await AsyncStorage.setItem('accessToken', res.data.accessToken);
        await AsyncStorage.setItem('refreshToken', res.data.refreshToken);
        setUser({ id: 0, phone, nickName: '', avatar: '', gender: 0, birthday: '' });
      }
    } catch (error: any) {
      Alert.alert('注册失败', error.response?.data?.message || '网络错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>注册账号</Text>
      <TextInput style={styles.input} placeholder="手机号" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
      <TextInput style={styles.input} placeholder="密码" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="确认密码" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
      <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? '注册中...' : '注册'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>已有账号？去登录</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 32, color: '#E91E63' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  button: { backgroundColor: '#E91E63', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  link: { textAlign: 'center', color: '#E91E63', marginTop: 16 },
});
```

- [ ] **Step 4: 创建导航器**

```tsx
// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import EventsScreen from '../screens/Events/EventsScreen';
import DiscoverScreen from '../screens/Discover/DiscoverScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { useAuthStore } from '../store/useAuthStore';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: '首页' }} />
      <Tab.Screen name="Events" component={EventsScreen} options={{ title: '纪念日' }} />
      <Tab.Screen name="Discover" component={DiscoverScreen} options={{ title: '发现' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: '我的' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add app/src/screens/Auth/ app/src/navigation/ app/src/api/auth.ts
git commit -m "feat: add frontend auth screens and navigation"
```

---

## Phase 3: 纪念日管理模块

### Task 3.1: 后端纪念日 CRUD

**Files:**
- Create: `server/src/main/java/com/ritual/modules/event/entity/AnniversaryEvent.java`
- Create: `server/src/main/java/com/ritual/modules/event/mapper/AnniversaryEventMapper.java`
- Create: `server/src/main/java/com/ritual/modules/event/service/AnniversaryEventService.java`
- Create: `server/src/main/java/com/ritual/modules/event/service/impl/AnniversaryEventServiceImpl.java`
- Create: `server/src/main/java/com/ritual/modules/event/controller/AnniversaryEventController.java`
- Create: `server/src/main/java/com/ritual/modules/event/dto/CreateEventRequest.java`
- Create: `server/src/main/java/com/ritual/modules/event/dto/UpdateEventRequest.java`
- Create: `server/src/main/java/com/ritual/modules/event/vo/EventVO.java`
- Create: `server/src/main/java/com/ritual/modules/event/vo/CalendarVO.java`

- [ ] **Step 1: 创建纪念日实体**

```java
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
```

- [ ] **Step 2: 创建 Mapper**

```java
package com.ritual.modules.event.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ritual.modules.event.entity.AnniversaryEvent;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface AnniversaryEventMapper extends BaseMapper<AnniversaryEvent> {

    @Select("SELECT * FROM anniversary_event WHERE user_id = #{userId} " +
            "AND deleted = 0 AND event_date BETWEEN #{start} AND #{end} " +
            "ORDER BY event_date")
    List<AnniversaryEvent> selectByDateRange(@Param("userId") Long userId,
                                              @Param("start") LocalDate start,
                                              @Param("end") LocalDate end);
}
```

- [ ] **Step 3: 创建 DTO 和 VO**

```java
// CreateEventRequest.java
package com.ritual.modules.event.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateEventRequest {
    @NotBlank(message = "标题不能为空")
    private String title;
    @NotNull(message = "日期不能为空")
    private LocalDate eventDate;
    private Integer calendarType = 1;
    private Integer repeatType = 1;
    private Integer category = 4;
    private String relatedPerson;
    private Long relatedPersonId;
    private Integer isShared = 0;
}
```

```java
// UpdateEventRequest.java
package com.ritual.modules.event.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateEventRequest {
    private String title;
    private LocalDate eventDate;
    private Integer calendarType;
    private Integer repeatType;
    private Integer category;
    private String relatedPerson;
    private Long relatedPersonId;
    private Integer isShared;
}
```

```java
// EventVO.java
package com.ritual.modules.event.vo;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class EventVO {
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
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

```java
// CalendarVO.java
package com.ritual.modules.event.vo;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class CalendarVO {
    private LocalDate date;
    private List<EventVO> events;
}
```

- [ ] **Step 4: 创建 Service**

```java
// AnniversaryEventService.java
package com.ritual.modules.event.service;

import com.ritual.modules.event.dto.CreateEventRequest;
import com.ritual.modules.event.dto.UpdateEventRequest;
import com.ritual.modules.event.vo.CalendarVO;
import com.ritual.modules.event.vo.EventVO;

import java.util.List;

public interface AnniversaryEventService {
    EventVO createEvent(Long userId, CreateEventRequest request);
    EventVO updateEvent(Long userId, Long eventId, UpdateEventRequest request);
    void deleteEvent(Long userId, Long eventId);
    EventVO getEvent(Long userId, Long eventId);
    List<EventVO> listEvents(Long userId, Integer category);
    List<CalendarVO> getCalendar(Long userId, Integer year, Integer month);
}
```

```java
// AnniversaryEventServiceImpl.java
package com.ritual.modules.event.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ritual.common.exception.BusinessException;
import com.ritual.common.result.ResultCode;
import com.ritual.modules.event.dto.CreateEventRequest;
import com.ritual.modules.event.dto.UpdateEventRequest;
import com.ritual.modules.event.entity.AnniversaryEvent;
import com.ritual.modules.event.mapper.AnniversaryEventMapper;
import com.ritual.modules.event.service.AnniversaryEventService;
import com.ritual.modules.event.vo.CalendarVO;
import com.ritual.modules.event.vo.EventVO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnniversaryEventServiceImpl implements AnniversaryEventService {

    private final AnniversaryEventMapper eventMapper;

    @Override
    public EventVO createEvent(Long userId, CreateEventRequest request) {
        AnniversaryEvent event = new AnniversaryEvent();
        BeanUtils.copyProperties(request, event);
        event.setUserId(userId);
        eventMapper.insert(event);
        return convertToVO(event);
    }

    @Override
    public EventVO updateEvent(Long userId, Long eventId, UpdateEventRequest request) {
        AnniversaryEvent event = eventMapper.selectById(eventId);
        if (event == null || !event.getUserId().equals(userId)) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        BeanUtils.copyProperties(request, event);
        eventMapper.updateById(event);
        return convertToVO(event);
    }

    @Override
    public void deleteEvent(Long userId, Long eventId) {
        AnniversaryEvent event = eventMapper.selectById(eventId);
        if (event == null || !event.getUserId().equals(userId)) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        eventMapper.deleteById(eventId);
    }

    @Override
    public EventVO getEvent(Long userId, Long eventId) {
        AnniversaryEvent event = eventMapper.selectById(eventId);
        if (event == null || (!event.getUserId().equals(userId) && event.getIsShared() != 1)) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        return convertToVO(event);
    }

    @Override
    public List<EventVO> listEvents(Long userId, Integer category) {
        LambdaQueryWrapper<AnniversaryEvent> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(AnniversaryEvent::getUserId, userId)
               .eq(category != null, AnniversaryEvent::getCategory, category)
               .orderByAsc(AnniversaryEvent::getEventDate);
        return eventMapper.selectList(wrapper).stream()
                .map(this::convertToVO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CalendarVO> getCalendar(Long userId, Integer year, Integer month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate start = yearMonth.atDay(1);
        LocalDate end = yearMonth.atEndOfMonth();

        List<AnniversaryEvent> events = eventMapper.selectByDateRange(userId, start, end);

        List<CalendarVO> calendar = new ArrayList<>();
        for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
            LocalDate currentDate = date;
            List<EventVO> dayEvents = events.stream()
                    .filter(e -> e.getEventDate().equals(currentDate))
                    .map(this::convertToVO)
                    .collect(Collectors.toList());
            if (!dayEvents.isEmpty()) {
                CalendarVO vo = new CalendarVO();
                vo.setDate(currentDate);
                vo.setEvents(dayEvents);
                calendar.add(vo);
            }
        }
        return calendar;
    }

    private EventVO convertToVO(AnniversaryEvent event) {
        EventVO vo = new EventVO();
        BeanUtils.copyProperties(event, vo);
        return vo;
    }
}
```

- [ ] **Step 5: 创建 Controller**

```java
// AnniversaryEventController.java
package com.ritual.modules.event.controller;

import com.ritual.common.result.Result;
import com.ritual.modules.event.dto.CreateEventRequest;
import com.ritual.modules.event.dto.UpdateEventRequest;
import com.ritual.modules.event.service.AnniversaryEventService;
import com.ritual.modules.event.vo.CalendarVO;
import com.ritual.modules.event.vo.EventVO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class AnniversaryEventController {

    private final AnniversaryEventService eventService;

    @PostMapping
    public Result<EventVO> createEvent(
            HttpServletRequest request,
            @Valid @RequestBody CreateEventRequest createRequest) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.success(eventService.createEvent(userId, createRequest));
    }

    @GetMapping("/{id}")
    public Result<EventVO> getEvent(
            HttpServletRequest request,
            @PathVariable Long id) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.success(eventService.getEvent(userId, id));
    }

    @PutMapping("/{id}")
    public Result<EventVO> updateEvent(
            HttpServletRequest request,
            @PathVariable Long id,
            @RequestBody UpdateEventRequest updateRequest) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.success(eventService.updateEvent(userId, id, updateRequest));
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteEvent(
            HttpServletRequest request,
            @PathVariable Long id) {
        Long userId = (Long) request.getAttribute("userId");
        eventService.deleteEvent(userId, id);
        return Result.success();
    }

    @GetMapping
    public Result<List<EventVO>> listEvents(
            HttpServletRequest request,
            @RequestParam(required = false) Integer category) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.success(eventService.listEvents(userId, category));
    }

    @GetMapping("/calendar/{year}/{month}")
    public Result<List<CalendarVO>> getCalendar(
            HttpServletRequest request,
            @PathVariable Integer year,
            @PathVariable Integer month) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.success(eventService.getCalendar(userId, year, month));
    }
}
```

- [ ] **Step 6: Commit**

```bash
git add server/src/main/java/com/ritual/modules/event/
git commit -m "feat: implement anniversary event CRUD and calendar API"
```

---

### Task 3.2: 前端纪念日页面

**Files:**
- Create: `app/src/api/events.ts`
- Create: `app/src/screens/Events/EventsScreen.tsx`
- Create: `app/src/screens/Events/EventEditScreen.tsx`
- Create: `app/src/screens/Home/HomeScreen.tsx`

- [ ] **Step 1: 创建纪念日 API**

```typescript
// src/api/events.ts
import { apiClient } from './client';

export interface CreateEventParams {
  title: string;
  eventDate: string;
  calendarType?: number;
  repeatType?: number;
  category?: number;
  relatedPerson?: string;
  isShared?: number;
}

export interface UpdateEventParams {
  title?: string;
  eventDate?: string;
  calendarType?: number;
  repeatType?: number;
  category?: number;
  relatedPerson?: string;
  isShared?: number;
}

export const eventsApi = {
  create: (params: CreateEventParams) => apiClient.post('/events', params),
  list: (category?: number) => apiClient.get('/events', { params: { category } }),
  get: (id: number) => apiClient.get(`/events/${id}`),
  update: (id: number, params: UpdateEventParams) => apiClient.put(`/events/${id}`, params),
  delete: (id: number) => apiClient.delete(`/events/${id}`),
  getCalendar: (year: number, month: number) => apiClient.get(`/events/calendar/${year}/${month}`),
};
```

- [ ] **Step 2: 创建纪念日列表页面**

```tsx
// src/screens/Events/EventsScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { eventsApi } from '../../api/events';

export default function EventsScreen({ navigation }: any) {
  const [events, setEvents] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadEvents = async () => {
    try {
      const res: any = await eventsApi.list();
      if (res.code === 200) {
        setEvents(res.data);
      }
    } catch (error) {
      console.error('加载纪念日失败', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  const getCategoryName = (category: number) => {
    const map: Record<number, string> = { 1: '生日', 2: '纪念日', 3: '节日', 4: '自定义' };
    return map[category] || '其他';
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}
    >
      <View style={styles.eventHeader}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventCategory}>{getCategoryName(item.category)}</Text>
      </View>
      <Text style={styles.eventDate}>{item.eventDate}</Text>
      {item.relatedPerson && (
        <Text style={styles.eventPerson}>关联人: {item.relatedPerson}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('EventEdit', { mode: 'create' })}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  list: { padding: 16 },
  eventCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2 },
  eventHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  eventTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  eventCategory: { fontSize: 12, color: '#E91E63', backgroundColor: '#FCE4EC', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  eventDate: { fontSize: 14, color: '#666' },
  eventPerson: { fontSize: 12, color: '#999', marginTop: 4 },
  fab: { position: 'absolute', right: 24, bottom: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#E91E63', justifyContent: 'center', alignItems: 'center', elevation: 4 },
  fabText: { fontSize: 28, color: '#fff', fontWeight: '300' },
});
```

- [ ] **Step 3: 创建添加/编辑纪念日页面**

```tsx
// src/screens/Events/EventEditScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { eventsApi } from '../../api/events';

export default function EventEditScreen({ navigation, route }: any) {
  const { mode, event } = route.params || {};
  const isEdit = mode === 'edit';

  const [title, setTitle] = useState(isEdit ? event.title : '');
  const [eventDate, setEventDate] = useState(isEdit ? new Date(event.eventDate) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState(isEdit ? event.category : 4);
  const [relatedPerson, setRelatedPerson] = useState(isEdit ? event.relatedPerson : '');
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 1, label: '生日' },
    { value: 2, label: '纪念日' },
    { value: 3, label: '节日' },
    { value: 4, label: '自定义' },
  ];

  const handleSave = async () => {
    if (!title) {
      Alert.alert('提示', '请填写标题');
      return;
    }
    setLoading(true);
    try {
      const params = {
        title,
        eventDate: eventDate.toISOString().split('T')[0],
        category,
        relatedPerson: relatedPerson || undefined,
      };
      if (isEdit) {
        await eventsApi.update(event.id, params);
      } else {
        await eventsApi.create(params);
      }
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('保存失败', error.response?.data?.message || '网络错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>标题 *</Text>
      <TextInput style={styles.input} placeholder="如：领证日、老婆生日" value={title} onChangeText={setTitle} />

      <Text style={styles.label}>日期 *</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text>{eventDate.toISOString().split('T')[0]}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={eventDate}
          mode="date"
          onChange={(_, date) => { setShowDatePicker(false); if (date) setEventDate(date); }}
        />
      )}

      <Text style={styles.label}>分类</Text>
      <View style={styles.categoryContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.value}
            style={[styles.categoryBtn, category === cat.value && styles.categoryBtnActive]}
            onPress={() => setCategory(cat.value)}
          >
            <Text style={[styles.categoryText, category === cat.value && styles.categoryTextActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>关联人</Text>
      <TextInput style={styles.input} placeholder="如：老婆、妈妈" value={relatedPerson} onChangeText={setRelatedPerson} />

      <TouchableOpacity style={[styles.saveBtn, loading && styles.saveBtnDisabled]} onPress={handleSave} disabled={loading}>
        <Text style={styles.saveBtnText}>{loading ? '保存中...' : '保存'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  label: { fontSize: 14, color: '#333', marginBottom: 8, marginTop: 16, fontWeight: '500' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16 },
  categoryContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  categoryBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#ddd', marginRight: 8, marginBottom: 8 },
  categoryBtnActive: { backgroundColor: '#E91E63', borderColor: '#E91E63' },
  categoryText: { color: '#666' },
  categoryTextActive: { color: '#fff' },
  saveBtn: { backgroundColor: '#E91E63', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 32 },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
```

- [ ] **Step 4: Commit**

```bash
git add app/src/screens/Events/ app/src/api/events.ts
git commit -m "feat: add frontend event list and edit screens"
```

---

## Phase 4: 仪式感定制与提醒模块

### Task 4.1: 后端仪式感配置与提醒设置

**Files:**
- Create: `server/src/main/java/com/ritual/modules/event/entity/RitualConfig.java`
- Create: `server/src/main/java/com/ritual/modules/event/entity/ReminderSetting.java`
- Create: `server/src/main/java/com/ritual/modules/event/mapper/RitualConfigMapper.java`
- Create: `server/src/main/java/com/ritual/modules/event/mapper/ReminderSettingMapper.java`
- Create: `server/src/main/java/com/ritual/modules/event/service/RitualService.java`
- Create: `server/src/main/java/com/ritual/modules/event/controller/RitualController.java`

- [ ] **Step 1: 创建仪式感配置实体和 Mapper**

```java
// RitualConfig.java
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
```

```java
// RitualConfigMapper.java
package com.ritual.modules.event.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ritual.modules.event.entity.RitualConfig;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface RitualConfigMapper extends BaseMapper<RitualConfig> {
}
```

- [ ] **Step 2: 创建提醒设置实体和 Mapper**

```java
// ReminderSetting.java
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
```

```java
// ReminderSettingMapper.java
package com.ritual.modules.event.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ritual.modules.event.entity.ReminderSetting;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ReminderSettingMapper extends BaseMapper<ReminderSetting> {
}
```

- [ ] **Step 3: 创建 Service 和 Controller**

```java
// RitualService.java
package com.ritual.modules.event.service;

import com.ritual.modules.event.entity.RitualConfig;
import com.ritual.modules.event.entity.ReminderSetting;

public interface RitualService {
    RitualConfig getRitualConfig(Long eventId);
    RitualConfig updateRitualConfig(Long eventId, RitualConfig config);
    ReminderSetting getReminderSetting(Long eventId);
    ReminderSetting updateReminderSetting(Long eventId, ReminderSetting setting);
}
```

```java
// RitualServiceImpl.java
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
```

```java
// RitualController.java
package com.ritual.modules.event.controller;

import com.ritual.common.result.Result;
import com.ritual.modules.event.entity.ReminderSetting;
import com.ritual.modules.event.entity.RitualConfig;
import com.ritual.modules.event.service.RitualService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/events/{eventId}")
@RequiredArgsConstructor
public class RitualController {

    private final RitualService ritualService;

    @GetMapping("/ritual")
    public Result<RitualConfig> getRitualConfig(@PathVariable Long eventId) {
        return Result.success(ritualService.getRitualConfig(eventId));
    }

    @PutMapping("/ritual")
    public Result<RitualConfig> updateRitualConfig(
            @PathVariable Long eventId,
            @RequestBody RitualConfig config) {
        return Result.success(ritualService.updateRitualConfig(eventId, config));
    }

    @GetMapping("/reminder")
    public Result<ReminderSetting> getReminderSetting(@PathVariable Long eventId) {
        return Result.success(ritualService.getReminderSetting(eventId));
    }

    @PutMapping("/reminder")
    public Result<ReminderSetting> updateReminderSetting(
            @PathVariable Long eventId,
            @RequestBody ReminderSetting setting) {
        return Result.success(ritualService.updateReminderSetting(eventId, setting));
    }
}
```

- [ ] **Step 4: Commit**

```bash
git add server/src/main/java/com/ritual/modules/event/
git commit -m "feat: implement ritual config and reminder setting APIs"
```

---

## Phase 5: 内容推荐模块

### Task 5.1: 后端推荐内容 API

**Files:**
- Create: `server/src/main/java/com/ritual/modules/recommend/entity/RecommendContent.java`
- Create: `server/src/main/java/com/ritual/modules/recommend/mapper/RecommendContentMapper.java`
- Create: `server/src/main/java/com/ritual/modules/recommend/service/RecommendService.java`
- Create: `server/src/main/java/com/ritual/modules/recommend/controller/RecommendController.java`

- [ ] **Step 1: 创建实体和 Mapper**

```java
// RecommendContent.java
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
```

```java
// RecommendContentMapper.java
package com.ritual.modules.recommend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ritual.modules.recommend.entity.RecommendContent;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface RecommendContentMapper extends BaseMapper<RecommendContent> {
}
```

- [ ] **Step 2: 创建 Service 和 Controller**

```java
// RecommendService.java
package com.ritual.modules.recommend.service;

import com.ritual.modules.recommend.entity.RecommendContent;

import java.util.List;

public interface RecommendService {
    List<RecommendContent> getRecommendations(Integer category);
}
```

```java
// RecommendServiceImpl.java
package com.ritual.modules.recommend.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ritual.modules.recommend.entity.RecommendContent;
import com.ritual.modules.recommend.mapper.RecommendContentMapper;
import com.ritual.modules.recommend.service.RecommendService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendServiceImpl implements RecommendService {

    private final RecommendContentMapper recommendContentMapper;

    @Override
    public List<RecommendContent> getRecommendations(Integer category) {
        LambdaQueryWrapper<RecommendContent> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(RecommendContent::getCategory, category)
               .eq(RecommendContent::getIsActive, 1)
               .orderByAsc(RecommendContent::getSortOrder);
        return recommendContentMapper.selectList(wrapper);
    }
}
```

```java
// RecommendController.java
package com.ritual.modules.recommend.controller;

import com.ritual.common.result.Result;
import com.ritual.modules.recommend.entity.RecommendContent;
import com.ritual.modules.recommend.service.RecommendService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/recommend")
@RequiredArgsConstructor
public class RecommendController {

    private final RecommendService recommendService;

    @GetMapping("/gifts")
    public Result<List<RecommendContent>> getGifts() {
        return Result.success(recommendService.getRecommendations(1));
    }

    @GetMapping("/blessings")
    public Result<List<RecommendContent>> getBlessings() {
        return Result.success(recommendService.getRecommendations(2));
    }

    @GetMapping("/moments")
    public Result<List<RecommendContent>> getMoments() {
        return Result.success(recommendService.getRecommendations(3));
    }

    @GetMapping("/cakes")
    public Result<List<RecommendContent>> getCakes() {
        return Result.success(recommendService.getRecommendations(4));
    }

    @GetMapping("/flowers")
    public Result<List<RecommendContent>> getFlowers() {
        return Result.success(recommendService.getRecommendations(5));
    }

    @GetMapping("/dinners")
    public Result<List<RecommendContent>> getDinners() {
        return Result.success(recommendService.getRecommendations(6));
    }
}
```

- [ ] **Step 3: Commit**

```bash
git add server/src/main/java/com/ritual/modules/recommend/
git commit -m "feat: implement recommendation content APIs"
```

---

## Phase 6: 智能提醒模块

### Task 6.1: XXL-Job 定时任务 + 推送服务

**Files:**
- Create: `server/src/main/java/com/ritual/job/ReminderJob.java`
- Create: `server/src/main/java/com/ritual/modules/notification/service/PushService.java`
- Create: `server/src/main/java/com/ritual/modules/notification/entity/NotificationRecord.java`
- Create: `server/src/main/java/com/ritual/modules/notification/mapper/NotificationRecordMapper.java`
- Create: `server/src/main/java/com/ritual/modules/notification/controller/NotificationController.java`

- [ ] **Step 1: 添加 XXL-Job 依赖**

```xml
<!-- 添加到 pom.xml -->
<dependency>
    <groupId>com.xuxueli</groupId>
    <artifactId>xxl-job-core</artifactId>
    <version>2.4.0</version>
</dependency>
```

- [ ] **Step 2: 配置 XXL-Job**

```yaml
# application-dev.yml 中添加
xxl:
  job:
    admin:
      addresses: http://localhost:8080/xxl-job-admin
    executor:
      appname: ritual-executor
      ip:
      port: 9999
      logpath: /data/applogs/xxl-job/jobhandler
      logretentiondays: 30
    accessToken: default_token
```

- [ ] **Step 3: 创建定时任务**

```java
// ReminderJob.java
package com.ritual.job;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ritual.modules.event.entity.AnniversaryEvent;
import com.ritual.modules.event.entity.ReminderSetting;
import com.ritual.modules.event.mapper.AnniversaryEventMapper;
import com.ritual.modules.event.mapper.ReminderSettingMapper;
import com.ritual.modules.notification.entity.NotificationRecord;
import com.ritual.modules.notification.mapper.NotificationRecordMapper;
import com.ritual.modules.notification.service.PushService;
import com.xxl.job.core.handler.annotation.XxlJob;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
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

    @XxlJob("dailyReminderJob")
    public void execute() {
        log.info("开始执行每日提醒任务");
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        LambdaQueryWrapper<ReminderSetting> settingWrapper = new LambdaQueryWrapper<>();
        settingWrapper.eq(ReminderSetting::getPushEnabled, 1);
        List<ReminderSetting> settings = reminderSettingMapper.selectList(settingWrapper);

        for (ReminderSetting setting : settings) {
            LocalDate reminderDate = today.plusDays(setting.getAdvanceDays());
            LocalTime reminderTime = setting.getReminderTime();

            if (now.getHour() == reminderTime.getHour() && now.getMinute() == reminderTime.getMinute()) {
                LambdaQueryWrapper<AnniversaryEvent> eventWrapper = new LambdaQueryWrapper<>();
                eventWrapper.eq(AnniversaryEvent::getId, setting.getEventId())
                           .eq(AnniversaryEvent::getEventDate, reminderDate);
                AnniversaryEvent event = eventMapper.selectOne(eventWrapper);

                if (event != null) {
                    sendReminder(event, setting);
                }
            }
        }
        log.info("每日提醒任务执行完成");
    }

    private void sendReminder(AnniversaryEvent event, ReminderSetting setting) {
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
```

- [ ] **Step 4: 创建推送服务**

```java
// PushService.java
package com.ritual.modules.notification.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class PushService {

    public void sendPush(Long userId, String title, String content) {
        log.info("发送推送给用户 {}: {} - {}", userId, title, content);
        // TODO: 接入 FCM/APNs 实际推送
    }
}
```

- [ ] **Step 5: 创建通知记录实体和 Controller**

```java
// NotificationRecord.java
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
```

```java
// NotificationRecordMapper.java
package com.ritual.modules.notification.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ritual.modules.notification.entity.NotificationRecord;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface NotificationRecordMapper extends BaseMapper<NotificationRecord> {
}
```

```java
// NotificationController.java
package com.ritual.modules.notification.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ritual.common.result.Result;
import com.ritual.modules.notification.entity.NotificationRecord;
import com.ritual.modules.notification.mapper.NotificationRecordMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRecordMapper notificationRecordMapper;

    @GetMapping
    public Result<List<NotificationRecord>> listNotifications(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        LambdaQueryWrapper<NotificationRecord> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(NotificationRecord::getUserId, userId)
               .orderByDesc(NotificationRecord::getCreatedAt);
        return Result.success(notificationRecordMapper.selectList(wrapper));
    }

    @PutMapping("/{id}/read")
    public Result<Void> markAsRead(@PathVariable Long id) {
        NotificationRecord notification = new NotificationRecord();
        notification.setId(id);
        notification.setIsRead(1);
        notificationRecordMapper.updateById(notification);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteNotification(@PathVariable Long id) {
        notificationRecordMapper.deleteById(id);
        return Result.success();
    }
}
```

- [ ] **Step 6: Commit**

```bash
git add server/src/main/java/com/ritual/job/ server/src/main/java/com/ritual/modules/notification/
git commit -m "feat: implement reminder job and push notification service"
```

---

## Phase 7: 情侣关联模块

### Task 7.1: 后端关系绑定 API

**Files:**
- Create: `server/src/main/java/com/ritual/modules/relation/entity/UserRelation.java`
- Create: `server/src/main/java/com/ritual/modules/relation/mapper/UserRelationMapper.java`
- Create: `server/src/main/java/com/ritual/modules/relation/service/RelationService.java`
- Create: `server/src/main/java/com/ritual/modules/relation/controller/RelationController.java`
- Create: `server/src/main/java/com/ritual/modules/relation/vo/PartnerVO.java`

- [ ] **Step 1: 创建实体和 Mapper**

```java
// UserRelation.java
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
```

```java
// UserRelationMapper.java
package com.ritual.modules.relation.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ritual.modules.relation.entity.UserRelation;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserRelationMapper extends BaseMapper<UserRelation> {
}
```

- [ ] **Step 2: 创建 Service**

```java
// RelationService.java
package com.ritual.modules.relation.service;

import com.ritual.modules.relation.vo.PartnerVO;

public interface RelationService {
    String generateInviteCode(Long userId);
    void acceptInvite(Long userId, String inviteCode);
    void unbind(Long userId, Long relationId);
    PartnerVO getPartner(Long userId);
}
```

```java
// RelationServiceImpl.java
package com.ritual.modules.relation.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ritual.common.exception.BusinessException;
import com.ritual.common.result.ResultCode;
import com.ritual.modules.relation.entity.UserRelation;
import com.ritual.modules.relation.mapper.UserRelationMapper;
import com.ritual.modules.relation.service.RelationService;
import com.ritual.modules.relation.vo.PartnerVO;
import com.ritual.modules.user.entity.UserInfo;
import com.ritual.modules.user.mapper.UserInfoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RelationServiceImpl implements RelationService {

    private final UserRelationMapper relationMapper;
    private final UserInfoMapper userInfoMapper;

    @Override
    public String generateInviteCode(Long userId) {
        LambdaQueryWrapper<UserRelation> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserRelation::getUserId, userId)
               .eq(UserRelation::getStatus, 1);
        if (relationMapper.selectCount(wrapper) > 0) {
            throw new BusinessException(ResultCode.RELATION_EXISTS);
        }

        String inviteCode = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        UserRelation relation = new UserRelation();
        relation.setUserId(userId);
        relation.setInviteCode(inviteCode);
        relation.setStatus(0);
        relationMapper.insert(relation);
        return inviteCode;
    }

    @Override
    public void acceptInvite(Long userId, String inviteCode) {
        LambdaQueryWrapper<UserRelation> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserRelation::getInviteCode, inviteCode)
               .eq(UserRelation::getStatus, 0);
        UserRelation relation = relationMapper.selectOne(wrapper);

        if (relation == null) {
            throw new BusinessException(ResultCode.INVALID_INVITE_CODE);
        }
        if (relation.getUserId().equals(userId)) {
            throw new BusinessException(ResultCode.INVALID_INVITE_CODE);
        }

        relation.setPartnerId(userId);
        relation.setStatus(1);
        relationMapper.updateById(relation);

        // 创建反向关系
        UserRelation reverse = new UserRelation();
        reverse.setUserId(userId);
        reverse.setPartnerId(relation.getUserId());
        reverse.setStatus(1);
        relationMapper.insert(reverse);
    }

    @Override
    public void unbind(Long userId, Long relationId) {
        UserRelation relation = relationMapper.selectById(relationId);
        if (relation == null || !relation.getUserId().equals(userId)) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        relationMapper.deleteById(relationId);

        LambdaQueryWrapper<UserRelation> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserRelation::getUserId, relation.getPartnerId())
               .eq(UserRelation::getPartnerId, userId);
        UserRelation reverse = relationMapper.selectOne(wrapper);
        if (reverse != null) {
            relationMapper.deleteById(reverse.getId());
        }
    }

    @Override
    public PartnerVO getPartner(Long userId) {
        LambdaQueryWrapper<UserRelation> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserRelation::getUserId, userId)
               .eq(UserRelation::getStatus, 1);
        UserRelation relation = relationMapper.selectOne(wrapper);

        if (relation == null) {
            return null;
        }

        UserInfo partner = userInfoMapper.selectById(relation.getPartnerId());
        if (partner == null) {
            return null;
        }

        PartnerVO vo = new PartnerVO();
        BeanUtils.copyProperties(partner, vo);
        vo.setRelationId(relation.getId());
        return vo;
    }
}
```

- [ ] **Step 3: 创建 Controller 和 VO**

```java
// PartnerVO.java
package com.ritual.modules.relation.vo;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PartnerVO {
    private Long id;
    private Long relationId;
    private String phone;
    private String nickName;
    private String avatar;
    private Integer gender;
    private LocalDate birthday;
}
```

```java
// RelationController.java
package com.ritual.modules.relation.controller;

import com.ritual.common.result.Result;
import com.ritual.modules.relation.service.RelationService;
import com.ritual.modules.relation.vo.PartnerVO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/relations")
@RequiredArgsConstructor
public class RelationController {

    private final RelationService relationService;

    @PostMapping("/invite")
    public Result<Map<String, String>> generateInvite(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        String code = relationService.generateInviteCode(userId);
        return Result.success(Map.of("inviteCode", code));
    }

    @PostMapping("/accept")
    public Result<Void> acceptInvite(
            HttpServletRequest request,
            @RequestBody Map<String, String> body) {
        Long userId = (Long) request.getAttribute("userId");
        relationService.acceptInvite(userId, body.get("inviteCode"));
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> unbind(
            HttpServletRequest request,
            @PathVariable Long id) {
        Long userId = (Long) request.getAttribute("userId");
        relationService.unbind(userId, id);
        return Result.success();
    }

    @GetMapping("/partner")
    public Result<PartnerVO> getPartner(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.success(relationService.getPartner(userId));
    }
}
```

- [ ] **Step 4: Commit**

```bash
git add server/src/main/java/com/ritual/modules/relation/
git commit -m "feat: implement couple relation binding APIs"
```

---

## Phase 8: 前端页面完善

### Task 8.1: 完善发现页和个人中心

**Files:**
- Create: `app/src/screens/Discover/DiscoverScreen.tsx`
- Create: `app/src/screens/Profile/ProfileScreen.tsx`
- Create: `app/src/screens/Profile/RelationScreen.tsx`
- Create: `app/src/api/recommend.ts`
- Create: `app/src/api/relation.ts`

- [ ] **Step 1: 创建推荐 API**

```typescript
// src/api/recommend.ts
import { apiClient } from './client';

export interface RecommendItem {
  id: number;
  category: number;
  title: string;
  content: string;
  tags: string;
}

export const recommendApi = {
  getGifts: () => apiClient.get('/recommend/gifts'),
  getBlessings: () => apiClient.get('/recommend/blessings'),
  getMoments: () => apiClient.get('/recommend/moments'),
  getCakes: () => apiClient.get('/recommend/cakes'),
  getFlowers: () => apiClient.get('/recommend/flowers'),
  getDinners: () => apiClient.get('/recommend/dinners'),
};
```

- [ ] **Step 2: 创建发现页面**

```tsx
// src/screens/Discover/DiscoverScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Clipboard,
  Alert,
} from 'react-native';
import { recommendApi } from '../../api/recommend';

const categories = [
  { key: 'gifts', label: '礼物', api: recommendApi.getGifts },
  { key: 'blessings', label: '祝福语', api: recommendApi.getBlessings },
  { key: 'moments', label: '朋友圈', api: recommendApi.getMoments },
  { key: 'cakes', label: '蛋糕', api: recommendApi.getCakes },
  { key: 'flowers', label: '鲜花', api: recommendApi.getFlowers },
  { key: 'dinners', label: '美食', api: recommendApi.getDinners },
];

export default function DiscoverScreen() {
  const [activeCategory, setActiveCategory] = useState('gifts');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadItems = async (categoryKey: string) => {
    setLoading(true);
    const category = categories.find((c) => c.key === categoryKey);
    if (category) {
      try {
        const res: any = await category.api();
        if (res.code === 200) {
          setItems(res.data);
        }
      } catch (error) {
        console.error('加载推荐失败', error);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadItems(activeCategory);
  }, [activeCategory]);

  const handleCopy = (content: string) => {
    Clipboard.setString(content);
    Alert.alert('已复制', '内容已复制到剪贴板');
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleCopy(item.content || item.title)}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      {item.content && <Text style={styles.cardContent}>{item.content}</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[styles.tab, activeCategory === cat.key && styles.tabActive]}
            onPress={() => setActiveCategory(cat.key)}
          >
            <Text style={[styles.tabText, activeCategory === cat.key && styles.tabTextActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  tabBar: { flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 8, paddingHorizontal: 4 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#E91E63' },
  tabText: { fontSize: 14, color: '#666' },
  tabTextActive: { color: '#E91E63', fontWeight: '600' },
  list: { padding: 16 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
  cardContent: { fontSize: 14, color: '#666', lineHeight: 20 },
});
```

- [ ] **Step 3: 创建个人中心页面**

```tsx
// src/screens/Profile/ProfileScreen.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuthStore();

  const menuItems = [
    { title: '绑定伴侣', icon: '💑', onPress: () => navigation.navigate('Relation') },
    { title: '提醒设置', icon: '🔔', onPress: () => {} },
    { title: '数据同步', icon: '📦', onPress: () => {} },
    { title: '通用设置', icon: '⚙️', onPress: () => {} },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={user?.avatar ? { uri: user.avatar } : require('../../assets/default-avatar.png')}
          style={styles.avatar}
        />
        <Text style={styles.nickName}>{user?.nickName || '未设置昵称'}</Text>
        <Text style={styles.phone}>{user?.phone}</Text>
      </View>
      <View style={styles.menu}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuTitle}>{item.title}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>退出登录</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#E91E63', padding: 32, alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: '#fff' },
  nickName: { fontSize: 20, fontWeight: '600', color: '#fff', marginTop: 12 },
  phone: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  menu: { backgroundColor: '#fff', marginTop: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  menuIcon: { fontSize: 20, marginRight: 12 },
  menuTitle: { flex: 1, fontSize: 16, color: '#333' },
  menuArrow: { fontSize: 20, color: '#ccc' },
  logoutBtn: { marginTop: 24, marginHorizontal: 16, backgroundColor: '#fff', padding: 16, borderRadius: 8, alignItems: 'center' },
  logoutText: { color: '#E91E63', fontSize: 16, fontWeight: '600' },
});
```

- [ ] **Step 4: Commit**

```bash
git add app/src/screens/Discover/ app/src/screens/Profile/ app/src/api/recommend.ts app/src/api/relation.ts
git commit -m "feat: add discover and profile screens"
```

---

## Phase 9: 联调测试

### Task 9.1: 端到端测试

- [ ] **Step 1: 启动后端服务**

Run: `cd server && mvn spring-boot:run`
Expected: 服务启动在 8080 端口

- [ ] **Step 2: 启动前端开发服务器**

Run: `cd app && npx react-native start`
Expected: Metro bundler 启动

- [ ] **Step 3: 运行 APP（Android）**

Run: `npx react-native run-android`
Expected: APP 编译并安装到模拟器/真机

- [ ] **Step 4: 功能测试清单**

| 测试项 | 预期结果 | 状态 |
|--------|----------|------|
| 用户注册 | 成功注册并返回Token | |
| 用户登录 | 成功登录并跳转首页 | |
| 添加纪念日 | 纪念日保存成功 | |
| 编辑纪念日 | 修改内容更新成功 | |
| 删除纪念日 | 纪念日删除成功 | |
| 日历视图 | 正确显示当月纪念日 | |
| 仪式感配置 | 开关状态保存成功 | |
| 提醒设置 | 提前天数和时间保存成功 | |
| 推荐内容 | 各分类内容正常显示 | |
| 情侣绑定 | 邀请码生成和接受成功 | |
| 通知列表 | 通知记录正常显示 | |

- [ ] **Step 5: Commit**

```bash
git commit -m "test: complete end-to-end testing"
```

---

## Phase 10: 部署上线

### Task 10.1: Docker 部署配置

**Files:**
- Create: `server/Dockerfile`
- Create: `docker-compose.yml`
- Create: `server/src/main/resources/application-prod.yml`

- [ ] **Step 1: 创建后端 Dockerfile**

```dockerfile
# server/Dockerfile
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN apk add --no-cache maven && mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=prod"]
```

- [ ] **Step 2: 创建 docker-compose.yml**

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: ritual-mysql
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: ritual_db
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    command: --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci

  redis:
    image: redis:7-alpine
    container_name: ritual-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  minio:
    image: minio/minio:latest
    container_name: ritual-minio
    environment:
      MINIO_ROOT_USER: ${MINIO_ACCESS_KEY}
      MINIO_ROOT_PASSWORD: ${MINIO_SECRET_KEY}
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data
    command: server /data --console-address ":9001"

  app:
    build: ./server
    container_name: ritual-app
    ports:
      - "8080:8080"
    environment:
      SPRING_PROFILES_ACTIVE: prod
      DB_PASSWORD: ${DB_PASSWORD}
      REDIS_PASSWORD: ${REDIS_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - mysql
      - redis
      - minio

volumes:
  mysql_data:
  redis_data:
  minio_data:
```

- [ ] **Step 3: 创建生产环境配置**

```yaml
# server/src/main/resources/application-prod.yml
spring:
  datasource:
    url: jdbc:mysql://mysql:3306/ritual_db?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai
    username: root
    password: ${DB_PASSWORD}
    driver-class-name: com.mysql.cj.jdbc.Driver
  redis:
    host: redis
    port: 6379
    password: ${REDIS_PASSWORD}
    database: 0
  sql:
    init:
      mode: never

logging:
  level:
    com.ritual: info
  file:
    name: /app/logs/ritual.log
```

- [ ] **Step 4: 构建并启动**

Run:
```bash
docker-compose up -d --build
```

Expected: 所有服务正常启动

- [ ] **Step 5: Commit**

```bash
git add Dockerfile docker-compose.yml server/src/main/resources/application-prod.yml
git commit -m "feat: add Docker deployment configuration"
```

---

## 附录：开发环境启动命令速查

```bash
# 启动 MySQL
docker run -d --name ritual-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=ritual_db \
  -p 3306:3306 \
  mysql:8.0 \
  --character-set-server=utf8mb4 \
  --collation-server=utf8mb4_unicode_ci

# 启动 Redis
docker run -d --name ritual-redis -p 6379:6379 redis:7-alpine

# 启动后端
cd server && mvn spring-boot:run

# 启动前端 Metro
cd app && npx react-native start

# 运行 Android
cd app && npx react-native run-android

# 运行 iOS
cd app && npx react-native run-ios
```

---

*计划完成。请按阶段逐步执行，每个 Task 完成后进行 Commit。*
