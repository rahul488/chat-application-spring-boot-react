package com.friendify.ChatService.Repo;

import com.friendify.ChatService.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepo extends JpaRepository<User,Integer> {

    public Optional<User> findByEmail(String email);
}
