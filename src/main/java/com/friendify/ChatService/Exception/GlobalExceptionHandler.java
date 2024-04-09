package com.friendify.ChatService.Exception;

import com.friendify.ChatService.Dto.ErrorResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ErrorResponseDTO userNotFound(UserNotFoundException ex){
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO();
        errorResponseDTO.setMessage(ex.getMessage());
        errorResponseDTO.setStatusCode(HttpStatus.NOT_FOUND);
        errorResponseDTO.setSuccess(false);
        return errorResponseDTO;
    }

    @ExceptionHandler(CommonException.class)
    public ErrorResponseDTO commonException(CommonException ex){
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO();
        errorResponseDTO.setMessage(ex.getMessage());
        errorResponseDTO.setStatusCode(HttpStatus.NOT_FOUND);
        errorResponseDTO.setSuccess(false);
        return errorResponseDTO;
    }

    @ExceptionHandler(EmailAlreadyExistException.class)
    public ErrorResponseDTO emailAlreadyExist(EmailAlreadyExistException ex){
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO();
        errorResponseDTO.setMessage(ex.getMessage());
        errorResponseDTO.setStatusCode(HttpStatus.NOT_FOUND);
        errorResponseDTO.setSuccess(false);
        return errorResponseDTO;
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ErrorResponseDTO wrongPassword(InvalidCredentialsException ex){
        ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO();
        errorResponseDTO.setMessage(ex.getMessage());
        errorResponseDTO.setStatusCode(HttpStatus.NOT_FOUND);
        errorResponseDTO.setSuccess(false);
        return errorResponseDTO;
    }
}
