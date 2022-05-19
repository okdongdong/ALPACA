package com.ssafy.alpaca.api.service;

import com.ssafy.alpaca.api.request.NotificationReq;
import com.ssafy.alpaca.api.response.NotificationRes;
import com.ssafy.alpaca.common.exception.UnAuthorizedException;
import com.ssafy.alpaca.db.document.Notification;
import com.ssafy.alpaca.common.util.ConvertUtil;
import com.ssafy.alpaca.common.util.ExceptionUtil;
import com.ssafy.alpaca.common.util.JwtTokenUtil;
import com.ssafy.alpaca.db.entity.MyStudy;
import com.ssafy.alpaca.db.entity.Schedule;
import com.ssafy.alpaca.db.entity.Study;
import com.ssafy.alpaca.db.entity.User;
import com.ssafy.alpaca.db.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ServerErrorException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {

    private final ScheduleRepository scheduleRepository;
    private final MyStudyRepository myStudyRepository;
    private final UserRepository userRepository;
    private final StudyRepository studyRepository;
    private final NotificationRepository notificationRepository;
    private final ConvertUtil convertUtil;

    public String createInviteNotification(User user, Long id, List<Long> studyMemberIdList) {
        Study study = studyRepository.findById(id).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.STUDY_NOT_FOUND)
        );

        int cnt = 0;
        for (Long studyMemberId : studyMemberIdList) {
            Optional<User> member = userRepository.findById(studyMemberId);
            if (member.isEmpty()) {
                continue;
            }
            cnt ++;
            notificationRepository.save(
                    Notification.builder()
                            .userId(member.get().getId())
                            .roomMaker(user.getNickname())
                            .roomMakerProfileImg(convertUtil.convertByteArrayToString(user.getProfileImg()))
                            .studyId(study.getId())
                            .studyTitle(study.getTitle())
                            .isInvitation(true)
                            .build()
            );
        }

        if (cnt == 0) {
            return "OK";
        }
        return cnt + "명에게 성공적으로 초대메세지를 전송하였습니다.";
    }

    public void createScheduleNotification(Long id) {
        Schedule schedule = scheduleRepository.getById(id);
        Study study = schedule.getStudy();
        List<MyStudy> myStudies = myStudyRepository.findAllByStudy(study);

        for (MyStudy myStudy : myStudies) {
            notificationRepository.save(
                    Notification.builder()
                            .userId(myStudy.getUser().getId())
                            .studyId(study.getId())
                            .studyTitle(study.getTitle())
                            .scheduleId(id)
                            .scheduleStartedAt(LocalDateTime.from(schedule.getStartedAt()))
                            .isInvitation(false)
                            .build()
            );
        }
    }

    public List<NotificationRes> getNotification(User user) {
        return NotificationRes.of(notificationRepository.findAllByUserId(user.getId()));
    }

    public void deleteNotification(User user, NotificationReq notificationReq) {
        Notification notification = notificationRepository.findById(notificationReq.getNotificationId()).orElseThrow(
                () -> new IllegalArgumentException(ExceptionUtil.INVALID_INVITATION)
        );

        if (!Objects.equals(notification.getUserId(), user.getId())) {
            throw new UnAuthorizedException(ExceptionUtil.UNAUTHORIZED_USER);
        }

        notificationRepository.delete(notification);
    }
}
