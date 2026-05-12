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
