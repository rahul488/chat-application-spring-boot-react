package com.friendify.ChatService.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Messages {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String message;

    private Integer senderId;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt=new Date();

    private String senderName;

    //Not require
    private boolean isRead=false;

    @ManyToOne
    @JsonIgnore
    private Chat chat;
}
