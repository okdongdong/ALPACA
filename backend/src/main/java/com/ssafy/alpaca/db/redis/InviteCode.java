package com.ssafy.alpaca.db.redis;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;


@RedisHash(value = "InviteCode", timeToLive = 600)
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InviteCode {

    @Id
    private Long studyId;

    private String code;

}
