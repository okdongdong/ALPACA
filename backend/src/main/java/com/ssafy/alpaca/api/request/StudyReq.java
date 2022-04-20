package com.ssafy.alpaca.api.request;

import com.ssafy.alpaca.db.document.Study;
import com.ssafy.alpaca.db.document.User;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyReq {

    @ApiModelProperty( name = "title", example = "Algorithm Study 1" )
    private String title;

    @ApiModelProperty( name = "info",
            example = "Find the latest breaking news and information on the weather, entertainment, and more." )
    private String info;

    @ApiModelProperty( name = "members" )
    private List<String> members;

    public static Study of(StudyReq studyReq, User user, List<User> members) {
        return Study.builder()
                .title(studyReq.getTitle())
                .info(studyReq.getInfo())
                .pinned(LocalDateTime.of(0, 1, 1, 6, 0))
                .inviteCode(null)
                .sessionId(null)
                .roomMaker(user)
                .members(members)
                .schedules(new ArrayList<>())
                .build();


    }
}
