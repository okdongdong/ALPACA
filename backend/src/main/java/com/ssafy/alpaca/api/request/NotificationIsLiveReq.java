package com.ssafy.alpaca.api.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationIsLiveReq {

    private Boolean isLive;

}
