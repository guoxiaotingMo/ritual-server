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
