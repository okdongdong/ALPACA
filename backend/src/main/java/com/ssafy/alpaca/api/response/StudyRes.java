package com.ssafy.alpaca.api.response;

import com.ssafy.alpaca.db.entity.MyStudy;
import com.ssafy.alpaca.db.entity.Schedule;
import com.ssafy.alpaca.db.entity.Study;
import com.ssafy.alpaca.db.entity.User;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

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

    @Builder
    public static class Member {

        public Long userId;

        public String nickname;

        public String bojId;

        public boolean isRoomMaker;

        public String profileImg;

    }

}
