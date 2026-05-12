# 仪式感APP - 需求规格说明书

> 版本: v1.0  
> 日期: 2026-05-12  
> 状态: 已确认

---

## 一、产品概述

### 1.1 产品定位

**产品名称**：仪式感APP（暂定）

**一句话定位**：帮你记住每一个重要日子，让每一个纪念日都充满仪式感。

**目标用户**：对仪式感有较高要求的用户，尤其是希望记住伴侣/家人/朋友重要日子的用户。

### 1.2 核心痛点

- 容易忘记重要纪念日（领证日、结婚纪念日、生日、节日等）
- 不知道送什么礼物、说什么祝福语
- 不知道去哪里吃饭、订什么蛋糕/鲜花
- 缺少系统化的仪式感管理工具

### 1.3 核心价值

1. **不忘记** — 智能提醒，提前通知
2. **不纠结** — 礼物/祝福语/文案/蛋糕/鲜花/美食推荐
3. **有温度** — 情侣/家庭共享，共同维护重要日子

---

## 二、功能需求

### 2.1 MVP功能清单

| 功能模块 | 功能点 | 优先级 | 说明 |
|---------|--------|--------|------|
| 用户系统 | 手机号注册/登录 | P0 | 基础认证 |
| 用户系统 | JWT Token认证 | P0 | 无状态认证 |
| 用户系统 | 个人信息管理 | P0 | 昵称、头像、生日、性别 |
| 纪念日管理 | 添加纪念日 | P0 | 标题、日期、类型、关联人 |
| 纪念日管理 | 编辑/删除纪念日 | P0 | 完整CRUD |
| 纪念日管理 | 公历/农历支持 | P0 | 农历转换 |
| 纪念日管理 | 重复设置 | P0 | 每年/每月/不重复 |
| 纪念日管理 | 日历视图 | P0 | 月历展示纪念日 |
| 纪念日管理 | 列表视图 | P0 | 按时间排序 |
| 智能提醒 | 自定义提前天数 | P0 | 0/1/3/7/14/30天 |
| 智能提醒 | 自定义提醒时间 | P0 | 如09:00 |
| 智能提醒 | 系统推送通知 | P0 | FCM + APNs |
| 智能提醒 | APP内通知中心 | P0 | 消息列表 |
| 仪式感定制 | 礼物需求开关 | P0 | 是否需要准备礼物 |
| 仪式感定制 | 祝福语需求开关 | P0 | 是否需要发送祝福语 |
| 仪式感定制 | 朋友圈需求开关 | P0 | 是否需要发朋友圈 |
| 仪式感定制 | 蛋糕需求开关 | P0 | 是否需要订蛋糕 |
| 仪式感定制 | 鲜花需求开关 | P0 | 是否需要送花 |
| 仪式感定制 | 订餐需求开关 | P0 | 是否需要订餐 |
| 内容推荐 | 礼物推荐 | P0 | 内置静态推荐库 |
| 内容推荐 | 祝福语推荐 | P0 | 内置静态推荐库 |
| 内容推荐 | 朋友圈文案推荐 | P0 | 内置静态推荐库 |
| 内容推荐 | 蛋糕推荐 | P0 | 内置静态推荐库 |
| 内容推荐 | 鲜花推荐 | P0 | 内置静态推荐库 |
| 内容推荐 | 美食推荐 | P0 | 内置静态推荐库 |
| 情侣关联 | 发送绑定邀请 | P0 | 生成邀请码/链接 |
| 情侣关联 | 接受绑定邀请 | P0 | 输入邀请码确认 |
| 情侣关联 | 共享纪念日 | P0 | 双方可见 |
| 情侣关联 | 解除绑定 | P1 | 解除关系 |
| 数据同步 | 本地缓存 | P0 | 离线可用 |
| 数据同步 | 云端同步 | P0 | 登录后自动同步 |

### 2.2 未来迭代功能

