package com.ssafy.alpaca.db.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "to_solve_problem")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ToSolveProblem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id", nullable = false)
    private Schedule schedule;

    @Column(name = "problem_id")
    private String problemId;
}
