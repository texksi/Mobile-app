package com.mobileapp.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KartaResponseDTO {

    private Long id;
    private String brojSedista;
    private double osnovnaCena;
    private LocalDateTime datumIzdavanja;
    private String tip;
    private Long rezervacijaId;
    private Long putovanjeId;

}