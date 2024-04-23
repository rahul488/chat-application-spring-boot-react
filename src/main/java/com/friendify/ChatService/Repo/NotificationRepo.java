package com.friendify.ChatService.Repo;


import com.friendify.ChatService.Entity.Chat;
import com.friendify.ChatService.Entity.Notification;
import com.friendify.ChatService.Entity.NotificationStatus;
import com.friendify.ChatService.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NotificationRepo extends JpaRepository<Notification,Integer> {

    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.notificationType = :notificationType")
    Notification getFriendRequestNotifications(int userId, NotificationStatus notificationType);

    @Query("SELECT n FROM Notification n WHERE n.chatId = :chatId AND n.user.id = :userId AND n.notificationType = :notificationType")
    Notification findByChatAndUser(int chatId, int userId, NotificationStatus notificationType);
}
