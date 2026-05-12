package com.ritual.modules.event.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ritual.modules.event.entity.AnniversaryEvent;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface AnniversaryEventMapper extends BaseMapper<AnniversaryEvent> {

    @Select("SELECT * FROM anniversary_event WHERE user_id = #{userId} AND deleted = 0 AND event_date BETWEEN #{start} AND #{end} ORDER BY event_date")
    List<AnniversaryEvent> selectByDateRange(@Param("userId") Long userId, @Param("start") LocalDate start, @Param("end") LocalDate end);
}