| 功能模块 | 功能点 | 优先级 | 说明 |
|---------|--------|--------|------|
| 内容推荐 | AI生成祝福语 | P2 | 接入AI接口 |
| 内容推荐 | 电商API接入 | P2 | 淘宝/京东商品推荐 |
| 内容推荐 | 附近商家推荐 | P2 | 地图API接入 |
| 社交功能 | 公开社区 | P2 | 用户分享祝福语/礼物心得 |
| 社交功能 | 点赞/评论 | P2 | 社区互动 |
| 商业模式 | 会员订阅 | P3 | 高级功能解锁 |
| 商业模式 | 广告变现 | P3 | 免费用户展示广告 |
| 多渠道提醒 | 短信提醒 | P2 | 短信通道 |
| 多渠道提醒 | 邮件提醒 | P2 | 邮件通道 |
| 多渠道提醒 | 微信提醒 | P2 | 微信公众号/小程序 |

---

## 三、非功能需求

### 3.1 性能需求

- 页面加载时间 < 1秒
- API响应时间 < 200ms（P99）
- 支持离线模式，本地数据查询 < 100ms
- 推送到达率 > 95%

### 3.2 可用性需求

- 系统可用性 > 99.9%
- 支持断网后自动重连同步
- 数据备份与恢复机制

### 3.3 安全需求

- 用户密码加密存储（BCrypt）
- 接口HTTPS传输
- JWT Token过期机制
- 敏感操作日志记录

### 3.4 兼容性需求

- 支持 iOS 14+ / Android 8+
- 适配多种屏幕尺寸
- 支持深色模式（后续迭代）

---

## 四、技术架构

### 4.1 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                      React Native APP                        │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │ 首页     │ │ 纪念日   │ │ 发现    │ │ 我的    │          │
│  │ (日历)   │ │ (列表)   │ │ (推荐)  │ │ (设置)  │          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  本地存储 (WatermelonDB) + 状态管理 (Zustand)       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTTPS/JSON
┌─────────────────────────────────────────────────────────────┐
│                  Spring Boot 模块化单体                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ 用户模块  │ │ 纪念日模块│ │ 提醒模块  │ │ 关系模块  │      │
│  │ (auth)   │ │ (event)  │ │ (notify) │ │ (relation)│      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────────────┐   │
│  │ 推荐模块  │ │ 配置模块  │ │      公共基础设施         │   │
│  │ (recommend)│ │ (config) │ │  异常处理/日志/校验/缓存   │   │
│  └──────────┘ └──────────┘ └──────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  MySQL (主数据)    Redis (缓存/会话)    MinIO (图片存储)     │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 技术选型

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端 | React Native + TypeScript | 跨平台，一套代码覆盖iOS/Android |
| 状态管理 | Zustand | 轻量，适合中小型项目 |
| 本地存储 | WatermelonDB | 支持离线，与云端同步 |
| 后端 | Spring Boot 3.x + Java 17 | 模块化单体架构 |
| ORM | MyBatis-Plus | 简化CRUD，支持分页 |
| 数据库 | MySQL 8.0 | 主数据存储 |
| 缓存 | Redis | 热点数据缓存、会话、分布式锁 |
| 推送 | Firebase Cloud Messaging + APNs | 系统级推送 |
| 定时任务 | XXL-Job | 纪念日提醒调度 |
| 对象存储 | MinIO | 用户头像、图片等 |
| 部署 | Docker Compose | 快速部署 |

---

## 五、数据库设计

### 5.1 用户表 `user_info`

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 用户ID |
| phone | VARCHAR(20) | UNIQUE, NOT NULL | 手机号 |
| password | VARCHAR(255) | NOT NULL | 加密密码 |
| nick_name | VARCHAR(50) | | 昵称 |
| avatar | VARCHAR(500) | | 头像URL |
| gender | TINYINT | DEFAULT 0 | 性别 0未知 1男 2女 |
| birthday | DATE | | 生日 |
| status | TINYINT | DEFAULT 1 | 状态 0禁用 1正常 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE | 更新时间 |

