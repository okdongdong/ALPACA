package com.ssafy.alpaca.api.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InviteInfoRes {

    private String roomMaker;

    private String roomMakerProfileImg;

    private String title;

    private String info;

}
