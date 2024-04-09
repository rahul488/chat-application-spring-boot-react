package com.friendify.ChatService.Dto;

import com.friendify.ChatService.Entity.Messages;
import com.friendify.ChatService.Entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageResponseDTO {

    private String message;

    private User sender;

    private List<Messages> messages;
}
