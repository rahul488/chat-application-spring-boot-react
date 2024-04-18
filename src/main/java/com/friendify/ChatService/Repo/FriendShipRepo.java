package com.friendify.ChatService.Repo;

import com.friendify.ChatService.Entity.FriendShip;
import com.friendify.ChatService.Entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FriendShipRepo extends JpaRepository<FriendShip,Integer> {

    FriendShip findByUserAndFriend(User user, User friend);

    @Query("SELECT fp FROM FriendShip fp WHERE fp.user.id = :userId AND fp.accepted = true")
    Page<FriendShip> getAllFriends(Pageable pageable, int userId);

    @Query("SELECT fp FROM FriendShip fp WHERE fp.friend.id = :userId AND fp.accepted = false")
    List<FriendShip> getAllFriendRequests(int userId);
}