### 5.2 纪念日表 `anniversary_event`

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 事件ID |
| user_id | BIGINT | FK, NOT NULL | 创建者ID |
| title | VARCHAR(100) | NOT NULL | 标题 |
| event_date | DATE | NOT NULL | 纪念日期 |
| calendar_type | TINYINT | DEFAULT 1 | 历法 1公历 2农历 |
| repeat_type | TINYINT | DEFAULT 1 | 重复 0不重复 1每年 2每月 |
| category | TINYINT | DEFAULT 4 | 分类 1生日 2纪念日 3节日 4自定义 |
| related_person | VARCHAR(50) | | 关联人名称 |
| related_person_id | BIGINT | FK | 关联用户ID |
| is_shared | TINYINT | DEFAULT 0 | 是否共享 0否 1是 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE | 更新时间 |

### 5.3 仪式感配置表 `ritual_config`

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 配置ID |
| event_id | BIGINT | FK, NOT NULL, UNIQUE | 关联纪念日 |
| need_gift | TINYINT | DEFAULT 0 | 是否需要礼物 |
| need_blessing | TINYINT | DEFAULT 0 | 是否需要祝福语 |
| need_moment | TINYINT | DEFAULT 0 | 是否需要发朋友圈 |
| need_cake | TINYINT | DEFAULT 0 | 是否需要蛋糕 |
| need_flower | TINYINT | DEFAULT 0 | 是否需要鲜花 |
| need_dinner | TINYINT | DEFAULT 0 | 是否需要订餐 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE | 更新时间 |

### 5.4 提醒设置表 `reminder_setting`

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 设置ID |
| event_id | BIGINT | FK, NOT NULL, UNIQUE | 关联纪念日 |
| advance_days | INT | DEFAULT 1 | 提前天数 |
| reminder_time | TIME | DEFAULT '09:00:00' | 提醒时间 |
| push_enabled | TINYINT | DEFAULT 1 | 是否启用推送 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE | 更新时间 |

### 5.5 用户关系表 `user_relation`

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 关系ID |
| user_id | BIGINT | FK, NOT NULL | 用户A |
| partner_id | BIGINT | FK, NOT NULL | 用户B |
| relation_type | TINYINT | DEFAULT 1 | 关系类型 1情侣 2夫妻 3家庭 |
| status | TINYINT | DEFAULT 0 | 状态 0邀请中 1已绑定 2已解除 |
| invite_code | VARCHAR(20) | UNIQUE | 邀请码 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE | 更新时间 |

### 5.6 推荐内容表 `recommend_content`

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 内容ID |
| category | TINYINT | NOT NULL | 分类 1礼物 2祝福语 3文案 4蛋糕 5鲜花 6美食 |
| title | VARCHAR(200) | NOT NULL | 标题 |
| content | TEXT | | 内容 |
| tags | VARCHAR(500) | | 标签，JSON格式 |
| sort_order | INT | DEFAULT 0 | 排序 |
| is_active | TINYINT | DEFAULT 1 | 是否启用 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

### 5.7 通知记录表 `notification_record`

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 通知ID |
| user_id | BIGINT | FK, NOT NULL | 接收用户 |
| event_id | BIGINT | FK | 关联纪念日 |
| title | VARCHAR(200) | NOT NULL | 通知标题 |
| content | VARCHAR(500) | | 通知内容 |
| type | TINYINT | DEFAULT 1 | 类型 1提醒 2系统 |
| is_read | TINYINT | DEFAULT 0 | 是否已读 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

---

## 六、API 接口设计

### 6.1 认证模块

```
POST   /api/v1/auth/register          注册
POST   /api/v1/auth/login             登录
POST   /api/v1/auth/refresh           刷新Token
DELETE /api/v1/auth/logout            退出登录
```

### 6.2 用户模块

