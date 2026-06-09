package com.mobileapp.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ErrorResponseDTO {
    
    private String message;
    private int statusCode;
    private String errorCode;
    private LocalDateTime timestamp;

}
