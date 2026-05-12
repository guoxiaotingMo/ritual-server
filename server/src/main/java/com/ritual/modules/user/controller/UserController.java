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
