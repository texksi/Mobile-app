package com.mobileapp.dto.request;

import com.mobileapp.model.enums.Role;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KorisnikRequestDTO {

    @NotBlank
    private String ime;
    @NotBlank
    private String prezime;
    @NotBlank
    private String email;
    @NotBlank
    private String username;
    private String password;
    private Role role;
    
}