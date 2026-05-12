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
