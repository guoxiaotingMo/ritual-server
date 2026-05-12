package com.ritual.modules.relation.vo;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PartnerVO {
    private Long id;
    private Long relationId;
    private String phone;
    private String nickName;
    private String avatar;
    private Integer gender;
    private LocalDate birthday;
}
