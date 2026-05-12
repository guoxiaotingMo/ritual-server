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
    public Result<Void> acceptInvite(HttpServletRequest request, @RequestBody Map<String, String> body) {
        Long userId = (Long) request.getAttribute("userId");
        relationService.acceptInvite(userId, body.get("inviteCode"));
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> unbind(HttpServletRequest request, @PathVariable Long id) {
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
