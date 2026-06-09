package com.mobileapp.dto.request;

import com.mobileapp.model.enums.NacinPlacanja;
import com.mobileapp.model.enums.StatusRezervacije;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RezervacijaRequestDTO {

    @NotNull
    private NacinPlacanja nacinPlacanja;
    @NotNull
    private StatusRezervacije status;
    @Positive
    private double ukupanIznos;
    @NotNull
    private Long korisnikId;
    
}