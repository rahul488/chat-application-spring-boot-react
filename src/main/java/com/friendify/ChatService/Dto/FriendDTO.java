package com.friendify.ChatService.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** TODO:- will remove once security configure done for websocket **/

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FriendDTO {

    private int userId;

    private int friendId;

    private int pageNumber=0;
}
