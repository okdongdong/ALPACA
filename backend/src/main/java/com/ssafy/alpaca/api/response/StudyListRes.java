package com.ssafy.alpaca.api.response;

import lombok.*;

import java.time.OffsetDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyListRes {

    private Long id;

    private String title;

    private OffsetDateTime pinnedTime;

    private List<String> profileImgList;

}
