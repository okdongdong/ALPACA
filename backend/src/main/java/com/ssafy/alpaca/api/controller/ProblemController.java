package com.ssafy.alpaca.api.controller;

import com.ssafy.alpaca.api.service.ProblemService;
import com.ssafy.alpaca.api.service.UserService;
import com.ssafy.alpaca.common.etc.BaseResponseBody;
import com.ssafy.alpaca.db.document.Problem;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/problem")
@RequiredArgsConstructor
public class ProblemController {

    private final UserService userService;
    private final ProblemService problemService;

    @ApiOperation(
            value = "문제 검색",
            notes = "데이터베이스에 등록된 문제를 검색한다."
    )
    @ApiImplicitParam( name = "problemNumber", value = "검색할 문제 번호", dataTypeClass = Long.class )
    @GetMapping()
    public ResponseEntity<List<Problem>> searchProblems(@RequestParam Long problemNumber) {
        return ResponseEntity.ok(problemService.searchProblems(problemNumber));
    }

    @ApiOperation(
            value = "백준에서 푼 문제 갱신",
            notes = "백준에서 푼 문제를 ALPACA DB에 연동한다."
    )
    @PostMapping()
    public ResponseEntity<BaseResponseBody> refreshSolvedProblem() {
        String username = userService.getCurrentUsername();
        problemService.refreshSolvedProblem(username);
        return ResponseEntity.ok(BaseResponseBody.of(200, "OK"));
    }
}
