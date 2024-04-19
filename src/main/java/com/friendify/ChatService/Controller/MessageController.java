package com.friendify.ChatService.Controller;

import com.friendify.ChatService.Dto.FriendDTO;
import com.friendify.ChatService.Dto.Conversion;
import com.friendify.ChatService.Dto.MessageRequestDTO;
import com.friendify.ChatService.Repo.UserRepo;
import com.friendify.ChatService.Service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MessageController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private UserRepo userRepo;

    //send message
    @MessageMapping("/message/send")
    public void getContent(MessageRequestDTO message){
        messageService.sendMessage(message);
    }

    //get all users
    @MessageMapping("/users")
    public void getUser(@RequestBody FriendDTO friendDTO){
        messageService.getAllUsers(friendDTO);
    }

    //start chat
    @MessageMapping("/user/chat")
    public void createChat(@RequestBody Conversion conversion){
        messageService.startConversion(conversion);
    }

    @MessageMapping("/user/messages")
    public void getAllMessages(@RequestBody MessageRequestDTO messageRequestDTO){
        messageService.getAllMessagesByChatId(messageRequestDTO.getPageNumber(),messageRequestDTO.getChatId());
    }

    @MessageMapping("/user/get-friends")
    public void getAllFriends(@RequestBody FriendDTO friendDTO){
        messageService.getFriendList(friendDTO);
    }

    @MessageMapping("/user/add-friend")
    public void sentFriendRequest(@RequestBody FriendDTO requestDto){
        messageService.sentFriendRequest(requestDto);
    }

    @MessageMapping("/user/accept-friend-request/{friendShipId}")
    public void acceptFriendRequest(@DestinationVariable int friendShipId){
        messageService.acceptFriendRequest(friendShipId);
    }

    @MessageMapping("/user/get-friend-request/{userId}")
    public void getFriendRequests(@DestinationVariable int userId){
        messageService.getFriendRequestList(userId);
    }

    @MessageMapping("/user/get-friendRequest-notification/{userId}")
    public void getPendingFriendRequestCount(@DestinationVariable int userId){
        messageService.getPendingRequestNotification(userId);
    }

}
