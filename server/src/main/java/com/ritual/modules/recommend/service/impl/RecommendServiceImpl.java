package com.ritual.modules.recommend.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ritual.modules.recommend.entity.RecommendContent;
import com.ritual.modules.recommend.mapper.RecommendContentMapper;
import com.ritual.modules.recommend.service.RecommendService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendServiceImpl implements RecommendService {

    private final RecommendContentMapper recommendContentMapper;

    @Override
    public List<RecommendContent> getRecommendations(Integer category) {
        LambdaQueryWrapper<RecommendContent> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(RecommendContent::getCategory, category)
               .eq(RecommendContent::getIsActive, 1)
               .orderByAsc(RecommendContent::getSortOrder);
        return recommendContentMapper.selectList(wrapper);
    }
}
