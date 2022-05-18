package com.ssafy.alpaca.api.service;

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
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
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
    private final JwtTokenUtil jwtTokenUtil;
    private final ConvertUtil convertUtil;
    public static Map<Long, SseEmitter> sseEmitters = new ConcurrentHashMap<>();

    public SseEmitter subscribe(String token) {
        String username = jwtTokenUtil.getUsername(token);
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND));
        Long userId = user.getId();
        SseEmitter sseEmitter = new SseEmitter(Long.MAX_VALUE);
        try {
            sseEmitter.send(SseEmitter.event().name("connect"));
        } catch (IOException e){
            throw new ServerErrorException(ExceptionUtil.SERVER_ERROR_WAIT,e);
        }
        sseEmitters.put(userId, sseEmitter);
        notifyOld(userId);
        sseEmitter.onCompletion(() -> sseEmitters.remove(userId));
        sseEmitter.onTimeout(()-> sseEmitters.remove(userId));
        sseEmitter.onError((e) -> sseEmitters.remove(userId));
        return sseEmitter;
    }

    public void notifyAddScheduleEvent(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId).orElseThrow(
                ()-> new NoSuchElementException(ExceptionUtil.SCHEDULE_NOT_FOUND));
        Study study = schedule.getStudy();
        List<MyStudy> myStudyList = myStudyRepository.findAllByStudy(study);
        MyStudy roomMaker = myStudyRepository.findTopByStudyAndIsRoomMaker(study, true);
        for (MyStudy myStudy:myStudyList){
            Long userId = myStudy.getUser().getId();
            if (sseEmitters.containsKey(userId)){
                SseEmitter sseEmitter = sseEmitters.get(userId);
                try {
                    sseEmitter.send(SseEmitter.event().name("addSchedule").data(
                            Notification.builder()
                                    .roomMaker(roomMaker.getUser().getNickname())
                                    .roomMakerProfileImg(convertUtil.convertByteArrayToString(roomMaker.getUser().getProfileImg()))
                                    .studyId(study.getId())
                                    .studyTitle(study.getTitle())
                                    .scheduleId(scheduleId)
                                    .scheduleStartedAt(schedule.getStartedAt().toLocalDateTime())
                                    .build()
                    ));
                } catch (Exception e) {
                    sseEmitters.remove(userId);
                }
            }
            else {
                notificationRepository.save(
                        Notification.builder()
                                .userId(userId)
                                .roomMaker(roomMaker.getUser().getNickname())
                                .roomMakerProfileImg(convertUtil.convertByteArrayToString(roomMaker.getUser().getProfileImg()))
                                .studyId(study.getId())
                                .studyTitle(study.getTitle())
                                .scheduleId(scheduleId)
                                .scheduleStartedAt(schedule.getStartedAt().toLocalDateTime())
                                .build()
                );
            }
        }
    }

    public void notifyAddStudyEvent(String username, Long id, List<Long> studyMemberIdList) {
        Study study = studyRepository.findById(id).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.STUDY_NOT_FOUND)
        );
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND)
        );
        if (Boolean.TRUE.equals(!myStudyRepository.existsByUserAndStudyAndIsRoomMaker(user, study, true))) {
            throw new UnAuthorizedException(ExceptionUtil.UNAUTHORIZED_USER);
        }

        for (Long memberId : studyMemberIdList) {

            Optional<User> member = userRepository.findById(memberId);
            if (member.isEmpty()) {
                continue;
            }

            if (myStudyRepository.existsByUserAndStudy(member.get(), study)) {
                continue;
            }
    
            if (sseEmitters.containsKey(memberId)){
                SseEmitter sseEmitter = sseEmitters.get(memberId);
                try {
                    sseEmitter.send(SseEmitter.event().name("inviteStudy").data(
                            Notification.builder()
                                    .roomMaker(user.getNickname())
                                    .roomMakerProfileImg(convertUtil.convertByteArrayToString(user.getProfileImg()))
                                    .studyId(study.getId())
                                    .studyTitle(study.getTitle())
                                    .build()
                    ));
                } catch (Exception e) {
                    sseEmitters.remove(memberId);
                }
            }
            else {
                notificationRepository.save(
                        Notification.builder()
                                .userId(member.get().getId())
                                .roomMaker(user.getNickname())
                                .roomMakerProfileImg(convertUtil.convertByteArrayToString(user.getProfileImg()))
                                .studyId(study.getId())
                                .studyTitle(study.getTitle())
                                .build()
                );
            }
        }
    }

    public void notifyOld(Long userId){
        List<Notification> notifications = notificationRepository.findAllByUserId(userId);
        SseEmitter sseEmitter = sseEmitters.get(userId);
        for (Notification notification:notifications){
            try {
                sseEmitter.send(SseEmitter.event().name("initialNotification").data(notification));
            } catch (Exception e) {
                sseEmitters.remove(userId);
            }
        }
        notificationRepository.deleteAll(notifications);
    }
}
