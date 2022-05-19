package com.ssafy.alpaca.api.response;

import com.ssafy.alpaca.db.document.Notification;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRes {

    private String id;

    private Long userId;

    private String roomMaker;

    private String roomMakerProfileImg;

    private Long studyId;

    private String studyTitle;

    private Long scheduleId;

    private LocalDateTime scheduleStartedAt;

    private Boolean isInvitation;

    public static List<NotificationRes> of(List<Notification> notifications) {
        return notifications.stream().map(
                notification -> NotificationRes.builder()
                        .id(notification.getId())
                        .userId(notification.getUserId())
                        .roomMaker(notification.getRoomMaker())
                        .roomMakerProfileImg(notification.getRoomMakerProfileImg())
                        .studyId(notification.getStudyId())
                        .studyTitle(notification.getStudyTitle())
                        .scheduleId(notification.getScheduleId())
                        .scheduleStartedAt(notification.getScheduleStartedAt())
                        .isInvitation(notification.getIsInvitation())
                        .build())
                .collect(Collectors.toList());
    }
}