```
GET    /api/v1/user/profile           获取个人信息
PUT    /api/v1/user/profile           更新个人信息
POST   /api/v1/user/avatar            上传头像
```

### 6.3 纪念日模块

```
GET    /api/v1/events                 获取纪念日列表
POST   /api/v1/events                 创建纪念日
GET    /api/v1/events/{id}            获取纪念日详情
PUT    /api/v1/events/{id}            更新纪念日
DELETE /api/v1/events/{id}            删除纪念日
GET    /api/v1/calendar/{year}/{month} 获取日历视图数据
```

### 6.4 仪式感模块

```
GET    /api/v1/events/{id}/ritual     获取仪式感配置
PUT    /api/v1/events/{id}/ritual     更新仪式感配置
```

### 6.5 提醒模块

```
GET    /api/v1/events/{id}/reminder   获取提醒设置
PUT    /api/v1/events/{id}/reminder   更新提醒设置
```

### 6.6 推荐模块

```
GET    /api/v1/recommend/gifts        获取礼物推荐
GET    /api/v1/recommend/blessings    获取祝福语推荐
GET    /api/v1/recommend/moments      获取朋友圈文案推荐
GET    /api/v1/recommend/cakes        获取蛋糕推荐
GET    /api/v1/recommend/flowers      获取鲜花推荐
GET    /api/v1/recommend/dinners      获取美食推荐
```

### 6.7 关系模块

```
POST   /api/v1/relations/invite       发送绑定邀请
POST   /api/v1/relations/accept       接受绑定邀请
DELETE /api/v1/relations/{id}         解除绑定
GET    /api/v1/relations/partner      获取伴侣信息
```

### 6.8 通知模块

```
GET    /api/v1/notifications          获取通知列表
PUT    /api/v1/notifications/{id}/read 标记通知已读
DELETE /api/v1/notifications/{id}     删除通知
```

### 6.9 统一响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": { ... },
  "timestamp": 1715529600000
}
```

错误响应：

```json
{
  "code": 40001,
  "message": "参数校验失败",
  "data": null,
  "timestamp": 1715529600000
}
```

---

## 七、核心业务流程

### 7.1 创建纪念日 + 仪式感配置流程

```
用户打开APP → 点击"添加纪念日"
    → 填写标题、日期、类型、关联人
    → 保存纪念日
    → 进入"仪式感定制"页面
        → 选择是否需要：礼物/祝福语/朋友圈/蛋糕/鲜花/订餐
        → 设置提醒时间（提前几天、几点提醒）
    → 保存配置
    → 系统生成定时任务，到时间自动推送
```

### 7.2 情侣绑定流程

```
用户A → 点击"绑定伴侣" → 生成邀请码/链接
    → 发送给伴侣（微信/短信）
用户B → 打开链接/输入邀请码 → 登录/注册
    → 确认绑定
    → 双方共享纪念日和提醒
```

### 7.3 提醒推送流程

```
XXL-Job 定时扫描 → 查询当天需要提醒的纪念日
    → 根据 reminder_setting 过滤
    → 调用 FCM/APNs 推送通知
    → 同时写入 APP 内通知表
    → 用户收到推送 → 打开APP → 查看详情和推荐
```

### 7.4 数据同步流程

```
用户操作（增删改）→ 写入本地数据库
    → 网络可用时 → 调用API同步到云端
    → 网络不可用时 → 标记为待同步
    → 网络恢复后 → 批量同步待同步数据
登录时 → 拉取云端数据 → 与本地数据合并
```

---

## 八、APP 页面结构

### 8.1 Tab 导航

```
┌─────────────────────────────────────────────────────────────┐
│  [首页]    [纪念日]    [发现]    [我的]                      │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 首页（日历视图）

- 顶部：当前年月，左右切换月份
- 中部：月历网格，标记有纪念日的日期
- 底部：即将到来的纪念日列表卡片

### 8.3 纪念日页（列表视图）

