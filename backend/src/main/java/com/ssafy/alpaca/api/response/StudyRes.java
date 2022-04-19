package com.ssafy.alpaca.api.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyRes {
    private String title;
    private String info;
}
