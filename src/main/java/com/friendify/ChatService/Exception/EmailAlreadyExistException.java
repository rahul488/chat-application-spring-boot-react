package com.friendify.ChatService.Exception;

public class EmailAlreadyExistException extends RuntimeException{

    public EmailAlreadyExistException(String message){
        super(message);
    }
}
