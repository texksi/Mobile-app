package com.mobileapp.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KompanijaRequestDTO {

    private String naziv;
    private String kontakt;

}