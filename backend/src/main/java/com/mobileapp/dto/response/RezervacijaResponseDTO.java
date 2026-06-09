package com.mobileapp.dto.response;

import com.mobileapp.model.enums.NacinPlacanja;
import com.mobileapp.model.enums.StatusRezervacije;
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
    private NacinPlacanja nacinPlacanja;
    private StatusRezervacije status;
    private Long korisnikId;

}