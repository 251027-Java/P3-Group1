package com.example.React_spring_service.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameScoreDTO {
    private Long userId;
    private Long gameId;
    private Integer score;
    private Integer level;
}
