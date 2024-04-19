package com.friendify.ChatService.Dto;


import com.friendify.ChatService.Entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SelectedChatResponse {

    private int id;

    private Set<User> users = new HashSet<>();

    private String groupName;
}
