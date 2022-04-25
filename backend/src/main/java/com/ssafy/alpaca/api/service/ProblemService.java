package com.ssafy.alpaca.api.service;

import com.ssafy.alpaca.db.document.Problem;
import com.ssafy.alpaca.db.repository.ProblemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProblemService {

    private final ProblemRepository problemRepository;

    public List<Problem> searchProblems(String searchWord){
        return problemRepository.findTop10ByNumberStartingWithOrderByNumberAsc(searchWord);
    }

}
