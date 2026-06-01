package com.mobileapp.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KompanijaRequestDTO {

    @NotBlank
    private String naziv;
    @NotBlank
    private String kontakt;

}