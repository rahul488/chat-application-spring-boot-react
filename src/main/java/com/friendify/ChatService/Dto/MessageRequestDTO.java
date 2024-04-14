package com.friendify.ChatService.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageRequestDTO {

    private String message;

    private int pageNumber;

    private Integer senderId;

    private Integer chatId;

    private List<Integer> recipientId;

}
