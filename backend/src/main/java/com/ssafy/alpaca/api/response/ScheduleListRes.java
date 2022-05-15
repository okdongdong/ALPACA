package com.ssafy.alpaca.api.response;

import com.ssafy.alpaca.db.entity.Schedule;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleListRes {

    private Long id;

    private OffsetDateTime startedAt;

    private OffsetDateTime finishedAt;

    public static List<ScheduleListRes> of(List<Schedule> schedules) {
        return schedules.stream().map(
                schedule -> ScheduleListRes.builder()
                        .id(schedule.getId())
                        .startedAt(schedule.getStartedAt())
                        .finishedAt(schedule.getFinishedAt())
                        .build()).collect(Collectors.toList());
    }
}
