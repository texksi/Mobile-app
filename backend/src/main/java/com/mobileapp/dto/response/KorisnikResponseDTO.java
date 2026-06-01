package com.mobileapp.dto.response;

import com.mobileapp.model.enums.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KorisnikResponseDTO {

    private Long id;
    private String ime;
    private String prezime;
    private String email;
    private String username;
    private Role role;

}
