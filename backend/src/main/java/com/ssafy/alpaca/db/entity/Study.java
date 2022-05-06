package com.ssafy.alpaca.db.entity;

import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;


@Entity
@Table(name = "study")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Study {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 50)
    private String title;

    @NotBlank
    @Size(max = 500)
    private String info;

    @Column(name = "session_id")
    private String sessionId;

}
