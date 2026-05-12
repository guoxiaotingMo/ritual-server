package com.ritual.modules.relation.service;

import com.ritual.modules.relation.vo.PartnerVO;

public interface RelationService {
    String generateInviteCode(Long userId);
    void acceptInvite(Long userId, String inviteCode);
    void unbind(Long userId, Long relationId);
    PartnerVO getPartner(Long userId);
}
