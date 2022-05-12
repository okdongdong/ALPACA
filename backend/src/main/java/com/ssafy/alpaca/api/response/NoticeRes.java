package com.ssafy.alpaca.api.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoticeRes {

    private String roomMaker;

    private String roomMakerProfileImg;

    private Long studyId;

    private String studyTitle;

    private Long scheduleId;

    private LocalDateTime scheduleStartedAt;

}
