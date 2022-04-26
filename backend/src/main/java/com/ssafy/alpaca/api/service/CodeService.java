package com.ssafy.alpaca.api.service;

import com.ssafy.alpaca.api.request.CodeReq;
import com.ssafy.alpaca.api.request.CodeCompileReq;
import com.ssafy.alpaca.common.util.ExceptionUtil;
import com.ssafy.alpaca.db.document.Code;
import com.ssafy.alpaca.api.response.CodeSaveRes;
import com.ssafy.alpaca.db.document.Problem;
import com.ssafy.alpaca.db.entity.Schedule;
import com.ssafy.alpaca.db.entity.User;
import com.ssafy.alpaca.db.repository.CodeRepository;
import com.ssafy.alpaca.db.repository.ProblemRepository;
import com.ssafy.alpaca.db.repository.ScheduleRepository;
import com.ssafy.alpaca.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional
public class CodeService {

    private final UserRepository userRepository;
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

    public CodeSaveRes compileCode(String username, CodeCompileReq codeCompileReq) throws IllegalAccessException {
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND)
        );

        Problem problem = problemRepository.findById(codeCompileReq.getProblemId()).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.PROBLEM_NOT_FOUND));

        if (codeCompileReq.getCode().isEmpty()){
            throw new IllegalAccessException(ExceptionUtil.NOT_VALID_VALUE);
        }

        return doodleCompile(codeCompileReq.getCode(), codeCompileReq.getLanguage(),
                compileVersion(codeCompileReq.getLanguage()), problem.getInputs(),problem.getOutputs());
    }

    public void createCode(String username, CodeReq codeReq) {
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new NoSuchElementException(ExceptionUtil.USER_NOT_FOUND)
        );

        if (Boolean.TRUE.equals(!problemRepository.existsById(codeReq.getProblemId()))) {
            throw new NoSuchElementException(ExceptionUtil.PROBLEM_NOT_FOUND);
        }

        List<Code> codes = codeRepository.findAllByUserIdAndProblemIdOrderBySubmittedAtDesc(user.getId(), codeReq.getProblemId());
        if (10 <= codes.size()) {
            codeRepository.delete(codes.get(codes.size()-1));
        }

        codeRepository.save(Code.builder()
                        .userId(user.getId())
                        .problemId(codeReq.getProblemId())
                        .submittedCode(codeReq.getCode())
                        .build());
    }

    public List<Code> getCode(String username, Long id, String problemId) {
        // 같은 스터디원인지 확인하는 검증코드 필요할 것 같음
        return codeRepository.findAllByUserIdAndProblemIdOrderBySubmittedAtDesc(id, problemId);
    }

    public CodeSaveRes doodleCompile(String script, String language ,String versionIndex ,List<String> stdinList,List<String> answerList) {
        String clientId = "30bab460a38fc3db6e63aefa34335ae1"; //Replace with your client ID
        String clientSecret = "5390f6559f24a6e97eed02b2b69694e6272337c7c244ad636d9632ee9ca03d48"; //Replace with your client Secret
        List<String> outputList = new ArrayList<>();
        for (String stdin:stdinList){
            stdin = stdin.substring(2,stdin.length()-2);
            System.out.println(stdin);
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
                while ((output = bufferedReader.readLine()) != null) {
                    System.out.println(output);
                    outputList.add(output.substring(11,output.indexOf(",")+4));
                }

                connection.disconnect();
            } catch (MalformedURLException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return CodeSaveRes.builder()
                .outputList(outputList)
                .answerList(answerList)
                .build();
    };

}
