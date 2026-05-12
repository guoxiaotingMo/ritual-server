package com.ritual.modules.user.vo;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UserVO {
    private Long id;
    private String phone;
    private String nickName;
    private String avatar;
    private Integer gender;
    private LocalDate birthday;
}
