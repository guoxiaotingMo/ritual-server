package com.ritual.modules.notification.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class PushService {

    public void sendPush(Long userId, String title, String content) {
        log.info("发送推送给用户 {}: {} - {}", userId, title, content);
    }
}
