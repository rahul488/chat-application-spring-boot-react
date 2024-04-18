package com.friendify.ChatService.Entity;

import jakarta.persistence.*;

@Entity
public class FriendShip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    private User user;

    @ManyToOne
    private User friend;

    private boolean accepted;

    public FriendShip() {
    }

    public FriendShip(int id, User user, User friend, boolean accepted) {
        this.id = id;
        this.user = user;
        this.friend = friend;
        this.accepted = accepted;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public User getFriend() {
        return friend;
    }

    public void setFriend(User friend) {
        this.friend = friend;
    }

    public boolean isAccepted() {
        return accepted;
    }

    public void setAccepted(boolean accepted) {
        this.accepted = accepted;
    }
}
