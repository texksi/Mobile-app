package com.mobileapp.dto.request;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PutovanjeRequestDTO {

    private String polaziste;
    private String odrediste;
    private LocalDateTime vremePolaska;
    private LocalDateTime vremeDolaska;
    private double osnovnaCena;
    private Long kompanijaId;

}