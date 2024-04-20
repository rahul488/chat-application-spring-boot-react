package com.friendify.ChatService.Repo;


import com.friendify.ChatService.Entity.Notification;
import com.friendify.ChatService.Entity.NotificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NotificationRepo extends JpaRepository<Notification,Integer> {

    @Query("SELECT n FROM Notification n WHERE n.user.id = :currUser AND n.notificationType = :notificationType AND n.isActive = true")
    List<Notification> getFriendRequestNotifications(int currUser, NotificationStatus notificationType);

    @Query("SELECT n FROM Notification n WHERE n.user.id =:currUser AND n.notificationType = :notificationType AND n.isActive = true")
    List<Notification> getAnyFriendRequestPendingNotifications(int currUser, NotificationStatus notificationType);
}
