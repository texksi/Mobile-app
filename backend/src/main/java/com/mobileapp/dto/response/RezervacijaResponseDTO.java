package com.mobileapp.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RezervacijaResponseDTO {

    private Long id;
    private LocalDateTime datumKreiranja;
    private double ukupanIznos;
    private String nacinPlacanja;
    private String status;
    private Long korisnikId;

}