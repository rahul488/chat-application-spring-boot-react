package com.friendify.ChatService.Entity;

import jakarta.persistence.*;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToMany
    @JoinTable(name="chat_table",
            joinColumns = @JoinColumn(name = "chat_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    @Cascade({CascadeType.PERSIST,CascadeType.MERGE})
    private Set<User> users = new HashSet<>();

    @OneToMany(mappedBy = "chat")
//    @Cascade( CascadeType.ALL)
    private List<Messages> messages=new ArrayList<>();

    public Chat() {
    }

    public Chat(int id, Set<User> users, List<Messages> messages) {
        this.id = id;
        this.users = users;
        this.messages = messages;
    }

    public int getId() {
        return id;
    }
    public String groupName;

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public Set<User> getUsers() {
        return users;
    }

    public List<Messages> getMessages() {
        return messages;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    public void setMessages(List<Messages> messages) {
        this.messages = messages;
    }
}
