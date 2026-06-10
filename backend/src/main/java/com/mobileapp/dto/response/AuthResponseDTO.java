package com.mobileapp.dto.response;

import com.mobileapp.model.enums.Role;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponseDTO {

    private String token;
}
