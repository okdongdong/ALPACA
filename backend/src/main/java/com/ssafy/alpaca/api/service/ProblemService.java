package com.ssafy.alpaca.api.service;

import com.ssafy.alpaca.common.util.ExceptionUtil;
import com.ssafy.alpaca.db.document.Problem;
import com.ssafy.alpaca.db.entity.User;
import com.ssafy.alpaca.db.repository.ProblemRepository;
import com.ssafy.alpaca.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.bson.json.JsonObject;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.boot.json.JsonParser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import springfox.documentation.spring.web.json.Json;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Transactional
public class ProblemService {

    private final UserRepository userRepository;
    private final ProblemRepository problemRepository;

    public List<Problem> searchProblems(Integer searchWord){
        return problemRepository.findTop10ByNumberStartingWithOrderByNumberAsc(searchWord);
    }

    public void refreshSolvedProblem(String username, String bojId) {
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND));
        if (Boolean.TRUE.equals(!user.getBojId().equals(bojId))) {
            throw new IllegalArgumentException(ExceptionUtil.UNAUTHORIZED_USER);
        }
        int page = 1;

        try {
            while (true) {
                System.out.println(page);
                URL url = new URL("https://solved.ac/api/v3/search/problem?query=solved_by:" + bojId + "&page=" + page);
                HttpURLConnection httpURLConnection = (HttpURLConnection) url.openConnection();
                httpURLConnection.setRequestMethod("GET");
                httpURLConnection.setDoOutput(true);

                BufferedReader bufferedReader = new BufferedReader(
                        new InputStreamReader(httpURLConnection.getInputStream())
                );

                StringBuffer stringBuffer = new StringBuffer();
                String inputLine;

                while ((inputLine = bufferedReader.readLine()) != null) {
                    stringBuffer.append(inputLine);
                }
                bufferedReader.close();
                String response = stringBuffer.toString();

                JSONParser jsonParser = new JSONParser();

                System.out.println(response);

                JSONObject jsonObject = (JSONObject) jsonParser.parse(response);

                System.out.println(jsonObject.get("count"));
                long total_count = (long) jsonObject.get("count");
                List<JSONObject> jsonObjects = (List<JSONObject>) jsonObject.get("items");
                System.out.println(jsonObjects.size());
//                for (JSONObject j : jsonObjects) {
//                    System.out.println(j.get("problemId"));
//                    System.out.println(j.get("problemId").getClass().getName());
//                }

                if (1 + total_count / 100 <= page) {
                    break;
                }
                page ++;
            }
        } catch (IOException | ParseException e) {
            e.printStackTrace();
        }
    }

}
