package com.friendify.ChatService.Dto;

import com.friendify.ChatService.Entity.Messages;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {

    private int id;

    private String name;

    private Messages lastMessage;
}
