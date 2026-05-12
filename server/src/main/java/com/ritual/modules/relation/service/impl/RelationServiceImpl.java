package com.ritual.modules.relation.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ritual.common.exception.BusinessException;
import com.ritual.common.result.ResultCode;
import com.ritual.modules.relation.entity.UserRelation;
import com.ritual.modules.relation.mapper.UserRelationMapper;
import com.ritual.modules.relation.service.RelationService;
import com.ritual.modules.relation.vo.PartnerVO;
import com.ritual.modules.user.entity.UserInfo;
import com.ritual.modules.user.mapper.UserInfoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RelationServiceImpl implements RelationService {

    private final UserRelationMapper relationMapper;
    private final UserInfoMapper userInfoMapper;

    @Override
    public String generateInviteCode(Long userId) {
        LambdaQueryWrapper<UserRelation> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserRelation::getUserId, userId)
               .eq(UserRelation::getStatus, 1);
        if (relationMapper.selectCount(wrapper) > 0) {
            throw new BusinessException(ResultCode.RELATION_EXISTS);
        }

        String inviteCode = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        UserRelation relation = new UserRelation();
        relation.setUserId(userId);
        relation.setInviteCode(inviteCode);
        relation.setStatus(0);
        relationMapper.insert(relation);
        return inviteCode;
    }

    @Override
    public void acceptInvite(Long userId, String inviteCode) {
        LambdaQueryWrapper<UserRelation> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserRelation::getInviteCode, inviteCode)
               .eq(UserRelation::getStatus, 0);
        UserRelation relation = relationMapper.selectOne(wrapper);

        if (relation == null) {
            throw new BusinessException(ResultCode.INVALID_INVITE_CODE);
        }
        if (relation.getUserId().equals(userId)) {
            throw new BusinessException(ResultCode.INVALID_INVITE_CODE);
        }

        relation.setPartnerId(userId);
        relation.setStatus(1);
        relationMapper.updateById(relation);

        UserRelation reverse = new UserRelation();
        reverse.setUserId(userId);
        reverse.setPartnerId(relation.getUserId());
        reverse.setStatus(1);
        relationMapper.insert(reverse);
    }

    @Override
    public void unbind(Long userId, Long relationId) {
        UserRelation relation = relationMapper.selectById(relationId);
        if (relation == null || !relation.getUserId().equals(userId)) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        relationMapper.deleteById(relationId);

        LambdaQueryWrapper<UserRelation> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserRelation::getUserId, relation.getPartnerId())
               .eq(UserRelation::getPartnerId, userId);
        UserRelation reverse = relationMapper.selectOne(wrapper);
        if (reverse != null) {
            relationMapper.deleteById(reverse.getId());
        }
    }

    @Override
    public PartnerVO getPartner(Long userId) {
        LambdaQueryWrapper<UserRelation> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserRelation::getUserId, userId)
               .eq(UserRelation::getStatus, 1);
        UserRelation relation = relationMapper.selectOne(wrapper);

        if (relation == null) {
            return null;
        }

        UserInfo partner = userInfoMapper.selectById(relation.getPartnerId());
        if (partner == null) {
            return null;
        }

        PartnerVO vo = new PartnerVO();
        BeanUtils.copyProperties(partner, vo);
        vo.setRelationId(relation.getId());
        return vo;
    }
}
