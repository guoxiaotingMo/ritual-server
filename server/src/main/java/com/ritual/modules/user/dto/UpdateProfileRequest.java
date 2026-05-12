package com.ritual.modules.user.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateProfileRequest {
    private String nickName;
    private Integer gender;
    private LocalDate birthday;
}
