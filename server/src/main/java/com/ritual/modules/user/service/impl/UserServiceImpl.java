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
