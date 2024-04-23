package com.friendify.ChatService.Dto;

import com.friendify.ChatService.Entity.Messages;
import com.friendify.ChatService.Entity.Notification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {

    private int id;

    private Integer chatId;

    private String name;

    private Messages lastMessage;

    private MessageNotificationResponse notificationResponse;
}
