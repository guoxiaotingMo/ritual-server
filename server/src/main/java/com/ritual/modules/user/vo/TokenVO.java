package com.ritual.modules.user.vo;

import lombok.Data;

@Data
public class TokenVO {
    private String accessToken;
    private String refreshToken;
    private Long expiresIn;
}
