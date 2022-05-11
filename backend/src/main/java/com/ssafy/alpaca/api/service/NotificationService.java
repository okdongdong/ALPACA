package com.ssafy.alpaca.api.service;

import com.ssafy.alpaca.common.util.ExceptionUtil;
import com.ssafy.alpaca.common.util.JwtTokenUtil;
import com.ssafy.alpaca.db.entity.MyStudy;
import com.ssafy.alpaca.db.entity.Schedule;
import com.ssafy.alpaca.db.entity.Study;
import com.ssafy.alpaca.db.entity.User;
import com.ssafy.alpaca.db.repository.MyStudyRepository;
import com.ssafy.alpaca.db.repository.ScheduleRepository;
import com.ssafy.alpaca.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
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
    private final JwtTokenUtil jwtTokenUtil;
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
        Study study = schedule.getStudy();
        List<MyStudy> myStudyList = myStudyRepository.findAllByStudy(study);
        for (MyStudy myStudy:myStudyList){
            Long userId = myStudy.getUser().getId();
            if (sseEmitters.containsKey(userId)){
                SseEmitter sseEmitter = sseEmitters.get(userId);
                try {
                    sseEmitter.send(SseEmitter.event().name("addSchedule").data("스케쥴이 추가되었습니다"));
                } catch (Exception e) {
                    sseEmitters.remove(userId);
                }
            }
        }
    }

    public void notifyAddStudyEvent(Study study, User member){
        Long memberId = member.getId();
        if (sseEmitters.containsKey(memberId)){
            SseEmitter sseEmitter = sseEmitters.get(memberId);
            try {
                sseEmitter.send(SseEmitter.event().name("inviteStudy").data("스터디가 추가되었습니다"));
            } catch (Exception e) {
                sseEmitters.remove(memberId);
            }
        }
    }
}
