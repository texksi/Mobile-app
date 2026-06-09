package com.mobileapp.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PutovanjeRequestDTO {

    @NotBlank
    private String polaziste;
    @NotBlank
    private String odrediste;
    @NotNull
    private LocalDateTime vremePolaska;
    @NotNull
    private LocalDateTime vremeDolaska;
    @Positive
    private double osnovnaCena;
    @NotNull
    private Long kompanijaId;

}