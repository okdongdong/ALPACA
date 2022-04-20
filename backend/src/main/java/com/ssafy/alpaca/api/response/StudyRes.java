package com.ssafy.alpaca.api.response;

import com.ssafy.alpaca.db.document.Schedule;
import com.ssafy.alpaca.db.document.Study;
import com.ssafy.alpaca.db.document.User;
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

    private User roomMaker;

    private List<User> members;

//    private List<Schedule> schedules;

    public static StudyRes of(Study study) {
        return StudyRes.builder()
                .title(study.getTitle())
                .info(study.getInfo())
                .roomMaker(study.getRoomMaker())
                .members(study.getMembers())
//                .schedules(study.getSchedules())
                .build();
    }

}
