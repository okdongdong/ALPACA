package com.ssafy.alpaca.db.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "solved_problem")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SolvedProblem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "problem_number")
    private Long problemNumber;

}
