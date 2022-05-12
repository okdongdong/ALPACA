package com.ssafy.alpaca.api.controller;

import com.ssafy.alpaca.api.response.ProblemRecommendRes;
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
            value = "문제 조회",
            notes = "문제 번호를 통해 문제 정보를 조회한다."
    )
    @ApiImplicitParam( name = "problemNumber", value = "조회할 문제 번호", dataTypeClass = Long.class)
    @GetMapping("/{problemNumber}")
    public ResponseEntity<Problem> getProblem(@PathVariable Long problemNumber) {
        return ResponseEntity.ok(problemService.getProblem(problemNumber));
    }

    @ApiOperation(
            value = "solved.ac 정보 갱신",
            notes = "class정보와 백준에서 푼 문제를 ALPACA DB에 연동한다."
    )
    @PostMapping()
    public ResponseEntity<BaseResponseBody> refreshSolvedProblem() {
        String username = userService.getCurrentUsername();
        problemService.refreshSolvedAc(username);
        return ResponseEntity.ok(BaseResponseBody.of(200, "OK"));
    }

    @ApiOperation(
            value = "문제 추천",
            notes = "자신의 class정보에 맞는 문제 3개를 추천받는다."
    )
    @GetMapping("/recommend")
    public ResponseEntity<List<ProblemRecommendRes>> recommendProblem(){
        String username = userService.getCurrentUsername();
        return ResponseEntity.ok(problemService.recommendProblem(username));
    }
}
