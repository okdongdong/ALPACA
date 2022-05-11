package com.ssafy.alpaca.db.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id", nullable = false)
    private Schedule schedule;

    @Column(name = "problem_number")
    private Long problemNumber;

}
