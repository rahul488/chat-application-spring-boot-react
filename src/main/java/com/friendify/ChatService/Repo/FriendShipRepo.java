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

    @Query("SELECT fp FROM FriendShip fp WHERE fp.user.id = :userId AND fp.accepted = true OR fp.friend.id = :userId AND fp.accepted = true")
    Page<FriendShip> getAllFriends(Pageable pageable, int userId);

    @Query("SELECT fp FROM FriendShip fp WHERE fp.friend.id = :userId AND fp.accepted = false")
    List<FriendShip> getAllFriendRequests(int userId);

    @Query("SELECT f " +
            "FROM FriendShip f " +
            "LEFT JOIN User u " +
            "ON (f.user.id = u.id OR f.friend.id = u.id) " +
            "AND f.accepted = true " +
            "WHERE u.name LIKE %:query% " +
            "AND u.id != :userId")
    Page<FriendShip> getFriendsBySearchQuery(Pageable pageable, int userId, String query);
}
/**
 *
 * SELECT * FROM friend_ship left join user on friend_ship.user_id = user.id OR friend_ship.friend_id = user.id
 * AND friend_ship.accepted = 1 AND user.name like '%ram%' where user.id != 1
 * **/