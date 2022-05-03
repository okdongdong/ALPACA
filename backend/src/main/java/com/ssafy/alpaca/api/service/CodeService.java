package com.ssafy.alpaca.api.service;

import com.ssafy.alpaca.api.request.CodeCompileWithInputReq;
import com.ssafy.alpaca.api.request.CodeReq;
import com.ssafy.alpaca.api.request.CodeCompileReq;
import com.ssafy.alpaca.common.util.ExceptionUtil;
import com.ssafy.alpaca.db.document.Code;
import com.ssafy.alpaca.api.response.CodeCompileRes;
import com.ssafy.alpaca.db.document.Problem;
import com.ssafy.alpaca.db.entity.MyStudy;
import com.ssafy.alpaca.db.entity.Study;
import com.ssafy.alpaca.db.entity.User;
import com.ssafy.alpaca.db.repository.*;
import lombok.RequiredArgsConstructor;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional
public class CodeService {

    private final UserRepository userRepository;
    private final MyStudyRepository myStudyRepository;
    private final StudyRepository studyRepository;
    private final CodeRepository codeRepository;
    private final ProblemRepository problemRepository;

    private String compileVersion(String language) {
        switch (language) {
            case "python3": return "4";
            case "java": return "3";
            case "cpp":
            case "c":
                return "5";
            default: throw new NoSuchElementException(ExceptionUtil.LANGUAGE_NOT_FOUND);
        }
    }

    public CodeCompileRes compileCode(String username, CodeCompileWithInputReq codeCompileWithInputReq) {
        if (Boolean.TRUE.equals(!userRepository.existsByUsername(username))) {
            throw new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND);
        }

        return doodleCompile(codeCompileWithInputReq.getCode(), codeCompileWithInputReq.getLanguage(),
                compileVersion(codeCompileWithInputReq.getLanguage()), codeCompileWithInputReq.getInput());
    }

    public List<CodeCompileRes> compileBojCode(String username, CodeCompileReq codeCompileReq) {
        if (Boolean.TRUE.equals(!userRepository.existsByUsername(username))) {
            throw new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND);
        }

        Problem problem = problemRepository.findByProblemNumber(codeCompileReq.getProblemNumber()).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.PROBLEM_NOT_FOUND));

        if (codeCompileReq.getCode().isEmpty()){
            throw new IllegalArgumentException(ExceptionUtil.NOT_VALID_VALUE);
        }


        List<CodeCompileRes> codeCompileResList = new ArrayList<>();
        CodeCompileRes codeCompileRes;
        for (int i=0; i<problem.getInputs().size(); i++) {
            codeCompileRes = doodleCompile(codeCompileReq.getCode(), codeCompileReq.getLanguage(),
                    compileVersion(codeCompileReq.getLanguage()), problem.getInputs().get(i));
            // 컴파일 실패할 경우 continue 해주는 조건문 필요
            codeCompileRes.setAnswer(problem.getOutputs().get(i));
            codeCompileRes.setIsCorrect(Boolean.TRUE.equals(problem.getOutputs().get(i).equals(codeCompileRes.getOutput())));
            codeCompileResList.add(codeCompileRes);
        }

        return codeCompileResList;
    }

    public void createCode(String username, CodeReq codeReq) {
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND)
        );

        if (Boolean.TRUE.equals(!problemRepository.existsByProblemNumber(codeReq.getProblemNumber()))) {
            throw new NoSuchElementException(ExceptionUtil.PROBLEM_NOT_FOUND);
        }

        List<Code> codes = codeRepository.findAllByUserIdAndProblemNumberOrderBySubmittedAtDesc(user.getId(), codeReq.getProblemNumber());
        if (10 <= codes.size()) {
            codeRepository.delete(codes.get(codes.size()-1));
        }

        codeRepository.save(Code.builder()
                        .userId(user.getId())
                        .problemNumber(codeReq.getProblemNumber())
                        .submittedCode(codeReq.getCode())
                        .language(codeReq.getLanguage())
                        .build());
    }

    public List<Code> getCode(String username, Long studyId, Long userId, Long problemNumber) {
        // 같은 스터디원인지 확인하는 검증코드 필요할 것 같음
        Study study = studyRepository.findById(studyId).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.STUDY_NOT_FOUND)
        );
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND)
        );
        User member = userRepository.findById(userId).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND)
        );
        List<MyStudy> myStudies = myStudyRepository.findAllByStudy(study);

        boolean flagA = false, flagB = false;
        for (MyStudy myStudy : myStudies) {
            if (myStudy.getUser().getId().equals(userId)) {
                flagA = true;
            }
            if (myStudy.getUser().getId().equals(user.getId())) {
                flagB = true;
            }
        }

        if (flagA && flagB) return codeRepository.findAllByUserIdAndProblemNumberOrderBySubmittedAtDesc(userId, problemNumber);

        throw new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND_IN_STUDY);
    }

    public CodeCompileRes doodleCompile(String script, String language ,String versionIndex, String stdin) {
        String clientId = "30bab460a38fc3db6e63aefa34335ae1"; //Replace with your client ID
        String clientSecret = "5390f6559f24a6e97eed02b2b69694e6272337c7c244ad636d9632ee9ca03d48"; //Replace with your client Secret
        try {
            URL url = new URL("https://api.jdoodle.com/v1/execute");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setDoOutput(true);
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");

            String input = "{\"clientId\": \"" + clientId +
                    "\",\"clientSecret\":\"" + clientSecret +
                    "\",\"script\":\"" + script +
                    "\",\"stdin\":\"" + stdin +
                    "\",\"language\":\"" + language +
                    "\",\"versionIndex\":\"" + versionIndex +
                    "\"} ";

            System.out.println(script);
            System.out.println(stdin);
            System.out.println(language);
            System.out.println(versionIndex);

            OutputStream outputStream = connection.getOutputStream();
            outputStream.write(input.getBytes());
            outputStream.flush();

            if (connection.getResponseCode() != HttpURLConnection.HTTP_OK) {
                throw new RuntimeException("Please check your inputs : HTTP error code : "+ connection.getResponseCode());
            }

            BufferedReader bufferedReader;
            bufferedReader = new BufferedReader(new InputStreamReader(
                    (connection.getInputStream())));

            String output;
            StringBuilder result = new StringBuilder();
            while ((output = bufferedReader.readLine()) != null) {
//                System.out.println(output);
//                outputList.add(output.substring(11,output.indexOf(",")+4));
                result.append(output);
            }

            connection.disconnect();

            JSONParser jsonParser = new JSONParser();
            JSONObject jsonObject = (JSONObject) jsonParser.parse(result.toString());

            System.out.println(result);

            return CodeCompileRes.builder()
                    .result((Long) jsonObject.get("statusCode"))
                    .output(jsonObject.get("output").toString())
                    .memory(jsonObject.get("memory").toString())
                    .runtime(jsonObject.get("cpuTime").toString())
                            .build();
        } catch (IOException | ParseException e) {
            e.printStackTrace();
        }
//        for (String stdin:stdinList){
//        }
//        return CodeSaveRes.builder()
//                .outputList(outputList)
//                .answerList(answerList)
//                .build();
        return null;
    }

}
