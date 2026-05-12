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
