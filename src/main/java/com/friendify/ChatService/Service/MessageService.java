package com.friendify.ChatService.Service;

import com.friendify.ChatService.Dto.*;
import com.friendify.ChatService.Entity.*;
import com.friendify.ChatService.Exception.CommonException;
import com.friendify.ChatService.Exception.UserNotFoundException;
import com.friendify.ChatService.Repo.*;
import com.friendify.ChatService.Util.UserCustomDetailService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MessageService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ChatRepo chatRepo;

    @Autowired
    private MessageRepo messageRepo;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private FriendShipRepo friendShipRepo;

    @Autowired
    private NotificationRepo notificationRepo;

    public Integer getCurrentUserId() {
        Integer userId = null;
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            if (authentication instanceof UsernamePasswordAuthenticationToken) {
                UsernamePasswordAuthenticationToken auth = (UsernamePasswordAuthenticationToken) authentication;
                UserCustomDetailService userCustomDetailService = (UserCustomDetailService) auth.getPrincipal();
                userId = userCustomDetailService.getUserId();
            } else {
                // Handle unexpected authentication type
                throw new CommonException("Unexpected authentication type");
            }
        } else {
            throw new CommonException("User is not authorised");
        }
        return userId;
    }

    @Transactional
    public void sendMessage(MessageRequestDTO message){
        User senderUser = userRepo.findById(message.getSenderId()).orElse(null);
        Chat chat = chatRepo.findById(message.getChatId()).orElse(null);
        if(senderUser == null ) throw new UserNotFoundException("User not found");
        if(chat == null) throw new CommonException("Chat does not exist between/among the users");
        MessageResponseDTO messageResponse = new MessageResponseDTO();
        messageResponse.setMessage(message.getMessage());
        messageResponse.setSender(senderUser);
        //set chat on db
        Messages messages = Messages.builder().message(message.getMessage()).chat(chat).senderId(message.getSenderId()).createdAt(new Date()).senderName(senderUser.getName()).build();
        chat.getMessages().add(messages);
        chatRepo.save(chat);
        messages.setChat(chat);
        messageRepo.save(messages);
        messagingTemplate.convertAndSend("/topic/receive/"+message.getChatId(), messages);
        //:- update last message in chats
        UserResponse userResponse = new UserResponse();
        userResponse.setLastMessage(messages);
        userResponse.setId(senderUser.getId());
        userResponse.setChatId(chat.getId());
        userResponse.setName(senderUser.getName());

        message.getRecipientId().stream().forEach((id) -> {

            if(id != senderUser.getId()){
                 Notification notification = notificationRepo.
                         findByChatAndUser(chat.getId(),senderUser.getId(),NotificationStatus.NEW_INCOMING_MESSAGE);
                 if(notification == null){
                     notification = new Notification();
                     notification.setCount(1);
                     notification.setChatId(chat.getId());
                     notification.setNotificationType(NotificationStatus.NEW_INCOMING_MESSAGE);
                     notification.setUser(senderUser);
                 }else{
                     notification.setCount(notification.getCount()+1);
                 }
                 notificationRepo.save(notification);
                 MessageNotificationResponse messageNotificationResponse = new MessageNotificationResponse();
                 messageNotificationResponse.setOwnerId(senderUser.getId());
                 messageNotificationResponse.setCount(notification.getCount());
                 userResponse.setNotificationResponse(messageNotificationResponse);
            }
            messagingTemplate.convertAndSend("/topic/update-last-message/"+id,userResponse);
        });
    }

    @Transactional
    public void getAllUsers(FriendDTO friendDTO){
        Pageable pageRequest = PageRequest.of(friendDTO.getPageNumber(),10);
        Page<User> users = userRepo.getAllUsers(pageRequest,friendDTO.getUserId());
        List<FriendResponseDTO> friendResponseDTOList = new ArrayList<>();
        users.getContent().forEach((friend) -> {
            FriendResponseDTO friendResponseDTO = new FriendResponseDTO();
            friendResponseDTO.setFriend(false);
            friendResponseDTO.setName(friend.getName());
            friendResponseDTO.setId(friend.getId());
            friendResponseDTOList.add(friendResponseDTO);
        });
        Page<FriendResponseDTO> pageImpl = new PageImpl<>(friendResponseDTOList,pageRequest,users.getTotalElements());

        messagingTemplate.convertAndSend("/topic/users/"+friendDTO.getUserId(),pageImpl);
    }

    @Transactional
    public void startConversion(Conversion conversion){
        User senderUser = userRepo.findById(conversion.getSenderId()).orElse(null);
        if(senderUser == null) throw new UserNotFoundException("user not found");
        Set<User> users = conversion.getRecipientsId()
                .stream().map((rec) -> userRepo.findById(rec).orElse(null))
                .collect(Collectors.toSet());
        Chat chat = chatRepo.findChatByUsers(conversion.getRecipientsId(),conversion.getRecipientsId().size());
        String groupName = users
                .stream()
                .filter((user) -> user.getId() != conversion.getSenderId())
                .map((user) -> user.getName())
                .collect(Collectors.joining(","))
                .toString();
        SelectedChatResponse chatResponse = new SelectedChatResponse();
        chatResponse.setId(chat.getId());
        chatResponse.setGroupName(groupName);
        chatResponse.setUsers(chat.getUsers());
        if(chat !=null){
            conversion.getRecipientsId().forEach((userId) -> {
                User user = userRepo.findById(userId).orElse(null);
                Notification notifications = notificationRepo.
                        findByChatAndUser(chat.getId(),user.getId(),
                                NotificationStatus.NEW_INCOMING_MESSAGE);
                if(notifications != null){
                    notificationRepo.delete(notifications);
                }
            });
        }
        messagingTemplate.convertAndSend("/topic/start-chat/"+conversion.getSenderId(), chatResponse);
    }

    public void updateNotification(int chatId, int userId){
        Notification notification = notificationRepo.findByChatAndUser(chatId,userId,NotificationStatus.NEW_INCOMING_MESSAGE);
        if(notification != null){
            notificationRepo.delete(notification);
        }
    }

    public void getAllMessagesByChatId(int pageNumber,int chatId, int senderId){
        /** Pagination :- By default last 10 message will go to client **/
        Pageable pageRequest=PageRequest.of(pageNumber,10);
        Page<Messages> messages = messageRepo.findByChatId(pageRequest,chatId);
        List<Messages> reversedMessages = new ArrayList<>(messages.getContent());
        Collections.reverse(reversedMessages);
        Page<Messages> reversedPage = new PageImpl<>(reversedMessages, pageRequest, messages.getTotalElements());
        messagingTemplate.convertAndSend("/topic/all-messages/"+chatId+"/"+senderId,reversedPage);
    }

    @Transactional
    public void sentFriendRequest(FriendDTO requestDto){
        User friend = userRepo.findById(requestDto.getFriendId()).orElse(null);
        User currUser = userRepo.findById(requestDto.getUserId()).orElse(null);
        if(friend == null || currUser == null){
            throw new UserNotFoundException("User not found");
        }
        FriendShip isAlreadyFriend = friendShipRepo.findByUserAndFriend(currUser, friend);
        if (isAlreadyFriend != null) {
           throw new CommonException("Friendship already exist");
        }
        FriendShip friendship = new FriendShip();
        friendship.setUser(currUser);
        friendship.setFriend(friend);
        friendship.setAccepted(false);
        friendShipRepo.save(friendship);

        FriendResponseDTO friendResponseDTO = new FriendResponseDTO();
        friendResponseDTO.setFriend(true);
        friendResponseDTO.setName(friend.getName());
        friendResponseDTO.setId(friend.getId());

        messagingTemplate.convertAndSend("/topic/request-status/"+currUser.getId(),friendResponseDTO);

        notifyFriend(NotificationStatus.NEW_FRIEND_REQUEST,friend);
        friendResponseDTO.setId(friendship.getId());
        updateRequestWithFriend(friendResponseDTO,currUser, friend);
    }



