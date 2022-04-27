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

    public List<Problem> searchProblems(Long problemNumber){
        return problemRepository.findTop10ByProblemNumberStartingWithOrderByProblemNumberAsc(problemNumber);
    }

    public void refreshSolvedProblem(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND));
        int page = 1;
        HashSet<Long> solvedProblemList = new HashSet<>();

        try {
            while (true) {
                URL url = new URL("https://solved.ac/api/v3/search/problem?query=solved_by:" + user.getBojId() + "&page=" + page);
                HttpURLConnection httpURLConnection = (HttpURLConnection) url.openConnection();
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
                JSONObject jsonObject = (JSONObject) jsonParser.parse(response);
                long total_count = (long) jsonObject.get("count");
                List<JSONObject> jsonObjects = (List<JSONObject>) jsonObject.get("items");
                for (JSONObject j : jsonObjects) {
                    solvedProblemList.add((Long) j.get("problemId"));
                }

                if (1 + total_count / 100 <= page) {
                    httpURLConnection.disconnect();
                    break;
                }
                page ++;
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

}
