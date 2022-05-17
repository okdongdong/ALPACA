package com.ssafy.alpaca.api.service;

import com.ssafy.alpaca.api.response.ProblemRecommendRes;
import com.ssafy.alpaca.common.util.ExceptionUtil;
import com.ssafy.alpaca.db.document.Problem;
import com.ssafy.alpaca.db.document.TodayProblem;
import com.ssafy.alpaca.db.entity.SolvedProblem;
import com.ssafy.alpaca.db.entity.User;
import com.ssafy.alpaca.db.repository.ProblemRepository;
import com.ssafy.alpaca.db.repository.SolvedProblemRepository;
import com.ssafy.alpaca.db.repository.TodayProblemRepository;
import com.ssafy.alpaca.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ServerErrorException;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProblemService {

    private final UserRepository userRepository;
    private final ProblemRepository problemRepository;
    private final SolvedProblemRepository solvedProblemRepository;
    private final TodayProblemRepository todayProblemRepository;

    private JSONObject getJsonDataFromURL(HttpURLConnection httpURLConnection) throws IOException, ParseException {
        httpURLConnection.setRequestMethod("GET");
        httpURLConnection.setDoOutput(true);
        BufferedReader bufferedReader = new BufferedReader(
                new InputStreamReader(httpURLConnection.getInputStream())
        );
        StringBuilder stringBuilder = new StringBuilder();
        String inputLine;
        while ((inputLine = bufferedReader.readLine()) != null) {
            stringBuilder.append(inputLine);
        }
        bufferedReader.close();
        String response = stringBuilder.toString();
        JSONParser jsonParser = new JSONParser();
        return (JSONObject) jsonParser.parse(response);
    }

    public List<Problem> searchProblems(Long problemNumber) {
        return problemRepository.findTop10ByProblemNumberStartingWithOrderByProblemNumberAsc(problemNumber);
    }

    public Problem getProblem(Long problemNumber) {
        return problemRepository.findByProblemNumber(problemNumber).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.PROBLEM_NOT_FOUND)
        );
    }

    public void refreshSolvedAc(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND));
        refreshClassLevel(user);
        refreshSolvedProblem(user);
    }

    private void refreshClassLevel(User user) {
        try {
            URL url = new URL("https://solved.ac/api/v3/search/user?query=" + user.getBojId());
            HttpURLConnection httpURLConnection = (HttpURLConnection) url.openConnection();
            JSONObject jsonObject = getJsonDataFromURL(httpURLConnection);
            List<JSONObject> jsonObjects = (List<JSONObject>) jsonObject.get("items");
            JSONObject userData = jsonObjects.get(0);
            if (Boolean.TRUE.equals(!userData.get("handle").toString().equals(user.getBojId()))) {
                throw new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND);
            }

            user.setClassLevel((Long) userData.get("class"));
            user.setClassDecoration(userData.get("classDecoration").toString());
            user.setLevel((Long) userData.get("tier"));
            userRepository.save(user);
        } catch (IOException | ParseException e) {
            throw new ServerErrorException(ExceptionUtil.SERVER_ERROR_WAIT,e);
        }
    }

    private void refreshSolvedProblem(User user) {
        int page = 1;
        HashSet<Long> solvedProblemList = new HashSet<>();

        try {
            while (true) {
                URL url = new URL("https://solved.ac/api/v3/search/problem?query=solved_by:" + user.getBojId() + "&page=" + page);
                HttpURLConnection httpURLConnection = (HttpURLConnection) url.openConnection();
                JSONObject jsonObject = getJsonDataFromURL(httpURLConnection);
                long totalCount = (long) jsonObject.get("count");
                List<JSONObject> jsonObjects = (List<JSONObject>) jsonObject.get("items");
                for (JSONObject j : jsonObjects) {
                    solvedProblemList.add((Long) j.get("problemId"));
                }

                if (1 + totalCount / 100 <= page) {
                    httpURLConnection.disconnect();
                    break;
                }
                page++;
            }
        } catch (IOException | ParseException e) {
            throw new ServerErrorException(ExceptionUtil.SERVER_ERROR_WAIT,e);
        }

        List<SolvedProblem> solvedProblems = solvedProblemRepository.findAllByUser(user);
        for (SolvedProblem solvedProblem : solvedProblems) {
            solvedProblemList.remove(solvedProblem.getProblemNumber());
        }

        List<SolvedProblem> newSolvedProblem = new ArrayList<>();
        for (Long solvedProblem : solvedProblemList) {
//            Optional<Problem> problem = problemRepository.findByProblemNumber(solvedProblem);
//            if (problem.isEmpty()) {
//                continue;
//            }
            newSolvedProblem.add(
                    SolvedProblem.builder()
                            .problemNumber(solvedProblem)
                            .user(user)
                            .build()
            );
        }
        solvedProblemRepository.saveAll(newSolvedProblem);
    }

    public List<ProblemRecommendRes> recommendProblem(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND));

        Optional<TodayProblem> todayProblem = todayProblemRepository.findByUserId(user.getId());
        if (todayProblem.isPresent() && todayProblem.get().getDate().isEqual(LocalDate.now())) {
            return todayProblem.get().getProblemRecommendRes();
        } else {
            List<ProblemRecommendRes> problemRecommendRes;
            if (user.getClassDecoration().equals("gold")) {
                if (user.getClassLevel() < 10) {
                    problemRecommendRes = getClassProblem(user.getClassLevel()+1, user);
                } else {
                    problemRecommendRes = getRandomProblem(user);
                }
            } else if (0 < user.getClassLevel()) {
                problemRecommendRes = getClassProblem(user.getClassLevel(), user);
            } else {
                problemRecommendRes = getClassProblem(1L, user);
            }
            if (todayProblem.isEmpty()) {
                todayProblemRepository.save(TodayProblem.builder()
                        .userId(user.getId())
                        .problemRecommendRes(problemRecommendRes)
                        .date(LocalDate.now()).build());
                return problemRecommendRes;
            }
            todayProblem.get().setDate(LocalDate.now());
            todayProblem.get().setProblemRecommendRes(problemRecommendRes);
            todayProblemRepository.save(todayProblem.get());
            return problemRecommendRes;
        }
    }

    private List<ProblemRecommendRes> get3FromCandidate(List<Problem> candidateProblems, Long userId) {
        List<ProblemRecommendRes> selectProblems = new ArrayList<>();
        HashSet<Integer> selectIndex = new HashSet<>();
        HashSet<Long> solvedProblems = solvedProblemRepository.findProblemNumbersByUserId(userId);
        Random random = new Random();
        int newCandidate;

        while (selectProblems.size() < 3) {
            newCandidate = random.nextInt(candidateProblems.size());
            if (selectIndex.contains(newCandidate)) {
                continue;
            }
            selectIndex.add(newCandidate);
            if (solvedProblems.contains((long) newCandidate)) {
                continue;
            }
            selectProblems.add(
                    ProblemRecommendRes.builder()
                            .problemNumber(candidateProblems.get(newCandidate).getProblemNumber())
                            .title(candidateProblems.get(newCandidate).getTitle())
                            .level(candidateProblems.get(newCandidate).getLevel())
                            .classLevel(candidateProblems.get(newCandidate).getClassLevel())
                            .isSolved(false)
                            .build()
            );
        }
        return selectProblems;
    }

    private List<ProblemRecommendRes> getClassProblem(Long classLevel, User user) {
        List<Problem> candidateProblems = problemRepository.findAllByClassLevel(classLevel);
        return get3FromCandidate(candidateProblems, user.getId());
    }

    private List<ProblemRecommendRes> getRandomProblem(User user) {
        List<Problem> candidateProblems = problemRepository.findAllByLevelGreaterThanEqual(user.getLevel());
        if (candidateProblems.isEmpty()) {
            throw new NoSuchElementException(ExceptionUtil.PROBLEM_NOT_FOUND);
        } else if (candidateProblems.size() <= 3) {
            return candidateProblems.stream().map(
                    candidateProblem -> ProblemRecommendRes.builder()
                            .problemNumber(candidateProblem.getProblemNumber())
                            .title(candidateProblem.getTitle())
                            .level(candidateProblem.getLevel())
                            .classLevel(candidateProblem.getClassLevel())
                            .isSolved(false)
                            .build()
            ).collect(Collectors.toList());
        } else {
            return get3FromCandidate(candidateProblems, user.getId());
        }
    }
}
