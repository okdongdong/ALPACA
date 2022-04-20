package com.ssafy.alpaca.api.response;

import com.ssafy.alpaca.db.document.Study;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyInfoRes {

    private String userId;

    private String username;

    private String nickname;

    private String info;

    private String profileImg;

    private String bojId;

    private String theme;

    private String preferredLanguage;

    private List<Study> studies;

}
