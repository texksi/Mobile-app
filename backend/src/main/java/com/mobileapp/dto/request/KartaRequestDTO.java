package com.mobileapp.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KartaRequestDTO {

    @NotBlank
    private String brojSedista;
    @Positive
    private double osnovnaCena;
    @NotBlank
    private String tip;
    @NotNull
    private Long rezervacijaId;
    @NotNull
    private Long putovanjeId;
    
}
