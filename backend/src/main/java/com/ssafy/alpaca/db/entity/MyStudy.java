package com.ssafy.alpaca.db.entity;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "my_study")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MyStudy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "is_room_maker")
    private Boolean isRoomMaker;

    @Builder.Default
    @Column(name = "pinned_time")
    private LocalDateTime pinnedTime = LocalDateTime.of(1, 1, 1, 6, 0);

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "study_id", nullable = false)
    private Study study;

}
