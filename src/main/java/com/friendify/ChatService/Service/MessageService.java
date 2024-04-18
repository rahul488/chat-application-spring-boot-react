package com.friendify.ChatService.Service;

import com.friendify.ChatService.Dto.*;
import com.friendify.ChatService.Entity.Chat;
import com.friendify.ChatService.Entity.FriendShip;
import com.friendify.ChatService.Entity.Messages;
import com.friendify.ChatService.Entity.User;
import com.friendify.ChatService.Exception.CommonException;
import com.friendify.ChatService.Exception.UserNotFoundException;
import com.friendify.ChatService.Repo.ChatRepo;
import com.friendify.ChatService.Repo.FriendShipRepo;
import com.friendify.ChatService.Repo.MessageRepo;
import com.friendify.ChatService.Repo.UserRepo;
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
        Messages messages = Messages.builder().message(message.getMessage()).chat(chat).senderId(message.getSenderId()).createdAt(new Date()).build();
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
        message.getRecipientId().stream().forEach((user) -> {
            messagingTemplate.convertAndSend("/topic/update-last-message/"+user,userResponse);
        });

    }

//    @Async("asyncTaskExecutor")
//    public void saveMessageOnDB(Messages message, int chatId){
//        User senderUser = userRepo.findById(message.getSenderId()).orElse(null);
//        Chat chat = chatRepo.findById(chatId).orElse(null);
//        if(senderUser == null ) throw new UserNotFoundException("User not found");
//        if(chat == null) throw new CommonException("Chat does not exist between/among the users");
//        //set chat on db
//        chat.getMessages().add(message);
//        chatRepo.save(chat);
//        getAllUsers(message.getSenderId());
//    }

    @Transactional
    public void getAllUsers(FriendDTO friendDTO){
       // getCurrentUserId();
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
        Chat chat =null;
        Chat isChatExist = chatRepo.findChatByUsers(conversion.getRecipientsId(),conversion.getRecipientsId().size());
        String groupName = users
                .stream()
                .filter((user) -> user.getId() != conversion.getSenderId())
                .map((user) -> user.getName())
                .collect(Collectors.joining(","))
                .toString();
        if(isChatExist != null) {
           /**
            *  NOTE-Group name will automatically save in db as this method is annotated
            *       with @Transactional we don't need to explicitly do save method.
            * **/
           isChatExist.setGroupName(groupName);
           chat=isChatExist;
        }
        else{
           chat = new Chat();
           chat.setUsers(users);
           chat.setGroupName(groupName);
           senderUser.getChats().add(chat);
           chatRepo.save(chat);
        }
        messagingTemplate.convertAndSend("/topic/start-chat/"+conversion.getSenderId(), chat);
    }

    public void getAllMessagesByChatId(int pageNumber,int chatId){
        /** Pagination :- By default last 10 message will go to client **/
        Pageable pageRequest=PageRequest.of(pageNumber,10);
        Page<Messages> messages = messageRepo.findByChatId(pageRequest,chatId);
        List<Messages> reversedMessages = new ArrayList<>(messages.getContent());
        Collections.reverse(reversedMessages);
        Page<Messages> reversedPage = new PageImpl<>(reversedMessages, pageRequest, messages.getTotalElements());
        messagingTemplate.convertAndSend("/topic/all-messages/"+chatId,reversedPage);
    }

    @Transactional
    public void sentFriendRequest(FriendDTO requestDto){
        User friend = userRepo.findById(requestDto.getFriendId()).orElse(null);
        User currUser = userRepo.findById(requestDto.getUserId()).orElse(null);
        if(friend == null || currUser == null){
            throw new UserNotFoundException("User not found");
        }
        FriendShip friendship = new FriendShip();
        friendship.setUser(currUser);
        friendship.setFriend(friend);
        friendship.setAccepted(false);
        friendShipRepo.save(friendship);

        //notify friend
        //messagingTemplate.convertAndSend("/topic/notification/"+requestDto.getFriendId(),currUser);

        FriendResponseDTO friendResponseDTO = new FriendResponseDTO();
        friendResponseDTO.setFriend(true);
        friendResponseDTO.setName(friend.getName());
        friendResponseDTO.setId(friend.getId());

       messagingTemplate.convertAndSend("/topic/request-status/"+currUser.getId(),friendResponseDTO);
    }

    public void acceptFriendRequest(int friendShipId){
        FriendShip friendExist = friendShipRepo.findById(friendShipId).orElse(null);
        if(friendExist == null) throw new CommonException("Friend doesn't exist");
        FriendShip friendship = friendShipRepo.findByUserAndFriend(friendExist.getUser(), friendExist.getFriend());
        if (friendship != null) {
            friendship.setAccepted(true);
            friendShipRepo.save(friendship);
        }
        FriendResponseDTO friendResponseDTO = new FriendResponseDTO();
        friendResponseDTO.setId(friendship.getId());
        friendResponseDTO.setName(friendship.getFriend().getName());
        friendResponseDTO.setFriend(true);
        messagingTemplate.convertAndSend("/topic/update-friend-request/"+friendShipId, friendResponseDTO);

    }

    public void getFriendList(FriendDTO friendDTO){
        User user = userRepo.findById(friendDTO.getUserId()).orElse(null);
        if(user == null) throw new UserNotFoundException("User not found");
        Pageable pageable = PageRequest.of(friendDTO.getPageNumber(),10);
        Page<FriendShip> friendShips = friendShipRepo.getAllFriends(pageable,friendDTO.getUserId());
        List<User> users = friendShips.getContent().stream().map((friendShip) -> friendShip.getFriend()).collect(Collectors.toList());
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
                if(chat == null) {
                    lastMessage = null;
                }else{
                    lastMessage = messageRepo.findLastChatMessages(chat.getId());
                }
                UserResponse userResponse = new UserResponse();
                userResponse.setLastMessage(lastMessage);
                userResponse.setId(user.getId());
                userResponse.setName(user.getName());
                userResponse.setChatId(chat.getId());
                userResponses.add(userResponse);
            }
        }
        return userResponses;
    }
}
