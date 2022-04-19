package com.ssafy.alpaca.api.response;

import com.ssafy.alpaca.db.document.Schedule;
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

    private List<User> members;

    private List<Schedule> schedules;

}
