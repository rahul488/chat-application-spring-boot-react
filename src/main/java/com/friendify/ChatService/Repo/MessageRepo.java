package com.friendify.ChatService.Repo;

import com.friendify.ChatService.Entity.Chat;
import com.friendify.ChatService.Entity.Messages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepo extends JpaRepository<Messages,Integer> {

    @Query("SELECT m FROM Messages m where m.chat.id= :chatId ORDER BY m.createdAt ASC")
    public List<Messages> findByChatId(@Param("chatId") int chatId);

    @Query("SELECT m FROM Messages m where m.chat.id= :chatId ORDER BY m.createdAt DESC LIMIT 1")
    public Messages findLastChatMessages(@Param("chatId") int chatId);
}
