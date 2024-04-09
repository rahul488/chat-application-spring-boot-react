package com.friendify.ChatService.Repo;

import com.friendify.ChatService.Entity.Chat;
import com.friendify.ChatService.Entity.Messages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepo extends JpaRepository<Messages,Integer> {

    @Query(value = "SELECT * FROM (\n" +
            "SELECT * FROM messages m WHERE m.chat_id = :chatId ORDER BY m.created_at DESC LIMIT 10\n" +
            ") AS m_ordered\n" +
            "ORDER BY m_ordered.created_at ASC",nativeQuery = true)
    public List<Messages> findByChatId(@Param("chatId") int chatId);

    @Query("SELECT m FROM Messages m where m.chat.id= :chatId ORDER BY m.createdAt DESC LIMIT 1")
    public Messages findLastChatMessages(@Param("chatId") int chatId);
}
