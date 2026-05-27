package com.mobileapp.dto.request;

import com.mobileapp.model.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KorisnikRequestDTO {

    private String ime;
    private String prezime;
    private String email;
    private String username;
    private String password;
    private Role role;
    
}