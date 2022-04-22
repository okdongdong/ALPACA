package com.ssafy.alpaca.api.request;

import com.ssafy.alpaca.db.entity.Study;
import com.ssafy.alpaca.db.entity.User;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

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
            example = "스터디에 관한 정보를 입력해주세요." )
    private String info;

    @ApiModelProperty( name = "members" )
    private List<Long> memberIdList;

    public static Study of(StudyReq studyReq, User user) {
        return Study.builder()
                .title(studyReq.getTitle())
                .info(studyReq.getInfo())
//                .inviteCode(null)
//                .sessionId(null)
                .build();


    }
}