- 顶部：分类筛选（全部/生日/纪念日/节日）
- 中部：纪念日列表，按时间排序
- 每项显示：标题、日期、倒计时、仪式感图标
- 底部：添加按钮

### 8.4 发现页（推荐内容）

- 顶部：分类Tab（礼物/祝福语/文案/蛋糕/鲜花/美食）
- 中部：推荐内容卡片列表
- 支持收藏、复制、分享

### 8.5 我的页（个人中心）

- 顶部：用户信息卡片
- 中部：功能列表
  - 绑定伴侣
  - 提醒设置
  - 数据同步
  - 通用设置
- 底部：退出登录

---

## 九、项目目录结构

```
仪式感/
├── app/                          # React Native APP
│   ├── src/
│   │   ├── api/                  # API 接口封装
│   │   ├── components/           # 公共组件
│   │   ├── screens/              # 页面
│   │   │   ├── Home/             # 首页（日历）
│   │   │   ├── Events/           # 纪念日列表
│   │   │   ├── EventDetail/      # 纪念日详情
│   │   │   ├── EventEdit/        # 添加/编辑纪念日
│   │   │   ├── RitualConfig/     # 仪式感定制
│   │   │   ├── Discover/         # 发现（推荐）
│   │   │   ├── Profile/          # 我的
│   │   │   ├── Relation/         # 情侣绑定
│   │   │   └── Notification/     # 通知中心
│   │   ├── store/                # Zustand 状态管理
│   │   ├── utils/                # 工具函数
│   │   ├── constants/            # 常量
│   │   └── types/                # TypeScript 类型定义
│   ├── package.json
│   └── ...
├── server/                       # Spring Boot 后端
│   ├── src/main/java/com/ritual/
│   │   ├── RitualApplication.java
│   │   ├── common/               # 公共基础设施
│   │   │   ├── config/           # 配置类
│   │   │   ├── exception/        # 异常处理
│   │   │   ├── result/           # 统一返回结果
│   │   │   ├── util/             # 工具类
│   │   │   └── interceptor/      # 拦截器
│   │   ├── modules/
│   │   │   ├── user/             # 用户模块
│   │   │   ├── event/            # 纪念日模块
│   │   │   ├── reminder/         # 提醒模块
│   │   │   ├── relation/         # 关系模块
│   │   │   ├── recommend/        # 推荐模块
│   │   │   └── config/           # 配置模块
│   │   └── job/                  # 定时任务
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── mapper/               # MyBatis XML
│   └── pom.xml
├── docs/                         # 文档
│   └── specs/                    # 设计文档
├── docker-compose.yml
└── README.md
```

---

## 十、关键设计决策

| 决策点 | 方案 | 理由 |
|--------|------|------|
| 前端状态管理 | Zustand | 比Redux轻量，API简单，适合个人开发 |
| 本地数据库 | WatermelonDB | 支持离线+同步，性能好，React Native原生支持 |
| 用户认证 | JWT + Refresh Token | 无状态，适合移动端 |
| 定时任务 | XXL-Job | 可视化调度，支持分片，社区活跃 |
| 推送通道 | FCM + APNs | 原生推送，到达率高 |
| 图片存储 | MinIO | 兼容S3 API，私有化部署 |
| 农历转换 | lunar-java | Java农历库，支持公历农历互转 |
| 架构模式 | 模块化单体 | 适合MVP，未来可拆分微服务 |

---

## 十一、风险与应对

| 风险 | 影响 | 应对措施 |
|------|------|----------|
| 推送到达率不稳定 | 高 | 接入多家推送服务商，失败时降级 |
| 农历转换准确性 | 中 | 使用成熟库lunar-java，充分测试 |
| 数据同步冲突 | 中 | 实现乐观锁，记录版本号，冲突时提示用户 |
| 审核上架被拒 | 中 | 提前了解各平台审核规范，准备完整材料 |
| 开发周期过长 | 高 | 严格按MVP范围开发，不追加功能 |

---

*文档结束*
