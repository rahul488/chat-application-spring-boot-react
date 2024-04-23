package com.friendify.ChatService.Entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Enumerated(EnumType.STRING)
    private NotificationStatus notificationType;

    @ManyToOne
    @JsonIgnore
    private User user;

    private int chatId;

    private int count;

    public Notification() {
    }

    public Notification(int id, NotificationStatus notificationType, User user, int chatId, int count) {
        this.id = id;
        this.notificationType = notificationType;
        this.user = user;
        this.chatId = chatId;
        this.count = count;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public NotificationStatus getNotificationType() {
        return notificationType;
    }

    public void setNotificationType(NotificationStatus notificationType) {
        this.notificationType = notificationType;
    }


    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public int getChatId() {
        return chatId;
    }

    public void setChatId(int chatId) {
        this.chatId = chatId;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }
}
