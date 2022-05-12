package com.ssafy.alpaca.api.service;

import com.ssafy.alpaca.api.request.StudyMemberReq;
import com.ssafy.alpaca.api.response.InviteInfoRes;
import com.ssafy.alpaca.api.response.NoticeRes;
import com.ssafy.alpaca.common.util.ConvertUtil;
import com.ssafy.alpaca.common.util.ExceptionUtil;
import com.ssafy.alpaca.common.util.JwtTokenUtil;
import com.ssafy.alpaca.db.entity.MyStudy;
import com.ssafy.alpaca.db.entity.Schedule;
import com.ssafy.alpaca.db.entity.Study;
import com.ssafy.alpaca.db.entity.User;
import com.ssafy.alpaca.db.repository.MyStudyRepository;
import com.ssafy.alpaca.db.repository.ScheduleRepository;
import com.ssafy.alpaca.db.repository.StudyRepository;
import com.ssafy.alpaca.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import javax.validation.constraints.Null;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final ScheduleRepository scheduleRepository;
    private final MyStudyRepository myStudyRepository;
    private final UserRepository userRepository;
    private final StudyRepository studyRepository;
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
            e.printStackTrace();
        }
        sseEmitters.put(userId, sseEmitter);
        sseEmitter.onCompletion(() -> sseEmitters.remove(userId));
        sseEmitter.onTimeout(()-> sseEmitters.remove(userId));
        sseEmitter.onError((e) -> sseEmitters.remove(userId));
        return sseEmitter;
    }

    public void notifyAddScheduleEvent(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId).orElseThrow(
                ()-> new NoSuchElementException(ExceptionUtil.SCHEDULE_NOT_FOUND));
        List<MyStudy> myStudyList = myStudyRepository.findAllByStudy(schedule.getStudy());
        MyStudy roomMaker = myStudyRepository.findTopByStudyAndIsRoomMaker(schedule.getStudy(), true);

        for (MyStudy myStudy:myStudyList){
            Long userId = myStudy.getUser().getId();
            if (sseEmitters.containsKey(userId)){
                SseEmitter sseEmitter = sseEmitters.get(userId);
                try {
                    sseEmitter.send(SseEmitter.event().name("addSchedule").data(
                            NoticeRes.builder()
                                    .roomMaker(roomMaker.getUser().getNickname())
                                    .roomMakerProfileImg(convertUtil.convertByteArrayToString(roomMaker.getUser().getProfileImg()))
                                    .studyId(schedule.getStudy().getId())
                                    .studyTitle(schedule.getStudy().getTitle())
                                    .scheduleId(scheduleId)
                                    .scheduleStartedAt(schedule.getStartedAt())
                                    .build()
                    ));
                } catch (Exception e) {
                    sseEmitters.remove(userId);
                }
            }
        }
    }

    public void notifyAddStudyEvent(String username, Long id, StudyMemberReq studyMemberReq) throws IllegalAccessException {
        Study study = studyRepository.findById(id).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.STUDY_NOT_FOUND)
        );
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND)
        );
        if (Boolean.TRUE.equals(!myStudyRepository.existsByUserAndStudyAndIsRoomMaker(user, study, true))) {
            throw new IllegalAccessException(ExceptionUtil.UNAUTHORIZED_USER);
        }

        User member = userRepository.findById(studyMemberReq.getMemberId()).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND)
        );

        if (myStudyRepository.existsByUserAndStudy(member, study)) {
            throw new NullPointerException(ExceptionUtil.USER_STUDY_DUPLICATE);
        }

        if (sseEmitters.containsKey(studyMemberReq.getMemberId())){
            SseEmitter sseEmitter = sseEmitters.get(studyMemberReq.getMemberId());
            try {
                sseEmitter.send(SseEmitter.event().name("inviteStudy").data(
                        NoticeRes.builder()
                                .roomMaker(user.getNickname())
                                .roomMakerProfileImg(convertUtil.convertByteArrayToString(user.getProfileImg()))
                                .studyId(study.getId())
                                .studyTitle(study.getTitle())
                                .build()
                ));
            } catch (Exception e) {
                sseEmitters.remove(studyMemberReq.getMemberId());
            }
        }
    }
}
