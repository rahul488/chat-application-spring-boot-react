package com.friendify.ChatService.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

import java.util.*;

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

    private String email;

    private String password;

    private String role="ROLE_USER";

    @Temporal(TemporalType.TIMESTAMP)
    private Date createAt = new Date();

    @ManyToMany(mappedBy = "users")
    @Cascade(CascadeType.ALL)
    @JsonIgnore
    private Set<Chat> chats = new HashSet<>();

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private Set<FriendShip> initiatedFriendships = new HashSet<>();

    @OneToMany(mappedBy = "friend")
    @JsonIgnore
    private Set<FriendShip> receivedFriendships = new HashSet<>();

    @OneToMany(mappedBy = "user")
    @Cascade(CascadeType.ALL)
    private List<Notification> notifications;

    public User() {

    }


    public User(int id, String name, String email,
                String password, String role, Date createAt,
                Set<Chat> chats, Set<FriendShip> initiatedFriendships,
                Set<FriendShip> receivedFriendships, List<Notification> notifications) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.createAt = createAt;
        this.chats = chats;
        this.initiatedFriendships = initiatedFriendships;
        this.receivedFriendships = receivedFriendships;
        this.notifications = notifications;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Date getCreateAt() {
        return createAt;
    }

    public void setCreateAt(Date createAt) {
        this.createAt = createAt;
    }

    public Set<Chat> getChats() {
        return chats;
    }

    public void setChats(Set<Chat> chats) {
        this.chats = chats;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }


    public Set<FriendShip> getInitiatedFriendships() {
        return initiatedFriendships;
    }

    public void setInitiatedFriendships(Set<FriendShip> initiatedFriendships) {
        this.initiatedFriendships = initiatedFriendships;
    }

    public Set<FriendShip> getReceivedFriendships() {
        return receivedFriendships;
    }

    public void setReceivedFriendships(Set<FriendShip> receivedFriendships) {
        this.receivedFriendships = receivedFriendships;
    }

    public List<Notification> getNotifications() {
        return notifications;
    }

    public void setNotifications(List<Notification> notifications) {
        this.notifications = notifications;
    }
}
