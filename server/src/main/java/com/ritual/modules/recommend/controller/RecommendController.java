package com.ritual.modules.recommend.controller;

import com.ritual.common.result.Result;
import com.ritual.modules.recommend.entity.RecommendContent;
import com.ritual.modules.recommend.service.RecommendService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/recommend")
@RequiredArgsConstructor
public class RecommendController {

    private final RecommendService recommendService;

    @GetMapping("/gifts")
    public Result<List<RecommendContent>> getGifts() {
        return Result.success(recommendService.getRecommendations(1));
    }

    @GetMapping("/blessings")
    public Result<List<RecommendContent>> getBlessings() {
        return Result.success(recommendService.getRecommendations(2));
    }

    @GetMapping("/moments")
    public Result<List<RecommendContent>> getMoments() {
        return Result.success(recommendService.getRecommendations(3));
    }

    @GetMapping("/cakes")
    public Result<List<RecommendContent>> getCakes() {
        return Result.success(recommendService.getRecommendations(4));
    }

    @GetMapping("/flowers")
    public Result<List<RecommendContent>> getFlowers() {
        return Result.success(recommendService.getRecommendations(5));
    }

    @GetMapping("/dinners")
    public Result<List<RecommendContent>> getDinners() {
        return Result.success(recommendService.getRecommendations(6));
    }
}
