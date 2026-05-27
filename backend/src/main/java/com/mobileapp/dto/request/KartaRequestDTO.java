package com.mobileapp.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KartaRequestDTO {

    private String brojSedista;
    private double osnovnaCena;
    private String tip;
    private Long rezervacijaId;
    private Long putovanjeId;
    
}