//    @Async("asyncTaskExecutor")
    public void updateRequestWithFriend(FriendResponseDTO friendResponseDTO, User currUser, User friend){
        friendResponseDTO.setName(currUser.getName());
        friendResponseDTO.setFriend(false);
        messagingTemplate.convertAndSend("/topic/update-last-friend-request/"+friend.getId(),friendResponseDTO);
    }
//    @Async("asyncTaskExecutor")
    public void notifyFriend(NotificationStatus notificationStatus, User friend){
        Notification notification = notificationRepo.
                getFriendRequestNotifications(friend.getId(),NotificationStatus.NEW_FRIEND_REQUEST);
        if(notification == null){
            notification = new Notification();
            notification.setNotificationType(notificationStatus);
            notification.setCount(1);
            notification.setUser(friend);
        }else{
            notification.setCount(notification.getCount()+1);
        }
        notificationRepo.save(notification);
        messagingTemplate.convertAndSend("/topic/notification/"+friend.getId(),notification.getCount());

    }

    public void getPendingRequestNotification(int userId){
        Notification notifications = notificationRepo
                .getFriendRequestNotifications(userId,NotificationStatus.NEW_FRIEND_REQUEST);
        messagingTemplate.convertAndSend("/topic/notification/"+userId,notifications != null ? notifications.getCount() : 0);
    }

    @Transactional
    public void acceptFriendRequest(int friendShipId){
        FriendShip friendExist = friendShipRepo.findById(friendShipId).orElse(null);
        if(friendExist == null) throw new CommonException("Friend doesn't exist");
        FriendShip friendship = friendShipRepo.findByUserAndFriend(friendExist.getUser(), friendExist.getFriend());
        if (friendship != null && friendship.isAccepted() == false) {
            friendship.setAccepted(true);
            friendShipRepo.save(friendship);
        }
        FriendResponseDTO friendResponseDTO = new FriendResponseDTO();
        friendResponseDTO.setId(friendship.getId());
        friendResponseDTO.setName(friendship.getUser().getName());
        friendResponseDTO.setFriend(true);

        //create chatId
        Chat chat = new Chat();
        chat.setUsers(Arrays.asList(friendship.getUser(),friendship.getFriend()).stream().collect(Collectors.toSet()));
        friendship.getUser().getChats().add(chat);
        friendship.getFriend().getChats().add(chat);
        chatRepo.save(chat);
        messagingTemplate.convertAndSend("/topic/update-friend-request/"+friendShipId, friendResponseDTO);
        //notify user with updated request notification
        Notification notification = notificationRepo.
                getFriendRequestNotifications(friendExist.getFriend().getId(),
                        NotificationStatus.NEW_FRIEND_REQUEST);
        notification.setCount(notification.getCount()-1);
        notificationRepo.save(notification);
        getPendingRequestNotification(friendExist.getFriend().getId());
    }

    public void getFriendList(FriendDTO friendDTO){
        User user = userRepo.findById(friendDTO.getUserId()).orElse(null);
        if(user == null) throw new UserNotFoundException("User not found");
        Pageable pageable = PageRequest.of(friendDTO.getPageNumber(),50);
        Page<FriendShip> friendShips = null;

        if(friendDTO.getQuery() == null){
            friendShips = friendShipRepo.getAllFriends(pageable,friendDTO.getUserId());
        }
        else{
            friendShips = friendShipRepo.getFriendsBySearchQuery(pageable,friendDTO.getUserId(),friendDTO.getQuery());
        }
        List<User> users = new ArrayList<>();
        friendShips.getContent().stream().forEach((friendShip) -> {
            if(friendShip.getFriend().getId() != friendDTO.getUserId()){
                users.add(friendShip.getFriend());
            }else{
                users.add(friendShip.getUser());
            }
        });
        List<UserResponse> userResponses = getFriendListWithLastMessage(users,user.getId());
        Page<UserResponse> pageResponse = new PageImpl<>(userResponses,pageable,friendShips.getTotalElements());
        messagingTemplate.convertAndSend("/topic/get-friend-list/"+friendDTO.getUserId(), pageResponse);
    }

    public void getFriendRequestList(int userId){
        User user = userRepo.findById(userId).orElse(null);
        if(user == null) throw new UserNotFoundException("User not found");

        List<FriendShip> friendRequests = friendShipRepo.getAllFriendRequests(userId);

        List<FriendResponseDTO> friendResponseDTOList = new ArrayList<>();

        friendRequests.forEach((friend) -> {
            FriendResponseDTO friendResponseDTO = new FriendResponseDTO();
            friendResponseDTO.setId(friend.getId());
            friendResponseDTO.setName(friend.getUser().getName());
            friendResponseDTO.setFriend(false);
            friendResponseDTOList.add(friendResponseDTO);
        });

        messagingTemplate.convertAndSend("/topic/get-friend-request-list/"+userId, friendResponseDTOList);
    }

    public List<UserResponse> getFriendListWithLastMessage(List<User> users, int userId){
        List<UserResponse> userResponses = new ArrayList<>();
        for(User user:users) {
            if (user.getId() != userId) {
                Chat chat = chatRepo.findChatByUsers(Arrays.asList(userId, user.getId()),2);
                Messages lastMessage;
                UserResponse userResponse = new UserResponse();
                if(chat == null) {
                    lastMessage = null;
                    userResponse.setChatId(null);
                }else{
                    lastMessage = messageRepo.findLastChatMessages(chat.getId());
                    userResponse.setChatId(chat.getId());
                }
                Notification notifications = notificationRepo.findByChatAndUser(chat.getId(),user.getId(), NotificationStatus.NEW_INCOMING_MESSAGE);
                userResponse.setLastMessage(lastMessage);
                userResponse.setId(user.getId());
                userResponse.setName(user.getName());
                MessageNotificationResponse messageNotificationResponse = new MessageNotificationResponse();
                userResponse.setNotificationResponse(messageNotificationResponse);
                if(notifications != null){
                    messageNotificationResponse.setOwnerId(notifications.getUser().getId());
                    messageNotificationResponse.setCount(notifications.getCount());
                    userResponse.setNotificationResponse(messageNotificationResponse);
                }else{
                    userResponse.setNotificationResponse(null);
                }
                userResponses.add(userResponse);
            }
        }
        return userResponses;
    }

}
