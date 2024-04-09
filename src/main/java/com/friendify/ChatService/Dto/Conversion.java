package com.friendify.ChatService.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Conversion {

    private int senderId;

    private Integer chatId;

    private List<Integer> recipientsId;
}
