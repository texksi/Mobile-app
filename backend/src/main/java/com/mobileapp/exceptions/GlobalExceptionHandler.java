package com.mobileapp.exceptions;

import com.mobileapp.dto.response.ErrorResponseDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

     private ErrorResponseDTO builderErrorResponse(String message, String errorCode,
                                                 int statusCode, LocalDateTime timestamp) {
        return ErrorResponseDTO.builder()
                .message(message)
                .errorCode(errorCode)
                .statusCode(statusCode)
                .timestamp(timestamp)
                .build();
    }
    
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleNotFoundExistsException(EntityNotFoundException ex){
        ErrorResponseDTO error = builderErrorResponse(ex.getMessage(), "ERR_ENTITY_NOT_FOUND",
                HttpStatus.NOT_FOUND.value(), LocalDateTime.now());
        log.error("EntityNotFoundException {}", ex, ex.getCause());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(EntityAlreadyExistsException.class)
    public ResponseEntity<ErrorResponseDTO> handleEntityAlreadyExistsException(EntityAlreadyExistsException ex){
        ErrorResponseDTO error = builderErrorResponse(ex.getMessage(), "ERR_ENTITY_EXISTS",
                HttpStatus.CONFLICT.value(), LocalDateTime.now());
        log.error("EntityAlreadyExistsException {}", ex, ex.getCause());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponseDTO> handleInvalidCredentialsException(InvalidCredentialsException ex){
        ErrorResponseDTO error = builderErrorResponse(ex.getMessage(), "ERR_INVALID_CREDENTIALS",
                HttpStatus.UNAUTHORIZED.value(), LocalDateTime.now());
        log.error("InvalidCredentialsException {}", ex, ex.getCause());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDTO> handleMethodArgumentNotValidException
            (MethodArgumentNotValidException ex){
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .collect(Collectors.joining(", "));
        ErrorResponseDTO error = builderErrorResponse(message, "ERR_NOT_VALID_ARGS",
                HttpStatus.BAD_REQUEST.value(), LocalDateTime.now());
        log.error("MethodArgumentNotValidException {}", ex, ex.getCause());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponseDTO> handleRuntimeException(RuntimeException runtimeException){
        ErrorResponseDTO error = builderErrorResponse("Internal server error", "ERR_INTERNAL",
                HttpStatus.INTERNAL_SERVER_ERROR.value(), LocalDateTime.now());
        log.error("RuntimeException {}", runtimeException, runtimeException.getCause());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
