package com.ssafy.alpaca.db.entity;

import lombok.*;

import javax.persistence.*;


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

    private String title;

    private String info;

    @Column(name = "invite_code")
    private String inviteCode;

    @Column(name = "session_id")
    private String sessionId;

}
