package com.ritual.modules.recommend.service;

import com.ritual.modules.recommend.entity.RecommendContent;

import java.util.List;

public interface RecommendService {
    List<RecommendContent> getRecommendations(Integer category);
}
