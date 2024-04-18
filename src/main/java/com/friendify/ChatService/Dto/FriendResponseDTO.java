package com.friendify.ChatService.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FriendResponseDTO {

    private int id;

    private String name;

    private boolean isFriend=false;
}
