package com.mobileapp.exceptions;

public class EntityAlreadyExistsException extends RuntimeException {
    
    public EntityAlreadyExistsException(String message){
        super(message);
    }
}
