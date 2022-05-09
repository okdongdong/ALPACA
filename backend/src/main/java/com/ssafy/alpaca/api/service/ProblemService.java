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
import java.net.MalformedURLException;
import java.net.ProtocolException;
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
        Long classLevel = user.getClassLevel();
        List<Problem> recommendList = new ArrayList<>();
        if (classLevel < 10) {
            return comparedProblem(classLevel+1,user,recommendList);
        } else {
            return comparedProblem(classLevel,user,recommendList);
        }
    }

    private List<Problem> comparedProblem(Long classLevel,User user,List<Problem> recommendList){
        List<Long> solvedProblemNumberList = solvedProblemRepository.findProblemNumbersByUser(user.getId());
        List<Problem> problemList = problemRepository.findAllByClassLevel(classLevel);
        Collections.shuffle(problemList);
        for (Problem problem : problemList) {
            if (!solvedProblemNumberList.contains(problem.getProblemNumber())) {
                recommendList.add(problem);
                if (recommendList.size() == 3) {
                    break;
                }
            }
        }
        if (recommendList.size() < 3) {
            classLevel -=1;
            if (classLevel==0){
                List<Problem> unclassList =problemRepository.findAllByClassLevel(null);
                Collections.shuffle(unclassList);
                for (Problem problem : unclassList) {
                    if (!solvedProblemNumberList.contains(problem.getProblemNumber())) {
                        recommendList.add(problem);
                        if (recommendList.size() == 3) {
                            break;
                        }
                    }
                }
            }
            return comparedProblem(classLevel,user,recommendList);
        }
        return recommendList;
    }
}
