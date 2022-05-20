package com.ssafy.alpaca.api.response;

import com.ssafy.alpaca.db.entity.Schedule;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyRes {

    private String title;

    private String info;

    private Schedule schedule;

    private List<Member> members;

    private List<ScheduleListRes> scheduleListRes;

    private String offsetId;

    @Getter
    @Builder
    public static class Member {

        private Long userId;

        private String nickname;

        private String bojId;

        private boolean isRoomMaker;

        private String profileImg;

    }

}
