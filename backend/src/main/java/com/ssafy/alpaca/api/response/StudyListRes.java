package com.ssafy.alpaca.api.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyListRes {

    private String id;

    private String title;

    private LocalDateTime pinned;

    private List<String> profileImgList;

}
