package com.ssafy.alpaca.api.response;

import com.ssafy.alpaca.db.document.Schedule;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleListRes {

    private String id;

    private LocalDateTime startedAt;

    public static List<ScheduleListRes> of(List<Schedule> schedules) {
        return schedules.stream().map(
                schedule -> ScheduleListRes.builder()
                        .id(schedule.getId())
                        .startedAt(schedule.getStartedAt())
                        .build()).collect(Collectors.toList());
    }
}
