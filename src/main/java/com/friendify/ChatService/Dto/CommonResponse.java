package com.friendify.ChatService.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommonResponse<T> {

    private String message;

    private boolean status;

    private T data;
}
