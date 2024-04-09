package com.friendify.ChatService.Repo;

import com.friendify.ChatService.Entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChatRepo extends JpaRepository<Chat,Integer> {

    @Query("SELECT DISTINCT c FROM Chat c JOIN c.users u WHERE u.id IN (:users) GROUP BY c.id HAVING COUNT(DISTINCT u.id) = 2")
    public Chat findChatByUsers(List<Integer> users);


}
