package com.ssafy.alpaca.api.response;

import com.ssafy.alpaca.db.entity.MyStudy;
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

    private List<Member> members;

    private List<ScheduleListRes> scheduleListRes;

    @Builder
    public static class Member {
        private Long userId;
        private String nickname;
        private boolean isRoomMaker;

        public static List<Member> of(List<MyStudy> list) {
            return  list.stream().map(
                    myStudy -> Member.builder()
                            .userId(myStudy.getUser().getId())
                            .nickname(myStudy.getUser().getNickname())
                            .isRoomMaker(myStudy.getIsRoomMaker())
                            .build()
            ).collect(Collectors.toList());
        }
    }

}
