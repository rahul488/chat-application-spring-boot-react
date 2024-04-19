package com.friendify.ChatService.Entity;


import jakarta.persistence.*;

@Entity
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Enumerated(EnumType.STRING)
    private NotificationStatus notificationType;

    @ManyToOne
    private User user;

    private boolean isActive;

    public Notification() {
    }

    public Notification(int id, NotificationStatus notificationType, boolean isActive, User user) {
        this.id = id;
        this.notificationType = notificationType;
        this.isActive = isActive;
        this.user = user;
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

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
