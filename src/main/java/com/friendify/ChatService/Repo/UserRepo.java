package com.friendify.ChatService.Repo;

import com.friendify.ChatService.Entity.Messages;
import com.friendify.ChatService.Entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepo extends JpaRepository<User,Integer> {

    public Optional<User> findByEmail(String email);
    @Query("SELECT u FROM User u WHERE u.id != :userId " +
            "AND NOT EXISTS (" +
            "   SELECT f FROM FriendShip f " +
            "   WHERE (f.user.id = :userId AND f.friend.id = u.id) " +
            "   OR (f.friend.id = :userId AND f.user.id = u.id)" +
            ")")
    public Page<User> getAllUsers(Pageable pageable, @Param("userId") int userId);

}
