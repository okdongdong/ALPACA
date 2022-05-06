package com.ssafy.alpaca.db.redis;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;


@RedisHash(value = "StudyCode", timeToLive = 600)
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudyCode {

    @Id
    private String inviteCode;

    private Long studyId;

}
