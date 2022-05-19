package com.ssafy.alpaca.api.service;

import com.ssafy.alpaca.api.response.ProblemRecommendRes;
import com.ssafy.alpaca.api.response.ProblemRes;
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

    public List<ProblemRes> searchProblems(User user, Long problemNumber) {
        HashSet<Long> solvedProblems = solvedProblemRepository.findProblemNumbersByUserId(user.getId());
        List<Problem> problems = problemRepository.findTop10ByProblemNumberStartingWithOrderByProblemNumberAsc(problemNumber);
        return problems.stream().map(
                problem -> ProblemRes.builder()
                        .problemNumber(problem.getProblemNumber())
                        .title(problem.getTitle())
                        .level(problem.getLevel())
                        .classLevel(problem.getClassLevel())
                        .isSolved(solvedProblems.contains(problem.getProblemNumber()))
                        .build())
                .collect(Collectors.toList());
    }

    public ProblemRes getProblem(User user, Long problemNumber) {
        Problem problem = problemRepository.findByProblemNumber(problemNumber).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.PROBLEM_NOT_FOUND)
        );

        return ProblemRes.builder()
                .problemNumber(problemNumber)
                .title(problem.getTitle())
                .level(problem.getLevel())
                .classLevel(problem.getClassLevel())
                .inputs(problem.getInputs())
                .outputs(problem.getOutputs())
                .isSolved(solvedProblemRepository.existsByUserAndProblemNumber(user, problemNumber))
                .build();
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
            httpURLConnection.disconnect();
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
                httpURLConnection.disconnect();
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
            newSolvedProblem.add(
                    SolvedProblem.builder()
                            .problemNumber(solvedProblem)
                            .user(user)
                            .build()
            );
        }
        solvedProblemRepository.saveAll(newSolvedProblem);
    }

    public List<ProblemRecommendRes> recommendProblem(User user) {
        Optional<TodayProblem> todayProblem = todayProblemRepository.findByUserId(user.getId());
        if (todayProblem.isPresent() && todayProblem.get().getDate().isEqual(LocalDate.now())) {
            return todayProblem.get().getProblemRecommendRes();
        } else {
            Long nowClassLevel;
            List<ProblemRecommendRes> problemRecommendRes = new ArrayList<>();
            if (user.getClassDecoration().equals("gold")) {
                if (user.getClassLevel() < 10) {
                    nowClassLevel = user.getClassLevel()+1;
                } else {
                    nowClassLevel = 11L;
                }
            } else if (0 < user.getClassLevel()) {
                if (user.getClassLevel() < user.getLevel()/3) {
                    nowClassLevel = user.getLevel()/3;
                } else {
                    nowClassLevel = user.getClassLevel();
                }
            } else {
                if (1L < user.getLevel()/3) {
                    nowClassLevel = user.getLevel()/3;
                } else {
                    nowClassLevel = 1L;
                }
            }
            HashSet<Long> solvedProblems = solvedProblemRepository.findProblemNumbersByUserId(user.getId());
            while (problemRecommendRes.size() < 3) {
                if (10 < nowClassLevel) {
                    break;
                } else {
                    problemRecommendRes.addAll(getClassProblem(nowClassLevel, user, solvedProblems, 3- problemRecommendRes.size()));
                    nowClassLevel ++;
                }
            }
            if (problemRecommendRes.size() < 3) {
                problemRecommendRes.addAll((getRandomProblem(user.getLevel()*2/3, solvedProblems, 3- problemRecommendRes.size())));
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

    private List<ProblemRecommendRes> getNFromCandidate(List<Problem> candidateProblems, HashSet<Long> solvedProblems,int needProblemCnt) {
        List<ProblemRecommendRes> selectProblems = new ArrayList<>();
        HashSet<Integer> selectIndex = new HashSet<>();
        Random random = new Random();
        int newCandidate;

        if (candidateProblems.size() <= needProblemCnt) {
            return candidateProblems.stream().map(
                    candidateProblem -> ProblemRecommendRes.builder()
                            .problemNumber(candidateProblem.getProblemNumber())
                            .title(candidateProblem.getTitle())
                            .level(candidateProblem.getLevel())
                            .classLevel(candidateProblem.getClassLevel())
                            .isSolved(solvedProblems.contains(candidateProblem.getProblemNumber()))
                            .build()
            ).collect(Collectors.toList());
        }

        while (selectProblems.size() < needProblemCnt) {
            newCandidate = random.nextInt(candidateProblems.size());
            if (selectIndex.contains(newCandidate)) {
                continue;
            }
            selectIndex.add(newCandidate);
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

    private List<ProblemRecommendRes> getClassProblem(Long classLevel, User user, HashSet<Long> solvedProblems, int needProblemCnt) {
        List<Problem> candidateProblems = problemRepository.findAllByClassLevelAndProblemNumberNotIn(classLevel, solvedProblems);
        return getNFromCandidate(candidateProblems, solvedProblems, needProblemCnt);
    }

    private List<ProblemRecommendRes> getRandomProblem(Long classLevel, HashSet<Long> solvedProblems, int needProblemCnt) {
        List<Problem> candidateProblems = problemRepository.findAllByLevelGreaterThanEqualAndProblemNumberNotIn(classLevel, solvedProblems);
        return getNFromCandidate(candidateProblems, solvedProblems, needProblemCnt);
    }
}
