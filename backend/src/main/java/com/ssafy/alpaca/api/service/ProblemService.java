package com.ssafy.alpaca.api.service;

import com.ssafy.alpaca.common.util.ExceptionUtil;
import com.ssafy.alpaca.db.document.Problem;
import com.ssafy.alpaca.db.entity.SolvedProblem;
import com.ssafy.alpaca.db.entity.User;
import com.ssafy.alpaca.db.repository.ProblemRepository;
import com.ssafy.alpaca.db.repository.SolvedProblemRepository;
import com.ssafy.alpaca.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class ProblemService {

    private final UserRepository userRepository;
    private final ProblemRepository problemRepository;
    private final SolvedProblemRepository solvedProblemRepository;

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
            userRepository.save(user);
        } catch (IOException | ParseException e) {
            e.printStackTrace();
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
                long total_count = (long) jsonObject.get("count");
                List<JSONObject> jsonObjects = (List<JSONObject>) jsonObject.get("items");
                for (JSONObject j : jsonObjects) {
                    solvedProblemList.add((Long) j.get("problemId"));
                }

                if (1 + total_count / 100 <= page) {
                    httpURLConnection.disconnect();
                    break;
                }
                page++;
            }
        } catch (IOException | ParseException e) {
            e.printStackTrace();
        }

        List<SolvedProblem> solvedProblems = solvedProblemRepository.findAllByUser(user);
        for (SolvedProblem solvedProblem : solvedProblems) {
            solvedProblemList.remove(solvedProblem.getProblemNumber());
        }

        List<SolvedProblem> newSolvedProblem = new ArrayList<>();
        for (Long solvedProblem : solvedProblemList) {
            Optional<Problem> problem = problemRepository.findByProblemNumber(solvedProblem);
            if (problem.isEmpty()) {
                continue;
            }
            newSolvedProblem.add(
                    SolvedProblem.builder()
                            .problemNumber(solvedProblem)
                            .user(user)
                            .build()
            );
        }
        solvedProblemRepository.saveAll(newSolvedProblem);
    }

    public List<Problem> recommendProblem(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND));

        if (user.getClassDecoration().equals("gold")) {
            if (user.getClassLevel() < 10) {
                return selectClassProblem(user.getClassLevel()+1, user);
            } else {
                return selectRandomProblem(user);
            }
        } else {
            return selectClassProblem(user.getClassLevel(), user);
        }
    }

    private List<Problem> selectClassProblem(Long classLevel, User user) {
        List<Problem> selectProblems = new ArrayList<>();
        HashSet<Long> solvedProblems = solvedProblemRepository.findProblemNumbersByUserId(user.getId());
        List<Problem> candidateProblems = problemRepository.findAllByClassLevel(classLevel);
        HashSet<Integer> selectIndex = new HashSet<>();

        Random random = new Random();
        while (selectProblems.size() < 3) {
            Integer newCandidate = random.nextInt(candidateProblems.size());
            if (selectIndex.contains(newCandidate)) {
                continue;
            }
            selectIndex.add(newCandidate);
            if (solvedProblems.contains((long) newCandidate)) {
                continue;
            }

            selectProblems.add(candidateProblems.get(newCandidate));
        }
        return selectProblems;
    }

    private List<Problem> selectRandomProblem(User user) {
        List<Problem> candidateProblems = problemRepository.findAllByLevelGreaterThanEqual(user.getLevel());
        if (candidateProblems.size() == 0) {
            throw new NoSuchElementException(ExceptionUtil.PROBLEM_NOT_FOUND);
        } else if (candidateProblems.size() <= 3) {
            return candidateProblems;
        } else {
            HashSet<Long> solvedProblems = solvedProblemRepository.findProblemNumbersByUserId(user.getId());
            HashSet<Integer> selectIndex = new HashSet<>();
            Random random = new Random();

            List<Problem> selectRandomProblems = new ArrayList<>();
            while (selectRandomProblems.size() < 3) {
                Integer newCandidate = random.nextInt(candidateProblems.size());
                if (selectIndex.contains(newCandidate)) {
                    continue;
                }
                selectIndex.add(newCandidate);
                if (solvedProblems.contains((long) newCandidate)) {
                    continue;
                }

                selectRandomProblems.add(candidateProblems.get(newCandidate));
            }
            return selectRandomProblems;
        }
    }
}
